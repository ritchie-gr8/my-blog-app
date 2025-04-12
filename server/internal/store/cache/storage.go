package cache

import (
	"context"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/ritchie-gr8/my-blog-app/internal/store"
)

type Storage struct {
	Users interface {
		Get(context.Context, int64) (*store.User, error)
		Set(context.Context, *store.User) error
		Delete(context.Context, int64) error
	}
}

const UserExpTime = time.Minute

func NewRedisStore(redisDB *redis.Client) Storage {
	return Storage{
		Users: &UserStore{
			redisDB: redisDB,
			expTime: UserExpTime,
		},
	}
}
