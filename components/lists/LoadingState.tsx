import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <View
      style={{
        padding: spacing["4xl"],
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.secondary.bg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border.light,
      }}
    >
      <ActivityIndicator size="large" color={colors.accent} />
      <Text
        style={{
          marginTop: spacing.lg,
          fontSize: typography.fontSize.base,
          color: colors.text.secondary,
        }}
      >
        {message}
      </Text>
    </View>
  );
}
