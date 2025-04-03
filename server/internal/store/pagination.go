package store

import (
	"net/http"
	"strconv"
)

type PaginatedFeedQuery struct {
	Limit    int    `json:"limit" validate:"gte=1,lte=20"`
	Page     int    `json:"page" validate:"gte=1"`
	Sort     string `json:"sort" validate:"oneof=asc desc"`
	Category string `json:"category" validat:"omitempty"`
	Search   string `json:"search" validate:"omitempty,max=100"`
}

// Parse extracts pagination parameters from the request query string
func (fq PaginatedFeedQuery) Parse(r *http.Request) (PaginatedFeedQuery, error) {
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
		fq.Limit = parseIntParam(limit, fq.Limit)
	}

	page := queryString.Get("page")
	if page != "" {
		// Page is 1-indexed (first page is 1, not 0)
		fq.Page = parseIntParam(page, 1)
	}

	if sort := queryString.Get("sort"); sort != "" {
		fq.Sort = sort
	}

	if category := queryString.Get("category"); category != "" {
		fq.Category = category
	}

	if search := queryString.Get("search"); search != "" {
		fq.Search = search
	}

	return fq, nil
}

// GetOffset calculates the offset for SQL LIMIT/OFFSET pagination from the page number
func (fq PaginatedFeedQuery) GetOffset() int {
	return (fq.Page - 1) * fq.Limit
}
