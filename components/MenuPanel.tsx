import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
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
  const translateX = useSharedValue(width);
  const { flags, loading: flagsLoading } = useFeatureFlags();
  // Start with all groups collapsed (accordion behavior)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const navigatingRef = React.useRef(false);
  const previousPathnameRef = React.useRef(pathname);

  // Filter navigation based on feature flags
  // Show full menu while loading to avoid navigation disappearing
  // Memoize to prevent unnecessary recalculations and effect triggers
  const filteredNavigationMenu = useMemo(() => {
    return flagsLoading
      ? navigationMenu
      : filterNavigationByFeatureFlags(navigationMenu, flags);
  }, [flagsLoading, flags]);

  React.useEffect(() => {
    translateX.value = withSpring(isOpen ? 0 : width, {
      damping: 20,
      stiffness: 90,
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

    // Check if we're already on the target route
    if (pathname === href || pathname?.includes(href)) {
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

  if (!isOpen && translateX.value === width) {
    return null;
  }

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
            zIndex: 998,
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
            zIndex: 999,
            shadowColor: "#000",
            shadowOffset: { width: -4, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
            paddingTop: Platform.OS === "web" ? 0 : insets.top,
            paddingBottom: Platform.OS === "web" ? 0 : insets.bottom,
          },
          animatedStyle,
        ]}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View
            style={{
              height: 64,
              paddingHorizontal: 20,
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
            <TouchableOpacity
              onPress={onClose}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Close menu"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons
                name="close"
                size={24}
                color="rgba(255, 255, 255, 0.7)"
              />
            </TouchableOpacity>
          </View>

          {/* Navigation Groups */}
          <View style={{ paddingTop: 8 }}>
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
                    <TouchableOpacity
                      onPress={() => toggleGroup(group.label)}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={`${group.label} menu group`}
                      accessibilityState={{ expanded: isExpanded }}
                      accessibilityHint={
                        isExpanded ? "Collapse group" : "Expand group"
                      }
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingVertical: 14,
                        paddingHorizontal: 20,
                        backgroundColor: hasActiveItem
                          ? "rgba(186, 153, 136, 0.1)"
                          : "transparent",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flex: 1,
                          gap: 12,
                        }}
                      >
                        <MaterialIcons
                          name={group.icon}
                          size={20}
                          color={
                            hasActiveItem
                              ? "#ba9988"
                              : "rgba(255, 255, 255, 0.7)"
                          }
                        />
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: hasActiveItem
                              ? "#ba9988"
                              : "rgba(255, 255, 255, 0.9)",
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          {group.label}
                        </Text>
                      </View>
                      <MaterialIcons
                        name={
                          isExpanded
                            ? "keyboard-arrow-up"
                            : "keyboard-arrow-down"
                        }
                        size={20}
                        color="rgba(255, 255, 255, 0.5)"
                      />
                    </TouchableOpacity>

                    {/* Group Items */}
                    {isExpanded && (
                      <View>
                        {group.items.map((item: NavItem, itemIndex: number) => {
                          const active = isActive(item.href);
                          return (
                            <TouchableOpacity
                              key={item.href + itemIndex}
                              onPress={() => handleItemPress(item.href)}
                              accessible={true}
                              accessibilityRole="button"
                              accessibilityLabel={item.label}
                              accessibilityState={{ selected: active }}
                              accessibilityHint={`Navigate to ${item.label}`}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                paddingVertical: 12,
                                paddingHorizontal: 20,
                                paddingLeft: 52,
                                backgroundColor: active
                                  ? "rgba(186, 153, 136, 0.15)"
                                  : "transparent",
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
                                style={{ marginRight: 12 }}
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
                            </TouchableOpacity>
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
      </Animated.View>
    </>
  );
};
