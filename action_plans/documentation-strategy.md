---
name: Documentation Strategy - API Docs, Runbooks, ADRs
overview: Comprehensive documentation strategy covering API documentation (OpenAPI/Swagger), operational runbooks, architecture decision records (ADRs), and developer onboarding guides.
todos:
  - id: setup-openapi-spec
    content: Set up OpenAPI/Swagger specification for all API endpoints
    status: pending
  - id: generate-api-docs
    content: Generate interactive API documentation from OpenAPI spec
    status: pending
  - id: create-runbooks
    content: Create operational runbooks for common procedures
    status: pending
  - id: document-adrs
    content: Document architecture decision records for major decisions
    status: pending
  - id: create-developer-guide
    content: Create comprehensive developer onboarding guide
    status: pending
  - id: setup-api-versioning
    content: Set up API versioning strategy and documentation
    status: pending
  - id: create-troubleshooting-guide
    content: Create troubleshooting guide for common issues
    status: pending
  - id: document-deployment-procedures
    content: Document deployment procedures and checklists
    status: pending
---

# Documentation Strategy

## Overview

This plan establishes comprehensive documentation for BDN 2.0, covering API documentation, operational runbooks, architecture decision records, developer guides, and troubleshooting documentation.

## 1. API Documentation

### OpenAPI Specification

**File: `server/docs/openapi.yaml`**

```yaml
openapi: 3.0.0
info:
  title: BDN 2.0 API
  version: 1.0.0
  description: Black Dollar Network 2.0 REST API
  contact:
    name: API Support
    email: api-support@blackdollarnetwork.com
  license:
    name: Proprietary

servers:
  - url: https://api.blackdollarnetwork.com/v1
    description: Production
  - url: https://api.sandbox.blackdollarnetwork.com/v1
    description: Sandbox
  - url: http://localhost:8080/v1
    description: Local Development

paths:
  /payments/c2b:
    post:
      summary: Process Consumer-to-Business Payment
      description: Process a payment from a consumer to a business
      operationId: processC2BPayment
      tags:
        - Payments
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/C2BPaymentRequest'
            examples:
              basic:
                value:
                  businessId: "business-123"
                  amount: 100.00
                  currency: "USD"
                  paymentMethodToken: "token-456"
      responses:
        '200':
          description: Payment processed successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaymentResponse'
        '400':
          description: Invalid request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '401':
          description: Unauthorized
        '500':
          description: Internal server error

  /transactions:
    get:
      summary: List User Transactions
      description: Retrieve a list of transactions for the authenticated user
      operationId: listTransactions
      tags:
        - Transactions
      security:
        - bearerAuth: []
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
        - name: startDate
          in: query
          schema:
            type: string
            format: date
        - name: endDate
          in: query
          schema:
            type: string
            format: date
      responses:
        '200':
          description: List of transactions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TransactionListResponse'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    C2BPaymentRequest:
      type: object
      required:
        - businessId
        - amount
        - currency
        - paymentMethodToken
      properties:
        businessId:
          type: string
          description: Business ID to pay
        amount:
          type: number
          format: float
          minimum: 0.01
          description: Payment amount
        currency:
          type: string
          enum: [USD, BLKD]
          description: Currency code
        paymentMethodToken:
          type: string
          description: Tokenized payment method reference
        useBLKD:
          type: boolean
          default: false
          description: Apply BLKD balance if available
        memo:
          type: string
          maxLength: 500
          description: Optional payment memo

    PaymentResponse:
      type: object
      properties:
        transactionId:
          type: string
          format: uuid
        status:
          type: string
          enum: [PENDING, PROCESSING, COMPLETED, FAILED]
        amount:
          type: number
        currency:
          type: string
        feeBreakdown:
          $ref: '#/components/schemas/FeeBreakdown'
        receipt:
          $ref: '#/components/schemas/Receipt'

    ErrorResponse:
      type: object
      properties:
        error:
          type: string
        message:
          type: string
        code:
          type: string
        details:
          type: object
```

### API Documentation Generator

**File: `server/scripts/generate-api-docs.sh`**

```bash
#!/bin/bash
# Generate API documentation from OpenAPI spec

set -e

echo "📚 Generating API documentation..."

# Generate HTML documentation
npx @redocly/cli build-docs server/docs/openapi.yaml \
  --output server/docs/api-docs.html

# Generate Postman collection
npx openapi-to-postman server/docs/openapi.yaml \
  --output server/docs/postman-collection.json

# Generate TypeScript types
npx openapi-typescript server/docs/openapi.yaml \
  --output server/src/types/api-generated.ts

echo "✅ API documentation generated"
echo "📄 HTML: server/docs/api-docs.html"
echo "📦 Postman: server/docs/postman-collection.json"
echo "🔷 TypeScript: server/src/types/api-generated.ts"
```

## 2. Operational Runbooks

### Runbook Template

**File: `docs/runbooks/template.md`**

```markdown
# {Runbook Title}

## Overview
Brief description of what this runbook covers.

## Prerequisites
- Access requirements
- Tools needed
- Permissions required

## Symptoms
How to identify when this runbook applies.

## Procedure

### Step 1: {Action}
Description and commands.

### Step 2: {Action}
Description and commands.

## Verification
How to verify the procedure worked.

## Rollback
How to undo if something goes wrong.

## Related Runbooks
- [Related Runbook 1](./related-1.md)
- [Related Runbook 2](./related-2.md)

## Contact
Who to contact for help.
```

### Example Runbook: Database Migration

**File: `docs/runbooks/database-migration.md`**

```markdown
# Database Migration Runbook

## Overview
This runbook covers the procedure for running database migrations in production.

## Prerequisites
- Access to Google Cloud Console
- Database admin credentials
- Backup verification completed

## Procedure

### Step 1: Pre-Migration Checklist
- [ ] Verify latest backup exists and is valid
- [ ] Review migration files for breaking changes
- [ ] Notify team of planned migration
- [ ] Schedule during low-traffic window

### Step 2: Create Backup
```bash
./scripts/backup-database.sh production
```

### Step 3: Run Migration
```bash
cd server
npx prisma migrate deploy
```

### Step 4: Verify Migration
```bash
npx prisma migrate status
```

### Step 5: Post-Migration Verification
- [ ] Check application health endpoints
- [ ] Verify critical queries work
- [ ] Monitor error rates
- [ ] Check database performance

## Rollback
If migration fails:
```bash
./scripts/rollback-migration.sh production <backup-id>
```

## Related Runbooks
- [Database Recovery](./database-recovery.md)
- [Backup Verification](./backup-verification.md)
```

## 3. Architecture Decision Records (ADRs)

### ADR Template

**File: `docs/adr/template.md`**

```markdown
# {ADR Number}: {Title}

**Status:** {Proposed/Accepted/Deprecated/Superseded}
**Date:** {YYYY-MM-DD}
**Deciders:** {List of decision makers}
**Tags:** {tags}

## Context
What is the issue we're trying to address?

## Decision
What is the change we're proposing or have agreed to?

## Consequences
What becomes easier or more difficult because of this change?

## Alternatives Considered
- Alternative 1: Description
  - Pros: ...
  - Cons: ...
- Alternative 2: Description
  - Pros: ...
  - Cons: ...
```

### Example ADR: Payment Processor Architecture

**File: `docs/adr/0001-payment-processor-architecture.md`**

```markdown
# ADR-0001: Payment Processor Architecture - iPayOuts/EcomPayments

**Status:** Accepted
**Date:** 2025-01-15
**Deciders:** Engineering Team, Security Team
**Tags:** architecture, payments, security, pci-compliance

## Context
BDN 2.0 needs to process USD payments (credit cards and bank transfers) while maintaining PCI DSS compliance. We need to decide how to handle payment processing and card/bank data management.

## Decision
We will use iPayOuts for ACH/bank transfers and Ecom Payments for credit card processing. All card and bank data will be managed exclusively by these processors. BDN will only store tokenized payment method references and display information (last 4 digits, card brand, etc.). BLKD (Black Dollars) is our proprietary internal currency and is not subject to PCI compliance.

## Consequences

### Positive
- PCI compliance scope limited to USD transactions via processors
- Card/bank data never touches BDN systems
- Reduced security and compliance burden
- Clear separation of concerns

### Negative
- Dependency on external processors
- Additional API integration complexity
- Potential latency from processor calls

## Alternatives Considered

### Alternative 1: Self-Hosted Payment Processing
- Pros: Full control, no processor fees
- Cons: PCI compliance burden, security risks, development overhead
- **Rejected:** Too high risk and compliance burden

### Alternative 2: Single Payment Processor
- Pros: Simpler integration
- Cons: Vendor lock-in, may not support all payment types
- **Rejected:** Need both card and ACH processing capabilities
```

## 4. Developer Onboarding Guide

### Developer Guide

**File: `docs/developer-guide.md`**

```markdown
# BDN 2.0 Developer Guide

## Getting Started

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- Git
- Google Cloud SDK (for deployment)

### Initial Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/blackdollarnetwork/bdnv2.git
   cd bdnv2
   ```

2. **Install Dependencies**
   ```bash
   npm install
   cd server && npm install
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Local Services**
   ```bash
   docker-compose up -d
   ```

5. **Run Database Migrations**
   ```bash
   cd server
   npx prisma migrate dev
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

## Project Structure

```
bdnv2/
├── app/                 # Expo/React Native app
│   ├── (tabs)/         # Tab navigation screens
│   ├── pages/          # App pages
│   └── admin/          # Admin panel
├── server/             # Backend API
│   ├── src/
│   │   ├── api/        # API routes
│   │   ├── services/   # Business logic
│   │   └── middleware/ # Express middleware
│   └── prisma/         # Database schema
├── components/         # Shared React components
├── lib/               # Shared utilities
├── hooks/             # React hooks
└── types/             # TypeScript types
```

## Development Workflow

### Making Changes

1. Create feature branch
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make changes and write tests
3. Run tests locally
   ```bash
   npm test
   ```

4. Commit changes
   ```bash
   git commit -m "feat: add new feature"
   ```

5. Push and create PR

### Code Standards

- Maximum 400 lines per file
- TypeScript strict mode enabled
- All functions must have explicit return types
- No `any` types (use proper types)
- Write tests alongside code

## Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## Deployment

See [Deployment Guide](./deployment-guide.md) for detailed deployment procedures.

## Resources

- [API Documentation](./api-docs.html)
- [Architecture Decision Records](./adr/)
- [Runbooks](./runbooks/)
```

## 5. API Versioning Strategy

### API Versioning Documentation

**File: `docs/api-versioning.md`**

```markdown
# API Versioning Strategy

## Versioning Scheme

BDN API uses URL-based versioning:
- `/v1/` - Current stable version
- `/v2/` - Next version (when released)

## Version Lifecycle

1. **Development** - New version in development
2. **Beta** - Available for testing (`/v2-beta/`)
3. **Stable** - Production ready (`/v2/`)
4. **Deprecated** - Scheduled for removal (6 months notice)
5. **Retired** - No longer available

## Breaking Changes

Breaking changes require a new version:
- Removing endpoints
- Changing request/response schemas
- Changing authentication methods
- Removing required fields

## Non-Breaking Changes

Can be made in current version:
- Adding new endpoints
- Adding optional fields
- Adding new response fields
- Performance improvements

## Migration Guide

See [Migration Guide](./api-migration-guide.md) for version-specific migration instructions.
```

## 6. Troubleshooting Guide

### Troubleshooting Guide

**File: `docs/troubleshooting.md`**

```markdown
# Troubleshooting Guide

## Common Issues

### Database Connection Errors

**Symptoms:**
- "Connection refused" errors
- Timeout errors
- "Too many connections" errors

**Solutions:**
1. Check database is running
   ```bash
   docker-compose ps postgres
   ```

2. Verify connection string
   ```bash
   echo $DATABASE_URL
   ```

3. Check connection pool settings
   - Review `server/src/config/database.ts`
   - Reduce `max` connections if needed

### Payment Processing Failures

**Symptoms:**
- Payment requests failing
- "Invalid payment method" errors

**Solutions:**
1. Verify payment processor credentials
2. Check payment method token validity
3. Review processor API logs
4. Check rate limits

### Build Failures

**Symptoms:**
- Docker build failing
- TypeScript errors
- Missing dependencies

**Solutions:**
1. Clear Docker cache
   ```bash
   docker system prune -a
   ```

2. Reinstall dependencies
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Check TypeScript errors
   ```bash
   npm run type-check
   ```
```

## 7. Implementation Files

### New Files

- `server/docs/openapi.yaml` - OpenAPI specification
- `server/scripts/generate-api-docs.sh` - API docs generator
- `docs/runbooks/template.md` - Runbook template
- `docs/runbooks/database-migration.md` - Migration runbook
- `docs/adr/template.md` - ADR template
- `docs/adr/0001-payment-processor-architecture.md` - Example ADR
- `docs/developer-guide.md` - Developer onboarding guide
- `docs/api-versioning.md` - API versioning strategy
- `docs/troubleshooting.md` - Troubleshooting guide
- `docs/deployment-guide.md` - Deployment procedures

### Modified Files

- `server/src/server.ts` - Add OpenAPI endpoint
- `package.json` - Add documentation scripts
- `.github/workflows/docs.yml` - Auto-generate docs on changes

## 8. Success Metrics

**Documentation:**
- API documentation coverage 100%
- Runbook coverage for all critical procedures
- ADR coverage for all major decisions
- Developer onboarding time < 2 hours

**Quality:**
- Documentation accuracy > 95%
- Documentation freshness < 30 days
- Runbook success rate > 90%
- Developer satisfaction > 4/5
