import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { useResponsive } from '../../hooks/useResponsive';

interface DeveloperPageHeaderProps {
  title: string;
  description?: string;
  actionButton?: {
    label: string;
    icon?: keyof typeof MaterialIcons.glyphMap;
    onPress: () => void;
  };
}

/**
 * DeveloperPageHeader Component
 * Reusable header component for developer pages
 */
export const DeveloperPageHeader: React.FC<DeveloperPageHeaderProps> = ({
  title,
  description,
  actionButton,
}) => {
  const { isMobile } = useResponsive();

  return (
    <View style={{ marginBottom: spacing["2xl"] }}>
      <View
        style={{
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          marginBottom: spacing.sm,
          gap: isMobile ? spacing.md : 0,
        }}
      >
        <Text
          style={{
            fontSize: isMobile ? typography.fontSize["2xl"] : typography.fontSize["3xl"],
            fontWeight: typography.fontWeight.extrabold,
            color: colors.text.primary,
          }}
        >
          {title}
        </Text>
        {actionButton && (
          <TouchableOpacity
            onPress={actionButton.onPress}
            style={{
              backgroundColor: colors.accent,
              paddingHorizontal: spacing["2xl"],
              paddingVertical: spacing.md,
              borderRadius: borderRadius.md,
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            {actionButton.icon && (
              <MaterialIcons name={actionButton.icon} size={20} color={colors.text.primary} />
            )}
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              {actionButton.label}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {description && (
        <Text
          style={{
            fontSize: typography.fontSize.lg,
            color: colors.text.secondary,
            lineHeight: 24,
          }}
        >
          {description}
        </Text>
      )}
    </View>
  );
};
