# ScrollView Tab Bar Overlap Fix

## Problem
Content in ScrollViews was overlapping with the bottom tab bar on mobile devices, making the bottom content invisible and causing scrolling issues.

## Root Cause
- Tab bar has a total height of **86px** (56px tab bar + 30px bottom padding)
- Many ScrollViews were using `paddingBottom: 40`, which was insufficient
- The layout wrapper had `paddingBottom: 86` but ScrollView `contentContainerStyle` was overriding it

## Solution

### 1. Created Layout Constants (`constants/layout.ts`)
- Centralized tab bar height constants
- Created `getScrollViewBottomPadding()` helper function
- Returns proper padding: **126px on mobile** (86px tab bar + 40px extra), **40px on desktop**

### 2. Updated `useResponsive` Hook
- Added `scrollViewBottomPadding` to the hook return values
- Automatically calculates correct padding based on screen size
- Can be used directly: `const { scrollViewBottomPadding } = useResponsive();`

### 3. Updated Pages
Updated the following pages to use the new padding:
- `app/pages/merchant/dashboard.tsx`
- `app/pages/nonprofit/dashboard.tsx`
- `app/pages/nonprofit/campaigns/[id].tsx`

## How to Apply to Other Pages

### Pattern:
```tsx
// 1. Import useResponsive (if not already imported)
import { useResponsive } from "../../../hooks/useResponsive";

// 2. Destructure scrollViewBottomPadding
const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();

// 3. Use in ScrollView contentContainerStyle
<ScrollView
  contentContainerStyle={{
    paddingHorizontal: paddingHorizontal,
    paddingTop: Platform.OS === "web" ? 20 : 36,
    paddingBottom: scrollViewBottomPadding, // ← Use this instead of hardcoded 40
  }}
>
```

### Files That Need Updating
All files in `app/pages/` that use `paddingBottom: 40` in ScrollView `contentContainerStyle`:
- `app/pages/nonprofit/campaigns/create.tsx`
- `app/pages/nonprofit/campaigns.tsx`
- `app/pages/tokens.tsx`
- `app/pages/payments/buy-gift-card.tsx`
- `app/pages/university/videos/[id].tsx`
- `app/pages/merchant/qrcode.tsx`
- `app/pages/merchant/verify-black-owned.tsx`
- `app/pages/notifications/index.tsx`
- `app/pages/payments/c2b-payment.tsx`
- `app/pages/businesses/[id].tsx`
- `app/pages/payments/token-purchase.tsx`
- `app/pages/transactions.tsx`
- `app/pages/nonprofit/onboarding.tsx`
- `app/pages/merchant/onboarding.tsx`
- `app/pages/bdn-plus.tsx`
- `app/pages/nonprofit/settings.tsx`
- `app/pages/merchant/settings.tsx`
- `app/pages/notifications/settings.tsx`
- `app/pages/university/videos.tsx`
- And any other pages with ScrollView

## Testing
- Test on mobile devices/simulators
- Verify content scrolls properly and bottom content is visible
- Check that tab bar doesn't overlap content
- Ensure desktop view still works correctly (no extra padding)

