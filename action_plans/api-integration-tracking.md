# API Integration Tracking

**Date:** 2024-12-19  
**Purpose:** Track all API integration TODOs and mock data that needs to be replaced with real API calls

---

## Overview

This document tracks all areas where mock data is used or API integration is incomplete. Items are categorized by priority and feature area.

---

## 🔴 High Priority - Core User Features

### Payment Processing
- **File:** `app/pages/checkout.tsx`
- **Line:** ~199
- **Status:** ❌ Mock
- **Description:** Payment processing for checkout flow
- **Required API:** `POST /api/orders/checkout`
- **Payload:** Order items, payment method, shipping address, service fees
- **Response:** Order ID, transaction ID, confirmation

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
- **Line:** ~95
- **Status:** ❌ Mock
- **Description:** Create new product
- **Required API:** `POST /api/products`
- **Payload:** Product data (name, description, price, images, etc.)
- **Response:** Product ID, confirmation

### Invoice Creation & Sending
- **File:** `app/pages/invoices/create.tsx`
- **Lines:** ~109, ~114
- **Status:** ❌ Mock
- **Description:** Create and send invoices
- **Required API:** 
  - `POST /api/invoices` - Create invoice
  - `POST /api/invoices/{id}/send` - Send invoice
- **Payload:** Invoice data, recipient, billing type
- **Response:** Invoice ID, confirmation

### Business Onboarding
- **File:** `app/pages/merchant/onboarding.tsx`
- **Line:** ~144
- **Status:** ❌ Mock
- **Description:** Submit business onboarding application
- **Required API:** `POST /api/businesses/onboard`
- **Payload:** Business information, verification documents
- **Response:** Application ID, status

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
2. **Product & Business Data** (Product creation, business onboarding)
3. **User Management** (Profile, settings, authentication)
4. **Admin Functions** (User/business/nonprofit management)
5. **Search & Discovery** (Elasticsearch integration)
6. **Notifications** (Push notifications, email)
7. **Real-time Updates** (WebSocket integration)

---

## 📅 Estimated Timeline

- **Phase 1 (High Priority):** 2-3 weeks
- **Phase 2 (Medium Priority):** 2-3 weeks
- **Phase 3 (Low Priority):** 2-3 weeks
- **Phase 4 (Infrastructure):** 1-2 weeks

**Total:** ~8-11 weeks for complete API integration

---

## ✅ Completed

- ✅ Logger utility created (`lib/logger.ts`)
- ✅ Error handling standardized
- ✅ Mock data structure established

---

## 🔄 In Progress

- 🔄 API client setup
- 🔄 Authentication flow
- 🔄 Error boundary implementation

---

## 📚 Related Documents

- `action_plans/comprehensive-codebase-review.md` - Full codebase review
- `action_plans/admin-pages-specification.md` - Admin page specifications
- `lib/logger.ts` - Logging utility

