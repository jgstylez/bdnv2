# Database Indexes - Quick Reference Checklist

**Date:** 2025-01-XX  
**Purpose:** Quick checklist for creating Firestore indexes  
**Full Plan:** See `action_plans/database-indexes-plan.md` for detailed documentation

---

## Phase 1: Critical Indexes (P0) - Create Immediately

### Authentication & Core Queries

- [ ] `users`: `[email]` (unique)
- [ ] `users`: `[referralCode]` (unique)
- [ ] `orders`: `[customerId, createdAt]` (descending)
- [ ] `transactions`: `[userId, createdAt]` (descending)
- [ ] `notifications`: `[userId, read, createdAt]` (descending)

### Business Operations

- [ ] `orders`: `[entityId, entityType, createdAt]` (descending)
- [ ] `orders`: `[entityId, status, createdAt]` (descending)
- [ ] `products`: `[merchantId, isActive, createdAt]` (descending)
- [ ] `reviews`: `[businessId, createdAt]` (descending)
- [ ] `reviews`: `[businessId, rating, createdAt]` (descending)

### Unique Constraints

- [ ] `businesses`: `[slug]` (unique)
- [ ] `nonprofits`: `[slug]` (unique)
- [ ] `orders`: `[orderNumber]` (unique)
- [ ] `transactions`: `[transactionNumber]` (unique)
- [ ] `invoices`: `[invoiceNumber]` (unique)

### User Profile Queries

- [ ] `users`: `[tier, points]` (descending)
- [ ] `users`: `[status, createdAt]` (descending)
- [ ] `users`: `[userType, status, createdAt]` (descending)

### Events & Campaigns

- [ ] `events`: `[status, startDate]` (ascending)
- [ ] `events`: `[organizerId, status, createdAt]` (descending)
- [ ] `campaigns`: `[status, createdAt]` (descending)
- [ ] `campaigns`: `[organizationId, status, createdAt]` (descending)

### Subscriptions

- [ ] `subscriptions`: `[userId, status, createdAt]` (descending)
- [ ] `subscriptionBoxes`: `[userId, status, createdAt]` (descending)

---

## Phase 2: High Priority Indexes (P1) - Before Production

### Order Filtering

- [ ] `orders`: `[customerId, status, createdAt]` (descending)
- [ ] `orders`: `[customerId, orderType, createdAt]` (descending)
- [ ] `orders`: `[customerId, paymentStatus, createdAt]` (descending)
- [ ] `orders`: `[entityId, fulfillmentStatus, createdAt]` (descending)
- [ ] `orders`: `[entityId, paymentStatus, createdAt]` (descending)
- [ ] `orders`: `[entityId, orderType, createdAt]` (descending)
- [ ] `orders`: `[subscriptionBoxId, createdAt]` (descending)
- [ ] `orders`: `[eventId, createdAt]` (descending)
- [ ] `orders`: `[campaignId, createdAt]` (descending)

### Transaction Filtering

- [ ] `transactions`: `[userId, type, createdAt]` (descending)
- [ ] `transactions`: `[userId, status, createdAt]` (descending)
- [ ] `transactions`: `[userId, type, status, createdAt]` (descending)
- [ ] `transactions`: `[relatedEntityId, relatedEntityType, createdAt]` (descending)
- [ ] `transactions`: `[type, status, createdAt]` (descending)

### Review Management

- [ ] `reviews`: `[userId, createdAt]` (descending)
- [ ] `reviews`: `[userId, orderId]` (unique composite)
- [ ] `reviews`: `[orderId, createdAt]` (descending)
- [ ] `reviews`: `[businessId, verifiedPurchase, createdAt]` (descending)
- [ ] `reviews`: `[businessId, reported, createdAt]` (descending)

### Notification Filtering

- [ ] `notifications`: `[userId, channel, createdAt]` (descending)
- [ ] `notifications`: `[userId, type, createdAt]` (descending)
- [ ] `notifications`: `[userId, channel, read, createdAt]` (descending)
- [ ] `notifications`: `[userId, type, read, createdAt]` (descending)

### Product Management

- [ ] `products`: `[merchantId, category, createdAt]` (descending)
- [ ] `products`: `[merchantId, productType, createdAt]` (descending)
- [ ] `products`: `[merchantId, inventory, createdAt]` (ascending)
- [ ] `products`: `[category, isActive, createdAt]` (descending)
- [ ] `products`: `[productType, isActive, createdAt]` (descending)

### Business Directory

- [ ] `businesses`: `[category, status, createdAt]` (descending)
- [ ] `businesses`: `[type, status, createdAt]` (descending)
- [ ] `businesses`: `[level, status, createdAt]` (descending)
- [ ] `businesses`: `[isVerified, status, createdAt]` (descending)
- [ ] `businesses`: `[status, createdAt]` (ascending) // For pending approvals

### Geo Indexes

- [ ] `businesses`: `[address.latitude, address.longitude]` (geo index)
- [ ] `nonprofits`: `[address.latitude, address.longitude]` (geo index)
- [ ] `events`: `[venue.latitude, venue.longitude]` (geo index)
- [ ] `directory`: `[location.coordinates.latitude, location.coordinates.longitude]` (geo index)

### Wallet & Payment Methods

- [ ] `wallets`: `[userId, type, createdAt]` (descending)
- [ ] `wallets`: `[userId, currency, createdAt]` (descending)
- [ ] `wallets`: `[userId, isActive, createdAt]` (descending)

### Events & Campaigns (Extended)

- [ ] `events`: `[category, status, startDate]` (ascending)
- [ ] `events`: `[isPublic, status, startDate]` (ascending)
- [ ] `campaigns`: `[category, status, createdAt]` (descending)

### BDN University

- [ ] `courses`: `[slug]` (unique)
- [ ] `courses`: `[category, isPublished, createdAt]` (descending)
- [ ] `courses`: `[difficulty, isPublished, createdAt]` (descending)
- [ ] `videos`: `[slug]` (unique)
- [ ] `videos`: `[category, isPublished, createdAt]` (descending)
- [ ] `guides`: `[slug]` (unique)
- [ ] `guides`: `[category, isPublished, createdAt]` (descending)
- [ ] `blogPosts`: `[slug]` (unique)
- [ ] `blogPosts`: `[category, publishedAt]` (descending)
- [ ] `helpArticles`: `[slug]` (unique)
- [ ] `helpArticles`: `[category, isPublished, createdAt]` (descending)

### Directory & Search

- [ ] `directory`: `[businessId]` (unique)
- [ ] `directory`: `[category, isActive, createdAt]` (descending)
- [ ] `directory`: `[isVerified, isActive, createdAt]` (descending)
- [ ] `directory`: `[type, isActive, createdAt]` (descending)
- [ ] `searchHistory`: `[userId, createdAt]` (descending)

### Referrals & Conversations

- [ ] `referrals`: `[referrerId, status, createdAt]` (descending)
- [ ] `referrals`: `[referredUserId, createdAt]` (descending)
- [ ] `conversations`: `[participantIds, lastMessage.createdAt]` (descending)
- [ ] `conversations`: `[participantIds, type, lastMessage.createdAt]` (descending)

### Invoices

- [ ] `invoices`: `[issuerId, status, createdAt]` (descending)
- [ ] `invoices`: `[recipientId, status, createdAt]` (descending)

---

## Phase 3: Admin Indexes (P1) - Admin Panel

### User Management

- [ ] `users`: `[userType, status, createdAt]` (descending)
- [ ] `users`: `[tier, status, createdAt]` (descending)
- [ ] `users`: `[lastActiveAt, status]` (descending)

### Business Management

- [ ] `businesses`: `[type, status, createdAt]` (descending)
- [ ] `businesses`: `[level, status, createdAt]` (descending)

### Order Analytics

- [ ] `orders`: `[status, createdAt]` (descending)
- [ ] `orders`: `[orderType, status, createdAt]` (descending)
- [ ] `orders`: `[total, createdAt]` (descending)

### Transaction Analytics

- [ ] `transactions`: `[status, createdAt]` (descending)
- [ ] `transactions`: `[type, status, createdAt]` (descending)
- [ ] `transactions`: `[amount, createdAt]` (descending)

### Review Moderation

- [ ] `reviews`: `[reported, createdAt]` (descending)
- [ ] `reviews`: `[rating, createdAt]` (descending)

### Admin Subcollections

- [ ] `admin/disputes`: `[status, createdAt]` (descending)
- [ ] `admin/disputes`: `[type, status, createdAt]` (descending)
- [ ] `admin/disputes`: `[userId, createdAt]` (descending)
- [ ] `admin/auditLogs`: `[adminUserId, createdAt]` (descending)
- [ ] `admin/auditLogs`: `[actionType, createdAt]` (descending)
- [ ] `admin/auditLogs`: `[targetType, createdAt]` (descending)

---

## Phase 4: Medium Priority Indexes (P2) - As Needed

### Popular Content

- [ ] `events`: `[status, stats.views, startDate]` (descending)
- [ ] `videos`: `[views, isPublished]` (descending)
- [ ] `blogPosts`: `[views, publishedAt]` (descending)
- [ ] `helpArticles`: `[helpful, isPublished]` (descending)
- [ ] `courses`: `[stats.enrollments, isPublished]` (descending)
- [ ] `businesses`: `[stats.reviewCount, status]` (descending)
- [ ] `businesses`: `[stats.averageRating, status]` (descending)
- [ ] `directory`: `[relevanceScore, isActive]` (descending)
- [ ] `directory`: `[popularityScore, isActive]` (descending)

### Advanced Filtering

- [ ] `products`: `[merchantId, price, createdAt]` (ascending)
- [ ] `products`: `[merchantId, price, createdAt]` (descending)
- [ ] `products`: `[tags, isActive, createdAt]` (descending)
- [ ] `events`: `[tags, status, startDate]` (ascending)
- [ ] `businesses`: `[address.city, address.state, status]` (descending)
- [ ] `reviews`: `[businessId, helpfulCount, createdAt]` (descending)
- [ ] `reviews`: `[businessId, businessResponse, createdAt]` (descending)

### Notification Extensions

- [ ] `notifications`: `[userId, priority, createdAt]` (descending)
- [ ] `notifications`: `[expiresAt, createdAt]` (ascending)

### Search & Analytics

- [ ] `searchHistory`: `[query, createdAt]` (descending)
- [ ] `users`: `[activityStreak, lastActiveAt]` (descending)
- [ ] `users`: `[referralCount, createdAt]` (descending)
- [ ] `users`: `[preferences.language, status]` (descending)

### Demographics Case Study

- [ ] `users`: `[demographics.ethnicity, demographics.completed, createdAt]` (descending)
- [ ] `users`: `[demographics.ageRange, demographics.completed, createdAt]` (descending)
- [ ] `users`: `[demographics.location.city, demographics.location.state, demographics.completed]` (descending)

---

## Index Creation Notes

### Firestore Limits

- **200 composite indexes** per database (hard limit)
- **Index build time**: Can take minutes to hours for large collections
- **Index storage**: Each index uses storage space

### Best Practices

1. **Start with P0 indexes** - Create critical indexes first
2. **Monitor usage** - Remove unused indexes
3. **Test queries** - Verify indexes are being used
4. **Use limits** - Always use `.limit()` on queries
5. **Pagination** - Use cursor-based pagination for large datasets

### Index Creation Methods

1. **Firebase Console**: Visual interface for creating indexes
2. **Firebase CLI**: Deploy indexes via `firestore.indexes.json`
3. **Auto-creation**: Firestore will suggest indexes for queries that need them

---

## Testing Checklist

### Query Testing

- [ ] All user-facing queries use indexes
- [ ] All business-facing queries use indexes
- [ ] All admin queries use indexes
- [ ] No full collection scans
- [ ] Query response times < 1s

### Index Verification

- [ ] All unique constraints working
- [ ] Composite queries using indexes
- [ ] Geo queries working correctly
- [ ] Date range queries optimized
- [ ] Status filtering optimized

### Performance Testing

- [ ] Pagination working correctly
- [ ] Large dataset queries performant
- [ ] Real-time listeners performant
- [ ] Index build times acceptable

---

## Quick Reference

### Most Common Indexes

```javascript
// User orders
orders: [customerId, createdAt] (descending)

// Business orders
orders: [entityId, entityType, createdAt] (descending)

// User transactions
transactions: [userId, createdAt] (descending)

// Business reviews
reviews: [businessId, createdAt] (descending)

// User notifications
notifications: [userId, read, createdAt] (descending)

// Active events
events: [status, startDate] (ascending)
```

---

## References

- **Full Index Plan**: `action_plans/database-indexes-plan.md`
- **Database Design**: `action_plans/database-design.md`
- **Database Summary**: `action_plans/database-design-summary.md`
- **Firestore Indexing**: https://firebase.google.com/docs/firestore/query-data/indexing

