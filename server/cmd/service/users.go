package service

import (
	"context"
	"fmt"

	"github.com/ritchie-gr8/my-blog-app/internal/store"
	"github.com/ritchie-gr8/my-blog-app/internal/store/cache"
	"go.uber.org/zap"
)

type UserService struct {
	store      store.Storage
	cacheStore cache.Storage
	logger     *zap.SugaredLogger
}

func (s *UserService) Get(ctx context.Context, id int64) (*store.User, error) {
	user, err := s.cacheStore.Users.Get(ctx, id)
	if err == nil {
		return user, nil
	}

	user, err = s.getUser(ctx, id)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *UserService) Update(ctx context.Context, user *store.User) error {
	rowsAffected, err := s.store.Users.Update(ctx, user)
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("user not found or no changes made")
	}

	err = s.cacheStore.Users.Delete(ctx, user.ID)
	if err != nil && err != cache.ErrRedisNotInit {
		s.logger.Warnw("error deleting cache data", "error", err, "userID", user.ID)
	}

	return nil
}

func (s *UserService) Activate(ctx context.Context, token string) error {
	err := s.store.Users.Activate(ctx, token)
	if err != nil {
		return err
	}

	return nil
}

func (s *UserService) getUser(ctx context.Context, userID int64) (*store.User, error) {
	user, err := s.cacheStore.Users.Get(ctx, userID)
	if err != nil && err != cache.ErrRedisNotInit {
		return nil, err
	}

	if user != nil {
		s.logger.Infow("cache hit", "key", "user", "id", userID)
		return user, nil
	}

	s.logger.Infow("fetching user from DB", "id", userID)
	user, err = s.store.Users.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	if err := s.cacheStore.Users.Set(ctx, user); err != nil && err != cache.ErrRedisNotInit {
		return nil, err
	}

	return user, nil
}
