package main

import (
	"net/http"
)

// @Summary		Health check
// @Description	Check the health status of the server, environment, and version
// @Tags			health
// @Accept			json
// @Produce		json
// @Success		200	{object}	map[string]string	"Returns server health status, environment, and version"
// @Failure		500	{object}	error				"Internal server error, the server encountered a problem"
// @Router			/health [get]
func (app *application) healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	data := map[string]string{
		"status":  "ok",
		"env":     app.config.env,
		"version": version,
	}

	if err := app.jsonResponse(w, http.StatusOK, data); err != nil {
		app.internalServerError(w, r, err)
	}
}
