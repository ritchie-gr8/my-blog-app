package main

import (
	"net/http"

	"github.com/ritchie-gr8/my-blog-app/internal/store"
)

// @Summary		Get post feed
// @Description	Retrieve a paginated feed of posts with optional filters for category, search and status
// @Tags			posts
// @Accept			json
// @Produce		json
// @Param			page		query		int						false	"Page number for pagination (default is 1)"				minimum(1)
// @Param			limit		query		int						false	"Number of posts to retrieve (default is 6, max is 20)"	minimum(1)	maximum(20)
// @Param			sort		query		string					false	"Sort order (default is 'desc', options are 'asc' or 'desc')"
// @Param			category	query		string					false	"Category to filter posts by"
// @Param			search		query		string					false	"Search term to filter posts by (max length is 100)"
// @Param			status		query		string					false	"Status to filter posts by (default will fetch all status, options are 'published' or 'draft')"
// @Success		200			{object}	service.FeedResponse	"Successfully retrieved the posts feed"
// @Failure		400			{object}	error					"Invalid request, the request data was incorrect or malformed"
// @Failure		500			{object}	error					"Internal server error, the server encountered a problem"
// @Security		ApiKeyAuth
// @Router			/feed [get]
func (app *application) getFeedHandler(w http.ResponseWriter, r *http.Request) {
	fq := store.PaginatedFeedQuery{
		Limit: 6,
		Page:  1,
		Sort:  "desc",
	}

	fq, err := fq.Parse(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(fq); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	ctx := r.Context()

	feed, err := app.service.Posts.GetFeed(ctx, fq)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err := app.jsonResponse(w, http.StatusOK, feed); err != nil {
		app.internalServerError(w, r, err)
	}
}
