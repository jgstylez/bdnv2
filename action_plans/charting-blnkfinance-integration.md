---
name: Charting Library Migration & BlnkFinance Ledger Integration
overview: Plan to migrate from custom SVG charts to a charting library (Chart.js/Victory/Nivo) and integrate BlnkFinance Core open-source ledger system alongside existing transaction system for double-entry accounting and financial record-keeping.
todos:
  - id: install-victory
    content: Install Victory charting library (victory-native and victory packages)
    status: pending
  - id: create-chart-wrappers
    content: Create Victory wrapper components (LineChart, BarChart, PieChart, AreaChart) maintaining existing prop interfaces
    status: pending
    dependencies:
      - install-victory
  - id: migrate-admin-charts
    content: Update app/admin/analytics.tsx to use new Victory chart components
    status: pending
    dependencies:
      - create-chart-wrappers
  - id: create-financial-charts
    content: Create financial-specific charts (TransactionTrendChart, RevenueBreakdownChart, BalanceHistoryChart)
    status: pending
    dependencies:
      - create-chart-wrappers
  - id: setup-blnk-core
    content: Set up BlnkFinance Core infrastructure (Docker container or service)
    status: pending
  - id: create-blnk-client
    content: Create Blnk API client service (server/src/integrations/blnk-core.ts)
    status: pending
    dependencies:
      - setup-blnk-core
  - id: create-blnk-types
    content: Create TypeScript types for Blnk entities (types/blnk.ts)
    status: pending
    dependencies:
      - create-blnk-client
  - id: create-ledger-sync
    content: Create ledger sync service to sync PostgreSQL transactions to Blnk Core
    status: pending
    dependencies:
      - create-blnk-client
      - create-blnk-types
  - id: integrate-transaction-engine
    content: Integrate Blnk sync into Transaction Engine for automatic ledger entries
    status: pending
    dependencies:
      - create-ledger-sync
  - id: create-admin-ledger-views
    content: Create admin ledger views (ledger.tsx, reconciliation.tsx, balances.tsx)
    status: pending
    dependencies:
      - create-ledger-sync
  - id: add-blnk-charts
    content: Add Blnk-powered charts to admin dashboard showing ledger data
    status: pending
    dependencies:
      - create-admin-ledger-views
      - create-financial-charts
  - id: update-database-schema
    content: Add Blnk integration models to Prisma schema (BlnkLedgerMapping, BlnkTransactionSync)
    status: pending
    dependencies:
      - create-blnk-types
---

# Charting Library Migration & BlnkFinance Ledger Integration

## Overview

This plan covers:

1. **Charting Library Migration**: Migrate from custom SVG chart components to a production-ready charting library
2. **BlnkFinance Core Integration**: Integrate BlnkFinance open-source ledger system for double-entry accounting alongside existing transaction system

## 1. Charting Library Selection & Migration

### Current State

- Custom chart components using `react-native-svg`:
  - `components/charts/LineChart.tsx`
  - `components/charts/BarChart.tsx`
  - `components/charts/PieChart.tsx`
  - `components/charts/AreaChart.tsx`
- Used in: `app/admin/analytics.tsx`, potentially other admin/user dashboards

### Recommended Library: Victory Charts

**Why Victory:**

- Excellent React Native support (works on web, iOS, Android)
- Strong TypeScript support
- Modular architecture (import only what you need)
- Good performance
- Well-maintained
- Supports complex financial charts (candlesticks, area charts with thresholds)

**Alternative Consideration:** Chart.js with `react-chartjs-2` (if web-only focus)

### Migration Strategy

**Phase 1: Install & Setup** (Week 1)

- Install Victory: `npm install victory-native victory`
- Create chart wrapper components in `components/charts/`
- Maintain same prop interfaces for easy migration
- Create chart utilities for data transformation

**Phase 2: Component Migration** (Week 2)

- Migrate `LineChart` → `VictoryLine` wrapper
- Migrate `BarChart` → `VictoryBar` wrapper  
- Migrate `PieChart` → `VictoryPie` wrapper
- Migrate `AreaChart` → `VictoryArea` wrapper
- Update `app/admin/analytics.tsx` to use new components
- Test on web, iOS, Android

**Phase 3: Enhanced Charts** (Week 3)

- Add financial-specific charts:
  - `TransactionTrendChart.tsx` - Multi-series line chart
  - `RevenueBreakdownChart.tsx` - Stacked bar chart
  - `BalanceHistoryChart.tsx` - Area chart with thresholds
- Add chart interactions (tooltips, zoom, filters)

**File Structure:**

```
components/charts/
  ├── LineChart.tsx (Victory wrapper, <400 LOC)
  ├── BarChart.tsx (Victory wrapper, <400 LOC)
  ├── PieChart.tsx (Victory wrapper, <400 LOC)
  ├── AreaChart.tsx (Victory wrapper, <400 LOC)
  ├── TransactionTrendChart.tsx (new, <400 LOC)
  ├── RevenueBreakdownChart.tsx (new, <400 LOC)
  ├── BalanceHistoryChart.tsx (new, <400 LOC)
  └── utils/
      ├── chart-formatters.ts (data transformation utilities)
      └── chart-theme.ts (BDN theme configuration)
```

### Chart Component Pattern

```typescript
// components/charts/LineChart.tsx
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';
import { BDNChartTheme } from './utils/chart-theme';

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  showGrid?: boolean;
  showDots?: boolean;
}

export function LineChart({ data, height = 200, color = "#ba9988", showGrid = true, showDots = true }: LineChartProps) {
  const formattedData = formatChartData(data);
  
  return (
    <VictoryChart theme={BDNChartTheme} height={height}>
      <VictoryAxis dependentAxis showGrid={showGrid} />
      <VictoryAxis />
      <VictoryLine
        data={formattedData}
        style={{ data: { stroke: color } }}
        animate={{ duration: 500 }}
      />
    </VictoryChart>
  );
}
```

## 2. BlnkFinance Core Integration

### What is BlnkFinance Core?

BlnkFinance Core is an open-source financial ledger system providing:

- **Double-entry accounting**: Immutable transaction records
- **Multi-currency support**: USD, BLKD, and other currencies
- **Balance snapshots**: Historical balance tracking
- **Reconciliation engine**: Match transactions and balances
- **Identity management**: Link transactions to users/entities
- **TypeScript SDK**: Type-safe integration

### Integration Architecture

**BlnkFinance Core as Ledger Backend:**

- Blnk Core handles all double-entry accounting
- Existing transaction system handles UI/app logic
- Sync between systems via API

**Architecture Flow:**

```
User Action (Purchase/Payment)
    ↓
Transaction Engine (existing)
    ↓
Create Transaction Record (PostgreSQL)
    ↓
Sync to BlnkFinance Core (Ledger Entry)
    ↓
Blnk Core: Double-entry accounting
    ↓
Balance Updates (via Blnk API)
    ↓
Sync back to PostgreSQL Wallets
```

### Implementation Strategy

**Phase 1: Blnk Core Setup** (Week 1-2)

- Self-host Blnk Core (Docker container or separate service)
- Configure Blnk Core for BDN:
  - Set up ledgers for: User Wallets, Hub Wallet, Business Accounts, Platform Fees
  - Configure currencies: USD, BLKD
  - Set up identity types: user, business, nonprofit, platform
- Create Blnk API client service

**Phase 2: API Client & Types** (Week 2-3)

- Create `server/src/integrations/blnk-core.ts`:
  - Blnk API client wrapper
  - TypeScript types matching Blnk entities
  - Error handling and retry logic
- Create `types/blnk.ts`:
  - `BlnkLedger` interface
  - `BlnkTransaction` interface
  - `BlnkBalance` interface
  - `BlnkIdentity` interface

**Phase 3: Transaction Sync** (Week 3-4)

- Create `server/src/services/ledger-sync-service.ts`:
  - Sync PostgreSQL transactions to Blnk Core
  - Handle double-entry accounting:
    - Debit user wallet, Credit business wallet
    - Debit business wallet (platform fee), Credit platform fee ledger
  - Balance reconciliation
- Add sync to Transaction Engine

**Phase 4: Balance Management** (Week 4-5)

- Update wallet balances from Blnk Core
- Create `server/src/services/balance-service.ts`:
  - Get balances from Blnk Core
  - Sync balances to PostgreSQL wallets
  - Handle balance discrepancies

**Phase 5: Admin Integration** (Week 5-6)

- Add Blnk ledger views to admin panel:
  - `app/admin/ledger.tsx` - Ledger entries view
  - `app/admin/reconciliation.tsx` - Reconciliation dashboard
  - `app/admin/balances.tsx` - Balance snapshots
- Add charts showing ledger data:
  - Balance trends over time
  - Transaction volume by ledger
  - Reconciliation status

### Blnk Core Service Implementation

**File: `server/src/integrations/blnk-core.ts`**

```typescript
import { BlnkClient } from '@blnkfinance/blnk-sdk';

export class BlnkCoreService {
  private client: BlnkClient;
  
  constructor() {
    this.client = new BlnkClient({
      apiKey: process.env.BLNK_API_KEY,
      baseURL: process.env.BLNK_CORE_URL || 'http://blnk-core:8080',
    });
  }
  
  async createLedgerEntry(params: {
    ledgerId: string;
    amount: number;
    currency: string;
    debitAccount: string;
    creditAccount: string;
    metadata: Record<string, any>;
  }): Promise<BlnkTransaction> {
    // Create double-entry transaction
  }
  
  async getBalance(ledgerId: string, currency: string): Promise<BlnkBalance> {
    // Get current balance
  }
  
  async getBalanceHistory(ledgerId: string, startDate: Date, endDate: Date): Promise<BlnkBalance[]> {
    // Get balance snapshots
  }
  
  async reconcile(ledgerId: string): Promise<ReconciliationResult> {
    // Run reconciliation
  }
}
```

**File: `server/src/services/ledger-sync-service.ts`**

```typescript
export class LedgerSyncService {
  async syncTransactionToLedger(transaction: Transaction): Promise<void> {
    // Map BDN transaction to Blnk ledger entries
    // Create double-entry accounting records
    // Handle platform fees, service fees
  }
  
  async syncBalanceFromLedger(walletId: string): Promise<void> {
    // Get balance from Blnk Core
    // Update PostgreSQL wallet balance
  }
}
```

### Database Schema Updates

**Add Blnk Integration Models** (`server/prisma/schema.prisma`):

```prisma
model BlnkLedgerMapping {
  id            String   @id @default(uuid())
  entityType    String   // "user_wallet", "business_account", "hub_wallet", "platform_fees"
  entityId      String   // User ID, Business ID, etc.
  blnkLedgerId  String   @unique
  currency      String   // "USD", "BLKD"
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([entityType, entityId])
  @@map("blnk_ledger_mappings")
}

model BlnkTransactionSync {
  id            String   @id @default(uuid())
  transactionId String   @unique
  blnkEntryId   String   @unique
  syncStatus    SyncStatus @default(PENDING)
  syncedAt      DateTime?
  error         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  transaction   Transaction @relation(fields: [transactionId], references: [id])
  
  @@index([syncStatus])
  @@map("blnk_transaction_syncs")
}

enum SyncStatus {
  PENDING
  SYNCED
  FAILED
  RETRYING
}
```

### Chart Integration with Blnk Data

**New Charts Using Blnk Data:**

1. **Balance History Chart** (`components/charts/BalanceHistoryChart.tsx`):

   - Shows balance over time from Blnk balance snapshots
   - Multi-currency support (USD, BLKD)
   - Threshold lines for low balance alerts

2. **Ledger Activity Chart** (`components/charts/LedgerActivityChart.tsx`):

   - Shows transaction volume by ledger
   - Stacked bar chart showing debits/credits
   - Filterable by date range

3. **Reconciliation Status Chart** (`components/charts/ReconciliationChart.tsx`):

   - Pie chart showing reconciled vs unreconciled transactions
   - Trend line showing reconciliation rate over time

## 3. Implementation Files

### New Files

**Charting:**

- `components/charts/LineChart.tsx` - Victory wrapper (<400 LOC)
- `components/charts/BarChart.tsx` - Victory wrapper (<400 LOC)
- `components/charts/PieChart.tsx` - Victory wrapper (<400 LOC)
- `components/charts/AreaChart.tsx` - Victory wrapper (<400 LOC)
- `components/charts/TransactionTrendChart.tsx` - Multi-series chart (<400 LOC)
- `components/charts/RevenueBreakdownChart.tsx` - Stacked bar chart (<400 LOC)
- `components/charts/BalanceHistoryChart.tsx` - Balance over time (<400 LOC)
- `components/charts/utils/chart-formatters.ts` - Data transformation (<200 LOC)
- `components/charts/utils/chart-theme.ts` - BDN theme config (<150 LOC)

**BlnkFinance Integration:**

- `server/src/integrations/blnk-core.ts` - Blnk API client (<400 LOC)
- `server/src/services/ledger-sync-service.ts` - Transaction sync (<400 LOC)
- `server/src/services/balance-service.ts` - Balance management (<300 LOC)
- `server/src/services/reconciliation-service.ts` - Reconciliation (<300 LOC)
- `types/blnk.ts` - Blnk TypeScript types (<200 LOC)
- `app/admin/ledger.tsx` - Ledger entries view (<400 LOC)
- `app/admin/reconciliation.tsx` - Reconciliation dashboard (<400 LOC)
- `app/admin/balances.tsx` - Balance snapshots view (<400 LOC)

### Modified Files

- `app/admin/analytics.tsx` - Update to use Victory charts
- `server/src/services/transaction-engine.ts` - Add Blnk sync
- `server/src/services/payment-engine.ts` - Add Blnk sync
- `server/prisma/schema.prisma` - Add Blnk integration models
- `package.json` - Add Victory dependencies

## 4. Success Metrics

**Charting:**

- Chart render time < 200ms
- Chart component bundle size < 50KB per chart type
- 100% TypeScript type coverage
- All charts responsive on mobile/tablet/desktop

**BlnkFinance Integration:**

- Transaction sync success rate > 99.5%
- Sync latency < 500ms
- Balance accuracy 100% (reconciled)
- Reconciliation success rate > 95%

## 5. Dependencies

**New npm packages:**

```json
{
  "victory-native": "^36.9.0",
  "victory": "^36.9.0",
  "@blnkfinance/blnk-sdk": "^latest"
}
```

## 6. Testing Strategy

**Chart Components:**

- Unit tests for data transformation
- Visual regression tests
- Performance tests (large datasets)
- Cross-platform tests (web, iOS, Android)

**Blnk Integration:**

- Integration tests for Blnk API client
- Sync service tests (mock Blnk responses)
- Reconciliation tests
- Balance accuracy tests

## 7. Migration Timeline

**Weeks 1-2: Charting Migration**

- Install Victory, create wrapper components
- Migrate existing charts
- Test and refine

**Weeks 3-4: Blnk Core Setup**

- Set up Blnk Core infrastructure
- Create API client and types
- Implement sync service

**Weeks 5-6: Integration & Admin**

- Integrate sync into transaction engine
- Build admin ledger views
- Add Blnk-powered charts

**Week 7: Testing & Refinement**

- End-to-end testing
- Performance optimization
- Documentation