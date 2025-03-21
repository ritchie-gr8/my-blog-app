package store

import (
	"net/http"
	"strconv"
)

type PaginatedFeedQuery struct {
	Limit    int    `json:"limit" validate:"gte=1,lte=20"`
	Offset   int    `json:"offset" validate:"gte=0"`
	Sort     string `json:"sort" validate:"oneof=asc desc"`
	Category string `json:"category" validat:"omitempty"`
	Search   string `json:"search" validate:"omitempty,max=100"`
}

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

	offset := queryString.Get("offset")
	if offset != "" {
		fq.Offset = parseIntParam(offset, fq.Offset)
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
