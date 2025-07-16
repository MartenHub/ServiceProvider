package database

import (
	"database/sql"
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func RunMigrations(db *sql.DB) {
	driver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		log.Fatalf("migration driver hatası: %v", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://migration", // migration dosyaları bu klasörde olacak
		"postgres", driver,
	)
	if err != nil {
		log.Fatalf("migrate init hatası: %v", err)
	}

	if err := m.Up(); err != nil && err.Error() != "no change" {
		log.Fatalf("migration error: %v", err)
	}

	log.Println("✅ Migration işlemi tamam")
}
