import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Pressable,
  Text,
} from "react-native";
import { usePathname, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PageTitle } from "./header/PageTitle";
import { SearchBar } from "./header/SearchBar";
import { NotificationBadge } from "./header/NotificationBadge";
import { InboxBadge } from "./header/InboxBadge";
import { CartBadge } from "./header/CartBadge";
import { UserDropdown } from "./header/UserDropdown";
import { useResponsive } from "../hooks/useResponsive";
import { colors, spacing, borderRadius, typography } from "../constants/theme";
import { userMenuItems } from "../config/userMenu";

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
  {
    id: "1",
    text: "Restaurants",
    type: "category" as const,
    category: "Restaurant",
  },
  {
    id: "2",
    text: "Beauty Salons",
    type: "category" as const,
    category: "Beauty & Wellness",
  },
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
  const { paddingHorizontal } = useResponsive();
  const isDesktop = width >= 1024 && Platform.OS === "web";
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const handleMenuPress = () => {
    onMenuPress();
  };

  const getPageTitle = () => {
    // Tab routes
    if (
      pathname === "/(tabs)/dashboard" ||
      pathname?.startsWith("/(tabs)/dashboard")
    )
      return "Dashboard";
    if (
      pathname === "/(tabs)/marketplace" ||
      pathname?.startsWith("/(tabs)/marketplace")
    )
      return "Marketplace";
    if (pathname === "/(tabs)/pay" || pathname?.startsWith("/(tabs)/pay"))
      return "Pay";
    if (
      pathname === "/(tabs)/account" ||
      pathname?.startsWith("/(tabs)/account")
    )
      return "Account";

    // Pages routes
    if (pathname?.includes("/pages/tokens")) return "BDN Tokens";
    if (pathname?.includes("/pages/referrals")) return "Referrals";
    if (pathname?.includes("/pages/search")) return "Search";
    if (pathname?.includes("/pages/cart")) return "Shopping Cart";
    if (pathname?.includes("/pages/checkout")) return "Checkout";
    if (pathname?.includes("/pages/transactions")) return "Transactions";
    if (pathname?.includes("/pages/bdn-plus")) return "BDN+";
    if (pathname?.includes("/pages/pricing")) return "Pricing";
    if (pathname?.includes("/pages/support")) return "Support";
    if (pathname?.includes("/pages/profile")) return "Profile";

    // Merchant routes
    if (pathname?.includes("/pages/merchant/dashboard"))
      return "Merchant Dashboard";
    if (pathname?.includes("/pages/merchant/products")) return "Products";
    if (pathname?.includes("/pages/merchant/orders")) return "Orders";
    if (pathname?.includes("/pages/merchant/menu")) return "Menu";
    if (pathname?.includes("/pages/merchant/analytics")) return "Analytics";
    if (pathname?.includes("/pages/merchant/invoices")) return "Invoices";
    if (pathname?.includes("/pages/merchant/qrcode")) return "QR Code";
    if (pathname?.includes("/pages/merchant/account"))
      return "Merchant Account";
    if (pathname?.includes("/pages/merchant/settings"))
      return "Merchant Settings";
    if (pathname?.includes("/pages/merchant")) return "Merchant";

    // Nonprofit routes
    if (pathname?.includes("/pages/nonprofit/dashboard"))
      return "Nonprofit Dashboard";
    if (pathname?.includes("/pages/nonprofit/campaigns")) return "Campaigns";
    if (pathname?.includes("/pages/nonprofit/account"))
      return "Nonprofit Account";
    if (pathname?.includes("/pages/nonprofit/donations")) return "Donations";
    if (pathname?.includes("/pages/nonprofit/products"))
      return "Nonprofit Products";
    if (pathname?.includes("/pages/nonprofit/orders"))
      return "Nonprofit Orders";
    if (pathname?.includes("/pages/nonprofit/invoices"))
      return "Nonprofit Invoices";
    if (pathname?.includes("/pages/nonprofit/qrcode"))
      return "Nonprofit QR Code";
    if (pathname?.includes("/pages/nonprofit/settings"))
      return "Nonprofit Settings";
    if (pathname?.includes("/pages/nonprofit")) return "Nonprofit";

    // MyImpact routes
    if (pathname?.includes("/pages/myimpact/leaderboard")) return "Leaderboard";
    if (pathname?.includes("/pages/myimpact/points")) return "Impact Points";
    if (pathname?.includes("/pages/myimpact/cashback")) return "Cashback";
    if (pathname?.includes("/pages/myimpact/sponsorship")) return "Sponsorship";
    if (pathname?.includes("/pages/myimpact/donations")) return "My Donations";
    if (pathname?.includes("/pages/myimpact/badges")) return "Badges";
    if (pathname?.includes("/pages/myimpact")) return "MyImpact";

    // University routes
    if (pathname?.includes("/pages/university/guides")) return "Guides";
    if (pathname?.includes("/pages/university/videos")) return "Videos";
    if (pathname?.includes("/pages/university/help")) return "Help Center";
    if (pathname?.includes("/pages/university/blog")) return "Blog";
    if (pathname?.includes("/pages/university")) return "BDN University";

    // Media routes
    if (pathname?.includes("/pages/media/bdn-tv")) return "BDN TV";
    if (pathname?.includes("/pages/media/channels")) return "Channels";
    if (pathname?.includes("/pages/media")) return "Media";

    // Events routes
    if (pathname?.includes("/pages/events/tickets")) return "My Tickets";
    if (pathname?.includes("/pages/events/create")) return "Create Event";
    if (pathname?.includes("/pages/events/my-events")) return "My Events";
    if (pathname?.includes("/pages/events")) return "Events";

    // Business routes
    if (pathname?.includes("/pages/businesses/")) return "Business";
    if (pathname?.includes("/pages/businesses")) return "Businesses";

    // Product routes
    if (pathname?.includes("/pages/products/")) return "Product";
    if (pathname?.includes("/pages/products")) return "Products";

    // Payment routes
    if (pathname?.includes("/pages/payments/c2b-payment"))
      return "Pay Business";
    if (pathname?.includes("/pages/payments/buy-blkd")) return "Buy BLKD";
    if (pathname?.includes("/pages/payments/buy-gift-card"))
      return "Buy Gift Card";
    if (pathname?.includes("/pages/payments/token-purchase"))
      return "Purchase Tokens";
    if (pathname?.includes("/pages/payments")) return "Payments";

    // Invoice routes
    if (pathname?.includes("/pages/invoices/create")) return "Create Invoice";
    if (pathname?.includes("/pages/invoices/")) return "Invoice";
    if (pathname?.includes("/pages/invoices")) return "Invoices";

    // Notification routes
    if (pathname?.includes("/pages/notifications/settings"))
      return "Notification Settings";
    if (pathname?.includes("/pages/notifications")) return "Notifications";

    // Pay It Forward
    if (pathname?.includes("/pages/pay-it-forward")) return "Pay It Forward";

    return null; // Return null if no title found (PageTitle will handle it)
  };

  const headerHeight = 64;
  const totalHeight = headerHeight + (isDesktop ? 0 : insets.top);
  const pageTitle = getPageTitle();

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
          paddingHorizontal: paddingHorizontal,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: colors.border.default,
          position: "relative",
          gap: spacing.md,
        }}
      >
        {/* Page Title - Show on desktop, compact on mobile */}
        {pageTitle &&
          (isDesktop ? (
            <View style={{ flexShrink: 0, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: typography.fontSize.lg, // Smaller size for header (was 2xl)
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {pageTitle}
              </Text>
            </View>
          ) : (
            <View style={{ flexShrink: 1, marginRight: spacing.sm, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {pageTitle}
              </Text>
            </View>
          ))}

        {/* Smart Search Bar - Flexible width, expands/contracts based on available space */}
        <View style={{ flex: 1, minWidth: 200, maxWidth: "100%" }}>
          <SearchBar placeholder="Search..." />
        </View>

        {/* Right Side Actions */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
            position: "relative",
            zIndex: 1003,
          }}
        >
          {/* Notification & Messages Icons - Desktop only (before cart) */}
          {isDesktop && (
            <>
              <NotificationBadge isDesktop={isDesktop} />
              <InboxBadge isDesktop={isDesktop} />
            </>
          )}

          {/* Cart Icon - Desktop only (between notifications and avatar) */}
          {isDesktop && <CartBadge isDesktop={isDesktop} />}

          {/* User Avatar - Desktop only (hidden on mobile) */}
          {isDesktop && (
            <UserDropdown
              isDesktop={isDesktop}
              user={mockUser}
              menuItems={userMenuItems}
            />
          )}

          {/* Notification & Messages Icons - Mobile (before cart) */}
          {!isDesktop && (
            <>
              <NotificationBadge isDesktop={isDesktop} />
              <InboxBadge isDesktop={isDesktop} />
            </>
          )}

          {/* Cart Icon - Mobile (between inbox and menu) */}
          {!isDesktop && <CartBadge isDesktop={isDesktop} />}

          {/* Menu Button - Mobile only */}
          {!isDesktop && (
            <Pressable
              onPress={handleMenuPress}
              style={({ pressed }) => ({
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(71, 71, 71, 0.6)",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1001,
                elevation: 1001,
                opacity: pressed ? 0.7 : 1,
                ...(Platform.OS === "web" && {
                  cursor: "pointer",
                  userSelect: "none",
                }),
              })}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessible={true}
              accessibilityLabel="Open menu"
              accessibilityRole="button"
            >
              <MaterialIcons
                name="menu"
                size={24}
                color="rgba(255, 255, 255, 0.9)"
              />
            </Pressable>
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
