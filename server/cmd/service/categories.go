package service

import (
	"context"

	"github.com/ritchie-gr8/my-blog-app/internal/store"
)

type CategoryService struct {
	store store.Storage
}

func (s *CategoryService) Create(ctx context.Context, category *store.Category) error {
	return s.store.Categories.Create(ctx, category)
}

func (s *CategoryService) GetAll(ctx context.Context) ([]*store.Category, error) {
	return s.store.Categories.GetAll(ctx)
}

func (s *CategoryService) GetByID(ctx context.Context, id int64) (*store.Category, error) {
	category, err := s.store.Categories.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return category, nil
}

func (s *CategoryService) Delete(ctx context.Context, id int64) error {
	_, err := s.GetByID(ctx, id)
	if err != nil {
		return err
	}

	if err := s.store.Categories.Delete(ctx, id); err != nil {
		return err
	}

	return nil
}

func (s *CategoryService) Update(ctx context.Context, category *store.Category) error {
	_, err := s.GetByID(ctx, category.ID)
	if err != nil {
		return err
	}

	return s.store.Categories.Update(ctx, category)
}
