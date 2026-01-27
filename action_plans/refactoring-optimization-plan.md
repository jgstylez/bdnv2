# Action Plans Refactoring and Optimization Plan

**Date:** 2026-01-27  
**Purpose:** Review and optimize action plans for refactoring opportunities including recurring purchases consolidation, redundant fields removal, tracking optimization, and database design improvements to make documents more cohesive.

---

## Overview

This plan identifies refactoring and optimization opportunities across the action plans, focusing on:

1. Consolidating recurring purchase/subscription patterns
2. Removing redundant and unnecessary fields
3. Optimizing tracking and statistics
4. Improving database design consistency
5. Making documentation more cohesive

---

## 1. Recurring Purchases/Subscriptions Consolidation

### Current State

The system has **5 different recurring payment patterns**:

1. **`subscriptions`** - BDN+ subscription plans (monthly/yearly billing)
2. **`subscriptionBoxes`** - Recurring product shipments (weekly/bi-weekly/monthly/etc.)
3. **`invoices.recurringSettings`** - Recurring invoices (daily/weekly/monthly/etc.)
4. **`campaigns.allowRecurring`** - Recurring donations (weekly/bi-weekly/monthly/etc.)
5. **`RecurringPurchase`** (tokens) - Recurring token purchases

### Issues Identified

- **Duplicate payment method fields**: All 5 patterns store `paymentMethodId` and `paymentMethodToken` separately
- **Inconsistent frequency enums**: Different frequency values across collections
- **Separate billing logic**: Each pattern implements its own billing cycle logic
- **No unified subscription management**: Users can't see all recurring payments in one place

### Proposed Refactoring

**Option A: Unified Recurring Payment System**

Create a base `recurringPayments` collection with a `type` field:

```typescript
recurringPayments/{recurringPaymentId}
{
  id: string;
  userId: string;
  type: "subscription" | "subscription-box" | "invoice" | "donation" | "token-purchase";
  
  // Unified recurring settings
  frequency: "daily" | "weekly" | "bi-weekly" | "monthly" | "bi-monthly" | "quarterly" | "annually";
  nextBillingDate: string;
  billingCycleCount?: number; // -1 for indefinite
  currentCycle: number;
  
  // Unified payment method
  paymentMethod: {
    id: string; // Wallet ID or payment method token reference
    token?: string; // Direct payment processor token
    type: "wallet" | "card" | "bank_transfer";
  };
  
  // Type-specific data (polymorphic)
  subscriptionData?: { tier: string; features: string[]; };
  subscriptionBoxData?: { productId: string; merchantId: string; };
  invoiceData?: { invoiceId: string; issuerId: string; };
  donationData?: { campaignId: string; amount: number; };
  tokenPurchaseData?: { tokensPerPurchase: number; };
  
  // Unified status and dates
  status: "active" | "paused" | "cancelled" | "expired" | "pending";
  startDate: string;
  endDate?: string;
  pausedUntil?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Option B: Keep Separate Collections, Add Shared Utilities**

- Keep existing collections
- Create shared `lib/recurring-payments.ts` utilities
- Standardize frequency enums
- Create unified subscription management UI

**Recommendation**: Start with **Option B** (less disruptive), plan migration to Option A later.

### Action Items

- [ ] Create unified frequency enum: `RecurringFrequency`
- [ ] Create shared recurring payment utilities in `lib/recurring-payments.ts`
- [ ] Standardize payment method references across all recurring types
- [ ] Create unified subscription management page showing all recurring payments
- [ ] Document migration path from Option B to Option A for future

---

## 2. Redundant and Unnecessary Fields

### Issues Identified

#### 2.1 Duplicate Date Fields

**`users` collection:**

- `lastActiveAt: string` (ISO timestamp)
- `lastActivityDate: string` (YYYY-MM-DD format)
- **Issue**: Both track last activity, redundant

**Recommendation**: Keep `lastActiveAt` (ISO format), remove `lastActivityDate` (can derive from `lastActiveAt`)

#### 2.2 Legacy Address Fields

**`businesses` collection:**

- `address: { street, city, state, postalCode, country }` (new structure)
- `city?: string` (legacy)
- `state?: string` (legacy)
- `zipCode?: string` (legacy)
- **Issue**: Legacy fields conflict with new `address` object

**Recommendation**: Remove legacy fields after migration, document migration path

**`nonprofits` collection:**

- Same issue as businesses

#### 2.3 Duplicate Tax Identification

**`businesses` and `nonprofits` collections:**

- `taxIdentification: { type, number, country }` (new structure)
- `ein?: string` (legacy, US-specific)
- **Issue**: `ein` is redundant with `taxIdentification.number` for US businesses

**Recommendation**: Remove `ein` after migration, use `taxIdentification.number` for EIN

#### 2.4 Redundant Payment Method References

**Multiple collections:**

- `paymentMethodId?: string` (Wallet ID reference)
- `paymentMethodToken?: string` (Direct processor token)
- **Issue**: Both fields serve similar purpose, inconsistent usage

**Recommendation**: Standardize to single `paymentMethod` object:

```typescript
paymentMethod: {
  id?: string; // Wallet ID
  token?: string; // Processor token
  type: "wallet" | "card" | "bank_transfer";
}
```

#### 2.5 Duplicate Status Fields

**`orders` collection:**

- `status: "pending" | "confirmed" | ...`
- `fulfillmentStatus: "unfulfilled" | "partial" | "fulfilled" | ...`
- **Issue**: Some overlap between status and fulfillmentStatus

**Recommendation**: Keep both but clarify:

- `status`: Overall order lifecycle status
- `fulfillmentStatus`: Specific fulfillment/shipping status

---

## 3. Tracking and Statistics Optimization

### Current State

**8 collections** have `stats` objects with similar fields:

- `businesses.stats`
- `nonprofits.stats`
- `products.stats`
- `campaigns.stats`
- `events.stats`
- `courses.stats`
- `videos.stats`
- `blogPosts.stats`

### Issues Identified

1. **Inconsistent stat fields**: Each collection has different stat fields
2. **Denormalization overhead**: Stats need to be updated on every related action
3. **No clear update strategy**: Unclear when/how stats are recalculated
4. **Potential data inconsistency**: Stats can get out of sync

### Proposed Optimization

#### Option A: Centralized Analytics Collection

Move all stats to `analytics` collection with type-specific documents:

```typescript
analytics/{entityType}/{entityId}
{
  entityType: "business" | "product" | "campaign" | "event" | ...;
  entityId: string;
  stats: {
    // Common stats
    views: number;
    clicks: number;
    shares: number;
    // Type-specific stats
    [key: string]: any;
  };
  lastCalculatedAt: string;
  calculationMethod: "realtime" | "scheduled" | "on-demand";
}
```

#### Option B: Keep Denormalized, Add Validation

- Keep stats in respective collections
- Add `lastCalculatedAt` timestamp
- Add scheduled job to recalculate stats
- Add validation to detect inconsistencies

**Recommendation**: Start with **Option B**, plan migration to Option A if stats become too complex

### Action Items

- [ ] Standardize common stat fields across all collections:
  - `views: number`
  - `clicks?: number`
  - `shares?: number`
  - `lastCalculatedAt: string`
- [ ] Document stat calculation strategy for each collection
- [ ] Add `lastCalculatedAt` field to all stats objects
- [ ] Create scheduled job to recalculate stats periodically
- [ ] Add validation to detect stat inconsistencies

---

## 4. Database Design Improvements

### 4.1 Inconsistent Naming Conventions

**Issues:**

- Mix of camelCase and snake_case
- Some fields use abbreviations (`id`, `url`), others use full words (`identifier`, `website`)

**Recommendation**: Standardize to camelCase for all fields

### 4.2 Subcollection vs Top-Level Collection

**Current inconsistencies:**

- `users/{userId}/notifications` (subcollection)
- `notifications/{notificationId}` (top-level, mentioned in summary)
- **Issue**: Unclear which pattern to use

**Recommendation**:

- Use subcollections for **user-specific** data that's always queried with userId
- Use top-level collections for **shared/public** data or data queried independently

**Action**: Document decision criteria for subcollection vs top-level

### 4.3 Analytics Collection Structure

**Current state**: Vague structure:

```typescript
analytics / { documentId };
{
  // Various analytics documents:
  // - dailyStats: Daily platform statistics
  // - businessMetrics: Business performance metrics
  // - userMetrics: User engagement metrics
}
```

**Recommendation**: Define clear structure:

```typescript
analytics/
  dailyStats/{date}
  businessMetrics/{businessId}
  userMetrics/{userId}
  platformMetrics/{date}
```

### 4.4 Missing Indexes

**Issues identified:**

- `subscriptionBoxes.nextShipmentDate` indexed but `subscriptions.nextBillingDate` also indexed (good)
- Missing composite index for recurring payments: `[userId, status, nextBillingDate]`
- Campaign recurring donations not indexed

**Action**: Review `database-indexes-plan.md` and add missing indexes

---

## 5. Documentation Cohesion Improvements

### 5.1 Cross-Reference Updates

**Issues:**

- `database-design.md` references other docs but links may be outdated
- `database-design-summary.md` should link to full design doc
- `wallet-system-blkd-architecture.md` should reference `database-design.md`

**Action**: Add/update cross-references between documents

### 5.2 Consistent Terminology

**Issues:**

- "BDN+" vs "BDN Plus" vs "BDN+ Premium"
- "Subscription Box" vs "Recurring Shipment"
- "Recurring Purchase" vs "Recurring Payment"

**Action**: Create terminology glossary, update all docs to use consistent terms

### 5.3 Date Format Consistency

**Issues:**

- Some docs say "ISO 8601 strings"
- Some examples use different formats
- `lastActivityDate` uses "YYYY-MM-DD" while others use ISO 8601

**Action**: Standardize all dates to ISO 8601 format, update examples

### 5.4 Missing Documentation

**Missing docs for:**

- Recurring payment system architecture (unified approach)
- Statistics calculation strategy
- Migration guide for legacy fields
- Payment method reference standardization

**Action**: Create missing documentation

---

## 6. Specific Refactoring Tasks

### Task 1: Consolidate Recurring Payment Types

**Files to update:**

- `action_plans/database-design.md` - Add unified recurring payment section
- `action_plans/subscription-box-feature.md` - Reference unified system
- `action_plans/invoice-flows-implementation.md` - Reference unified system
- Create `action_plans/recurring-payments-architecture.md`

**Changes:**

- Document unified frequency enum
- Standardize payment method references
- Create shared utilities documentation

### Task 2: Remove Redundant Fields

**Files to update:**

- `action_plans/database-design.md` - Remove/flag legacy fields
- Create `action_plans/database-migration-guide.md` - Document migration path

**Fields to remove:**

- `users.lastActivityDate` (keep `lastActiveAt`)
- `businesses.city`, `state`, `zipCode` (after migration)
- `nonprofits.city`, `state`, `zipCode` (after migration)
- `businesses.ein` (after migration)
- `nonprofits.ein` (after migration)

### Task 3: Optimize Statistics

**Files to update:**

- `action_plans/database-design.md` - Standardize stats objects
- Create `action_plans/statistics-calculation-strategy.md`

**Changes:**

- Add `lastCalculatedAt` to all stats
- Document calculation strategy per collection
- Add validation strategy

### Task 4: Improve Documentation Cohesion

**Files to update:**

- All action plan documents - Add cross-references
- Create `action_plans/terminology-glossary.md`
- Update `action_plans/README.md` with document index

**Changes:**

- Add "Related Documentation" sections
- Standardize terminology
- Ensure consistent date formats

---

## 7. Implementation Priority

### Phase 1: Documentation Updates (Low Risk)

1. Add cross-references between documents
2. Create terminology glossary
3. Standardize date format documentation
4. Document current state (no code changes)

### Phase 2: Field Standardization (Medium Risk)

1. Standardize payment method references (documentation only)
2. Create unified frequency enum (documentation)
3. Document migration path for legacy fields

### Phase 3: Code Refactoring (Higher Risk)

1. Implement unified recurring payment utilities
2. Migrate legacy fields
3. Implement statistics validation
4. Add missing indexes

---

## 8. Success Criteria

- [ ] All recurring payment types use consistent patterns
- [ ] No redundant fields in database design
- [ ] Statistics calculation strategy documented for all collections
- [ ] All documents cross-reference related docs
- [ ] Consistent terminology across all documents
- [ ] Migration guide for legacy fields
- [ ] Unified subscription management documented

---

## Related Documentation

- `action_plans/database-design.md` - Main database design
- `action_plans/database-design-summary.md` - Quick reference
- `action_plans/wallet-system-blkd-architecture.md` - Wallet system
- `action_plans/subscription-box-feature.md` - Subscription boxes
- `action_plans/reward-levels-points-system.md` - Points system
- `action_plans/database-indexes-plan.md` - Index planning
