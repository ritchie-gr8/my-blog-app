package store

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/lib/pq"
)

type Category struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type CategoryStore struct {
	db *sql.DB
}

type PaginatedCategoryQuery struct {
	Page  int    `validate:"required,min=1"`
	Limit int    `validate:"required,min=1,max=20"`
	Name  string `validate:"omitempty,max=100"`
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

func (s *CategoryStore) Get(ctx context.Context, query *PaginatedCategoryQuery) ([]Category, int64, error) {
	countQuery, countParams := getCategoriesCountQuery(query)

	var total int64
	err := s.db.QueryRowContext(ctx, countQuery, countParams...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	queryString, queryParams := getCategoriesQuery(query)

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	rows, err := s.db.QueryContext(ctx, queryString, queryParams...)
	if err != nil {
		return nil, 0, err
	}

	defer rows.Close()

	categories := []Category{}

	for rows.Next() {
		var category Category
		if err := rows.Scan(&category.ID, &category.Name); err != nil {
			return nil, 0, err
		}

		categories = append(categories, category)
	}

	if err := rows.Err(); err != nil {
		return nil, 0, err
	}

	return categories, total, nil
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

func getCategoriesCountQuery(query *PaginatedCategoryQuery) (string, []any) {
	queryString := `
		SELECT COUNT(*)
		FROM categories
	`

	whereConditions := []string{}
	var queryParams = []any{}

	if query.Name != "" {
		whereConditions = append(whereConditions, "name ILIKE $1")
		queryParams = append(queryParams, "%"+query.Name+"%")
	}

	if len(whereConditions) > 0 {
		queryString += " WHERE " + strings.Join(whereConditions, " AND ")
	}

	return queryString, queryParams
}

func getCategoriesQuery(query *PaginatedCategoryQuery) (string, []any) {
	queryString := `
		SELECT id, name
		FROM categories
	`

	whereConditions := []string{}
	var queryParams = []any{}

	if query.Name != "" {
		whereConditions = append(whereConditions, fmt.Sprintf("name ILIKE $%d", len(queryParams)+1))
		queryParams = append(queryParams, "%"+query.Name+"%")
	}

	if len(whereConditions) > 0 {
		queryString += " WHERE " + strings.Join(whereConditions, " AND ")
	}

	queryString += " ORDER BY id ASC"

	queryString += fmt.Sprintf(" LIMIT $%d", len(queryParams)+1)
	queryParams = append(queryParams, query.Limit)

	if query.Page > 1 {
		offset := (query.Page - 1) * query.Limit
		queryString += fmt.Sprintf(" OFFSET $%d", len(queryParams)+1)
		queryParams = append(queryParams, offset)
	}

	return queryString, queryParams
}

func (cq *PaginatedCategoryQuery) Parse(r *http.Request) (*PaginatedCategoryQuery, error) {
	queryString := r.URL.Query()

	parseIntParam := func(param string, fallback int) int {
		value, err := strconv.Atoi(param)
		if err != nil {
			return fallback
		}

		return value
	}

	limit := queryString.Get("limit")
	if limit != "" {
		fmt.Println("limit", limit)
		cq.Limit = parseIntParam(limit, cq.Limit)
	}

	page := queryString.Get("page")
	if page != "" {
		cq.Page = parseIntParam(page, 1)
	}

	if name := queryString.Get("name"); name != "" {
		cq.Name = name
	}

	return cq, nil
}
