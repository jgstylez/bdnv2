# API Integration Tracking

**Date:** 2025-01-25 (Last Updated)  
**Original Date:** 2024-12-19  
**Purpose:** Track all API integration TODOs and mock data that needs to be replaced with real API calls

**Note:** Many features now have complete API integration patterns in place (using `api` client, `useLoading` hook, error handling). They use mock responses in development mode but are ready for backend integration. See individual implementation documents for details.

---

## Overview

This document tracks all areas where mock data is used or API integration is incomplete. Items are categorized by priority and feature area.

---

## 🔴 High Priority - Core User Features

### Payment Processing
- **File:** `app/pages/checkout.tsx`
- **Line:** ~320-370
- **Status:** ⚠️ **Flow Complete, API Integration Pending**
- **Description:** Payment processing for checkout flow
- **Required API:** `POST /api/orders/checkout`
- **Payload:** Order items, payment method, shipping address, service fees
- **Response:** Order ID, transaction ID, confirmation
- **Current Implementation:** 
  - ✅ Navigates to order confirmation page after payment
  - ✅ Generates order ID and transaction ID
  - ✅ Clears cart after successful payment
  - ⏳ TODO: Replace mock payment processing with real API call
- **Documentation:** [shopping-checkout-flow-implementation.md](./shopping-checkout-flow-implementation.md)

### BLKD Purchase Processing
- **File:** `app/pages/payments/buy-blkd.tsx`
- **Status:** ❌ Mock
- **Description:** Process BLKD bulk purchases
- **Required API:** `POST /api/blkd/purchase`
- **Payload:** BLKD amount, payment method, discount tier
- **Response:** Purchase ID, transaction ID, updated BLKD balance

### Gift Card Order Processing
- **File:** `app/pages/payments/buy-gift-card.tsx`
- **Status:** ❌ Mock
- **Description:** Process gift card orders
- **Required API:** `POST /api/gift-cards/order`
- **Payload:** Gift card type, amount, recipient, note, send schedule
- **Response:** Order ID, gift card ID, transaction ID

### C2B Payment Processing
- **File:** `app/pages/payments/c2b-payment.tsx`
- **Line:** ~115
- **Status:** ❌ Mock
- **Description:** Consumer-to-business payment processing
- **Required API:** `POST /api/payments/c2b`
- **Payload:** Business ID, amount, payment method, note
- **Response:** Transaction ID, confirmation

### Token Purchase Processing
- **File:** `app/pages/payments/token-purchase.tsx`
- **Status:** ❌ Mock
- **Description:** Token purchase processing
- **Required API:** `POST /api/tokens/purchase`
- **Payload:** Token amount, payment method
- **Response:** Transaction ID, updated token balance

---

## 🟡 Medium Priority - Product & Business Management

### Product Creation
- **File:** `app/pages/products/create.tsx`
- **Line:** ~245
- **Status:** ✅ **API Integration Pattern Complete** (uses mock in dev)
- **Description:** Create new product
- **Required API:** `POST /api/products` or `POST /api/nonprofits/products`
- **Payload:** Product data (name, description, price, images, etc.)
- **Response:** Product ID, confirmation
- **Implementation:** Full API integration with error handling and loading states
- **Note:** Product edit page created at `app/pages/products/edit/[id].tsx`
- **Documentation:** [business-merchant-flows-implementation.md](./business-merchant-flows-implementation.md)

### Product Deletion
- **File:** `components/products/ProductList.tsx`
- **Line:** ~242
- **Status:** ✅ **API Integration Pattern Complete** (uses mock in dev)
- **Description:** Delete product
- **Required API:** `DELETE /api/products/:id` or `DELETE /api/nonprofits/products/:id`
- **Implementation:** Full API integration with confirmation modal and loading states
- **Documentation:** [business-merchant-flows-implementation.md](./business-merchant-flows-implementation.md)

### Bulk Product Upload
- **File:** `app/pages/products/bulk-upload.tsx`
- **Line:** ~79
- **Status:** ✅ **API Integration Pattern Complete** (uses mock in dev)
- **Description:** Bulk upload products via CSV/Excel
- **Required API:** `POST /api/products/bulk-upload` or `POST /api/nonprofits/products/bulk-upload`
- **Payload:** FormData with file and entityType
- **Response:** BulkUploadResult with success/failure counts and error details
- **Implementation:** Full API integration with error handling and detailed error reporting
- **Documentation:** [business-merchant-flows-implementation.md](./business-merchant-flows-implementation.md)

### Invoice Creation & Sending
- **File:** `app/pages/invoices/create.tsx`
- **Lines:** ~205-341
- **Status:** ✅ **API Integration Pattern Complete** (uses mock in dev)
- **Description:** Create, save draft, and send invoices
- **Required API:** 
  - `POST /api/invoices` - Create invoice (draft)
  - `PUT /api/invoices/:id` - Update invoice (draft)
  - `POST /api/invoices/send` - Send new invoice
  - `PUT /api/invoices/:id/send` - Resend existing invoice
- **Payload:** Invoice data, recipient, billing type, line items
- **Response:** Invoice ID, confirmation
- **Implementation:** Full API integration with validation, loading states, and error handling
- **Documentation:** [invoice-flows-implementation.md](./invoice-flows-implementation.md)

### Invoice Payment Tracking
- **File:** `app/pages/payments/invoice.tsx`
- **Line:** ~311-342
- **Status:** ✅ **API Integration Pattern Complete** (uses mock in dev)
- **Description:** Process invoice payment and track payment status
- **Required API:**
  - `POST /api/invoices/:id/pay` - Process payment
  - `PUT /api/invoices/:id` - Update invoice status (paid, amountPaid, amountDue, paidAt)
- **Payload:** Payment method, amount, transaction details
- **Response:** Transaction ID, updated invoice status
- **Implementation:** Full API integration with fee calculation and payment tracking
- **Documentation:** [invoice-flows-implementation.md](./invoice-flows-implementation.md)

### Business Onboarding
- **File:** `app/pages/merchant/onboarding.tsx`
- **Line:** ~168
- **Status:** ✅ **API Integration Pattern Complete** (uses mock in dev)
- **Description:** Submit business onboarding application
- **Required API:** `POST /businesses/onboarding`
- **Payload:** Business information, verification documents, incorporation details
- **Response:** Application ID, status
- **Implementation:** Full API integration with `useLoading`, error handling, and loading states
- **Documentation:** [business-merchant-flows-implementation.md](./business-merchant-flows-implementation.md)

---

## 🟢 Low Priority - Admin & Management

### Admin User Management
- **File:** `app/admin/users.tsx`
- **Lines:** ~145, ~157, ~182, ~189
- **Status:** ❌ Mock
- **Required APIs:**
  - `GET /api/admin/users` - List users
  - `GET /api/admin/users/{id}` - Get user details
  - `PUT /api/admin/users/{id}` - Update user
  - `DELETE /api/admin/users/{id}` - Delete user
  - `POST /api/admin/users/{id}/suspend` - Suspend user
  - `POST /api/admin/users/{id}/activate` - Activate user

### Admin Business Management
- **File:** `app/admin/businesses.tsx`
- **Lines:** ~224, ~236, ~281
- **Status:** ❌ Mock
- **Required APIs:**
  - `GET /api/admin/businesses` - List businesses
  - `GET /api/admin/businesses/{id}` - Get business details
  - `PUT /api/admin/businesses/{id}` - Update business
  - `POST /api/admin/businesses/{id}/approve` - Approve business
  - `POST /api/admin/businesses/{id}/reject` - Reject business

### Admin Nonprofit Management
- **File:** `app/admin/nonprofits.tsx`
- **Lines:** ~215, ~232, ~268
- **Status:** ❌ Mock
- **Required APIs:**
  - `GET /api/admin/nonprofits` - List nonprofits
  - `GET /api/admin/nonprofits/{id}` - Get nonprofit details
  - `PUT /api/admin/nonprofits/{id}` - Update nonprofit
  - `POST /api/admin/nonprofits/{id}/approve` - Approve nonprofit
  - `POST /api/admin/nonprofits/{id}/reject` - Reject nonprofit

### Admin Content Management
- **File:** `app/admin/content.tsx`
- **Lines:** ~188, ~216, ~218, ~259, ~277
- **Status:** ❌ Mock
- **Required APIs:**
  - `GET /api/admin/content` - List content
  - `POST /api/admin/content` - Create content
  - `PUT /api/admin/content/{id}` - Update content
  - `DELETE /api/admin/content/{id}` - Delete content
  - `POST /api/admin/content/{id}/publish` - Publish content

### Admin Transaction Management
- **File:** `app/admin/transactions.tsx`
- **Status:** ❌ Mock
- **Required APIs:**
  - `GET /api/admin/transactions` - List transactions
  - `GET /api/admin/transactions/{id}` - Get transaction details
  - `POST /api/admin/transactions/{id}/refund` - Process refund

### Admin Gift Card Orders
- **File:** `app/admin/gift-cards.tsx`
- **Status:** ❌ Mock
- **Required APIs:**
  - `GET /api/admin/gift-cards/orders` - List gift card orders
  - `GET /api/admin/gift-cards/orders/{id}` - Get order details
  - `POST /api/admin/gift-cards/orders/{id}/resend` - Resend gift card
  - `POST /api/admin/gift-cards/orders/{id}/flag` - Flag for review

### Admin BLKD Purchases
- **File:** `app/admin/blkd-purchases.tsx`
- **Status:** ❌ Mock
- **Required APIs:**
  - `GET /api/admin/blkd/purchases` - List BLKD purchases
  - `GET /api/admin/blkd/purchases/{id}` - Get purchase details
  - `POST /api/admin/blkd/purchases/{id}/retry` - Retry processing
  - `POST /api/admin/blkd/purchases/{id}/manual-credit` - Manual credit
  - `POST /api/admin/blkd/purchases/{id}/flag` - Flag for review

### Admin Subscription Boxes
- **File:** `app/admin/subscription-boxes.tsx`
- **Status:** ❌ Mock
- **Required APIs:**
  - `GET /api/admin/subscription-boxes` - List subscriptions
  - `GET /api/admin/subscription-boxes/{id}` - Get subscription details
  - `GET /api/admin/subscription-boxes/plans` - List plans
  - `GET /api/admin/subscription-boxes/shipments` - List shipments
  - `POST /api/admin/subscription-boxes/{id}/flag` - Flag for review

---

## 🔵 Infrastructure & Services

### Elasticsearch Integration
- **File:** `lib/elasticsearch.ts`
- **Lines:** ~21, ~104, ~131, ~154
- **Status:** ❌ Mock
- **Description:** Search functionality using Elasticsearch
- **Required APIs:**
  - `POST /search` - Perform search
  - `POST /suggest` - Get search suggestions
  - `POST /track` - Track search activity
- **Note:** Direct Elasticsearch API calls, not REST API

### Notifications Service
- **File:** `lib/notifications.ts`
- **Status:** ❌ Mock
- **Required APIs:**
  - `POST /api/notifications/tokens` - Register push token
  - `GET /api/notifications` - Fetch notifications
  - `POST /api/notifications/{id}/read` - Mark as read
  - `POST /api/notifications/read-all` - Mark all as read
  - `GET /api/notifications/badge-counts` - Get badge counts
  - `PUT /api/notifications/preferences` - Update preferences
  - `POST /api/notifications/email` - Send email notification

### Exchange Rates API
- **File:** `lib/currency.ts`
- **Line:** ~75
- **Status:** ❌ Mock
- **Description:** Fetch real-time exchange rates
- **Required API:** External API (e.g., ExchangeRate-API, Fixer.io)
- **Endpoint:** `https://api.exchangerate-api.com/v4/latest/{base}`
- **Note:** Third-party service integration

---

## 📊 Data Fetching

### Product Data
- **Files:** Multiple product detail pages
- **Status:** ❌ Mock
- **Required API:** `GET /api/products/{id}`
- **Description:** Fetch product details by ID

### Business Data
- **Files:** Business detail pages, marketplace
- **Status:** ❌ Mock
- **Required APIs:**
  - `GET /api/businesses` - List businesses
  - `GET /api/businesses/{id}` - Get business details
  - `GET /api/businesses/{id}/products` - Get business products
  - `GET /api/businesses/{id}/reviews` - Get business reviews

### User Data
- **Files:** Profile pages, user settings
- **Status:** ❌ Mock
- **Required APIs:**
  - `GET /api/users/me` - Get current user
  - `PUT /api/users/me` - Update user profile
  - `GET /api/users/{id}` - Get user by ID

### Wallet/Account Data
- **Files:** Pay page, wallet components
- **Status:** ❌ Mock
- **Required APIs:**
  - `GET /api/wallets` - List user wallets
  - `GET /api/wallets/{id}` - Get wallet details
  - `POST /api/wallets` - Create wallet
  - `PUT /api/wallets/{id}` - Update wallet

### Transaction History
- **Files:** Transaction pages, history components
- **Status:** ❌ Mock
- **Required APIs:**
  - `GET /api/transactions` - List transactions
  - `GET /api/transactions/{id}` - Get transaction details

---

## 🔄 Real-time Updates

### WebSocket Integration
- **Status:** ❌ Not Implemented
- **Description:** Real-time updates for:
  - Notifications
  - Transaction status
  - Order status
  - Chat/messaging
- **Required:** WebSocket connection to backend

---

## 📝 Implementation Notes

### API Client Setup
- Create centralized API client (`lib/api-client.ts`)
- Handle authentication tokens
- Implement request/response interceptors
- Add retry logic for failed requests
- Implement request caching where appropriate

### Error Handling
- Standardize error responses
- Implement error boundaries
- User-friendly error messages
- Retry mechanisms for transient failures

### Authentication
- Token management
- Refresh token handling
- Session management
- Logout handling

### Testing
- Mock API responses for development
- Integration tests for API calls
- Error scenario testing
- Performance testing

---

## 🎯 Priority Order

1. **Payment Processing** (Checkout, C2B, BLKD, Gift Cards, Tokens)
   - ⚠️ Checkout flow complete but needs real API integration
   - ✅ API patterns in place for other flows
2. **Product & Business Data** (Product creation, business onboarding)
   - ✅ **COMPLETE** - Business onboarding API integration pattern complete
   - ✅ **COMPLETE** - Product creation/edit/delete API integration patterns complete
   - ✅ **COMPLETE** - Bulk upload API integration pattern complete
   - **Documentation:** [business-merchant-flows-implementation.md](./business-merchant-flows-implementation.md)
3. **Order Management**
   - ✅ **COMPLETE** - Order fulfillment API integration pattern complete
   - ✅ **COMPLETE** - Order tracking UI complete (ready for API data)
   - **Documentation:** [business-merchant-flows-implementation.md](./business-merchant-flows-implementation.md), [shopping-checkout-flow-implementation.md](./shopping-checkout-flow-implementation.md)
4. **Invoice Management**
   - ✅ **COMPLETE** - Invoice creation, draft saving, sending API integration patterns complete
   - ✅ **COMPLETE** - Invoice payment tracking API integration pattern complete
   - **Documentation:** [invoice-flows-implementation.md](./invoice-flows-implementation.md)
5. **User Management** (Profile, settings, authentication)
   - ✅ **COMPLETE** - Profile editing, account deletion, password/email change API integration patterns complete
   - ✅ **COMPLETE** - Notification preferences API integration pattern complete
   - **Documentation:** [account-management-implementation.md](./account-management-implementation.md)
6. **Admin Functions** (User/business/nonprofit management)
7. **Search & Discovery** (Elasticsearch integration)
   - ✅ UI complete - Filtering, sorting, map view implemented
   - **Documentation:** [search-discovery-implementation.md](./search-discovery-implementation.md)
8. **Notifications** (Push notifications, email)
9. **Real-time Updates** (WebSocket integration)

---

## 📅 Estimated Timeline

- **Phase 1 (High Priority):** 2-3 weeks
- **Phase 2 (Medium Priority):** 2-3 weeks
- **Phase 3 (Low Priority):** 2-3 weeks
- **Phase 4 (Infrastructure):** 1-2 weeks

**Total:** ~8-11 weeks for complete API integration

---

## ✅ Completed

### Infrastructure
- ✅ Logger utility created (`lib/logger.ts`)
- ✅ Error handling standardized
- ✅ Mock data structure established
- ✅ API client infrastructure (`lib/api-client.ts`)
- ✅ Secure storage utilities (`lib/secure-storage.ts`)
- ✅ API hooks (`hooks/useApi.ts`)
- ✅ Pagination hooks (`hooks/usePagination.ts`)
- ✅ Loading state hook (`hooks/useLoading.ts`)

### Feature Implementations (January 2025)
- ✅ Business onboarding API integration pattern
- ✅ Product CRUD operations API integration patterns
- ✅ Bulk product upload API integration pattern
- ✅ Order fulfillment API integration pattern
- ✅ Business verification API integration pattern
- ✅ Invoice creation, draft saving, sending API integration patterns
- ✅ Invoice payment tracking API integration pattern
- ✅ Profile editing, account management API integration patterns
- ✅ Order tracking UI (ready for API data)
- ✅ Shopping & checkout flow improvements

**See:** [RECENT-UPDATES-2025-01-25.md](./RECENT-UPDATES-2025-01-25.md) for complete summary

---

## 🔄 In Progress

- ⏳ Payment processing real API integration (patterns complete, needs backend)
- ⏳ Backend API endpoints implementation
- ⏳ Real-time updates (WebSocket integration)

---

## 📚 Related Documents

- `action_plans/comprehensive-codebase-review.md` - Full codebase review
- `action_plans/admin-pages-specification.md` - Admin page specifications
- `lib/logger.ts` - Logging utility

