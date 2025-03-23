package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/ritchie-gr8/my-blog-app/internal/store"
	"github.com/ritchie-gr8/my-blog-app/internal/store/cache"
)

type userKey string

const userCtx userKey = "user"

type UpdateUserPayload struct {
	Name           *string `json:"name" validate:"omitempty,max=72"`
	Username       *string `json:"username" validate:"omitempty,max=72"`
	Email          *string `json:"email" validate:"omitempty,email,max=120"`
	Bio            *string `json:"bio" validate:"omitempty,max=120"`
	ProfilePicture *[]byte `json:"profile_picture" validate:"omitempty"`
}

//	@Summary		Fetch a user profile
//	@Description	Fetch a user profile by ID
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			id	path		int	true	"User ID"
//	@Success		200	{object}	store.User
//	@Failure		400	{object}	error
//	@Failure		404	{object}	error
//	@Failure		500	{object}	error
//	@Security		ApiKeyAuth
//	@Router			/users/{id} [get]
func (app *application) getUserHandler(w http.ResponseWriter, r *http.Request) {
	userID, err := strconv.ParseInt(chi.URLParam(r, "userID"), 10, 64)
	if err != nil || userID < 1 {
		app.badRequestResponse(w, r, err)
		return
	}

	user, err := app.getUser(r.Context(), userID)
	if err != nil {
		switch err {
		case store.ErrNotFound:
			app.notFoundResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	if err := app.jsonResponse(w, http.StatusOK, user); err != nil {
		app.internalServerError(w, r, err)
	}
}

//	@Summary		Update an existing user
//	@Description	Update the details of an existing user (partial update)
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			userID			path		int64		true	"User ID"
//	@Param			name			body		string		false	"Name"								maxLength(72)
//	@Param			username		body		string		false	"Username"							maxLength(72)
//	@Param			email			body		string		false	"Email"								maxLength(120)	format(email)
//	@Param			bio				body		string		false	"Bio"								maxLength(120)
//	@Param			profile_picture	body		string		false	"Profile Picture (base64 encoded)"	maxLength(1000000)
//	@Success		200				{object}	store.User	"Successfully updated user"
//	@Failure		400				{object}	error		"Invalid request, the request data was incorrect or malformed"
//	@Failure		404				{object}	error		"User not found"
//	@Failure		500				{object}	error		"Internal server error, the server encountered a problem"
//	@Security		ApiKeyAuth
//	@Router			/users/{userID} [patch]
func (app *application) updateUserHandler(w http.ResponseWriter, r *http.Request) {
	userID, err := strconv.ParseInt(chi.URLParam(r, "userID"), 10, 64)
	if err != nil || userID < 1 {
		app.badRequestResponse(w, r, err)
		return
	}

	user, err := app.getUser(r.Context(), userID)
	if err != nil {
		switch {
		case errors.Is(err, store.ErrNotFound):
			app.notFoundResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	var payload UpdateUserPayload
	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if payload.Username != nil {
		user.Username = *payload.Username
	}

	if payload.Name != nil {
		user.Name = *payload.Name
	}

	if payload.Bio != nil {
		user.Bio = *payload.Bio
	}

	if payload.Email != nil {
		user.Email = *payload.Email
	}

	if payload.ProfilePicture != nil {
		user.ProfilePicture = *payload.ProfilePicture
	}

	rowsAffected, err := app.store.Users.Update(r.Context(), user)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if rowsAffected == 0 {
		app.notFoundResponse(w, r, fmt.Errorf("user not found or no changes made"))
		return
	}

	err = app.cacheStore.Users.Delete(r.Context(), user.ID)
	if err != nil && err != cache.ErrRedisNotInit {
		app.logger.Warnw("error deleting cache data", "error", err, "userID", user.ID)
	}

	if err := app.jsonResponse(w, http.StatusOK, user); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}

//	@Summary		Activate/Register a user
//	@Description	Activate/Register a user by invitation token
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			token	path		string	true	"Invitation token"
//	@Success		204		{string}	string	"User activated"
//	@Failure		404		{object}	error
//	@Failure		500		{object}	error
//	@Security		ApiKeyAuth
//	@Router			/users/activate/{token} [put]
func (app *application) activeUserHandler(w http.ResponseWriter, r *http.Request) {
	token := chi.URLParam(r, "token")

	err := app.store.Users.Activate(r.Context(), token)
	if err != nil {
		switch err {
		case store.ErrNotFound:
			app.notFoundResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	if err := app.jsonResponse(w, http.StatusNoContent, ""); err != nil {
		app.internalServerError(w, r, err)
	}
}

func (app *application) userContextMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		idParam := chi.URLParam(r, "userID")
		id, err := strconv.ParseInt(idParam, 10, 64)
		if err != nil {
			app.internalServerError(w, r, err)
			return
		}

		ctx := r.Context()

		user, err := app.store.Users.GetByID(ctx, id)
		if err != nil {
			switch err {
			case store.ErrNotFound:
				app.notFoundResponse(w, r, err)
			default:
				app.internalServerError(w, r, err)
			}

			return
		}

		ctx = context.WithValue(ctx, userCtx, user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func getUserFromCtx(r *http.Request) *store.User {
	user, _ := r.Context().Value(userCtx).(*store.User)
	return user
}
