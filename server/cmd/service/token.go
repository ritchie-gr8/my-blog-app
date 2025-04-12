package service

import (
	"crypto/sha256"
	"encoding/hex"

	"github.com/google/uuid"
	"go.uber.org/zap"
)

type TokenService struct {
	logger *zap.SugaredLogger
}

func (th *TokenService) GenerateActivationToken() (plainToken string, hashedToken string) {
	plainToken = uuid.New().String()
	hash := sha256.Sum256([]byte(plainToken))
	hashedToken = hex.EncodeToString(hash[:])
	return plainToken, hashedToken
}
