import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

export type LoadingStateSize = "small" | "medium" | "large";

interface LoadingStateProps {
  message?: string;
  size?: LoadingStateSize;
  fullScreen?: boolean;
}

const sizeConfig: Record<LoadingStateSize, { indicator: "small" | "large"; padding: number }> = {
  small: { indicator: "small", padding: spacing.lg },
  medium: { indicator: "large", padding: spacing.xl },
  large: { indicator: "large", padding: spacing["4xl"] },
};

export function LoadingState({ 
  message = "Loading...", 
  size = "medium",
  fullScreen = false,
}: LoadingStateProps) {
  const config = sizeConfig[size];

  if (fullScreen) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size={config.indicator} color={colors.accent} />
        {message && (
          <Text
            style={{
              marginTop: spacing.lg,
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
            }}
          >
            {message}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View
      style={{
        padding: config.padding,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <ActivityIndicator size={config.indicator} color={colors.accent} />
      {message && (
        <Text
          style={{
            marginTop: spacing.lg,
            fontSize: typography.fontSize.base,
            color: colors.text.secondary,
          }}
        >
          {message}
        </Text>
      )}
    </View>
  );
}
