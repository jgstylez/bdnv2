import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { UserMenuItem } from '../../config/userMenu';

interface UserDropdownProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  isDesktop?: boolean;
  menuItems?: UserMenuItem[];
}

export function UserDropdown({ user, isDesktop = false, menuItems = [] }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuItemPress = (href: string) => {
    setIsOpen(false);
    if (href === "/(auth)/login") {
      // Handle logout
      router.replace(href);
    } else {
      router.push(href as any);
    }
  };

  return (
    <View style={{ position: "relative", zIndex: 1004 }}>
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
              position: Platform.OS === "web" ? "fixed" : "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1003,
              backgroundColor: Platform.OS === "web" ? "transparent" : "rgba(0, 0, 0, 0.1)",
            }}
            onPress={() => setIsOpen(false)}
            activeOpacity={1}
          />
          <View
            style={{
              position: "absolute",
              top: 48,
              right: 0,
              width: 240,
              backgroundColor: "#232323", // Darker background color (matches main app background)
              borderRadius: borderRadius.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10,
              padding: spacing.sm,
              maxHeight: 400,
              zIndex: 1004,
              ...(Platform.OS === "web" && {
                // @ts-ignore - Web-only CSS properties
                overflowY: "auto",
              }),
            }}
          >
            <View style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border.default }}>
              <Text style={{ color: colors.text.primary, fontWeight: "600" }}>{user?.name}</Text>
              <Text style={{ color: colors.text.tertiary, fontSize: 12 }}>{user?.email}</Text>
            </View>
            
            {/* Menu Items - Use same menu as account page */}
            {menuItems.map((item, index) => (
              <React.Fragment key={item.href}>
                {item.divider && index > 0 && (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: colors.border.default,
                      marginVertical: spacing.xs,
                    }}
                  />
                )}
                <TouchableOpacity
                  onPress={() => handleMenuItemPress(item.href)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.md,
                    padding: spacing.md,
                    borderRadius: borderRadius.md,
                    ...(Platform.OS === "web" && {
                      // @ts-ignore - Web-only CSS properties
                      cursor: "pointer",
                      userSelect: "none",
                    }),
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name={item.icon}
                    size={20}
                    color={item.label === "Sign Out" ? colors.status.error : colors.text.secondary}
                  />
                  <Text
                    style={{
                      color: item.label === "Sign Out" ? colors.status.error : colors.text.secondary,
                      fontSize: typography.fontSize.sm,
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </>
      )}
    </View>
  );
}
