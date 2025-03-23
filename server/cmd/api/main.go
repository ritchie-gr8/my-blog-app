package main

import (
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/ritchie-gr8/my-blog-app/internal/auth"
	"github.com/ritchie-gr8/my-blog-app/internal/db"
	"github.com/ritchie-gr8/my-blog-app/internal/env"
	"github.com/ritchie-gr8/my-blog-app/internal/mailer"
	"github.com/ritchie-gr8/my-blog-app/internal/store"
	"github.com/ritchie-gr8/my-blog-app/internal/store/cache"
	"go.uber.org/zap"
)

const version = "0.0.1"

//	@title			Blog Post API
//	@description	API for my blog post
//	@termsOfService	http://swagger.io/terms/

//	@contact.name	API Support
//	@contact.url	http://www.swagger.io/support
//	@contact.email	support@swagger.io

//	@license.name	Apache 2.0
//	@license.url	http://www.apache.org/licenses/LICENSE-2.0.html

//	@BasePath	/v1

// @securityDefinitions.apiKey	ApiKeyAuth
// @in							header
// @name						Authorization
// @description
func main() {
	// create logger without printing stacktrace
	loggerCfg := zap.NewProductionConfig()
	loggerCfg.EncoderConfig.StacktraceKey = ""
	zap, err := loggerCfg.Build()
	if err != nil {
		panic(err)
	}
	defer zap.Sync()
	logger := zap.Sugar()

	// load env file
	if err := godotenv.Load(); err != nil {
		logger.Fatal("Error loading .env file")
	}

	// setup config
	cfg := config{
		addr:        env.GetString("ADDR", ":8080"),
		apiURL:      env.GetString("EXTERNAL_URL", "localhost:8080"),
		frontendURL: env.GetString("FRONTEND_URL", "http://localhost:5173"),
		db: dbConfig{
			addr:         env.GetString("DB_ADDR", "postgres://admin:adminpassword@localhost/blogpost?sslmode=disable"),
			maxOpenConns: env.GetInt("DB_MAX_OPEN_CONNS", 30),
			maxIdleConns: env.GetInt("DB_MAX_IDLE_CONNS", 30),
			maxIdleTime:  env.GetString("DB_MAX_IDLE_TIME", "15m"),
		},
		env: env.GetString("ENV", "development"),
		mail: mailConfig{
			exp:       time.Hour * 24 * 3,
			fromEmail: env.GetString("FROM_EMAIL", ""),
			sendGrid: sendGridConfig{
				apiKey: env.GetString("SENDGRID_API_KEY", ""),
			},
		},
		auth: authConfig{
			basic: basicConfig{
				user: env.GetString("AUTH_BASIC_USER", ""),
				pass: env.GetString("AUTH_BASIC_PASS", ""),
			},
			token: tokenConfig{
				secret: env.GetString("AUTH_TOKEN_SECRET", ""),
				exp:    time.Hour * 24 * 3,
				issue:  env.GetString("AUTH_ISSUE", ""),
			},
		},
		redisCfg: redisConfig{
			addr:     env.GetString("REDIS_ADDR", "localhost:6379"),
			password: env.GetString("REDIS_PW", ""),
			db:       env.GetInt("REDIS_DB", 0),
			enabled:  env.GetBool("REDIS_ENABLED", false),
		},
	}

	// create db
	db, err := db.New(
		cfg.db.addr,
		cfg.db.maxOpenConns,
		cfg.db.maxIdleConns,
		cfg.db.maxIdleTime,
	)
	if err != nil {
		logger.Panic(err)
	}
	defer db.Close()
	logger.Info("database connection pool established")

	// cache
	var redisDB *redis.Client
	if cfg.redisCfg.enabled {
		redisDB = cache.NewRedisClient(
			cfg.redisCfg.addr,
			cfg.redisCfg.password,
			cfg.redisCfg.db)
		logger.Info("redis connection established")
	}

	store := store.NewStorage(db)
	cacheStore := cache.NewRedisStore(redisDB)

	mailer := mailer.NewSendgrid(cfg.mail.sendGrid.apiKey, cfg.mail.fromEmail)

	jwtAuthenticator := auth.NewJWTAuthenticator(cfg.auth.token.secret, cfg.auth.token.issue, cfg.auth.token.issue)

	app := &application{
		config:        cfg,
		store:         store,
		cacheStore:    cacheStore,
		logger:        logger,
		mailer:        mailer,
		authenticator: jwtAuthenticator,
	}

	mux := app.mount()

	logger.Fatal(app.run(mux))
}
