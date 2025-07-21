package authconfigurator

import "net/http"

type DatabaseType string

const (
	PostgreSQL DatabaseType = "postgres"
	MongoDB    DatabaseType = "mongo"
)

type Config struct {
	Database    DatabaseConfig
	Models      []interface{}
	Middlewares []MiddlewareFunc
	Endpoints   []EndpointConfig
}

type DatabaseConfig struct {
	Type     DatabaseType
	URL      string
	User     string
	Password string
	Name     string
}

type MiddlewareFunc func(http.Handler) http.Handler

type EndpointConfig struct {
	Method  string
	Path    string
	Handler http.HandlerFunc
}
