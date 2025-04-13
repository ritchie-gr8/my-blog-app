package main

import (
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
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
		"status":       "ok",
		"env":          app.config.env,
		"version":      version,
		"frontend_url": app.config.frontendURL,
	}

	if err := app.jsonResponse(w, http.StatusOK, data); err != nil {
		app.internalServerError(w, r, err)
	}
}

// Debug endpoint for token validation
// @Summary		Debug Token
// @Description	Debug endpoint to diagnose token validation issues
// @Tags			debug
// @Accept			json
// @Produce		json
// @Param			Authorization	header		string	true	"Bearer Token"
// @Success		200				{object}	map[string]interface{}
// @Failure		400				{object}	error	"Bad request"
// @Failure		500				{object}	error	"Internal server error"
// @Router			/debug-token [get]
func (app *application) debugTokenHandler(w http.ResponseWriter, r *http.Request) {
	authHeader := r.Header.Get("Authorization")

	response := map[string]interface{}{
		"auth_header_present": authHeader != "",
		"token_secret_length": len(app.config.auth.token.secret),
		"token_issue":         app.config.auth.token.issue,
		"token_expiry":        app.config.auth.token.exp.String(),
	}

	if authHeader == "" {
		response["error"] = "No Authorization header present"
		app.jsonResponse(w, http.StatusOK, response)
		return
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		response["error"] = "Authorization header invalid format"
		response["auth_header"] = authHeader
		app.jsonResponse(w, http.StatusOK, response)
		return
	}

	tokenString := parts[1]
	response["token_length"] = len(tokenString)

	// First parse without validation to see claims
	token, _ := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		return []byte("dummy-key-for-parsing-only"), nil
	})

	if token != nil && token.Claims != nil {
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			response["parsed_claims"] = claims
		}
	}

	// Now try proper validation
	validatedToken, err := app.authenticator.ValidateToken(tokenString)
	response["token_valid"] = err == nil

	if err != nil {
		response["validation_error"] = err.Error()
	} else if validatedToken != nil {
		if claims, ok := validatedToken.Claims.(jwt.MapClaims); ok {
			// Try to load the user to check if that's the issue
			if userID, ok := claims["sub"].(float64); ok {
				user, userErr := app.service.Users.Get(r.Context(), int64(userID))
				response["user_found"] = userErr == nil
				if userErr != nil {
					response["user_error"] = userErr.Error()
				} else {
					response["user_id"] = user.ID
					response["user_role"] = user.Role
				}
			}
		}
	}

	if err := app.jsonResponse(w, http.StatusOK, response); err != nil {
		app.internalServerError(w, r, err)
	}
}
