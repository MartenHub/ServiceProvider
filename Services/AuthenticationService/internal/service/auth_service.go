package service

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"github.com/MartenHub/MyLifeMap/internal/model"
	"github.com/MartenHub/MyLifeMap/internal/repository"
)

// AuthService interface'i, dışa açılacak yetkili fonksiyonları tanımlar.
type AuthService interface {
	Register(ctx context.Context, req model.RegisterRequest) error
	Login(ctx context.Context, req model.LoginRequest) (string, string, error)
	RefreshToken(ctx context.Context, refresh string) (string, string, error)
	VerifyAuthenticationToken(ctx context.Context, token string) (uuid.UUID, error)
}

// authService, AuthService interface'ini implemente eden struct'tır (internal kullanılır).
type authService struct {
	userRepo   repository.UserRepository
	tokenRepo  repository.TokenRepository
	tokenLogic TokenService
}

// NewAuthService, AuthService interface'ini döner.
func NewAuthService(u repository.UserRepository, t repository.TokenRepository, logic TokenService) AuthService {
	return &authService{
		userRepo:   u,
		tokenRepo:  t,
		tokenLogic: logic,
	}
}

func (s *authService) Register(ctx context.Context, req model.RegisterRequest) error {
	existing, _ := s.userRepo.GetByEmail(ctx, req.Email)
	if existing != nil {
		return errors.New("user already exists")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user := &model.User{
		ID:           uuid.New(),
		Email:        req.Email,
		PasswordHash: string(hashed),
		CreatedAt:    time.Now(),
		IsVerified:   false,
	}

	return s.userRepo.CreateUser(ctx, user)
}

func (s *authService) Login(ctx context.Context, req model.LoginRequest) (string, string, error) {
	user, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err != nil || user == nil {
		return "", "", errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return "", "", errors.New("invalid credentials")
	}

	access, err := s.tokenLogic.GenerateAccessToken(user.ID)
	if err != nil {
		return "", "", err
	}

	refresh, err := s.tokenLogic.GenerateRefreshToken(user.ID)
	if err != nil {
		return "", "", err
	}

	err = s.tokenRepo.StoreRefreshToken(ctx, user.ID, refresh)
	return access, refresh, err
}

func (s *authService) RefreshToken(ctx context.Context, refresh string) (string, string, error) {
	userID, err := s.tokenLogic.ValidateRefreshToken(refresh)
	if err != nil {
		return "", "", err
	}

	valid, err := s.tokenRepo.IsRefreshTokenValid(ctx, userID, refresh)
	if err != nil || !valid {
		return "", "", errors.New("invalid or expired refresh token")
	}

	access, err := s.tokenLogic.GenerateAccessToken(userID)
	if err != nil {
		return "", "", err
	}

	newRefresh, err := s.tokenLogic.GenerateRefreshToken(userID)
	if err != nil {
		return "", "", err
	}

	err = s.tokenRepo.StoreRefreshToken(ctx, userID, newRefresh)
	return access, newRefresh, err
}

func (s *authService) VerifyAuthenticationToken(ctx context.Context, token string) (uuid.UUID, error) {
	userID, err := s.tokenLogic.ValidateAccessToken(token)
	if err != nil {
		return uuid.Nil, err
	}

	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil || user == nil {
		return uuid.Nil, errors.New("user not found")
	}

	return user.ID, nil
}
