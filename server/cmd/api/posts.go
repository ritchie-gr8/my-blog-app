package main

import (
	"context"
	"errors"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/ritchie-gr8/my-blog-app/internal/store"
)

type postKey string

const postCtx postKey = "post"

type CreatePostPayload struct {
	Title        string `json:"title" validate:"required,max=100"`
	Introduction string `json:"introduction" validate:"required,max=120"`
	Content      string `json:"content" validate:"required,max=1000"`
	CategoryID   int64  `json:"category_id" validate:"required"`
}

type UpdatePostPayload struct {
	Title          *string `json:"title" validate:"omitempty,max=100"`
	Introduction   *string `json:"introduction" validate:"omitempty,max=120"`
	Content        *string `json:"content" validate:"omitempty,max=1000"`
	CategoryID     *int64  `json:"category_id" validate:"omitempty"`
	ThumbnailImage *[]byte `json:"thumbnail_image" validate:"omitempty"`
}

type CreateCommentPayload struct {
	PostID  int64  `json:"post_id" validate:"required"`
	UserID  int64  `json:"user_id" validate:"required"`
	Content string `json:"content" validate:"required,max=300"`
}

// @Summary		Create a post
// @Description	Creates a new post with the provided details
// @Tags			posts
// @Accept			json
// @Produce		json
// @Param			title			body		string		true	"Post Title"		maxLength(100)
// @Param			introduction	body		string		true	"Post Introduction"	maxLength(120)
// @Param			content			body		string		true	"Post Content"		maxLength(1000)
// @Param			category_id		body		int64		true	"Post Category ID"
// @Param			thumbnail_image	body		string		false	"Thumbnail Image"
// @Success		201				{object}	store.Post	"Successfully created post"
// @Failure		400				{object}	error		"Invalid request, the request data was incorrect or malformed"
// @Failure		500				{object}	error		"Internal server error, the server encountered a problem"
// @Security		ApiKeyAuth
// @Router			/posts [post]
func (app *application) createPostHandler(w http.ResponseWriter, r *http.Request) {
	var payload CreatePostPayload
	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := getUserFromCtx(r)

	post := &store.Post{
		Title:        payload.Title,
		Introduction: payload.Introduction,
		Content:      payload.Content,
		CategoryID:   payload.CategoryID,
		UserID:       user.ID,
	}

	ctx := r.Context()

	if err := app.service.Posts.Create(ctx, post); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err := app.jsonResponse(w, http.StatusCreated, post); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}

// @Summary		Get a post
// @Description	Retrieve a post along with its comments
// @Tags			posts
// @Accept			json
// @Produce		json
// @Param			postID	path		int			true	"Post ID"
// @Success		200		{object}	store.Post	"Successfully fetched post"
// @Failure		400		{object}	error		"Invalid request, the request data was incorrect or malformed"
// @Failure		404		{object}	error		"Post not found"
// @Failure		500		{object}	error		"Internal server error, the server encountered a problem"
// @Security		ApiKeyAuth
// @Router			/posts/{postID} [get]
func (app *application) getPostHandler(w http.ResponseWriter, r *http.Request) {
	post := getPostFromCtx(r)

	var userID int64 = 0
	user := getUserFromCtx(r)
	if user != nil {
		userID = user.ID
	}

	post, err := app.service.Posts.Get(r.Context(), post.ID, userID)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	comments, err := app.service.Comments.GetByPostID(r.Context(), post.ID)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	post.Comments = comments

	if err := app.jsonResponse(w, http.StatusOK, post); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}

// @Summary		Delete a post
// @Description	Delete a post by its ID
// @Tags			posts
// @Accept			json
// @Produce		json
// @Param			postID	path			int	true	"Post ID"
// @Success		204		"No Content"	"Successfully deleted post, no content returned"
// @Failure		400		{object}		error	"Invalid request, the request data was incorrect or malformed"
// @Failure		404		{object}		error	"Post not found"
// @Failure		500		{object}		error	"Internal server error, the server encountered a problem"
// @Security		ApiKeyAuth
// @Router			/posts/{postID} [delete]
func (app *application) deletePostHandler(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "postID")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	ctx := r.Context()

	if err := app.service.Posts.Delete(ctx, id); err != nil {
		switch {
		case errors.Is(err, store.ErrNotFound):
			app.notFoundResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// @Summary		Update a post
// @Description	Update an existing post with new details
// @Tags			posts
// @Accept			json
// @Produce		json
// @Param			postID			path		int			true	"Post ID"
// @Param			title			body		string		false	"Post Title"		maxLength(100)
// @Param			introduction	body		string		false	"Post Introduction"	maxLength(120)
// @Param			content			body		string		false	"Post Content"		maxLength(1000)
// @Param			category_id		body		int64		false	"Post Category ID"
// @Param			thumbnail_image	body		string		false	"Thumbnail Image"
// @Success		200				{object}	store.Post	"Successfully updated post"
// @Failure		400				{object}	error		"Invalid request, the request data was incorrect or malformed"
// @Failure		404				{object}	error		"Post not found"
// @Failure		409				{object}	error		"Conflict: The request could not be completed due to a conflict"
// @Failure		500				{object}	error		"Internal server error, the server encountered a problem"
// @Security		ApiKeyAuth
// @Router			/posts/{postID} [patch]
func (app *application) updatePostHandler(w http.ResponseWriter, r *http.Request) {
	post := getPostFromCtx(r)

	var payload UpdatePostPayload
	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if payload.Title != nil {
		post.Title = *payload.Title
	}

	if payload.Introduction != nil {
		post.Introduction = *payload.Introduction
	}

	if payload.Content != nil {
		post.Content = *payload.Content
	}

	if payload.CategoryID != nil {
		post.CategoryID = *payload.CategoryID
	}

	if payload.ThumbnailImage != nil {
		post.ThumbnailImage = *payload.ThumbnailImage
	}

	if err := app.service.Posts.Update(r.Context(), post); err != nil {
		switch {
		case errors.Is(err, store.ErrNotFound):
			app.conflictResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	if err := app.jsonResponse(w, http.StatusOK, post); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}

func (app *application) postsContextMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		idParam := chi.URLParam(r, "postID")
		id, err := strconv.ParseInt(idParam, 10, 64)
		if err != nil {
			app.internalServerError(w, r, err)
			return
		}

		ctx := r.Context()

		post, err := app.service.Posts.Get(ctx, id, 0)
		if err != nil {
			switch err {
			case store.ErrNotFound:
				app.notFoundResponse(w, r, err)
			default:
				app.internalServerError(w, r, err)
			}

			return
		}

		ctx = context.WithValue(ctx, postCtx, post)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func getPostFromCtx(r *http.Request) *store.Post {
	post, _ := r.Context().Value(postCtx).(*store.Post)
	return post
}

// @Summary		Create a new comment
// @Description	Create a new comment on a post with the provided details
// @Tags			comments
// @Accept			json
// @Produce		json
// @Param			postID	path		int64			true	"Post ID"
// @Param			user_id	body		int64			true	"User ID"
// @Param			content	body		string			true	"Comment Content"	maxLength(300)
// @Success		201		{object}	store.Comment	"Successfully created comment"
// @Failure		400		{object}	error			"Invalid request, the request data was incorrect or malformed"
// @Failure		500		{object}	error			"Internal server error, the server encountered a problem"
// @Security		ApiKeyAuth
// @Router			/comments [post]
func (app *application) createCommentHandler(w http.ResponseWriter, r *http.Request) {
	post := getPostFromCtx(r)

	var payload CreateCommentPayload
	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	comment := &store.Comment{
		PostID:  post.ID,
		UserID:  payload.UserID,
		Content: payload.Content,
	}

	ctx := r.Context()

	if err := app.service.Comments.Create(ctx, comment); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err := app.jsonResponse(w, http.StatusCreated, comment); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}
