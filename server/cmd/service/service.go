package service

import (
	"context"
	"time"

	"github.com/ritchie-gr8/my-blog-app/internal/store"
	"github.com/ritchie-gr8/my-blog-app/internal/store/cache"
	"go.uber.org/zap"
)

type Service struct {
	Users interface {
		Get(ctx context.Context, id int64) (*store.User, error)
		Update(ctx context.Context, user *store.User) error
		Activate(ctx context.Context, token string) error
		GetByEmail(ctx context.Context, email string) (*store.User, error)
		CreateAndInvite(context.Context, *store.User, string, time.Duration) error
	}

	Posts interface {
		Create(ctx context.Context, post *store.Post) error
		Get(ctx context.Context, postID int64) (*store.Post, error)
		Delete(ctx context.Context, postID int64) error
		Update(ctx context.Context, post *store.Post) error
		GetFeed(context.Context, store.PaginatedFeedQuery) ([]store.FeedItem, error)
	}

	Comments interface {
		GetByPostID(ctx context.Context, postID int64) ([]store.Comment, error)
		Create(ctx context.Context, comment *store.Comment) error
	}
}

func NewService(store store.Storage, cacheStore cache.Storage, logger *zap.SugaredLogger) Service {
	return Service{
		Users: &UserService{
			store:      store,
			cacheStore: cacheStore,
			logger:     logger,
		},
		Posts: &PostService{
			store: store,
		},
		Comments: &CommentService{
			store: store,
		},
	}
}
