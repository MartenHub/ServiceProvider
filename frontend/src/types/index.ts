export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  services: MicroService[];
  createdAt: string;
  updatedAt: string;
}

export interface MicroService {
  id: string;
  name: string;
  template: ServiceTemplate;
  database: DatabaseConfig;
  models: DataModel[];
  jwt: JWTConfig;
  routes: RouteConfig[];
  integrations: ServiceIntegration[];
}

export interface ServiceTemplate {
  id: string;
  name: string;
  description: string;
  githubUrl: string;
  language: 'nodejs' | 'golang' | 'python' | 'rust';
  framework: string;
}

export interface DatabaseConfig {
  type: 'postgresql' | 'mongodb' | 'mysql' | 'redis';
  connectionUrl: string;
  name: string;
}

export interface DataModel {
  id: string;
  name: string;
  fields: ModelField[];
  roles: string[];
}

export interface ModelField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  required: boolean;
  validation?: string;
}

export interface JWTConfig {
  secret: string;
  expiration: string;
  algorithm: 'HS256' | 'HS384' | 'HS512';
}

export interface RouteConfig {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  middlewares: string[];
  handler: string;
}

export interface ServiceIntegration {
  id: string;
  name: string;
  url: string;
  type: 'internal' | 'external';
  authentication?: string;
}

export interface YAMLConfig {
  dockerCompose: string;
  kubernetes: string;
  environment: string;
}