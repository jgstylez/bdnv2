import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, borderRadius, typography } from '../../constants/theme';

interface NotificationBadgeProps {
  count?: number;
  onPress?: () => void;
  isDesktop?: boolean;
}

export function NotificationBadge({ count = 0, onPress, isDesktop = false }: NotificationBadgeProps) {
  // Mobile: smaller icon but maintain 44x44 touch target for accessibility
  // Desktop: larger icon with 40x40 container
  const iconSize = isDesktop ? 24 : 20;
  const containerSize = isDesktop ? 40 : 44;
  const badgeSize = isDesktop ? 18 : 16;
  const badgeFontSize = isDesktop ? 10 : 9;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: containerSize,
        height: containerSize,
        borderRadius: containerSize / 2,
        backgroundColor: isDesktop ? "rgba(71, 71, 71, 0.4)" : "rgba(40, 40, 45, 0.8)",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        borderWidth: 1,
        borderColor: colors.border.light,
      }}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Notifications${count > 0 ? `, ${count} unread` : ""}`}
      accessibilityHint="Double tap to view notifications"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      activeOpacity={0.7}
    >
      <MaterialIcons name="notifications-none" size={iconSize} color={colors.text.primary} />
      {count > 0 && (
        <View
          style={{
            position: "absolute",
            top: isDesktop ? -2 : 0,
            right: isDesktop ? -2 : 0,
            backgroundColor: colors.status.error,
            minWidth: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 4,
            borderWidth: 2,
            borderColor: colors.primary.bg,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: badgeFontSize,
              fontWeight: "bold",
            }}
          >
            {count > 99 ? "99+" : count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
