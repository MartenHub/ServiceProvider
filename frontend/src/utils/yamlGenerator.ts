import { Project, MicroService, YAMLConfig } from '../types';

export const generateYAMLConfig = (project: Project): YAMLConfig => {
  const dockerCompose = generateDockerCompose(project);
  const kubernetes = generateKubernetes(project);
  const environment = generateEnvironment(project);

  return {
    dockerCompose,
    kubernetes,
    environment
  };
};

const generateDockerCompose = (project: Project): string => {
  const services = project.services.map(service => {
    const dbConfig = service.database;
    const envVars = [
      `DATABASE_URL=${dbConfig.connectionUrl}`,
      `JWT_SECRET=${service.jwt.secret}`,
      `JWT_EXPIRATION=${service.jwt.expiration}`,
      `NODE_ENV=production`
    ];

    return `  ${service.name}:
    build:
      context: ./${service.name}
      dockerfile: Dockerfile
    ports:
      - "${3000 + parseInt(service.id)}:3000"
    environment:
${envVars.map(env => `      - ${env}`).join('\n')}
    depends_on:
      - ${service.name}-db
    networks:
      - ${project.name.toLowerCase()}-network

  ${service.name}-db:
    image: ${getDbImage(service.database.type)}
    ports:
      - "${5432 + parseInt(service.id)}:${getDbPort(service.database.type)}"
    environment:
      - POSTGRES_DB=${dbConfig.name}
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - ${service.name}-db-data:/var/lib/postgresql/data
    networks:
      - ${project.name.toLowerCase()}-network`;
  }).join('\n\n');

  return `version: '3.8'

services:
${services}

volumes:
${project.services.map(s => `  ${s.name}-db-data:`).join('\n')}

networks:
  ${project.name.toLowerCase()}-network:
    driver: bridge`;
};

const generateKubernetes = (project: Project): string => {
  const deployments = project.services.map(service => {
    return `---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${service.name}
  labels:
    app: ${service.name}
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ${service.name}
  template:
    metadata:
      labels:
        app: ${service.name}
    spec:
      containers:
      - name: ${service.name}
        image: ${service.name}:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: ${service.name}-secrets
              key: database-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: ${service.name}-secrets
              key: jwt-secret

---
apiVersion: v1
kind: Service
metadata:
  name: ${service.name}-service
spec:
  selector:
    app: ${service.name}
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer

---
apiVersion: v1
kind: Secret
metadata:
  name: ${service.name}-secrets
type: Opaque
stringData:
  database-url: "${service.database.connectionUrl}"
  jwt-secret: "${service.jwt.secret}"`;
  }).join('\n\n');

  return deployments;
};

const generateEnvironment = (project: Project): string => {
  const envVars = project.services.map(service => {
    return `# ${service.name} Environment Variables
${service.name.toUpperCase()}_DATABASE_URL=${service.database.connectionUrl}
${service.name.toUpperCase()}_JWT_SECRET=${service.jwt.secret}
${service.name.toUpperCase()}_JWT_EXPIRATION=${service.jwt.expiration}
${service.name.toUpperCase()}_PORT=${3000 + parseInt(service.id)}`;
  }).join('\n\n');

  return `# ${project.name} Environment Configuration
# Generated at ${new Date().toISOString()}

${envVars}

# Global Configuration
NODE_ENV=production
LOG_LEVEL=info
API_VERSION=v1`;
};

const getDbImage = (type: string): string => {
  switch (type) {
    case 'postgresql': return 'postgres:14';
    case 'mongodb': return 'mongo:5.0';
    case 'mysql': return 'mysql:8.0';
    case 'redis': return 'redis:7.0';
    default: return 'postgres:14';
  }
};

const getDbPort = (type: string): number => {
  switch (type) {
    case 'postgresql': return 5432;
    case 'mongodb': return 27017;
    case 'mysql': return 3306;
    case 'redis': return 6379;
    default: return 5432;
  }
};