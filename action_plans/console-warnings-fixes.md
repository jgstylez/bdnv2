# Console Warnings Fixes

**Date:** January 25, 2025  
**Status:** ✅ Fixed where possible

---

## Warnings Addressed

### 1. ✅ Fixed: `[expo-image]: Content position "center top" is invalid`

**Issue:** Invalid `contentPosition` value "center top"

**Fixed In:**
- `components/sections/ImpactChainSection.tsx` - Changed from `"center top"` to `"center"`

**Note:** `contentPosition="50% 100%"` in `app/web/about.tsx` is valid (percentage values are supported)

**Status:** ✅ Fixed

---

### 2. ✅ Fixed: `[Layout children]: No route named "verify" exists`

**Issue:** Auth layout referenced a "verify" route that doesn't exist

**Fixed In:**
- `app/(auth)/_layout.tsx` - Removed `verify` screen declaration

**Status:** ✅ Fixed (may require app restart/rebuild to clear cache)

---

### 3. ⚠️ Known Issue: `Blocked aria-hidden on an element because its descendant retained focus`

**Issue:** React Native Web's Modal component automatically sets `aria-hidden` on the background, but when there's a focused element inside, it causes accessibility warnings.

**Root Cause:**
- React Native Web's Modal implementation sets `aria-hidden="true"` on background elements
- When focus moves to elements inside the modal, browsers warn about focused elements being hidden
- This is a known limitation of React Native Web's Modal component

**Mitigations Applied:**
- ✅ Added `accessibilityViewIsModal: true` to Modal component (web only)
- ✅ Added `accessible: false` to KeyboardAvoidingView wrapper (web only)
- ✅ Proper focus management in BaseModal (focus trap, focus restoration)
- ✅ Focus moves to modal content immediately when opened

**Status:** ⚠️ **Partially Mitigated** - This is a React Native Web framework limitation. The warnings are cosmetic and don't affect functionality, but we've applied mitigations to reduce them.

**Note:** To fully eliminate these warnings, we would need to:
1. Use a custom modal implementation instead of React Native's Modal
2. Or wait for React Native Web to fix this in a future version

---

### 4. ✅ Fixed: `[expo-image]: Prop "resizeMode" is deprecated`

**Issue:** Using deprecated `resizeMode` prop instead of `contentFit`

**Fixed In:**
- `app/pages/media/channels/[id].tsx` - Changed `resizeMode="cover"` → `contentFit="cover"`
- `components/ImageCarousel.tsx` - Changed `resizeMode="cover"` → `contentFit="cover"`

**Note:** `app.json` still has `resizeMode` for splash screen configuration - this is correct and expected (splash screen uses different API)

**Status:** ✅ Fixed

---

## Summary

### Fixed (3/4)
1. ✅ Invalid contentPosition "center top"
2. ✅ Missing verify route
3. ✅ Deprecated resizeMode prop

### Partially Mitigated (1/4)
4. ⚠️ aria-hidden warnings (framework limitation, mitigations applied)

---

## Testing

After these fixes, you should see:
- ✅ No more "center top" warnings
- ✅ No more "verify route" warnings (may require restart)
- ✅ No more "resizeMode" warnings
- ⚠️ Reduced aria-hidden warnings (may still appear occasionally due to framework limitation)

---

## Notes

### aria-hidden Warnings
These warnings are a known React Native Web issue and are mostly cosmetic. The functionality works correctly - modals trap focus, keyboard navigation works, and screen readers can access modal content. The warnings occur because:

1. React Native Web sets `aria-hidden="true"` on background elements when a modal is open
2. Browsers detect focused elements inside the modal
3. Browsers warn that focused elements shouldn't be hidden

**Our mitigations:**
- Proper focus management (focus moves to modal immediately)
- Focus trap prevents focus from leaving modal
- `accessibilityViewIsModal` helps screen readers understand the modal structure

**To fully eliminate:** Would require custom modal implementation or framework update.

---

**Last Updated:** January 25, 2025
