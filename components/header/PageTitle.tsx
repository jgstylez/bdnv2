import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

interface PageTitleProps {
  title: string;
  showBack?: boolean;
  rightAction?: {
    icon: keyof typeof MaterialIcons.glyphMap;
    onPress: () => void;
  };
}

export function PageTitle({ title, showBack = false, rightAction }: PageTitleProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: spacing.xl,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
        {showBack && (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.secondary.bg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        )}
        <Text
          style={{
            fontSize: typography.fontSize["2xl"],
            fontWeight: "700",
            color: colors.text.primary,
          }}
        >
          {title}
        </Text>
      </View>

      {rightAction && (
        <TouchableOpacity
          onPress={rightAction.onPress}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.secondary.bg,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialIcons name={rightAction.icon} size={24} color={colors.text.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}
