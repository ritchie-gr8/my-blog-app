package store

import (
	"context"
	"database/sql"
)

type PostLike struct {
	ID        int64  `json:"id"`
	PostID    int64  `json:"post_id"`
	UserID    int64  `json:"user_id"`
	CreatedAt string `json:"created_at"`
}

type PostLikeStore struct {
	db *sql.DB
}

// LikePost adds a like to a post from a user
func (s *PostLikeStore) LikePost(ctx context.Context, postID, userID int64) error {
	query := `
		INSERT INTO post_likes (post_id, user_id)
		VALUES ($1, $2)
		ON CONFLICT (post_id, user_id) DO NOTHING
	`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	_, err := s.db.ExecContext(ctx, query, postID, userID)
	if err != nil {
		return err
	}

	return nil
}

// UnlikePost removes a like from a post
func (s *PostLikeStore) UnlikePost(ctx context.Context, postID, userID int64) error {
	query := `
		DELETE FROM post_likes
		WHERE post_id = $1 AND user_id = $2
	`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	result, err := s.db.ExecContext(ctx, query, postID, userID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return ErrNotFound
	}

	return nil
}

// GetLikesCount returns the number of likes for a post
func (s *PostLikeStore) GetLikesCount(ctx context.Context, postID int64) (int64, error) {
	query := `
		SELECT COUNT(*) FROM post_likes
		WHERE post_id = $1
	`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	var count int64
	err := s.db.QueryRowContext(ctx, query, postID).Scan(&count)
	if err != nil {
		return 0, err
	}

	return count, nil
}

// HasUserLiked checks if a user has liked a post
func (s *PostLikeStore) HasUserLiked(ctx context.Context, postID, userID int64) (bool, error) {
	query := `
		SELECT EXISTS(
			SELECT 1 FROM post_likes
			WHERE post_id = $1 AND user_id = $2
		)
	`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	var exists bool
	err := s.db.QueryRowContext(ctx, query, postID, userID).Scan(&exists)
	if err != nil {
		return false, err
	}

	return exists, nil
}
