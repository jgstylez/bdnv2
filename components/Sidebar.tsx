import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { navigationMenu, NavGroup, NavItem } from "@/config/navigation";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { filterNavigationByFeatureFlags } from "@/lib/navigation-utils";

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const { flags, loading: flagsLoading } = useFeatureFlags();
  // Start with all groups collapsed
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarWidth = isCollapsed ? 72 : 240;
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

  // Reset navigation flag when pathname actually changes (navigation completed)
  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname;
      navigatingRef.current = false;
    }
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/(tabs)/dashboard") {
      return pathname === "/(tabs)/dashboard";
    }
    if (href === "/(tabs)/marketplace") {
      return pathname === "/(tabs)/marketplace";
    }
    if (href === "/(tabs)/account") {
      return pathname === "/(tabs)/account";
    }
    if (href === "/(tabs)/businesses" || href === "/pages/businesses/businesses") {
      return pathname === "/(tabs)/businesses" || pathname === "/pages/businesses/businesses" || pathname?.includes("/pages/businesses");
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
      if (href === "/(tabs)/marketplace") {
        return pathname === "/(tabs)/marketplace";
      }
      if (href === "/(tabs)/profile") {
        return pathname === "/(tabs)/profile";
      }
      if (href === "/(tabs)/businesses" || href === "/pages/businesses/businesses") {
        return pathname === "/(tabs)/businesses" || pathname === "/pages/businesses/businesses" || pathname?.includes("/pages/businesses");
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
    // If sidebar is collapsed, expand it first
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    
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

  const handleGroupClick = (group: NavGroup) => {
    if (isCollapsed) {
      // Expand sidebar and expand the group
      setIsCollapsed(false);
      setExpandedGroups(new Set([group.label]));
    } else {
      toggleGroup(group.label);
    }
  };

  const isGroupExpanded = (groupLabel: string) =>
    expandedGroups.has(groupLabel);

  return (
    <View
      style={{
        width: sidebarWidth,
        height: "100%",
        position: "relative",
        overflow: Platform.OS === "web" ? "visible" : "hidden",
        ...(Platform.OS === "web" && {
          // @ts-ignore - Web-only CSS properties
          transition: "width 0.3s ease",
          overflow: "visible",
          isolation: "isolate" as any,
        }),
      }}
    >
      {/* Blur Background */}
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
          width: sidebarWidth,
          height: "100%",
          borderRightWidth: 1,
          borderRightColor: "rgba(71, 71, 71, 0.3)",
          position: "relative",
          zIndex: 1,
          overflow: Platform.OS === "web" ? "visible" : "hidden",
          ...(Platform.OS === "web" && {
            // @ts-ignore - Web-only CSS properties
            overflow: "visible",
          }),
        }}
      >
        {/* Logo */}
        <View
          style={{
            height: 64,
            paddingHorizontal: isCollapsed ? 0 : 20,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(71, 71, 71, 0.3)",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
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
              <Text
                style={{ fontSize: 18, fontWeight: "800", color: "#ffffff" }}
              >
                B
              </Text>
            </View>
            {!isCollapsed && (
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "800",
                  color: "#ffffff",
                  letterSpacing: -0.5,
                }}
              >
                BDN
              </Text>
            )}
          </View>
        </View>

        {/* Navigation Items */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: isCollapsed ? 0 : 12,
            paddingTop: 20,
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {filteredNavigationMenu.map((group: NavGroup, groupIndex: number) => {
            const isExpanded = isGroupExpanded(group.label);
            const hasActiveItem = group.items.some((item: NavItem) =>
              isActive(item.href)
            );

            if (isCollapsed) {
              // Collapsed view: show only icon
              return (
                <TouchableOpacity
                  key={group.label}
                  onPress={() => handleGroupClick(group)}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 12,
                    marginBottom: groupIndex < filteredNavigationMenu.length - 1 ? 4 : 0,
                    borderRadius: 8,
                    backgroundColor: hasActiveItem
                      ? "rgba(186, 153, 136, 0.1)"
                      : "transparent",
                  }}
                >
                  <MaterialIcons
                    name={group.icon}
                    size={20}
                    color={
                      hasActiveItem ? "#ba9988" : "rgba(255, 255, 255, 0.6)"
                    }
                  />
                </TouchableOpacity>
              );
            }

            // Expanded view: show full menu
            return (
              <View
                key={group.label}
                style={{
                  marginBottom: groupIndex < filteredNavigationMenu.length - 1 ? 8 : 0,
                }}
              >
                {/* Group Header */}
                <TouchableOpacity
                  onPress={() => toggleGroup(group.label)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 8,
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
                    }}
                  >
                    <MaterialIcons
                      name={group.icon}
                      size={18}
                      color={
                        hasActiveItem ? "#ba9988" : "rgba(255, 255, 255, 0.6)"
                      }
                      style={{ marginRight: 10 }}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: hasActiveItem
                          ? "#ba9988"
                          : "rgba(255, 255, 255, 0.6)",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {group.label}
                    </Text>
                  </View>
                  <MaterialIcons
                    name={
                      isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"
                    }
                    size={18}
                    color="rgba(255, 255, 255, 0.5)"
                  />
                </TouchableOpacity>

                {/* Group Items */}
                {isExpanded && (
                  <View style={{ paddingLeft: 8, marginTop: 4 }}>
                    {group.items.map((item: NavItem, itemIndex: number) => {
                      const active = isActive(item.href);
                      const handleItemPress = () => {
                        // Prevent duplicate navigation calls
                        if (navigatingRef.current) {
                          return;
                        }

                        // Check if we're already on the target route
                        if (pathname === item.href || pathname?.includes(item.href)) {
                          return;
                        }

                        // Set navigating flag to prevent duplicate calls
                        navigatingRef.current = true;

                        // Navigate - navigatingRef will be reset by the pathname change effect
                        router.push(item.href as any);
                      };

                      return (
                        <TouchableOpacity
                          key={item.href + itemIndex}
                          onPress={handleItemPress}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 10,
                            paddingHorizontal: 16,
                            borderRadius: 8,
                            backgroundColor: active
                              ? "rgba(186, 153, 136, 0.15)"
                              : "transparent",
                            marginBottom:
                              itemIndex < group.items.length - 1 ? 2 : 0,
                          }}
                        >
                          <MaterialIcons
                            name={item.icon}
                            size={18}
                            color={
                              active ? "#ba9988" : "rgba(255, 255, 255, 0.6)"
                            }
                            style={{ marginRight: 12 }}
                          />
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: active ? "600" : "500",
                              color: active
                                ? "#ffffff"
                                : "rgba(255, 255, 255, 0.7)",
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
          })}
        </ScrollView>

        {/* Toggle Button - Inside sidebar at bottom */}
        <View
          style={{
            paddingHorizontal: isCollapsed ? 12 : 12,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: "rgba(71, 71, 71, 0.3)",
          }}
        >
          <TouchableOpacity
            onPress={() => setIsCollapsed(!isCollapsed)}
            style={{
              width: "100%",
              height: 40,
              borderRadius: 8,
              backgroundColor: "rgba(71, 71, 71, 0.3)",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 8,
            }}
          >
            <MaterialIcons
              name={isCollapsed ? "chevron-right" : "chevron-left"}
              size={20}
              color="rgba(255, 255, 255, 0.8)"
            />
            {!isCollapsed && (
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: "rgba(255, 255, 255, 0.7)",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Collapse
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
