import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  colors,
  spacing,
  borderRadius,
  typography,
} from "../../constants/theme";
import { UserMenuItem } from "../../config/userMenu";

interface UserDropdownProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  isDesktop?: boolean;
  menuItems?: UserMenuItem[];
}

export function UserDropdown({
  user,
  isDesktop = false,
  menuItems = [],
}: UserDropdownProps) {
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

  // Split menu items into columns for desktop mega menu
  const getColumns = () => {
    if (!isDesktop) {
      return [menuItems]; // Single column for mobile
    }

    // For desktop, split into 2 columns
    // Column 1: First 6 items
    // Column 2: Remaining items
    const midPoint = Math.ceil(menuItems.length / 2);
    return [
      menuItems.slice(0, midPoint),
      menuItems.slice(midPoint),
    ];
  };

  const columns = getColumns();

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
              backgroundColor:
                Platform.OS === "web" ? "transparent" : "rgba(0, 0, 0, 0.1)",
            }}
            onPress={() => setIsOpen(false)}
            activeOpacity={1}
          />
          <View
            style={{
              position: "absolute",
              top: 48,
              right: 0,
              width: isDesktop ? 480 : 240, // Wider for desktop to accommodate columns
              backgroundColor: "#474747", // Match account page menu background
              borderRadius: borderRadius.lg,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)", // Match account page border
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10,
              overflow: "hidden", // Match account page overflow
              zIndex: 1004,
            }}
          >
            <View
              style={{
                paddingVertical: 16,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text style={{ color: "#ffffff", fontWeight: "600" }}>
                {user?.name}
              </Text>
              <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 12 }}>
                {user?.email}
              </Text>
            </View>

            {/* Menu Items - Multi-column layout for desktop */}
            <View
              style={{
                flexDirection: isDesktop ? "row" : "column",
              }}
            >
              {columns.map((columnItems, columnIndex) => (
                <View
                  key={columnIndex}
                  style={{
                    flex: isDesktop ? 1 : undefined,
                    ...(isDesktop && columnIndex > 0 && {
                      borderLeftWidth: 1,
                      borderLeftColor: "rgba(186, 153, 136, 0.2)",
                    }),
                  }}
                >
                  {columnItems.map((item, index) => (
                    <React.Fragment key={item.href}>
                      {item.divider && (
                        <View
                          style={{
                            height: 1,
                            backgroundColor: "rgba(186, 153, 136, 0.2)",
                            marginHorizontal: 20,
                          }}
                        />
                      )}
                      <TouchableOpacity
                        onPress={() => handleMenuItemPress(item.href)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingVertical: 16,
                          paddingHorizontal: 20,
                          gap: 16,
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
                          size={24}
                          color={
                            item.label === "Sign Out"
                              ? "#ba9988"
                              : "rgba(255, 255, 255, 0.7)"
                          }
                        />
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "500",
                            color:
                              item.label === "Sign Out"
                                ? "#ba9988"
                                : "#ffffff",
                            flex: 1,
                          }}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    </React.Fragment>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </>
      )}
    </View>
  );
}
