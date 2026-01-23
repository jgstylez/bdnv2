import React, { useMemo } from "react";
import { View, Text, Pressable, ScrollView, useWindowDimensions, Platform } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DeveloperMenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const developerMenuItems = [
  { label: "Dashboard", icon: "dashboard", href: "/developer" },
  { label: "API Documentation", icon: "menu-book", href: "/developer/api-docs" },
  { label: "API Keys", icon: "vpn-key", href: "/developer/api-keys" },
  { label: "API Playground", icon: "code", href: "/developer/api-playground" },
  { label: "Webhooks", icon: "webhook", href: "/developer/webhooks" },
  { label: "SDKs & Examples", icon: "code", href: "/developer/sdks" },
  { label: "Logs & Debugging", icon: "bug-report", href: "/developer/logs" },
  { label: "Testing Tools", icon: "science", href: "/developer/testing" },
];

export const DeveloperMenuPanel: React.FC<DeveloperMenuPanelProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  
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

  const isActive = (href: string) => {
    if (href === "/developer") {
      return pathname === "/developer" || pathname === "/developer/";
    }
    return pathname?.includes(href);
  };

  if (!isOpen && translateX.value === panelWidth) {
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
              paddingHorizontal: 0,
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

            {/* Developer Portal Header - Keep in place */}
            <View
              style={{
                alignItems: "center",
                marginBottom: 32,
                paddingTop: Platform.OS === "ios" ? 28 : 24,
                paddingHorizontal: Platform.OS === "ios" ? 24 : 20,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "rgba(255, 255, 255, 0.9)",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Developer Portal
              </Text>
            </View>

            {/* Menu Items */}
            <View style={{ 
              paddingTop: Platform.OS === "ios" ? 4 : 8,
              paddingHorizontal: 0,
            }}>
              {developerMenuItems.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <Pressable
                    key={index}
                    onPress={() => {
                      router.push(item.href as any);
                      onClose();
                    }}
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
                        name={item.icon as any}
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
          </ScrollView>
        </View>
      </Animated.View>
    </>
  );
};

