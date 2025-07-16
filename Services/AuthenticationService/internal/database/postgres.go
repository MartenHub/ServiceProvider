package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/MartenHub/MyLifeMap/config"
	_ "github.com/lib/pq"
	// PostgreSQL driver
)

func NewPostgres(cfg *config.Config) *sql.DB {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName,
	)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("could not open DB: %v", err)
	}

	// Bağlantı kontrolü
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := db.PingContext(ctx); err != nil {
		log.Fatalf("could not ping DB: %v", err)
	}

	log.Println("✅ PostgreSQL bağlantısı kuruldu")
	return db
}
