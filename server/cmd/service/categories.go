package service

import (
	"context"

	"github.com/ritchie-gr8/my-blog-app/internal/store"
)

type CategoryService struct {
	store store.Storage
}

type PaginatedCategoryResponse struct {
	Items      []store.Category `json:"items"`
	Total      int64            `json:"total"`
	Page       int              `json:"page"`
	PageSize   int              `json:"page_size"`
	TotalPages int              `json:"total_pages"`
}

func (s *CategoryService) Create(ctx context.Context, category *store.Category) error {
	return s.store.Categories.Create(ctx, category)
}

func (s *CategoryService) GetAll(ctx context.Context) ([]*store.Category, error) {
	return s.store.Categories.GetAll(ctx)
}

func (s *CategoryService) Get(ctx context.Context, query *store.PaginatedCategoryQuery) (*PaginatedCategoryResponse, error) {
	categories, total, err := s.store.Categories.Get(ctx, query)
	if err != nil {
		return nil, err
	}

	totalPages := int(total) / query.Limit
	if int(total)%query.Limit > 0 {
		totalPages++
	}

	return &PaginatedCategoryResponse{
		Items:      categories,
		Total:      total,
		Page:       query.Page,
		PageSize:   query.Limit,
		TotalPages: totalPages,
	}, nil
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
