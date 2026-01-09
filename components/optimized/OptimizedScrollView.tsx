/**
 * OptimizedScrollView Component
 * 
 * A ScrollView component with performance optimizations for all platforms
 * - scrollEventThrottle for smooth scrolling
 * - nestedScrollEnabled for Android nested scrolling
 * - Platform-specific bounces behavior
 * - Proper bottom padding for tab bar
 * - Optional back-to-top button for long content
 */

import React, { useRef, useState, useCallback } from 'react';
import { View, ScrollView, ScrollViewProps, Platform, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useResponsive } from '@/hooks/useResponsive';
import { BackToTopButton } from '@/components/navigation/BackToTopButton';

interface OptimizedScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  showBackToTop?: boolean;
  backToTopThreshold?: number; // Override default 2 screen heights threshold
}

export const OptimizedScrollView: React.FC<OptimizedScrollViewProps> = ({
  children,
  contentContainerStyle,
  showBackToTop = false,
  backToTopThreshold,
  onScroll,
  onScrollEndDrag,
  onMomentumScrollEnd,
  ...props
}) => {
  const { scrollViewBottomPadding, paddingHorizontal } = useResponsive();
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  // Track scroll position using state - works reliably on all platforms
  // IMPORTANT: On iOS, during bounce, offsetY can exceed contentHeight - layoutHeight
  // We use the actual offsetY (not clamped) for visibility checks during scrolling
  // This allows the button to appear when scrolling to the bottom, even during bounce
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    
    // Use actual scroll offset (not clamped) so button can appear during iOS bounce
    setScrollOffset(offsetY);
    
    // Call custom handler if provided
    if (onScroll) {
      onScroll(event);
    }
  }, [onScroll]);

  // Handle scroll end events - clamp only when scroll settles (after bounce completes)
  const handleScrollEndDrag = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;
    
    // Clamp to actual scrollable range when scroll ends
    const maxScrollY = Math.max(0, contentHeight - layoutHeight);
    const clampedOffsetY = Math.min(Math.max(offsetY, 0), maxScrollY);
    
    // Update with clamped value after scroll ends
    setScrollOffset(clampedOffsetY);
    
    if (onScrollEndDrag) {
      onScrollEndDrag(event);
    }
  }, [onScrollEndDrag]);

  const handleMomentumScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;
    
    // Clamp to actual scrollable range when momentum scroll ends
    const maxScrollY = Math.max(0, contentHeight - layoutHeight);
    const clampedOffsetY = Math.min(Math.max(offsetY, 0), maxScrollY);
    
    // Update with clamped value after momentum scroll ends
    setScrollOffset(clampedOffsetY);
    
    if (onMomentumScrollEnd) {
      onMomentumScrollEnd(event);
    }
  }, [onMomentumScrollEnd]);

  // Scroll to top handler - works on all platforms
  const scrollToTop = useCallback(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, []);

  // Add extra bottom padding when back-to-top button is shown
  const extraBottomPadding = showBackToTop ? 80 : 0;

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <ScrollView
        ref={scrollViewRef}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={Platform.OS === 'android'}
        bounces={Platform.OS !== 'web'}
        onScroll={handleScroll}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={[
          {
            paddingHorizontal: paddingHorizontal,
            paddingTop: Platform.OS === 'web' ? 20 : 36,
            paddingBottom: scrollViewBottomPadding + extraBottomPadding,
          },
          contentContainerStyle,
        ]}
        {...props}
      >
        {children}
      </ScrollView>
      {showBackToTop && (
        <BackToTopButton
          onPress={scrollToTop}
          scrollOffset={scrollOffset}
          showThreshold={backToTopThreshold}
        />
      )}
    </View>
  );
};
