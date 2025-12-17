# BDN 2.0 Database Design - Quick Reference

**Date:** 2025-01-XX  
**Purpose:** Quick reference guide for Firestore collections and their purposes

---

## Collection Overview

| Collection          | Purpose                                            | Key Fields                                                                                        |
| ------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `users`             | User accounts (consumers, business owners, admins) | `id`, `email`, `tier`, `points`, `userType`, `shopping`, `shippingAddresses`                      |
| `businesses`        | Black-owned business profiles                      | `id`, `userId`, `name`, `status`, `isVerified`, `shipping`, `paymentProcessing`, `fulfillment`    |
| `nonprofits`        | Nonprofit organization profiles                    | `id`, `userId`, `name`, `status`, `verified`                                                      |
| `products`          | Products sold by businesses                        | `id`, `merchantId`, `name`, `price`, `inventory`                                                  |
| `orders`            | Customer orders (products, donations, tickets)     | `id`, `orderNumber`, `customerId`, `entityId`, `status`, `shippingInfo`, `payment`, `fulfillment` |
| `transactions`      | All financial transactions                         | `id`, `userId`, `type`, `amount`, `status`, `paymentMethod`, `processing`                         |
| `wallets`           | User payment methods and balances                  | `id`, `userId`, `type`, `currency`, `balance`                                                     |
| `subscriptions`     | BDN+ subscription plans                            | `id`, `userId`, `tier`, `status`, `nextBillingDate`                                               |
| `subscriptionBoxes` | Recurring product shipments                        | `id`, `userId`, `merchantId`, `nextShipmentDate`                                                  |
| `invoices`          | Invoices for businesses/nonprofits                 | `id`, `invoiceNumber`, `issuerId`, `recipientId`, `status`                                        |
| `events`            | Community events                                   | `id`, `organizerId`, `title`, `startDate`, `status`                                               |
| `campaigns`         | Nonprofit fundraising campaigns                    | `id`, `organizationId`, `title`, `status`, `targetAmount`                                         |
| `reviews`           | Business reviews and ratings                       | `id`, `businessId`, `userId`, `orderId`, `rating`, `comment`, `verifiedPurchase`                |
| `badges`            | Badge definitions (system-wide)                    | `id`, `name`, `category`, `rarity`, `requirement`                                                 |
| `referrals`         | Referral tracking                                  | `id`, `referrerId`, `referredUserId`, `status`                                                    |
| `conversations`     | Direct message conversations                       | `id`, `participantIds`, `type`, `lastMessage`                                                     |
| `notifications`     | User notifications                                 | `id`, `userId`, `type`, `channel`, `read`                                                         |
| `courses`           | BDN University courses                             | `id`, `title`, `category`, `difficulty`, `steps`                                                  |
| `admin`             | Admin operations and settings                      | Various admin documents                                                                           |
| `analytics`         | Aggregated analytics data                          | Daily stats, metrics, reports                                                                     |

---

## Key Relationships

### User Relationships

- **User → Businesses**: `businesses.userId = users.id`
- **User → Orders**: `orders.customerId = users.id`
- **User → Transactions**: `transactions.userId = users.id`
- **User → Wallets**: `wallets.userId = users.id`
- **User → Subscriptions**: `subscriptions.userId = users.id`
- **User → Reviews**: `reviews.userId = users.id`
- **Order → Reviews**: `reviews.orderId = orders.id` (for purchase reviews)
- **User → Referrals**: `referrals.referrerId = users.id` or `referrals.referredUserId = users.id`
- **User → Shipping Addresses**: `users/{userId}/shippingAddresses/{addressId}`
- **User → Billing Addresses**: `users/{userId}/billingAddresses/{addressId}`

### Business Relationships

- **Business → Products**: `products.merchantId = businesses.id`
- **Business → Orders**: `orders.entityId = businesses.id` (where `entityType = "business"`)
- **Business → Reviews**: `reviews.businessId = businesses.id`
- **Business → Transactions**: `transactions.relatedEntityId = businesses.id` (where `relatedEntityType = "business"`)

### Order Relationships

- **Order → Transaction**: `orders.transactionId = transactions.id`
- **Order → Products**: `orders.items[].productId = products.id`
- **Order → Event**: `orders.eventId = events.id` (for event tickets)
- **Order → Campaign**: `orders.campaignId = campaigns.id` (for donations)
- **Order → Subscription Box**: `orders.subscriptionBoxId = subscriptionBoxes.id`

### Event Relationships

- **Event → Tickets**: `events/{eventId}/tickets/{ticketId}`
- **Event → Orders**: `orders.eventId = events.id`

### Campaign Relationships

- **Campaign → Donations**: `campaigns/{campaignId}/donations/{donationId}`
- **Campaign → Orders**: `orders.campaignId = campaigns.id`

---

## Common Query Patterns

### Get User's Orders

```typescript
db.collection("orders")
  .where("customerId", "==", userId)
  .orderBy("createdAt", "desc")
  .limit(20);
```

### Get Business Products

```typescript
db.collection("products")
  .where("merchantId", "==", businessId)
  .where("isActive", "==", true)
  .orderBy("createdAt", "desc");
```

### Get User's Transactions

```typescript
db.collection("transactions")
  .where("userId", "==", userId)
  .orderBy("createdAt", "desc")
  .limit(50);
```

### Get Business Reviews

```typescript
db.collection("reviews")
  .where("businessId", "==", businessId)
  .orderBy("createdAt", "desc")
  .limit(20);
```

### Get Active Events

```typescript
db.collection("events")
  .where("status", "==", "published")
  .where("startDate", ">=", new Date().toISOString())
  .orderBy("startDate", "asc");
```

### Get User's Notifications

```typescript
db.collection("notifications")
  .where("userId", "==", userId)
  .where("read", "==", false)
  .orderBy("createdAt", "desc")
  .limit(20);
```

---

## Status Enums

### User Status

- `active` - User account is active
- `suspended` - User account is suspended
- `deleted` - User account is deleted (soft delete)

### Business Status

- `pending` - Application submitted, awaiting approval
- `approved` - Application approved
- `rejected` - Application rejected
- `suspended` - Business suspended
- `active` - Business is active

### Order Status

- `pending` - Order placed, awaiting confirmation
- `confirmed` - Order confirmed
- `processing` - Order being processed
- `ready-to-ship` - Order ready to ship
- `shipped` - Order shipped
- `delivered` - Order delivered
- `completed` - Order completed
- `cancelled` - Order cancelled
- `refunded` - Order refunded
- `failed` - Order failed

### Transaction Status

- `pending` - Transaction pending
- `completed` - Transaction completed
- `failed` - Transaction failed
- `cancelled` - Transaction cancelled
- `refunded` - Transaction refunded

### Payment Status

- `pending` - Payment pending
- `processing` - Payment processing
- `completed` - Payment completed
- `failed` - Payment failed
- `refunded` - Payment refunded

### Event Status

- `draft` - Event draft (not published)
- `published` - Event published
- `cancelled` - Event cancelled
- `completed` - Event completed

### Campaign Status

- `active` - Campaign active
- `completed` - Campaign completed
- `cancelled` - Campaign cancelled

---

## Required Indexes

### Unique Indexes

- `users.email` (unique)
- `users.referralCode` (unique)
- `businesses.slug` (unique)
- `nonprofits.slug` (unique)
- `orders.orderNumber` (unique)
- `transactions.transactionNumber` (unique)
- `invoices.invoiceNumber` (unique)

### Composite Indexes (Most Important)

- `users`: `[tier, points]`, `[status, createdAt]`
- `businesses`: `[status, createdAt]`, `[category, status]`
- `orders`: `[customerId, createdAt]`, `[entityId, entityType, createdAt]`, `[status, createdAt]`
- `transactions`: `[userId, createdAt]`, `[type, status, createdAt]`
- `events`: `[status, startDate]`, `[organizerId, status]`
- `reviews`: `[businessId, createdAt]`, `[businessId, rating]`
- `notifications`: `[userId, read, createdAt]`

---

## Data Types Reference

### Common Field Types

- **IDs**: `string` (Firestore document IDs)
- **Emails**: `string` (validated email format)
- **Phone Numbers**: `string` (with optional `phoneCountryCode`)
- **Prices**: `number` (stored as cents or smallest currency unit)
- **Dates**: `string` (ISO 8601 format: "2025-01-15T10:30:00Z")
- **Booleans**: `boolean` (true/false)
- **Enums**: `string` (predefined values)
- **Arrays**: `array` (for tags, IDs, etc.)
- **Objects**: `map` (for nested data like addresses)

### Currency

- `USD` - US Dollars
- `BLKD` - Black Dollar Network tokens

### User Tiers

- `basic` - Entry level
- `bronze` - First tier
- `silver` - Second tier
- `gold` - Third tier
- `diamond` - Fourth tier
- `black-diamond` - Highest tier

### Subscription Tiers

- `free` - Free tier
- `plus` - BDN+ ($9.99/month)
- `premium` - BDN+ Business ($29.99/month)
- `enterprise` - Enterprise tier

---

## Subcollections

### User Subcollections

- `users/{userId}/badges` - User badge progress
- `users/{userId}/notifications` - User notifications (alternative to top-level collection)
- `users/{userId}/referrals` - Referral records
- `users/{userId}/shippingAddresses` - User shipping addresses (for physical products)
- `users/{userId}/billingAddresses` - User billing addresses
- `users/{userId}/orderHistory` - User order history (denormalized)

### Business Subcollections

- `businesses/{businessId}/products` - Business products (alternative to top-level collection)
- `businesses/{businessId}/orders` - Business orders
- `businesses/{businessId}/reviews` - Business reviews
- `businesses/{businessId}/analytics` - Business analytics

### Event Subcollections

- `events/{eventId}/tickets` - Individual tickets sold
- `events/{eventId}/registrations` - Event registrations

### Campaign Subcollections

- `campaigns/{campaignId}/donations` - Individual donations

### Subscription Box Subcollections

- `subscriptionBoxes/{subscriptionBoxId}/shipments` - Individual shipments

### Conversation Subcollections

- `conversations/{conversationId}/messages` - Individual messages

### Course Subcollections

- `courses/{courseId}/enrollments` - User course enrollments
- `courses/{courseId}/completions` - User course completions

---

## Denormalization Strategy

### Why Denormalize?

- **Performance**: Reduce number of reads
- **Cost**: Lower read costs
- **User Experience**: Faster load times

### What We Denormalize

1. **User Names**: Store `userName` in transactions, orders, reviews
2. **Business Names**: Store `businessName` in orders, transactions
3. **Statistics**: Maintain `stats` objects in business/nonprofit documents
4. **Last Message**: Store `lastMessage` in conversation documents
5. **Event Stats**: Store `stats` in event documents

### When to Update Denormalized Data

- Update user name → Update all related documents (batch update)
- Update business name → Update all related documents (batch update)
- New order → Update business stats
- New review → Update business stats (rating, review count)

---

## Security Rules Summary

### Public Read

- `businesses` - Public can read business profiles
- `events` - Public can read published events
- `reviews` - Public can read reviews
- `campaigns` - Public can read active campaigns

### Authenticated Read/Write

- `users` - Users can read/write their own data
- `orders` - Users can read their own orders; businesses can read their orders
- `transactions` - Users can read their own transactions
- `wallets` - Users can read/write their own wallets
- `reviews` - Users can create/update their own reviews

### Admin Only

- `admin` - Admin operations require admin role
- Business approval/rejection
- User suspension
- Platform settings

---

## Migration Checklist

### Initial Setup

- [ ] Create all collections
- [ ] Create all indexes
- [ ] Set up security rules
- [ ] Seed badge definitions
- [ ] Seed subscription plans
- [ ] Seed categories
- [ ] Seed review reasons

### Data Migration

- [ ] Migrate user accounts
- [ ] Migrate business data
- [ ] Migrate product catalog
- [ ] Migrate order history
- [ ] Migrate transaction history
- [ ] Migrate review data

### Testing

- [ ] Test all CRUD operations
- [ ] Test security rules
- [ ] Test query performance
- [ ] Test indexes
- [ ] Test pagination
- [ ] Test real-time listeners

---

## Performance Tips

1. **Use Indexes**: Create indexes for all query patterns
2. **Limit Results**: Always use `.limit()` on queries
3. **Pagination**: Use cursor-based pagination for large datasets
4. **Batch Operations**: Use batch writes for multiple updates
5. **Denormalize**: Store frequently accessed data together
6. **Cache**: Cache rarely changing data (badges, plans, categories)
7. **Monitor**: Monitor query performance and optimize slow queries

---

## Enhanced Details

### User Shopping & Shipping Details

**Shopping Preferences** (`users.shopping`):

- Default shipping/billing addresses
- Preferred shipping methods
- Payment method preferences
- Email notification preferences

**Shipping Addresses** (`users/{userId}/shippingAddresses`):

- Full address details with international support
- Company name (for business addresses)
- Delivery instructions
- Address validation tracking
- Usage tracking (last used, usage count)
- Custom labels ("Home", "Work", etc.)

**Billing Addresses** (`users/{userId}/billingAddresses`):

- Separate billing addresses (may differ from shipping)
- Tax ID support for business addresses
- Address validation

### Business Operations Details

**Shipping Settings** (`businesses.shipping`):

- Origin address (where orders ship from)
- Multiple shipping methods with carrier support
- Handling time configuration
- Packaging preferences
- Free shipping thresholds

**Payment Processing** (`businesses.paymentProcessing`):

- Payment processor integration (Stripe, Square, PayPal)
- Accepted payment methods
- Auto-transfer settings for payouts
- Payment terms (Net 30, deposits, etc.)

**Fulfillment Settings** (`businesses.fulfillment`):

- Fulfillment type (self, dropship, fulfillment center)
- Fulfillment center details
- Order processing workflow
- Return & refund policies

**Inventory Management** (`businesses.inventory`):

- Low stock alerts
- Inventory tracking settings
- Backorder handling
- Out of stock behavior

**Tax Settings** (`businesses.tax`):

- Tax collection configuration
- Tax calculation methods
- Tax rates by location
- Tax exemption support

### Order Details

**Shipping Information** (`orders.shippingInfo`):

- Detailed shipping method with carrier
- Complete tracking information with events
- Shipping label URLs
- Package details (weight, dimensions)
- Delivery confirmation (signature, photos)

**Payment Details** (`orders.payment`):

- Payment method with tokenized references (`paymentMethodToken`) and display info only
- PCI-compliant: Only stores last 4 digits, brand, expiry (no full card/account numbers)
- Payment processing information
- Authorization and capture details
- Refund tracking with history
- Payment timeline (authorized, captured, paid)

**Fulfillment Details** (`orders.fulfillment`):

- Item-level fulfillment tracking
- Fulfillment workflow timeline
- Pick list/packing slip generation
- Fulfillment notes (internal/customer)

**Returns** (`orders.returns`):

- Return authorization (RMA) tracking
- Return shipping labels
- Item-level return status
- Return processing workflow

### Transaction Details

**Payment Method** (`transactions.paymentMethod`):

- Detailed payment method information
- Card details (last4, brand, expiry)
- Bank account details
- Wallet information

**Processing Details** (`transactions.processing`):

- Payment processor information
- Authorization and capture details
- Settlement information
- Dispute/chargeback tracking

**Risk & Fraud** (`transactions.metadata`):

- IP address and device info
- Risk score and risk level
- Fraud detection flags

---

## Support & Resources

- **Full Design Document**: `action_plans/database-design.md`
- **Firestore Documentation**: https://firebase.google.com/docs/firestore
- **Security Rules Guide**: https://firebase.google.com/docs/firestore/security/get-started
- **Indexing Guide**: https://firebase.google.com/docs/firestore/query-data/indexing
