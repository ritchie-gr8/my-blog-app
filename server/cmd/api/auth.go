package main

import (
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/ritchie-gr8/my-blog-app/internal/store"
)

type RegisterUserPayload struct {
	Username string `json:"username" validate:"required,max=100"`
	Name     string `json:"name" validate:"required,max=100"`
	Email    string `json:"email" validate:"required,email,max=255"`
	Password string `json:"password" validate:"required,min=3,max=72"`
}

type UserWithToken struct {
	*store.User
	Token string `json:"token"`
}

type CreateUserTokenPayload struct {
	Email    string `json:"email" validate:"required,email,max=255"`
	Password string `json:"password" validate:"required,min=3,max=72"`
}

// @Summary		Register a user
// @Description	Register a user
// @Tags			authentication
// @Accept			json
// @Produce		json
// @Param			payload	body		RegisterUserPayload	true	"User credentials"
// @Success		201		{object}	UserWithToken		"User registered"
// @Failure		400		{object}	error
// @Failure		500		{object}	error
// @Router			/authentication/user [post]
func (app *application) registerUserHandler(w http.ResponseWriter, r *http.Request) {
	var payload RegisterUserPayload
	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := &store.User{
		Username: payload.Username,
		Email:    payload.Email,
		Name:     payload.Name,
	}

	if err := user.Password.Set(payload.Password); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	ctx := r.Context()

	plainToken, hashToken := app.service.Tokens.GenerateActivationToken()

	err := app.service.Users.CreateUserWithInvitation(ctx, user, hashToken, app.config.mail.exp)
	if err != nil {
		switch err {
		case store.ErrDuplicateEmail:
			app.badRequestResponse(w, r, err)
		case store.ErrDuplicateUsername:
			app.badRequestResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	claims := jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(app.config.auth.token.exp).Unix(),
		"iat": time.Now().Unix(),
		"nbf": time.Now().Unix(),
		"iss": app.config.auth.token.issue,
		"aud": app.config.auth.token.issue,
	}
	jwtToken, err := app.authenticator.GenerateToken(claims)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	userWithToken := UserWithToken{
		User:  user,
		Token: jwtToken,
	}

	activationURL := app.service.Emails.GenerateActivationURL(plainToken)
	app.logger.Info(activationURL)

	status, err := app.service.Emails.SendWelcomeEmail(user, activationURL)
	if err != nil {
		app.logger.Errorw("error sending welcome email", "error", err)

		if err := app.store.Users.Delete(ctx, user.ID); err != nil {
			app.logger.Errorw("error delteing user", "error", err)
		}

		app.internalServerError(w, r, err)
		return
	}
	app.logger.Infow("Email sent", "status code", status)

	if err := app.jsonResponse(w, http.StatusCreated, userWithToken); err != nil {
		app.internalServerError(w, r, err)
	}
}

// @Summary		Create a token
// @Description	Create a token
// @Tags			authentication
// @Accept			json
// @Produce		json
// @Param			payload	body		CreateUserTokenPayload	true	"User credentials"
// @Success		201		{object}	UserWithToken			"User and token"
// @Failure		400		{object}	error
// @Failure		401		{object}	error
// @Failure		500		{object}	error
// @Router			/authentication/token [post]
func (app *application) createTokenHandler(w http.ResponseWriter, r *http.Request) {
	var payload CreateUserTokenPayload
	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user, err := app.service.Users.GetByEmail(r.Context(), payload.Email)
	if err != nil {
		switch err {
		case store.ErrNotFound:
			app.unauthorizeResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	if err := user.Password.Compare(payload.Password); err != nil {
		app.unauthorizeResponse(w, r, err)
		return
	}

	claims := jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(app.config.auth.token.exp).Unix(),
		"iat": time.Now().Unix(),
		"nbf": time.Now().Unix(),
		"iss": app.config.auth.token.issue,
		"aud": app.config.auth.token.issue,
	}
	token, err := app.authenticator.GenerateToken(claims)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	userWithToken := UserWithToken{
		User:  user,
		Token: token,
	}

	app.logger.Infow("User logged in", "user", userWithToken.User)

	if err := app.jsonResponse(w, http.StatusCreated, userWithToken); err != nil {
		app.internalServerError(w, r, err)
	}
}
