import React, { useState } from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

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

export const AdminSidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

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

  const renderNavItem = (item: NavItem, isChild: boolean = false) => {
    const active = isActive(item.href);
    return (
      <TouchableOpacity
        key={item.href}
        onPress={() => router.push(item.href as any)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingVertical: 12,
          paddingHorizontal: isChild ? 32 : 16,
          borderRadius: 8,
          backgroundColor: active ? "rgba(186, 153, 136, 0.15)" : "transparent",
        }}
      >
        <MaterialIcons
          name={item.icon}
          size={20}
          color={active ? "#ba9988" : "rgba(255, 255, 255, 0.6)"}
          style={{ marginRight: 12 }}
        />
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            fontSize: 14,
            fontWeight: active ? "600" : "500",
            color: active ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
            flex: 1,
          }}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMenuGroup = (group: MenuGroup) => {
    const expanded = isGroupExpanded(group.label);
    const hasActiveChild = group.items.some((item) => isActive(item.href));

    return (
      <View key={group.label}>
        <TouchableOpacity
          onPress={() => toggleGroup(group.label)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
            backgroundColor: hasActiveChild ? "rgba(186, 153, 136, 0.1)" : "transparent",
          }}
        >
          <MaterialIcons
            name={group.icon}
            size={20}
            color={hasActiveChild ? "#ba9988" : "rgba(255, 255, 255, 0.6)"}
            style={{ marginRight: 12 }}
          />
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 14,
              fontWeight: hasActiveChild ? "600" : "500",
              color: hasActiveChild ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
              flex: 1,
            }}
          >
            {group.label}
          </Text>
          <MaterialIcons
            name={expanded ? "expand-less" : "expand-more"}
            size={20}
            color="rgba(255, 255, 255, 0.5)"
          />
        </TouchableOpacity>
        {expanded && (
          <View style={{ marginTop: 4 }}>
            {group.items.map((item) => renderNavItem(item, true))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View
      style={{
        width: 240,
        backgroundColor: "#232323",
        borderRightWidth: 1,
        borderRightColor: "#474747",
        height: "100%",
      }}
    >
      {/* Logo */}
      <View
        style={{
          height: 64,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#474747",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: "#ba9988",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons name="admin-panel-settings" size={18} color="#ffffff" />
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: "#ffffff",
              letterSpacing: -0.5,
            }}
          >
            Admin
          </Text>
        </View>
      </View>

      {/* Navigation Items */}
      <View style={{ paddingHorizontal: 12, paddingTop: 20, gap: 4 }}>
        {menuGroups.map((item) => {
          if ("items" in item) {
            return renderMenuGroup(item);
          } else {
            return renderNavItem(item);
          }
        })}
      </View>
    </View>
  );
};

