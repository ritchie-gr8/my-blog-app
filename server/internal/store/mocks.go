package store

import (
	"context"
	"database/sql"
	"time"
)

func NewMockStore() Storage {
	return Storage{
		Users: &MockUserStore{},
	}
}

type MockUserStore struct{}

func (m *MockUserStore) Create(ctx context.Context, tx *sql.Tx, u *User) error {
	return nil
}

func (m *MockUserStore) Activate(context.Context, string) error {
	return nil
}

func (m *MockUserStore) CreateAndInvite(context.Context, *User, string, time.Duration) error {
	return nil
}

func (m *MockUserStore) Update(context.Context, *User) (int64, error) {
	return 0, nil
}

func (m *MockUserStore) Delete(context.Context, int64) error {
	return nil
}

func (m *MockUserStore) GetByEmail(context.Context, string) (*User, error) {
	return nil, nil
}

func (m *MockUserStore) GetByID(ctx context.Context, id int64) (*User, error) {
	return nil, nil
}
