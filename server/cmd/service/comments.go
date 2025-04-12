package service

import (
	"context"

	"github.com/ritchie-gr8/my-blog-app/internal/store"
)

type CommentService struct {
	store store.Storage
}

func (s *CommentService) GetByPostID(ctx context.Context, postID int64) ([]store.Comment, error) {
	comments, err := s.store.Comments.GetByPostID(ctx, postID)
	if err != nil {
		return nil, err
	}

	return comments, nil
}

func (s *CommentService) Create(ctx context.Context, comment *store.Comment) error {
	if err := s.store.Comments.Create(ctx, comment); err != nil {
		return err
	}

	return nil
}
