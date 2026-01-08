import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

interface InboxBadgeProps {
  isDesktop?: boolean;
  messageCount?: number;
}

/**
 * InboxBadge Component
 * Displays inbox/messages icon with unread message count badge
 * Matches the styling of NotificationBadge and CartBadge for consistency
 */
export const InboxBadge: React.FC<InboxBadgeProps> = ({ isDesktop = false, messageCount: overrideMessageCount }) => {
  const router = useRouter();
  // TODO: Get actual message count from context/API
  const messageCount = overrideMessageCount !== undefined ? overrideMessageCount : 0;

  const iconSize = isDesktop ? 22 : 24;
  const containerSize = isDesktop ? 40 : 44;
  const badgeSize = isDesktop ? 18 : 20;
  const badgeFontSize = isDesktop ? 10 : 11;

  return (
    <TouchableOpacity
      onPress={() => router.push("/pages/messages")}
      style={{
        position: "relative",
        width: containerSize,
        height: containerSize,
        borderRadius: containerSize / 2,
        backgroundColor: isDesktop ? "rgba(71, 71, 71, 0.4)" : "rgba(71, 71, 71, 0.6)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: colors.border.light,
        ...(Platform.OS === "web" && {
          // @ts-ignore - Web-only CSS properties
          cursor: "pointer",
          userSelect: "none",
        }),
      }}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Inbox${messageCount > 0 ? `, ${messageCount} unread messages` : ""}`}
      accessibilityHint="Double tap to view messages"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <MaterialIcons name="inbox" size={iconSize} color="rgba(255, 255, 255, 0.9)" />
      {/* Badge */}
      {messageCount > 0 && (
        <View
          style={{
            position: "absolute",
            top: isDesktop ? 4 : 2,
            right: isDesktop ? 4 : 2,
            minWidth: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
            backgroundColor: colors.accent,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: spacing.xs,
            borderWidth: 2,
            borderColor: colors.primary.bg,
          }}
        >
          <Text
            style={{
              fontSize: badgeFontSize,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
            }}
          >
            {messageCount > 99 ? "99+" : messageCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
