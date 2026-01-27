---
name: BDN 2.0 Comprehensive Technical Plan
overview: ""
todos: []
---

# BDN 2.0 Comprehensive Technical Plan

**Last Updated:** 2026-01-27  
**Status:** 📋 **Planning Document** - See [implementation-status-2026.md](./implementation-status-2026.md) for current implementation status

## Implementation Status Overview

**Status Legend:**

- ✅ **Implemented** - Feature is fully implemented and working
- ⏳ **In Progress** - Feature is partially implemented
- 📋 **Planned** - Feature is documented and planned but not started
- ❌ **Not Started** - Feature not yet planned or started

**Quick Status:**

- **Frontend Infrastructure:** ✅ Implemented (API client, error handling, loading states)
- **Backend API:** ⏳ In Progress (Only Products API implemented)
- **Transaction Engine:** 📋 Planned (Not implemented)
- **Payment Processors:** 📋 Planned (Not integrated)
- **Database:** ⏳ In Progress (PostgreSQL implemented, Firestore planned)
- **Business Features:** ✅ Implemented (Onboarding, products, orders)
- **Shopping Flows:** ✅ Implemented (Cart, checkout, order confirmation)

**For detailed implementation status, see:** [implementation-status-2026.md](./implementation-status-2026.md)

---

## Executive Summary

This plan outlines the complete technical architecture for BDN 2.0, including the BLKD payment system integration with Ecom Payments and iPayOuts, comprehensive inventory management with third-party integrations (Shopify, WooCommerce, Printful), hybrid database strategy (Firestore + PostgreSQL), content gating system for inbound marketing, Google Cloud hosting, CI/CD pipeline, and AI-enhanced user experience features.

**Note:** This document describes the planned architecture. Many features are documented but not yet implemented. See implementation status document for current state.

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Frontend (Expo/React Native)                    │
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │ Public Pages         │  │ Authenticated Pages       │   │
│  │ (@web)      │  │ (@(tabs), @pages)        │   │
│  │ - Businesses (preview)│  │ - Full content access    │   │
│  │ - Events (preview)   │  │ - Transactions           │   │
│  │ - Blog (excerpts)    │  │ - User features          │   │
│  │ - Content gating     │  │                          │   │
│  └──────────┬───────────┘  └──────────┬───────────────┘   │
└─────────────┼──────────────────────────┼───────────────────┘
              │                          │
              │ HTTPS/REST API            │
┌─────────────▼──────────────────────────▼───────────────────┐
│              Backend API (Node.js/Express)                   │
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │ Public APIs          │  │ Authenticated APIs        │   │
│  │ - Limited content    │  │ - Full content            │   │
│  │ - SEO optimized     │  │ - Transactions            │   │
│  │ - No auth required  │  │ - User data               │   │
│  └──────────────────────┘  └──────────────────────────┘   │
│  - Transaction Engine (BLKD processing)                     │
│  - Payment Gateway Integration                              │
│  - Content Gating Service                                   │
│  - SEO Service                                              │
└──────┬──────────────────────┬───────────────────────────────┘
       │                      │
       │                      │
┌──────▼──────────┐  ┌────────▼──────────┐  ┌──────────────┐
│   PostgreSQL    │  │   Firestore      │  │  Google Cloud│
│  (Transactional)│  │  (Real-time)     │  │  Services    │
│  - Public content│  │  - Analytics     │  │  - SEO       │
│  - Gated content│  │  - Conversions   │  │  - Analytics │
└─────────────────┘  └──────────────────┘  └──────────────┘
       │                      │
       │                      │
┌──────▼──────────────────────▼──────────────────────────────┐
│         External Payment Processors                          │
│  - Ecom Payments (Credit Cards)                             │
│  - iPayOuts (ACH/Bank Transfers)                            │
└─────────────────────────────────────────────────────────────┘
```

### Clean Architecture Layers

1. **Presentation Layer** (`app/`): React Native components, screens, navigation
2. **Application Layer** (`lib/`, `hooks/`): Business logic, API clients, utilities
3. **Domain Layer** (`types/`): Type definitions, domain models
4. **Infrastructure Layer** (`server/`, `lib/firebase.ts`): Database, external services, payment processors

## Database Strategy (Hybrid Approach)

**Status:** ⏳ **In Progress** - PostgreSQL implemented, Firestore planned

### PostgreSQL (Transactional Data)

**Status:** ✅ **Implemented** - Basic schema exists and working

**Location:** `server/prisma/schema.prisma`

**Use Cases:**

- User accounts and authentication
- Orders and transactions (audit trail)
- Business profiles and products
- Financial records (wallets, balances)
- Subscription management

**Key Collections:**

- `users` - User accounts
- `businesses` - Business profiles
- `products` - Product catalog
- `product_variants` - Product variants
- `inventory_items` - Stock levels per location
- `inventory_locations` - Warehouse/fulfillment locations
- `platform_product_mappings` - External platform sync mappings
- `bulk_upload_jobs` - Bulk import job tracking
- `orders` - Order records
- `transactions` - Financial transactions
- `wallets` - Wallet balances
- `subscriptions` - BDN+ subscriptions

### Firestore (Real-time Data)

**Status:** 📋 **Planned** - Documented but not yet implemented

**Location:** `action_plans/database-design.md`

**Use Cases:**

- Real-time notifications
- Live chat/messaging
- Real-time balance updates
- Activity feeds
- Presence/online status
- User preferences (synced across devices)

**Key Collections:**

- `users/{userId}/notifications` - Real-time notifications
- `users/{userId}/preferences` - User settings (synced)
- `users/{userId}/activity` - Activity feed
- `businesses/{businessId}/live` - Real-time business metrics

### Migration Strategy

1. Start with PostgreSQL for all core data
2. Add Firestore for real-time features incrementally
3. Use Firestore triggers to sync critical data to PostgreSQL for reporting
4. Implement dual-write pattern for critical operations

## Unified Transaction Engine

**Status:** 📋 **Planned** - Documented but not yet implemented

**Current State:** Payment flows use mock data. Basic fee calculation utilities exist in `lib/payment-processing.ts`.

### Architecture Overview

The Transaction Engine is the central system that handles all purchase and payment flows in BDN 2.0. While different purchase types (products, services, BLKD, gift cards, tokens, donations, invoices, event tickets) may have different UX flows, they all flow through the same unified backend engine for consistency, tracking, and error handling.

**Note:** This is the planned architecture. Current implementation uses mock payment processing in frontend flows.

```
┌─────────────────────────────────────────────────────────────┐
│              Frontend Purchase Flows (UX Layer)              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ Checkout │ │ C2B Pay  │ │ Buy BLKD │ │ Gift Card│ ... │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘     │
│       │            │            │            │            │
└───────┼────────────┼────────────┼────────────┼────────────┘
        │            │            │            │
        └────────────┴────────────┴────────────┘
                    │
        ┌───────────▼────────────┐
        │  Transaction Engine    │
        │  (Unified Backend)     │
        └───────────┬────────────┘
                    │
        ┌───────────┴────────────┐
        │                       │
┌───────▼────────┐    ┌─────────▼──────────┐
│ Payment        │    │ Transaction        │
│ Processing     │    │ Tracking & Logging │
│ - Validation   │    │ - Audit Trail     │
│ - Fee Calc     │    │ - Status Updates  │
│ - BLKD Conv    │    │ - Notifications   │
└───────┬────────┘    └─────────┬──────────┘
        │                       │
        └───────────┬───────────┘
                    │
        ┌───────────▼────────────┐
        │  External Processors   │
        │  - Ecom Payments       │
        │  - iPayOuts            │
        └────────────────────────┘
```

### Transaction Types

All transactions flow through the unified engine with standardized types:

**Purchase Types:**

- `PRODUCT_PURCHASE` - Marketplace product checkout
- `SERVICE_BOOKING` - Service booking/payment
- `EVENT_TICKET` - Event ticket purchase
- `GIFT_CARD_PURCHASE` - Gift card order
- `BLKD_PURCHASE` - BLKD currency purchase
- `TOKEN_PURCHASE` - Token purchase
- `C2B_PAYMENT` - Consumer-to-business direct payment
- `INVOICE_PAYMENT` - Invoice payment
- `DONATION` - Nonprofit donation
- `SUBSCRIPTION` - Subscription payment

**Transaction Operations:**

- `PAYMENT` - Outgoing payment
- `TRANSFER` - Internal transfer
- `REFUND` - Refund operation
- `CASHBACK` - Cashback credit
- `FEE` - Fee deduction
- `DEPOSIT` - Fund deposit
- `WITHDRAWAL` - Fund withdrawal

### Unified Transaction Flow

**Phase 1: Validation & Preparation**

1. Validate purchase request (amount, items, payment method)
2. Check user permissions and limits
3. Calculate fees (service fee, platform fee, processing fee)
4. Check inventory/availability (for products/services)
5. Reserve inventory (if applicable)
6. Calculate BLKD conversion (if needed)

**Phase 2: Payment Processing**

1. Process payment via selected method:
   - Credit Card → Ecom Payments
   - Bank Account → iPayOuts
   - BLKD Wallet → Direct transfer
   - Hybrid (BLKD + external)

2. Handle payment processor responses
3. Update Hub Wallet (if external payment)
4. Convert USD → BLKD (if needed)

**Phase 3: Transaction Recording**

1. Create transaction records:
   - Consumer transaction (payment out)
   - Business/entity transaction (payment received)
   - Platform fee transaction (if applicable)
   - Cashback transaction (if applicable)

2. Update wallet balances
3. Update inventory (if applicable)
4. Create order record (if applicable)

**Phase 4: Post-Processing**

1. Send notifications (email, push, in-app)
2. Update user activity/points
3. Trigger fulfillment (if applicable)
4. Update analytics
5. Sync to external platforms (if applicable)

### Transaction Engine Implementation

**Core Service** (`server/src/services/transaction-engine.ts`):

```typescript
interface TransactionRequest {
  type: TransactionType;
  userId: string;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  items?: TransactionItem[]; // For product purchases
  metadata?: TransactionMetadata;
}

interface TransactionResponse {
  transactionId: string;
  orderId?: string;
  status: TransactionStatus;
  feeBreakdown: FeeBreakdown;
  blkdAmount?: number; // If BLKD conversion occurred
  receipt?: Receipt;
}

class TransactionEngine {
  async processTransaction(
    request: TransactionRequest,
  ): Promise<TransactionResponse>;
  async validateTransaction(
    request: TransactionRequest,
  ): Promise<ValidationResult>;
  async calculateFees(request: TransactionRequest): Promise<FeeBreakdown>;
  async processPayment(request: TransactionRequest): Promise<PaymentResult>;
  async recordTransaction(result: PaymentResult): Promise<TransactionRecord>;
  async handlePostProcessing(transaction: TransactionRecord): Promise<void>;
}
```

**Transaction Handlers** (Strategy Pattern):

- `server/src/services/transactions/product-purchase-handler.ts`
- `server/src/services/transactions/service-booking-handler.ts`
- `server/src/services/transactions/blkd-purchase-handler.ts`
- `server/src/services/transactions/gift-card-handler.ts`
- `server/src/services/transactions/c2b-payment-handler.ts`
- `server/src/services/transactions/donation-handler.ts`
- `server/src/services/transactions/invoice-handler.ts`

Each handler implements the same interface but handles type-specific logic (inventory updates, fulfillment, etc.).

### Unified Tracking System

**Transaction Tracking** (`server/src/services/transaction-tracker.ts`):

- Real-time status updates via Firestore
- Transaction history with filtering
- Search and analytics
- Audit trail for compliance
- Webhook events for external systems

**Status Flow:**

```
PENDING → PROCESSING → COMPLETED
              ↓
           FAILED → RETRY → PROCESSING
              ↓
         CANCELLED
```

### Refactoring Strategy

**Phase 1: Create Unified Engine** (Week 1-2)

1. Build `TransactionEngine` core service
2. Create transaction handler interfaces
3. Implement base transaction flow
4. Add comprehensive logging

**Phase 2: Migrate Purchase Flows** (Week 3-6)

1. **Product Checkout** (`app/pages/checkout.tsx`)
   - Replace mock payment with `TransactionEngine.processTransaction()`
   - Use unified error handling
   - Update to use transaction tracking

2. **C2B Payment** (`app/pages/payments/c2b-payment.tsx`)
   - Migrate to unified engine
   - Use `C2BPaymentHandler`
   - Standardize error messages

3. **BLKD Purchase** (`app/pages/payments/buy-blkd.tsx`)
   - Use `BLKDPurchaseHandler`
   - Integrate with Hub Wallet
   - Unified tracking

4. **Gift Card** (`app/pages/payments/buy-gift-card.tsx`)
   - Use `GiftCardHandler`
   - Standardize flow

5. **Token Purchase** (`app/pages/payments/token-purchase.tsx`)
   - Use `TokenPurchaseHandler`
   - Unified processing

6. **Invoice Payment** (`app/pages/payments/invoice.tsx`)
   - Use `InvoiceHandler`
   - Standardize flow

7. **Event Tickets** (`app/pages/events/checkout.tsx`)
   - Use `EventTicketHandler`
   - Unified processing

**Phase 3: Consolidate Common Logic** (Week 7-8)

1. Extract shared payment processing logic
2. Consolidate fee calculation
3. Unify wallet operations
4. Standardize notification sending

**Phase 4: Testing & Optimization** (Week 9-10)

1. End-to-end testing for all flows
2. Performance optimization
3. Error scenario testing
4. Load testing

## Payment System Integration

**Status:** 📋 **Planned** - Payment processors not yet integrated

**Current State:** Payment flows have complete UI but use mock payment processing. Ready for backend API integration.

### BLKD Payment Flow Architecture

```
Consumer Payment Methods:
├── Credit Card → Ecom Payments → Hub Wallet (USD Reserve)
├── Bank Account → iPayOuts → Hub Wallet (USD Reserve)
└── BLKD Wallet → Direct to Transaction Engine

Transaction Engine:
├── Receives USD from Hub Wallet
├── Converts USD → BLKD (1:1 rate)
├── Moves BLKD between wallets
├── Calculates fees ($0.49 per transaction)
├── Distributes cashback
└── Tracks all transactions

Business Receives:
├── BLKD instantly in wallet
└── Can cash out via iPayOuts (BLKD → USD, 5% fee)
```

### Implementation Files

**Core Payment Processing:**

- `server/src/services/payment-engine.ts` - Transaction Engine
- `server/src/services/hub-wallet.ts` - Hub Wallet (USD Reserve) management
- `server/src/integrations/ecom-payments.ts` - Ecom Payments integration
- `server/src/integrations/ipayouts.ts` - iPayOuts integration

**Frontend Integration:**

- `lib/payment-processing.ts` - Already exists, needs enhancement
- `app/(tabs)/pay.tsx` - Payment UI (already exists)
- `app/pages/payments/*` - Payment flows (already exist)

### Payment Processor Integration

**Status:** 📋 **Planned** - Not yet integrated

**Ecom Payments (Credit Cards):**

- 📋 Replace Stripe integration (planned)
- 📋 Handle card charges (planned)
- 📋 Batch payouts to Hub Wallet (planned)
- 📋 Webhook handling for payment confirmations (planned)

**iPayOuts (ACH/Bank Transfers):**

- 📋 Replace Dwolla integration (planned)
- 📋 Handle ALL bank transfers (in & out) (planned)
- 📋 Transfer USD from Ecom → Hub Wallet (planned)
- 📋 Send USD from Hub → Business banks (planned)
- 📋 Handle cash-out requests (BLKD → USD, 5% fee) (planned)

**i-payout API Integration Details:**
- 📋 **API Base URL**: `https://merchantapi.testewallet.com/api/v1` (test) / `https://merchantapi.ewallet.com/api/v1` (production)
- 📋 **Authentication**: Bearer token with X-MerchantId header
- 📋 **Key Endpoints**:
  - `POST /api/v1/beneficiaries` - Create beneficiary
  - `POST /api/v1/transfermethods/beneficiaries/{token}/bank-accounts` - Add bank account
  - `POST /api/v1/transfers` - Create transfer (RegularACH, SameDayACH, RealtimeACH, etc.)
  - `POST /api/v1/transfers/{token}/approve` - Approve transfer (if autoApprove: false)
  - `GET /api/v1/transfers/{token}` - Get transfer status
- 📋 **Webhooks**: Real-time notifications for transfer status changes
- 📋 **Security**: All bank data managed exclusively by i-payout, BDN only stores tokenized references
- 📋 **See**: `action_plans/ipayout-integration-guide.md` for complete integration details

## Backend API Development

**Status:** ⏳ **In Progress** - Only Products API implemented

**Current State:**

- ✅ Products API implemented (`server/src/api/products/`)
- ❌ Most other endpoints not yet implemented
- ✅ Frontend ready for API integration (API client infrastructure complete)

### API Structure

**Location:** `server/src/api/`

**Required Endpoints:**

**Note:** Status indicators show implementation status:

- ✅ Implemented
- ⏳ In Progress
- 📋 Planned
- ❌ Not Started

#### Authentication (`server/src/api/auth/`)

**Status:** ❌ **Not Started**

- ❌ `POST /api/auth/login` - User login
- ❌ `POST /api/auth/signup` - User registration
- ❌ `POST /api/auth/refresh` - Token refresh
- ❌ `POST /api/auth/logout` - Logout
- ❌ `POST /api/auth/reset-password` - Password reset

#### Payments (`server/src/api/payments/`)

**Status:** ❌ **Not Started**

- ❌ `POST /api/payments/c2b` - Consumer-to-business payment
- ❌ `POST /api/payments/blkd/purchase` - Buy BLKD
- ❌ `POST /api/payments/blkd/cashout` - Cash out BLKD to USD
- ❌ `POST /api/payments/gift-card/order` - Gift card purchase
- ❌ `POST /api/payments/tokens/purchase` - Token purchase
- ❌ `GET /api/payments/methods` - List payment methods
- ❌ `POST /api/payments/methods` - Add payment method

#### Transactions (`server/src/api/transactions/`)

**Status:** ❌ **Not Started**

- ❌ `GET /api/transactions` - List user transactions
- ❌ `GET /api/transactions/:id` - Get transaction details
- ❌ `POST /api/transactions/:id/refund` - Refund transaction

#### Wallets (`server/src/api/wallets/`)

**Status:** ❌ **Not Started**

- ❌ `GET /api/wallets` - List user wallets
- ❌ `GET /api/wallets/:id` - Get wallet details
- ❌ `GET /api/wallets/:id/balance` - Get wallet balance

#### Orders (`server/src/api/orders/`)

**Status:** ❌ **Not Started**

- ❌ `POST /api/orders/checkout` - Process checkout
- ❌ `GET /api/orders` - List orders
- ❌ `GET /api/orders/:id` - Get order details

#### Users (`server/src/api/users/`)

**Status:** ❌ **Not Started**

- ❌ `GET /api/users/me` - Get current user
- ❌ `PUT /api/users/me` - Update user profile
- ❌ `GET /api/users/me/preferences` - Get user preferences
- ❌ `PUT /api/users/me/preferences` - Update user preferences

#### Products (`server/src/api/products/`)

**Status:** ✅ **Implemented**

- ✅ `GET /api/products` - List products
- ✅ `GET /api/products/:id` - Get product details
- ✅ `POST /api/products` - Create product

### API Client Implementation

**Location:** `lib/api-client.ts` (exists, needs enhancement)

**Features:**

- Request/response interceptors
- Authentication token handling
- Refresh token logic
- Error handling and retry logic
- Request caching
- Environment-based base URLs

## User Settings & Preferences

### Settings Structure

**Location:** `types/notifications.ts`, `app/pages/notifications/settings.tsx`

**Settings Categories:**

1. **Notification Preferences** (`NotificationPreferences`)
   - Channels: wallet, promotions, events, system, social, merchant
   - Delivery methods: push, email, in-app
   - Quiet hours
   - Digest frequency

2. **Privacy Settings**
   - Profile visibility
   - Email/phone visibility
   - Activity sharing

3. **Payment Preferences**
   - Default payment method
   - Auto-use BLKD
   - Save payment methods

4. **Shopping Preferences**
   - Default shipping address
   - Preferred shipping method
   - Auto-fill settings

5. **App Preferences**
   - Language
   - Currency display (USD/BLKD)
   - Theme (already dark theme)

**Storage Strategy:**

- Firestore: Real-time sync across devices
- PostgreSQL: Persistent storage for reporting
- Local storage: Offline access

## Domain & Routing Configuration

### Domain Structure

**Production Domains:**

- `blackdollarnetwork.com` - Public-facing marketing website (`@web`)
- `app.blackdollarnetwork.com` - User application (dashboard if logged in, login if not) (`@(tabs)`, `@pages`)
- `operator.blackdollarnetwork.com` - Admin/Operator dashboard (if logged in as admin) (`@admin`)
- `developer.blackdollarnetwork.com` - Developer dashboard (if logged in as developer) (`@developer`)
- `designer.blackdollarnetwork.com` - Designer dashboard (if logged in as designer) (`@designer`)

**Sandbox Domains:**

- `sandbox.blackdollarnetwork.com` - Sandbox marketing site
- `app.sandbox.blackdollarnetwork.com` - Sandbox app
- `operator.sandbox.blackdollarnetwork.com` - Sandbox admin
- `developer.sandbox.blackdollarnetwork.com` - Sandbox developer
- `designer.sandbox.blackdollarnetwork.com` - Sandbox designer

**Local Development:**

- `localhost:8081` - All routes (subdomain detection via query params or host header)

### Subdomain Detection & Routing

**Implementation** (`lib/subdomain-utils.ts` - already exists, needs enhancement):

```typescript
export enum Subdomain {
  PUBLIC = null, // No subdomain or www
  APP = "app",
  OPERATOR = "operator",
  DEVELOPER = "developer",
  DESIGNER = "designer",
}

export function getSubdomain(): Subdomain {
  if (Platform.OS !== "web") {
    return Subdomain.APP; // Mobile apps default to app
  }

  const hostname = window.location.hostname;

  // Local development
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    const params = new URLSearchParams(window.location.search);
    const subdomain = params.get("subdomain");
    if (subdomain === "operator") return Subdomain.OPERATOR;
    if (subdomain === "developer") return Subdomain.DEVELOPER;
    if (subdomain === "designer") return Subdomain.DESIGNER;
    if (subdomain === "app") return Subdomain.APP;
    return Subdomain.PUBLIC; // Default to public
  }

  // Production/Sandbox
  const parts = hostname.split(".");
  if (parts.length >= 3) {
    const subdomain = parts[0];
    if (subdomain === "app") return Subdomain.APP;
    if (subdomain === "operator") return Subdomain.OPERATOR;
    if (subdomain === "developer") return Subdomain.DEVELOPER;
    if (subdomain === "designer") return Subdomain.DESIGNER;
  }

  return Subdomain.PUBLIC; // Default to public marketing site
}
```

**Root Layout Routing** (`app/_layout.tsx` - needs enhancement):

```typescript
export default function RootLayout() {
  const subdomain = getSubdomain();

  return (
    <Stack>
      {/* Public pages - only on public subdomain */}
      {subdomain === Subdomain.PUBLIC && (
        <Stack.Screen name="web" />
      )}

      {/* App routes - on app subdomain or mobile */}
      {(subdomain === Subdomain.APP || Platform.OS !== 'web') && (
        <>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="pages" />
        </>
      )}

      {/* Admin routes - only on operator subdomain */}
      {subdomain === Subdomain.OPERATOR && (
        <Stack.Screen name="admin" />
      )}

      {/* Developer routes - only on developer subdomain */}
      {subdomain === Subdomain.DEVELOPER && (
        <Stack.Screen name="developer" />
      )}

      {/* Designer routes - only on designer subdomain */}
      {subdomain === Subdomain.DESIGNER && (
        <Stack.Screen name="designer" />
      )}
    </Stack>
  );
}
```

### Domain-Based Access Control

**Middleware** (`server/src/middleware/subdomain-auth.ts`):

```typescript
export function subdomainAuth(req: Request, res: Response, next: NextFunction) {
  const hostname = req.get("host") || "";
  const subdomain = extractSubdomain(hostname);

  // Set subdomain context for request
  req.subdomain = subdomain;

  // Enforce subdomain-specific access
  if (subdomain === "operator" && !req.user?.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }

  if (subdomain === "developer" && !req.user?.isDeveloper) {
    return res.status(403).json({ error: "Developer access required" });
  }

  if (subdomain === "designer" && !req.user?.isDesigner) {
    return res.status(403).json({ error: "Designer access required" });
  }

  next();
}
```

## Environment Management

### Environment Configuration

**Location:** `lib/config.ts`, `.env` files

**Environments:**

1. **Development** (`development`)
   - Local development
   - Domain: `localhost:8081`
   - Mock payment processors
   - Local PostgreSQL/Firestore emulators
   - Subdomain via query params: `?subdomain=app`, `?subdomain=operator`, `?subdomain=developer`, `?subdomain=designer`

2. **Sandbox** (`sandbox`)
   - Staging environment
   - Domains: `*.sandbox.blackdollarnetwork.com`
   - Sandbox payment processor accounts
   - Test data
   - Separate Firebase project

3. **Production** (`production`)
   - Live environment
   - Domains: `*.blackdollarnetwork.com`
   - Production payment processors
   - Real user data
   - Production Firebase project

**Configuration Files:**

- `.env.development` - Development config
- `.env.sandbox` - Sandbox config
- `.env.production` - Production config (via EAS Secrets)

**Environment Variables:**

```bash
# API Configuration
EXPO_PUBLIC_API_URL=https://api.blackdollarnetwork.com
EXPO_PUBLIC_ENVIRONMENT=production

# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...

# Payment Processors
EXPO_PUBLIC_ECOM_PAYMENTS_API_KEY=...
EXPO_PUBLIC_IPAYOUTS_API_KEY=...

# Third-Party Integrations
SHOPIFY_API_KEY=...
SHOPIFY_API_SECRET=...
SHOPIFY_WEBHOOK_SECRET=...
WOOCOMMERCE_CONSUMER_KEY=...
WOOCOMMERCE_CONSUMER_SECRET=...
WOOCOMMERCE_STORE_URL=...
PRINTFUL_API_KEY=...
PRINTFUL_WEBHOOK_SECRET=...

# Backend
DATABASE_URL=postgresql://...
FIREBASE_ADMIN_KEY=...

# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=...
GOOGLE_CLOUD_STORAGE_BUCKET=...
```

### Integration-Specific Considerations

**Shopify:**

- Use both REST and GraphQL APIs (GraphQL for complex queries)
- Handle rate limits (40 requests/second for REST, varies for GraphQL)
- Implement webhook signature verification
- Support multiple store locations for inventory
- Handle product images and variants efficiently

**WooCommerce:**

- **Critical:** Handle HPOS (High Performance Order Storage) compatibility issues
- Use REST API v3 (non-legacy)
- Implement fallback to legacy API if HPOS causes issues
- Handle custom endpoints for advanced inventory filtering
- Support multiple site configurations
- Handle authentication via OAuth 1.0a or Application Password

**Printful:**

- **Important:** Product management API only works in Manual/API mode
- Use Catalog API for fetching blank products
- Use Sync API for product synchronization
- Handle stock sync for POD availability
- Support product templates and mockups
- Handle order fulfillment webhooks
- Rate limits: 120 requests/minute
- Support for multiple stores per account

**Sync Strategy:**

- **Source of Truth:** Define which system owns which fields
  - Product titles/images: External platform (Shopify/WooCommerce)
  - BLKD pricing: Internal BDN system
  - Stock levels: Sync from Printful for POD, internal for in-house
- **Conflict Resolution:**
  - Timestamp-based (most recent wins)
  - Manual review queue for conflicts
  - Version tracking for critical fields
- **Sync Frequency:**
  - Real-time: Via webhooks (preferred)
  - Scheduled: Hourly for inventory, daily for products
  - On-demand: Manual trigger from UI

## CI/CD Pipeline

### GitHub Actions Workflow

**Location:** `.github/workflows/`

**Workflows:**

1. **CI Pipeline** (`.github/workflows/ci.yml`)
   - Run on every PR
   - Lint and type check
   - Run tests
   - Build check

2. **Deploy to Sandbox** (`.github/workflows/deploy-sandbox.yml`)
   - Trigger: Push to `develop` branch
   - Build Expo app
   - Deploy backend to Cloud Run (sandbox)
   - Run database migrations
   - Update Firestore indexes

3. **Deploy to Production** (`.github/workflows/deploy-production.yml`)
   - Trigger: Push to `main` branch (or manual)
   - Build Expo app
   - Deploy backend to Cloud Run (production)
   - Run database migrations
   - Update Firestore indexes
   - Submit to app stores (if needed)

**Build Steps:**

1. Install dependencies
2. Run type checking (`npm run type-check`)
3. Run linting (`npm run lint`)
4. Check file sizes (`npm run check-file-sizes`)
5. Run tests
6. Build backend (`npm run build` in `server/`)
7. Build frontend (`eas build`)
8. Deploy backend to Cloud Run
9. Run database migrations
10. Update Firestore security rules/indexes

## Comprehensive Error Handling System

### Architecture

The error handling system provides detailed error information for development while presenting user-friendly messages on the frontend. Errors are categorized, logged comprehensively, and handled gracefully.

```
┌─────────────────────────────────────────────────────────────┐
│                    Error Occurrence                         │
└──────────────────────┬─────────────────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │   Error Classification      │
        │   - Category                │
        │   - Severity                │
        │   - Error Code              │
        └──────────────┬──────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼────────┐          ┌─────────▼──────────┐
│ Development    │          │ User-Facing        │
│ Logging        │          │ Error Handling     │
│ - Full stack   │          │ - Friendly message│
│ - Context      │          │ - Actionable       │
│ - Metadata     │          │ - Non-intrusive    │
└────────────────┘          └───────────────────┘
```

### Error Categories

**Payment Errors:**

- `PAYMENT_INSUFFICIENT_FUNDS` - Not enough balance
- `PAYMENT_METHOD_DECLINED` - Card/bank declined
- `PAYMENT_PROCESSOR_ERROR` - External processor failure
- `PAYMENT_TIMEOUT` - Payment processing timeout
- `PAYMENT_INVALID_METHOD` - Invalid payment method

**Transaction Errors:**

- `TRANSACTION_VALIDATION_FAILED` - Invalid transaction data
- `TRANSACTION_LIMIT_EXCEEDED` - Transaction limit exceeded
- `TRANSACTION_DUPLICATE` - Duplicate transaction detected
- `TRANSACTION_INVENTORY_UNAVAILABLE` - Out of stock
- `TRANSACTION_PROCESSING_FAILED` - Processing error

**Network Errors:**

- `NETWORK_CONNECTION_ERROR` - Connection failed
- `NETWORK_TIMEOUT` - Request timeout
- `NETWORK_RATE_LIMIT` - Rate limit exceeded

**Authentication Errors:**

- `AUTH_TOKEN_EXPIRED` - Token expired
- `AUTH_UNAUTHORIZED` - Unauthorized access
- `AUTH_INVALID_CREDENTIALS` - Invalid credentials

**Business Logic Errors:**

- `BUSINESS_RULE_VIOLATION` - Business rule violated
- `BUSINESS_LIMIT_EXCEEDED` - Business limit exceeded
- `BUSINESS_INVALID_STATE` - Invalid business state

### Error Handling Implementation

**Error Types** (`server/src/types/errors.ts`):

```typescript
export enum ErrorCategory {
  PAYMENT = "PAYMENT",
  TRANSACTION = "TRANSACTION",
  NETWORK = "NETWORK",
  AUTHENTICATION = "AUTHENTICATION",
  VALIDATION = "VALIDATION",
  BUSINESS_LOGIC = "BUSINESS_LOGIC",
  EXTERNAL_SERVICE = "EXTERNAL_SERVICE",
  SYSTEM = "SYSTEM",
}

export enum ErrorSeverity {
  LOW = "LOW", // Informational, non-critical
  MEDIUM = "MEDIUM", // User action required
  HIGH = "HIGH", // Transaction failed, retry possible
  CRITICAL = "CRITICAL", // System error, requires attention
}

export interface BDNError {
  code: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string; // Technical message for logging
  userMessage: string; // User-friendly message
  details?: Record<string, any>;
  stack?: string;
  context?: {
    userId?: string;
    transactionId?: string;
    endpoint?: string;
    timestamp: string;
  };
  retryable: boolean;
  retryAfter?: number; // Seconds
}
```

**Error Handler Service** (`server/src/services/error-handler.ts`):

```typescript
class ErrorHandler {
  // Create structured error
  createError(
    code: string,
    category: ErrorCategory,
    severity: ErrorSeverity,
    technicalMessage: string,
    userMessage: string,
    details?: Record<string, any>,
  ): BDNError;

  // Log error with full context
  logError(error: BDNError, context?: Record<string, any>): void;

  // Get user-friendly message
  getUserMessage(error: BDNError): string;

  // Determine if error is retryable
  isRetryable(error: BDNError): boolean;

  // Format error for API response
  formatForAPI(error: BDNError, includeDetails?: boolean): APIErrorResponse;
}
```

**Error Mapper** (`lib/error-mapper.ts`):

Maps technical errors to user-friendly messages:

```typescript
const ERROR_MESSAGES: Record<string, string> = {
  // Payment Errors
  PAYMENT_INSUFFICIENT_FUNDS:
    "You don't have enough funds to complete this transaction. Please add funds or choose a different payment method.",
  PAYMENT_METHOD_DECLINED:
    "Your payment method was declined. Please check your card details or try a different payment method.",
  PAYMENT_PROCESSOR_ERROR:
    "We're having trouble processing your payment right now. Please try again in a few moments.",

  // Transaction Errors
  TRANSACTION_INVENTORY_UNAVAILABLE:
    "Sorry, this item is no longer available. Please check back later or browse similar items.",
  TRANSACTION_LIMIT_EXCEEDED:
    "You've reached the transaction limit. Please try again later or contact support.",

  // Network Errors
  NETWORK_CONNECTION_ERROR:
    "Unable to connect. Please check your internet connection and try again.",
  NETWORK_TIMEOUT: "The request took too long. Please try again.",

  // Generic
  UNKNOWN_ERROR:
    "Something went wrong. Please try again or contact support if the issue persists.",
};

export function getUserFriendlyMessage(error: BDNError | Error): string {
  // Implementation
}
```

### Frontend Error Handling

**Error Display Component** (`components/ErrorDisplay.tsx`):

```typescript
interface ErrorDisplayProps {
  error: BDNError | Error | string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: "toast" | "inline" | "modal";
  showDetails?: boolean; // Only in development
}

export function ErrorDisplay(props: ErrorDisplayProps) {
  // Shows user-friendly message
  // Optionally shows technical details in development
  // Provides retry action if applicable
}
```

**Error Boundary Enhancement** (`components/ErrorBoundary.tsx`):

- Enhanced with error categorization
- Shows user-friendly messages
- Logs detailed errors for development
- Provides recovery options

**API Error Interceptor** (`lib/api-client.ts`):

```typescript
// Intercept API errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const bdnError = mapToBDNError(error);

    // Log detailed error for development
    if (ENV.isDevelopment) {
      logger.error("API Error", {
        code: bdnError.code,
        category: bdnError.category,
        details: bdnError.details,
        stack: bdnError.stack,
      });
    }

    // Show user-friendly message
    ErrorDisplay.show({
      error: bdnError,
      variant: "toast",
      showDetails: ENV.isDevelopment,
    });

    return Promise.reject(bdnError);
  },
);
```

### Error Logging Strategy

**Development Mode:**

- Full error stack traces
- Request/response data
- User context
- Transaction context
- Console logging with colors
- File logging for persistence

**Production Mode:**

- Sanitized error messages (no sensitive data)
- Error codes and categories
- Aggregated metrics
- Sentry integration for critical errors
- Cloud Logging integration
- No sensitive data in logs

**Error Logging Service** (`server/src/services/error-logger.ts`):

```typescript
class ErrorLogger {
  log(error: BDNError, context?: Record<string, any>): void {
    // Structured logging
    // Include: code, category, severity, context
    // Exclude: sensitive data (passwords, tokens, full card numbers)
  }

  logToSentry(error: BDNError): void {
    // Only for HIGH and CRITICAL severity
    // Include full context for debugging
  }

  logToCloudLogging(error: BDNError): void {
    // All errors to Cloud Logging
    // Structured JSON format
  }
}
```

### Error Recovery Strategies

**Automatic Retry:**

- Network errors: 3 retries with exponential backoff
- Payment processor errors: 2 retries
- Rate limit errors: Retry after specified time

**User Actions:**

- Retry button for retryable errors
- Alternative payment method suggestion
- Contact support for critical errors
- Clear error messages with actionable steps

**Error Recovery Service** (`lib/error-recovery.ts`):

```typescript
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  backoffMs: number = 1000,
): Promise<T> {
  // Implementation with exponential backoff
}
```

### Error Monitoring & Alerts

**Error Metrics:**

- Error rate by category
- Error rate by endpoint
- Retry success rate
- Critical error alerts
- User impact metrics

**Alerting:**

- Critical errors: Immediate alert
- High severity: Alert within 5 minutes
- Error rate spikes: Alert threshold exceeded
- Payment processor errors: Immediate alert

## Content Gating & Inbound Marketing Strategy

### Overview

BDN 2.0 implements a content gating strategy where public pages (`@web`) display limited content to drive user signups. Users can browse businesses, events, and blog posts without authentication, but full access requires signup/login. This creates an inbound marketing funnel while maintaining SEO-friendly public content.

### Content Access Levels

**Public Access (No Authentication Required):**

- Business listings: Name, category, location, basic description, rating
- Event listings: Title, date, venue, basic description, ticket price range
- Blog posts: Title, excerpt, featured image, author, publish date
- Search functionality: Basic search with limited results
- Public pages: About, features, pricing, community, contact

**Gated Content (Requires Authentication):**

- Full business details: Complete description, products, reviews, contact info
- Full event details: Complete description, ticket purchase, attendee list
- Full blog content: Complete article text
- Advanced search: Full search results with filters
- User-specific features: Personalized recommendations, saved items, purchase history

### Content Gating Implementation

**Gating Component** (`components/ContentGate.tsx`):

```typescript
interface ContentGateProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  gateType?: 'soft' | 'hard'; // Soft: show preview, Hard: block completely
  previewContent?: React.ReactNode; // Content to show when gated
  ctaText?: string;
  onSignupClick?: () => void;
}

export function ContentGate(props: ContentGateProps) {
  const { isAuthenticated } = useAuth();

  if (!props.requiresAuth || isAuthenticated) {
    return <>{props.children}</>;
  }

  if (props.gateType === 'soft' && props.previewContent) {
    return (
      <>
        {props.previewContent}
        <SignupPrompt
          ctaText={props.ctaText}
          onSignupClick={props.onSignupClick}
        />
      </>
    );
  }

  return <SignupPrompt />;
}
```

**Signup Prompt Component** (`components/SignupPrompt.tsx`):

- Non-intrusive overlay or inline banner
- Clear value proposition
- Quick signup button
- "Already have an account? Sign in" link
- Dismissible (remembers preference for session)

### Public Content Pages

**Business Directory** (`app/web/businesses.tsx`):

- List of businesses with basic info
- Search and filter functionality
- Clicking business shows preview + signup prompt
- SEO-optimized URLs: `/businesses/[slug]`

**Events Directory** (`app/web/events.tsx`):

- List of upcoming events
- Category filters
- Event preview with signup prompt for details
- SEO-optimized URLs: `/events/[slug]`

**Blog/Updates** (`app/web/blog.tsx`):

- Blog post listings with excerpts
- Category and tag filters
- Full post requires authentication
- SEO-optimized URLs: `/blog/[slug]`

### API Endpoints for Public Content

**Public Business API** (`server/src/api/public/businesses.ts`):

- `GET /api/public/businesses` - List businesses (limited fields)
- `GET /api/public/businesses/:id` - Get business preview (limited fields)
- `GET /api/public/businesses/:id/full` - Get full business (requires auth)

**Public Events API** (`server/src/api/public/events.ts`):

- `GET /api/public/events` - List events (limited fields)
- `GET /api/public/events/:id` - Get event preview (limited fields)
- `GET /api/public/events/:id/full` - Get full event (requires auth)

**Public Blog API** (`server/src/api/public/blog.ts`):

- `GET /api/public/blog` - List blog posts (excerpts only)
- `GET /api/public/blog/:id` - Get blog post preview (excerpt)
- `GET /api/public/blog/:id/full` - Get full post (requires auth)

### Database Schema for Content Gating

**PostgreSQL Models** (`server/prisma/schema.prisma`):

```prisma
model Business {
  // ... existing fields ...
  isPublic: Boolean @default(true)
  publicDescription: String? // Short description for public view
  fullDescription: String? // Complete description (gated)
  publicFields: Json? // Which fields are public
}

model Event {
  // ... existing fields ...
  isPublic: Boolean @default(true)
  publicDescription: String? // Short description for public view
  fullDescription: String? // Complete description (gated)
  previewImage: String? // Image for public preview
}

model BlogPost {
  id String @id @default(uuid())
  title String
  excerpt String // Public preview
  content String // Full content (gated)
  slug String @unique
  authorId String
  category String
  tags String[]
  featuredImage String?
  isPublished Boolean @default(false)
  isPublic Boolean @default(true) // Can be gated
  publishedAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([slug])
  @@index([isPublished, publishedAt])
  @@map("blog_posts")
}

model ContentView {
  id String @id @default(uuid())
  contentType String // "business", "event", "blog"
  contentId String
  userId String? // null for anonymous views
  ipAddress String?
  userAgent String?
  viewedAt DateTime @default(now())

  @@index([contentType, contentId])
  @@index([userId])
  @@map("content_views")
}

model SignupConversion {
  id String @id @default(uuid())
  source String // "business_view", "event_view", "blog_view", "search"
  sourceId String? // ID of content that triggered signup
  userId String
  convertedAt DateTime @default(now())

  @@index([source, sourceId])
  @@index([userId])
  @@map("signup_conversions")
}
```

### Authentication Flow from Public Pages

**Seamless Signup Flow:**

1. User clicks "Sign up to view more" on gated content
2. Modal or redirect to signup page with context
3. After signup/login, redirect back to content with full access
4. Track conversion source for analytics

**Signup Context Preservation:**

- Store intended destination in session/localStorage
- Pass `returnUrl` parameter to auth flow
- Restore context after authentication

### SEO Optimization

**Public Content SEO:**

- Server-side rendering for public pages (Next.js/Expo web)
- Meta tags for businesses, events, blog posts
- Structured data (JSON-LD) for businesses and events
- Sitemap generation for public content
- Open Graph tags for social sharing

**SEO Service** (`server/src/services/seo-service.ts`):

- Generate meta tags
- Create structured data
- Generate sitemaps
- Handle canonical URLs

### Analytics & Conversion Tracking

**Content View Tracking:**

- Track anonymous views of public content
- Track authenticated views
- Track which content leads to signups
- Track conversion funnel: View → Signup Prompt → Signup → Full Access

**Analytics Events:**

- `content_viewed` - Content viewed (public or authenticated)
- `signup_prompt_shown` - Signup prompt displayed
- `signup_prompt_dismissed` - User dismissed prompt
- `signup_initiated` - User clicked signup
- `signup_completed` - User completed signup
- `content_unlocked` - User accessed gated content after signup

**Conversion Metrics:**

- Public content views
- Signup prompt impressions
- Signup conversion rate by content type
- Time to signup from first view
- Most effective content for conversions

### Implementation Strategy

**Phase 1: Public Content Pages** (Week 1-2)

- Create public business directory page
- Create public events directory page
- Enhance blog page with gating
- Add SEO meta tags

**Phase 2: Content Gating** (Week 3-4)

- Build ContentGate component
- Build SignupPrompt component
- Implement gating logic in public pages
- Add API endpoints for public content

**Phase 3: Authentication Flow** (Week 5-6)

- Implement return URL handling
- Add signup context preservation
- Create seamless auth flow from public pages
- Test conversion flow

**Phase 4: Analytics & Optimization** (Week 7-8)

- Implement content view tracking
- Add conversion tracking
- Build analytics dashboard
- A/B test signup prompts

### Files to Create/Modify

**New Files:**

- `components/ContentGate.tsx` - Content gating component
- `components/SignupPrompt.tsx` - Signup prompt component
- `app/web/businesses.tsx` - Public business directory
- `app/web/businesses/[slug].tsx` - Public business detail
- `app/web/events.tsx` - Public events directory
- `app/web/events/[slug].tsx` - Public event detail
- `server/src/api/public/businesses.ts` - Public business API
- `server/src/api/public/events.ts` - Public events API
- `server/src/api/public/blog.ts` - Public blog API
- `server/src/services/seo-service.ts` - SEO service
- `server/src/services/analytics-service.ts` - Analytics service
- `lib/hooks/useContentGate.ts` - Hook for content gating

**Modified Files:**

- `app/web/blog.tsx` - Add content gating
- `app/web/_layout.tsx` - Add new routes
- `server/prisma/schema.prisma` - Add content gating models
- `lib/api-client.ts` - Add public API endpoints
- `hooks/useAuth.ts` - Add return URL handling

## Code Quality & Refactoring Strategy

### Maximum Lines of Code (LOC) Policy

**Target:** Maximum 400 lines per file (as per repository rules)

**Current Violations:**

- `app/pages/checkout.tsx` - 1,020 lines (needs refactoring)
- `app/pages/support.tsx` - 1,553 lines (needs refactoring)
- `app/pages/tokens.tsx` - 1,530 lines (needs refactoring)
- `app/pages/products/create.tsx` - 1,258 lines (needs refactoring)
- `app/pages/payments/c2b-payment.tsx` - 1,920 lines (needs refactoring)
- `app/pages/payments/buy-gift-card.tsx` - 1,698 lines (needs refactoring)
- `app/pages/payments/buy-blkd.tsx` - 1,017 lines (needs refactoring)
- `app/pages/profile.tsx` - 1,004 lines (needs refactoring)
- `app/pages/book-service.tsx` - 818 lines (needs refactoring)
- `app/(tabs)/pay.tsx` - 1,116 lines (needs refactoring)
- `app/(tabs)/marketplace.tsx` - 800 lines (needs refactoring)

**Refactoring Strategy:**

1. **Component Extraction**
   - Extract reusable UI components
   - Extract form sections into separate components
   - Extract business logic into custom hooks
   - Extract utility functions into separate files

2. **File Organization**
   - Split large pages into smaller sub-components
   - Move shared logic to hooks or services
   - Create feature-specific component directories
   - Separate concerns (UI, logic, data)

3. **Pattern-Based Refactoring**
   - Use composition over large monolithic components
   - Extract step-based flows into separate step components
   - Create shared form components
   - Build reusable layout components

### Refactoring Patterns

**1. Component Extraction Pattern**

```typescript
// Before: Large component (1000+ lines)
export default function Checkout() {
  // 1000+ lines of code
}

// After: Extracted components
// app/pages/checkout.tsx (main orchestrator, ~150 lines)
export default function Checkout() {
  return <CheckoutFlow />;
}

// components/checkout/CheckoutFlow.tsx (~200 lines)
export function CheckoutFlow() {
  // Flow orchestration
}

// components/checkout/CheckoutReviewStep.tsx (~150 lines)
export function CheckoutReviewStep() {
  // Review step logic
}

// components/checkout/CheckoutShippingStep.tsx (~150 lines)
export function CheckoutShippingStep() {
  // Shipping step logic
}

// components/checkout/CheckoutPaymentStep.tsx (~150 lines)
export function CheckoutPaymentStep() {
  // Payment step logic
}
```

**2. Hook Extraction Pattern**

```typescript
// Before: Logic mixed with UI
export default function Checkout() {
  const [step, setStep] = useState("review");
  const [wallets, setWallets] = useState([]);
  // ... 200+ lines of logic
  return <View>...</View>;
}

// After: Logic extracted to hook
// hooks/useCheckout.ts (~200 lines)
export function useCheckout() {
  const [step, setStep] = useState("review");
  const [wallets, setWallets] = useState([]);
  // ... all logic
  return { step, wallets, /* ... */ };
}

// app/pages/checkout.tsx (~150 lines)
export default function Checkout() {
  const checkout = useCheckout();
  return <CheckoutFlow {...checkout} />;
}
```

**3. Service Layer Pattern**

```typescript
// Before: Business logic in component
export default function C2BPayment() {
  const handleProcessPayment = async () => {
    // 100+ lines of payment processing logic
  };
}

// After: Logic in service
// services/payment-service.ts (~200 lines)
export class PaymentService {
  async processC2BPayment(data: C2BPaymentData): Promise<PaymentResult> {
    // All payment logic
  }
}

// app/pages/payments/c2b-payment.tsx (~200 lines)
export default function C2BPayment() {
  const paymentService = usePaymentService();
  const handleProcessPayment = () => {
    paymentService.processC2BPayment(data);
  };
}
```

### Refactoring Checklist

**For Files Over 400 LOC:**

1. **Identify Sections:**
   - [ ] List all major sections/features in the file
   - [ ] Identify reusable components
   - [ ] Identify shared logic
   - [ ] Identify utility functions

2. **Extract Components:**
   - [ ] Create component directory: `components/[feature]/`
   - [ ] Extract UI sections into components
   - [ ] Extract form sections into form components
   - [ ] Extract modal/dialog components

3. **Extract Hooks:**
   - [ ] Create hook file: `hooks/use[Feature].ts`
   - [ ] Move state management to hook
   - [ ] Move business logic to hook
   - [ ] Move API calls to hook

4. **Extract Services:**
   - [ ] Create service file: `services/[feature]-service.ts` or `lib/[feature].ts`
   - [ ] Move complex business logic to service
   - [ ] Move data transformation to service
   - [ ] Move validation logic to service

5. **Extract Types:**
   - [ ] Create types file: `types/[feature].ts`
   - [ ] Move interfaces/types to types file
   - [ ] Ensure proper type exports

6. **Extract Constants:**
   - [ ] Create constants file: `constants/[feature].ts`
   - [ ] Move magic numbers/strings to constants
   - [ ] Move configuration to constants

### TypeScript Error Prevention

**Common TypeScript Errors & Prevention:**

**1. Type Errors:**

- **Issue:** Missing types, `any` types, type mismatches
- **Prevention:**
  - Enable `strict: true` in `tsconfig.json` (already enabled)
  - Use explicit return types
  - Avoid `any` - use `unknown` or proper types
  - Use type guards for runtime checks

**2. Import Errors:**

- **Issue:** Missing imports, circular dependencies
- **Prevention:**
  - Use path aliases (`@/`) consistently
  - Avoid circular dependencies
  - Use barrel exports (`index.ts`) carefully
  - Validate imports in CI

**3. React Hook Errors:**

- **Issue:** Missing dependencies, conditional hooks
- **Prevention:**
  - Use ESLint rules: `react-hooks/exhaustive-deps`
  - Never call hooks conditionally
  - Always include all dependencies
  - Use `useCallback`/`useMemo` appropriately

**4. Props Type Errors:**

- **Issue:** Missing prop types, incorrect prop types
- **Prevention:**
  - Define interfaces for all component props
  - Use `React.FC<Props>` or explicit prop types
  - Validate props with TypeScript
  - Use default props correctly

**TypeScript Configuration** (`tsconfig.json`):

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**ESLint Configuration** (`.eslintrc.js` - to be created):

```javascript
module.exports = {
  extends: [
    "expo",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "max-lines": [
      "warn",
      { max: 400, skipBlankLines: true, skipComments: true },
    ],
    "max-lines-per-function": ["warn", { max: 100, skipBlankLines: true }],
  },
};
```

### Automated Code Quality Tools

**1. Pre-commit Hooks** (`.husky/pre-commit`):

```bash
#!/bin/sh
# Run linting
npm run lint

# Run type checking
npm run type-check

# Check file sizes
npm run check-file-sizes
```

**2. File Size Checker** (`scripts/check-file-sizes.js`):

```javascript
// Check all files and warn if over 400 LOC
// Report files that need refactoring
```

**3. TypeScript Compiler** (`package.json` scripts):

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "check-file-sizes": "node scripts/check-file-sizes.js"
  }
}
```

### Refactoring Priority List

**Phase 1: Critical Files (>1000 LOC)** - Weeks 1-2

1. `app/pages/support.tsx` (1,553 lines)
   - Extract: FAQ sections, ticket forms, chat components
   - Target: Main file < 200 lines, 5-7 extracted components

2. `app/pages/tokens.tsx` (1,530 lines)
   - Extract: Token cards, purchase flow, history components
   - Target: Main file < 200 lines, 6-8 extracted components

3. `app/pages/payments/c2b-payment.tsx` (1,920 lines)
   - Extract: Step components, business selector, payment form
   - Target: Main file < 200 lines, 8-10 extracted components

4. `app/pages/products/create.tsx` (1,258 lines)
   - Extract: Form steps, product type selector, image upload
   - Target: Main file < 200 lines, 5-7 extracted components

**Phase 2: Large Files (800-1000 LOC)** - Weeks 3-4

5. `app/pages/checkout.tsx` (1,020 lines)
6. `app/pages/payments/buy-gift-card.tsx` (1,698 lines)
7. `app/pages/payments/buy-blkd.tsx` (1,017 lines)
8. `app/pages/profile.tsx` (1,004 lines)
9. `app/(tabs)/pay.tsx` (1,116 lines)

**Phase 3: Medium Files (600-800 LOC)** - Weeks 5-6

10. `app/pages/book-service.tsx` (818 lines)
11. `app/(tabs)/marketplace.tsx` (800 lines)
12. Other files over 400 LOC

### Refactoring Best Practices

**1. Incremental Refactoring:**

- Refactor one section at a time
- Test after each extraction
- Keep functionality identical
- Use feature flags if needed

**2. Component Naming:**

- Use descriptive names: `CheckoutReviewStep` not `Step1`
- Follow pattern: `[Feature][Section][Type]`
- Examples: `CheckoutReviewStep`, `PaymentMethodSelector`, `BusinessCard`

**3. File Organization:**

```
app/pages/checkout/
  ├── index.tsx (main orchestrator, ~150 lines)
  ├── CheckoutFlow.tsx (~200 lines)
  └── steps/
      ├── ReviewStep.tsx (~150 lines)
      ├── ShippingStep.tsx (~150 lines)
      └── PaymentStep.tsx (~150 lines)

components/checkout/
  ├── CheckoutSummary.tsx (~100 lines)
  ├── OrderItemsList.tsx (~100 lines)
  └── FeeBreakdown.tsx (~80 lines)

hooks/
  └── useCheckout.ts (~200 lines)

services/
  └── checkout-service.ts (~150 lines)
```

**4. Shared Component Library:**

- Create `components/shared/` for reusable components
- Create `components/forms/` for form components
- Create `components/layouts/` for layout components
- Create `components/features/` for feature-specific components

### Code Review Checklist

**Before Merging PR:**

- [ ] File size < 400 LOC (or justified exception)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] All functions have explicit return types
- [ ] No `any` types (use proper types)
- [ ] React hooks used correctly
- [ ] No console.log statements (use logger)
- [ ] Error handling implemented
- [ ] Tests added/updated (if applicable)
- [ ] Documentation updated (if needed)

### Refactoring Tools & Scripts

**1. LOC Checker Script** (`scripts/check-loc.js`):

```javascript
// Scans codebase and reports files over 400 LOC
// Generates refactoring report
// Can be run in CI/CD pipeline
```

**2. Component Extractor Helper** (`scripts/extract-component.js`):

```javascript
// Helps extract components from large files
// Generates boilerplate
// Updates imports automatically
```

**3. Type Checker** (CI Integration):

```yaml
# .github/workflows/ci.yml
- name: Type Check
  run: npm run type-check

- name: Lint
  run: npm run lint

- name: Check File Sizes
  run: npm run check-file-sizes
```

## Admin Panel & Operator Dashboard

### Overview

The Admin Panel (`@admin`) is accessible only to users with admin privileges via `operator.blackdollarnetwork.com`. It provides comprehensive management tools for monitoring, moderating, and managing the BDN platform. Admin access is role-based with granular permissions.

### Admin Access Control

**Admin Roles** (`server/prisma/schema.prisma`):

```prisma
enum AdminRole {
  SUPER_ADMIN    // Full access to all features
  ADMIN          // Full access except system settings
  MODERATOR      // Content moderation, user management
  SUPPORT        // Support tickets, disputes, user assistance
}

model AdminUser {
  id          String    @id @default(uuid())
  userId      String    @unique
  role        AdminRole
  permissions String[]  // Granular permissions
  isActive    Boolean   @default(true)
  lastLoginAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  user        User      @relation(fields: [userId], references: [id])

  @@index([role])
  @@index([isActive])
  @@map("admin_users")
}

model AdminPermission {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  category    String   // "users", "businesses", "transactions", "content", "system"
  createdAt   DateTime @default(now())

  @@map("admin_permissions")
}

model AdminAuditLog {
  id          String   @id @default(uuid())
  adminId     String
  action      String   // "create", "update", "delete", "approve", "reject"
  resource    String   // "user", "business", "transaction"
  resourceId  String?
  details     Json?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())

  admin       AdminUser @relation(fields: [adminId], references: [id])

  @@index([adminId, createdAt])
  @@index([resource, resourceId])
  @@map("admin_audit_logs")
}
```

**Access Control Implementation:**

- `components/AdminGuard.tsx` - Already exists, checks `isAdmin` flag
- `server/src/middleware/admin-auth.ts` - Backend admin verification
- `server/src/middleware/permission-check.ts` - Granular permission checking

### Admin Features & Functionality

**1. User Management** (`app/admin/users/`)

- **User List & Search:**
  - View all users with filters (status, role, registration date)
  - Search by email, name, phone
  - Export user data (CSV/Excel)

- **User Details:**
  - View complete user profile
  - View transaction history
  - View wallet balances
  - View activity log

- **User Actions:**
  - Suspend/unsuspend accounts
  - Reset passwords
  - Update user roles
  - Delete accounts (soft delete)
  - Send notifications
  - View support tickets

**2. Business Management** (`app/admin/businesses.tsx`)

- **Business Approval:**
  - Review pending business applications
  - Approve/reject businesses
  - Request additional information
  - Set verification status

- **Business Management:**
  - View all businesses
  - Edit business profiles
  - Suspend businesses
  - View business analytics
  - Manage business products
  - View business transactions
  - Manage business subscriptions (BDN+ Business)

**3. Nonprofit Management** (`app/admin/nonprofits.tsx`)

- **Nonprofit Approval:**
  - Review nonprofit applications
  - Verify 501(c)(3) status
  - Approve/reject nonprofits

- **Nonprofit Management:**
  - View all nonprofits
  - Edit nonprofit profiles
  - Manage campaigns
  - View donation analytics
  - Suspend nonprofits

**4. Transaction Management** (`app/admin/transactions.tsx`)

- **Transaction Monitoring:**
  - View all transactions
  - Filter by type, status, date range
  - Search by transaction ID, user, business

- **Transaction Actions:**
  - Process refunds
  - Cancel transactions
  - View transaction details
  - Export transaction reports
  - Flag suspicious transactions

- **Financial Reports:**
  - Revenue reports
  - Fee breakdowns
  - Platform fee analytics
  - Cashback distribution

**5. Dispute Management** (`app/admin/disputes.tsx`)

- **Dispute Resolution:**
  - View all disputes
  - Assign disputes to support staff
  - Review dispute evidence
  - Make resolution decisions
  - Process refunds/compensations
  - Close disputes

- **Support Tickets:**
  - View support tickets
  - Assign tickets
  - Respond to tickets
  - Escalate tickets
  - Track resolution time

**6. Content Management** (`app/admin/content.tsx`)

- **Blog Management:**
  - Create/edit blog posts
  - Approve user-submitted content
  - Manage categories and tags
  - Schedule posts

- **Media Management:**
  - Manage uploaded media
  - Review flagged content
  - Delete inappropriate content

- **Business Listings:**
  - Feature businesses
  - Edit business descriptions
  - Manage categories

**7. Gift Card & BLKD Management**

- **Gift Card Orders** (`app/admin/gift-cards.tsx`):
  - View all gift card orders
  - Monitor automated fulfillment
  - Handle failed orders
  - Process refunds

- **BLKD Purchases** (`app/admin/blkd-purchases.tsx`):
  - View all BLKD purchases
  - Monitor Hub Wallet transactions
  - Handle failed purchases
  - Process refunds

**8. Subscription Box Management** (`app/admin/subscription-boxes.tsx`)

- **Oversight:**
  - View all subscription boxes
  - Monitor shipments
  - Handle disputes
  - Process refunds
  - Manage subscription plans

**9. Token Holders** (`app/admin/token-holders.tsx`)

- **Token Management:**
  - View all token holders
  - View token balances
  - Manage token distributions
  - View token transaction history
  - Export holder reports

**10. Notifications** (`app/admin/notifications.tsx`)

- **Push Notifications:**
  - Send push notifications to users
  - Send to specific segments
  - Schedule notifications
  - View notification history
  - Track delivery rates

**11. Email Management** (`app/admin/emails.tsx`)

- **Email Campaigns:**
  - Send bulk emails
  - Create email templates
  - Schedule emails
  - View email analytics
  - Manage email lists

**12. Analytics & BI** (`app/admin/analytics.tsx`, `app/admin/bi/`)

- **Dashboard Analytics:**
  - User growth metrics
  - Transaction volume
  - Revenue metrics
  - Business performance
  - Platform health metrics

- **Business Intelligence:**
  - Custom reports
  - Data exports
  - Trend analysis
  - Predictive analytics

**13. System Settings** (`app/admin/settings.tsx`)

- **Platform Settings:**
  - Fee configuration
  - Feature flags
  - System parameters
  - Integration settings
  - Email/SMS configuration

- **Security Settings:**
  - API key management
  - Rate limiting
  - IP whitelisting
  - Audit log configuration

### Admin API Endpoints

**Admin Authentication** (`server/src/api/admin/auth.ts`):

- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/me` - Get current admin user
- `GET /api/admin/permissions` - Get admin permissions

**User Management** (`server/src/api/admin/users.ts`):

- `GET /api/admin/users` - List users (with filters, pagination)
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id` - Update user
- `POST /api/admin/users/:id/suspend` - Suspend user
- `POST /api/admin/users/:id/unsuspend` - Unsuspend user
- `DELETE /api/admin/users/:id` - Delete user (soft delete)
- `GET /api/admin/users/:id/transactions` - Get user transactions
- `GET /api/admin/users/:id/activity` - Get user activity log

**Business Management** (`server/src/api/admin/businesses.ts`):

- `GET /api/admin/businesses` - List businesses
- `GET /api/admin/businesses/pending` - Get pending approvals
- `GET /api/admin/businesses/:id` - Get business details
- `POST /api/admin/businesses/:id/approve` - Approve business
- `POST /api/admin/businesses/:id/reject` - Reject business
- `PUT /api/admin/businesses/:id` - Update business
- `POST /api/admin/businesses/:id/suspend` - Suspend business

**Transaction Management** (`server/src/api/admin/transactions.ts`):

- `GET /api/admin/transactions` - List transactions (with filters)
- `GET /api/admin/transactions/:id` - Get transaction details
- `POST /api/admin/transactions/:id/refund` - Process refund
- `POST /api/admin/transactions/:id/cancel` - Cancel transaction
- `GET /api/admin/transactions/reports` - Generate reports

**Dispute Management** (`server/src/api/admin/disputes.ts`):

- `GET /api/admin/disputes` - List disputes
- `GET /api/admin/disputes/:id` - Get dispute details
- `POST /api/admin/disputes/:id/assign` - Assign dispute
- `POST /api/admin/disputes/:id/resolve` - Resolve dispute
- `POST /api/admin/disputes/:id/close` - Close dispute

**Content Management** (`server/src/api/admin/content.ts`):

- `GET /api/admin/content/pending` - Get pending content
- `POST /api/admin/content/:id/approve` - Approve content
- `POST /api/admin/content/:id/reject` - Reject content
- `DELETE /api/admin/content/:id` - Delete content

**Analytics** (`server/src/api/admin/analytics.ts`):

- `GET /api/admin/analytics/dashboard` - Get dashboard stats
- `GET /api/admin/analytics/users` - Get user analytics
- `GET /api/admin/analytics/transactions` - Get transaction analytics
- `GET /api/admin/analytics/revenue` - Get revenue analytics

**System Settings** (`server/src/api/admin/settings.ts`):

- `GET /api/admin/settings` - Get system settings
- `PUT /api/admin/settings` - Update system settings
- `GET /api/admin/settings/feature-flags` - Get feature flags
- `PUT /api/admin/settings/feature-flags` - Update feature flags

### Admin Dashboard Statistics

**Real-time Metrics** (`server/src/services/admin-stats-service.ts`):

```typescript
interface AdminDashboardStats {
  // User Metrics
  totalUsers: number;
  activeUsers: number; // Last 30 days
  newUsersToday: number;
  newUsersThisWeek: number;

  // Business Metrics
  totalBusinesses: number;
  pendingBusinessApprovals: number;
  activeBusinesses: number;

  // Nonprofit Metrics
  totalNonprofits: number;
  pendingNonprofitApprovals: number;

  // Transaction Metrics
  totalTransactions: number;
  transactionsToday: number;
  totalRevenue: number;
  revenueToday: number;
  platformFees: number;

  // Support Metrics
  openDisputes: number;
  openSupportTickets: number;
  avgResolutionTime: number; // Hours

  // System Health
  systemStatus: "healthy" | "degraded" | "down";
  apiResponseTime: number; // ms
  errorRate: number; // percentage
}
```

### Admin Audit Logging

**All admin actions are logged** (`server/src/services/admin-audit-service.ts`):

- User management actions
- Business approval/rejection
- Transaction modifications
- Dispute resolutions
- Content moderation
- Settings changes
- System configuration changes

**Audit Log Fields:**

- Admin user ID
- Action type
- Resource type and ID
- Before/after state (for updates)
- IP address
- User agent
- Timestamp

### Admin Refactoring Strategy

**Files Over 400 LOC in Admin:**

- `app/admin/settings.tsx` - 1,186 lines → Extract settings sections
- `app/admin/disputes.tsx` - 836 lines → Extract dispute components
- `app/admin/subscription-boxes.tsx` - 1,128 lines → Extract subscription components
- `app/admin/emails.tsx` - 681 lines → Extract email components
- `app/admin/notifications.tsx` - 680 lines → Extract notification components
- `app/admin/token-holders.tsx` - 625 lines → Extract token holder components
- `app/admin/content.tsx` - 623 lines → Extract content components
- `app/admin/gift-cards.tsx` - 616 lines → Extract gift card components
- `app/admin/blkd-purchases.tsx` - 594 lines → Extract BLKD purchase components
- `app/admin/nonprofits.tsx` - 586 lines → Extract nonprofit components
- `app/admin/transactions.tsx` - 633 lines → Extract transaction components

**Refactoring Approach:**

1. Extract reusable admin components:
   - `components/admin/DataTable.tsx` - Reusable data table
   - `components/admin/FilterPanel.tsx` - Filter panel
   - `components/admin/ActionButtons.tsx` - Action buttons
   - `components/admin/StatusBadge.tsx` - Status badges
   - `components/admin/ApprovalCard.tsx` - Approval cards

2. Extract admin hooks:
   - `hooks/admin/useAdminUsers.ts` - User management logic
   - `hooks/admin/useAdminBusinesses.ts` - Business management logic
   - `hooks/admin/useAdminTransactions.ts` - Transaction management logic
   - `hooks/admin/useAdminDisputes.ts` - Dispute management logic

3. Extract admin services:
   - `services/admin-service.ts` - Core admin API calls
   - `services/admin-stats-service.ts` - Statistics service
   - `services/admin-audit-service.ts` - Audit logging service

### Admin Integration with Main App

**How Admin Relates to Main App:**

1. **User Management:**
   - Admin can view and modify any user account
   - Changes sync to main app immediately
   - Admin actions trigger notifications in main app

2. **Business Management:**
   - Business approvals in admin → Business appears in main app
   - Business suspensions → Business hidden from main app
   - Business edits → Updates reflected in main app

3. **Transaction Monitoring:**
   - Admin can view all transactions from main app
   - Admin can process refunds → Updates user wallet in main app
   - Admin can flag transactions → Triggers review in main app

4. **Content Moderation:**
   - Admin approves/rejects content → Content appears/hidden in main app
   - Admin edits content → Updates reflected in main app

5. **Support Integration:**
   - Disputes from main app → Appear in admin panel
   - Admin resolutions → Notifications sent to users in main app
   - Support tickets → Managed in admin, visible to users in main app

6. **Analytics:**
   - Admin analytics pull data from main app database
   - Real-time metrics from main app activity
   - Reports generated from main app transactions

### Admin Security

**Security Measures:**

1. **Authentication:**
   - Separate admin login flow
   - Two-factor authentication required
   - Session timeout (15 minutes inactivity)
   - IP whitelisting (optional)

2. **Authorization:**
   - Role-based access control (RBAC)
   - Granular permissions per feature
   - Permission checks on every API call
   - Frontend route protection

3. **Audit Trail:**
   - All admin actions logged
   - Immutable audit logs
   - Regular audit log reviews
   - Compliance reporting

4. **Data Protection:**
   - Encrypted admin sessions
   - Secure API endpoints
   - Rate limiting on admin APIs
   - Input validation and sanitization

### Files to Create/Modify

**New Admin Files:**

- `server/src/api/admin/auth.ts` - Admin authentication
- `server/src/api/admin/users.ts` - User management API
- `server/src/api/admin/businesses.ts` - Business management API
- `server/src/api/admin/transactions.ts` - Transaction management API
- `server/src/api/admin/disputes.ts` - Dispute management API
- `server/src/api/admin/content.ts` - Content management API
- `server/src/api/admin/analytics.ts` - Analytics API
- `server/src/api/admin/settings.ts` - Settings API
- `server/src/middleware/admin-auth.ts` - Admin authentication middleware
- `server/src/middleware/permission-check.ts` - Permission checking middleware
- `server/src/services/admin-stats-service.ts` - Statistics service
- `server/src/services/admin-audit-service.ts` - Audit logging service
- `lib/subdomain-utils.ts` - Enhanced subdomain detection (supports operator, developer, designer)
- `components/admin/DataTable.tsx` - Reusable data table
- `components/admin/FilterPanel.tsx` - Filter panel component
- `hooks/admin/useAdminUsers.ts` - User management hook
- `hooks/admin/useAdminBusinesses.ts` - Business management hook

**New Designer Files:**

- `app/designer/*` - Designer dashboard pages
- `server/src/api/designer/` - Designer API endpoints (if needed)
- `components/DesignerGuard.tsx` - Designer access guard component

**Modified Files:**

- `app/_layout.tsx` - Add subdomain-based routing (supports operator, developer, designer)
- `lib/config.ts` - Add domain configuration
- `lib/subdomain-utils.ts` - Add designer subdomain support
- `components/AdminGuard.tsx` - Enhance with permission checking
- `server/src/middleware/subdomain-auth.ts` - Add designer access control
- `server/prisma/schema.prisma` - Add admin models (and designer role if needed)
- `app/admin/*` - Refactor all admin pages to <400 LOC

## Designer Dashboard

### Overview

The Designer Dashboard (`@designer`) is accessible only to users with designer privileges via `designer.blackdollarnetwork.com`. It provides design and content creation tools for managing visual assets, templates, and design resources for the BDN platform.

### Designer Access Control

**Designer Role** (`server/prisma/schema.prisma`):

Designer access is controlled via user role flag:

```prisma
model User {
  // ... existing fields ...
  isDesigner Boolean @default(false)
  // ... other fields ...
}
```

**Access Control Implementation:**

- `components/DesignerGuard.tsx` - Designer access guard component (to be created)
- `server/src/middleware/subdomain-auth.ts` - Backend designer verification (already includes designer check)
- Designer-specific permissions can be added similar to admin permissions

### Designer Features & Functionality

**1. Design Asset Management** (`app/designer/assets/`)

- Upload and manage design assets
- Organize assets by category
- Version control for design files
- Asset library for platform use

**2. Template Management** (`app/designer/templates/`)

- Create and manage design templates
- Template preview and testing
- Template versioning
- Template sharing and collaboration

**3. Content Design Tools** (`app/designer/content/`)

- Design tools for creating visual content
- Image editing and optimization
- Brand asset management
- Design system components

**4. Design System** (`app/designer/design-system/`)

- Component library management
- Style guide maintenance
- Design token management
- Design documentation

### Designer API Endpoints

**Designer Authentication** (`server/src/api/designer/auth.ts`):

- `POST /api/designer/login` - Designer login
- `POST /api/designer/logout` - Designer logout
- `GET /api/designer/me` - Get current designer user

**Design Assets** (`server/src/api/designer/assets.ts`):

- `GET /api/designer/assets` - List design assets
- `POST /api/designer/assets` - Upload design asset
- `GET /api/designer/assets/:id` - Get asset details
- `PUT /api/designer/assets/:id` - Update asset
- `DELETE /api/designer/assets/:id` - Delete asset

**Templates** (`server/src/api/designer/templates.ts`):

- `GET /api/designer/templates` - List templates
- `POST /api/designer/templates` - Create template
- `GET /api/designer/templates/:id` - Get template details
- `PUT /api/designer/templates/:id` - Update template
- `DELETE /api/designer/templates/:id` - Delete template

### Designer Security

**Security Measures:**

1. **Authentication:**
   - Separate designer login flow
   - Two-factor authentication (optional)
   - Session timeout (30 minutes inactivity)

2. **Authorization:**
   - Designer role-based access
   - Permission checks on API calls
   - Frontend route protection

3. **Asset Protection:**
   - Secure asset storage
   - Access control for sensitive assets
   - Asset usage tracking

## AI/Agentic Features

### AI Integration Opportunities

1. **Smart Payment Suggestions**
   - Location: `app/(tabs)/pay.tsx`
   - Suggest optimal payment method based on transaction amount
   - Recommend BLKD purchase when balance is low
   - Predict cashback opportunities

2. **Intelligent Product Recommendations**
   - Location: `app/(tabs)/marketplace.tsx`
   - Personalized product suggestions
   - Business recommendations based on location/preferences
   - Price comparison and deals

3. **Transaction Insights**
   - Location: `app/pages/transactions.tsx`
   - Spending pattern analysis
   - Budget recommendations
   - Cashback optimization tips

4. **Chat Support Assistant**
   - Location: `app/pages/support.tsx`
   - AI-powered support chat
   - FAQ automation
   - Ticket routing

5. **Smart Notifications**
   - Location: `lib/notifications.ts`
   - Intelligent notification timing
   - Priority-based grouping
   - Context-aware notifications

**Implementation:**

- Use Google Cloud AI/ML services (Vertex AI, Dialogflow)
- Integrate with existing Firebase ML
- Add AI service layer: `server/src/services/ai-service.ts`

## Security & Compliance

### Security Measures

1. **Authentication**
   - JWT tokens with refresh mechanism
   - Secure token storage (`expo-secure-store`)
   - Biometric authentication support
   - PIN-based authentication

2. **Payment Security**
   - PCI DSS compliance (no card data storage)
   - Tokenized payment methods only
   - Encrypted communication (HTTPS/TLS)
   - Webhook signature verification

3. **Data Protection**
   - Encrypted database connections
   - Secure environment variables (EAS Secrets)
   - Firestore security rules
   - Input validation and sanitization

4. **API Security**
   - Rate limiting
   - CORS configuration
   - Request validation
   - Error message sanitization

## Monitoring & Observability

### Monitoring Stack

1. **Error Tracking**
   - Sentry integration
   - Error boundary components
   - Crash reporting

2. **Analytics**
   - Firebase Analytics
   - Custom event tracking
   - User behavior analytics

3. **Performance Monitoring**
   - Google Cloud Monitoring
   - API response time tracking
   - Database query performance

4. **Logging**
   - Structured logging (`lib/logger.ts`)
   - Cloud Logging integration
   - Log aggregation and search

## Implementation Phases

### Phase 1: Foundation & Code Quality (Weeks 1-2)

**Week 1: Infrastructure Setup**

- Set up hybrid database (PostgreSQL + Firestore)
- Implement authentication system
- Create API client infrastructure
- Set up environment configuration
- Database schema design and migrations
- Create public content pages (businesses, events, blog)
- Implement basic content gating

**Week 2: Code Quality & Refactoring Setup**

- Set up ESLint with TypeScript rules
- Configure pre-commit hooks
- Create file size checker script
- Set up automated type checking in CI
- Begin refactoring critical files (>1000 LOC)
  - Start with `app/pages/support.tsx`
  - Start with `app/pages/tokens.tsx`

### Phase 2: Code Refactoring (Weeks 3-4)

**Week 3: Critical File Refactoring**

- Refactor `app/pages/support.tsx` (1,553 → <400 LOC)
- Refactor `app/pages/tokens.tsx` (1,530 → <400 LOC)
- Refactor `app/pages/payments/c2b-payment.tsx` (1,920 → <400 LOC)
- Extract shared components and hooks
- Update imports and test refactored code

**Week 4: Large File Refactoring**

- Refactor `app/pages/products/create.tsx` (1,258 → <400 LOC)
- Refactor `app/pages/checkout.tsx` (1,020 → <400 LOC)
- Refactor `app/pages/payments/buy-gift-card.tsx` (1,698 → <400 LOC)
- Refactor `app/pages/payments/buy-blkd.tsx` (1,017 → <400 LOC)
- Refactor `app/(tabs)/pay.tsx` (1,116 → <400 LOC)
- Create shared component library structure

### Phase 4: Refactor Purchase Flows (Weeks 9-12)

**Week 7: Product & Service Purchases**

- Refactor checkout.tsx to use TransactionEngine
- Refactor service booking to use TransactionEngine
- Update error handling in purchase flows
- Test unified flow

**Week 8: Payment Flows**

- Refactor C2B payment to use TransactionEngine
- Refactor invoice payment to use TransactionEngine
- Refactor event checkout to use TransactionEngine
- Standardize error messages

**Week 9: Currency & Token Purchases**

- Refactor BLKD purchase to use TransactionEngine
- Refactor token purchase to use TransactionEngine
- Refactor gift card purchase to use TransactionEngine
- Update tracking

**Week 10: Consolidation & Testing**

- Consolidate shared payment logic
- Remove duplicate code
- End-to-end testing of all flows
- Performance optimization

### Phase 5: Core Inventory Management (Weeks 13-15)

- Implement product CRUD operations
- Build variant management system
- Create inventory tracking (multi-location)
- Implement stock level management
- Build bulk upload service (CSV/Excel)
- Create product management UI pages

### Phase 6: Third-Party Integrations (Weeks 16-19)

**Week 9-10: Shopify Integration**

- Implement Shopify API client
- Product sync (push/pull)
- Inventory sync
- Webhook handling
- Order sync

**Week 11: WooCommerce Integration**

- Implement WooCommerce REST API client
- Handle HPOS compatibility
- Product and inventory sync
- Webhook handling
- Fallback mechanisms

**Week 12: Printful Integration**

- Implement Printful Catalog API
- Product template management
- POD product sync
- Stock sync for POD availability
- Order fulfillment tracking
- Handle API/manual mode limitations

### Phase 7: Sync & Bulk Operations (Weeks 20-21)

- Build sync service orchestration
- Implement conflict resolution strategies
- Create sync status dashboard
- Enhance bulk upload with validation
- Build bulk edit functionality
- Add sync error handling and retry logic

### Phase 7: Core Features (Weeks 20-21)

- Replace mock data with real APIs
- Implement user preferences system
- Build wallet management
- Create transaction history
- Connect all frontend pages to APIs

### Phase 9: CI/CD & Infrastructure (Weeks 24-25)

- Set up CI/CD pipeline
- Configure Google Cloud deployment
- Set up monitoring and logging
- Security hardening
- Database backup and recovery procedures

### Phase 10: AI Features (Weeks 26-27)

- Implement AI service layer
- Add demand forecasting
- Build anomaly detection
- Create product categorization
- Build conversational inventory assistant
- Add smart recommendations

### Phase 11: Testing & Launch (Weeks 28-30)

- End-to-end testing
- Integration testing (Shopify, WooCommerce, Printful)
- Performance optimization
- Security audit
- Production deployment
- Post-launch monitoring

## Inventory Management System

### Core Inventory Features

**Product Management:**

- Create, read, update, delete (CRUD) operations for products
- Product variants management (size, color, print options)
- Bulk upload/import via CSV/Excel
- Bulk edit operations
- Soft delete (archive) with restore capability
- Product templates for Print-on-Demand (POD)

**Stock Management:**

- Multi-location inventory tracking
- Stock level monitoring per variant
- Reserved stock (orders in process)
- Incoming stock tracking (purchase orders, POD fulfillment)
- Low stock alerts and thresholds
- Stock adjustments (manual corrections)
- Stock sync across platforms

**Integration Sync:**

- Bi-directional sync with Shopify, WooCommerce, Printful
- Conflict resolution strategies
- Sync status tracking and error handling
- Webhook handling for real-time updates
- Scheduled sync jobs

### Database Schema Extensions

**PostgreSQL Models** (`server/prisma/schema.prisma`):

```prisma
model Product {
  id              String   @id @default(uuid())
  businessId      String
  name            String
  description     String?
  sku             String?  @unique
  category        String?
  tags            String[]
  productType     ProductType // physical, digital, service, pod
  fulfillmentType FulfillmentType // in-house, printful, hybrid
  status          ProductStatus @default(ACTIVE) // active, archived, draft
  images          String[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?

  variants        ProductVariant[]
  inventoryItems  InventoryItem[]
  platformMappings PlatformProductMapping[]
  orders          OrderItem[]

  @@index([businessId, status])
  @@index([sku])
  @@map("products")
}

model ProductVariant {
  id              String   @id @default(uuid())
  productId       String
  name            String   // e.g., "Small - Black"
  sku             String?  @unique
  attributes      Json     // { size: "S", color: "Black" }
  price           Float
  blkdPrice       Float?   // BLKD pricing (if different)
  compareAtPrice  Float?
  cost            Float?   // Cost per unit
  weight          Float?
  barcode         String?
  status          VariantStatus @default(ACTIVE)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  product         Product  @relation(fields: [productId], references: [id])
  inventoryItems  InventoryItem[]
  platformMappings PlatformVariantMapping[]
  orderItems      OrderItem[]

  @@index([productId, status])
  @@index([sku])
  @@map("product_variants")
}

model InventoryItem {
  id              String   @id @default(uuid())
  variantId       String
  locationId      String   // warehouse, fulfillment center, POD center
  quantity        Int      @default(0)
  reserved        Int      @default(0) // Orders in process
  incoming        Int      @default(0) // Incoming stock
  lowStockThreshold Int    @default(10)
  reorderPoint    Int?
  lastCountedAt   DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  variant         ProductVariant @relation(fields: [variantId], references: [id])
  location        InventoryLocation @relation(fields: [locationId], references: [id])

  @@unique([variantId, locationId])
  @@index([locationId, quantity])
  @@map("inventory_items")
}

model InventoryLocation {
  id              String   @id @default(uuid())
  businessId      String
  name            String
  type            LocationType // warehouse, store, fulfillment_center, pod_center
  address         Json?
  isDefault       Boolean  @default(false)
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  inventoryItems  InventoryItem[]

  @@index([businessId, isActive])
  @@map("inventory_locations")
}

model PlatformProductMapping {
  id              String   @id @default(uuid())
  productId       String
  platform        Platform // shopify, woocommerce, printful
  platformProductId String
  platformStoreId String?  // Store/shop identifier
  syncDirection   SyncDirection // push, pull, bidirectional
  lastSyncedAt    DateTime?
  syncStatus      SyncStatus @default(PENDING)
  syncErrors      Json?     // Array of error messages
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  product         Product  @relation(fields: [productId], references: [id])

  @@unique([productId, platform, platformProductId])
  @@index([platform, syncStatus])
  @@map("platform_product_mappings")
}

model PlatformVariantMapping {
  id              String   @id @default(uuid())
  variantId       String
  platform        Platform
  platformVariantId String
  platformProductId String
  lastSyncedAt    DateTime?
  syncStatus      SyncStatus @default(PENDING)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  variant         ProductVariant @relation(fields: [variantId], references: [id])

  @@unique([variantId, platform, platformVariantId])
  @@map("platform_variant_mappings")
}

model BulkUploadJob {
  id              String   @id @default(uuid())
  businessId      String
  fileName        String
  fileUrl         String
  fileType        String   // csv, xlsx, json
  status          JobStatus @default(PENDING)
  totalRows       Int
  processedRows   Int      @default(0)
  successRows     Int      @default(0)
  errorRows       Int      @default(0)
  errors          Json?    // Array of row errors
  mapping         Json?    // Field mapping configuration
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  completedAt     DateTime?

  @@index([businessId, status])
  @@map("bulk_upload_jobs")
}

enum ProductType {
  PHYSICAL
  DIGITAL
  SERVICE
  POD // Print-on-Demand
}

enum FulfillmentType {
  IN_HOUSE
  PRINTFUL
  HYBRID
}

enum ProductStatus {
  DRAFT
  ACTIVE
  ARCHIVED
}

enum VariantStatus {
  ACTIVE
  INACTIVE
  DISCONTINUED
}

enum LocationType {
  WAREHOUSE
  STORE
  FULFILLMENT_CENTER
  POD_CENTER
}

enum Platform {
  SHOPIFY
  WOOCOMMERCE
  PRINTFUL
  SQUARE
  CUSTOM
}

enum SyncDirection {
  PUSH
  PULL
  BIDIRECTIONAL
}

enum SyncStatus {
  PENDING
  SYNCING
  SUCCESS
  FAILED
  CONFLICT
}

enum JobStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  CANCELLED
}
```

### Third-Party Integration Implementation

**Shopify Integration** (`server/src/integrations/shopify.ts`):

- Use Shopify Admin API (REST and GraphQL)
- Product CRUD operations
- Inventory level management across locations
- Order sync and fulfillment
- Webhook subscriptions for real-time updates
- Rate limit handling and retry logic

**WooCommerce Integration** (`server/src/integrations/woocommerce.ts`):

- Use WooCommerce REST API v3
- Handle HPOS (High Performance Order Storage) compatibility
- Fallback to legacy API if needed
- Product and variant sync
- Inventory sync with stock quantity tracking
- Webhook handling for product/stock changes
- Custom endpoint support for advanced filtering

**Printful Integration** (`server/src/integrations/printful.ts`):

- Use Printful Catalog API for blank products
- Use Ecommerce Platform Sync API for product sync
- Product template management (mockups, designs)
- Stock sync for POD availability
- Order fulfillment tracking
- Webhook handling for sync events and order status
- Handle API/manual mode limitations
- Rate limit and retry handling

**Sync Service** (`server/src/services/sync-service.ts`):

- Conflict resolution strategies (timestamp-based, versioning, manual review)
- Sync job queue management
- Error handling and retry logic
- Sync status tracking
- Webhook processing
- Scheduled sync jobs (hourly, daily, real-time)

### Bulk Upload Implementation

**Bulk Upload Service** (`server/src/services/bulk-upload-service.ts`):

- CSV/Excel parsing and validation
- Field mapping configuration
- Data transformation and normalization
- Batch processing with progress tracking
- Error reporting per row
- Preview mode before commit
- Rollback capability
- Support for products, variants, and inventory updates

**File Processing:**

- Upload to Google Cloud Storage
- Parse CSV/Excel files
- Validate required fields
- Check for duplicates (SKU, product name)
- Validate data types and formats
- Generate preview report
- Process in background jobs

### API Endpoints for Inventory

**Products** (`server/src/api/products/`):

- `GET /api/products` - List products (with filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete/archive product
- `POST /api/products/bulk-upload` - Bulk upload products
- `GET /api/products/bulk-upload/:jobId` - Get upload job status
- `POST /api/products/:id/restore` - Restore archived product

**Variants** (`server/src/api/variants/`):

- `GET /api/products/:productId/variants` - List variants
- `POST /api/products/:productId/variants` - Create variant
- `PUT /api/variants/:id` - Update variant
- `DELETE /api/variants/:id` - Delete variant

**Inventory** (`server/src/api/inventory/`):

- `GET /api/inventory` - List inventory items
- `GET /api/inventory/:id` - Get inventory item
- `PUT /api/inventory/:id` - Update stock levels
- `POST /api/inventory/adjust` - Manual stock adjustment
- `GET /api/inventory/low-stock` - Get low stock items
- `POST /api/inventory/sync` - Trigger inventory sync

**Integrations** (`server/src/api/integrations/`):

- `GET /api/integrations` - List connected integrations
- `POST /api/integrations` - Connect new integration
- `PUT /api/integrations/:id` - Update integration settings
- `DELETE /api/integrations/:id` - Disconnect integration
- `POST /api/integrations/:id/sync` - Trigger manual sync
- `GET /api/integrations/:id/status` - Get sync status
- `POST /api/integrations/:id/webhooks` - Configure webhooks

### Frontend Pages for Inventory Management

**Product Management Pages:**

- `app/pages/merchant/products.tsx` - Product list (already exists, needs enhancement)
- `app/pages/products/create.tsx` - Create product (already exists)
- `app/pages/products/edit/[id].tsx` - Edit product (needs creation)
- `app/pages/products/[id].tsx` - Product detail view
- `app/pages/products/bulk-upload.tsx` - Bulk upload interface
- `app/pages/products/bulk-edit.tsx` - Bulk edit interface

**Inventory Pages:**

- `app/pages/merchant/inventory.tsx` - Inventory dashboard
- `app/pages/merchant/inventory/locations.tsx` - Manage locations
- `app/pages/merchant/inventory/adjustments.tsx` - Stock adjustments
- `app/pages/merchant/inventory/low-stock.tsx` - Low stock alerts

**Integration Pages:**

- `app/pages/merchant/products/integrations.tsx` - Integration management (already exists, needs enhancement)
- `app/pages/merchant/products/integrations/shopify.tsx` - Shopify setup
- `app/pages/merchant/products/integrations/woocommerce.tsx` - WooCommerce setup
- `app/pages/merchant/products/integrations/printful.tsx` - Printful setup
- `app/pages/merchant/products/sync-status.tsx` - Sync status dashboard

### AI Features for Inventory

**Demand Forecasting** (`server/src/services/ai/demand-forecast.ts`):

- Analyze historical sales data
- Predict future demand per variant
- Suggest restock quantities
- Identify slow-moving inventory
- Seasonal trend analysis

**Anomaly Detection** (`server/src/services/ai/anomaly-detection.ts`):

- Detect unusual stock movements
- Identify sync failures and discrepancies
- Flag pricing anomalies
- Detect duplicate products
- Identify missing product data

**Smart Categorization** (`server/src/services/ai/product-categorization.ts`):

- Auto-tag products from images
- Suggest categories based on description
- Generate product descriptions
- Optimize SEO metadata

**Conversational Assistant** (`server/src/services/ai/inventory-assistant.ts`):

- Answer inventory questions ("Which products are low stock?")
- Guide through bulk upload process
- Help resolve sync errors
- Provide inventory insights

## Key Files to Create/Modify

### New Files

**Payment System:**

**Transaction Engine:**

- `server/src/services/transaction-engine.ts` - Unified transaction engine
- `server/src/services/transaction-tracker.ts` - Transaction tracking
- `server/src/services/transactions/product-purchase-handler.ts` - Product purchase handler
- `server/src/services/transactions/service-booking-handler.ts` - Service booking handler
- `server/src/services/transactions/blkd-purchase-handler.ts` - BLKD purchase handler
- `server/src/services/transactions/gift-card-handler.ts` - Gift card handler
- `server/src/services/transactions/c2b-payment-handler.ts` - C2B payment handler
- `server/src/services/transactions/donation-handler.ts` - Donation handler
- `server/src/services/transactions/invoice-handler.ts` - Invoice handler
- `server/src/services/transactions/event-ticket-handler.ts` - Event ticket handler

**Error Handling:**

- `server/src/services/error-handler.ts` - Error handler service
- `server/src/services/error-logger.ts` - Error logging service
- `server/src/types/errors.ts` - Error type definitions
- `lib/error-mapper.ts` - Error to user message mapper
- `lib/error-recovery.ts` - Error recovery utilities
- `components/ErrorDisplay.tsx` - Error display component

**Payment System:**

- `server/src/services/payment-engine.ts` - BLKD payment engine (part of transaction engine)
- `server/src/services/hub-wallet.ts` - Hub Wallet management
- `server/src/integrations/ecom-payments.ts` - Ecom Payments client
- `server/src/integrations/ipayouts.ts` - iPayOuts client

**Inventory Management:**

- `server/src/services/inventory-service.ts` - Core inventory logic
- `server/src/services/bulk-upload-service.ts` - Bulk upload processing
- `server/src/services/sync-service.ts` - Platform sync orchestration
- `server/src/integrations/shopify.ts` - Shopify API client
- `server/src/integrations/woocommerce.ts` - WooCommerce API client
- `server/src/integrations/printful.ts` - Printful API client
- `server/src/api/products/` - Product endpoints
- `server/src/api/variants/` - Variant endpoints
- `server/src/api/inventory/` - Inventory endpoints
- `server/src/api/integrations/` - Integration endpoints
- `app/pages/products/edit/[id].tsx` - Product edit page
- `app/pages/products/bulk-upload.tsx` - Bulk upload UI
- `app/pages/products/bulk-edit.tsx` - Bulk edit UI
- `app/pages/merchant/inventory.tsx` - Inventory dashboard
- `app/pages/merchant/inventory/locations.tsx` - Location management
- `app/pages/merchant/inventory/adjustments.tsx` - Stock adjustments
- `app/pages/merchant/products/integrations/shopify.tsx` - Shopify setup
- `app/pages/merchant/products/integrations/woocommerce.tsx` - WooCommerce setup
- `app/pages/merchant/products/integrations/printful.tsx` - Printful setup

**AI Services:**

- `server/src/services/ai/demand-forecast.ts` - Demand forecasting
- `server/src/services/ai/anomaly-detection.ts` - Anomaly detection
- `server/src/services/ai/product-categorization.ts` - Product categorization
- `server/src/services/ai/inventory-assistant.ts` - Conversational assistant
- `lib/services/ai-service.ts` - AI service integration

**Content Gating:**

- `components/ContentGate.tsx` - Content gating component
- `components/SignupPrompt.tsx` - Signup prompt component
- `app/web/businesses.tsx` - Public business directory
- `app/web/businesses/[slug].tsx` - Public business detail
- `app/web/events.tsx` - Public events directory
- `app/web/events/[slug].tsx` - Public event detail
- `server/src/api/public/businesses.ts` - Public business API
- `server/src/api/public/events.ts` - Public events API
- `server/src/api/public/blog.ts` - Public blog API
- `server/src/services/seo-service.ts` - SEO service
- `server/src/services/analytics-service.ts` - Analytics service
- `lib/hooks/useContentGate.ts` - Hook for content gating

**Admin Panel:**

- `server/src/api/admin/auth.ts` - Admin authentication API
- `server/src/api/admin/users.ts` - User management API
- `server/src/api/admin/businesses.ts` - Business management API
- `server/src/api/admin/transactions.ts` - Transaction management API
- `server/src/api/admin/disputes.ts` - Dispute management API
- `server/src/api/admin/content.ts` - Content management API
- `server/src/api/admin/analytics.ts` - Analytics API
- `server/src/api/admin/settings.ts` - Settings API
- `server/src/middleware/admin-auth.ts` - Admin authentication middleware
- `server/src/middleware/permission-check.ts` - Permission checking middleware
- `server/src/services/admin-stats-service.ts` - Admin statistics service
- `server/src/services/admin-audit-service.ts` - Admin audit logging service
- `components/admin/DataTable.tsx` - Reusable admin data table
- `components/admin/FilterPanel.tsx` - Admin filter panel
- `hooks/admin/useAdminUsers.ts` - User management hook
- `hooks/admin/useAdminBusinesses.ts` - Business management hook
- `lib/subdomain-utils.ts` - Enhanced subdomain detection (supports operator, developer, designer)

**Designer Dashboard:**

- `app/designer/*` - Designer dashboard pages
- `server/src/api/designer/` - Designer API endpoints (if needed)
- `components/DesignerGuard.tsx` - Designer access guard component

**Code Quality Tools:**

- `.eslintrc.js` - ESLint configuration with TypeScript rules
- `.husky/pre-commit` - Pre-commit hooks
- `scripts/check-loc.js` - File size checker
- `scripts/check-file-sizes.js` - LOC validation script
- `scripts/extract-component.js` - Component extraction helper

**Infrastructure:**

- `server/src/api/auth/` - Authentication endpoints
- `server/src/api/payments/` - Payment endpoints
- `server/src/api/wallets/` - Wallet endpoints
- `.github/workflows/ci.yml` - CI pipeline (with type-check, lint, LOC check)
- `.github/workflows/deploy-sandbox.yml` - Sandbox deployment
- `.github/workflows/deploy-production.yml` - Production deployment

### Modified Files

**Core:**

- `lib/api-client.ts` - Enhance with auth, retry, caching
- `lib/payment-processing.ts` - Integrate with new payment system
- `server/src/server.ts` - Add all API routes
- `server/prisma/schema.prisma` - Add payment and inventory models
- `lib/config.ts` - Add environment-specific configs

**Frontend Purchase Flows (Refactored - All <400 LOC):**

- `app/(tabs)/pay.tsx` - Refactor to <400 LOC, connect to TransactionEngine
- `app/pages/checkout.tsx` - Refactor to <400 LOC, use TransactionEngine
- `app/pages/payments/c2b-payment.tsx` - Refactor to <400 LOC, use TransactionEngine
- `app/pages/payments/buy-blkd.tsx` - Refactor to <400 LOC, use TransactionEngine
- `app/pages/payments/buy-gift-card.tsx` - Refactor to <400 LOC, use TransactionEngine
- `app/pages/payments/token-purchase.tsx` - Refactor to <400 LOC, use TransactionEngine
- `app/pages/payments/invoice.tsx` - Refactor to <400 LOC, use TransactionEngine
- `app/pages/events/checkout.tsx` - Refactor to <400 LOC, use TransactionEngine

**Extracted Components (from refactoring):**

- `components/checkout/CheckoutFlow.tsx` - Checkout flow orchestrator
- `components/checkout/CheckoutReviewStep.tsx` - Review step
- `components/checkout/CheckoutShippingStep.tsx` - Shipping step
- `components/checkout/CheckoutPaymentStep.tsx` - Payment step
- `components/payments/C2BPaymentFlow.tsx` - C2B payment flow
- `components/payments/BusinessSelector.tsx` - Business selection
- `components/payments/PaymentForm.tsx` - Payment form
- `components/tokens/TokenPurchaseFlow.tsx` - Token purchase flow
- `components/tokens/TokenBalance.tsx` - Token balance display
- `components/support/SupportChat.tsx` - Support chat component
- `components/support/FAQSection.tsx` - FAQ section
- `components/support/TicketForm.tsx` - Ticket form

**Error Handling Components:**

- `components/ErrorBoundary.tsx` - Enhance with new error system
- `components/ErrorDisplay.tsx` - Error display component
- `lib/api-client.ts` - Add error interceptor

**Inventory Management:**

- `app/pages/merchant/products.tsx` - Enhance with real data
- `app/pages/merchant/products/integrations.tsx` - Enhance integration UI
- `app/pages/products/create.tsx` - Add variant management, POD support

**Admin Panel (Refactored - All <400 LOC):**

- `app/admin/settings.tsx` - Refactor to <400 LOC, extract settings sections
- `app/admin/disputes.tsx` - Refactor to <400 LOC, extract dispute components
- `app/admin/subscription-boxes.tsx` - Refactor to <400 LOC, extract subscription components
- `app/admin/emails.tsx` - Refactor to <400 LOC, extract email components
- `app/admin/notifications.tsx` - Refactor to <400 LOC, extract notification components
- `app/admin/token-holders.tsx` - Refactor to <400 LOC, extract token holder components
- `app/admin/content.tsx` - Refactor to <400 LOC, extract content components
- `app/admin/gift-cards.tsx` - Refactor to <400 LOC, extract gift card components
- `app/admin/blkd-purchases.tsx` - Refactor to <400 LOC, extract BLKD purchase components
- `app/admin/nonprofits.tsx` - Refactor to <400 LOC, extract nonprofit components
- `app/admin/transactions.tsx` - Refactor to <400 LOC, extract transaction components
- `app/_layout.tsx` - Add subdomain-based routing for admin/operator, developer, and designer domains

## Success Metrics

**Transaction Engine:**

- Transaction processing success rate > 99.5%
- Transaction processing time < 2 seconds (p95)
- Error recovery rate > 90%
- Transaction tracking accuracy 100%

**Payment System:**

- Payment processing success rate > 99%
- API response time < 200ms (p95)
- Zero payment data breaches
- 100% test coverage for payment flows

**Error Handling:**

- Error detection rate 100%
- User-friendly error message accuracy > 95%
- Error recovery success rate > 90%
- Critical error alert time < 1 minute

**Content Gating & Inbound Marketing:**

- Public content page load time < 2 seconds
- Signup conversion rate from public content > 5%
- SEO score > 90 (Lighthouse)
- Public content indexed by search engines
- Signup prompt click-through rate > 15%

**Inventory Management:**

- Product sync success rate > 95%
- Bulk upload processing < 5 minutes for 1000 products
- Inventory sync latency < 30 seconds
- Low stock alert accuracy > 98%

**Integrations:**

- Shopify sync success rate > 98%
- WooCommerce sync success rate > 95% (accounting for HPOS issues)
- Printful sync success rate > 97%
- Webhook processing < 5 seconds

**Infrastructure:**

- CI/CD pipeline runs in < 10 minutes
- Real-time data sync < 1 second latency
- API uptime > 99.9%
- Database query performance < 100ms (p95)

**AI Features:**

- Demand forecast accuracy > 85%
- Anomaly detection precision > 90%
- Product categorization accuracy > 90%

**Code Quality:**

- 100% of files < 400 LOC (except justified exceptions)
- Zero TypeScript compilation errors
- Zero ESLint errors
- 100% explicit return types on functions
- Zero `any` types (use proper types)
- All React hooks used correctly
- Pre-commit hooks passing

**Admin Panel:**

- Admin authentication success rate > 99%
- Admin API response time < 300ms (p95)
- Admin audit log coverage 100%
- Admin permission checks on all endpoints
- Admin dashboard load time < 2 seconds
- Zero unauthorized admin access incidents
