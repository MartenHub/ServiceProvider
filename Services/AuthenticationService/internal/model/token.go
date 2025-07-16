package model

import (
	"time"

	"github.com/google/uuid"
)

// RefreshToken sistemi — refresh_tokens tablosuna karşılık gelir
type RefreshToken struct {
	ID        uuid.UUID `db:"id"`
	UserID    uuid.UUID `db:"user_id"`
	Token     string    `db:"token"`
	ExpiresAt time.Time `db:"expires_at"`
	IsRevoked bool      `db:"is_revoked"`
}
