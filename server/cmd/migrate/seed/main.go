package main

import (
	"log"

	_ "github.com/lib/pq"
	"github.com/ritchie-gr8/my-blog-app/internal/db"
	"github.com/ritchie-gr8/my-blog-app/internal/env"
	"github.com/ritchie-gr8/my-blog-app/store"
)

func main() {
	addr := env.GetString("DB_ADDR", "postgres://admin:adminpassword@localhost/blogpost?sslmode=disable")

	conn, err := db.New(addr, 3, 3, "15m")
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	store := store.NewStorage(conn)

	db.Seed(store)
}
