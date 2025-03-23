package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/ritchie-gr8/my-blog-app/internal/store"
	"github.com/ritchie-gr8/my-blog-app/internal/store/cache"
)

func (app *application) BasicAuthMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				app.unauthorizeBasicResponse(w, r, fmt.Errorf("authorization header is missing"))
				return
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Basic" {
				app.unauthorizeBasicResponse(w, r, fmt.Errorf("authorization header is not valid"))
				return
			}

			decoded, err := base64.StdEncoding.DecodeString(parts[1])
			if err != nil {
				app.unauthorizeBasicResponse(w, r, err)
				return
			}

			username := app.config.auth.basic.user
			pass := app.config.auth.basic.pass

			creds := strings.SplitN(string(decoded), ":", 2)
			if len(creds) != 2 || creds[0] != username || creds[1] != pass {
				app.unauthorizeBasicResponse(w, r, fmt.Errorf("invalid credentials"))
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func (app *application) AuthTokenMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			app.unauthorizeResponse(w, r, fmt.Errorf("authorization header is missing"))
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			app.unauthorizeResponse(w, r, fmt.Errorf("authorization header is not valid"))
			return
		}

		token := parts[1]

		jwtToken, err := app.authenticator.ValidateToken(token)
		if err != nil {
			app.unauthorizeResponse(w, r, err)
			return
		}

		claims := jwtToken.Claims.(jwt.MapClaims)
		sub, ok := claims["sub"].(float64)
		if !ok {
			app.unauthorizeResponse(w, r, fmt.Errorf("invalid user ID format"))
			return
		}
		userID := int64(sub)

		ctx := r.Context()

		user, err := app.getUser(ctx, userID)
		if err != nil {
			app.unauthorizeResponse(w, r, err)
			return
		}

		ctx = context.WithValue(ctx, userCtx, user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (app *application) checkPostOwnership(requiredRole string, next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := getUserFromCtx(r)
		post := getPostFromCtx(r)

		if post.UserID == user.ID {
			next.ServeHTTP(w, r)
			return
		}

		allowed, err := app.checkRolePrecedence(user, requiredRole)
		if err != nil {
			app.internalServerError(w, r, err)
			return
		}

		if !allowed {
			app.forbiddenResponse(w, r)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (app *application) checkRolePrecedence(user *store.User, requiredRole string) (bool, error) {
	roleHierarchy := map[string]int{
		"user":      1,
		"moderator": 2,
		"admin":     3,
	}

	userRoleLevel, userExists := roleHierarchy[user.Role]
	requiredRoleLevel, requiredExists := roleHierarchy[requiredRole]

	if !userExists {
		return false, fmt.Errorf("invalid user role: %s", user.Role)
	}
	if !requiredExists {
		return false, fmt.Errorf("invalid required role: %s", requiredRole)
	}

	return userRoleLevel >= requiredRoleLevel, nil
}

func (app *application) getUser(ctx context.Context, userID int64) (*store.User, error) {
	user, err := app.cacheStore.Users.Get(ctx, userID)
	if err != nil && err != cache.ErrRedisNotInit {
		return nil, err
	}

	if user != nil {
		app.logger.Infow("cache hit", "key", "user", "id", userID)
		return user, nil
	}

	app.logger.Infow("fetching user from DB", "id", userID)
	user, err = app.store.Users.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	if err := app.cacheStore.Users.Set(ctx, user); err != nil && err != cache.ErrRedisNotInit {
		return nil, err
	}

	return user, nil
}
