package main

import (
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/ritchie-gr8/my-blog-app/internal/db"
	"github.com/ritchie-gr8/my-blog-app/internal/env"
	"github.com/ritchie-gr8/my-blog-app/internal/store"
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
		addr:   env.GetString("ADDR", ":8080"),
		apiURL: env.GetString("EXTERNAL_URL", "localhost:8080"),
		db: dbConfig{
			addr:         env.GetString("DB_ADDR", "postgres://admin:adminpassword@localhost/blogpost?sslmode=disable"),
			maxOpenConns: env.GetInt("DB_MAX_OPEN_CONNS", 30),
			maxIdleConns: env.GetInt("DB_MAX_IDLE_CONNS", 30),
			maxIdleTime:  env.GetString("DB_MAX_IDLE_TIME", "15m"),
		},
		env: env.GetString("ENV", "development"),
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

	store := store.NewStorage(db)

	app := &application{
		config: cfg,
		store:  store,
		logger: logger,
	}

	mux := app.mount()

	logger.Fatal(app.run(mux))
}
