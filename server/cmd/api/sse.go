package main

import (
	"encoding/json"
	"sync"

	"github.com/ritchie-gr8/my-blog-app/internal/store"
)

type SSEClient struct {
	UserID     int64
	Connection chan []byte
}

type SSEManager struct {
	clients map[int64]*SSEClient
	mutex   sync.RWMutex
}

func NewSSEManager() *SSEManager {
	return &SSEManager{
		clients: make(map[int64]*SSEClient),
	}
}

func (m *SSEManager) AddClient(userID int64) *SSEClient {
	m.mutex.Lock()
	defer m.mutex.Unlock()

	if client, exists := m.clients[userID]; exists {
		return client
	}

	client := &SSEClient{
		UserID:     userID,
		Connection: make(chan []byte, 10),
	}

	m.clients[userID] = client
	return client
}

func (m *SSEManager) RemoveClient(userID int64) {
	m.mutex.Lock()
	defer m.mutex.Unlock()

	if client, exists := m.clients[userID]; exists {
		close(client.Connection)
		delete(m.clients, userID)
	}
}

func (m *SSEManager) SendToUser(userID int64, notification *store.Notification) {
	m.mutex.RLock()
	defer m.mutex.RUnlock()

	client, exists := m.clients[userID]
	if !exists {
		return
	}

	data, err := json.Marshal(notification)
	if err != nil {
		return
	}

	select {
	case client.Connection <- data:
	default:
	}
}

func (m *SSEManager) BroadcastToAll(notification *store.Notification) {
	m.mutex.RLock()
	defer m.mutex.RUnlock()

	data, err := json.Marshal(notification)
	if err != nil {
		return
	}

	for _, client := range m.clients {
		select {
		case client.Connection <- data:
		default:
		}
	}
}
