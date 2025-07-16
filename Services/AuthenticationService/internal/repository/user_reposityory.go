package repository

import (
	"context"
	"database/sql"

	"github.com/MartenHub/MyLifeMap/internal/model"
	"github.com/google/uuid"
)

type UserRepository interface {
	CreateUser(ctx context.Context, user *model.User) error
	GetByEmail(ctx context.Context, email string) (*model.User, error)
	GetByID(ctx context.Context, id uuid.UUID) (*model.User, error)
}

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) CreateUser(ctx context.Context, user *model.User) error {
	_, err := r.db.ExecContext(ctx, `
        INSERT INTO users (id, email, password_hash, is_verified, created_at)
        VALUES ($1, $2, $3, $4, $5)
    `, user.ID, user.Email, user.PasswordHash, user.IsVerified, user.CreatedAt)

	return err
}

func (r *userRepository) GetByEmail(ctx context.Context, email string) (*model.User, error) {
	row := r.db.QueryRowContext(ctx, `
        SELECT id, email, password_hash, is_verified, created_at
        FROM users
        WHERE email = $1
    `, email)

	var user model.User
	err := row.Scan(&user.ID, &user.Email, &user.PasswordHash, &user.IsVerified, &user.CreatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}

	return &user, err
}
func (r *userRepository) GetByID(ctx context.Context, id uuid.UUID) (*model.User, error) {
	row := r.db.QueryRowContext(ctx, `
        SELECT id, email, password_hash, is_verified, created_at
        FROM users
        WHERE id = $1
    `, id)

	var user model.User
	err := row.Scan(&user.ID, &user.Email, &user.PasswordHash, &user.IsVerified, &user.CreatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &user, err
}
