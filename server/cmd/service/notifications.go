package service

import (
	"context"
	"fmt"

	"github.com/ritchie-gr8/my-blog-app/internal/store"
)

type NotificationService struct {
	store store.Storage
}

// CreateNotification creates a generic notification
func (s *NotificationService) CreateNotification(ctx context.Context, notification *store.Notification) error {
	return s.store.Notifications.Create(ctx, notification)
}

// CreateLikeNotification creates a notification when a post is liked
func (s *NotificationService) CreateLikeNotification(ctx context.Context, postID, actorID int64) error {
	// Get post first to find the post owner
	post, err := s.store.Posts.GetByID(ctx, postID, 0)
	if err != nil {
		return err
	}

	// Don't notify if someone likes their own post
	if post.UserID == actorID {
		return nil
	}

	// Get actor info for the notification message
	actor, err := s.store.Users.GetByID(ctx, actorID)
	if err != nil {
		return err
	}

	notification := &store.Notification{
		UserID:    post.UserID,
		Type:      "like",
		RelatedID: postID,
		ActorID:   actorID,
		Message:   fmt.Sprintf("%s liked your post", actor.Name),
		IsRead:    false,
	}

	return s.store.Notifications.Create(ctx, notification)
}

// CreateCommentNotification creates a notification when a post is commented on
func (s *NotificationService) CreateCommentNotification(ctx context.Context, postID, actorID int64) error {
	// Get post to find the post owner
	post, err := s.store.Posts.GetByID(ctx, postID, 0)
	if err != nil {
		return err
	}

	// Don't notify if someone comments on their own post
	if post.UserID == actorID {
		return nil
	}

	// Get actor info for the notification message
	actor, err := s.store.Users.GetByID(ctx, actorID)
	if err != nil {
		return err
	}

	notification := &store.Notification{
		UserID:    post.UserID,
		Type:      "comment",
		RelatedID: postID,
		ActorID:   actorID,
		Message:   fmt.Sprintf("%s commented on your post", actor.Name),
		IsRead:    false,
	}

	return s.store.Notifications.Create(ctx, notification)
}

func (s *NotificationService) GetUserNotifications(ctx context.Context, userID int64, limit, offset int) ([]*store.Notification, error) {
	return s.store.Notifications.GetByUserID(ctx, userID, limit, offset)
}

func (s *NotificationService) GetNotification(ctx context.Context, id int64) (*store.Notification, error) {
	return s.store.Notifications.Get(ctx, id)
}

func (s *NotificationService) CountUnreadNotifications(ctx context.Context, userID int64) (int64, error) {
	return s.store.Notifications.CountUnread(ctx, userID)
}

func (s *NotificationService) MarkNotificationAsRead(ctx context.Context, id int64, userID int64) error {
	return s.store.Notifications.MarkAsRead(ctx, id, userID)
}

func (s *NotificationService) MarkAllNotificationsAsRead(ctx context.Context, userID int64) error {
	return s.store.Notifications.MarkAllAsRead(ctx, userID)
}
