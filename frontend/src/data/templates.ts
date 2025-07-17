import { ServiceTemplate } from '../types';

export const serviceTemplates: ServiceTemplate[] = [
  {
    id: 'node-express-rest',
    name: 'Express REST API',
    description: 'Node.js REST API using Express.js with middleware support',
    githubUrl: 'https://github.com/templates/express-rest-api',
    language: 'nodejs',
    framework: 'Express.js'
  },
  {
    id: 'node-fastify-graphql',
    name: 'Fastify GraphQL API',
    description: 'High-performance Node.js GraphQL API using Fastify',
    githubUrl: 'https://github.com/templates/fastify-graphql',
    language: 'nodejs',
    framework: 'Fastify'
  },
  {
    id: 'go-gin-rest',
    name: 'Gin REST API',
    description: 'Go REST API using Gin framework with high performance',
    githubUrl: 'https://github.com/templates/gin-rest-api',
    language: 'golang',
    framework: 'Gin'
  },
  {
    id: 'go-fiber-rest',
    name: 'Fiber REST API',
    description: 'Go REST API using Fiber framework inspired by Express',
    githubUrl: 'https://github.com/templates/fiber-rest-api',
    language: 'golang',
    framework: 'Fiber'
  },
  {
    id: 'python-fastapi',
    name: 'FastAPI REST API',
    description: 'Modern Python REST API using FastAPI with automatic docs',
    githubUrl: 'https://github.com/templates/fastapi-rest-api',
    language: 'python',
    framework: 'FastAPI'
  },
  {
    id: 'python-flask',
    name: 'Flask REST API',
    description: 'Lightweight Python REST API using Flask framework',
    githubUrl: 'https://github.com/templates/flask-rest-api',
    language: 'python',
    framework: 'Flask'
  },
  {
    id: 'rust-actix',
    name: 'Actix Web API',
    description: 'High-performance Rust REST API using Actix Web',
    githubUrl: 'https://github.com/templates/actix-web-api',
    language: 'rust',
    framework: 'Actix Web'
  },
  {
    id: 'rust-warp',
    name: 'Warp REST API',
    description: 'Rust REST API using Warp framework with filters',
    githubUrl: 'https://github.com/templates/warp-rest-api',
    language: 'rust',
    framework: 'Warp'
  }
];