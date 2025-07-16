package handler

import (
	"github.com/MartenHub/MyLifeMap/internal/service"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, authService service.AuthService, tokenService service.TokenService) {
	h := NewAuthHandler(authService, tokenService)

	api := r.Group("/api/auth")
	{
		api.POST("/register", h.Register)
		api.POST("/login", h.Login)
		api.POST("/refresh", h.RefreshToken)
		api.POST("/verify-token", h.Verify)
	}
}
