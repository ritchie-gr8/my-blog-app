package main

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/ritchie-gr8/my-blog-app/internal/store"
)

// @Summary		Like a post
// @Description	Add a like to a post for the current user
// @Tags			likes
// @Accept			json
// @Produce		json
// @Param			postID	path		int		true	"Post ID"
// @Success		201		{string}	string	"Like added successfully"
// @Success		200		{string}	string	"Post already liked by user"
// @Failure		400		{object}	error	"Invalid request"
// @Failure		404		{object}	error	"Post not found"
// @Failure		500		{object}	error	"Internal server error"
// @Security		ApiKeyAuth
// @Router			/posts/{postID}/like [post]
func (app *application) likePostHandler(w http.ResponseWriter, r *http.Request) {
	postID, err := strconv.ParseInt(chi.URLParam(r, "postID"), 10, 64)
	if err != nil || postID < 1 {
		app.badRequestResponse(w, r, err)
		return
	}

	user := getUserFromCtx(r)
	if user == nil {
		app.unauthorizeResponse(w, r, fmt.Errorf("user not found"))
		return
	}

	post, err := app.service.Posts.Get(r.Context(), postID, user.ID)
	if err != nil {
		switch {
		case errors.Is(err, store.ErrNotFound):
			app.notFoundResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	liked, err := app.service.PostLikes.HasUserLiked(r.Context(), postID, user.ID)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if liked {
		w.WriteHeader(http.StatusOK)
		return
	}

	if err := app.service.PostLikes.LikePost(r.Context(), postID, user.ID); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	// Create notification
	if post.UserID != user.ID {
		if err := app.service.Notifications.CreateLikeNotification(r.Context(), postID, user.ID); err != nil {
			app.logger.Warnw("failed to create notification", "error", err)
		} else {
			notification := &store.Notification{
				UserID:    post.UserID,
				Type:      "like",
				RelatedID: postID,
				ActorID:   user.ID,
				Message:   fmt.Sprintf("%s liked your post", user.Name),
				Actor: &store.User{
					ID:             user.ID,
					Name:           user.Name,
					Username:       user.Username,
					ProfilePicture: user.ProfilePicture,
				},
			}
			app.logger.Infof("sending notification to user %d", post.UserID)
			app.logger.Infof("notification: %+v", notification)
			app.sseManager.SendToUser(post.UserID, notification)
		}
	}
	w.WriteHeader(http.StatusCreated)
}

// @Summary		Unlike a post
// @Description	Remove a like from a post for the current user
// @Tags			likes
// @Accept			json
// @Produce		json
// @Param			postID	path		int		true	"Post ID"
// @Success		204		{string}	string	"Like removed successfully"
// @Failure		400		{object}	error	"Invalid request"
// @Failure		404		{object}	error	"Post not found or like not found"
// @Failure		500		{object}	error	"Internal server error"
// @Security		ApiKeyAuth
// @Router			/posts/{postID}/like [delete]
func (app *application) unlikePostHandler(w http.ResponseWriter, r *http.Request) {
	postID, err := strconv.ParseInt(chi.URLParam(r, "postID"), 10, 64)
	if err != nil || postID < 1 {
		app.badRequestResponse(w, r, err)
		return
	}

	user := getUserFromCtx(r)
	if user == nil {
		app.unauthorizeResponse(w, r, fmt.Errorf("user not found"))
		return
	}

	// Check if post exists
	_, err = app.service.Posts.Get(r.Context(), postID, user.ID)
	if err != nil {
		switch {
		case errors.Is(err, store.ErrNotFound):
			app.notFoundResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	err = app.service.PostLikes.UnlikePost(r.Context(), postID, user.ID)
	if err != nil {
		switch {
		case errors.Is(err, store.ErrNotFound):
			w.WriteHeader(http.StatusNoContent)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
