package main

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/ritchie-gr8/my-blog-app/internal/store"
)

// @Summary		Get all categories
// @Description	Retrieve all categories
// @Tags			categories
// @Accept			json
// @Produce		json
// @Success		200	{array}		store.Category	"Successfully fetched categories"
// @Failure		500	{object}	error			"Internal server error, the server encountered a problem"
// @Router			/categories [get]
func (app *application) getCategoriesHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	categories, err := app.service.Categories.GetAll(ctx)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err := app.jsonResponse(w, http.StatusOK, categories); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}

// @Summary		Create a category
// @Description	Creates a new category with the provided name
// @Tags			categories
// @Accept			json
// @Produce		json
// @Param			name	body		string			true	"Category Name"
// @Success		201		{object}	store.Category	"Successfully created category"
// @Failure		400		{object}	error			"Invalid request, the request data was incorrect or malformed"
// @Failure		409		{object}	error			"Conflict: Category with this name already exists"
// @Failure		500		{object}	error			"Internal server error, the server encountered a problem"
// @Security		ApiKeyAuth
// @Router			/categories [post]
func (app *application) createCategoryHandler(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Name string `json:"name" validate:"required,max=50"`
	}

	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	category := &store.Category{
		Name: payload.Name,
	}

	ctx := r.Context()

	if err := app.service.Categories.Create(ctx, category); err != nil {
		switch err {
		case store.ErrUniqueViolation:
			app.logger.Info("case 1")
			app.conflictResponse(w, r, errors.New("a category with this name already exists"))
		default:
			app.logger.Info("case 2")
			app.internalServerError(w, r, err)
		}
		return
	}

	if err := app.jsonResponse(w, http.StatusCreated, category); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}

// @Summary		Delete a category
// @Description	Delete a category by its ID
// @Tags			categories
// @Accept			json
// @Produce		json
// @Param			categoryID	path			int	true	"Category ID"
// @Success		204			"No Content"	"Successfully deleted category"
// @Failure		400			{object}		error	"Invalid request"
// @Failure		404			{object}		error	"Category not found"
// @Failure		500			{object}		error	"Internal server error"
// @Security		ApiKeyAuth
// @Router			/categories/{categoryID} [delete]
func (app *application) deleteCategoryHandler(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "categoryID")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	ctx := r.Context()

	if err := app.service.Categories.Delete(ctx, id); err != nil {
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

// @Summary		Update a category
// @Description	Update a category's name
// @Tags			categories
// @Accept			json
// @Produce		json
// @Param			categoryID	path		int				true	"Category ID"
// @Param			name		body		string			true	"New Category Name"
// @Success		200			{object}	store.Category	"Successfully updated category"
// @Failure		400			{object}	error			"Invalid request, the request data was incorrect or malformed"
// @Failure		404			{object}	error			"Category not found"
// @Failure		409			{object}	error			"Conflict: Category with this name already exists"
// @Failure		500			{object}	error			"Internal server error, the server encountered a problem"
// @Security		ApiKeyAuth
// @Router			/categories/{categoryID} [patch]
func (app *application) updateCategoryHandler(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "categoryID")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	// Parse and validate the request body
	var payload struct {
		Name string `json:"name" validate:"required,max=50"`
	}

	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	ctx := r.Context()
	category := &store.Category{
		ID:   id,
		Name: payload.Name,
	}

	if err := app.service.Categories.Update(ctx, category); err != nil {
		switch err {
		case store.ErrUniqueViolation:
			app.conflictResponse(w, r, errors.New("a category with this name already exists"))
		case store.ErrNotFound:
			app.notFoundResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	if err := app.jsonResponse(w, http.StatusOK, category); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}
