package store

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

var (
	ErrNotFound          = errors.New("resource not found")
	ErrUniqueViolation   = errors.New("unique violation")
	QueryTimeoutDuration = time.Second * 5
)

type Storage struct {
	Posts interface {
		GetByID(context.Context, int64) (*Post, error)
		Create(context.Context, *Post) error
		Update(context.Context, *Post) error
		Delete(context.Context, int64) error
		GetFeed(context.Context, PaginatedFeedQuery) ([]FeedItem, error)
	}

	Users interface {
		Activate(context.Context, string) error
		Create(context.Context, *sql.Tx, *User) error
		CreateAndInvite(context.Context, *User, string, time.Duration) error
		Update(context.Context, *User) (int64, error)
		Delete(context.Context, int64) error
		GetByEmail(context.Context, string) (*User, error)
		GetByID(context.Context, int64) (*User, error)
	}

	Comments interface {
		Create(context.Context, *Comment) error
		GetByPostID(context.Context, int64) ([]Comment, error)
	}

	Categories interface {
		Create(context.Context, *Category) error
		GetAll(context.Context) ([]*Category, error)
		GetByID(context.Context, int64) (*Category, error)
		Delete(context.Context, int64) error
		Update(context.Context, *Category) error
	}
}

func NewStorage(db *sql.DB) Storage {
	return Storage{
		Posts:      &PostStore{db},
		Users:      &UserStore{db},
		Comments:   &CommentStore{db},
		Categories: &CategoryStore{db},
	}
}

func withTx(db *sql.DB, ctx context.Context, fn func(*sql.Tx) error) error {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	if err := fn(tx); err != nil {
		_ = tx.Rollback()
		return err
	}

	return tx.Commit()
}
