import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";

export interface ListItemAction {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  color?: string;
  label?: string;
}

interface ListItemProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof MaterialIcons.glyphMap | React.ReactNode;
  actions?: ListItemAction[];
  onPress?: () => void;
  rightContent?: React.ReactNode;
  badges?: { label: string; color: string; backgroundColor: string }[];
}

export function ListItem({
  title,
  subtitle,
  icon,
  actions,
  onPress,
  rightContent,
  badges,
}: ListItemProps) {
  const Content = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: spacing.lg,
        backgroundColor: colors.secondary.bg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border.light,
      }}
    >
      {/* Icon */}
      {icon && (
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: borderRadius.md,
            backgroundColor: colors.primary.bg,
            alignItems: "center",
            justifyContent: "center",
            marginRight: spacing.md,
          }}
        >
          {typeof icon === "string" ? (
            <MaterialIcons name={icon as any} size={24} color={colors.accent} />
          ) : (
            icon
          )}
        </View>
      )}

      {/* Text Content */}
      <View style={{ flex: 1, marginRight: spacing.md }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: 4 }}>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: "600",
              color: colors.text.primary,
            }}
          >
            {title}
          </Text>
          {badges?.map((badge, index) => (
            <View
              key={index}
              style={{
                backgroundColor: badge.backgroundColor,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: borderRadius.full,
              }}
            >
              <Text
                style={{
                  color: badge.color,
                  fontSize: 10,
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                {badge.label}
              </Text>
            </View>
          ))}
        </View>
        {subtitle && (
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right Content */}
      {rightContent && <View style={{ marginRight: spacing.md }}>{rightContent}</View>}

      {/* Actions */}
      {actions && (
        <View style={{ flexDirection: "row", gap: spacing.sm }}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={action.onPress}
              style={{
                padding: 8,
                borderRadius: borderRadius.md,
                backgroundColor: colors.primary.bg,
                borderWidth: 1,
                borderColor: colors.border.light,
              }}
            >
              <MaterialIcons
                name={action.icon}
                size={20}
                color={action.color || colors.text.secondary}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{Content}</TouchableOpacity>;
  }

  return Content;
}
