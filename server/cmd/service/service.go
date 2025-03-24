package service

import (
	"context"

	"github.com/ritchie-gr8/my-blog-app/internal/store"
	"github.com/ritchie-gr8/my-blog-app/internal/store/cache"
	"go.uber.org/zap"
)

type Service struct {
	Users interface {
		Get(ctx context.Context, id int64) (*store.User, error)
		// Create(ctx context.Context, user *store.User) (int64, error)
		Update(ctx context.Context, user *store.User) error
		Activate(ctx context.Context, token string) error
	}
}

func NewService(store store.Storage, cacheStore cache.Storage, logger *zap.SugaredLogger) Service {
	return Service{
		Users: &UserService{
			store:      store,
			cacheStore: cacheStore,
			logger:     logger,
		},
	}
}
