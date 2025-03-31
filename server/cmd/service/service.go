package service

import (
	"context"
	"time"

	"github.com/ritchie-gr8/my-blog-app/internal/mailer"
	"github.com/ritchie-gr8/my-blog-app/internal/store"
	"github.com/ritchie-gr8/my-blog-app/internal/store/cache"
	"go.uber.org/zap"
)

type emailConfig struct {
	env         string
	frontendURL string
	mailer      mailer.Client
}

func NewEmailConfig(env, frontendURL string, mailer mailer.Client) *emailConfig {
	return &emailConfig{
		env:         env,
		frontendURL: frontendURL,
		mailer:      mailer,
	}
}

type Service struct {
	Users interface {
		Get(ctx context.Context, id int64) (*store.User, error)
		Update(ctx context.Context, user *store.User) error
		Activate(ctx context.Context, token string) error
		GetByEmail(ctx context.Context, email string) (*store.User, error)
		CreateUserWithInvitation(ctx context.Context, user *store.User, hashToken string, exp time.Duration) error
		UpdatePassword(ctx context.Context, user *store.User) error
	}

	Posts interface {
		Create(ctx context.Context, post *store.Post) error
		Get(ctx context.Context, postID int64, userID int64) (*store.Post, error)
		Delete(ctx context.Context, postID int64) error
		Update(ctx context.Context, post *store.Post) error
		GetFeed(context.Context, store.PaginatedFeedQuery) ([]store.FeedItem, error)
	}

	Comments interface {
		GetByPostID(ctx context.Context, postID int64) ([]store.Comment, error)
		Create(ctx context.Context, comment *store.Comment) error
	}

	Emails interface {
		SendWelcomeEmail(user *store.User, activationURL string) (int, error)
		GenerateActivationURL(token string) string
	}

	Tokens interface {
		GenerateActivationToken() (plainToken string, hashedToken string)
	}

	Categories interface {
		Create(ctx context.Context, category *store.Category) error
		GetAll(ctx context.Context) ([]*store.Category, error)
		Delete(ctx context.Context, id int64) error
		Update(ctx context.Context, category *store.Category) error
	}

	PostLikes interface {
		LikePost(ctx context.Context, postID, userID int64) error
		UnlikePost(ctx context.Context, postID, userID int64) error
		GetLikesCount(ctx context.Context, postID int64) (int64, error)
		HasUserLiked(ctx context.Context, postID, userID int64) (bool, error)
	}

	Notifications interface {
		CreateNotification(ctx context.Context, notification *store.Notification) error
		CreateLikeNotification(ctx context.Context, postID, actorID int64) error
		CreateCommentNotification(ctx context.Context, postID, commentID, actorID int64) error
		GetUserNotifications(ctx context.Context, userID int64, limit, offset int) ([]*store.Notification, error)
		GetNotification(ctx context.Context, id int64) (*store.Notification, error)
		CountUnreadNotifications(ctx context.Context, userID int64) (int64, error)
		MarkNotificationAsRead(ctx context.Context, id int64, userID int64) error
		MarkAllNotificationsAsRead(ctx context.Context, userID int64) error
	}
}

func NewService(store store.Storage, cacheStore cache.Storage,
	logger *zap.SugaredLogger, emailConfig emailConfig) Service {
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
		Emails: &EmailService{
			mailer:      emailConfig.mailer,
			env:         emailConfig.env,
			frontendURL: emailConfig.frontendURL,
		},
		Tokens: &TokenService{
			logger: logger,
		},
		Categories: &CategoryService{
			store: store,
		},
		PostLikes: &PostLikeService{
			store: store,
		},
		Notifications: &NotificationService{
			store: store,
		},
	}
}
