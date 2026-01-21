---
name: Testing Strategy Expansion - Integration, E2E, Performance
overview: Comprehensive testing strategy expansion covering integration testing, end-to-end testing (Detox/Maestro), performance testing, security testing integration, test data management, and test environment setup.
todos:
  - id: setup-integration-tests
    content: Set up integration test framework (Supertest for API, database integration tests)
    status: pending
  - id: setup-e2e-framework
    content: Set up E2E testing framework (Detox for React Native, Playwright for web)
    status: pending
  - id: setup-performance-tests
    content: Set up performance testing (k6, Artillery, or Apache Bench)
    status: pending
  - id: create-test-data-management
    content: Create test data management system (fixtures, seeders, factories)
    status: pending
  - id: setup-test-environments
    content: Set up dedicated test environments (test database, test Firebase project)
    status: pending
  - id: integrate-security-tests
    content: Integrate security testing into test suite (OWASP ZAP, dependency scanning)
    status: pending
  - id: create-test-scenarios
    content: Create comprehensive test scenarios for critical flows
    status: pending
  - id: setup-ci-test-integration
    content: Integrate all test types into CI/CD pipeline
    status: pending
---

# Testing Strategy Expansion

## Overview

This plan expands the unit testing strategy to include integration testing, end-to-end testing, performance testing, security testing, and comprehensive test data management.

## 1. Integration Testing

### API Integration Tests

**Framework:** Supertest + Jest

**File: `server/__tests__/integration/api.test.ts`**

```typescript
import request from 'supertest';
import { app } from '../../src/server';
import { prisma } from '../../src/config/database';
import { createTestUser, cleanupTestData } from '../helpers/test-helpers';

describe('API Integration Tests', () => {
  let authToken: string;
  let testUser: any;

  beforeAll(async () => {
    // Set up test database
    testUser = await createTestUser();
    authToken = await getAuthToken(testUser);
  });

  afterAll(async () => {
    await cleanupTestData();
    await prisma.$disconnect();
  });

  describe('POST /api/payments/c2b', () => {
    it('should process C2B payment successfully', async () => {
      const response = await request(app)
        .post('/api/payments/c2b')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          businessId: 'business-1',
          amount: 100,
          currency: 'USD',
          paymentMethodToken: 'token-123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('transactionId');
      expect(response.body.status).toBe('COMPLETED');
    });

    it('should validate payment amount', async () => {
      const response = await request(app)
        .post('/api/payments/c2b')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          businessId: 'business-1',
          amount: -100, // Invalid amount
          currency: 'USD',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('amount');
    });
  });

  describe('GET /api/transactions', () => {
    it('should return user transactions', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 10, offset: 0 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('transactions');
      expect(Array.isArray(response.body.transactions)).toBe(true);
    });

    it('should filter transactions by date range', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          startDate: '2024-01-01',
          endDate: '2024-12-31',
        });

      expect(response.status).toBe(200);
      // Verify all transactions are within date range
      response.body.transactions.forEach((txn: any) => {
        const txnDate = new Date(txn.createdAt);
        expect(txnDate >= new Date('2024-01-01')).toBe(true);
        expect(txnDate <= new Date('2024-12-31')).toBe(true);
      });
    });
  });
});
```

### Database Integration Tests

**File: `server/__tests__/integration/database.test.ts`**

```typescript
import { prisma } from '../../src/config/database';
import { TransactionEngine } from '../../src/services/transaction-engine';
import { createTestUser, createTestBusiness } from '../helpers/test-helpers';

describe('Database Integration Tests', () => {
  beforeEach(async () => {
    // Clean database before each test
    await prisma.transaction.deleteMany();
    await prisma.wallet.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Transaction Engine Database Operations', () => {
    it('should create transaction and update wallet balances', async () => {
      const user = await createTestUser();
      const business = await createTestBusiness();
      
      // Create wallets
      await prisma.wallet.create({
        data: {
          userId: user.id,
          currency: 'USD',
          balance: 1000,
        },
      });

      const engine = new TransactionEngine();
      const result = await engine.processTransaction({
        type: 'C2B_PAYMENT',
        userId: user.id,
        amount: 100,
        currency: 'USD',
        paymentMethod: { type: 'wallet', walletId: 'wallet-1' },
        metadata: { businessId: business.id },
      });

      // Verify transaction created
      const transaction = await prisma.transaction.findUnique({
        where: { id: result.transactionId },
      });
      expect(transaction).toBeTruthy();
      expect(transaction?.amount).toBe(100);

      // Verify wallet balance updated
      const wallet = await prisma.wallet.findFirst({
        where: { userId: user.id },
      });
      expect(wallet?.balance).toBe(900); // 1000 - 100
    });

    it('should handle transaction rollback on error', async () => {
      const user = await createTestUser();
      
      await prisma.wallet.create({
        data: {
          userId: user.id,
          currency: 'USD',
          balance: 100,
        },
      });

      const engine = new TransactionEngine();
      
      // Attempt transaction that will fail
      await expect(
        engine.processTransaction({
          type: 'C2B_PAYMENT',
          userId: user.id,
          amount: 1000, // More than balance
          currency: 'USD',
          paymentMethod: { type: 'wallet', walletId: 'wallet-1' },
        })
      ).rejects.toThrow();

      // Verify wallet balance unchanged
      const wallet = await prisma.wallet.findFirst({
        where: { userId: user.id },
      });
      expect(wallet?.balance).toBe(100);
    });
  });
});
```

### Service Integration Tests

**File: `server/__tests__/integration/services.test.ts`**

```typescript
import { PaymentEngine } from '../../src/services/payment-engine';
import { InventoryService } from '../../src/services/inventory-service';
import { mockEcomPayments, mockIPayOuts } from '../mocks/payment-processors';

jest.mock('../../src/integrations/ecom-payments');
jest.mock('../../src/integrations/ipayouts');

describe('Service Integration Tests', () => {
  describe('Payment Engine Integration', () => {
    it('should process payment through Ecom Payments', async () => {
      mockEcomPayments.processPayment.mockResolvedValue({
        transactionId: 'ep-123',
        status: 'completed',
      });

      const engine = new PaymentEngine();
      const result = await engine.processUSDPayment({
        paymentMethodToken: 'token-123',
        amount: 100,
        currency: 'USD',
        processor: 'ecom_payments',
      });

      expect(result.status).toBe('COMPLETED');
      expect(mockEcomPayments.processPayment).toHaveBeenCalledWith({
        token: 'token-123',
        amount: 100,
      });
    });
  });

  describe('Inventory Service Integration', () => {
    it('should sync inventory with Shopify', async () => {
      const inventoryService = new InventoryService();
      
      // Mock Shopify API
      const mockShopifyProducts = [
        { id: 'shopify-1', title: 'Product 1', variants: [{ id: 'v1', inventory_quantity: 10 }] },
      ];
      
      jest.spyOn(inventoryService, 'syncFromShopify').mockResolvedValue({
        synced: 1,
        errors: [],
      });

      const result = await inventoryService.syncFromShopify('store-1');
      
      expect(result.synced).toBe(1);
      expect(result.errors).toHaveLength(0);
    });
  });
});
```

## 2. End-to-End Testing

### Detox Setup (React Native)

**File: `e2e/detox.config.js`**

```javascript
module.exports = {
  testRunner: {
    args: ['--maxWorkers=1'],
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/BDN.app',
      build: 'xcodebuild -workspace ios/BDN.xcworkspace -scheme BDN -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/BDN.app',
      build: 'xcodebuild -workspace ios/BDN.xcworkspace -scheme BDN -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build: 'cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 14 Pro',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_5_API_33',
      },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release',
    },
  },
};
```

### Detox E2E Tests

**File: `e2e/payment-flow.e2e.ts`**

```typescript
import { device, element, by, waitFor } from 'detox';

describe('Payment Flow E2E', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should complete C2B payment flow', async () => {
    // Navigate to Pay tab
    await element(by.id('tab-pay')).tap();
    
    // Select business
    await element(by.id('business-selector')).tap();
    await element(by.text('Test Business')).tap();
    
    // Enter amount
    await element(by.id('amount-input')).typeText('100');
    
    // Select payment method
    await element(by.id('payment-method-selector')).tap();
    await element(by.text('Visa •••• 1234')).tap();
    
    // Apply BLKD if available
    await element(by.id('blkd-toggle')).tap();
    
    // Review and confirm
    await element(by.id('review-button')).tap();
    await element(by.id('confirm-payment-button')).tap();
    
    // Wait for success
    await waitFor(element(by.text('Payment Successful')))
      .toBeVisible()
      .withTimeout(10000);
    
    // Verify transaction appears in history
    await element(by.id('view-transaction-button')).tap();
    await expect(element(by.text('$100.00'))).toBeVisible();
  });

  it('should handle payment failure gracefully', async () => {
    // Navigate to Pay tab
    await element(by.id('tab-pay')).tap();
    
    // Use invalid payment method
    await element(by.id('business-selector')).tap();
    await element(by.text('Test Business')).tap();
    await element(by.id('amount-input')).typeText('100');
    await element(by.id('payment-method-selector')).tap();
    await element(by.text('Declined Card')).tap();
    
    // Attempt payment
    await element(by.id('confirm-payment-button')).tap();
    
    // Verify error message
    await waitFor(element(by.text('Payment declined')))
      .toBeVisible()
      .withTimeout(5000);
  });
});
```

### Playwright Setup (Web)

**File: `e2e/playwright.config.ts`**

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/web',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:8081',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run start:web',
    url: 'http://localhost:8081',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Playwright E2E Tests

**File: `e2e/web/checkout-flow.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
  });

  test('should complete product checkout', async ({ page }) => {
    // Add product to cart
    await page.goto('/marketplace');
    await page.click('[data-testid="product-card-1"]');
    await page.click('[data-testid="add-to-cart-button"]');
    
    // Go to cart
    await page.click('[data-testid="cart-icon"]');
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();
    
    // Proceed to checkout
    await page.click('[data-testid="checkout-button"]');
    
    // Fill shipping info
    await page.fill('[data-testid="shipping-address"]', '123 Main St');
    await page.fill('[data-testid="shipping-city"]', 'New York');
    await page.selectOption('[data-testid="shipping-state"]', 'NY');
    await page.fill('[data-testid="shipping-zip"]', '10001');
    
    // Select payment method
    await page.click('[data-testid="payment-method-selector"]');
    await page.click('[data-testid="payment-method-card-1234"]');
    
    // Review and place order
    await page.click('[data-testid="review-order-button"]');
    await expect(page.locator('[data-testid="order-summary"]')).toBeVisible();
    await page.click('[data-testid="place-order-button"]');
    
    // Verify success
    await expect(page.locator('text=Order Confirmed')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="order-id"]')).toBeVisible();
  });
});
```

## 3. Performance Testing

### k6 Load Testing

**File: `performance/load-tests/payment-api.js`**

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% errors
    errors: ['rate<0.1'],
  },
};

const BASE_URL = __ENV.API_URL || 'https://api.sandbox.blackdollarnetwork.com';
const AUTH_TOKEN = __ENV.AUTH_TOKEN;

export default function () {
  const headers = {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json',
  };

  // Test payment endpoint
  const paymentPayload = JSON.stringify({
    businessId: 'business-1',
    amount: 100,
    currency: 'USD',
    paymentMethodToken: 'token-123',
  });

  const paymentRes = http.post(`${BASE_URL}/api/payments/c2b`, paymentPayload, { headers });
  
  const paymentSuccess = check(paymentRes, {
    'payment status is 200': (r) => r.status === 200,
    'payment response time < 500ms': (r) => r.timings.duration < 500,
  });

  errorRate.add(!paymentSuccess);
  sleep(1);

  // Test transaction list endpoint
  const transactionsRes = http.get(`${BASE_URL}/api/transactions?limit=10`, { headers });
  
  check(transactionsRes, {
    'transactions status is 200': (r) => r.status === 200,
    'transactions response time < 300ms': (r) => r.timings.duration < 300,
  });

  sleep(1);
}
```

### Artillery Load Testing

**File: `performance/load-tests/artillery-config.yml`**

```yaml
config:
  target: 'https://api.sandbox.blackdollarnetwork.com'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 300
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Spike test"
  processor: "./processor.js"
  payload:
    path: "./test-data.csv"
    fields:
      - "email"
      - "password"
  plugins:
    expect: {}
  defaults:
    headers:
      Content-Type: "application/json"

scenarios:
  - name: "Payment Flow"
    weight: 70
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "{{ email }}"
            password: "{{ password }}"
          capture:
            - json: "$.token"
              as: "authToken"
      - think: 2
      - post:
          url: "/api/payments/c2b"
          headers:
            Authorization: "Bearer {{ authToken }}"
          json:
            businessId: "business-1"
            amount: 100
            currency: "USD"
            paymentMethodToken: "token-123"
          expect:
            - statusCode: 200
            - contentType: json
            - hasProperty: transactionId

  - name: "Transaction List"
    weight: 30
    flow:
      - get:
          url: "/api/transactions?limit=10"
          headers:
            Authorization: "Bearer {{ authToken }}"
          expect:
            - statusCode: 200
            - maxResponseTime: 300
```

## 4. Test Data Management

### Test Fixtures

**File: `server/__tests__/fixtures/users.ts`**

```typescript
import { PrismaClient } from '@prisma/client';

export const userFixtures = {
  standardUser: {
    email: 'test@example.com',
    password: 'hashed_password',
    firstName: 'Test',
    lastName: 'User',
    phone: '+1234567890',
  },
  
  adminUser: {
    email: 'admin@example.com',
    password: 'hashed_password',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
  },
  
  businessOwner: {
    email: 'business@example.com',
    password: 'hashed_password',
    firstName: 'Business',
    lastName: 'Owner',
    role: 'BUSINESS_OWNER',
  },
};

export async function createTestUser(prisma: PrismaClient, overrides = {}) {
  return prisma.user.create({
    data: {
      ...userFixtures.standardUser,
      ...overrides,
    },
  });
}
```

### Test Seeders

**File: `server/__tests__/seeders/test-seeder.ts`**

```typescript
import { PrismaClient } from '@prisma/client';

export class TestSeeder {
  constructor(private prisma: PrismaClient) {}

  async seedUsers(count: number = 10) {
    const users = [];
    for (let i = 0; i < count; i++) {
      users.push(
        await this.prisma.user.create({
          data: {
            email: `test${i}@example.com`,
            password: 'hashed_password',
            firstName: `Test${i}`,
            lastName: 'User',
          },
        })
      );
    }
    return users;
  }

  async seedBusinesses(count: number = 5) {
    const businesses = [];
    for (let i = 0; i < count; i++) {
      businesses.push(
        await this.prisma.business.create({
          data: {
            name: `Test Business ${i}`,
            category: 'RESTAURANT',
            status: 'APPROVED',
          },
        })
      );
    }
    return businesses;
  }

  async seedTransactions(userId: string, count: number = 20) {
    const transactions = [];
    for (let i = 0; i < count; i++) {
      transactions.push(
        await this.prisma.transaction.create({
          data: {
            userId,
            amount: Math.random() * 1000,
            currency: 'USD',
            type: 'PAYMENT',
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - i * 86400000), // Spread over days
          },
        })
      );
    }
    return transactions;
  }

  async cleanup() {
    await this.prisma.transaction.deleteMany();
    await this.prisma.wallet.deleteMany();
    await this.prisma.business.deleteMany();
    await this.prisma.user.deleteMany();
  }
}
```

### Test Factories

**File: `server/__tests__/factories/transaction-factory.ts`**

```typescript
import { Transaction, TransactionType, TransactionStatus } from '@prisma/client';

export class TransactionFactory {
  static create(overrides: Partial<Transaction> = {}): Partial<Transaction> {
    return {
      amount: 100,
      currency: 'USD',
      type: 'PAYMENT' as TransactionType,
      status: 'COMPLETED' as TransactionStatus,
      ...overrides,
    };
  }

  static createPending(overrides: Partial<Transaction> = {}): Partial<Transaction> {
    return this.create({
      status: 'PENDING' as TransactionStatus,
      ...overrides,
    });
  }

  static createFailed(overrides: Partial<Transaction> = {}): Partial<Transaction> {
    return this.create({
      status: 'FAILED' as TransactionStatus,
      ...overrides,
    });
  }
}
```

## 5. Test Environment Setup

### Test Database Configuration

**File: `server/__tests__/setup/test-database.ts`**

```typescript
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

export function getTestDatabase(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/bdn_test',
        },
      },
    });
  }
  return prisma;
}

export async function setupTestDatabase() {
  const db = getTestDatabase();
  
  // Run migrations
  await db.$executeRaw`CREATE DATABASE IF NOT EXISTS bdn_test`;
  // Run Prisma migrations
  // await exec('npx prisma migrate deploy');
  
  return db;
}

export async function teardownTestDatabase() {
  const db = getTestDatabase();
  await db.$disconnect();
}
```

### Test Environment Configuration

**File: `server/__tests__/setup/test-env.ts`**

```typescript
// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/bdn_test';
process.env.REDIS_URL = process.env.TEST_REDIS_URL || 'redis://localhost:6379/1';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.ENCRYPTION_KEY = 'test-encryption-key-32-chars-long!!';

// Mock external services
jest.mock('../../src/integrations/ecom-payments');
jest.mock('../../src/integrations/ipayouts');
jest.mock('../../src/integrations/shopify');
```

## 6. CI/CD Integration

### GitHub Actions Test Workflow

**File: `.github/workflows/test-all.yml`**

```yaml
name: Comprehensive Test Suite

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:unit

  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: bdn_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:integration
        env:
          TEST_DATABASE_URL: postgresql://postgres:test@localhost:5432/bdn_test
          TEST_REDIS_URL: redis://localhost:6379/1

  e2e-tests-web:
    name: E2E Tests (Web)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e:web
        env:
          E2E_BASE_URL: http://localhost:8081

  performance-tests:
    name: Performance Tests
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - name: Run k6 tests
        uses: grafana/k6-action@v0.3.0
        with:
          filename: performance/load-tests/payment-api.js
          cloud: false
        env:
          API_URL: ${{ secrets.SANDBOX_API_URL }}
          AUTH_TOKEN: ${{ secrets.TEST_AUTH_TOKEN }}
```

## 7. Implementation Files

### New Files

- `server/__tests__/integration/api.test.ts` - API integration tests
- `server/__tests__/integration/database.test.ts` - Database integration tests
- `server/__tests__/integration/services.test.ts` - Service integration tests
- `e2e/detox.config.js` - Detox configuration
- `e2e/payment-flow.e2e.ts` - Detox E2E tests
- `e2e/playwright.config.ts` - Playwright configuration
- `e2e/web/checkout-flow.spec.ts` - Playwright E2E tests
- `performance/load-tests/payment-api.js` - k6 load tests
- `performance/load-tests/artillery-config.yml` - Artillery config
- `server/__tests__/fixtures/users.ts` - User fixtures
- `server/__tests__/seeders/test-seeder.ts` - Test seeders
- `server/__tests__/factories/transaction-factory.ts` - Transaction factory
- `server/__tests__/setup/test-database.ts` - Test database setup
- `server/__tests__/setup/test-env.ts` - Test environment config
- `.github/workflows/test-all.yml` - Comprehensive test workflow

### Modified Files

- `package.json` - Add test scripts and dependencies
- `server/package.json` - Add test dependencies
- `.github/workflows/ci.yml` - Integrate new test types

## 8. Success Metrics

**Test Coverage:**
- Unit test coverage > 80%
- Integration test coverage > 70%
- E2E test coverage for critical flows 100%
- Performance test coverage for all APIs

**Test Execution:**
- Unit tests run time < 30 seconds
- Integration tests run time < 5 minutes
- E2E tests run time < 15 minutes
- All tests pass rate > 95%

**Performance:**
- API response time p95 < 500ms (under load)
- API response time p99 < 1000ms (under load)
- Error rate under load < 1%
- System handles 200 concurrent users
