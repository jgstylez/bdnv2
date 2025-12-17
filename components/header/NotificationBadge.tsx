import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, borderRadius, typography } from '../../constants/theme';

interface NotificationBadgeProps {
  count?: number;
  onPress?: () => void;
}

export function NotificationBadge({ count = 0, onPress }: NotificationBadgeProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.secondary.bg,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <MaterialIcons name="notifications-none" size={24} color={colors.text.primary} />
      {count > 0 && (
        <View
          style={{
            position: "absolute",
            top: -2,
            right: -2,
            backgroundColor: colors.status.error,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
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
              fontSize: 10,
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
