import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { logger } from '../lib/logger';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated";

interface AdminMenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

interface MenuGroup {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  items: NavItem[];
}

const menuGroups: (NavItem | MenuGroup)[] = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  {
    label: "Entities",
    icon: "groups",
    items: [
      { label: "Users", href: "/admin/users", icon: "people" },
      { label: "Businesses", href: "/admin/businesses", icon: "store" },
      { label: "Nonprofits", href: "/admin/nonprofits", icon: "handshake" },
      { label: "Token Holders", href: "/admin/token-holders", icon: "account-balance-wallet" },
    ],
  },
  {
    label: "Orders & Transactions",
    icon: "shopping-cart",
    items: [
      { label: "Transactions", href: "/admin/transactions", icon: "receipt" },
      { label: "Gift Cards", href: "/admin/gift-cards", icon: "card-giftcard" },
      { label: "BLKD Purchases", href: "/admin/blkd-purchases", icon: "account-balance-wallet" },
      { label: "Subscription Boxes", href: "/admin/subscription-boxes", icon: "subscriptions" },
    ],
  },
  {
    label: "Operations",
    icon: "build",
    items: [
      { label: "Disputes", href: "/admin/disputes", icon: "gavel" },
      { label: "Notifications", href: "/admin/notifications", icon: "notifications" },
      { label: "Emails", href: "/admin/emails", icon: "email" },
    ],
  },
  {
    label: "Intelligence",
    icon: "insights",
    items: [
      { label: "Content", href: "/admin/content", icon: "article" },
      { label: "Business Intelligence", href: "/admin/bi", icon: "insights" },
      { label: "Analytics", href: "/admin/analytics", icon: "analytics" },
    ],
  },
  {
    label: "System",
    icon: "settings",
    items: [
      { label: "Settings", href: "/admin/settings", icon: "settings" },
    ],
  },
];

export const AdminMenuPanel: React.FC<AdminMenuPanelProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(width);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    translateX.value = withTiming(isOpen ? 0 : width, {
      duration: 300,
    });
  }, [isOpen, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayOpacity = useSharedValue(0);
  
  React.useEffect(() => {
    overlayOpacity.value = withTiming(isOpen ? 0.5 : 0, { duration: 200 });
  }, [isOpen]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/";
    }
    return pathname?.includes(href);
  };

  const toggleGroup = (groupLabel: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupLabel)) {
        next.delete(groupLabel);
      } else {
        next.add(groupLabel);
      }
      return next;
    });
  };

  const isGroupExpanded = (groupLabel: string) => expandedGroups.has(groupLabel);

  // Auto-expand groups if any child is active
  React.useEffect(() => {
    menuGroups.forEach((group) => {
      if ("items" in group) {
        const hasActiveChild = group.items.some((item) => isActive(item.href));
        if (hasActiveChild) {
          setExpandedGroups((prev) => new Set(prev).add(group.label));
        }
      }
    });
  }, [pathname]);

  const handleItemPress = (href: string) => {
    try {
      const result = router.push(href as any);
      if (result && typeof result.finally === 'function') {
        result.finally(() => {
          onClose();
        });
      } else {
        onClose();
      }
    } catch (error) {
      logger.error("Error during navigation", error);
      onClose();
    }
  };

  if (!isOpen && translateX.value === width) {
    return null;
  }

  const renderNavItem = (item: NavItem, isChild: boolean = false) => {
    const active = isActive(item.href);
    return (
      <TouchableOpacity
        key={item.href}
        onPress={() => handleItemPress(item.href)}
        style={{
          backgroundColor: active ? "rgba(186, 153, 136, 0.2)" : "#474747",
          borderRadius: 12,
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: active ? "rgba(186, 153, 136, 0.4)" : "rgba(186, 153, 136, 0.2)",
          marginLeft: isChild ? 20 : 0,
          marginBottom: 8,
        }}
      >
        <MaterialIcons name={item.icon as any} size={20} color="#ba9988" style={{ marginRight: 12 }} />
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            fontSize: 16,
            fontWeight: active ? "600" : "500",
            color: "#ffffff",
            flex: 1,
          }}
        >
          {item.label}
        </Text>
        <MaterialIcons name="chevron-right" size={16} color="rgba(255, 255, 255, 0.5)" />
      </TouchableOpacity>
    );
  };

  const renderMenuGroup = (group: MenuGroup) => {
    const expanded = isGroupExpanded(group.label);
    const hasActiveChild = group.items.some((item) => isActive(item.href));

    return (
      <View key={group.label} style={{ marginBottom: 8 }}>
        <TouchableOpacity
          onPress={() => toggleGroup(group.label)}
          style={{
            backgroundColor: hasActiveChild ? "rgba(186, 153, 136, 0.15)" : "#474747",
            borderRadius: 12,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: hasActiveChild ? "rgba(186, 153, 136, 0.3)" : "rgba(186, 153, 136, 0.2)",
          }}
        >
          <MaterialIcons name={group.icon as any} size={20} color="#ba9988" style={{ marginRight: 12 }} />
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 16,
              fontWeight: hasActiveChild ? "600" : "500",
              color: "#ffffff",
              flex: 1,
            }}
          >
            {group.label}
          </Text>
          <MaterialIcons
            name={expanded ? "expand-less" : "expand-more"}
            size={20}
            color="rgba(255, 255, 255, 0.7)"
          />
        </TouchableOpacity>
        {expanded && (
          <View style={{ marginTop: 8 }}>
            {group.items.map((item) => renderNavItem(item, true))}
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      {/* Overlay */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#000000",
            zIndex: 1100,
            elevation: 1100,
          },
          overlayStyle,
        ]}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      {/* Side Panel */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: 320,
            backgroundColor: "#232323",
            borderLeftWidth: 1,
            borderLeftColor: "#474747",
            zIndex: 1101,
            elevation: 1101,
          },
          animatedStyle,
        ]}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Close Button */}
          <View style={{ padding: 20, alignItems: "flex-end" }}>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="rgba(255, 255, 255, 0.7)" />
            </TouchableOpacity>
          </View>

          {/* Admin Badge */}
          <View
            style={{
              alignItems: "center",
              marginBottom: 32,
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#ba9988",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <MaterialIcons name="admin-panel-settings" size={40} color="#ffffff" />
            </View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 4,
              }}
            >
              Admin Panel
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              Platform Management
            </Text>
          </View>

          {/* Menu Items */}
          <View style={{ paddingHorizontal: 20 }}>
            {menuGroups.map((item, index) => {
              if ("items" in item) {
                return renderMenuGroup(item);
              } else {
                return (
                  <View key={item.href} style={{ marginBottom: 8 }}>
                    {renderNavItem(item)}
                  </View>
                );
              }
            })}
          </View>

          {/* Back to User View */}
          <TouchableOpacity
            onPress={() => handleItemPress("/(tabs)/dashboard")}
            style={{
              backgroundColor: "#474747",
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              marginHorizontal: 20,
              marginTop: 20,
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <MaterialIcons name="arrow-back" size={18} color="#ba9988" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#ba9988",
              }}
            >
              Back to User View
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </>
  );
};
