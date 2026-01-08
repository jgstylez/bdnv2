/**
 * OptimizedTouchable Component
 * 
 * A TouchableOpacity component with performance and UX optimizations
 * - activeOpacity for visual feedback
 * - hitSlop for better touch targets
 * - Consistent styling across the app
 */

import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { spacing } from '@/constants/theme';

interface OptimizedTouchableProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

export const OptimizedTouchable: React.FC<OptimizedTouchableProps> = ({
  children,
  activeOpacity = 0.7,
  hitSlop = { top: 10, bottom: 10, left: 10, right: 10 },
  ...props
}) => {
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      hitSlop={hitSlop}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};
