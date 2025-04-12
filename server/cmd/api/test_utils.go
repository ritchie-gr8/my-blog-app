package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/ritchie-gr8/my-blog-app/cmd/service"
	"github.com/ritchie-gr8/my-blog-app/internal/auth"
	"github.com/ritchie-gr8/my-blog-app/internal/ratelimiter"
	"github.com/ritchie-gr8/my-blog-app/internal/store"
	"github.com/ritchie-gr8/my-blog-app/internal/store/cache"
	"go.uber.org/zap"
)

func newTestApplication(t *testing.T, cfg config) *application {
	t.Helper()
	logger := zap.Must(zap.NewProduction()).Sugar()
	mockStore := store.NewMockStore()
	mockCacheStore := cache.NewMockStore()
	testAuth := &auth.TestAuthenticator{}
	mockService := service.NewMockService()
	rateLimiter := ratelimiter.NewFixedWindowLimiter(
		cfg.rateLimiter.RequestsPerTimeFrame,
		cfg.rateLimiter.TimeFrame,
	)

	return &application{
		logger:        logger,
		store:         mockStore,
		cacheStore:    mockCacheStore,
		authenticator: testAuth,
		service:       mockService,
		config:        cfg,
		rateLimiter:   rateLimiter,
	}
}

func executeRequest(req *http.Request, mux http.Handler) *httptest.ResponseRecorder {
	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)
	return rr
}

func checkResponseCode(t *testing.T, expected, actual int) {
	if expected != actual {
		t.Errorf("Expected response code %d. Got %d", expected, actual)
	}
}
