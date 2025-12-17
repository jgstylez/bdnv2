# Database Design - PCI Compliance & Feature Enhancements

**Date:** 2025-01-XX  
**Purpose:** Summary of PCI compliance requirements and feature enhancements

---

## PCI Compliance Summary

### Critical Requirements

**NEVER STORE:**

- ❌ Full Primary Account Numbers (PAN) - card numbers
- ❌ CVV/CVC codes
- ❌ Full bank account numbers
- ❌ Full routing numbers
- ❌ PINs or passwords
- ❌ Any sensitive authentication data

**ONLY STORE:**

- ✅ Tokenized payment method references (e.g., Stripe `payment_method_id`)
- ✅ Last 4 digits of cards/accounts (for display only)
- ✅ Card brand, expiry month/year (safe to store)
- ✅ Payment processor transaction IDs
- ✅ Display names and labels

### Implementation

All payment data is tokenized at the payment processor level before storage:

1. **Payment Methods**: Store `paymentMethodToken` from processor (Stripe, Square, etc.)
2. **Display Info**: Only store last 4 digits, brand, expiry for UI display
3. **Transactions**: Reference processor transaction IDs, not raw payment data
4. **Wallets**: Store tokenized references, not actual payment credentials

### Collections Updated

- `wallets` - Only tokenized references and display info
- `orders.payment` - Only tokenized references and display info
- `transactions.paymentMethod` - Only tokenized references and display info

---

## Feature Enhancements

### 1. Demographics Case Study

**Purpose:** Track Black dollar circulation within communities

**Fields Added:**

- Ethnicity (African American, Afro-Caribbean, Afro-Latino, etc.)
- Age range
- Gender
- Industry
- Employment status
- Educational background (including HBCU)
- Income range
- Household size
- Location data
- Consent tracking

**Collection:** `users.demographics`

**Privacy:** User consent required, data anonymized for analytics

---

### 2. Business Directory & Search

**New Collections:**

- `directory` - Optimized search index for businesses
- `searchHistory` - User search analytics

**Features:**

- Geo-location search
- Category filtering
- Relevance scoring
- Popularity ranking
- Search history tracking

**Integration:** Designed for Elasticsearch/Algolia integration

---

### 3. Nonprofit Campaigns Enhancement

**Enhanced Fields:**

- Campaign types (donation, sponsorship, volunteer, fundraiser)
- Recurring donation support
- Anonymous donation support
- Donor messages
- Impact tracking and updates
- Campaign statistics (views, shares, contributors)
- Minimum donation amounts

**Subcollections:**

- `campaigns/{campaignId}/donations` - Individual donations
- `campaigns/{campaignId}/updates` - Impact updates

---

### 4. BDN University

**New Collections:**

**`courses`** - Interactive courses

- Step-by-step guides
- Learning objectives
- Prerequisites
- Interactive elements
- Completion tracking

**`videos`** - Video tutorials

- Categories (tutorial, feature, tips, community, business)
- View tracking
- Duration

**`guides`** - Step-by-step guides

- Interactive checkboxes
- Code snippets
- Tooltips
- Navigation actions

**`blogPosts`** - Blog articles

- Rich content blocks
- Categories (news, tips, community, business, updates)
- Related posts
- Read time tracking

**`helpArticles`** - Help center

- FAQ support
- Helpful/not helpful feedback
- Related articles
- Category organization

---

### 5. User Shopping & Shipping

**Enhanced:**

- Multiple shipping addresses
- Billing addresses (separate from shipping)
- Address validation
- Delivery instructions
- Usage tracking
- Default address preferences

**Subcollections:**

- `users/{userId}/shippingAddresses`
- `users/{userId}/billingAddresses`

---

### 6. Business Operations

**Enhanced Sections:**

**Shipping Settings:**

- Origin address
- Multiple shipping methods
- Carrier integration
- Handling time
- Packaging preferences
- Free shipping thresholds

**Payment Processing:**

- Processor integration (Stripe, Square, PayPal)
- Accepted payment methods
- Auto-transfer settings
- Payment terms

**Fulfillment:**

- Fulfillment type (self, dropship, fulfillment center)
- Order workflow
- Return policies
- Pick list generation

**Inventory:**

- Low stock alerts
- Backorder handling
- Out of stock behavior

**Tax:**

- Tax collection settings
- Tax calculation methods
- Tax rates by location
- Tax exemption support

---

### 7. Order & Transaction Details

**Order Enhancements:**

- Detailed shipping info with tracking events
- Payment method details (tokenized)
- Item-level fulfillment tracking
- Return/refund workflow
- Pick list generation

**Transaction Enhancements:**

- Payment processing details
- Authorization and capture tracking
- Settlement information
- Dispute/chargeback tracking
- Risk assessment and fraud detection

---

## Security Considerations

### PCI Compliance

- All sensitive payment data handled by PCI-compliant processors
- Only tokenized references stored in database
- Display-only information for UI purposes

### Data Privacy

- Demographics data requires user consent
- Address data encrypted at rest
- Search history can be cleared by user
- Anonymized analytics data

### Access Control

- Payment method tokens only accessible to authorized services
- Business operational data only accessible to business owners
- Admin access logged and audited

---

## Migration Notes

### Payment Data Migration

- Existing payment data must be migrated to tokenized format
- Work with payment processor to tokenize existing payment methods
- Remove any stored sensitive payment data

### Demographics Migration

- Migrate existing demographic data
- Ensure consent flags are set
- Anonymize historical data if needed

### Directory Migration

- Build search index from existing business data
- Calculate relevance and popularity scores
- Set up search service integration (Elasticsearch/Algolia)

---

## Testing Checklist

### PCI Compliance Testing

- [ ] Verify no full card numbers stored
- [ ] Verify no CVV codes stored
- [ ] Verify only tokenized references stored
- [ ] Test payment processing with tokens
- [ ] Verify display info only shows last 4 digits

### Feature Testing

- [ ] Test demographics case study data collection
- [ ] Test directory search functionality
- [ ] Test nonprofit campaign creation and donations
- [ ] Test BDN University course enrollment
- [ ] Test shipping address management
- [ ] Test business operational settings

---

## References

- **Full Database Design**: `action_plans/database-design.md`
- **Quick Reference**: `action_plans/database-design-summary.md`
- **PCI DSS Requirements**: https://www.pcisecuritystandards.org/
- **Firestore Security**: https://firebase.google.com/docs/firestore/security/get-started
