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
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { navigationMenu, NavGroup, NavItem } from "@/config/navigation";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { filterNavigationByFeatureFlags } from "@/lib/navigation-utils";

interface MenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MenuPanel: React.FC<MenuPanelProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { flags, loading: flagsLoading } = useFeatureFlags();
  // Start with all groups collapsed (accordion behavior)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const navigatingRef = React.useRef(false);
  const previousPathnameRef = React.useRef(pathname);

  // Calculate panel width consistently - memoized to prevent recalculation
  const panelWidth = useMemo(() => Math.min(320, width * 0.85), [width]);
  const translateX = useSharedValue(panelWidth);

  // Filter navigation based on feature flags
  // Show full menu while loading to avoid navigation disappearing
  // Memoize to prevent unnecessary recalculations and effect triggers
  const filteredNavigationMenu = useMemo(() => {
    return flagsLoading
      ? navigationMenu
      : filterNavigationByFeatureFlags(navigationMenu, flags);
  }, [flagsLoading, flags]);

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
    if (href === "/(tabs)/dashboard") {
      return pathname === "/(tabs)/dashboard";
    }
    if (href === "/(tabs)/account") {
      return pathname === "/(tabs)/account";
    }
    if (href === "/(tabs)/businesses") {
      return pathname === "/(tabs)/businesses";
    }
    if (href === "/(tabs)/pay") {
      return pathname === "/(tabs)/pay";
    }
    // Check if pathname includes the href
    return pathname?.includes(href);
  };

  // Auto-expand the group containing the active item when pathname changes
  useEffect(() => {
    const checkActive = (href: string) => {
      if (href === "/(tabs)/dashboard") {
        return pathname === "/(tabs)/dashboard";
      }
      if (href === "/(tabs)/profile") {
        return pathname === "/(tabs)/profile";
      }
      if (href === "/(tabs)/businesses") {
        return pathname === "/(tabs)/businesses";
      }
      if (href === "/(tabs)/pay") {
        return pathname === "/(tabs)/pay";
      }
      return pathname?.includes(href);
    };

    const activeGroup = filteredNavigationMenu.find((group: NavGroup) =>
      group.items.some((item: NavItem) => checkActive(item.href))
    );
    if (activeGroup) {
      setExpandedGroups(new Set([activeGroup.label]));
    }
  }, [pathname, filteredNavigationMenu]);

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
    // Use exact match to allow navigation from sub-routes to parent routes
    if (pathname === href) {
      onClose();
      return;
    }

    // Set navigating flag to prevent duplicate calls
    navigatingRef.current = true;

    // Navigate and close menu
    // navigatingRef will be reset by the pathname change effect
    router.push(href as any);
    onClose();
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
            ...(Platform.OS === "web" && {
              // @ts-ignore - Web-only CSS properties
              position: "fixed" as any,
            }),
          },
          overlayStyle,
        ]}
        pointerEvents={isOpen ? "auto" : "none"}
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
            shadowColor: "#000",
            shadowOffset: { width: -4, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            ...(Platform.OS === "web" && {
              // @ts-ignore - Web-only CSS properties
              position: "fixed" as any,
            }),
          },
          animatedStyle,
        ]}
        pointerEvents={isOpen ? "auto" : "none"}
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
              Menu
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

          {/* Navigation Groups */}
          <View style={{ 
            paddingTop: Platform.OS === "ios" ? 4 : 8,
            paddingHorizontal: 0, // Padding handled by individual Pressables
          }}>
            {filteredNavigationMenu.map(
              (group: NavGroup, groupIndex: number) => {
                const isExpanded = isGroupExpanded(group.label);
                const hasActiveItem = group.items.some((item: NavItem) =>
                  isActive(item.href)
                );

                return (
                  <View
                    key={group.label}
                    style={{
                      borderBottomWidth:
                        groupIndex < filteredNavigationMenu.length - 1 ? 1 : 0,
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
