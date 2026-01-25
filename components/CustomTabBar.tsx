import React, { useRef, useEffect } from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const navigatingRef = useRef(false);
  const previousPathnameRef = useRef(pathname);
  const tabBarHeight = 56;
  const bottomPadding = 30;
  const totalHeight = tabBarHeight + bottomPadding;

  // Reset navigation flag when pathname actually changes (navigation completed)
  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname;
      navigatingRef.current = false;
    }
  }, [pathname]);

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: totalHeight,
        paddingBottom: bottomPadding,
        zIndex: 1000,
        elevation: 1000,
        overflow: "hidden",
      }}
    >
      {/* Blur Background */}
      {Platform.OS !== "web" ? (
        <BlurView
          intensity={Platform.OS === "ios" ? 40 : 30}
          tint="dark"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
          pointerEvents="none"
        >
          {/* Translucent Black Overlay */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.35)",
            }}
            pointerEvents="none"
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
            backgroundColor: "rgba(0, 0, 0, 0.35)",
            zIndex: 1,
            ...(Platform.OS === "web" && {
              // @ts-ignore - Web-only CSS properties
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }),
          }}
          pointerEvents="none"
        />
      )}

      {/* Tab Bar Content */}
      <View
        style={{
          flexDirection: "row",
          height: tabBarHeight,
          marginTop: 0,
          borderTopWidth: 1,
          borderTopColor: "rgba(71, 71, 71, 0.3)",
          backgroundColor: "transparent",
          position: "relative",
          zIndex: 2,
        }}
        pointerEvents="box-none"
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            // Prevent duplicate navigation calls
            if (navigatingRef.current) {
              return;
            }

            // Determine target route based on tab name
            let targetRoute: string;
            if (route.name === "dashboard") {
              targetRoute = "/(tabs)/dashboard";
            } else if (route.name === "marketplace") {
              targetRoute = "/(tabs)/marketplace";
            } else if (route.name === "pay") {
              // Special handling for Pay tab - navigate directly to payment page
              targetRoute = "/pages/payments/c2b-payment";
            } else if (route.name === "account") {
              targetRoute = "/(tabs)/account";
            } else {
              return; // Unknown route
            }

            // Check if we're already on the target route
            if (pathname === targetRoute || pathname?.startsWith(targetRoute)) {
              return; // Already on this route, don't navigate
            }

            // Set navigating flag to prevent duplicate calls
            navigatingRef.current = true;

            // Use router.push for consistent navigation
            // router.push() is synchronous and doesn't return a Promise
            router.push(targetRoute as any);
            
            // Reset flag after a delay to allow navigation to complete
            // The pathname change effect will also reset it, but this is a fallback
            setTimeout(() => {
              navigatingRef.current = false;
            }, 300);
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const tabLabel = typeof label === "string" ? label : route.name;
          const accessibilityLabel = options.tabBarAccessibilityLabel || `${tabLabel} tab`;

          return (
            <TouchableOpacity
              key={route.key}
              accessible={true}
              accessibilityRole="tab"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={accessibilityLabel}
              accessibilityHint={isFocused ? `${tabLabel} tab, currently selected` : `Switch to ${tabLabel} tab`}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 4,
                paddingHorizontal: 4,
                minHeight: 44,
              }}
              activeOpacity={0.7}
            >
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                {options.tabBarIcon &&
                  options.tabBarIcon({
                    focused: isFocused,
                    color: isFocused ? "#ba9988" : "rgba(255, 255, 255, 0.5)",
                    size: 22,
                  })}
                <Text
                  style={{
                    fontSize: 10,
                    marginTop: 2,
                    color: isFocused ? "#ba9988" : "rgba(255, 255, 255, 0.5)",
                    fontWeight: isFocused ? "600" : "400",
                    lineHeight: 12,
                  }}
                >
                  {typeof label === "string" ? label : route.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

