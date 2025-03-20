package main

import "net/http"

func (app *application) getFeedHandler(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()

	feed, err := app.store.Posts.GetFeed(ctx)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err := app.jsonResponse(w, http.StatusOK, feed); err != nil {
		app.internalServerError(w, r, err)
	}
}
