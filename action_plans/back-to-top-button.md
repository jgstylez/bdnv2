# Back-to-Top Button Feature

## Overview

The back-to-top button is a floating action button that appears when users scroll down past 2 screen heights on pages with long content. It provides a quick way to return to the top of the page without manual scrolling.

## Implementation

### Components

1. **`BackToTopButton`** (`components/navigation/BackToTopButton.tsx`)
   - Floating button component with smooth fade-in/fade-out animations
   - Uses `react-native-reanimated` for cross-platform animations
   - Positioned above the tab bar on mobile, bottom-right corner

2. **`OptimizedScrollView`** (`components/optimized/OptimizedScrollView.tsx`)
   - Enhanced ScrollView component with optional back-to-top button integration
   - Handles scroll tracking and button visibility logic

### Usage

To add the back-to-top button to a page, use `OptimizedScrollView` with `showBackToTop={true}`:

```tsx
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

export default function MyPage() {
  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <OptimizedScrollView
        showBackToTop={true}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        {/* Your page content */}
      </OptimizedScrollView>
    </View>
  );
}
```

### Custom Threshold

You can override the default threshold (2 screen heights) if needed:

```tsx
<OptimizedScrollView
  showBackToTop={true}
  backToTopThreshold={1000} // Show button after scrolling 1000px
>
```

## Technical Details

### How It Works

1. **Scroll Tracking**: `OptimizedScrollView` tracks scroll position using React state
2. **Visibility Logic**: Button appears when `scrollOffset > threshold` (default: 2 screen heights)
3. **Hysteresis**: Button hides only when scrolled back up past `threshold - 150px` to prevent flickering
4. **Scroll to Top**: Button calls `scrollViewRef.current.scrollTo({ y: 0, animated: true })`

### iOS-Specific Fix

**Problem**: On iOS native, the button didn't appear when scrolling to the bottom due to bounce/overscroll behavior.

**Solution**: 
- During active scrolling, use the actual `offsetY` value (not clamped), allowing the button to appear even when iOS bounce pushes the offset beyond content height
- Only clamp scroll offset when scrolling ends (`onScrollEndDrag` and `onMomentumScrollEnd`) to capture the final settled position

**Key Code**:
```tsx
// During scrolling - use actual offset (allows iOS bounce detection)
const handleScroll = useCallback((event) => {
  const offsetY = event.nativeEvent.contentOffset.y;
  setScrollOffset(offsetY); // Not clamped during scroll
}, []);

// When scroll ends - clamp to actual scrollable range
const handleScrollEndDrag = useCallback((event) => {
  const offsetY = event.nativeEvent.contentOffset.y;
  const maxScrollY = Math.max(0, contentHeight - layoutHeight);
  const clampedOffsetY = Math.min(Math.max(offsetY, 0), maxScrollY);
  setScrollOffset(clampedOffsetY); // Clamped after scroll ends
}, []);
```

### Cross-Platform Behavior

- **Web**: Button uses `position: fixed` to stay in viewport while scrolling
- **iOS Native**: Handles bounce/overscroll correctly with unclamped scroll tracking
- **Android**: Works with standard scroll tracking

## Pages with Back-to-Top Button

Currently implemented on the following pages (14 total):

### Public Pages
- `app/web/about.tsx`
- `app/web/docs.tsx`
- `app/web/privacy.tsx`
- `app/web/terms.tsx`

### Main App Pages
- `app/(tabs)/dashboard.tsx`
- `app/pages/myimpact/index.tsx`
- `app/pages/businesses/[id].tsx`
- `app/pages/products/[id].tsx`

### University Pages
- `app/pages/university/index.tsx`
- `app/pages/university/blog.tsx`
- `app/pages/university/blog/[id].tsx`
- `app/pages/university/guides.tsx`
- `app/pages/university/guides/[id].tsx`
- `app/pages/university/videos.tsx`

## When to Add Back-to-Top Button

Add `showBackToTop={true}` to pages that:
- Have content exceeding 2 screen heights
- Require significant scrolling to view all content
- Would benefit from quick navigation back to top

**Examples**:
- ✅ Long product/business detail pages
- ✅ Blog posts and articles
- ✅ Documentation pages
- ✅ Dashboard with many sections
- ✅ University/learning content pages
- ❌ Short forms or simple pages
- ❌ Pages with minimal content

## Best Practices

1. **Always use `OptimizedScrollView`** for pages with scrollable content
2. **Enable `showBackToTop`** for pages with content > 2 screen heights
3. **Don't override threshold** unless you have a specific reason
4. **Test on both web and native** to ensure button appears correctly
5. **Ensure proper bottom padding** to prevent button from overlapping content

## Troubleshooting

### Button doesn't appear on iOS
- ✅ **Fixed**: The iOS-specific fix handles bounce/overscroll correctly
- Ensure you're using the latest version of `OptimizedScrollView`
- Check that scroll events are firing (scroll position should update)

### Button flickers when scrolling
- ✅ **Fixed**: Hysteresis logic prevents flickering
- Button shows at threshold, hides at threshold - 150px

### Button position incorrect
- Check that `TAB_BAR_TOTAL_HEIGHT` constant is correct
- Verify `useResponsive` hook returns correct `isMobile` value
- On web, button uses `position: fixed` (should work automatically)

## Pages That Could Benefit from Back-to-Top Button

The following pages use regular `ScrollView` and have long content that could benefit from the back-to-top button:

### Public Pages
- `app/web/features.tsx` - Long features list
- `app/web/blog.tsx` - Blog post listings
- `app/web/security.tsx` - Security information page
- `app/web/careers.tsx` - Job listings (if long)
- `app/web/updates.tsx` - Update listings (if long)

### To Add Back-to-Top Button

1. Replace `ScrollView` with `OptimizedScrollView`
2. Add `showBackToTop={true}` prop
3. Test on both web and native iOS

**Example Migration**:
```tsx
// Before
<ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ paddingBottom: 40 }}
>

// After
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

<OptimizedScrollView
  showBackToTop={true}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ paddingBottom: 40 }}
>
```

## Future Enhancements

Potential improvements:
- [ ] Add haptic feedback on button press (native)
- [ ] Smooth scroll animation customization
- [ ] Button position customization (left/right, top/bottom)
- [ ] Custom button styling per page
- [ ] Analytics tracking for button usage

---

**Last Updated**: 2025-01-09
**Status**: ✅ Production Ready
