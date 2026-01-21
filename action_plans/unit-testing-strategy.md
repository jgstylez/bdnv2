---
name: Unit Testing Strategy - Tests Alongside Features
overview: Comprehensive unit testing strategy that integrates test creation alongside feature development, ensuring tests are written as features are built rather than as an afterthought. Includes testing framework setup, patterns, organization, and CI/CD integration.
todos:
  - id: install-testing-deps
    content: Install Jest, React Native Testing Library, and testing dependencies
    status: pending
  - id: configure-jest
    content: Create jest.config.js and jest.setup.js with proper configuration
    status: pending
    dependencies:
      - install-testing-deps
  - id: create-test-utilities
    content: Create test fixtures, mocks, and custom matchers in __tests__/ directory
    status: pending
    dependencies:
      - configure-jest
  - id: test-fee-calculations
    content: Write comprehensive tests for lib/fees.ts (calculateConsumerServiceFee, calculateBusinessFee)
    status: pending
    dependencies:
      - create-test-utilities
  - id: test-payment-processing
    content: Write tests for lib/payment-processing.ts (processBusinessPayment, fee breakdowns)
    status: pending
    dependencies:
      - create-test-utilities
  - id: test-transaction-engine
    content: Write tests for server/src/services/transaction-engine.ts (all transaction types)
    status: pending
    dependencies:
      - create-test-utilities
  - id: test-api-client
    content: Write tests for lib/api-client.ts (auth, retry, error handling)
    status: pending
    dependencies:
      - create-test-utilities
  - id: test-auth-hook
    content: Write tests for hooks/useAuth.ts (login, logout, token refresh)
    status: pending
    dependencies:
      - create-test-utilities
  - id: test-critical-components
    content: Write tests for critical components (Button, PaymentMethodSelector, ErrorDisplay)
    status: pending
    dependencies:
      - create-test-utilities
  - id: setup-ci-testing
    content: Add test workflow to GitHub Actions (.github/workflows/test.yml)
    status: pending
    dependencies:
      - configure-jest
  - id: setup-pre-commit-tests
    content: Add pre-commit hook to run tests before commits
    status: pending
    dependencies:
      - configure-jest
  - id: create-test-templates
    content: Create test file templates for utilities, services, hooks, and components
    status: pending
    dependencies:
      - configure-jest
---

# Unit Testing Strategy - Tests Alongside Features

## Overview

This plan establishes a testing strategy where unit tests are written **alongside feature development**, not at the end. Every feature, service, utility, hook, and component should have corresponding tests written during development.

## Testing Philosophy

**Core Principles:**

1. **Test-First or Test-Alongside**: Write tests as you write code, not after
2. **Test What Matters**: Focus on business logic, edge cases, and critical paths
3. **Fast Feedback**: Tests should run quickly (< 5 seconds for unit tests)
4. **Maintainable**: Tests should be easy to read, understand, and update
5. **Coverage Goals**: Aim for 80%+ coverage on utilities/services, 70%+ on components

## Testing Framework Setup

### Recommended Stack

**Unit Tests:**

- **Jest** - Test runner and assertion library
- **@testing-library/react-native** - Component testing utilities
- **@testing-library/react-hooks** - Hook testing utilities
- **@testing-library/jest-native** - Additional matchers

**Mocking:**

- **jest-mock** - Built into Jest
- **@react-native-async-storage/async-storage** - Mock async storage
- **expo-constants** - Mock Expo constants

### Installation

```bash
npm install --save-dev jest @testing-library/react-native @testing-library/react-hooks @testing-library/jest-native @types/jest
```

### Configuration

**File: `jest.config.js`**

```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-ng/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'lib/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'server/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/__mocks__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    './lib/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './server/src/services/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
```

**File: `jest.setup.js`**

```javascript
import '@testing-library/jest-native/extend-expect';
import { jest } from '@jest/globals';

// Mock Expo modules
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {},
    },
  },
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));

// Mock React Native modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Platform: {
      OS: 'ios',
      select: jest.fn((obj) => obj.ios),
    },
  };
});
```

**Update `package.json`:**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

## Test Organization Structure

### File Naming Convention

- **Co-located tests**: `ComponentName.test.tsx` next to `ComponentName.tsx`
- **Test directory**: `__tests__/` folder for grouped tests
- **Test utilities**: `__tests__/utils/` for test helpers

### Directory Structure

```
lib/
  ├── fees.ts
  ├── fees.test.ts          # Co-located test
  ├── payment-processing.ts
  └── payment-processing.test.ts

hooks/
  ├── useAuth.ts
  ├── useAuth.test.ts       # Co-located test
  └── __tests__/
      └── useAuth.integration.test.ts  # Integration test

components/
  ├── Button.tsx
  ├── Button.test.tsx       # Co-located test
  └── __tests__/
      └── Button.snapshot.test.tsx     # Snapshot test

server/src/
  ├── services/
  │   ├── transaction-engine.ts
  │   └── transaction-engine.test.ts  # Co-located test
  └── __tests__/
      └── fixtures/         # Test data fixtures
      └── mocks/            # Mock implementations
```

## Testing Patterns by Code Type

### 1. Utility Functions (`lib/`)

**Example: `lib/fees.test.ts`**

```typescript
import { calculateConsumerServiceFee, calculateBusinessFee } from './fees';
import { Currency } from '../types/international';

describe('Fee Calculations', () => {
  describe('calculateConsumerServiceFee', () => {
    it('should calculate 10% fee for standard order', () => {
      const fee = calculateConsumerServiceFee(100, 'USD', false);
      expect(fee).toBe(10);
    });

    it('should apply minimum fee of $1.00', () => {
      const fee = calculateConsumerServiceFee(5, 'USD', false);
      expect(fee).toBe(1);
    });

    it('should apply maximum fee of $14.99', () => {
      const fee = calculateConsumerServiceFee(200, 'USD', false);
      expect(fee).toBe(14.99);
    });

    it('should return 0% fee with BDN+ subscription', () => {
      const fee = calculateConsumerServiceFee(100, 'USD', true);
      expect(fee).toBe(0);
    });

    it('should handle different currencies', () => {
      const fee = calculateConsumerServiceFee(100, 'BLKD', false);
      expect(fee).toBeGreaterThan(0);
    });
  });

  describe('calculateBusinessFee', () => {
    it('should calculate 10% platform fee without BDN+ Business', () => {
      const fee = calculateBusinessFee(100, 'USD', false);
      expect(fee).toBe(10);
    });

    it('should calculate 5% platform fee with BDN+ Business', () => {
      const fee = calculateBusinessFee(100, 'USD', true);
      expect(fee).toBe(5);
    });
  });
});
```

**Test Checklist for Utilities:**

- [ ] Happy path (normal operation)
- [ ] Edge cases (min/max values, empty inputs)
- [ ] Error cases (invalid inputs, null/undefined)
- [ ] Currency conversions
- [ ] Business logic variations (with/without subscriptions)

### 2. Services (`server/src/services/`)

**Example: `server/src/services/transaction-engine.test.ts`**

```typescript
import { TransactionEngine } from './transaction-engine';
import { BlnkCoreService } from '../integrations/blnk-core';

jest.mock('../integrations/blnk-core');

describe('TransactionEngine', () => {
  let engine: TransactionEngine;
  let mockBlnkService: jest.Mocked<BlnkCoreService>;

  beforeEach(() => {
    mockBlnkService = new BlnkCoreService() as jest.Mocked<BlnkCoreService>;
    engine = new TransactionEngine(mockBlnkService);
  });

  describe('processTransaction', () => {
    it('should process product purchase successfully', async () => {
      const request = {
        type: 'PRODUCT_PURCHASE',
        userId: 'user-1',
        amount: 100,
        currency: 'USD',
        paymentMethod: 'card',
        items: [{ productId: 'prod-1', quantity: 1 }],
      };

      mockBlnkService.createLedgerEntry.mockResolvedValue({
        id: 'blnk-1',
        status: 'completed',
      });

      const result = await engine.processTransaction(request);

      expect(result.status).toBe('COMPLETED');
      expect(mockBlnkService.createLedgerEntry).toHaveBeenCalled();
    });

    it('should handle insufficient funds error', async () => {
      const request = {
        type: 'PRODUCT_PURCHASE',
        userId: 'user-1',
        amount: 1000,
        currency: 'USD',
        paymentMethod: 'wallet',
      };

      mockBlnkService.getBalance.mockResolvedValue({
        amount: 50,
        currency: 'USD',
      });

      await expect(engine.processTransaction(request)).rejects.toThrow(
        'Insufficient funds'
      );
    });

    it('should calculate fees correctly', async () => {
      // Test fee calculation logic
    });
  });
});
```

**Test Checklist for Services:**

- [ ] Mock external dependencies (Blnk, payment processors)
- [ ] Test success scenarios
- [ ] Test error scenarios
- [ ] Test retry logic
- [ ] Test transaction state transitions
- [ ] Test fee calculations
- [ ] Test balance updates

### 3. React Hooks (`hooks/`)

**Example: `hooks/useAuth.test.ts`**

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from './useAuth';
import * as secureStore from '../lib/secure-storage';
import { auth } from '../lib/firebase';

jest.mock('../lib/secure-storage');
jest.mock('../lib/firebase');

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with unauthenticated state', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle login failure', async () => {
    const { result } = renderHook(() => useAuth());
    
    // Mock login failure
    (auth.signInWithEmailAndPassword as jest.Mock).mockRejectedValue(
      new Error('Invalid credentials')
    );

    await act(async () => {
      await result.current.login('test@example.com', 'wrong');
    });

    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

**Test Checklist for Hooks:**

- [ ] Initial state
- [ ] State updates
- [ ] Side effects (API calls, storage)
- [ ] Cleanup on unmount
- [ ] Error handling
- [ ] Loading states

### 4. React Components (`components/`)

**Example: `components/Button.test.tsx`**

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('should render button text', () => {
    const { getByText } = render(<Button onPress={jest.fn()}>Click me</Button>);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Click me</Button>);
    
    fireEvent.press(getByText('Click me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const { getByText } = render(
      <Button onPress={jest.fn()} disabled>
        Click me
      </Button>
    );
    
    const button = getByText('Click me');
    expect(button.props.disabled).toBe(true);
  });

  it('should show loading state', () => {
    const { getByTestId } = render(
      <Button onPress={jest.fn()} loading>
        Click me
      </Button>
    );
    
    expect(getByTestId('button-loading')).toBeTruthy();
  });
});
```

**Test Checklist for Components:**

- [ ] Rendering (text, elements)
- [ ] User interactions (press, input)
- [ ] Props variations
- [ ] Conditional rendering
- [ ] Loading/error states
- [ ] Accessibility (labels, roles)

### 5. API Clients (`lib/api-client.ts`)

**Example: `lib/api-client.test.ts`**

```typescript
import { apiClient } from './api-client';

describe('API Client', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('should add auth token to requests', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' }),
    });

    await apiClient.get('/users/me');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/users/me'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringContaining('Bearer'),
        }),
      })
    );
  });

  it('should retry on network failure', async () => {
    (global.fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'test' }),
      });

    const result = await apiClient.get('/users/me');
    expect(result.data).toBe('test');
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should handle 401 errors and refresh token', async () => {
    // Test token refresh logic
  });
});
```

## Development Workflow: Tests Alongside Features

### Workflow Pattern

**When Creating a New Feature:**

1. **Create Feature File**
   ```
   lib/new-feature.ts
   ```

2. **Create Test File Immediately**
   ```
   lib/new-feature.test.ts
   ```

3. **Write Tests First (TDD) or Alongside**

                        - Write test for happy path
                        - Write test for edge cases
                        - Write test for error cases

4. **Implement Feature**

                        - Make tests pass
                        - Refactor if needed
                        - Ensure tests still pass

5. **Commit Together**
   ```
   git add lib/new-feature.ts lib/new-feature.test.ts
   git commit -m "feat: add new feature with tests"
   ```


### Example: Adding Fee Calculation Feature

**Step 1: Create test file first**

```typescript
// lib/fees.test.ts
describe('calculateConsumerServiceFee', () => {
  it('should calculate 10% fee', () => {
    // Test implementation
  });
});
```

**Step 2: Run tests (they fail - red)**

```bash
npm test -- lib/fees.test.ts
```

**Step 3: Implement feature**

```typescript
// lib/fees.ts
export function calculateConsumerServiceFee(amount: number, currency: string, hasBDNPlus: boolean): number {
  // Implementation
}
```

**Step 4: Run tests (they pass - green)**

```bash
npm test -- lib/fees.test.ts
```

**Step 5: Refactor if needed (refactor)**

**Step 6: Commit both files together**

## Test Coverage Goals

### Coverage Thresholds

- **Utilities (`lib/`)**: 80%+ coverage
- **Services (`server/src/services/`)**: 80%+ coverage
- **Hooks (`hooks/`)**: 70%+ coverage
- **Components (`components/`)**: 70%+ coverage
- **API Routes (`server/src/api/`)**: 75%+ coverage

### Coverage Reports

Run coverage report:

```bash
npm run test:coverage
```

View HTML report:

```bash
open coverage/lcov-report/index.html
```

## CI/CD Integration

### GitHub Actions Workflow

**File: `.github/workflows/test.yml`**

```yaml
name: Tests

on:
  pull_request:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
                           - uses: actions/checkout@v3
                           - uses: actions/setup-node@v3
        with:
          node-version: '18'
                           - run: npm ci
                           - run: npm run test:ci
                           - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

### Pre-commit Hook

**File: `.husky/pre-commit`**

```bash
#!/bin/sh
# Run tests before commit
npm run test -- --bail --findRelatedTests
```

## Test Utilities & Helpers

### Test Fixtures

**File: `__tests__/fixtures/transactions.ts`**

```typescript
import { Transaction } from '@/types/transactions';

export const mockTransaction: Transaction = {
  id: 'txn-1',
  userId: 'user-1',
  amount: 100,
  currency: 'USD',
  type: 'PAYMENT',
  status: 'COMPLETED',
  // ... other fields
};

export const mockTransactions: Transaction[] = [
  mockTransaction,
  // ... more transactions
];
```

### Custom Matchers

**File: `__tests__/matchers/currency.ts`**

```typescript
expect.extend({
  toBeValidCurrency(received: string) {
    const validCurrencies = ['USD', 'BLKD'];
    const pass = validCurrencies.includes(received);
    return {
      message: () => `expected ${received} to be a valid currency`,
      pass,
    };
  },
});
```

## Testing Best Practices

### Do's

✅ **DO:**

- Write tests alongside code
- Test business logic thoroughly
- Test edge cases and error scenarios
- Keep tests simple and focused
- Use descriptive test names
- Mock external dependencies
- Clean up after tests (beforeEach/afterEach)

### Don'ts

❌ **DON'T:**

- Test implementation details
- Write tests that are too complex
- Test third-party library code
- Skip tests because "they're hard"
- Write tests after feature is "done"
- Test everything (focus on what matters)

## Priority Testing Areas

### Critical Paths (Test First)

1. **Payment Processing**

                        - Fee calculations
                        - Transaction engine
                        - Payment validation

2. **Authentication**

                        - Login/logout
                        - Token refresh
                        - Permission checks

3. **Transaction Engine**

                        - Transaction processing
                        - Balance updates
                        - Error handling

### High Priority

4. **Business Logic**

                        - Fee calculations
                        - Subscription checks
                        - Inventory management

5. **API Clients**

                        - Request/response handling
                        - Error retry logic
                        - Token management

### Medium Priority

6. **Components**

                        - Form components
                        - Payment components
                        - Navigation components

7. **Hooks**

                        - Data fetching hooks
                        - State management hooks

## Implementation Timeline

### Week 1: Setup

- Install testing dependencies
- Configure Jest
- Set up test utilities
- Create test templates

### Week 2: Critical Path Tests

- Write tests for payment processing
- Write tests for fee calculations
- Write tests for transaction engine

### Week 3: Service Tests

- Write tests for all services
- Write tests for API clients
- Write tests for utilities

### Week 4: Component & Hook Tests

- Write tests for critical components
- Write tests for hooks
- Set up CI/CD testing

### Ongoing: Test Alongside Features

- Every new feature includes tests
- Every bug fix includes regression test
- Maintain coverage thresholds