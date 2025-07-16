package repository

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type TokenRepository interface {
	StoreRefreshToken(ctx context.Context, userID uuid.UUID, token string) error
	IsRefreshTokenValid(ctx context.Context, userID uuid.UUID, token string) (bool, error)
}

type tokenRepository struct {
	db *sql.DB
}

func NewTokenRepository(db *sql.DB) TokenRepository {
	return &tokenRepository{db: db}
}

func (r *tokenRepository) StoreRefreshToken(ctx context.Context, userID uuid.UUID, token string) error {
	_, err := r.db.ExecContext(ctx, `
        INSERT INTO refresh_tokens (id, user_id, token, expires_at, is_revoked)
        VALUES ($1, $2, $3, $4, false)
        ON CONFLICT (token) DO UPDATE SET is_revoked = false
    `, uuid.New(), userID, token, time.Now().Add(7*24*time.Hour))
	return err
}

func (r *tokenRepository) IsRefreshTokenValid(ctx context.Context, userID uuid.UUID, token string) (bool, error) {
	var isRevoked bool
	var expiresAt time.Time

	err := r.db.QueryRowContext(ctx, `
        SELECT is_revoked, expires_at FROM refresh_tokens
        WHERE user_id = $1 AND token = $2
    `, userID, token).Scan(&isRevoked, &expiresAt)
	if err != nil {
		return false, err
	}

	if isRevoked || time.Now().After(expiresAt) {
		return false, nil
	}

	return true, nil
}
