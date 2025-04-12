package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/ritchie-gr8/my-blog-app/internal/env"
	"github.com/ritchie-gr8/my-blog-app/internal/store"
)

//	@Summary		Get user notifications
//	@Description	Retrieves notifications for the authenticated user
//	@Tags			notifications
//	@Accept			json
//	@Produce		json
//	@Param			limit	query		int	false	"Limit results"		default(20)
//	@Param			offset	query		int	false	"Offset results"	default(0)
//	@Success		200		{array}		store.Notification
//	@Failure		401		{object}	error	"User not authenticated"
//	@Failure		500		{object}	error	"Internal server error"
//	@Security		ApiKeyAuth
//	@Router			/notifications [get]
func (app *application) getNotificationsHandler(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)
	if user == nil {
		app.unauthorizeResponse(w, r, fmt.Errorf("user not authenticated"))
		return
	}

	// Parse query parameters
	limit := 20
	offset := 0

	limitParam := r.URL.Query().Get("limit")
	if limitParam != "" {
		parsedLimit, err := strconv.Atoi(limitParam)
		if err == nil && parsedLimit > 0 {
			limit = parsedLimit
		}
	}

	offsetParam := r.URL.Query().Get("offset")
	if offsetParam != "" {
		parsedOffset, err := strconv.Atoi(offsetParam)
		if err == nil && parsedOffset >= 0 {
			offset = parsedOffset
		}
	}

	// Get notifications
	notifications, err := app.service.Notifications.GetUserNotifications(r.Context(), user.ID, limit, offset)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err := app.jsonResponse(w, http.StatusOK, notifications); err != nil {
		app.internalServerError(w, r, err)
	}
}

//	@Summary		Get admin notifications
//	@Description	Retrieves notifications for the admin
//	@Tags			notifications
//	@Accept			json
//	@Produce		json
//	@Param			page	query		int	false	"Page number"	default(1)
//	@Param			limit	query		int	false	"Limit results"	default(10)
//	@Success		200		{array}		store.Notification
//	@Failure		401		{object}	error	"User not authenticated"
//	@Failure		500		{object}	error	"Internal server error"
//	@Security		ApiKeyAuth
//	@Router			/notifications/admin [get]
func (app *application) getAdminNotificationsHandler(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)
	if user == nil {
		app.unauthorizeResponse(w, r, fmt.Errorf("user not authenticated"))
		return
	}

	if user.Role != "admin" {
		app.unauthorizeResponse(w, r, fmt.Errorf("user is not an admin"))
		return
	}

	page := 1
	limit := 10

	if pageParam := r.URL.Query().Get("page"); pageParam != "" {
		if parsedPage, err := strconv.Atoi(pageParam); err == nil && parsedPage > 0 {
			page = parsedPage
		}
	}

	if limitParam := r.URL.Query().Get("limit"); limitParam != "" {
		if parsedLimit, err := strconv.Atoi(limitParam); err == nil && parsedLimit > 0 {
			limit = parsedLimit
		}
	}

	notifications, err := app.service.Notifications.GetNotification(r.Context(), user.ID, page, limit)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err := app.jsonResponse(w, http.StatusOK, notifications); err != nil {
		app.internalServerError(w, r, err)
	}
}

//	@Summary		Get unread notification count
//	@Description	Returns the number of unread notifications for the authenticated user
//	@Tags			notifications
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	map[string]int64
//	@Failure		401	{object}	error	"User not authenticated"
//	@Failure		500	{object}	error	"Internal server error"
//	@Security		ApiKeyAuth
//	@Router			/notifications/unread-count [get]
func (app *application) getUnreadCountHandler(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)
	if user == nil {
		app.unauthorizeResponse(w, r, fmt.Errorf("user not authenticated"))
		return
	}

	count, err := app.service.Notifications.CountUnreadNotifications(r.Context(), user.ID)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	response := map[string]int64{"count": count}
	if err := app.jsonResponse(w, http.StatusOK, response); err != nil {
		app.internalServerError(w, r, err)
	}
}

//	@Summary		Mark notification as read
//	@Description	Marks a specific notification as read
//	@Tags			notifications
//	@Accept			json
//	@Produce		json
//	@Param			notificationID	path		int		true	"Notification ID"
//	@Success		204				{string}	string	"No content"
//	@Failure		400				{object}	error	"Invalid notification ID"
//	@Failure		401				{object}	error	"User not authenticated"
//	@Failure		404				{object}	error	"Notification not found"
//	@Failure		500				{object}	error	"Internal server error"
//	@Security		ApiKeyAuth
//	@Router			/notifications/{notificationID}/read [put]
func (app *application) markNotificationReadHandler(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)
	if user == nil {
		app.unauthorizeResponse(w, r, fmt.Errorf("user not authenticated"))
		return
	}

	notificationID, err := strconv.ParseInt(chi.URLParam(r, "notificationID"), 10, 64)
	if err != nil || notificationID < 1 {
		app.badRequestResponse(w, r, fmt.Errorf("invalid notification ID"))
		return
	}

	err = app.service.Notifications.MarkNotificationAsRead(r.Context(), notificationID, user.ID)
	if err != nil {
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

//	@Summary		Mark all notifications as read
//	@Description	Marks all of the authenticated user's notifications as read
//	@Tags			notifications
//	@Accept			json
//	@Produce		json
//	@Success		204	{string}	string	"No content"
//	@Failure		401	{object}	error	"User not authenticated"
//	@Failure		500	{object}	error	"Internal server error"
//	@Security		ApiKeyAuth
//	@Router			/notifications/read-all [put]
func (app *application) markAllNotificationsReadHandler(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)
	if user == nil {
		app.unauthorizeResponse(w, r, fmt.Errorf("user not authenticated"))
		return
	}

	err := app.service.Notifications.MarkAllNotificationsAsRead(r.Context(), user.ID)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

//	@Summary		Stream notifications
//	@Description	Open an SSE connection to receive real-time notifications
//	@Tags			notifications
//	@Produce		text/event-stream
//	@Success		200	{string}	string	"SSE stream established"
//	@Failure		401	{object}	error	"User not authenticated"
//	@Security		ApiKeyAuth
//	@Router			/notifications/stream [get]
func (app *application) notificationStreamHandler(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)
	if user == nil {
		app.unauthorizeResponse(w, r, fmt.Errorf("user not authenticated"))
		return
	}

	app.logger.Infow("Notification stream called", "user_id", user.ID)

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Access-Control-Allow-Origin", env.GetString("CORS_ALLOWED_ORIGIN", "http://localhost:5173"))

	client := app.sseManager.AddClient(user.ID)
	defer app.sseManager.RemoveClient(user.ID)

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming not supported", http.StatusInternalServerError)
		return
	}
	fmt.Fprintf(w, "event: ping\ndata: %d\n\n", time.Now().Unix())
	flusher.Flush()

	ctx, cancel := context.WithCancel(r.Context())
	defer cancel()

	go func() {
		<-ctx.Done()
		app.sseManager.RemoveClient(user.ID)
	}()

	ticker := time.NewTicker(15 * time.Second)
	defer ticker.Stop()

	done := r.Context().Done()

	for {
		select {
		case <-done:
			app.logger.Info("Notification stream closed", "user_id", user.ID)
			return
		case msg, ok := <-client.Connection:
			if !ok {
				return
			}
			fmt.Fprintf(w, "event: notification\ndata: %s\n\n", msg)
			flusher.Flush()
		case <-ticker.C:
			fmt.Fprintf(w, "event: ping\ndata: %d\n\n", time.Now().Unix())
			flusher.Flush()
		}
	}
}
