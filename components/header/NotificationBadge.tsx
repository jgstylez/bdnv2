import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, borderRadius, spacing } from "../../constants/theme";

interface NotificationBadgeProps {
  isDesktop: boolean;
  notificationCount?: number;
  messageCount?: number;
}

/**
 * NotificationBadge Component
 * Displays notification and message icons with badge counts
 */
export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  isDesktop,
  notificationCount = 3,
  messageCount = 2,
}) => {
  const router = useRouter();

  const iconSize = isDesktop ? 22 : 24;
  const containerSize = isDesktop ? 40 : 44;
  const badgeSize = isDesktop ? 18 : 20;
  const badgeFontSize = isDesktop ? 10 : 11;

  return (
    <>
      {/* Notification Icon */}
      <TouchableOpacity
        onPress={() => router.push("/pages/notifications")}
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
        }}
      >
        <MaterialIcons name="notifications" size={iconSize} color="rgba(255, 255, 255, 0.9)" />
        {/* Badge */}
        {notificationCount > 0 && (
          <View
            style={{
              position: "absolute",
              top: isDesktop ? 4 : 2,
              right: isDesktop ? 4 : 2,
              minWidth: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              backgroundColor: colors.status.error,
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
              {notificationCount > 99 ? "99+" : notificationCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Messages/Inbox Icon */}
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
        }}
      >
        <MaterialIcons name="mail" size={iconSize} color="rgba(255, 255, 255, 0.9)" />
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
              backgroundColor: "#FF6B35", // Orangish color
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
    </>
  );
};


