import React from "react";
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated";

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
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(width);

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

          {/* Developer Badge */}
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
                backgroundColor: "#2196f3",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <MaterialIcons name="developer-mode" size={40} color="#ffffff" />
            </View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 4,
              }}
            >
              Developer Portal
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              API Integration Tools
            </Text>
          </View>

          {/* Menu Items */}
          <View style={{ paddingHorizontal: 20, gap: 4 }}>
            {developerMenuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  router.push(item.href as any);
                  onClose();
                }}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 12,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "rgba(33, 150, 243, 0.2)",
                  marginBottom: index === developerMenuItems.length - 1 ? 20 : 0,
                }}
              >
                <MaterialIcons name={item.icon as any} size={20} color="#2196f3" style={{ marginRight: 12 }} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: "#ffffff",
                    flex: 1,
                  }}
                >
                  {item.label}
                </Text>
                <MaterialIcons name="chevron-right" size={16} color="rgba(255, 255, 255, 0.5)" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Back to User View */}
          <TouchableOpacity
            onPress={() => {
              router.push("/(tabs)/dashboard");
              onClose();
            }}
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
            <MaterialIcons name="arrow-back" size={18} color="#2196f3" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#2196f3",
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

