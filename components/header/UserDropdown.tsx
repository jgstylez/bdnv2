import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, Modal, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";
import { UserMenuItem } from "../../config/userMenu";

interface User {
  name: string;
  email: string;
  level: string;
}

interface UserDropdownProps {
  isDesktop: boolean;
  user: User;
  menuItems: UserMenuItem[];
}

/**
 * UserDropdown Component
 * Extracts the user avatar dropdown menu from AppHeader
 */
export const UserDropdown: React.FC<UserDropdownProps> = ({
  isDesktop,
  user,
  menuItems,
}) => {
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  if (!isDesktop) {
    return null; // User dropdown only shown on desktop
  }

  const handleUserMenuItemPress = (href: string) => {
    setUserMenuOpen(false);
    router.push(href as any);
  };

  return (
    <View style={{ position: "relative", zIndex: 1003 }}>
      <TouchableOpacity
        onPress={() => setUserMenuOpen(!userMenuOpen)}
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: borderRadius["2xl"],
          backgroundColor: "rgba(71, 71, 71, 0.4)",
          borderWidth: 1,
          borderColor: colors.border.light,
          zIndex: 1003,
          elevation: 1003,
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessible={true}
        accessibilityLabel="User menu"
        accessibilityRole="button"
      >
        {/* Avatar */}
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.accent,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>
            {user.name.charAt(0)}
          </Text>
        </View>

        {/* User Info */}
        <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.primary,
              lineHeight: 18,
            }}
          >
            {user.name}
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.tertiary,
              lineHeight: 16,
            }}
            numberOfLines={1}
          >
            {user.email}
          </Text>
        </View>

        {/* Dropdown Icon */}
        <MaterialIcons
          name={userMenuOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={20}
          color={colors.text.secondary}
        />
      </TouchableOpacity>

      {/* User Dropdown Menu */}
      {userMenuOpen && Platform.OS === "web" ? (
        <Modal
          visible={userMenuOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setUserMenuOpen(false)}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "transparent",
            }}
            onPress={() => setUserMenuOpen(false)}
          >
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
              }}
              style={{
                position: "absolute",
                top: 64 + 8,
                right: 24,
                minWidth: 240,
                backgroundColor: colors.secondary.bg,
                borderRadius: borderRadius.md,
                borderWidth: 1,
                borderColor: colors.border.light,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                overflow: "hidden",
              }}
            >
              {/* User Info Header */}
              <View
                style={{
                  padding: spacing.lg,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border.light,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
                  }}
                >
                  {user.name}
                </Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.text.tertiary,
                    marginBottom: spacing.sm,
                  }}
                >
                  {user.email}
                </Text>
                <View
                  style={{
                    backgroundColor: colors.accentLight,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                    borderRadius: borderRadius.sm,
                    alignSelf: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.accent,
                      textTransform: "uppercase",
                    }}
                  >
                    {user.level} Member
                  </Text>
                </View>
              </View>

              {/* Menu Items */}
              {menuItems.map((item, index) => (
                <React.Fragment key={index}>
                  {item.divider && (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: colors.border.light,
                        marginVertical: spacing.xs,
                      }}
                    />
                  )}
                  <TouchableOpacity
                    onPress={() => handleUserMenuItemPress(item.href)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: spacing.md,
                      paddingHorizontal: spacing.lg,
                      gap: spacing.md,
                    }}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name={item.icon} size={20} color={colors.text.secondary} />
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        color: colors.text.primary,
                        flex: 1,
                      }}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </Pressable>
          </Pressable>
        </Modal>
      ) : (
        userMenuOpen && (
          <View
            style={{
              position: "absolute",
              top: 48,
              right: 0,
              minWidth: 240,
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.md,
              borderWidth: 1,
              borderColor: colors.border.light,
              zIndex: 1004,
              elevation: 1004,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              overflow: "hidden",
            }}
          >
            {/* User Info Header */}
            <View
              style={{
                padding: spacing.lg,
                borderBottomWidth: 1,
                borderBottomColor: colors.border.light,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.xs,
                }}
              >
                {user.name}
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.tertiary,
                  marginBottom: spacing.sm,
                }}
              >
                {user.email}
              </Text>
              <View
                style={{
                  backgroundColor: colors.accentLight,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                  borderRadius: borderRadius.sm,
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.accent,
                    textTransform: "uppercase",
                  }}
                >
                  {user.level} Member
                </Text>
              </View>
            </View>

            {/* Menu Items */}
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                {item.divider && (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: colors.border.light,
                      marginVertical: spacing.xs,
                    }}
                  />
                )}
                <TouchableOpacity
                  onPress={() => handleUserMenuItemPress(item.href)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: spacing.md,
                    paddingHorizontal: spacing.lg,
                    gap: spacing.md,
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name={item.icon} size={20} color={colors.text.secondary} />
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      color: colors.text.primary,
                      flex: 1,
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        )
      )}
    </View>
  );
};


