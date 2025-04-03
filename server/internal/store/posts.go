package store

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
)

type Author struct {
	Name string `json:"name"`
	Bio  string `json:"bio"`
}

type Post struct {
	ID             int64     `json:"id"`
	Title          string    `json:"title"`
	Introduction   string    `json:"introduction"`
	Content        string    `json:"content"`
	CategoryID     int64     `json:"category_id"`
	UserID         int64     `json:"user_id"`
	ThumbnailImage []byte    `json:"thumbnail_image"`
	CreatedAt      string    `json:"created_at"`
	UpdatedAt      string    `json:"updated_at"`
	Version        int       `json:"version"`
	Comments       []Comment `json:"comments"`
	Author         *Author   `json:"author"`
	Category       string    `json:"category"`
	LikesCount     int64     `json:"likes_count"`
	UserHasLiked   bool      `json:"user_has_liked"`
}

type FeedItem struct {
	ID             int64  `json:"id"`
	Title          string `json:"title"`
	Introduction   string `json:"introduction"`
	CategoryID     int64  `json:"category_id"`
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
		SELECT p.id, p.title, p.introduction, p.category_id, c.name AS category, p.updated_at, p.thumbnail_image, p.user_id, u.name
		FROM posts p
		LEFT JOIN users u ON u.id = p.user_id
		LEFT JOIN categories c ON c.id = p.category_id
	`

	whereConditions := []string{}
	var queryParams = []any{
		fq.Limit,
		fq.GetOffset(),
	}

	if fq.Search != "" {
		whereConditions = append(whereConditions, fmt.Sprintf("(p.title ILIKE '%%' || $%d || '%%' OR p.introduction ILIKE '%%' || $%d || '%%')",
			len(queryParams)+1,
			len(queryParams)+1,
		))
		queryParams = append(queryParams, fq.Search)
	}

	if fq.Category != "" {
		whereConditions = append(whereConditions, fmt.Sprintf("c.name = $%d", len(queryParams)+1))
		queryParams = append(queryParams, fq.Category)
	}

	finalQuery := baseQuery
	if len(whereConditions) > 0 {
		finalQuery += " WHERE " + strings.Join(whereConditions, " AND ")
	}

	finalQuery += " ORDER BY p.id " + sort + " LIMIT $1 OFFSET $2"

	return finalQuery, queryParams
}

func (s *PostStore) GetFeed(ctx context.Context, fq PaginatedFeedQuery) ([]FeedItem, int64, error) {
	countQuery, countParams := getFeedCountQuery(&fq)

	var total int64
	err := s.db.QueryRowContext(ctx, countQuery, countParams...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

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
		return nil, 0, err
	}
	defer rows.Close()

	var feed []FeedItem
	for rows.Next() {
		var item FeedItem
		err := rows.Scan(
			&item.ID,
			&item.Title,
			&item.Introduction,
			&item.CategoryID,
			&item.Category,
			&item.UpdatedAt,
			&item.ThumbnailImage,
			&item.UserID,
			&item.Author,
		)
		if err != nil {
			return nil, 0, err
		}

		feed = append(feed, item)
	}

	return feed, total, nil
}

func (s *PostStore) Create(ctx context.Context, post *Post) error {
	query := `
		INSERT INTO posts 
		(title, introduction, content, category_id, user_id, thumbnail_image)
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
		post.CategoryID,
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

func (s *PostStore) GetByID(ctx context.Context, id int64, currentUserID int64) (*Post, error) {
	var query string
	var args []any

	if currentUserID > 0 {
		query = `
			SELECT p.id, p.title, p.introduction, p.content, p.category_id, 
				p.user_id, p.thumbnail_image, p.created_at, p.updated_at, p.version,
				u.name, u.bio, c.name as category,
				(SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.id) AS likes_count,
				EXISTS(SELECT 1 FROM post_likes pl WHERE pl.post_id = p.id AND pl.user_id = $2) AS user_has_liked
			FROM posts p
			LEFT JOIN users u ON p.user_id = u.id
			LEFT JOIN categories c ON p.category_id = c.id
			WHERE p.id = $1
		`
		args = []any{id, currentUserID}
	} else {
		query = `
			SELECT p.id, p.title, p.introduction, p.content, p.category_id, 
				p.user_id, p.thumbnail_image, p.created_at, p.updated_at, p.version,
				u.name, u.bio, c.name as category,
				(SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.id) AS likes_count,
				false AS user_has_liked
			FROM posts p
			LEFT JOIN users u ON p.user_id = u.id
			LEFT JOIN categories c ON p.category_id = c.id
			WHERE p.id = $1
		`
		args = []any{id}
	}

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	var post Post
	var userName, userBio, category sql.NullString
	err := s.db.QueryRowContext(ctx, query, args...).Scan(
		&post.ID,
		&post.Title,
		&post.Introduction,
		&post.Content,
		&post.CategoryID,
		&post.UserID,
		&post.ThumbnailImage,
		&post.CreatedAt,
		&post.UpdatedAt,
		&post.Version,
		&userName,
		&userBio,
		&category,
		&post.LikesCount,
		&post.UserHasLiked,
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrNotFound
		default:
			return nil, err
		}
	}

	post.Author = &Author{
		Name: userName.String,
		Bio:  userBio.String,
	}

	if category.Valid {
		post.Category = category.String
	}

	return &post, nil
}

func (s *PostStore) Update(ctx context.Context, post *Post) error {
	query := `
		UPDATE posts
		SET title = $1, introduction = $2, content = $3, category_id = $4, thumbnail_image = $5,
		updated_at = NOW(), version = version + 1
		WHERE id = $6 AND version = $7
		RETURNING version
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	err := s.db.QueryRowContext(
		ctx, query,
		post.Title, post.Introduction,
		post.Content, post.CategoryID,
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

func getFeedCountQuery(fq *PaginatedFeedQuery) (string, []any) {
	baseQuery := `
		SELECT COUNT(*)
		FROM posts p
		LEFT JOIN users u ON u.id = p.user_id
		LEFT JOIN categories c ON c.id = p.category_id
	`

	whereConditions := []string{}
	var queryParams = []any{}

	if fq.Search != "" {
		whereConditions = append(whereConditions, fmt.Sprintf("(p.title ILIKE '%%' || $%d || '%%' OR p.introduction ILIKE '%%' || $%d || '%%')",
			len(queryParams)+1,
			len(queryParams)+1,
		))
		queryParams = append(queryParams, fq.Search)
	}

	if fq.Category != "" {
		whereConditions = append(whereConditions, fmt.Sprintf("c.name = $%d", len(queryParams)+1))
		queryParams = append(queryParams, fq.Category)
	}

	finalQuery := baseQuery
	if len(whereConditions) > 0 {
		finalQuery += " WHERE " + strings.Join(whereConditions, " AND ")
	}

	return finalQuery, queryParams
}
