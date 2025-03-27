package store

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
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
	Version        int       `json:"version"`
	Comments       []Comment `json:"comments"`
}

type FeedItem struct {
	ID             int64  `json:"id"`
	Title          string `json:"title"`
	Introduction   string `json:"introduction"`
	Category       string `json:"category"`
	UpdatedAt      string `json:"updated_at"`
	ThumbnailImage []byte `json:"thumbnail_image"`
	UserID         int64  `json:"user_id"`
	Author         string `json:"author"`
}

type PostStore struct {
	db *sql.DB
}

func getFeedQuery(fq *PaginatedFeedQuery, sort string) (string, []any) {
	baseQuery := `
		SELECT p.id, p.title, p.introduction, p.category, p.updated_at, p.thumbnail_image, p.user_id, u.name
		FROM posts p
		LEFT JOIN users u ON u.id = p.user_id
	`

	whereConditions := []string{}
	var queryParams = []any{
		fq.Limit,
		fq.Offset,
	}

	if fq.Search != "" {
		whereConditions = append(whereConditions, fmt.Sprintf("(p.title ILIKE '%%' || $%d || '%%' OR p.introduction ILIKE '%%' || $%d || '%%')",
			len(queryParams)+1,
			len(queryParams)+1,
		))
		queryParams = append(queryParams, fq.Search)
	}

	if fq.Category != "" {
		whereConditions = append(whereConditions, fmt.Sprintf("p.category = $%d", len(queryParams)+1))
		queryParams = append(queryParams, fq.Category)
	}

	finalQuery := baseQuery
	if len(whereConditions) > 0 {
		finalQuery += " WHERE " + strings.Join(whereConditions, " AND ")
	}

	finalQuery += " ORDER BY p.id " + sort + " LIMIT $1 OFFSET $2"

	return finalQuery, queryParams
}

func (s *PostStore) GetFeed(ctx context.Context, fq PaginatedFeedQuery) ([]FeedItem, error) {
	sort := strings.ToUpper(fq.Sort)
	if sort != "ASC" && sort != "DESC" {
		sort = "DESC"
	}

	query, queryParams := getFeedQuery(&fq, sort)

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	rows, err := s.db.QueryContext(
		ctx,
		query,
		queryParams...,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var feed []FeedItem
	for rows.Next() {
		var item FeedItem
		err := rows.Scan(
			&item.ID,
			&item.Title,
			&item.Introduction,
			&item.Category,
			&item.UpdatedAt, &item.ThumbnailImage,
			&item.UserID,
			&item.Author,
		)
		if err != nil {
			return nil, err
		}

		feed = append(feed, item)
	}

	return feed, nil
}

func (s *PostStore) Create(ctx context.Context, post *Post) error {
	query := `
		INSERT INTO posts 
		(title, introduction, content, category, user_id, thumbnail_image)
		VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at, updated_at
	`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

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
		SELECT id, title, introduction, content, category, user_id, thumbnail_image, created_at, updated_at, version
		FROM posts WHERE id = $1

	`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

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
		&post.Version,
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
		updated_at = NOW(), version = version + 1
		WHERE id = $6 AND version = $7
		RETURNING version
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	err := s.db.QueryRowContext(
		ctx, query,
		post.Title, post.Introduction,
		post.Content, post.Category,
		post.ThumbnailImage, post.ID,
		post.Version).Scan(&post.Version)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return ErrNotFound
		default:
			return err
		}
	}

	return nil
}

func (s *PostStore) Delete(ctx context.Context, id int64) error {
	query := `
		DELETE FROM posts WHERE id = $1
	`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

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
