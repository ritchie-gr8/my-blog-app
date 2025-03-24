package cache

import (
	"context"

	"github.com/ritchie-gr8/my-blog-app/internal/store"
)

func NewMockStore() Storage {
	return Storage{
		Users: &MockUserStore{},
	}
}

type MockUserStore struct{}

func (s *MockUserStore) Get(context.Context, int64) (*store.User, error) {
	return nil, nil
}

func (s *MockUserStore) Set(context.Context, *store.User) error {
	return nil
}

func (s *MockUserStore) Delete(context.Context, int64) error {
	return nil
}
