---
name: Infrastructure & Deployment Strategy - Docker, Cloud Run, CI/CD
overview: Comprehensive infrastructure and deployment strategy covering Docker containerization, Google Cloud Run deployment, CI/CD pipelines, environment management, database migrations, and deployment strategies (blue-green, canary, rollback).
todos:
  - id: create-dockerfile
    content: Create Dockerfile for backend server with multi-stage builds
    status: pending
  - id: create-docker-compose
    content: Create docker-compose.yml for local development with all services
    status: pending
  - id: setup-cloud-run-config
    content: Create Cloud Run service configuration files (cloudbuild.yaml, service.yaml)
    status: pending
  - id: setup-ci-cd-pipelines
    content: Create GitHub Actions workflows for CI/CD (build, test, deploy)
    status: pending
  - id: setup-database-migrations
    content: Set up Prisma migration strategy with zero-downtime migrations
    status: pending
  - id: create-health-checks
    content: Implement health check endpoints and readiness probes
    status: pending
  - id: setup-env-management
    content: Set up environment variable management (Google Secret Manager)
    status: pending
  - id: create-deployment-scripts
    content: Create deployment scripts for blue-green and canary deployments
    status: pending
  - id: setup-monitoring-integration
    content: Integrate Cloud Run with Cloud Monitoring and Logging
    status: pending
  - id: create-rollback-procedures
    content: Document and automate rollback procedures
    status: pending
---

# Infrastructure & Deployment Strategy

## Overview

This plan establishes the infrastructure and deployment strategy for BDN 2.0, covering Docker containerization, Google Cloud Run deployment, CI/CD pipelines, environment management, and deployment strategies.

## 1. Docker Containerization

### Backend Dockerfile

**File: `server/Dockerfile`**

```dockerfile
# Multi-stage build for optimized image size
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Build application
FROM base AS builder
WORKDIR /app
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

USER nodejs

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "dist/server.js"]
```

### Docker Compose for Local Development

**File: `docker-compose.yml`** (root)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: bdn-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: ${POSTGRES_DB:-bdn_dev}
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./server/prisma/migrations:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - bdn-network

  redis:
    image: redis:7-alpine
    container_name: bdn-redis
    restart: unless-stopped
    ports:
      - "${REDIS_PORT:-6379}:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    networks:
      - bdn-network

  backend:
    build:
      context: .
      dockerfile: server/Dockerfile
    container_name: bdn-backend
    restart: unless-stopped
    ports:
      - "${BACKEND_PORT:-8080}:8080"
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@postgres:5432/${POSTGRES_DB:-bdn_dev}
      REDIS_URL: redis://redis:6379
      PORT: 8080
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./server:/app
      - /app/node_modules
    networks:
      - bdn-network
    command: npm run dev

  # Firestore emulator (for local development)
  firestore-emulator:
    image: gcr.io/google.com/cloudsdktool/cloud-sdk:emulators
    container_name: bdn-firestore-emulator
    restart: unless-stopped
    ports:
      - "${FIRESTORE_EMULATOR_PORT:-8081}:8081"
    command: gcloud beta emulators firestore start --host-port=0.0.0.0:8081
    networks:
      - bdn-network

volumes:
  postgres_data:
  redis_data:

networks:
  bdn-network:
    driver: bridge
```

### Docker Compose Override for Production-Like Testing

**File: `docker-compose.prod.yml`**

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: server/Dockerfile
    environment:
      NODE_ENV: production
    command: node dist/server.js
    # Remove volumes for production-like testing
```

## 2. Google Cloud Run Deployment

### Cloud Run Service Configuration

**File: `server/cloudbuild.yaml`**

```yaml
steps:
  # Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'gcr.io/$PROJECT_ID/bdn-backend:$SHORT_SHA'
      - '-t'
      - 'gcr.io/$PROJECT_ID/bdn-backend:latest'
      - '-f'
      - 'server/Dockerfile'
      - '.'

  # Push to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - '--all-tags'
      - 'gcr.io/$PROJECT_ID/bdn-backend'

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'bdn-backend-${_ENVIRONMENT}'
      - '--image'
      - 'gcr.io/$PROJECT_ID/bdn-backend:$SHORT_SHA'
      - '--region'
      - '${_REGION}'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--service-account'
      - 'bdn-backend@$PROJECT_ID.iam.gserviceaccount.com'
      - '--set-env-vars'
      - 'NODE_ENV=${_ENVIRONMENT}'
      - '--set-secrets'
      - 'DATABASE_URL=db-connection-string:latest,API_KEYS=api-keys:latest'
      - '--memory'
      - '${_MEMORY}'
      - '--cpu'
      - '${_CPU}'
      - '--min-instances'
      - '${_MIN_INSTANCES}'
      - '--max-instances'
      - '${_MAX_INSTANCES}'
      - '--timeout'
      - '300s'
      - '--concurrency'
      - '80'
      - '--port'
      - '8080'

substitutions:
  _ENVIRONMENT: 'sandbox'
  _REGION: 'us-central1'
  _MEMORY: '512Mi'
  _CPU: '1'
  _MIN_INSTANCES: '0'
  _MAX_INSTANCES: '10'

options:
  machineType: 'E2_HIGHCPU_8'
  logging: CLOUD_LOGGING_ONLY

timeout: '1200s'
```

### Cloud Run Service Definition

**File: `server/cloudrun-service.yaml`**

```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: bdn-backend-production
  annotations:
    run.googleapis.com/ingress: all
    run.googleapis.com/execution-environment: gen2
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "1"
        autoscaling.knative.dev/maxScale: "100"
        run.googleapis.com/cpu-throttling: "false"
        run.googleapis.com/execution-environment: gen2
    spec:
      containerConcurrency: 80
      timeoutSeconds: 300
      serviceAccountName: bdn-backend@PROJECT_ID.iam.gserviceaccount.com
      containers:
      - image: gcr.io/PROJECT_ID/bdn-backend:latest
        ports:
        - name: http1
          containerPort: 8080
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "8080"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              key: latest
              name: db-connection-string
        resources:
          limits:
            cpu: "2"
            memory: "2Gi"
        startupProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 0
          timeoutSeconds: 1
          periodSeconds: 3
          failureThreshold: 3
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 0
          timeoutSeconds: 1
          periodSeconds: 10
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 0
          timeoutSeconds: 1
          periodSeconds: 5
          failureThreshold: 3
  traffic:
  - percent: 100
    latestRevision: true
```

### Health Check Endpoints

**File: `server/src/routes/health.ts`**

```typescript
import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';

const router = Router();

/**
 * Basic health check
 * Returns 200 if server is running
 */
router.get('/health', async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Readiness probe
 * Checks if service is ready to accept traffic
 * Verifies database connectivity
 */
router.get('/ready', async (req: Request, res: Response) => {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    
    // Check Redis connectivity (if used)
    // await redis.ping();
    
    res.status(200).json({
      status: 'ready',
      checks: {
        database: 'ok',
        // redis: 'ok',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Liveness probe
 * Checks if service is alive and should be restarted
 */
router.get('/live', async (req: Request, res: Response) => {
  // Check memory usage
  const memoryUsage = process.memoryUsage();
  const memoryUsageMB = {
    rss: Math.round(memoryUsage.rss / 1024 / 1024),
    heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
  };
  
  // Restart if memory usage is too high (> 1.5GB for 2GB limit)
  if (memoryUsageMB.heapUsed > 1536) {
    return res.status(503).json({
      status: 'unhealthy',
      reason: 'high_memory_usage',
      memory: memoryUsageMB,
    });
  }
  
  res.status(200).json({
    status: 'alive',
    memory: memoryUsageMB,
    timestamp: new Date().toISOString(),
  });
});

export default router;
```

## 3. CI/CD Pipeline

### GitHub Actions CI Pipeline

**File: `.github/workflows/ci.yml`**

```yaml
name: CI Pipeline

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  lint-and-type-check:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run TypeScript type check
        run: npm run type-check
      
      - name: Check file sizes
        run: npm run check-file-sizes

  test:
    name: Run Tests
    runs-on: ubuntu-latest
    needs: lint-and-type-check
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build-backend:
    name: Build Backend
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        working-directory: server
        run: npm ci
      
      - name: Build backend
        working-directory: server
        run: npm run build
      
      - name: Check build artifacts
        run: |
          if [ ! -d "server/dist" ]; then
            echo "Build failed - dist directory not found"
            exit 1
          fi

  docker-build:
    name: Build Docker Image
    runs-on: ubuntu-latest
    needs: build-backend
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Build Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./server/Dockerfile
          push: false
          tags: bdn-backend:test
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### GitHub Actions Deploy to Sandbox

**File: `.github/workflows/deploy-sandbox.yml`**

```yaml
name: Deploy to Sandbox

on:
  push:
    branches: [develop]
  workflow_dispatch:

env:
  PROJECT_ID: bdn-sandbox
  REGION: us-central1
  SERVICE_NAME: bdn-backend-sandbox

jobs:
  deploy:
    name: Deploy to Sandbox
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY_SANDBOX }}
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2
      
      - name: Configure Docker for GCR
        run: gcloud auth configure-docker
      
      - name: Build and push Docker image
        run: |
          SHORT_SHA=$(git rev-parse --short HEAD)
          docker build -t gcr.io/$PROJECT_ID/bdn-backend:$SHORT_SHA -f server/Dockerfile .
          docker tag gcr.io/$PROJECT_ID/bdn-backend:$SHORT_SHA gcr.io/$PROJECT_ID/bdn-backend:latest
          docker push gcr.io/$PROJECT_ID/bdn-backend:$SHORT_SHA
          docker push gcr.io/$PROJECT_ID/bdn-backend:latest
      
      - name: Run database migrations
        run: |
          cd server
          npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL_SANDBOX }}
      
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy $SERVICE_NAME \
            --image gcr.io/$PROJECT_ID/bdn-backend:latest \
            --region $REGION \
            --platform managed \
            --allow-unauthenticated \
            --service-account bdn-backend@$PROJECT_ID.iam.gserviceaccount.com \
            --set-env-vars NODE_ENV=sandbox \
            --set-secrets DATABASE_URL=db-connection-string-sandbox:latest \
            --memory 512Mi \
            --cpu 1 \
            --min-instances 0 \
            --max-instances 10 \
            --timeout 300s \
            --concurrency 80 \
            --port 8080
      
      - name: Run smoke tests
        run: |
          SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')
          curl -f $SERVICE_URL/health || exit 1
```

### GitHub Actions Deploy to Production

**File: `.github/workflows/deploy-production.yml`**

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      confirm:
        description: 'Type "deploy" to confirm production deployment'
        required: true

env:
  PROJECT_ID: bdn-production
  REGION: us-central1
  SERVICE_NAME: bdn-backend-production

jobs:
  pre-deployment-checks:
    name: Pre-Deployment Checks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Check for breaking changes
        run: |
          # Check for migration files
          if [ -n "$(git diff --name-only origin/main...HEAD | grep migrations)" ]; then
            echo "⚠️ Breaking database migrations detected"
            echo "Please review migration files before deploying"
          fi
      
      - name: Require manual confirmation
        if: github.event_name == 'workflow_dispatch' && github.event.inputs.confirm != 'deploy'
        run: |
          echo "❌ Deployment not confirmed. Type 'deploy' to proceed."
          exit 1

  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: pre-deployment-checks
    environment:
      name: production
      url: https://api.blackdollarnetwork.com
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run full test suite
        run: npm run test:ci
      
      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY_PRODUCTION }}
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2
      
      - name: Configure Docker for GCR
        run: gcloud auth configure-docker
      
      - name: Build and push Docker image
        run: |
          SHORT_SHA=$(git rev-parse --short HEAD)
          VERSION_TAG="v$(date +%Y%m%d)-${SHORT_SHA}"
          docker build -t gcr.io/$PROJECT_ID/bdn-backend:$VERSION_TAG -f server/Dockerfile .
          docker tag gcr.io/$PROJECT_ID/bdn-backend:$VERSION_TAG gcr.io/$PROJECT_ID/bdn-backend:latest
          docker push gcr.io/$PROJECT_ID/bdn-backend:$VERSION_TAG
          docker push gcr.io/$PROJECT_ID/bdn-backend:latest
          echo "IMAGE_TAG=$VERSION_TAG" >> $GITHUB_ENV
      
      - name: Run database migrations (with backup)
        run: |
          cd server
          # Create backup before migration
          gcloud sql backups create --instance=bdn-postgres-production --async
          # Run migrations
          npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL_PRODUCTION }}
      
      - name: Deploy to Cloud Run (Blue-Green)
        run: |
          # Deploy new revision
          gcloud run deploy $SERVICE_NAME \
            --image gcr.io/$PROJECT_ID/bdn-backend:${{ env.IMAGE_TAG }} \
            --region $REGION \
            --platform managed \
            --allow-unauthenticated \
            --service-account bdn-backend@$PROJECT_ID.iam.gserviceaccount.com \
            --set-env-vars NODE_ENV=production \
            --set-secrets DATABASE_URL=db-connection-string-production:latest \
            --memory 2Gi \
            --cpu 2 \
            --min-instances 1 \
            --max-instances 100 \
            --timeout 300s \
            --concurrency 80 \
            --port 8080 \
            --no-traffic
          
          # Get new revision name
          NEW_REVISION=$(gcloud run revisions list --service=$SERVICE_NAME --region=$REGION --limit=1 --format='value(name)')
          echo "NEW_REVISION=$NEW_REVISION" >> $GITHUB_ENV
      
      - name: Run smoke tests on new revision
        run: |
          SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')
          NEW_REVISION_URL="${SERVICE_URL}?revision=${{ env.NEW_REVISION }}"
          
          # Health check
          curl -f $NEW_REVISION_URL/health || exit 1
          
          # Readiness check
          curl -f $NEW_REVISION_URL/ready || exit 1
          
          # Basic API check
          curl -f $NEW_REVISION_URL/api/health || exit 1
      
      - name: Gradually shift traffic (Canary)
        run: |
          # Shift 10% traffic to new revision
          gcloud run services update-traffic $SERVICE_NAME \
            --region $REGION \
            --to-revisions ${{ env.NEW_REVISION }}=10
          
          echo "⏳ Waiting 2 minutes for canary validation..."
          sleep 120
          
          # Check error rates
          ERROR_RATE=$(gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=$SERVICE_NAME AND severity>=ERROR" --limit=100 --format="value(severity)" | wc -l)
          
          if [ "$ERROR_RATE" -gt 10 ]; then
            echo "❌ High error rate detected. Rolling back..."
            gcloud run services update-traffic $SERVICE_NAME \
              --region $REGION \
              --to-revisions ${{ env.NEW_REVISION }}=0
            exit 1
          fi
          
          # Shift 50% traffic
          gcloud run services update-traffic $SERVICE_NAME \
            --region $REGION \
            --to-revisions ${{ env.NEW_REVISION }}=50
          
          echo "⏳ Waiting 2 minutes for validation..."
          sleep 120
          
          # Shift 100% traffic
          gcloud run services update-traffic $SERVICE_NAME \
            --region $REGION \
            --to-revisions ${{ env.NEW_REVISION }}=100
      
      - name: Clean up old revisions
        run: |
          # Keep last 5 revisions, delete older ones
          gcloud run revisions list --service=$SERVICE_NAME --region=$REGION --format='value(name)' | tail -n +6 | xargs -I {} gcloud run revisions delete {} --region=$REGION --quiet || true
      
      - name: Notify deployment success
        if: success()
        run: |
          echo "✅ Production deployment successful"
          # Add Slack/Discord notification here
      
      - name: Rollback on failure
        if: failure()
        run: |
          echo "❌ Deployment failed. Rolling back..."
          # Get previous revision
          PREVIOUS_REVISION=$(gcloud run revisions list --service=$SERVICE_NAME --region=$REGION --limit=2 --format='value(name)' | tail -n 1)
          gcloud run services update-traffic $SERVICE_NAME \
            --region $REGION \
            --to-revisions $PREVIOUS_REVISION=100
          exit 1
```

## 4. Database Migration Strategy

### Zero-Downtime Migration Strategy

**File: `server/scripts/migrate-zero-downtime.sh`**

```bash
#!/bin/bash
# Zero-downtime migration script

set -e

ENVIRONMENT=${1:-sandbox}
MIGRATION_NAME=${2}

if [ -z "$MIGRATION_NAME" ]; then
  echo "Usage: ./migrate-zero-downtime.sh <environment> <migration-name>"
  exit 1
fi

echo "🚀 Starting zero-downtime migration: $MIGRATION_NAME"
echo "Environment: $ENVIRONMENT"

# Step 1: Create backup
echo "📦 Creating database backup..."
gcloud sql backups create \
  --instance=bdn-postgres-$ENVIRONMENT \
  --description="Pre-migration backup: $MIGRATION_NAME" \
  --async

# Step 2: Validate migration (dry run)
echo "🔍 Validating migration..."
npx prisma migrate diff \
  --from-schema-datamodel server/prisma/schema.prisma \
  --to-schema-datasource server/prisma/schema.prisma \
  --script > /tmp/migration.sql

# Check for breaking changes
if grep -q "DROP TABLE\|DROP COLUMN\|ALTER COLUMN.*DROP" /tmp/migration.sql; then
  echo "⚠️  WARNING: Breaking changes detected!"
  echo "Review migration file: /tmp/migration.sql"
  read -p "Continue? (yes/no): " confirm
  if [ "$confirm" != "yes" ]; then
    exit 1
  fi
fi

# Step 3: Apply migration
echo "📝 Applying migration..."
npx prisma migrate deploy

# Step 4: Verify migration
echo "✅ Verifying migration..."
npx prisma migrate status

# Step 5: Run post-migration checks
echo "🔍 Running post-migration checks..."
npm run test:migration

echo "✅ Migration completed successfully!"
```

### Migration Best Practices

**File: `server/docs/migration-guide.md`**

```markdown
# Database Migration Guide

## Zero-Downtime Migration Rules

1. **Additive Changes First**
   - Add new columns with default values
   - Add new tables
   - Add new indexes concurrently

2. **Backfill Data**
   - Populate new columns/tables
   - Verify data integrity

3. **Deploy Application Code**
   - Deploy code that uses new schema
   - Keep backward compatibility

4. **Remove Old Code**
   - Remove deprecated columns/tables
   - Clean up unused indexes

## Migration Checklist

- [ ] Backup database before migration
- [ ] Test migration on sandbox first
- [ ] Verify no breaking changes
- [ ] Run migration during low-traffic window
- [ ] Monitor application after migration
- [ ] Verify data integrity
- [ ] Document migration in changelog
```

## 5. Environment Management

### Google Secret Manager Integration

**File: `server/src/config/secrets.ts`**

```typescript
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

class SecretManager {
  private client: SecretManagerServiceClient;
  private cache: Map<string, { value: string; expiresAt: number }> = new Map();
  private cacheTTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.client = new SecretManagerServiceClient();
  }

  async getSecret(secretName: string, projectId: string): Promise<string> {
    // Check cache
    const cached = this.cache.get(secretName);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    // Fetch from Secret Manager
    const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
    const [version] = await this.client.accessSecretVersion({ name });
    
    const value = version.payload?.data?.toString() || '';
    
    // Cache result
    this.cache.set(secretName, {
      value,
      expiresAt: Date.now() + this.cacheTTL,
    });

    return value;
  }

  async getSecretSync(secretName: string): Promise<string> {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || '';
    return this.getSecret(secretName, projectId);
  }
}

export const secretManager = new SecretManager();
```

### Environment Configuration

**File: `server/src/config/environment.ts`**

```typescript
import { secretManager } from './secrets';

export interface EnvironmentConfig {
  nodeEnv: 'development' | 'sandbox' | 'production';
  databaseUrl: string;
  redisUrl?: string;
  apiKeys: {
    ecomPayments: string;
    ipayouts: string;
    shopify: string;
    woocommerce: string;
    printful: string;
  };
  firebase: {
    projectId: string;
    apiKey: string;
  };
  googleCloud: {
    projectId: string;
    region: string;
  };
}

export async function loadEnvironmentConfig(): Promise<EnvironmentConfig> {
  const nodeEnv = (process.env.NODE_ENV || 'development') as EnvironmentConfig['nodeEnv'];
  
  // Load secrets from Secret Manager in production
  if (nodeEnv === 'production' || nodeEnv === 'sandbox') {
    const [databaseUrl, apiKeysJson] = await Promise.all([
      secretManager.getSecretSync('db-connection-string'),
      secretManager.getSecretSync('api-keys'),
    ]);
    
    const apiKeys = JSON.parse(apiKeysJson);
    
    return {
      nodeEnv,
      databaseUrl,
      redisUrl: process.env.REDIS_URL,
      apiKeys,
      firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID || '',
        apiKey: process.env.FIREBASE_API_KEY || '',
      },
      googleCloud: {
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || '',
        region: process.env.GOOGLE_CLOUD_REGION || 'us-central1',
      },
    };
  }
  
  // Use environment variables for development
  return {
    nodeEnv,
    databaseUrl: process.env.DATABASE_URL || '',
    redisUrl: process.env.REDIS_URL,
    apiKeys: {
      ecomPayments: process.env.ECOM_PAYMENTS_API_KEY || '',
      ipayouts: process.env.IPAYOUTS_API_KEY || '',
      shopify: process.env.SHOPIFY_API_KEY || '',
      woocommerce: process.env.WOOCOMMERCE_API_KEY || '',
      printful: process.env.PRINTFUL_API_KEY || '',
    },
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID || '',
      apiKey: process.env.FIREBASE_API_KEY || '',
    },
    googleCloud: {
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || '',
      region: process.env.GOOGLE_CLOUD_REGION || 'us-central1',
    },
  };
}
```

## 6. Deployment Strategies

### Blue-Green Deployment Script

**File: `server/scripts/blue-green-deploy.sh`**

```bash
#!/bin/bash
# Blue-Green deployment script for Cloud Run

set -e

SERVICE_NAME=${1:-bdn-backend-production}
REGION=${2:-us-central1}
NEW_IMAGE=${3}

if [ -z "$NEW_IMAGE" ]; then
  echo "Usage: ./blue-green-deploy.sh <service-name> <region> <new-image>"
  exit 1
fi

echo "🚀 Starting blue-green deployment"
echo "Service: $SERVICE_NAME"
echo "Region: $REGION"
echo "New Image: $NEW_IMAGE"

# Deploy new revision with no traffic
echo "📦 Deploying new revision..."
NEW_REVISION=$(gcloud run deploy $SERVICE_NAME \
  --image $NEW_IMAGE \
  --region $REGION \
  --no-traffic \
  --format 'value(status.latestReadyRevisionName)')

echo "✅ New revision deployed: $NEW_REVISION"

# Run smoke tests
echo "🧪 Running smoke tests..."
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')
NEW_REVISION_URL="${SERVICE_URL}?revision=$NEW_REVISION"

curl -f $NEW_REVISION_URL/health || (echo "❌ Health check failed" && exit 1)
curl -f $NEW_REVISION_URL/ready || (echo "❌ Readiness check failed" && exit 1)

echo "✅ Smoke tests passed"

# Switch traffic to new revision
echo "🔄 Switching traffic to new revision..."
gcloud run services update-traffic $SERVICE_NAME \
  --region $REGION \
  --to-revisions $NEW_REVISION=100

echo "✅ Blue-green deployment completed"
echo "New revision: $NEW_REVISION"
echo "Service URL: $SERVICE_URL"
```

### Canary Deployment Script

**File: `server/scripts/canary-deploy.sh`**

```bash
#!/bin/bash
# Canary deployment script

set -e

SERVICE_NAME=${1:-bdn-backend-production}
REGION=${2:-us-central1}
NEW_IMAGE=${3}
CANARY_PERCENT=${4:-10}

if [ -z "$NEW_IMAGE" ]; then
  echo "Usage: ./canary-deploy.sh <service-name> <region> <new-image> [canary-percent]"
  exit 1
fi

echo "🚀 Starting canary deployment"
echo "Service: $SERVICE_NAME"
echo "Canary: $CANARY_PERCENT%"

# Deploy new revision
NEW_REVISION=$(gcloud run deploy $SERVICE_NAME \
  --image $NEW_IMAGE \
  --region $REGION \
  --no-traffic \
  --format 'value(status.latestReadyRevisionName)')

# Get current revision
CURRENT_REVISION=$(gcloud run services describe $SERVICE_NAME \
  --region $REGION \
  --format 'value(status.traffic[0].revisionName)')

# Shift initial traffic
REMAINING_PERCENT=$((100 - CANARY_PERCENT))
gcloud run services update-traffic $SERVICE_NAME \
  --region $REGION \
  --to-revisions $NEW_REVISION=$CANARY_PERCENT,$CURRENT_REVISION=$REMAINING_PERCENT

echo "⏳ Canary deployed. Monitor for 5 minutes..."
sleep 300

# Check error rates
ERROR_COUNT=$(gcloud logging read \
  "resource.type=cloud_run_revision AND resource.labels.service_name=$SERVICE_NAME AND severity>=ERROR" \
  --limit=100 \
  --format="value(severity)" | wc -l)

if [ "$ERROR_COUNT" -gt 10 ]; then
  echo "❌ High error rate detected. Rolling back..."
  gcloud run services update-traffic $SERVICE_NAME \
    --region $REGION \
    --to-revisions $CURRENT_REVISION=100
  exit 1
fi

echo "✅ Canary validation passed"
echo "New revision: $NEW_REVISION"
```

## 7. Rollback Procedures

### Automated Rollback Script

**File: `server/scripts/rollback.sh`**

```bash
#!/bin/bash
# Rollback script for Cloud Run

set -e

SERVICE_NAME=${1:-bdn-backend-production}
REGION=${2:-us-central1}
TARGET_REVISION=${3}

if [ -z "$TARGET_REVISION" ]; then
  echo "📋 Available revisions:"
  gcloud run revisions list --service=$SERVICE_NAME --region=$REGION --format="table(name,status.conditions[0].status,metadata.creationTimestamp)"
  
  echo ""
  read -p "Enter revision name to rollback to: " TARGET_REVISION
fi

echo "🔄 Rolling back to revision: $TARGET_REVISION"

# Switch all traffic to target revision
gcloud run services update-traffic $SERVICE_NAME \
  --region $REGION \
  --to-revisions $TARGET_REVISION=100

echo "✅ Rollback completed"
echo "Current revision: $TARGET_REVISION"

# Verify health
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')
curl -f $SERVICE_URL/health || echo "⚠️  Warning: Health check failed"
```

## 8. Implementation Files

### New Files

- `server/Dockerfile` - Multi-stage Docker build
- `docker-compose.yml` - Local development environment
- `docker-compose.prod.yml` - Production-like testing
- `server/cloudbuild.yaml` - Cloud Build configuration
- `server/cloudrun-service.yaml` - Cloud Run service definition
- `server/src/routes/health.ts` - Health check endpoints
- `server/src/config/secrets.ts` - Secret Manager integration
- `server/src/config/environment.ts` - Environment configuration
- `server/scripts/migrate-zero-downtime.sh` - Zero-downtime migration script
- `server/scripts/blue-green-deploy.sh` - Blue-green deployment
- `server/scripts/canary-deploy.sh` - Canary deployment
- `server/scripts/rollback.sh` - Rollback script
- `.github/workflows/ci.yml` - CI pipeline
- `.github/workflows/deploy-sandbox.yml` - Sandbox deployment
- `.github/workflows/deploy-production.yml` - Production deployment
- `server/docs/migration-guide.md` - Migration guide

### Modified Files

- `server/src/server.ts` - Add health check routes
- `server/package.json` - Add deployment scripts
- `.gitignore` - Add Docker-related ignores

## 9. Success Metrics

**Deployment:**
- Deployment time < 10 minutes
- Zero-downtime deployments 100%
- Rollback time < 5 minutes
- Deployment success rate > 99%

**Infrastructure:**
- Container startup time < 30 seconds
- Health check response time < 100ms
- Image build time < 5 minutes
- Cloud Run cold start < 10 seconds

**Reliability:**
- Uptime > 99.9%
- Failed deployments < 1%
- Successful rollbacks 100%
- Zero data loss during migrations
