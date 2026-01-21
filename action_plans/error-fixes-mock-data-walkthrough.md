---
name: Error Fixes and Mock Data for Walkthrough
overview: Fix all site errors, add comprehensive mock data and images, and resolve routing/touch issues to enable a smooth, error-free app walkthrough recording.
todos:
  - id: nav-guards
    content: Verify and strengthen navigation guards in CustomTabBar, MenuPanel, and Sidebar to prevent duplicate navigation calls and freezing
    status: completed
  - id: scrollview-optimization
    content: Replace all ScrollViews with OptimizedScrollView or add required performance props (scrollEventThrottle, nestedScrollEnabled, bounces, paddingBottom)
    status: completed
  - id: touchable-optimization
    content: Ensure all TouchableOpacity components have proper activeOpacity, hitSlop, and accessibility props
    status: completed
  - id: tabbar-overlap
    content: Verify all ScrollViews use scrollViewBottomPadding from useResponsive hook to prevent tab bar overlap
    status: completed
  - id: mock-products
    content: Create comprehensive mock product data in data/mocks/products.ts with images for all categories
    status: completed
  - id: mock-businesses
    content: Create comprehensive mock business data in data/mocks/businesses.ts with images, menus, and reviews
    status: completed
  - id: mock-images
    content: Add imageUrl to all campaigns, organizations, and businesses that currently have null images
    status: completed
  - id: shopping-flow
    content: "Test and fix shopping flow: Marketplace → Product → Cart → Checkout → Success with complete mock data"
    status: completed
  - id: payment-flows
    content: Ensure all payment flows (C2B, BLKD, Gift Cards) have complete mock data and work end-to-end
    status: completed
  - id: error-handling
    content: Add error handling for missing data, image load failures, and navigation errors with proper fallbacks
    status: completed
  - id: typescript-errors
    content: Fix any remaining TypeScript errors and verify all pages compile without errors
    status: completed
  - id: console-cleanup
    content: Remove or replace console.log statements and clean up debug code
    status: completed
  - id: header-title-fix
    content: Fix AppHeader to display page titles on desktop - PageTitle component needs title prop and getPageTitle() function based on pathname
    status: completed
  - id: header-responsive-fix
    content: Fix AppHeader mobile responsiveness - use useResponsive hook for padding instead of fixed spacing, ensure proper layout on mobile vs desktop
    status: completed
  - id: pagetitle-bug-fix
    content: Fix PageTitle component missing return statement bug
    status: completed
  - id: marketplace-image-fix
    content: Fix marketplace.tsx to use expo-image Image component instead of React Native Image for proper image loading
    status: completed
  - id: add-more-products
    content: Add more products to marketplace mockProducts array (currently only 8, need at least 20-30 for good walkthrough)
    status: completed
  - id: text-contrast-fix
    content: Fix text contrast issues throughout app - ensure success, accent, and other colored text meet WCAG AA contrast ratios (4.5:1) on dark backgrounds
    status: completed
  - id: router-push-finally-bug
    content: CRITICAL - Fix CustomTabBar router.push().finally() error - router.push() doesn't return Promise, use setTimeout or pathname effect instead
    status: completed
---

# Error Fixes and Mock Data for Walkthrough

## Overview

This plan addresses three critical areas: fixing site errors, adding comprehensive mock data/images, and resolving routing/touch issues (the primary concern).

---

## 1. Routing/Touch Issues (HIGHEST PRIORITY)

### 1.1 Navigation Guards Verification

**Files to check/update:**

- `components/CustomTabBar.tsx` - **CRITICAL BUG:** `router.push().finally()` causes error - router.push() doesn't return Promise
- `components/MenuPanel.tsx` - Already has guards, uses pathname effect (correct approach)
- `components/Sidebar.tsx` - Has incorrect `.catch()` on router.push() - needs fix
- `app/pages/_layout.tsx` - Verify tab bar state calculation

**Actions:**

- **CRITICAL:** Fix `CustomTabBar.tsx` line 134 - remove `.finally()`, use `setTimeout` or pathname effect instead
- Fix `Sidebar.tsx` line 370 - remove `.catch()` on router.push()
- Ensure all navigation handlers check `navigatingRef.current` before proceeding
- Verify pathname change detection properly resets navigation flags
- Add timeout fallback for navigation flag reset (in case pathname doesn't change)
- Test rapid clicking scenarios

**Fix Pattern (from MenuPanel):**

```typescript
// Set navigating flag
navigatingRef.current = true;

// Navigate (router.push is synchronous, doesn't return Promise)
router.push(href as any);

// Reset flag after delay OR use pathname change effect
setTimeout(() => {
  navigatingRef.current = false;
}, 300);
```

### 1.2 ScrollView Optimization

**Problem:** Many ScrollViews missing performance optimizations causing touch conflicts

**Files to update:**

- Replace all ScrollView instances with `OptimizedScrollView` OR add required props:
- `scrollEventThrottle={16}`
- `nestedScrollEnabled={Platform.OS === 'android'}`
- `bounces={Platform.OS !== 'web'}`
- `showsVerticalScrollIndicator={false}`
- Proper `paddingBottom` using `scrollViewBottomPadding` from `useResponsive`

**Key files needing updates:**

- `app/pages/cart.tsx` - Already optimized ✓
- `app/pages/checkout.tsx` - Already optimized ✓
- `app/pages/products/[id].tsx` - Check and optimize
- `app/pages/businesses/[id].tsx` - Check and optimize
- `app/(tabs)/marketplace.tsx` - Check and optimize
- All pages in `app/pages/` with ScrollView

### 1.3 Touchable Component Optimization

**Problem:** Inconsistent touch feedback and small hit targets

**Solution:**

- Use `OptimizedTouchable` component OR ensure all TouchableOpacity have:
- `activeOpacity={0.7}`
- `hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}`
- Proper accessibility props

**Files to check:**

- All navigation buttons
- All product cards
- All menu items
- All form buttons

### 1.4 Tab Bar Overlap Fix

**Problem:** Content overlapping with tab bar on mobile

**Solution:**

- Ensure all ScrollViews use `scrollViewBottomPadding` from `useResponsive` hook
- Verify `constants/layout.ts` has correct tab bar height constants

### 1.5 Header Title Display Fix (CRITICAL)

**Problem:** AppHeader not displaying page titles, especially on desktop

**Issues Found:**

1. `PageTitle` component called without required `title` prop in `AppHeader.tsx`
2. Missing `getPageTitle()` function to determine title from pathname (like AdminHeader/DeveloperHeader have)
3. `PageTitle` component missing `return` statement (syntax bug)

**Files to fix:**

- `components/AppHeader.tsx` - Add `getPageTitle()` function and pass title to PageTitle
- `components/header/PageTitle.tsx` - Fix missing return statement

**Solution:**

- Create `getPageTitle()` function in AppHeader that maps pathname to page title
- Pass title prop to PageTitle component
- Show title on desktop, optionally hide on mobile (or show differently)
- Fix PageTitle component return statement

### 1.6 Header Mobile Responsiveness Fix (CRITICAL)

**Problem:** Header not responsive - using fixed padding instead of responsive values

**Issues Found:**

1. `AppHeader.tsx` uses `spacing["2xl"] `(fixed 40px) instead of `useResponsive().paddingHorizontal`
2. Header layout may need adjustments for mobile vs desktop
3. PageTitle visibility may need to be conditional (desktop only or different layout)

**Files to fix:**

- `components/AppHeader.tsx` - Use `useResponsive` hook for padding
- Ensure proper mobile/desktop layout differences

**Solution:**

- Import and use `useResponsive` hook in AppHeader
- Replace `spacing["2xl"] `with `paddingHorizontal` from hook
- Adjust header layout for mobile (may need to hide/show elements differently)
- Ensure SearchBar and other elements adapt to screen size

---

## 2. Mock Data & Images

### 2.1 Centralized Mock Data Structure

**Create/update:** `data/mocks/products.ts`

- Export comprehensive product mock data
- Include products for all categories
- Ensure all products have valid image URLs (Unsplash or similar)
- Include products for different merchants
- **CRITICAL:** Add at least 20-30 products (currently only 8 in marketplace.tsx)

**Fix:** `app/(tabs)/marketplace.tsx`

- Replace React Native `Image` with `expo-image` `Image` component
- Import: `import { Image } from 'expo-image';`
- Use `contentFit="cover"` and `cachePolicy="memory-disk"` props
- This fixes images not displaying in product carousels

**Create/update:** `data/mocks/businesses.ts`

- Export comprehensive business mock data
- Include businesses with images, menus, reviews
- Cover all business categories
- Ensure all businesses have `imageUrl` and `images` array

**Update:** `data/mocks/campaigns.ts`

- Add `imageUrl` for all campaigns (currently null)
- Add more campaign examples

**Update:** `data/mocks/organizations.ts`

- Add `logoUrl` for organizations (currently null)

**Update:** `data/mock.ts`

- Add `imageUrl` for all businesses (currently null)
- Ensure all mock data is exported properly

### 2.2 Image URLs

**Strategy:** Use Unsplash URLs with proper dimensions

- Products: `w=800&h=800&fit=crop`
- Businesses: `w=800&h=600&fit=crop`
- Campaigns: `w=800&h=400&fit=crop`
- Carousels: `w=800&h=400&fit=crop`

**Files to update with images:**

- `data/mock.ts` - All businesses need `imageUrl`
- `data/mocks/campaigns.ts` - All campaigns need `imageUrl`
- `data/mocks/organizations.ts` - Organizations need `logoUrl`
- `app/pages/payments/c2b-payment.tsx` - Businesses need `imageUrl`

### 2.3 User Flow Mock Data

**Shopping Flow:**

- Products in marketplace → Product detail → Add to cart → Cart → Checkout → Success
- Ensure products have: images, descriptions, prices, shipping info
- Ensure cart can handle multiple products from different merchants

**Payment Flow:**

- C2B payment: Businesses with images and names
- BLKD purchase: Mock wallet data
- Gift cards: Mock gift card types

**Business Discovery:**

- Search results with images
- Business detail pages with menus, reviews, images

**Merchant Flow:**

- Dashboard with order data
- Products list with images
- Orders with customer info

**Nonprofit Flow:**

- Campaigns with images
- Donation history
- Organization info

---

## 3. Error Fixes

### 3.1 TypeScript Errors

**Status:** Most fixed according to `codebase-error-review.md`

**Remaining checks:**

- Verify no new TypeScript errors introduced
- Check `app/admin/*` pages for any remaining errors
- Ensure all theme color access uses correct structure

### 3.2 Runtime Errors

**Missing Data Errors:**

- Add null checks for missing products/businesses
- Add error boundaries for failed image loads
- Add fallback UI for empty states

**Navigation Errors:**

- Ensure all routes exist
- Add 404 handling for invalid routes
- Verify back button navigation works correctly

**API Client Errors:**

- Verify `lib/api-client.ts` exists and is properly exported
- Ensure all API calls have error handling

### 3.3 Console Errors

**Cleanup:**

- Remove or replace `console.log` statements with proper logger
- Remove debug statements
- Clean up TODO comments (or document them properly)

### 3.4 Text Contrast Issues (Accessibility)

**Problem:** Text colors don't meet WCAG AA contrast requirements on dark backgrounds

**Issues Found:**

1. Success text (`#4bb858` green) on dark background (`#232323`) - may not meet 4.5:1 contrast ratio
2. Accent text (`#ba9988` brown) on dark backgrounds - needs verification
3. Other status colors (error, warning, info) need contrast verification
4. Text on card backgrounds (`#474747`) needs verification

**WCAG Requirements:**

- Normal text: Minimum 4.5:1 contrast ratio
- Large text (18pt+ or 14pt+ bold): Minimum 3:1 contrast ratio

**Files to check/fix:**

- `constants/theme.ts` - Update color values for better contrast
- All components using `text-success`, `text-accent`, `text-error`, etc.
- Components with colored text on dark backgrounds

**Solution:**

- Use lighter shades of success/error/warning colors for text on dark backgrounds
- Consider using `colors.status.successLight` or similar for better contrast
- Or use white/light text with colored backgrounds instead
- Add contrast-safe text color variants to theme

**Examples to fix:**

- `components/dashboard/RecentActivity.tsx` - `text-success` class
- All components showing amounts with `+$100.00` in green
- Status indicators throughout the app

---

## 4. User Flow Completeness

### 4.1 Shopping Flow

**Path:** Marketplace → Product Detail → Cart → Checkout → Success

**Requirements:**

- ✅ Cart page has back button
- ✅ Checkout page has back button
- ✅ Checkout success navigates to transactions
- ✅ Products have images
- ✅ Cart shows product images
- ✅ Checkout shows order summary

**Missing/To Fix:**

- Ensure all products in marketplace have images
- Verify cart can handle empty state
- Verify checkout handles empty cart
- Ensure payment processing shows success state

### 4.2 Payment Flows

**C2B Payment:**

- Businesses have images
- Payment processing shows success
- Navigation works correctly

**BLKD Purchase:**

- Wallet data is mocked
- Purchase flow completes successfully

**Gift Cards:**

- Gift card types are mocked
- Purchase flow works

### 4.3 Business Discovery

**Search → Business Detail:**

- Search results show businesses with images
- Business detail page loads correctly
- Back button works
- Menu displays correctly

### 4.4 Navigation Flows

**Tab Navigation:**

- All tabs navigate correctly
- Tab bar shows correct active state
- No freezing on rapid clicks

**Menu Navigation:**

- Menu panel opens/closes smoothly
- All menu items navigate correctly
- No duplicate navigation calls

**Back Navigation:**

- All pages have proper back buttons
- Back navigation works correctly
- No navigation loops

---

## 5. Implementation Priority

### Phase 1: Critical (Routing/Touch + Header)

1. **CRITICAL:** Fix CustomTabBar router.push().finally() error (causing runtime crashes)
2. Fix Sidebar router.push().catch() error
3. Fix AppHeader title display and mobile responsiveness (HIGH PRIORITY)
4. Fix PageTitle component return statement bug
5. Verify and fix navigation guards (use correct pattern)
6. Replace ScrollViews with OptimizedScrollView or add props
7. Fix tab bar overlap issues
8. Test rapid clicking scenarios

### Phase 2: Mock Data & Images

1. Fix marketplace Image component (use expo-image)
2. Add more products to marketplace (20-30 minimum)
3. Create centralized mock data files
4. Add images to all businesses, products, campaigns
5. Ensure all user flows have complete mock data
6. Test each user flow end-to-end

### Phase 3: Error Fixes & Accessibility

1. Fix remaining TypeScript errors
2. Add error handling for missing data
3. Add null checks and fallbacks
4. Clean up console errors
5. Fix text contrast issues (WCAG AA compliance)

### Phase 4: Testing & Polish

1. Test all navigation flows
2. Test all user flows
3. Verify no console errors
4. Verify smooth touch interactions
5. Test on mobile and web

---

## 6. Key Files to Modify

**Navigation/Touch:**

- `components/CustomTabBar.tsx`
- `components/MenuPanel.tsx`
- `components/Sidebar.tsx`
- `app/pages/_layout.tsx`
- `components/optimized/OptimizedScrollView.tsx` (verify usage)
- All pages with ScrollView

**Header Fixes:**

- `components/AppHeader.tsx` - Add getPageTitle() and use responsive padding
- `components/header/PageTitle.tsx` - Fix missing return statement

**Mock Data:**

- `data/mocks/products.ts` (create)
- `data/mocks/businesses.ts` (create)
- `data/mocks/campaigns.ts` (update)
- `data/mocks/organizations.ts` (update)
- `data/mock.ts` (update)
- `app/pages/payments/c2b-payment.tsx` (update businesses)
- `app/(tabs)/marketplace.tsx` (fix Image import, add more products)

**Error Handling:**

- All product detail pages
- All business detail pages
- All checkout/payment pages
- `lib/api-client.ts` (verify exists)

---

## 7. Testing Checklist

**Navigation:**

- [ ] No runtime errors from router.push() calls
- [ ] Rapid tab clicking doesn't freeze
- [ ] Menu navigation works smoothly
- [ ] Back buttons work correctly
- [ ] No duplicate navigation calls
- [ ] Tab bar shows correct active state

**Header:**

- [ ] Page titles display correctly on desktop
- [ ] Header is responsive (proper padding on mobile vs desktop)
- [ ] PageTitle component renders correctly (no syntax errors)
- [ ] Header layout adapts to screen size

**Touch/Scroll:**

- [ ] All ScrollViews scroll smoothly
- [ ] No content overlap with tab bar
- [ ] Touch targets are adequate size
- [ ] No touch conflicts on nested ScrollViews

**Mock Data:**

- [ ] All products have images
- [ ] All businesses have images
- [ ] All campaigns have images
- [ ] Marketplace displays product images correctly (using expo-image)
- [ ] Marketplace has enough products (20-30 minimum)
- [ ] Shopping flow works end-to-end
- [ ] Payment flows work end-to-end
- [ ] Business discovery works

**Errors:**

- [ ] No TypeScript errors
- [ ] No runtime errors
- [ ] No console errors
- [ ] Missing data handled gracefully
- [ ] Image load errors handled

**Accessibility:**

- [ ] Text contrast meets WCAG AA standards (4.5:1 for normal text)
- [ ] Success/error/warning text colors readable on dark backgrounds
- [ ] All colored text has sufficient contrast
- [ ] Text on card backgrounds is readable

---

## 8. Success Criteria

✅ **Routing/Touch:**

- No freezing on rapid navigation
- Smooth scrolling on all pages
- No touch conflicts
- Tab bar works correctly

✅ **Mock Data:**

- All user flows have complete data
- All images load correctly
- No missing data errors

✅ **Errors:**

- Zero TypeScript errors
- Zero runtime errors
- Zero console errors
- Graceful error handling

✅ **Accessibility:**

- Text contrast meets WCAG AA standards
- All colored text readable on dark backgrounds
- Success/error/warning indicators have proper contrast

✅ **User Flows:**

- Shopping flow works end-to-end
- Payment flows work
- Business discovery works
- Navigation is smooth and intuitive
