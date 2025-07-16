package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"github.com/MartenHub/MyLifeMap/config"
	"github.com/MartenHub/MyLifeMap/internal/database"
	"github.com/MartenHub/MyLifeMap/internal/handler"
	"github.com/MartenHub/MyLifeMap/internal/repository"
	"github.com/MartenHub/MyLifeMap/internal/service"
)

func main() {
	cfg := config.Load()
	db := database.NewPostgres(cfg)

	userRepo := repository.NewUserRepository(db)
	tokenRepo := repository.NewTokenRepository(db)
	tokenSvc := service.NewTokenService(cfg.JWTSecret)
	authSvc := service.NewAuthService(userRepo, tokenRepo, tokenSvc)

	r := gin.Default()
	handler.RegisterRoutes(r, authSvc, tokenSvc)

	log.Println("🚀 Authentication service running at", cfg.Port)
	r.Run(cfg.Port)
}
