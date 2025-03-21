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

	parseIntParam := func(param string) (int, error) {
		value := queryString.Get(param)
		if value == "" {
			return 0, nil
		}

		return strconv.Atoi(value)
	}

	if limit, err := parseIntParam("limit"); err != nil {
		return fq, err
	} else if limit >= 0 {
		fq.Limit = limit
	}

	if offset, err := parseIntParam("offset"); err != nil {
		return fq, err
	} else if offset >= 0 {
		fq.Offset = offset
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
