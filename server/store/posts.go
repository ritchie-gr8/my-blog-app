package store

import (
	"context"
	"database/sql"
	"errors"
)

type Post struct {
	ID             int64     `json:"id"`
	Title          string    `json:"title"`
	Introduction   string    `json:"introduction"`
	Content        string    `json:"content"`
	Category       string    `json:"category"`
	UserID         int64     `json:"user_id"`
	ThumbnailImage []byte    `json:"thumbnail_image"`
	CreatedAt      string    `json:"created_at"`
	UpdatedAt      string    `json:"updated_at"`
	Comments       []Comment `json:"comments"`
}

type PostStore struct {
	db *sql.DB
}

func (s *PostStore) Create(ctx context.Context, post *Post) error {
	query := `
		INSERT INTO posts 
		(title, introduction, content, category, user_id, thumbnail_image)
		VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at, updated_at
	`
	err := s.db.QueryRowContext(
		ctx,
		query,
		post.Title,
		post.Introduction,
		post.Content,
		post.Category,
		post.UserID,
		post.ThumbnailImage,
	).Scan(
		&post.ID,
		&post.CreatedAt,
		&post.UpdatedAt,
	)

	if err != nil {
		return err
	}

	return nil
}

func (s *PostStore) GetByID(ctx context.Context, id int64) (*Post, error) {
	query := `
		SELECT id, title, introduction, content, category, user_id, thumbnail_image, created_at, updated_at
		FROM posts WHERE id = $1
	`

	var post Post
	err := s.db.QueryRowContext(ctx, query, id).Scan(
		&post.ID,
		&post.Title,
		&post.Introduction,
		&post.Content,
		&post.Category,
		&post.UserID,
		&post.ThumbnailImage,
		&post.CreatedAt,
		&post.UpdatedAt,
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrNotFound
		default:
			return nil, err
		}
	}

	return &post, nil
}

func (s *PostStore) Update(ctx context.Context, post *Post) error {
	query := `
		UPDATE posts
		SET title = $1, introduction = $2, content = $3, category = $4, thumbnail_image = $5,
		updated_at = NOW()
		WHERE id = $6
	`

	_, err := s.db.ExecContext(ctx, query, post.Title, post.Introduction, post.Content, post.Category, post.ThumbnailImage, post.ID)
	if err != nil {
		return err
	}

	return nil
}

func (s *PostStore) Delete(ctx context.Context, id int64) error {
	query := `
		DELETE FROM posts WHERE id = $1
	`
	res, err := s.db.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return ErrNotFound
	}

	return nil
}
