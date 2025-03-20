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
	Role           string `json:"role"`
}

type UserStore struct {
	db *sql.DB
}

func (s *UserStore) Create(ctx context.Context, user *User) error {
	// set default role to user for now
	user.Role = "user"

	query := `
		INSERT INTO users (name, username, password, email, role)
		VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	err := s.db.QueryRowContext(
		ctx,
		query,
		user.Name,
		user.Username,
		user.Password,
		user.Email,
		user.Role,
	).Scan(
		&user.ID,
		&user.CreatedAt,
	)
	if err != nil {
		return err
	}

	return nil
}
