# BDN 2.0 Database Indexes Plan

**Date:** 2025-01-XX  
**Purpose:** Comprehensive Firestore index plan for optimizing database queries across user, business, and admin use cases

---

## Overview

This document outlines all required Firestore indexes organized by:
- **User-side indexes**: Consumer-facing queries
- **Business-side indexes**: Merchant/nonprofit operations
- **Admin-side indexes**: Admin panel and analytics
- **Cross-cutting indexes**: Used across multiple contexts

### Index Priority Levels

- **P0 (Critical)**: Required for core functionality, must be created immediately
- **P1 (High)**: Important for performance, create before production launch
- **P2 (Medium)**: Optimize common queries, create as needed
- **P3 (Low)**: Nice-to-have optimizations, create based on usage patterns

---

## User-Side Indexes

### 1. `users` Collection

**Purpose:** User profile and account queries

#### P0 - Critical Indexes

```javascript
// Get user by email (authentication)
users: [email] (unique)

// Get user by referral code
users: [referralCode] (unique)

// User tier and points queries (leaderboards, rankings)
users: [tier, points] (descending)
users: [tier, createdAt] (descending)

// Active users by tier
users: [status, tier, createdAt] (descending)
```

#### P1 - High Priority Indexes

```javascript
// User type filtering (consumers, businesses, nonprofits)
users: [userType, status, createdAt] (descending)

// User search by name/email (admin + user search)
users: [status, createdAt] (descending)

// Demographics case study queries
users: [demographics.ethnicity, demographics.completed, createdAt] (descending)
users: [demographics.ageRange, demographics.completed, createdAt] (descending)
users: [demographics.location.city, demographics.location.state, demographics.completed] (descending)
```

#### P2 - Medium Priority Indexes

```javascript
// Activity streak tracking
users: [activityStreak, lastActiveAt] (descending)

// Referral leaderboard
users: [referralCount, createdAt] (descending)

// User preferences filtering
users: [preferences.language, status] (descending)
```

---

### 2. `orders` Collection

**Purpose:** Customer order history and tracking

#### P0 - Critical Indexes

```javascript
// Get user's orders (most common query)
orders: [customerId, createdAt] (descending)

// Get orders by business/nonprofit
orders: [entityId, entityType, createdAt] (descending)

// Order status filtering
orders: [customerId, status, createdAt] (descending)
orders: [entityId, status, createdAt] (descending)

// Order number lookup (unique)
orders: [orderNumber] (unique)
```

#### P1 - High Priority Indexes

```javascript
// Order type filtering (product, donation, ticket, subscription)
orders: [customerId, orderType, createdAt] (descending)
orders: [entityId, orderType, createdAt] (descending)

// Payment status queries
orders: [customerId, paymentStatus, createdAt] (descending)
orders: [entityId, paymentStatus, createdAt] (descending)

// Fulfillment status queries
orders: [entityId, fulfillmentStatus, createdAt] (descending)

// Date range queries
orders: [customerId, createdAt] (ascending) // For date range queries
orders: [entityId, createdAt] (ascending) // For date range queries

// Subscription box orders
orders: [subscriptionBoxId, createdAt] (descending)

// Event ticket orders
orders: [eventId, createdAt] (descending)

// Campaign donation orders
orders: [campaignId, createdAt] (descending)
```

#### P2 - Medium Priority Indexes

```javascript
// Order status by date range
orders: [status, createdAt] (descending)

// Order type by status
orders: [orderType, status, createdAt] (descending)

// Completed orders for reviews
orders: [customerId, status, completedAt] (descending) // status = "completed"
```

---

### 3. `transactions` Collection

**Purpose:** Financial transaction history

#### P0 - Critical Indexes

```javascript
// Get user's transactions (most common query)
transactions: [userId, createdAt] (descending)

// Transaction type filtering
transactions: [userId, type, createdAt] (descending)

// Transaction status filtering
transactions: [userId, status, createdAt] (descending)

// Transaction number lookup (unique)
transactions: [transactionNumber] (unique)
```

#### P1 - High Priority Indexes

```javascript
// Type and status combined
transactions: [userId, type, status, createdAt] (descending)

// Related entity queries (business, event, nonprofit)
transactions: [relatedEntityId, relatedEntityType, createdAt] (descending)

// Transaction type by status
transactions: [type, status, createdAt] (descending)

// Date range queries
transactions: [userId, createdAt] (ascending) // For date range queries

// Currency filtering
transactions: [userId, currency, createdAt] (descending)
```

#### P2 - Medium Priority Indexes

```javascript
// Category filtering
transactions: [userId, category, createdAt] (descending)

// Failed transaction queries
transactions: [userId, status, createdAt] (descending) // status = "failed"

// Refund queries
transactions: [userId, type, createdAt] (descending) // type = "refund"
```

---

### 4. `wallets` Collection

**Purpose:** User payment methods and balances

#### P0 - Critical Indexes

```javascript
// Get user's wallets
wallets: [userId, createdAt] (descending)

// Wallet type filtering
wallets: [userId, type, createdAt] (descending)

// Active wallets
wallets: [userId, isActive, createdAt] (descending)
```

#### P1 - High Priority Indexes

```javascript
// Currency filtering
wallets: [userId, currency, createdAt] (descending)

// Default wallet queries
wallets: [userId, isDefault, createdAt] (descending)
```

---

### 5. `reviews` Collection

**Purpose:** Business reviews and ratings

#### P0 - Critical Indexes

```javascript
// Get business reviews
reviews: [businessId, createdAt] (descending)

// Reviews by rating
reviews: [businessId, rating, createdAt] (descending)

// User's reviews
reviews: [userId, createdAt] (descending)

// Verified purchase reviews
reviews: [businessId, verifiedPurchase, createdAt] (descending)
```

#### P1 - High Priority Indexes

```javascript
// Order-linked reviews (prevent duplicates)
reviews: [userId, orderId] (unique composite) // Prevent duplicate reviews per order

// Reviews by order
reviews: [orderId, createdAt] (descending)

// Rating distribution
reviews: [businessId, rating] (descending)

// Reported reviews
reviews: [businessId, reported, createdAt] (descending)
```

#### P2 - Medium Priority Indexes

```javascript
// Helpful reviews
reviews: [businessId, helpfulCount, createdAt] (descending)

// Reviews with business responses
reviews: [businessId, businessResponse, createdAt] (descending)
```

---

### 6. `notifications` Collection

**Purpose:** User notifications

#### P0 - Critical Indexes

```javascript
// Get user's unread notifications
notifications: [userId, read, createdAt] (descending)

// Get user's notifications by channel
notifications: [userId, channel, createdAt] (descending)
```

#### P1 - High Priority Indexes

```javascript
// Notifications by type
notifications: [userId, type, createdAt] (descending)

// Unread notifications by channel
notifications: [userId, channel, read, createdAt] (descending)

// Unread notifications by type
notifications: [userId, type, read, createdAt] (descending)

// Priority notifications
notifications: [userId, priority, createdAt] (descending)
```

#### P2 - Medium Priority Indexes

```javascript
// Expired notifications cleanup
notifications: [expiresAt, createdAt] (ascending)

// Notifications by related entity
notifications: [userId, data.businessId, createdAt] (descending)
notifications: [userId, data.eventId, createdAt] (descending)
notifications: [userId, data.transactionId, createdAt] (descending)
```

---

### 7. `events` Collection

**Purpose:** Community events

#### P0 - Critical Indexes

```javascript
// Get active/published events
events: [status, startDate] (ascending)

// Get events by organizer
events: [organizerId, status, createdAt] (descending)

// Get upcoming events
events: [status, startDate] (ascending) // status = "published", startDate >= now
```

#### P1 - High Priority Indexes

```javascript
// Events by category
events: [category, status, startDate] (ascending)

// Public events
events: [isPublic, status, startDate] (ascending)

// Events by location (geo queries)
events: [venue.latitude, venue.longitude] (geo index)

// Events by date range
events: [startDate, status] (ascending)
```

#### P2 - Medium Priority Indexes

```javascript
// Popular events (by views/shares)
events: [status, stats.views, startDate] (descending)

// Events by tags
events: [tags, status, startDate] (ascending)
```

---

### 8. `campaigns` Collection

**Purpose:** Nonprofit fundraising campaigns

#### P0 - Critical Indexes

```javascript
// Get active campaigns
campaigns: [status, createdAt] (descending)

// Get campaigns by organization
campaigns: [organizationId, status, createdAt] (descending)
```

#### P1 - High Priority Indexes

```javascript
// Active campaigns by target amount
campaigns: [status, targetAmount, createdAt] (descending)

// Campaigns by category
campaigns: [category, status, createdAt] (descending)
```

---

### 9. `subscriptions` Collection

**Purpose:** BDN+ subscription plans

#### P0 - Critical Indexes

```javascript
// Get user's subscription
subscriptions: [userId, createdAt] (descending)

// Active subscriptions
subscriptions: [userId, status, createdAt] (descending)

// Upcoming billing dates
subscriptions: [status, nextBillingDate] (ascending) // status = "active"
```

#### P1 - High Priority Indexes

```javascript
// Subscriptions by tier
subscriptions: [userId, tier, createdAt] (descending)

// Expired subscriptions
subscriptions: [status, nextBillingDate] (ascending) // status = "cancelled" or "expired"
```

---

### 10. `subscriptionBoxes` Collection

**Purpose:** Recurring product shipments

#### P0 - Critical Indexes

```javascript
// Get user's subscription boxes
subscriptionBoxes: [userId, createdAt] (descending)

// Active subscription boxes
subscriptionBoxes: [userId, status, createdAt] (descending)

// Upcoming shipments
subscriptionBoxes: [status, nextShipmentDate] (ascending) // status = "active"
```

#### P1 - High Priority Indexes

```javascript
// Subscription boxes by merchant
subscriptionBoxes: [merchantId, status, createdAt] (descending)

// Subscription boxes by frequency
subscriptionBoxes: [userId, frequency, createdAt] (descending)
```

---

### 11. `products` Collection

**Purpose:** Product catalog

#### P0 - Critical Indexes

```javascript
// Get business products
products: [merchantId, createdAt] (descending)

// Active products
products: [merchantId, isActive, createdAt] (descending)
```

#### P1 - High Priority Indexes

```javascript
// Products by category
products: [merchantId, category, createdAt] (descending)
products: [category, isActive, createdAt] (descending)

// Products by type (physical, digital, service)
products: [merchantId, productType, createdAt] (descending)
products: [productType, isActive, createdAt] (descending)

// Low stock products
products: [merchantId, inventory, createdAt] (ascending) // inventory <= lowStockThreshold
```

#### P2 - Medium Priority Indexes

```javascript
// Products by price range
products: [merchantId, price, createdAt] (ascending)
products: [merchantId, price, createdAt] (descending)

// Products by tags
products: [tags, isActive, createdAt] (descending)
```

---

### 12. `businesses` Collection

**Purpose:** Business directory

#### P0 - Critical Indexes

```javascript
// Business slug lookup (unique)
businesses: [slug] (unique)

// Get user's businesses
businesses: [userId, createdAt] (descending)

// Active businesses
businesses: [status, createdAt] (descending)

// Verified businesses
businesses: [isVerified, status, createdAt] (descending)
```

#### P1 - High Priority Indexes

```javascript
// Businesses by category
businesses: [category, status, createdAt] (descending)

// Businesses by type
businesses: [type, status, createdAt] (descending)

// Businesses by location (geo queries)
businesses: [address.latitude, address.longitude] (geo index)

// Businesses by level
businesses: [level, status, createdAt] (descending)

// Pending approval businesses
businesses: [status, createdAt] (ascending) // status = "pending"
```

#### P2 - Medium Priority Indexes

```javascript
// Popular businesses (by reviews/orders)
businesses: [stats.reviewCount, status] (descending)
businesses: [stats.averageRating, status] (descending)

// Businesses by city/state
businesses: [address.city, address.state, status] (descending)
```

---

### 13. `nonprofits` Collection

**Purpose:** Nonprofit organizations

#### P0 - Critical Indexes

```javascript
// Nonprofit slug lookup (unique)
nonprofits: [slug] (unique)

// Get user's nonprofits
nonprofits: [userId, createdAt] (descending)

// Active nonprofits
nonprofits: [status, createdAt] (descending)

// Verified nonprofits
nonprofits: [verified, status, createdAt] (descending)
```

#### P1 - High Priority Indexes

```javascript
// Nonprofits by category
nonprofits: [category, status, createdAt] (descending)

// Nonprofits by location
nonprofits: [address.latitude, address.longitude] (geo index)
```

---

### 14. `invoices` Collection

**Purpose:** Business/nonprofit invoices

#### P0 - Critical Indexes

```javascript
// Invoice number lookup (unique)
invoices: [invoiceNumber] (unique)

// Get invoices by issuer
invoices: [issuerId, createdAt] (descending)

// Get invoices by recipient
invoices: [recipientId, createdAt] (descending)
```

#### P1 - High Priority Indexes

```javascript
// Invoices by status
invoices: [issuerId, status, createdAt] (descending)
invoices: [recipientId, status, createdAt] (descending)

// Unpaid invoices
invoices: [recipientId, status, createdAt] (descending) // status = "pending" or "overdue"
```

---

### 15. `referrals` Collection

**Purpose:** Referral tracking

#### P0 - Critical Indexes

```javascript
// Get user's referrals
referrals: [referrerId, createdAt] (descending)

// Get referrals by status
referrals: [referrerId, status, createdAt] (descending)
```

#### P1 - High Priority Indexes

```javascript
// Referred user queries
referrals: [referredUserId, createdAt] (descending)

// Active referrals
referrals: [referrerId, status, createdAt] (descending) // status = "active"
```

---

### 16. `conversations` Collection

**Purpose:** Direct messages

#### P0 - Critical Indexes

```javascript
// Get user's conversations
conversations: [participantIds, lastMessage.createdAt] (descending)

// Conversations by type
conversations: [participantIds, type, lastMessage.createdAt] (descending)
```

#### P1 - High Priority Indexes

```javascript
// Unread conversations
conversations: [participantIds, lastMessage.read, lastMessage.createdAt] (descending)
```

---

### 17. `courses` Collection (BDN University)

**Purpose:** Educational courses

#### P0 - Critical Indexes

```javascript
// Course slug lookup (unique)
courses: [slug] (unique)

// Published courses by category
courses: [category, isPublished, createdAt] (descending)

// Courses by difficulty
courses: [difficulty, isPublished, createdAt] (descending)
```

#### P1 - High Priority Indexes

```javascript
// Popular courses
courses: [stats.enrollments, isPublished] (descending)

// Course completions
courses: [stats.completions, isPublished] (descending)
```

---

### 18. `videos` Collection (BDN University)

**Purpose:** Video tutorials

#### P0 - Critical Indexes

```javascript
// Video slug lookup (unique)
videos: [slug] (unique)

// Published videos by category
videos: [category, isPublished, createdAt] (descending)
```

#### P1 - High Priority Indexes

```javascript
// Popular videos
videos: [views, isPublished] (descending)
```

---

### 19. `guides` Collection (BDN University)

**Purpose:** Step-by-step guides

#### P0 - Critical Indexes

```javascript
// Guide slug lookup (unique)
guides: [slug] (unique)

// Published guides by category
guides: [category, isPublished, createdAt] (descending)
```

---

### 20. `blogPosts` Collection (BDN University)

**Purpose:** Blog articles

#### P0 - Critical Indexes

```javascript
// Blog post slug lookup (unique)
blogPosts: [slug] (unique)

// Published posts by category
blogPosts: [category, publishedAt] (descending)

// Recent posts
blogPosts: [publishedAt] (descending)
```

#### P1 - High Priority Indexes

```javascript
// Popular posts
blogPosts: [views, publishedAt] (descending)
```

---

### 21. `helpArticles` Collection (BDN University)

**Purpose:** Help center articles

#### P0 - Critical Indexes

```javascript
// Article slug lookup (unique)
helpArticles: [slug] (unique)

// Published articles by category
helpArticles: [category, isPublished, createdAt] (descending)
```

#### P1 - High Priority Indexes

```javascript
// Helpful articles
helpArticles: [helpful, isPublished] (descending)
```

---

### 22. `directory` Collection

**Purpose:** Business directory search

#### P0 - Critical Indexes

```javascript
// Business ID lookup (unique)
directory: [businessId] (unique)

// Active businesses by category
directory: [category, isActive, createdAt] (descending)

// Verified businesses
directory: [isVerified, isActive, createdAt] (descending)
```

#### P1 - High Priority Indexes

```javascript
// Location-based search (geo index)
directory: [location.coordinates.latitude, location.coordinates.longitude] (geo index)

// Relevance and popularity
directory: [relevanceScore, isActive] (descending)
directory: [popularityScore, isActive] (descending)

// Business type filtering
directory: [type, isActive, createdAt] (descending)
```

---

### 23. `searchHistory` Collection

**Purpose:** User search analytics

#### P0 - Critical Indexes

```javascript
// Get user's search history
searchHistory: [userId, createdAt] (descending)
```

#### P1 - High Priority Indexes

```javascript
// Popular searches
searchHistory: [query, createdAt] (descending)
```

---

## Business-Side Indexes

### 1. `orders` Collection (Business View)

**Purpose:** Merchant/nonprofit order management

#### P0 - Critical Indexes

```javascript
// Business orders by status (already covered in user-side)
orders: [entityId, entityType, status, createdAt] (descending)

// Orders by fulfillment status
orders: [entityId, fulfillmentStatus, createdAt] (descending)

// Orders by payment status
orders: [entityId, paymentStatus, createdAt] (descending)
```

#### P1 - High Priority Indexes

```javascript
// Orders by date range
orders: [entityId, createdAt] (ascending) // For date range queries

// Orders by order type
orders: [entityId, orderType, createdAt] (descending)

// Pending orders (high priority for businesses)
orders: [entityId, status, createdAt] (ascending) // status = "pending"

// Ready to ship orders
orders: [entityId, fulfillmentStatus, createdAt] (ascending) // fulfillmentStatus = "ready-to-ship"
```

---

### 2. `products` Collection (Business View)

**Purpose:** Product management

#### P0 - Critical Indexes

```javascript
// Business products (already covered in user-side)
products: [merchantId, isActive, createdAt] (descending)

// Low stock alerts
products: [merchantId, inventory, createdAt] (ascending) // inventory <= lowStockThreshold
```

#### P1 - High Priority Indexes

```javascript
// Products by category
products: [merchantId, category, isActive, createdAt] (descending)

// Out of stock products
products: [merchantId, inventory, createdAt] (ascending) // inventory = 0

// Products by type
products: [merchantId, productType, isActive, createdAt] (descending)
```

---

### 3. `reviews` Collection (Business View)

**Purpose:** Review management

#### P0 - Critical Indexes

```javascript
// Business reviews (already covered in user-side)
reviews: [businessId, createdAt] (descending)

// Reviews by rating
reviews: [businessId, rating, createdAt] (descending)

// Unreported reviews
reviews: [businessId, reported, createdAt] (descending) // reported = false
```

#### P1 - High Priority Indexes

```javascript
// Reviews needing response
reviews: [businessId, businessResponse, createdAt] (descending) // businessResponse = null

// Verified purchase reviews
reviews: [businessId, verifiedPurchase, createdAt] (descending)
```

---

## Admin-Side Indexes

### 1. `users` Collection (Admin View)

**Purpose:** User management

#### P0 - Critical Indexes

```javascript
// Users by status (already covered in user-side)
users: [status, createdAt] (descending)

// Users by type
users: [userType, status, createdAt] (descending)

// Suspended users
users: [status, suspendedAt] (descending) // status = "suspended"
```

#### P1 - High Priority Indexes

```javascript
// Users by tier
users: [tier, status, createdAt] (descending)

// New users (for admin dashboard)
users: [createdAt] (descending)

// Users by activity
users: [lastActiveAt, status] (descending)
```

---

### 2. `businesses` Collection (Admin View)

**Purpose:** Business management

#### P0 - Critical Indexes

```javascript
// Businesses by status (already covered in user-side)
businesses: [status, createdAt] (descending)

// Pending approvals
businesses: [status, createdAt] (ascending) // status = "pending"

// Suspended businesses
businesses: [status, suspendedAt] (descending) // status = "suspended"
```

#### P1 - High Priority Indexes

```javascript
// Businesses by type
businesses: [type, status, createdAt] (descending)

// Businesses by level
businesses: [level, status, createdAt] (descending)

// Unverified businesses
businesses: [isVerified, status, createdAt] (descending) // isVerified = false
```

---

### 3. `nonprofits` Collection (Admin View)

**Purpose:** Nonprofit management

#### P0 - Critical Indexes

```javascript
// Nonprofits by status (already covered in user-side)
nonprofits: [status, createdAt] (descending)

// Pending approvals
nonprofits: [status, createdAt] (ascending) // status = "pending"
```

---

### 4. `orders` Collection (Admin View)

**Purpose:** Order management and analytics

#### P0 - Critical Indexes

```javascript
// Orders by status (already covered)
orders: [status, createdAt] (descending)

// Failed orders
orders: [status, createdAt] (descending) // status = "failed"

// Cancelled orders
orders: [status, createdAt] (descending) // status = "cancelled"
```

#### P1 - High Priority Indexes

```javascript
// Orders by date range
orders: [createdAt] (descending)

// Orders by order type
orders: [orderType, status, createdAt] (descending)

// High-value orders
orders: [total, createdAt] (descending)
```

---

### 5. `transactions` Collection (Admin View)

**Purpose:** Transaction management and analytics

#### P0 - Critical Indexes

```javascript
// Transactions by status (already covered)
transactions: [status, createdAt] (descending)

// Failed transactions
transactions: [status, createdAt] (descending) // status = "failed"

// Transactions by type
transactions: [type, status, createdAt] (descending)
```

#### P1 - High Priority Indexes

```javascript
// Transactions by date range
transactions: [createdAt] (descending)

// High-value transactions
transactions: [amount, createdAt] (descending)

// Refunded transactions
transactions: [type, createdAt] (descending) // type = "refund"
```

---

### 6. `reviews` Collection (Admin View)

**Purpose:** Review moderation

#### P0 - Critical Indexes

```javascript
// Reported reviews
reviews: [reported, createdAt] (descending) // reported = true

// Reviews by rating
reviews: [rating, createdAt] (descending)
```

---

### 7. `disputes` Collection (Admin Subcollection)

**Purpose:** Dispute management

#### P0 - Critical Indexes

```javascript
// Disputes by status
admin/disputes: [status, createdAt] (descending)

// Open disputes
admin/disputes: [status, createdAt] (ascending) // status = "open"
```

#### P1 - High Priority Indexes

```javascript
// Disputes by type
admin/disputes: [type, status, createdAt] (descending)

// Disputes by user
admin/disputes: [userId, createdAt] (descending)
```

---

### 8. `auditLogs` Collection (Admin Subcollection)

**Purpose:** Admin action tracking

#### P0 - Critical Indexes

```javascript
// Audit logs by admin user
admin/auditLogs: [adminUserId, createdAt] (descending)

// Audit logs by action type
admin/auditLogs: [actionType, createdAt] (descending)
```

#### P1 - High Priority Indexes

```javascript
// Audit logs by target entity
admin/auditLogs: [targetType, createdAt] (descending)

// Recent audit logs
admin/auditLogs: [createdAt] (descending)
```

---

## Cross-Cutting Indexes

### Geo Indexes

**Purpose:** Location-based queries

```javascript
// Businesses by location
businesses: [address.latitude, address.longitude] (geo index)

// Nonprofits by location
nonprofits: [address.latitude, address.longitude] (geo index)

// Events by venue location
events: [venue.latitude, venue.longitude] (geo index)

// Directory entries by location
directory: [location.coordinates.latitude, location.coordinates.longitude] (geo index)
```

---

## Index Creation Priority

### Phase 1: Critical (P0) - Create Immediately

1. **Authentication & Core Queries**
   - `users`: `[email]` (unique)
   - `users`: `[referralCode]` (unique)
   - `orders`: `[customerId, createdAt]` (descending)
   - `transactions`: `[userId, createdAt]` (descending)
   - `notifications`: `[userId, read, createdAt]` (descending)

2. **Business Operations**
   - `orders`: `[entityId, entityType, createdAt]` (descending)
   - `products`: `[merchantId, isActive, createdAt]` (descending)
   - `reviews`: `[businessId, createdAt]` (descending)

3. **Unique Constraints**
   - `businesses`: `[slug]` (unique)
   - `nonprofits`: `[slug]` (unique)
   - `orders`: `[orderNumber]` (unique)
   - `transactions`: `[transactionNumber]` (unique)
   - `invoices`: `[invoiceNumber]` (unique)

### Phase 2: High Priority (P1) - Before Production Launch

1. **Status Filtering**
   - All status-based composite indexes
   - Type-based filtering indexes
   - Date range query indexes

2. **Admin Operations**
   - Admin panel query indexes
   - Moderation indexes
   - Analytics indexes

3. **Geo Indexes**
   - All location-based indexes

### Phase 3: Medium Priority (P2) - As Needed

1. **Performance Optimizations**
   - Popular content indexes
   - Search optimization indexes
   - Ranking indexes

### Phase 4: Low Priority (P3) - Based on Usage

1. **Nice-to-Have**
   - Advanced filtering indexes
   - Analytics-specific indexes
   - Reporting indexes

---

## Index Creation Commands

### Firestore Console Method

1. Go to Firebase Console → Firestore Database → Indexes
2. Click "Create Index"
3. Select collection
4. Add fields in order
5. Set sort order (ascending/descending)
6. Set collection scope (collection group or single collection)
7. Create index

### Firebase CLI Method

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (if not already done)
firebase init firestore

# Create indexes.json file with index definitions
# Then deploy
firebase deploy --only firestore:indexes
```

### Example `firestore.indexes.json`

```json
{
  "indexes": [
    {
      "collectionGroup": "orders",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "customerId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "orders",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "entityId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "entityType",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    }
    // ... more indexes
  ],
  "fieldOverrides": []
}
```

---

## Index Monitoring & Optimization

### Monitoring

1. **Firebase Console**
   - Check index usage in Firestore dashboard
   - Monitor query performance
   - Review index build status

2. **Query Performance**
   - Monitor slow queries
   - Check index hit rates
   - Review query costs

### Optimization Tips

1. **Limit Index Count**
   - Only create indexes for queries you actually use
   - Monitor unused indexes and remove them
   - Firestore has a limit of 200 composite indexes per database

2. **Index Size**
   - Keep indexed fields small
   - Avoid indexing large text fields
   - Use denormalization for frequently queried data

3. **Query Optimization**
   - Always use `.limit()` on queries
   - Use cursor-based pagination for large datasets
   - Combine filters efficiently

4. **Index Maintenance**
   - Review indexes quarterly
   - Remove unused indexes
   - Add indexes based on query patterns

---

## Testing Checklist

### Index Testing

- [ ] All P0 indexes created and tested
- [ ] All unique constraints working
- [ ] Composite queries using indexes
- [ ] Geo queries working correctly
- [ ] Date range queries optimized
- [ ] Status filtering queries optimized
- [ ] Admin queries using indexes
- [ ] Business queries using indexes
- [ ] User queries using indexes

### Performance Testing

- [ ] Query response times acceptable (< 1s)
- [ ] No full collection scans
- [ ] Pagination working correctly
- [ ] Large dataset queries optimized
- [ ] Real-time listeners performant

---

## References

- **Firestore Indexing Guide**: https://firebase.google.com/docs/firestore/query-data/indexing
- **Firestore Query Best Practices**: https://firebase.google.com/docs/firestore/best-practices
- **Database Design**: `action_plans/database-design.md`
- **Database Summary**: `action_plans/database-design-summary.md`

