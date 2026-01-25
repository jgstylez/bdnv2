import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { logger } from '../lib/logger';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const navigatingRef = React.useRef(false);
  const previousPathnameRef = React.useRef(pathname);

  // Calculate panel width consistently - memoized to prevent recalculation
  const panelWidth = useMemo(() => Math.min(320, width * 0.85), [width]);
  const translateX = useSharedValue(panelWidth);

  React.useEffect(() => {
    translateX.value = withTiming(isOpen ? 0 : panelWidth, {
      duration: 300,
    });
  }, [isOpen, panelWidth, translateX]);

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

  // Reset navigation flag when pathname actually changes (navigation completed)
  React.useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname;
      navigatingRef.current = false;
    }
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/";
    }
    return pathname?.includes(href);
  };

  // Auto-expand the group containing the active item when pathname changes
  useEffect(() => {
    const checkActive = (href: string) => {
      if (href === "/admin") {
        return pathname === "/admin" || pathname === "/admin/";
      }
      return pathname?.includes(href);
    };

    const activeGroup = menuGroups.find((group) => {
      if ("items" in group) {
        return group.items.some((item) => checkActive(item.href));
      }
      return checkActive(group.href);
    });
    
    if (activeGroup) {
      const groupLabel = "items" in activeGroup ? activeGroup.label : activeGroup.label;
      setExpandedGroups(new Set([groupLabel]));
    }
  }, [pathname]);

  const toggleGroup = (groupLabel: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupLabel)) {
      // If clicking an expanded group, collapse it
      newExpanded.delete(groupLabel);
    } else {
      // If clicking a collapsed group, expand it and close all others (accordion behavior)
      newExpanded.clear();
      newExpanded.add(groupLabel);
    }
    setExpandedGroups(newExpanded);
  };

  const isGroupExpanded = (groupLabel: string) =>
    expandedGroups.has(groupLabel);

  const handleItemPress = (href: string) => {
    // Prevent duplicate navigation calls
    if (navigatingRef.current) {
      return;
    }

    // Check if we're already on the exact target route
    if (pathname === href) {
      onClose();
      return;
    }

    // Set navigating flag to prevent duplicate calls
    navigatingRef.current = true;

    try {
      router.push(href as any);
      onClose();
    } catch (error) {
      logger.error("Error during navigation", error);
      onClose();
    }
  };

  // Convert menuGroups to NavGroup format for consistent rendering
  const navGroups: Array<{ label: string; icon: keyof typeof MaterialIcons.glyphMap; items: NavItem[] }> = [];
  
  menuGroups.forEach((item) => {
    if ("items" in item) {
      navGroups.push(item);
    } else {
      // Convert single NavItem to a group with one item
      navGroups.push({
        label: item.label,
        icon: item.icon,
        items: [{ label: item.label, href: item.href, icon: item.icon }],
      });
    }
  });

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
            ...(Platform.OS === "web" && {
              // @ts-ignore - Web-only CSS properties
              position: "fixed" as any,
              pointerEvents: isOpen ? "auto" : "none",
            }),
            ...(Platform.OS !== "web" && {
              pointerEvents: isOpen ? "auto" : "none",
            }),
          },
          overlayStyle,
        ]}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={onClose}
          {...(Platform.OS === "web" && {
            // @ts-ignore - Web-only CSS properties
            style: { flex: 1, cursor: "pointer" },
          })}
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
            width: panelWidth,
            backgroundColor: "#232323",
            zIndex: 1101,
            elevation: 1101,
            ...(Platform.OS === "web" && {
              // @ts-ignore - Web-only CSS properties
              position: "fixed" as any,
              boxShadow: "-4px 0 8px rgba(0, 0, 0, 0.3)",
              pointerEvents: isOpen ? "auto" : "none",
            }),
            ...(Platform.OS !== "web" && {
              shadowColor: "#000",
              shadowOffset: { width: -4, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              pointerEvents: isOpen ? "auto" : "none",
            }),
          },
          animatedStyle,
        ]}
      >
        <View
          style={{
            flex: 1,
            borderLeftWidth: 1,
            borderLeftColor: "#474747",
            overflow: "hidden",
            backgroundColor: "#232323",
          }}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ 
              paddingTop: Platform.OS === "ios" ? insets.top : 0,
              paddingBottom: Platform.OS === "ios" ? Math.max(20, insets.bottom + 20) : 20,
              paddingHorizontal: 0, // Padding handled by individual components
            }}
            showsVerticalScrollIndicator={false}
            bounces={true}
            alwaysBounceVertical={false}
            contentInsetAdjustmentBehavior="automatic"
          >
            {/* Header */}
            <View
              style={{
                minHeight: 64,
                paddingHorizontal: Platform.OS === "ios" ? 24 : 20,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: "#474747",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#ffffff",
                }}
              >
                Admin Panel
              </Text>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                  padding: 8,
                  ...(Platform.OS === "web" && {
                    cursor: "pointer",
                    userSelect: "none",
                  }),
                })}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                {...(Platform.OS !== 'web' && {
                  accessible: true,
                  accessibilityRole: "button" as const,
                  accessibilityLabel: "Close menu",
                })}
              >
                <MaterialIcons
                  name="close"
                  size={24}
                  color="rgba(255, 255, 255, 0.7)"
                />
              </Pressable>
            </View>

            {/* Platform Management Title */}
            <View
              style={{
                alignItems: "center",
                marginBottom: 32,
                paddingTop: 24,
                paddingHorizontal: Platform.OS === "ios" ? 24 : 20,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Platform Management
              </Text>
            </View>

            {/* Navigation Groups */}
            <View style={{ 
              paddingTop: Platform.OS === "ios" ? 4 : 8,
              paddingHorizontal: 0, // Padding handled by individual Pressables
            }}>
              {navGroups.map(
                (group, groupIndex) => {
                  const isExpanded = isGroupExpanded(group.label);
                  const hasActiveItem = group.items.some((item: NavItem) =>
                    isActive(item.href)
                  );

                  return (
                    <View
                      key={group.label}
                      style={{
                        borderBottomWidth:
                          groupIndex < navGroups.length - 1 ? 1 : 0,
                        borderBottomColor: "#474747",
                      }}
                    >
                      {/* Group Header */}
                      <Pressable
                        onPress={() => toggleGroup(group.label)}
                        style={({ pressed }) => ({
                          backgroundColor: hasActiveItem
                            ? "rgba(186, 153, 136, 0.1)"
                            : "transparent",
                          opacity: pressed ? 0.7 : 1,
                          ...(Platform.OS === "web" && {
                            cursor: "pointer",
                            userSelect: "none",
                          }),
                        })}
                        {...(Platform.OS !== 'web' && {
                          accessible: true,
                          accessibilityRole: "button" as const,
                          accessibilityLabel: `${group.label} menu group`,
                          accessibilityState: { expanded: isExpanded },
                          accessibilityHint: isExpanded ? "Collapse group" : "Expand group",
                        })}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingVertical: Platform.OS === "ios" ? 16 : 14,
                            paddingHorizontal: Platform.OS === "ios" ? 24 : 20,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              flex: 1,
                              marginRight: 12,
                            }}
                          >
                            <View style={{ marginRight: Platform.OS === "ios" ? 16 : 12, width: 24, alignItems: "center" }}>
                              <MaterialIcons
                                name={group.icon}
                                size={20}
                                color={
                                  hasActiveItem
                                    ? "#ba9988"
                                    : "rgba(255, 255, 255, 0.7)"
                                }
                              />
                            </View>
                            <Text
                              style={{
                                fontSize: Platform.OS === "ios" ? 15 : 14,
                                fontWeight: "600",
                                color: hasActiveItem
                                  ? "#ba9988"
                                  : "rgba(255, 255, 255, 0.9)",
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                                flex: 1,
                              }}
                            >
                              {group.label}
                            </Text>
                          </View>
                          <View style={{ marginLeft: Platform.OS === "ios" ? 8 : 0 }}>
                            <MaterialIcons
                              name={
                                isExpanded
                                  ? "keyboard-arrow-up"
                                  : "keyboard-arrow-down"
                              }
                              size={20}
                              color="rgba(255, 255, 255, 0.5)"
                            />
                          </View>
                        </View>
                      </Pressable>

                      {/* Group Items */}
                      {isExpanded && (
                        <View>
                          {group.items.map((item: NavItem, itemIndex: number) => {
                            const active = isActive(item.href);
                            return (
                              <Pressable
                                key={item.href + itemIndex}
                                onPress={() => handleItemPress(item.href)}
                                style={({ pressed }) => ({
                                  backgroundColor: active
                                    ? "rgba(186, 153, 136, 0.15)"
                                    : "transparent",
                                  opacity: pressed ? 0.7 : 1,
                                  ...(Platform.OS === "web" && {
                                    cursor: "pointer",
                                    userSelect: "none",
                                  }),
                                })}
                                {...(Platform.OS !== 'web' && {
                                  accessible: true,
                                  accessibilityRole: "button" as const,
                                  accessibilityLabel: item.label,
                                  accessibilityState: { selected: active },
                                  accessibilityHint: `Navigate to ${item.label}`,
                                })}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingVertical: Platform.OS === "ios" ? 14 : 12,
                                    paddingHorizontal: Platform.OS === "ios" ? 24 : 20,
                                    paddingLeft: Platform.OS === "ios" ? 64 : 52,
                                  }}
                                >
                                  <MaterialIcons
                                    name={item.icon}
                                    size={18}
                                    color={
                                      active
                                        ? "#ba9988"
                                        : "rgba(255, 255, 255, 0.7)"
                                    }
                                    style={{ marginRight: Platform.OS === "ios" ? 14 : 12 }}
                                  />
                                  <Text
                                    style={{
                                      fontSize: 14,
                                      fontWeight: active ? "600" : "500",
                                      color: active
                                        ? "#ffffff"
                                        : "rgba(255, 255, 255, 0.8)",
                                      flex: 1,
                                    }}
                                  >
                                    {item.label}
                                  </Text>
                                </View>
                              </Pressable>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  );
                }
              )}
            </View>
          </ScrollView>
        </View>
      </Animated.View>
    </>
  );
};
