package handler

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/MartenHub/MyLifeMap/internal/service"
)

// ContextKeyUserID sabiti, request context'ine eklenecek anahtardır.
const ContextKeyUserID = "user_id"

// AuthMiddleware, JWT access token'ı doğrulayan ve kullanıcıyı context'e ekleyen middleware'dir.
func AuthMiddleware(tokenService service.TokenService) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing or malformed"})
			return
		}

		// "Bearer " prefix'ini çıkar
		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		// Token'ı doğrula
		userID, err := tokenService.ValidateAccessToken(tokenStr)
		if err != nil || userID == uuid.Nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		// Kullanıcıyı context'e yerleştir
		c.Set(ContextKeyUserID, userID)

		// İşlemi devam ettir
		c.Next()
	}
}
