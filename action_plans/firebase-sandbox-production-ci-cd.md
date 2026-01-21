---
name: Firebase Sandbox/Production Split & CI/CD Setup
overview: Set up separate Firebase projects for sandbox (sandbox.meant2grow.com) and production, implement environment-based configuration, and create GitHub Actions workflows for automated CI/CD deployment from sandbox to production.
todos:
  - id: setup-firebase-projects
    content: Create production Firebase project and configure both sandbox and production projects with required services (Firestore, Storage, Auth, Functions, Messaging)
    status: in_progress
  - id: update-firebase-config
    content: Update firebase.json to remove hardcoded storage bucket and update .firebaserc.example with sandbox/production aliases
    status: completed
  - id: create-env-configs
    content: Create .env.sandbox.example and .env.production.example template files with environment-specific configurations
    status: completed
  - id: create-ci-workflow
    content: Create .github/workflows/ci.yml for continuous integration (lint, build, test)
    status: completed
  - id: create-sandbox-deploy-workflow
    content: Create .github/workflows/deploy-sandbox.yml for automatic sandbox deployments on push to main/develop
    status: completed
    dependencies:
      - create-ci-workflow
  - id: create-production-deploy-workflow
    content: Create .github/workflows/deploy-production.yml for production deployments via manual trigger or release tags
    status: completed
    dependencies:
      - create-ci-workflow
  - id: update-build-config
    content: Update vite.config.ts and package.json to support environment-specific builds (sandbox vs production)
    status: completed
    dependencies:
      - create-env-configs
  - id: update-functions-config
    content: Update functions/src/index.ts to be environment-aware and detect environment from Firebase project ID
    status: completed
  - id: create-env-helper-script
    content: Create scripts/get-env-config.sh helper script for environment detection and variable loading
    status: completed
    dependencies:
      - create-env-configs
  - id: setup-github-secrets
    content: Document and configure GitHub Secrets for Firebase tokens and environment variables (sandbox + production)
    status: completed
    dependencies:
      - setup-firebase-projects
  - id: setup-firebase-secrets
    content: Set up Firebase Functions secrets separately for sandbox and production projects using Firebase Secret Manager
    status: pending
    dependencies:
      - setup-firebase-projects
  - id: create-deployment-docs
    content: Create docs/DEPLOYMENT.md and docs/CI_CD_SETUP.md with setup instructions and deployment procedures
    status: completed
  - id: test-sandbox-deployment
    content: Test sandbox deployment workflow end-to-end, verify sandbox.meant2grow.com works correctly
    status: pending
    dependencies:
      - create-sandbox-deploy-workflow
      - setup-github-secrets
  - id: test-production-deployment
    content: Test production deployment workflow end-to-end, verify meant2grow.com works correctly
    status: pending
    dependencies:
      - create-production-deploy-workflow
      - setup-github-secrets
      - setup-firebase-secrets
---

# Firebase Sandbox/Production Split & CI/CD Setup

## Overview

This plan establishes a dual-environment setup with separate Firebase projects for sandbox and production, implements environment-aware configuration, and creates GitHub Actions workflows for automated deployments.

## Current State Analysis

**Current Setup:**

- Single Firebase project: `meant2grow-dev` (will become sandbox)
- Hardcoded project references in `firebase.json` (storage bucket)
- Environment variables in `.env.local` (not committed)
- Firebase Functions secrets managed via `defineString`/`defineSecret`
- No CI/CD automation
- `.firebaserc` is gitignored (only `.firebaserc.example` exists)
- Service account key file: `meant2grow-dev-dfcfbc9ebeaa.json` (gitignored)

**Issues to Address:**

1. Hardcoded project ID in `firebase.json` storage bucket
2. No environment-based configuration system
3. No CI/CD automation
4. Manual secret management
5. No deployment workflow documentation

## Implementation Plan

### Phase 1: Firebase Project Setup

#### 1.1 Create Production Firebase Project

- Create new Firebase project: `meant2grow-prod` (or similar)
- Enable required services:
  - Firestore (same region as sandbox: `us-central1`)
  - Storage
  - Authentication (Email/Password + Google Sign-In)
  - Cloud Functions
  - Cloud Messaging
- Create web app in production project
- Set up custom domain: `meant2grow.com` (production)
- Keep `sandbox.meant2grow.com` for sandbox project

#### 1.2 Update `.firebaserc.example`

Update [`.firebaserc.example`](.firebaserc.example) to support multiple environments:

```json
{
  "projects": {
    "default": "meant2grow-dev",
    "sandbox": "meant2grow-dev",
    "production": "meant2grow-prod"
  }
}
```

### Phase 2: Environment Configuration System

#### 2.1 Create Environment Config Files

Create environment-specific configuration files:

- `.env.sandbox.example` - Template for sandbox environment
- `.env.production.example` - Template for production environment
- Update `.env.local.example` to clarify it's for local development

#### 2.2 Update `firebase.json` for Environment-Aware Storage

Modify [firebase.json](firebase.json) to remove hardcoded bucket:

```json
{
  "storage": [
    {
      "rules": "storage.rules"
    }
  ]
}
```

Storage bucket will be automatically determined from the active Firebase project.

#### 2.3 Create Environment Helper Script

Create `scripts/get-env-config.sh` to:

- Detect current environment from `.firebaserc` or CLI argument
- Load appropriate environment variables
- Export variables for build/deploy processes

### Phase 3: GitHub Actions CI/CD Workflows

#### 3.1 Create Workflow Directory Structure

```
.github/
  workflows/
    ci.yml          # Continuous Integration (lint, test, build)
    deploy-sandbox.yml  # Deploy to sandbox on push to main/develop
    deploy-production.yml  # Deploy to production on release/tag
```

#### 3.2 CI Workflow (`ci.yml`)

- Trigger: On push to any branch, PRs
- Steps:
  - Checkout code
  - Setup Node.js
  - Install dependencies (root + functions)
  - Lint code
  - Build frontend
  - Build functions
  - Run tests (if any)

#### 3.3 Sandbox Deployment Workflow (`deploy-sandbox.yml`)

- Trigger: Push to `main` or `develop` branch
- Steps:
  - Run CI checks
  - Authenticate with Firebase (using GitHub Secrets)
  - Set Firebase project to sandbox
  - Build frontend with sandbox environment variables
  - Build functions
  - Deploy to Firebase (hosting + functions + rules)
  - Post deployment status

#### 3.4 Production Deployment Workflow (`deploy-production.yml`)

- Trigger: 
  - Manual workflow dispatch
  - Release/tag creation (e.g., `v1.0.0`)
- Steps:
  - Run CI checks
  - Authenticate with Firebase (using GitHub Secrets)
  - Set Firebase project to production
  - Build frontend with production environment variables
  - Build functions
  - Deploy to Firebase (hosting + functions + rules)
  - Post deployment status
  - Create deployment summary

### Phase 4: GitHub Secrets Configuration

#### 4.1 Required GitHub Secrets

Set up the following secrets in GitHub repository settings:

**Firebase Authentication:**

- `FIREBASE_TOKEN_SANDBOX` - Firebase CI token for sandbox project
- `FIREBASE_TOKEN_PRODUCTION` - Firebase CI token for production project

**Environment Variables (for builds):**

- `SANDBOX_FIREBASE_API_KEY`
- `SANDBOX_FIREBASE_AUTH_DOMAIN`
- `SANDBOX_FIREBASE_PROJECT_ID`
- `SANDBOX_FIREBASE_STORAGE_BUCKET`
- `SANDBOX_FIREBASE_MESSAGING_SENDER_ID`
- `SANDBOX_FIREBASE_APP_ID`
- `SANDBOX_FIREBASE_VAPID_KEY`
- `SANDBOX_GOOGLE_CLIENT_ID`
- `SANDBOX_FUNCTIONS_URL`
- `SANDBOX_APP_URL`

- `PROD_FIREBASE_API_KEY`
- `PROD_FIREBASE_AUTH_DOMAIN`
- `PROD_FIREBASE_PROJECT_ID`
- `PROD_FIREBASE_STORAGE_BUCKET`
- `PROD_FIREBASE_MESSAGING_SENDER_ID`
- `PROD_FIREBASE_APP_ID`
- `PROD_FIREBASE_VAPID_KEY`
- `PROD_GOOGLE_CLIENT_ID`
- `PROD_FUNCTIONS_URL`
- `PROD_APP_URL`

**Functions Secrets (set via Firebase CLI, not GitHub):**

- These remain in Firebase Secret Manager per project
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_KEY`
- `MAILTRAP_API_TOKEN`
- `MAILTRAP_USE_SANDBOX`
- `MAILTRAP_INBOX_ID`
- `MAILTRAP_FROM_EMAIL`
- `MAILTRAP_REPLY_TO_EMAIL`
- `VITE_APP_URL`

### Phase 5: Build Configuration Updates

#### 5.1 Update `vite.config.ts`

Modify [vite.config.ts](vite.config.ts) to:

- Support environment-specific builds
- Inject environment variables from GitHub Secrets during CI builds
- Handle both local development and CI environments

#### 5.2 Update `package.json` Scripts

Add new scripts to [package.json](package.json):

```json
{
  "scripts": {
    "build:sandbox": "NODE_ENV=sandbox vite build",
    "build:production": "NODE_ENV=production vite build",
    "deploy:sandbox": "npm run build:sandbox && firebase use sandbox && firebase deploy",
    "deploy:production": "npm run build:production && firebase use production && firebase deploy"
  }
}
```

### Phase 6: Functions Configuration

#### 6.1 Environment-Aware Functions

Update [functions/src/index.ts](functions/src/index.ts) to:

- Detect environment from Firebase project ID
- Use environment-specific defaults for email service config
- Set appropriate `appUrl` based on environment

#### 6.2 Functions Secrets Management

- Set secrets separately for each Firebase project:
  ```bash
  # Sandbox
  firebase use sandbox
  firebase functions:secrets:set GOOGLE_SERVICE_ACCOUNT_EMAIL
  firebase functions:secrets:set GOOGLE_SERVICE_ACCOUNT_KEY
  # ... other secrets
  
  # Production
  firebase use production
  firebase functions:secrets:set GOOGLE_SERVICE_ACCOUNT_EMAIL
  firebase functions:secrets:set GOOGLE_SERVICE_ACCOUNT_KEY
  # ... other secrets
  ```


### Phase 7: Documentation & Setup Guides

#### 7.1 Create Deployment Documentation

Create `docs/DEPLOYMENT.md` with:

- Environment setup instructions
- GitHub Secrets configuration guide
- Manual deployment procedures
- Troubleshooting guide

#### 7.2 Update Existing Documentation

- Update [env.local.example](env.local.example) with environment notes
- Update [setup-env.sh](setup-env.sh) to support environment selection
- Create `docs/CI_CD_SETUP.md` with GitHub Actions setup instructions

### Phase 8: Migration & Testing

#### 8.1 Sandbox Migration

- Verify current `meant2grow-dev` project works as sandbox
- Test sandbox deployment workflow
- Ensure `sandbox.meant2grow.com` domain works

#### 8.2 Production Setup

- Initialize production Firebase project
- Copy Firestore rules and indexes
- Set up production secrets
- Test production deployment workflow
- Configure `meant2grow.com` custom domain

#### 8.3 End-to-End Testing

- Test CI workflow on feature branch
- Test sandbox deployment on `main` branch
- Test production deployment via manual trigger
- Verify environment-specific configurations work correctly

## Files to Create/Modify

### New Files:

- `.github/workflows/ci.yml`
- `.github/workflows/deploy-sandbox.yml`
- `.github/workflows/deploy-production.yml`
- `.env.sandbox.example`
- `.env.production.example`
- `scripts/get-env-config.sh`
- `docs/DEPLOYMENT.md`
- `docs/CI_CD_SETUP.md`

### Modified Files:

- `firebase.json` - Remove hardcoded storage bucket
- `.firebaserc.example` - Add sandbox/production aliases
- `vite.config.ts` - Environment-aware builds
- `package.json` - Add environment-specific scripts
- `functions/src/index.ts` - Environment-aware configuration
- `env.local.example` - Add environment notes
- `setup-env.sh` - Support environment selection

## Security Considerations

1. **Secrets Management:**

   - Never commit `.firebaserc` or `.env.local` files
   - Use GitHub Secrets for CI/CD environment variables
   - Use Firebase Secret Manager for Functions secrets
   - Rotate tokens periodically

2. **Access Control:**

   - Limit who can trigger production deployments
   - Use branch protection rules for `main` branch
   - Require approvals for production deployments

3. **Environment Isolation:**

   - Ensure sandbox and production are completely separate
   - Different Firebase projects = different data stores
   - Different OAuth client IDs per environment

## Deployment Workflow

**Daily Development:**

1. Developer pushes to feature branch
2. CI runs automatically (lint, build, test)
3. Developer merges to `main` after review
4. Sandbox deploys automatically

**Production Release:**

1. Create release/tag (e.g., `v1.2.3`)
2. Production deployment workflow triggers
3. Manual approval required (if configured)
4. Deploy to production Firebase project
5. Verify deployment at `meant2grow.com`

## Next Steps After Implementation

1. Set up Firebase projects (sandbox + production)
2. Configure GitHub Secrets
3. Set up Firebase Functions secrets for both projects
4. Test sandbox deployment workflow
5. Test production deployment workflow
6. Document the process for the team
7. Set up monitoring/alerting for deployments