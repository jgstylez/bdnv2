import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";
import { useResponsive } from "../../hooks/useResponsive";

interface ActionButton {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "info";
}

interface Badge {
  label: string;
  color: string;
  backgroundColor: string;
}

interface AdminDataCardProps {
  title: string;
  subtitle?: string;
  badges?: Badge[];
  actions?: ActionButton[];
  children?: React.ReactNode;
}

/**
 * AdminDataCard Component
 * Reusable card component for displaying data rows in admin pages
 * Memoized for performance optimization
 */
const AdminDataCardComponent: React.FC<AdminDataCardProps> = ({
  title,
  subtitle,
  badges = [],
  actions = [],
  children,
}) => {
  const { isMobile } = useResponsive();

  const getActionStyle = (variant: "primary" | "secondary" | "danger" | "info" = "secondary") => {
    switch (variant) {
      case "danger":
        return {
          backgroundColor: colors.status.errorLight,
          borderColor: colors.status.error,
        };
      case "info":
        return {
          backgroundColor: colors.accentLight,
          borderColor: colors.accent,
        };
      case "primary":
        return {
          backgroundColor: colors.accent,
          borderColor: colors.accent,
        };
      default:
        return {
          backgroundColor: colors.primary.bg,
          borderColor: colors.border.light,
        };
    }
  };

  const getActionTextColor = (variant: "primary" | "secondary" | "danger" | "info" = "secondary") => {
    switch (variant) {
      case "danger":
        return colors.status.error;
      case "info":
        return colors.accent;
      case "primary":
        return colors.text.primary;
      default:
        return colors.accent;
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors.secondary.bg,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border.light,
        gap: spacing.md,
      }}
    >
      {/* Header */}
      <View>
        <Text
          style={{
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            marginBottom: spacing.xs,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Badges */}
      {badges.length > 0 && (
        <View style={{ flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" }}>
          {badges.map((badge, index) => (
            <View
              key={index}
              style={{
                backgroundColor: badge.backgroundColor,
                paddingHorizontal: spacing.md - 2,
                paddingVertical: spacing.xs,
                borderRadius: borderRadius.sm,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.xs + 1,
                  fontWeight: typography.fontWeight.semibold,
                  color: badge.color,
                  textTransform: "capitalize",
                }}
              >
                {badge.label}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Children Content */}
      {children && <View>{children}</View>}

      {/* Actions */}
      {actions.length > 0 && (
        <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.md, flexWrap: "wrap" }}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={action.onPress}
              style={{
                flex: isMobile ? 1 : undefined,
                minWidth: isMobile ? undefined : 100,
                paddingVertical: spacing.sm + 2,
                paddingHorizontal: spacing.md,
                borderRadius: borderRadius.sm,
                borderWidth: 1,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: spacing.xs,
                ...getActionStyle(action.variant),
              }}
            >
              <MaterialIcons name={action.icon} size={16} color={getActionTextColor(action.variant)} />
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: getActionTextColor(action.variant),
                }}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export const AdminDataCard = memo(AdminDataCardComponent);

