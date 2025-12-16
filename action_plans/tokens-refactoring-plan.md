# Tokens.tsx Refactoring Plan

**File:** `app/pages/tokens.tsx`  
**Current Size:** 2,771 lines  
**Target:** Break into smaller components (<400 LOC each)

---

## Current Structure Analysis

The `tokens.tsx` file contains:

1. **Token Balance Display** (~200 lines)
   - Total tokens display
   - Balance card with SVG graphics
   - Certificate download/view buttons

2. **Token Purchase Form** (~400 lines)
   - One-time purchase form
   - Recurring purchase form
   - Purchase type selector
   - Frequency selector
   - Amount input

3. **Token Purchase History** (~300 lines)
   - List of past purchases
   - Purchase cards
   - Status indicators

4. **Token Ledger/History** (~300 lines)
   - Transaction history
   - Balance changes
   - Transaction types (purchase, reward, usage)

5. **Certificate Component** (~500 lines)
   - SVG certificate generation
   - Certificate modal
   - Download functionality

6. **Recurring Purchase Management** (~400 lines)
   - Edit recurring purchase
   - Cancel recurring purchase
   - Confirmation modals

7. **Modals** (~200 lines)
   - Certificate modal
   - Recurring purchase confirmation
   - Various other modals

8. **State Management** (~100 lines)
   - Multiple useState hooks
   - Form state
   - Modal state

---

## Refactoring Strategy

### Phase 1: Extract Major Components (Priority)

1. **`components/tokens/TokenBalance.tsx`**
   - Display total tokens
   - Balance card UI
   - Certificate buttons
   - **Estimated:** ~200 lines

2. **`components/tokens/TokenPurchaseForm.tsx`**
   - Purchase type selector
   - Amount input
   - Frequency selector
   - Purchase button
   - **Estimated:** ~300 lines

3. **`components/tokens/TokenCertificate.tsx`**
   - SVG certificate component
   - Certificate modal
   - Download functionality
   - **Estimated:** ~400 lines

### Phase 2: Extract Supporting Components

4. **`components/tokens/TokenPurchaseHistory.tsx`**
   - Purchase list
   - Purchase cards
   - **Estimated:** ~250 lines

5. **`components/tokens/TokenLedger.tsx`**
   - Transaction history
   - Ledger entries
   - **Estimated:** ~250 lines

6. **`components/tokens/RecurringPurchaseManager.tsx`**
   - Recurring purchase display
   - Edit functionality
   - Cancel functionality
   - **Estimated:** ~300 lines

### Phase 3: Extract Hooks and Utilities

7. **`hooks/useTokenBalance.ts`**
   - Token balance calculation
   - Balance state management

8. **`hooks/useTokenPurchase.ts`**
   - Purchase form state
   - Purchase logic

9. **`hooks/useRecurringPurchase.ts`**
   - Recurring purchase state
   - Recurring purchase logic

---

## Component Structure

```
components/tokens/
├── TokenBalance.tsx
├── TokenPurchaseForm.tsx
├── TokenPurchaseHistory.tsx
├── TokenLedger.tsx
├── TokenCertificate.tsx
├── RecurringPurchaseManager.tsx
└── index.ts (exports)

hooks/
├── useTokenBalance.ts
├── useTokenPurchase.ts
└── useRecurringPurchase.ts
```

---

## Implementation Steps

1. ✅ Create refactoring plan
2. Create `components/tokens/` directory
3. Extract TokenBalance component
4. Extract TokenPurchaseForm component
5. Extract TokenCertificate component
6. Extract remaining components
7. Create custom hooks
8. Update main tokens.tsx to use new components
9. Test all functionality
10. Remove old code

---

## Benefits

- **Maintainability:** Smaller, focused components
- **Reusability:** Components can be used elsewhere
- **Testability:** Easier to test individual components
- **Performance:** Better code splitting opportunities
- **Readability:** Clear separation of concerns

---

## Notes

- Keep all existing functionality
- Maintain same UI/UX
- Preserve all state management
- Keep mock data structure (will be replaced with API later)
- Ensure responsive design is maintained

---

**Status:** Planning Complete - Ready for Implementation  
**Last Updated:** 2025-01-XX

