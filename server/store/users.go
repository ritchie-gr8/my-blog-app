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

func (s *UserStore) GetByID(ctx context.Context, userID int64) (*User, error) {
	query := `
		SELECT id, username, email, name, profile_picture, created_at, role
		FROM users
		WHERE id = $1
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	user := &User{}
	if err := s.db.QueryRowContext(
		ctx,
		query,
		userID,
	).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Name,
		&user.ProfilePicture,
		&user.CreatedAt,
		&user.Role,
	); err != nil {
		switch err {
		case sql.ErrNoRows:
			return nil, ErrNotFound
		default:
			return nil, err
		}
	}

	return user, nil
}
