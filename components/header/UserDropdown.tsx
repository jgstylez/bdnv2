import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

interface UserDropdownProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setIsOpen(false);
    // TODO: Implement logout
    router.replace("/(auth)/login");
  };

  return (
    <View style={{ position: "relative", zIndex: 100 }}>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,
          padding: 4,
          borderRadius: borderRadius.full,
          backgroundColor: isOpen ? colors.secondary.bg : "transparent",
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.accent,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {user?.avatar ? (
            <Image 
              source={{ uri: user.avatar }} 
              style={{ width: 32, height: 32 }} 
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {user?.name?.[0]?.toUpperCase() || "U"}
            </Text>
          )}
        </View>
        <MaterialIcons
          name={isOpen ? "expand-less" : "expand-more"}
          size={20}
          color={colors.text.secondary}
        />
      </TouchableOpacity>

      {isOpen && (
        <>
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              left: -1000,
              right: -1000,
              bottom: -1000,
              zIndex: -1,
            }}
            onPress={() => setIsOpen(false)}
          />
          <View
            style={{
              position: "absolute",
              top: 48,
              right: 0,
              width: 200,
              backgroundColor: colors.primary.bg,
              borderRadius: borderRadius.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
              padding: spacing.sm,
            }}
          >
            <View style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border.default }}>
              <Text style={{ color: colors.text.primary, fontWeight: "600" }}>{user?.name}</Text>
              <Text style={{ color: colors.text.tertiary, fontSize: 12 }}>{user?.email}</Text>
            </View>
            
            <TouchableOpacity
              onPress={() => {
                setIsOpen(false);
                router.push("/pages/profile");
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
                padding: spacing.md,
                borderRadius: borderRadius.md,
              }}
            >
              <MaterialIcons name="person" size={20} color={colors.text.secondary} />
              <Text style={{ color: colors.text.secondary }}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsOpen(false);
                router.push("/pages/settings");
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
                padding: spacing.md,
                borderRadius: borderRadius.md,
              }}
            >
              <MaterialIcons name="settings" size={20} color={colors.text.secondary} />
              <Text style={{ color: colors.text.secondary }}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                marginTop: spacing.xs,
              }}
            >
              <MaterialIcons name="logout" size={20} color={colors.status.error} />
              <Text style={{ color: colors.status.error }}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
