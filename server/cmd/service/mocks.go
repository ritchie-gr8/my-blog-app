package service

import (
	"context"
	"time"

	"github.com/ritchie-gr8/my-blog-app/internal/store"
)

func NewMockService() Service {
	return Service{
		Users: &MockUserService{},
	}
}

type MockUserService struct {
}

func (s *MockUserService) Get(ctx context.Context, id int64) (*store.User, error) {
	return &store.User{ID: id}, nil
}

func (s *MockUserService) Update(ctx context.Context, user *store.User) error {
	return nil
}
func (s *MockUserService) Activate(ctx context.Context, token string) error {
	return nil
}

func (s *MockUserService) GetByEmail(ctx context.Context, email string) (*store.User, error) {
	return nil, nil
}

func (s *MockUserService) CreateUserWithInvitation(ctx context.Context, user *store.User, hashToken string, exp time.Duration) error {
	return nil
}

func (s *MockUserService) UpdatePassword(ctx context.Context, user *store.User) error {
	return nil
}
