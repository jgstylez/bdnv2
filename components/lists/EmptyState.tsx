import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

export type EmptyStateVariant = "default" | "error" | "search" | "no-results" | "empty-list";

interface EmptyStateProps {
  icon?: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: EmptyStateVariant;
}

const variantConfig: Record<EmptyStateVariant, { icon: keyof typeof MaterialIcons.glyphMap; iconColor: string }> = {
  default: { icon: "inbox", iconColor: colors.accent },
  error: { icon: "error-outline", iconColor: colors.status.error },
  search: { icon: "search", iconColor: colors.accent },
  "no-results": { icon: "search-off", iconColor: colors.text.secondary },
  "empty-list": { icon: "list", iconColor: colors.accent },
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = "default",
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const displayIcon = icon || config.icon;
  const iconColor = variant === "error" ? config.iconColor : colors.accent;

  return (
    <View
      style={{
        padding: spacing["4xl"],
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.lg,
        }}
      >
        <MaterialIcons name={displayIcon} size={32} color={iconColor} />
      </View>
      <Text
        style={{
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.bold as any,
          color: colors.text.primary,
          marginBottom: spacing.xs,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
      {description && (
        <Text
          style={{
            fontSize: typography.fontSize.base,
            color: colors.text.secondary,
            textAlign: "center",
            maxWidth: 400,
            marginBottom: action ? spacing.lg : 0,
          }}
        >
          {description}
        </Text>
      )}
      {action && (
        <View style={{ marginTop: spacing.md }}>
          {action}
        </View>
      )}
    </View>
  );
}
