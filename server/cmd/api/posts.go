package main

import (
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/ritchie-gr8/my-blog-app/store"
)

type CreatePostPayload struct {
	Title        string `json:"title"`
	Introduction string `json:"introduction"`
	Content      string `json:"content"`
	Category     string `json:"category"`
}

func (app *application) createPostHandler(w http.ResponseWriter, r *http.Request) {
	var payload CreatePostPayload
	if err := readJSON(w, r, &payload); err != nil {
		log.Print("test 1")
		writeJSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	userId := 2

	post := &store.Post{
		Title:        payload.Title,
		Introduction: payload.Introduction,
		Content:      payload.Content,
		Category:     payload.Category,
		UserID:       int64(userId),
	}

	ctx := r.Context()

	if err := app.store.Posts.Create(ctx, post); err != nil {
		log.Print("test 3")
		writeJSONError(w, http.StatusInternalServerError, err.Error())
		return
	}

	if err := writeJSON(w, http.StatusCreated, post); err != nil {
		log.Print("test 4")
		writeJSONError(w, http.StatusInternalServerError, err.Error())
		return
	}
}

func (app *application) getPostHandler(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "postID")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		writeJSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	ctx := r.Context()

	post, err := app.store.Posts.GetByID(ctx, id)
	if err != nil {
		switch {
		case errors.Is(err, store.ErrNotFound):
			writeJSONError(w, http.StatusNotFound, err.Error())
		default:
			writeJSONError(w, http.StatusInternalServerError, err.Error())
		}

		return
	}

	if err := writeJSON(w, http.StatusOK, post); err != nil {
		writeJSONError(w, http.StatusInternalServerError, err.Error())
		return
	}
}
