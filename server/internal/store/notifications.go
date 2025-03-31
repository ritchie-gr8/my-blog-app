package store

import (
	"context"
	"database/sql"
	"errors"
)

type Notification struct {
	ID        int64  `json:"id"`
	UserID    int64  `json:"user_id"`
	Type      string `json:"type"` // "like", "comment", etc.
	RelatedID int64  `json:"related_id"`
	ActorID   int64  `json:"actor_id"`
	Message   string `json:"message"`
	IsRead    bool   `json:"is_read"`
	CreatedAt string `json:"created_at"`
	Actor     *User  `json:"actor,omitempty"`
}

type NotificationStore struct {
	db *sql.DB
}

func (s *NotificationStore) Create(ctx context.Context, notification *Notification) error {
	query := `
		INSERT INTO notifications 
		(user_id, type, related_id, actor_id, message, is_read)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at
	`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	err := s.db.QueryRowContext(
		ctx,
		query,
		notification.UserID,
		notification.Type,
		notification.RelatedID,
		notification.ActorID,
		notification.Message,
		notification.IsRead,
	).Scan(
		&notification.ID,
		&notification.CreatedAt,
	)

	if err != nil {
		return err
	}

	return nil
}

func (s *NotificationStore) Get(ctx context.Context, id int64) (*Notification, error) {
	query := `
		SELECT 
			n.id, n.user_id, n.type, n.related_id, n.actor_id, n.message, n.is_read, n.created_at,
			u.name as actor_name, u.profile_picture as actor_profile_picture
		FROM notifications n
		LEFT JOIN users u ON n.actor_id = u.id
		WHERE n.id = $1
	`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	var notification Notification
	var actorName, actorProfilePicture sql.NullString

	err := s.db.QueryRowContext(ctx, query, id).Scan(
		&notification.ID,
		&notification.UserID,
		&notification.Type,
		&notification.RelatedID,
		&notification.ActorID,
		&notification.Message,
		&notification.IsRead,
		&notification.CreatedAt,
		&actorName,
		&actorProfilePicture,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrNotFound
		default:
			return nil, err
		}
	}

	if actorName.Valid {
		notification.Actor = &User{
			ID:             notification.ActorID,
			Name:           actorName.String,
			ProfilePicture: actorProfilePicture.String,
		}
	}

	return &notification, nil
}

func (s *NotificationStore) GetByUserID(ctx context.Context, userID int64, limit, offset int) ([]*Notification, error) {
	query := `
		SELECT 
			n.id, n.user_id, n.type, n.related_id, n.actor_id, n.message, n.is_read, n.created_at,
			u.name as actor_name, u.profile_picture as actor_profile_picture
		FROM notifications n
		LEFT JOIN users u ON n.actor_id = u.id
		WHERE n.user_id = $1
		ORDER BY n.created_at DESC
		LIMIT $2 OFFSET $3
	`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	rows, err := s.db.QueryContext(ctx, query, userID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notifications []*Notification
	for rows.Next() {
		var notification Notification
		var actorName, actorProfilePicture sql.NullString

		err := rows.Scan(
			&notification.ID,
			&notification.UserID,
			&notification.Type,
			&notification.RelatedID,
			&notification.ActorID,
			&notification.Message,
			&notification.IsRead,
			&notification.CreatedAt,
			&actorName,
			&actorProfilePicture,
		)
		if err != nil {
			return nil, err
		}

		if actorName.Valid {
			notification.Actor = &User{
				ID:             notification.ActorID,
				Name:           actorName.String,
				ProfilePicture: actorProfilePicture.String,
			}
		}

		notifications = append(notifications, &notification)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return notifications, nil
}

func (s *NotificationStore) CountUnread(ctx context.Context, userID int64) (int64, error) {
	query := `
		SELECT COUNT(*) 
		FROM notifications 
		WHERE user_id = $1 AND is_read = false
	`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	var count int64
	err := s.db.QueryRowContext(ctx, query, userID).Scan(&count)
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (s *NotificationStore) MarkAsRead(ctx context.Context, id int64, userID int64) error {
	query := `
		UPDATE notifications
		SET is_read = true
		WHERE id = $1 AND user_id = $2
	`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	result, err := s.db.ExecContext(ctx, query, id, userID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return ErrNotFound
	}

	return nil
}

func (s *NotificationStore) MarkAllAsRead(ctx context.Context, userID int64) error {
	query := `
		UPDATE notifications
		SET is_read = true
		WHERE user_id = $1 AND is_read = false
	`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	_, err := s.db.ExecContext(ctx, query, userID)
	if err != nil {
		return err
	}

	return nil
}
