import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius } from "../../constants/theme";

interface EmptyStateProps {
  icon?: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
}: EmptyStateProps) {
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
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: colors.primary.bg,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.lg,
        }}
      >
        <MaterialIcons name={icon} size={32} color={colors.accent} />
      </View>
      <Text
        style={{
          fontSize: typography.fontSize.lg,
          fontWeight: "700",
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
