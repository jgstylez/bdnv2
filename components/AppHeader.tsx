import React, { useState, useRef } from "react";
import { View, TouchableOpacity, useWindowDimensions, Platform, Pressable } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PageTitle } from "./header/PageTitle";
import { SearchBar } from "./header/SearchBar";
import { NotificationBadge } from "./header/NotificationBadge";
import { CartBadge } from "./header/CartBadge";
import { UserDropdown } from "./header/UserDropdown";
import { useResponsive } from '../hooks/useResponsive';
import { colors, spacing, borderRadius } from '../constants/theme';
import { userMenuItems } from '../config/userMenu';

interface AppHeaderProps {
  onMenuPress: () => void;
}

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  level: "Bronze",
};

// Mock search suggestions
const mockSearchSuggestions = [
  { id: "1", text: "Restaurants", type: "category" as const, category: "Restaurant" },
  { id: "2", text: "Beauty Salons", type: "category" as const, category: "Beauty & Wellness" },
  { id: "3", text: "Soul Food Kitchen", type: "business" as const },
  { id: "4", text: "Black-owned businesses", type: "query" as const },
];

// Mock recent searches
const mockRecentSearches = [
  { id: "1", query: "soul food", timestamp: "2024-02-15T10:30:00Z" },
  { id: "2", query: "hair products", timestamp: "2024-02-14T14:20:00Z" },
];

export const AppHeader: React.FC<AppHeaderProps> = ({ onMenuPress }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isDesktop = width >= 1024 && Platform.OS === "web";
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const handleMenuPress = () => {
    onMenuPress();
  };


  const headerHeight = 64;
  const totalHeight = headerHeight + (isDesktop ? 0 : insets.top);

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: totalHeight,
        paddingTop: isDesktop ? 0 : insets.top,
        zIndex: 1000,
        elevation: 1000,
        overflow: Platform.OS === "web" ? "visible" : "hidden",
      }}
    >
      {/* Blur Background - Use BlurView on native, fallback on web */}
      {Platform.OS !== "web" ? (
        <BlurView
          intensity={Platform.OS === "ios" ? 30 : 20}
          tint="dark"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          {/* Translucent Black Overlay */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            }}
          />
        </BlurView>
      ) : (
        /* Web fallback - semi-transparent black with backdrop-filter */
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.25)",
            ...(Platform.OS === "web" && {
              // @ts-ignore - Web-only CSS properties
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }),
          }}
        />
      )}

      {/* Content */}
      <View
          style={{
            height: headerHeight,
            paddingHorizontal: spacing["2xl"],
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: colors.border.default,
            position: "relative",
            gap: spacing.lg,
          }}
      >
        {/* Page Title */}
        <PageTitle />

        {/* Smart Search Bar */}
        <SearchBar
          isDesktop={isDesktop}
          suggestions={mockSearchSuggestions}
          recentSearches={mockRecentSearches}
        />

        {/* Right Side Actions */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, position: "relative", zIndex: 1003 }}>
          {/* Notification & Messages Icons - Desktop only (before cart) */}
          {isDesktop && <NotificationBadge isDesktop={isDesktop} />}

          {/* Cart Icon - Desktop only (between notifications and avatar) */}
          {isDesktop && <CartBadge isDesktop={isDesktop} />}

          {/* User Avatar - Desktop only */}
          <UserDropdown
            isDesktop={isDesktop}
            user={mockUser}
            menuItems={userMenuItems}
          />

          {/* Notification & Messages Icons - Mobile (before cart) */}
          {!isDesktop && <NotificationBadge isDesktop={isDesktop} />}

          {/* Cart Icon - Mobile (between inbox and menu) */}
          {!isDesktop && <CartBadge isDesktop={isDesktop} />}

          {/* Menu Button - Mobile only */}
          {!isDesktop && (
            <TouchableOpacity
              onPress={handleMenuPress}
              activeOpacity={0.7}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(71, 71, 71, 0.6)",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1001,
                elevation: 1001,
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessible={true}
              accessibilityLabel="Open menu"
              accessibilityRole="button"
            >
              <MaterialIcons name="menu" size={24} color="rgba(255, 255, 255, 0.9)" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Overlay to close dropdowns when clicking outside */}
      {showSearchDropdown && isDesktop && (
        <Pressable
          style={{
            position: "absolute",
            top: 64,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "transparent",
            zIndex: 1001,
          }}
          onPress={() => {
            setShowSearchDropdown(false);
          }}
        />
      )}
    </View>
  );
};

