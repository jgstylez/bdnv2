/**
 * OptimizedScrollView Component
 * 
 * A ScrollView component with performance optimizations for all platforms
 * - scrollEventThrottle for smooth scrolling
 * - nestedScrollEnabled for Android nested scrolling
 * - Platform-specific bounces behavior
 * - Proper bottom padding for tab bar
 */

import React from 'react';
import { ScrollView, ScrollViewProps, Platform } from 'react-native';
import { useResponsive } from '@/hooks/useResponsive';

interface OptimizedScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
}

export const OptimizedScrollView: React.FC<OptimizedScrollViewProps> = ({
  children,
  contentContainerStyle,
  ...props
}) => {
  const { scrollViewBottomPadding, paddingHorizontal } = useResponsive();

  return (
    <ScrollView
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={Platform.OS === 'android'}
      bounces={Platform.OS !== 'web'}
      contentContainerStyle={[
        {
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === 'web' ? 20 : 36,
          paddingBottom: scrollViewBottomPadding,
        },
        contentContainerStyle,
      ]}
      {...props}
    >
      {children}
    </ScrollView>
  );
};
