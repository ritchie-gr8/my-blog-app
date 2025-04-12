package main

import (
	"context"
	"errors"
	"expvar"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"go.uber.org/zap"

	"github.com/ritchie-gr8/my-blog-app/cmd/service"
	"github.com/ritchie-gr8/my-blog-app/docs"
	"github.com/ritchie-gr8/my-blog-app/internal/auth"
	"github.com/ritchie-gr8/my-blog-app/internal/mailer"
	"github.com/ritchie-gr8/my-blog-app/internal/ratelimiter"
	"github.com/ritchie-gr8/my-blog-app/internal/store"
	"github.com/ritchie-gr8/my-blog-app/internal/store/cache"
	httpSwagger "github.com/swaggo/http-swagger"
)

type application struct {
	config        config
	store         store.Storage
	cacheStore    cache.Storage
	logger        *zap.SugaredLogger
	mailer        mailer.Client
	authenticator auth.Authenticator
	service       service.Service
	rateLimiter   ratelimiter.Limiter
	sseManager    *SSEManager
}

type config struct {
	addr        string
	db          dbConfig
	env         string
	apiURL      string
	mail        mailConfig
	frontendURL string
	auth        authConfig
	redis       redisConfig
	rateLimiter ratelimiter.Config
}

type redisConfig struct {
	addr     string
	password string
	db       int
	enabled  bool
}

type authConfig struct {
	basic basicConfig
	token tokenConfig
}

type basicConfig struct {
	user string
	pass string
}

type tokenConfig struct {
	secret string
	exp    time.Duration
	issue  string
}

type mailConfig struct {
	sendGrid  sendGridConfig
	fromEmail string
	exp       time.Duration
}

type sendGridConfig struct {
	apiKey string
}

type dbConfig struct {
	addr         string
	maxOpenConns int
	maxIdleConns int
	maxIdleTime  string
}

func (app *application) mount() http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{
			app.config.frontendURL,
			"http://localhost:5173", // for local development
		},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders: []string{
			"Accept",
			"Authorization",
			"Content-Type",
			"X-CSRF-Token",
			"X-Requested-With",
			"Origin",
		},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))
	r.Use(app.RateLimiterMiddleware)

	r.Route("/v1", func(r chi.Router) {
		r.With(app.SSEAuthMiddleware).Get("/notifications/stream", app.notificationStreamHandler)

		r.Group(func(r chi.Router) {

			// Set a timeout value on the request context (ctx), that will signal
			// through ctx.Done() that the request has timed out and further
			// processing should be stopped.
			r.Use(middleware.Timeout(60 * time.Second))

			r.Get("/health", app.healthCheckHandler)
			r.With(app.BasicAuthMiddleware()).Get("/metrics", expvar.Handler().ServeHTTP)

			docsURL := fmt.Sprintf("%s/swagger/doc.json", app.config.addr)
			r.Get("/swagger/*", httpSwagger.Handler(httpSwagger.URL(docsURL)))

			r.Route("/posts", func(r chi.Router) {
				r.Route("/{postID}", func(r chi.Router) {
					r.Use(app.postsContextMiddleware)
					r.With(app.OptionalAuthMiddleware).Get("/", app.getPostHandler)

					r.With(app.AuthTokenMiddleware).Delete("/", app.checkPostOwnership("admin", app.deletePostHandler))
					r.With(app.AuthTokenMiddleware).Patch("/", app.checkPostOwnership("moderator", app.updatePostHandler))
					r.With(app.AuthTokenMiddleware).Post("/comments", app.createCommentHandler)
					r.With(app.AuthTokenMiddleware).Post("/like", app.likePostHandler)
					r.With(app.AuthTokenMiddleware).Delete("/like", app.unlikePostHandler)
				})

				r.With(app.AuthTokenMiddleware).Post("/", app.createPostHandler)
			})

			r.Route("/users", func(r chi.Router) {
				r.Put("/activate/{token}", app.activeUserHandler)

				r.Route("/{userID}", func(r chi.Router) {
					r.Use(app.AuthTokenMiddleware)
					r.Get("/", app.getUserHandler)
					r.Patch("/", app.updateUserHandler)
					r.Patch("/password", app.resetPasswordHandler)
				})
			})

			r.Get("/feed", app.getFeedHandler)

			r.Route("/authentication", func(r chi.Router) {
				r.Post("/user", app.registerUserHandler)
				r.Post("/token", app.createTokenHandler)
			})

			r.Route("/categories", func(r chi.Router) {
				r.Get("/", app.getCategoriesHandler)

				r.With(app.AuthTokenMiddleware, app.checkRole("admin")).Route("/", func(r chi.Router) {
					r.Get("/paginated", app.getPaginatedCategoriesHandler)
					r.Post("/", app.createCategoryHandler)
					r.Delete("/{categoryID}", app.deleteCategoryHandler)
					r.Patch("/{categoryID}", app.updateCategoryHandler)
				})
			})

			r.Route("/notifications", func(r chi.Router) {
				r.Use(app.AuthTokenMiddleware)
				r.Get("/", app.getNotificationsHandler)
				r.Get("/unread-count", app.getUnreadCountHandler)
				r.Put("/{notificationID}/read", app.markNotificationReadHandler)
				r.Put("/read-all", app.markAllNotificationsReadHandler)
				r.With(app.checkRole("admin")).Get("/admin", app.getAdminNotificationsHandler)
			})

		})
	})

	return r
}

func (app *application) run(mux http.Handler) error {

	docs.SwaggerInfo.Version = version
	docs.SwaggerInfo.Host = app.config.apiURL
	docs.SwaggerInfo.BasePath = "/v1"

	server := &http.Server{
		Addr:         app.config.addr,
		Handler:      mux,
		WriteTimeout: time.Minute * 2,
		ReadTimeout:  time.Second * 10,
		IdleTimeout:  time.Minute,
	}

	shutdown := make(chan error)

	go func() {
		quit := make(chan os.Signal, 1)

		signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
		s := <-quit

		ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
		defer cancel()

		app.logger.Infow("signal caught", "signal", s.String())

		shutdown <- server.Shutdown(ctx)
	}()

	app.logger.Infow("server has started", "addr", app.config.addr, "env", app.config.env)

	err := server.ListenAndServe()
	if !errors.Is(err, http.ErrServerClosed) {
		return err
	}

	err = <-shutdown
	if err != nil {
		return err
	}

	app.logger.Infow("server has stopped", "addr", app.config.addr, "env", app.config.env)

	return nil
}
