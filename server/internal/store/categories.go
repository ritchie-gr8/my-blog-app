package store

import (
	"context"
	"database/sql"

	"github.com/lib/pq"
)

type Category struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type CategoryStore struct {
	db *sql.DB
}

func (s *CategoryStore) Create(ctx context.Context, category *Category) error {
	query := `
		INSERT INTO categories (name)
		VALUES ($1)
		RETURNING id
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	if err := s.db.QueryRowContext(ctx, query, category.Name).Scan(&category.ID); err != nil {
		switch {
		case err.(*pq.Error) != nil:
			pqErr := err.(*pq.Error)
			if pqErr.Code == "23505" {
				return ErrUniqueViolation
			}
		default:
			return err
		}
	}

	return nil
}

func (s *CategoryStore) GetAll(ctx context.Context) ([]*Category, error) {
	query := `
		SELECT id, name
		FROM categories
		ORDER BY name
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	rows, err := s.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	categories := []*Category{}

	for rows.Next() {
		var category Category
		if err := rows.Scan(&category.ID, &category.Name); err != nil {
			return nil, err
		}

		categories = append(categories, &category)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return categories, nil
}

func (s *CategoryStore) GetByID(ctx context.Context, id int64) (*Category, error) {
	query := `
		SELECT id, name
		FROM categories
		WHERE id = $1
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	var category Category
	if err := s.db.QueryRowContext(ctx, query, id).Scan(&category.ID, &category.Name); err != nil {
		switch err {
		case sql.ErrNoRows:
			return nil, ErrNotFound
		default:
			return nil, err
		}
	}

	return &category, nil
}

func (s *CategoryStore) Delete(ctx context.Context, id int64) error {
	query := `
		DELETE FROM categories WHERE id = $1
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	res, err := s.db.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return ErrNotFound
	}

	return nil
}

func (s *CategoryStore) Update(ctx context.Context, category *Category) error {
	query := `
		UPDATE categories SET name = $1 WHERE id = $2
	`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	_, err := s.db.ExecContext(
		ctx, query,
		category.Name,
		category.ID,
	)
	if err != nil {
		switch {
		case err.(*pq.Error) != nil:
			pqErr := err.(*pq.Error)
			if pqErr.Code == "23505" {
				return ErrUniqueViolation
			}
		default:
			return err
		}
	}

	return nil
}
