package service

import (
	"context"

	"github.com/ritchie-gr8/my-blog-app/internal/store"
)

type PostService struct {
	store store.Storage
}

func (s *PostService) Create(ctx context.Context, post *store.Post) error {
	if err := s.store.Posts.Create(ctx, post); err != nil {
		return err
	}

	return nil
}

func (s *PostService) Get(ctx context.Context, postID int64, userID int64) (*store.Post, error) {
	post, err := s.store.Posts.GetByID(ctx, postID, userID)
	if err != nil {
		return nil, err
	}

	return post, nil
}

func (s *PostService) Delete(ctx context.Context, postID int64) error {
	if err := s.store.Posts.Delete(ctx, postID); err != nil {
		return err
	}
	return nil
}

func (s *PostService) Update(ctx context.Context, post *store.Post) error {
	if err := s.store.Posts.Update(ctx, post); err != nil {
		return err
	}
	return nil
}

func (s *PostService) GetFeed(ctx context.Context, fq store.PaginatedFeedQuery) ([]store.FeedItem, error) {
	feed, err := s.store.Posts.GetFeed(ctx, fq)
	if err != nil {

		return nil, err
	}

	return feed, nil
}
