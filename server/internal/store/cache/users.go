package cache

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/ritchie-gr8/my-blog-app/internal/store"
)

type UserStore struct {
	redisDB *redis.Client
	expTime time.Duration
}

var ErrRedisNotInit = errors.New("redis client not initialized")

func (s *UserStore) Get(ctx context.Context, userID int64) (*store.User, error) {
	if s.redisDB == nil {
		return nil, ErrRedisNotInit
	}

	cacheKey := userCacheKey(userID)
	data, err := s.redisDB.Get(ctx, cacheKey).Result()

	if err == redis.Nil {
		return nil, nil
	} else if err != nil {
		return nil, fmt.Errorf("redis get error: %w", err)
	}

	var user store.User
	if err := json.Unmarshal([]byte(data), &user); err != nil {
		return nil, fmt.Errorf("failed to unmarshal user data: %w", err)
	}

	return &user, nil
}

func (s *UserStore) Set(ctx context.Context, user *store.User) error {
	if s.redisDB == nil {
		return ErrRedisNotInit
	}

	if user == nil {
		return fmt.Errorf("cannot cache nil user")
	}

	if user.ID == 0 {
		return fmt.Errorf("user has invalid ID")
	}

	cacheKey := userCacheKey(user.ID)
	userData, err := json.Marshal(user)
	if err != nil {
		return fmt.Errorf("failed to marshal user data: %w", err)
	}

	if err := s.redisDB.SetEX(ctx, cacheKey, userData, s.expTime).Err(); err != nil {
		return fmt.Errorf("redis set error: %w", err)
	}

	return nil
}

func (s *UserStore) Delete(ctx context.Context, userID int64) error {
	if s.redisDB == nil {
		return ErrRedisNotInit
	}

	cacheKey := userCacheKey(userID)
	if err := s.redisDB.Del(ctx, cacheKey).Err(); err != nil {
		return fmt.Errorf("redis delete error: %w", err)
	}

	return nil
}

func userCacheKey(userID int64) string {
	return fmt.Sprintf("user:%d", userID)
}
