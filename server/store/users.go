package store

import (
	"context"
	"database/sql"
)

type User struct {
	ID             int64  `json:"id"`
	Username       string `json:"username"`
	Email          string `json:"email"`
	Name           string `json:"name"`
	Password       string `json:"-"`
	ProfilePicture []byte `json:"profile_picture,omitempty"`
	CreatedAt      string `json:"created_at"`
}

type UserStore struct {
	db *sql.DB
}

func (s *UserStore) Create(ctx context.Context, user *User) error {
	query := `
		INSERT INTO users (name, username, password, email)
		VALUES ($1, $2, $3, $4) RETURNING id, created_at
	`

	err := s.db.QueryRowContext(
		ctx,
		query,
		user.Name,
		user.Username,
		user.Password,
		user.Email,
	).Scan(
		&user.ID,
		&user.CreatedAt,
	)
	if err != nil {
		return err
	}

	return nil
}
