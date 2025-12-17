import React, { Suspense, ComponentType, lazy } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { colors, spacing } from '../../constants/theme';

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * LazyComponent Wrapper
 * Provides loading fallback for lazy-loaded components
 */
export const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  fallback = (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl }}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={{ color: colors.text.secondary, marginTop: spacing.md }}>Loading...</Text>
    </View>
  ),
}) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

/**
 * Helper function to create lazy-loaded components
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return lazy(importFunc);
}

