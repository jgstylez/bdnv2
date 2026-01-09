# Business & Nonprofit Shared Features Analysis & Refactoring Plan

**Date:** 2025-01-27  
**Status:** Analysis Complete - Ready for Implementation

## Executive Summary

Businesses and nonprofits share significant feature overlap in products, orders, and invoices. Current implementation has substantial code duplication (~2,000+ lines) that can be consolidated into shared components while maintaining entity-specific functionality.

---

## 1. Shared Features Inventory

### 1.1 Products Management ✅ **IDENTICAL FUNCTIONALITY**

**Current Implementation:**
- `app/pages/merchant/products.tsx` (549 lines)
- `app/pages/nonprofit/products.tsx` (534 lines)

**Shared Features:**
- ✅ Product listing with grid view (3-column responsive)
- ✅ Search functionality
- ✅ Filter by product type (physical, digital, service)
- ✅ Product cards with image, name, description, price, inventory, SKU
- ✅ Product status badges (Active/Inactive, Shipping)
- ✅ Edit product action
- ✅ Delete product action with confirmation modal
- ✅ Bulk upload button
- ✅ Integrations button
- ✅ Add product button

**Differences:**
- Context: `BusinessSwitcher` vs `NonprofitSwitcher`
- Route params: `type=merchant` vs `type=nonprofit`
- Mock data: Different sample products

**Code Duplication:** ~95% identical (only context/switcher differs)

---

### 1.2 Orders Management ✅ **NEARLY IDENTICAL**

**Current Implementation:**
- `app/pages/merchant/orders.tsx` (1,130 lines)
- `app/pages/nonprofit/orders.tsx` (1,102 lines)

**Shared Features:**
- ✅ Order listing with filters
- ✅ Search by order number, customer, product
- ✅ Filter by status (pending, confirmed, processing, shipped, completed, cancelled)
- ✅ Filter by fulfillment status (unfulfilled, partial, fulfilled, shipped, delivered)
- ✅ Filter by payment status (pending, completed, failed, refunded)
- ✅ Filter by order type
- ✅ Stats cards (Total Orders, Pending, Processing, Completed, Revenue, Avg Order Value)
- ✅ Order detail modal
- ✅ Fulfillment modal (add tracking number)
- ✅ Shipping carrier selection
- ✅ Pagination
- ✅ Order status badges
- ✅ Fulfillment status badges

**Differences:**
- Context: `BusinessSwitcher` vs `NonprofitSwitcher`
- Order types: Nonprofits include "donation" type
- Filter options: Nonprofits show "donation" in order type filter
- Entity type: `entityType: "business"` vs `entityType: "nonprofit"`
- Mock data: Different sample orders

**Code Duplication:** ~98% identical (only context and order type filter differs)

---

### 1.3 Invoices Management ✅ **IDENTICAL FUNCTIONALITY**

**Current Implementation:**
- `app/pages/merchant/invoices/index.tsx` (428 lines)
- `app/pages/nonprofit/invoices/index.tsx` (MISSING - needs to be created)

**Shared Features:**
- ✅ Invoice listing
- ✅ Search by invoice number or recipient
- ✅ Filter by status (draft, sent, paid, overdue)
- ✅ Filter by type (one-time, recurring)
- ✅ Create invoice button
- ✅ Use template button
- ✅ Invoice count display
- ✅ Invoice cards with status badges
- ✅ View, Edit, Send/Resend actions
- ✅ Recurring invoice indicators

**Differences:**
- Context: Business context vs Nonprofit context
- Route params: `type=business` vs `type=nonprofit`
- Issuer type: `issuerType: "business"` vs `issuerType: "nonprofit"`

**Code Duplication:** ~100% identical (nonprofit version doesn't exist yet)

**Templates:**
- `app/pages/merchant/invoices/templates.tsx` (exists)
- `app/pages/nonprofit/invoices/templates.tsx` (461 lines) - Nearly identical

---

### 1.4 Payment Processing ✅ **ALREADY SHARED**

**Current Implementation:**
- `lib/payment-processing.ts` (149 lines)

**Status:** ✅ **Already optimized** - Single shared utility handles both business and nonprofit payments

**Features:**
- ✅ Unified payment processing function
- ✅ Platform fee calculation (5% for BDN+ Business, 10% standard)
- ✅ Entity type parameter (`"business" | "nonprofit"`)
- ✅ Fee breakdown calculation

---

## 2. Type Definitions Analysis

### 2.1 Orders Types ✅ **ALREADY UNIFIED**

**File:** `types/orders.ts`

**Status:** ✅ **Already optimized** - Single type definition supports both entities

```typescript
export interface Order {
  entityId: string; // Business or nonprofit ID
  entityType: "business" | "nonprofit";
  orderType: OrderType; // Includes "donation" for nonprofits
  // ... rest of fields
}
```

---

### 2.2 Invoice Types ✅ **ALREADY UNIFIED**

**File:** `types/invoices.ts`

**Status:** ✅ **Already optimized** - Single type definition supports both entities

```typescript
export interface Invoice {
  issuerId: string; // Business or Nonprofit ID
  issuerType: "business" | "nonprofit";
  // ... rest of fields
}
```

---

### 2.3 Product Types ✅ **ALREADY UNIFIED**

**File:** `types/merchant.ts`

**Status:** ✅ **Already optimized** - Single type definition (uses `merchantId` which can be business or nonprofit ID)

**Note:** Consider renaming `merchantId` to `entityId` for clarity, but this is a breaking change.

---

## 3. Inconsistencies Found

### 3.1 Missing Nonprofit Invoice List Page

**Issue:** Nonprofit invoice management page doesn't exist
- ✅ Templates page exists: `app/pages/nonprofit/invoices/templates.tsx`
- ❌ List page missing: `app/pages/nonprofit/invoices/index.tsx`

**Impact:** Nonprofits cannot view/manage their invoices

**Solution:** Create shared invoice list component

---

### 3.2 Context Usage Inconsistency

**Issue:** Different context hooks used:
- Businesses: `useBusiness()` → `selectedBusiness`
- Nonprofits: `useNonprofit()` → `selectedNonprofit`

**Impact:** Cannot easily create shared components without abstraction

**Solution:** Create unified entity context hook or use entity type parameter

---

### 3.3 Route Parameter Inconsistency

**Issue:** Different route patterns:
- Products: `/pages/products/create?type=merchant` vs `?type=nonprofit`
- Invoices: `/pages/invoices/create?type=business` vs `?type=nonprofit`

**Impact:** Inconsistent user experience

**Solution:** Standardize on `entityType` parameter

---

## 4. Refactoring Opportunities

### 4.1 Products List Component (HIGH PRIORITY)

**Current State:**
- 2 separate files: ~1,083 lines total
- 95% code duplication

**Proposed Solution:**

```typescript
// components/products/ProductList.tsx (Shared Component)
interface ProductListProps {
  entityType: "business" | "nonprofit";
  entityId?: string;
  onProductSelect?: (product: Product) => void;
}

// app/pages/products/list.tsx (Shared Page)
// Uses ProductList component with entityType from route params

// app/pages/merchant/products.tsx (Thin Wrapper)
// Redirects to /pages/products/list?entityType=business

// app/pages/nonprofit/products.tsx (Thin Wrapper)
// Redirects to /pages/products/list?entityType=nonprofit
```

**Benefits:**
- Eliminates ~1,000 lines of duplicate code
- Single source of truth for product listing
- Consistent UI/UX across entities
- Easier maintenance

**Estimated Impact:** -1,000 lines, +200 lines (shared component)

---

### 4.2 Orders Fulfillment Component (HIGH PRIORITY)

**Current State:**
- 2 separate files: ~2,232 lines total
- 98% code duplication

**Proposed Solution:**

```typescript
// components/orders/OrderFulfillment.tsx (Shared Component)
interface OrderFulfillmentProps {
  entityType: "business" | "nonprofit";
  entityId?: string;
  allowedOrderTypes?: OrderType[]; // Nonprofits can filter to exclude certain types
}

// app/pages/orders/fulfillment.tsx (Shared Page)
// Uses OrderFulfillment component with entityType from route params

// app/pages/merchant/orders.tsx (Thin Wrapper)
// Redirects to /pages/orders/fulfillment?entityType=business

// app/pages/nonprofit/orders.tsx (Thin Wrapper)
// Redirects to /pages/orders/fulfillment?entityType=nonprofit
```

**Benefits:**
- Eliminates ~2,000 lines of duplicate code
- Single source of truth for order management
- Consistent fulfillment workflow
- Easier to add new order types

**Estimated Impact:** -2,000 lines, +250 lines (shared component)

---

### 4.3 Invoices Management Component (HIGH PRIORITY)

**Current State:**
- 1 file exists: `app/pages/merchant/invoices/index.tsx` (428 lines)
- 1 file missing: `app/pages/nonprofit/invoices/index.tsx`
- Templates: 2 nearly identical files (~460 lines each)

**Proposed Solution:**

```typescript
// components/invoices/InvoiceList.tsx (Shared Component)
interface InvoiceListProps {
  entityType: "business" | "nonprofit";
  entityId?: string;
}

// app/pages/invoices/index.tsx (Shared Page)
// Uses InvoiceList component with entityType from route params

// app/pages/merchant/invoices/index.tsx (Thin Wrapper)
// Redirects to /pages/invoices?entityType=business

// app/pages/nonprofit/invoices/index.tsx (Thin Wrapper)
// Redirects to /pages/invoices?entityType=nonprofit

// app/pages/invoices/templates.tsx (Shared Templates Page)
// Handles both business and nonprofit templates
```

**Benefits:**
- Creates missing nonprofit invoice page
- Eliminates ~900 lines of duplicate code
- Single source of truth for invoice management
- Consistent invoice workflow

**Estimated Impact:** -900 lines, +300 lines (shared components)

---

### 4.4 Entity Switcher Abstraction (MEDIUM PRIORITY)

**Current State:**
- `BusinessSwitcher` component
- `NonprofitSwitcher` component
- Similar functionality, different implementations

**Proposed Solution:**

```typescript
// components/EntitySwitcher.tsx (Unified Component)
interface EntitySwitcherProps {
  entityType: "business" | "nonprofit";
  selectedEntityId?: string;
  onEntitySelect: (entityId: string) => void;
}

// Uses BusinessContext or NonprofitContext based on entityType
```

**Benefits:**
- Single switcher component
- Consistent UI/UX
- Easier to maintain

**Estimated Impact:** -100 lines, +150 lines (shared component)

---

## 5. Implementation Plan

### Phase 1: Products (Week 1)
1. ✅ Create `components/products/ProductList.tsx`
2. ✅ Create `app/pages/products/list.tsx` (shared page)
3. ✅ Update merchant route to use shared component
4. ✅ Update nonprofit route to use shared component
5. ✅ Test both entity types

**Estimated Time:** 4-6 hours

---

### Phase 2: Orders (Week 1-2)
1. ✅ Create `components/orders/OrderFulfillment.tsx`
2. ✅ Create `app/pages/orders/fulfillment.tsx` (shared page)
3. ✅ Update merchant route to use shared component
4. ✅ Update nonprofit route to use shared component
5. ✅ Test order fulfillment for both entity types

**Estimated Time:** 6-8 hours

---

### Phase 3: Invoices (Week 2)
1. ✅ Create `components/invoices/InvoiceList.tsx`
2. ✅ Create `app/pages/invoices/index.tsx` (shared page)
3. ✅ Create `app/pages/invoices/templates.tsx` (shared templates)
4. ✅ Update merchant routes to use shared components
5. ✅ Create nonprofit routes using shared components
6. ✅ Test invoice management for both entity types

**Estimated Time:** 6-8 hours

---

### Phase 4: Entity Switcher (Week 2-3)
1. ✅ Create `components/EntitySwitcher.tsx`
2. ✅ Update all pages to use unified switcher
3. ✅ Test entity switching

**Estimated Time:** 2-4 hours

---

## 6. Code Reduction Summary

| Feature | Current Lines | After Refactoring | Reduction |
|---------|--------------|-------------------|-----------|
| Products | 1,083 | ~200 | -883 lines |
| Orders | 2,232 | ~250 | -1,982 lines |
| Invoices | 900 | ~300 | -600 lines |
| **Total** | **4,215** | **~750** | **-3,465 lines** |

**Net Reduction:** ~3,465 lines of duplicate code eliminated

---

## 7. Best Practices from Context7

Based on React Native best practices:

1. **Component Composition:** Use props to customize behavior rather than duplicating components
2. **Type Safety:** Leverage TypeScript union types (`"business" | "nonprofit"`) for entity types
3. **Context Abstraction:** Create unified hooks that abstract entity-specific contexts
4. **Route Parameters:** Use consistent parameter naming (`entityType` instead of `type`)

---

## 8. Testing Strategy

### Unit Tests
- Test shared components with both entity types
- Test entity-specific filtering (e.g., donation orders for nonprofits)

### Integration Tests
- Test product CRUD operations for both entities
- Test order fulfillment workflow for both entities
- Test invoice creation and management for both entities

### E2E Tests
- Test complete product → order → invoice flow for businesses
- Test complete product → order → invoice flow for nonprofits

---

## 9. Migration Strategy

### Step 1: Create Shared Components (Non-Breaking)
- Create new shared components alongside existing ones
- No changes to existing routes initially

### Step 2: Update Routes (Gradual Migration)
- Update one route at a time
- Test thoroughly before moving to next route
- Keep old routes as fallback during transition

### Step 3: Remove Duplicate Code (Cleanup)
- Once all routes migrated, remove duplicate files
- Update all references

---

## 10. Risk Assessment

### Low Risk ✅
- Products refactoring (already have shared create component)
- Payment processing (already unified)

### Medium Risk ⚠️
- Orders refactoring (complex state management)
- Entity switcher abstraction (context dependencies)

### High Risk 🔴
- Invoice refactoring (nonprofit page doesn't exist - need to create from scratch)

---

## 11. Success Metrics

- [ ] Code reduction: -3,465 lines achieved
- [ ] All features work identically for both entities
- [ ] No regression in existing functionality
- [ ] Consistent UI/UX across entities
- [ ] Improved maintainability (single source of truth)

---

## 12. Next Steps

1. **Review this analysis** with team
2. **Prioritize phases** based on business needs
3. **Create shared components** starting with Products (lowest risk)
4. **Test thoroughly** before moving to next phase
5. **Document** any entity-specific customizations needed

---

## Appendix: File Structure After Refactoring

```
app/pages/
├── products/
│   ├── list.tsx (shared)
│   ├── create.tsx (already shared)
│   └── bulk-upload.tsx (already shared)
├── orders/
│   └── fulfillment.tsx (shared)
├── invoices/
│   ├── index.tsx (shared)
│   ├── create.tsx (shared)
│   └── templates.tsx (shared)
├── merchant/
│   ├── products.tsx → redirects to /pages/products/list?entityType=business
│   ├── orders.tsx → redirects to /pages/orders/fulfillment?entityType=business
│   └── invoices/
│       └── index.tsx → redirects to /pages/invoices?entityType=business
└── nonprofit/
    ├── products.tsx → redirects to /pages/products/list?entityType=nonprofit
    ├── orders.tsx → redirects to /pages/orders/fulfillment?entityType=nonprofit
    └── invoices/
        └── index.tsx → redirects to /pages/invoices?entityType=nonprofit

components/
├── products/
│   └── ProductList.tsx (shared)
├── orders/
│   └── OrderFulfillment.tsx (shared)
├── invoices/
│   └── InvoiceList.tsx (shared)
└── EntitySwitcher.tsx (shared)
```

---

**Document Status:** ✅ Complete - Ready for Implementation Review
