package service

import (
	"context"

	"github.com/ritchie-gr8/my-blog-app/internal/store"
)

type PostLikeService struct {
	store store.Storage
}

// LikePost adds a like to a post
func (s *PostLikeService) LikePost(ctx context.Context, postID, userID int64) error {
	return s.store.PostLike.LikePost(ctx, postID, userID)
}

// UnlikePost removes a like from a post
func (s *PostLikeService) UnlikePost(ctx context.Context, postID, userID int64) error {
	return s.store.PostLike.UnlikePost(ctx, postID, userID)
}

// GetLikesCount returns the number of likes for a post
func (s *PostLikeService) GetLikesCount(ctx context.Context, postID int64) (int64, error) {
	return s.store.PostLike.GetLikesCount(ctx, postID)
}

// HasUserLiked checks if a user has liked a post
func (s *PostLikeService) HasUserLiked(ctx context.Context, postID, userID int64) (bool, error) {
	return s.store.PostLike.HasUserLiked(ctx, postID, userID)
}
