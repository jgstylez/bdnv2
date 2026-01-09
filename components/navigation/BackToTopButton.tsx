/**
 * BackToTopButton Component
 * 
 * A floating button that appears when user scrolls down 2 screen heights
 * Allows users to quickly scroll back to the top of long pages
 */

import React, { useEffect, useCallback } from 'react';
import { TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useResponsive } from '@/hooks/useResponsive';
import { TAB_BAR_TOTAL_HEIGHT } from '@/constants/layout';

interface BackToTopButtonProps {
  onPress: () => void; // Callback to scroll to top, provided by parent
  scrollOffset: number; // Current scroll position passed from parent
  showThreshold?: number; // Show button after scrolling this many pixels (defaults to 2 screen heights)
}

export const BackToTopButton: React.FC<BackToTopButtonProps> = ({
  onPress,
  scrollOffset,
  showThreshold,
}) => {
  const { height } = useWindowDimensions();
  const { isMobile } = useResponsive();
  
  // Default threshold: 2 screen heights (or 500px minimum for mobile/testing)
  const threshold = showThreshold ?? Math.max(height * 2, 500);
  
  // Add hysteresis to prevent flickering on iOS bounce
  // Show threshold: scroll down past threshold
  // Hide threshold: scroll back up past threshold - 150px (prevents flicker)
  const [isVisible, setIsVisible] = React.useState(false);
  const hideThreshold = threshold - 150; // Hysteresis: hide when scrolled back up
  
  React.useEffect(() => {
    // Show button when scrolled past threshold
    if (scrollOffset > threshold) {
      setIsVisible(true);
    } 
    // Hide button when scrolled back up past hide threshold (with hysteresis)
    else if (scrollOffset < hideThreshold) {
      setIsVisible(false);
    }
    // Between hideThreshold and threshold: keep current state (hysteresis zone)
  }, [scrollOffset, threshold, hideThreshold]);
  
  // Animated values for smooth transitions
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  // Update animations when visibility changes
  useEffect(() => {
    opacity.value = withTiming(isVisible ? 1 : 0, { duration: 200 });
    translateY.value = withTiming(isVisible ? 0 : 20, { duration: 200 });
  }, [isVisible, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  // Position above tab bar on mobile, with spacing
  const bottomOffset = isMobile 
    ? TAB_BAR_TOTAL_HEIGHT + 20 // 86px tab bar + 20px spacing
    : 40; // Desktop spacing

  return (
    <Animated.View
      style={[
        styles.container,
        { 
          bottom: bottomOffset,
          pointerEvents: isVisible ? 'auto' : 'none',
        },
        animatedStyle,
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={styles.button}
      >
        <MaterialIcons name="keyboard-arrow-up" size={28} color="#232323" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    zIndex: 9999,
    // Web-specific styles for proper stacking
    ...(Platform.OS === 'web' && {
      // @ts-ignore - Web-only CSS properties
      position: 'fixed' as any,
    }),
  },
  button: {
    backgroundColor: '#ba9988',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // Web-specific shadow
    ...(Platform.OS === 'web' && {
      // @ts-ignore - Web-only CSS properties
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
    }),
  },
});
