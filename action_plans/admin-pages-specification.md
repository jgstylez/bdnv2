# Admin Pages Specification

**Date:** 2024-12-19  
**Last Updated:** 2024-12-19  
**Purpose:** Detailed specification of what the three missing admin pages would entail

**Important Notes:**
- **Gift Card Orders** and **BLKD Purchases** are **automated systems** - admin pages are primarily for **monitoring, viewing, and dispute resolution only**
- These orders are **non-refundable** - no refund functionality needed
- **Subscription Boxes** are **user/business-managed** - admin provides **oversight and dispute resolution** only
- Admin intervention should be **rare** and only for unexpected issues or disputes

---

## 1. Gift Card Orders Management (`/admin/gift-cards`)

### Purpose
**View and monitor** all gift card orders. Handle **rare disputes** and **unexpected issues** only. System is **automated** - no routine manual intervention needed.

### ⚠️ Important: Non-Refundable Orders
- Gift cards are **non-refundable** once purchased
- Admin cannot process refunds
- Only handle technical issues or disputes

### Purpose
Manage all gift card orders placed by users, including universal and merchant-specific gift cards.

### Data Displayed
- **Order ID** - Unique identifier
- **Type** - Universal or Merchant-specific
- **Amount** - BLKD amount (always in BLKD)
- **Sender** - User who purchased (name, email, user ID)
- **Recipient** - User receiving gift card (name, email, user ID if registered)
- **Merchant** - If merchant-specific, show merchant name
- **Note** - Personal message from sender
- **Status** - pending | scheduled | sent | redeemed | expired
- **Scheduled Send Date** - If scheduled for future
- **Sent At** - When gift card was actually sent
- **Created At** - When order was placed
- **Gift Card ID** - Link to the created gift card wallet

### Filtering & Search
- **Search by:**
  - Order ID
  - Sender name/email/user ID
  - Recipient name/email/user ID
  - Merchant name (for merchant-specific)
- **Filter by:**
  - Status (pending, scheduled, sent, redeemed, expired)
  - Type (universal, merchant-specific)
  - Date range (created date, scheduled date, sent date)
  - Amount range

### Admin Actions (Limited - Dispute Resolution Only)

1. **View Details** ✅
   - Full order information
   - Sender and recipient details
   - Gift card wallet information
   - Redemption history (if redeemed)
   - Transaction details

2. **Resend Gift Card** ⚠️ (Only for technical failures)
   - Retry sending failed gift cards (system errors only)
   - Update recipient information if there was an error
   - Resend notification email if delivery failed

3. **View Redemption History** ✅
   - See when/where gift card was redeemed
   - Transaction details of redemption

4. **Flag for Review** ⚠️ (For disputes)
   - Flag orders for dispute resolution
   - Add notes/comments
   - Escalate to support team if needed

5. **Manual Send Override** ⚠️ (Rare - technical issues only)
   - Send scheduled gift cards early if system failed
   - Override scheduled date only for technical problems

### ❌ Removed Actions (Not Needed)
- ~~Cancel Order~~ - Orders are non-refundable, no cancellation
- ~~Refund~~ - Gift cards are non-refundable
- ~~Bulk Actions~~ - No routine operations needed

### Statistics & Analytics
- Total gift cards ordered (count)
- Total BLKD value of gift cards
- Breakdown by type (universal vs merchant-specific)
- Breakdown by status
- Average gift card amount
- Most popular merchants (for merchant-specific)
- Redemption rate
- Expired gift cards (unused BLKD)

### Key Features
- **View-Only Dashboard:** Primary purpose is monitoring and visibility
- **Dispute Resolution:** Flag and handle rare disputes
- **Export:** Export gift card orders to CSV (for reporting)
- **Notifications:** View notification history for each order
- **Audit Trail:** Track all status changes (automated) and admin actions (rare)
- **Alert System:** Highlight orders with issues (failed sends, errors)

---

## 2. BLKD Purchases Management (`/admin/blkd-purchases`)

### Purpose
**View and monitor** all BLKD (non-redeemable credits) purchases. Handle **rare disputes** and **unexpected issues** only. System is **automated** - no routine manual intervention needed.

### ⚠️ Important: Non-Refundable Purchases
- BLKD purchases are **non-refundable** once completed
- Admin cannot process refunds
- Only handle technical issues or disputes

### Data Displayed
- **Purchase ID** - Unique identifier
- **User** - Purchaser (name, email, user ID)
- **BLKD Amount** - Amount of BLKD purchased
- **USD Price** - Amount paid in USD
- **Discount %** - Discount percentage applied
- **Savings** - Amount saved in USD
- **Tier** - Purchase tier (100, 250, 500, 1000, 2500, 5000 BLKD)
- **Payment Method** - Wallet/payment method used
- **Status** - pending | processing | completed | failed
- **Transaction ID** - Link to transaction record
- **Created At** - Purchase timestamp
- **Completed At** - When purchase was completed

### Filtering & Search
- **Search by:**
  - Purchase ID
  - User name/email/user ID
  - Transaction ID
- **Filter by:**
  - Status (pending, processing, completed, failed)
  - Purchase tier/amount range
  - Date range
  - Discount percentage range

### Admin Actions (Limited - Dispute Resolution Only)

1. **View Details** ✅
   - Full purchase information
   - User details
   - Payment method details
   - Transaction details
   - BLKD wallet balance after purchase

2. **Retry Processing** ⚠️ (Only for technical failures)
   - Retry failed purchase processing (system errors only)
   - Manually complete pending purchases if stuck
   - Fix processing errors

3. **Manual Credit** ⚠️ (Rare - technical issues only)
   - Manually credit BLKD if processing failed but payment succeeded
   - Adjust BLKD balance only for verified technical issues
   - Requires documentation/reason

4. **Flag for Review** ⚠️ (For disputes)
   - Flag purchases for dispute resolution
   - Add notes/comments
   - Escalate to support team if needed

### ❌ Removed Actions (Not Needed)
- ~~Process Refund~~ - BLKD purchases are non-refundable
- ~~Cancel Purchase~~ - Purchases are non-refundable, no cancellation
- ~~Bulk Actions~~ - No routine operations needed

### Statistics & Analytics
- Total BLKD sold (sum of all purchases)
- Total revenue from BLKD sales
- Total discounts given (sum of savings)
- Average purchase amount
- Most popular purchase tier
- Purchase volume over time
- Failed purchase rate
- Refund rate
- Revenue by tier breakdown
- User purchase frequency (repeat buyers)

### Key Features
- **View-Only Dashboard:** Primary purpose is monitoring and visibility
- **Dispute Resolution:** Flag and handle rare disputes
- **Export:** Export purchase data to CSV (for reporting)
- **Tier Management:** View purchase tiers and pricing (read-only, pricing managed elsewhere)
- **Analytics Dashboard:** Visual charts for purchase trends
- **Audit Trail:** Track all automated processing and rare admin actions
- **Alert System:** Highlight purchases with issues (failed processing, errors)

---

## 3. Subscription Boxes Management (`/admin/subscription-boxes`)

### Purpose
**Oversight and dispute resolution** for subscription boxes. **Users manage their own subscriptions**, **businesses/nonprofits handle fulfillment**. Admin provides **monitoring and dispute resolution** only.

### ⚠️ Important: User/Business Managed
- **Users** control: pause, resume, cancel, update payment methods
- **Businesses/Nonprofits** control: fulfillment, shipping, tracking
- **Admin** role: oversight, monitoring, dispute resolution
- Admin intervention should be **rare** - only for disputes or issues

### Data Displayed

#### Subscription Boxes List
- **Subscription ID** - Unique identifier
- **User** - Subscriber (name, email, user ID)
- **Product** - Product being subscribed to
- **Merchant** - Business offering subscription
- **Plan** - Subscription plan details
- **Frequency** - weekly | bi-weekly | monthly | bi-monthly | quarterly
- **Duration** - Number of shipments or "Ongoing"
- **Status** - active | paused | cancelled | expired | pending
- **Quantity** - Quantity per shipment
- **Price Per Shipment** - Cost per shipment
- **Discount %** - Discount vs one-time purchase
- **Next Billing Date** - When next payment will be charged
- **Next Shipment Date** - When next shipment will be sent
- **Shipments Completed** - Number of shipments sent
- **Shipments Remaining** - Number of shipments left (-1 for ongoing)
- **Payment Method** - Payment method on file
- **Start Date** - When subscription started
- **End Date** - When subscription ends (if finite)
- **Paused Until** - Resume date (if paused)
- **Cancelled At** - Cancellation date (if cancelled)

#### Subscription Plans List (separate view)
- **Plan ID** - Unique identifier
- **Product** - Product name
- **Merchant** - Business name
- **Frequency** - Delivery frequency
- **Duration** - Subscription duration
- **Price Per Shipment** - Cost
- **Discount %** - Savings percentage
- **Active Subscriptions** - Number of active subscriptions using this plan
- **Is Active** - Whether plan is available for new subscriptions
- **Created At** - Plan creation date

#### Shipments List (separate view)
- **Shipment ID** - Unique identifier
- **Subscription** - Subscription box ID
- **Shipment Number** - 1, 2, 3, etc.
- **Status** - pending | processing | shipped | delivered | failed | cancelled
- **Order ID** - Link to order
- **Transaction ID** - Link to payment transaction
- **Tracking Number** - Shipping tracking
- **Carrier** - Shipping carrier
- **Scheduled Ship Date** - When shipment was scheduled
- **Shipped At** - When shipment was sent
- **Estimated Delivery** - Expected delivery date
- **Delivered At** - Actual delivery date

### Filtering & Search
- **Search by:**
  - Subscription ID
  - User name/email/user ID
  - Product name
  - Merchant name
  - Plan ID
- **Filter by:**
  - Status (active, paused, cancelled, expired, pending)
  - Frequency
  - Merchant
  - Product
  - Date range (start date, next billing date, next shipment date)

### Admin Actions (Limited - Oversight & Dispute Resolution)

#### For Subscription Boxes
1. **View Details** ✅
   - Full subscription information
   - User details
   - Product details
   - Plan details
   - Payment method
   - Shipment history
   - Billing history
   - User actions history (pause/resume/cancel)

2. **Flag for Review** ⚠️ (For disputes)
   - Flag subscriptions for dispute resolution
   - Add notes/comments
   - Escalate to support team if needed

3. **View User Actions** ✅
   - See when user paused/resumed/cancelled
   - View payment method updates
   - Track user-initiated changes

#### For Subscription Plans
1. **View Plan Details** ✅
   - Plan configuration
   - Active subscriptions using plan
   - Revenue from plan
   - Plan status (active/inactive)

2. **View Plan Analytics** ✅
   - Popularity metrics
   - Revenue metrics
   - Subscription trends

### ❌ Removed Actions (User/Business Managed)
- ~~Pause/Resume Subscription~~ - Users manage this
- ~~Cancel Subscription~~ - Users manage this
- ~~Update Payment Method~~ - Users manage this
- ~~Skip Next Shipment~~ - Users manage this
- ~~Process Next Shipment~~ - System automated, businesses handle fulfillment
- ~~Extend Duration~~ - Users manage this
- ~~Edit Plan~~ - Businesses manage their own plans
- ~~Deactivate/Activate Plan~~ - Businesses manage their own plans
- ~~Update Tracking~~ - Businesses handle shipping/tracking
- ~~Mark as Delivered~~ - Businesses handle fulfillment
- ~~Retry Failed Shipment~~ - Businesses handle fulfillment
- ~~Cancel Shipment~~ - Businesses handle fulfillment

### Statistics & Analytics
- Total active subscriptions
- Total paused subscriptions
- Total cancelled subscriptions
- Total subscriptions by frequency
- Total subscriptions by merchant
- Average subscription value
- Total revenue from subscriptions
- Average subscription duration
- Churn rate (cancellation rate)
- Most popular products for subscriptions
- Shipment success rate
- Failed payment rate
- Revenue by merchant
- Subscription growth over time

### Key Features
- **View-Only Dashboard:** Primary purpose is monitoring and oversight
- **Dispute Resolution:** Flag and handle disputes between users and businesses
- **Export:** Export subscription data to CSV (for reporting)
- **Notifications:** View notification history for each subscription
- **Audit Trail:** Track all user actions, business actions, and rare admin actions
- **Alert System:** Highlight subscriptions with issues (failed payments, disputes, fulfillment problems)
- **Tabs/Views:**
  - Subscriptions (main view - read-only)
  - Plans (view subscription plans - read-only)
  - Shipments (view all shipments - read-only)
  - Analytics (charts and metrics)
  - Disputes (flagged subscriptions requiring attention)

---

## Common Features Across All Pages

### Standard Admin Page Components
1. **Header**
   - Page title
   - Description (emphasizing view-only/monitoring purpose)
   - Quick stats cards

2. **Search & Filters**
   - Search bar
   - Status filter dropdown
   - Type/category filters
   - Date range picker
   - Clear filters button
   - **"Issues Only" filter** - Show only items needing attention

3. **Data Table/Cards**
   - List view with AdminDataCard component
   - Sortable columns (if table view)
   - Pagination or infinite scroll
   - **Visual indicators** for items with issues/disputes

4. **Detail Modal**
   - Full details view (read-only)
   - Related information
   - **Limited action buttons** (only for dispute resolution)
   - History/audit trail
   - **Dispute notes section**

5. **Action Modals** (Limited)
   - **Flag for Review** modal (for disputes)
   - **Add Note/Comment** modal
   - **Escalate to Support** option
   - ~~Refund modal~~ (not applicable - non-refundable)
   - ~~Cancel modal~~ (not applicable - user/business managed)

6. **Statistics Section**
   - Key metrics cards
   - Charts/graphs (if analytics)
   - Export options
   - **Issues/Disputes count** prominently displayed

### Integration Points
- Link to user management (view user details)
- Link to transaction management (view transactions)
- Link to business management (view merchant details)
- Link to product pages (view product details)

### Permissions
- **View-only access** for most admins (monitoring)
- **Dispute resolution access** for support admins (flag, add notes, escalate)
- **Full oversight access** for super admins (rare manual interventions)
- Audit logging for all actions (even view-only actions for compliance)

---

## Implementation Notes

### Data Sources
- All data would come from API endpoints (currently using mock data)
- Real-time updates via WebSocket or polling
- Caching for performance

### Performance Considerations
- Pagination for large datasets
- Lazy loading for details
- Optimistic updates for actions
- Debounced search

### User Experience
- Loading states
- Error handling with user-friendly messages
- Success confirmations (for rare actions)
- **Clear visual distinction** between view-only and actionable items
- **Prominent display** of items needing attention (disputes, issues)
- **Contextual help** explaining that these are automated/user-managed systems
- Keyboard shortcuts for power users
- **"Issues Dashboard"** - Quick view of all items requiring admin attention across all three pages

