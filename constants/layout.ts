// Layout constants for consistent spacing across the app
export const TAB_BAR_HEIGHT = 56;
export const TAB_BAR_BOTTOM_PADDING = 30;
export const TAB_BAR_TOTAL_HEIGHT = TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_PADDING; // 86px

// Safe bottom padding for ScrollView contentContainerStyle
// This ensures content is visible above the tab bar on mobile
export const getScrollViewBottomPadding = (isMobile: boolean, additionalPadding: number = 40) => {
  return isMobile ? TAB_BAR_TOTAL_HEIGHT + additionalPadding : additionalPadding;
};

