package model

import (
	"time"

	"github.com/google/uuid"
)

// User veritabanı tablosunu temsil eder (users tablosu)
type User struct {
	ID           uuid.UUID `db:"id"`
	Email        string    `db:"email"`
	PasswordHash string    `db:"password_hash"`
	IsVerified   bool      `db:"is_verified"`
	CreatedAt    time.Time `db:"created_at"`
}

// RegisterRequest kullanıcı kayıt endpoint'inde gelen veriyi tutar
type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// LoginRequest kullanıcı giriş endpoint'inde gelen veriyi tutar
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type VerifyAuthenticationTokenRequest struct {
	Token string `json:"token" binding:"required"`
}
