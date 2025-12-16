import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

interface DeveloperHeaderProps {
  onMenuPress: () => void;
}

export const DeveloperHeader: React.FC<DeveloperHeaderProps> = ({ onMenuPress }) => {
  const pathname = usePathname();
  const router = useRouter();

  const getPageTitle = () => {
    if (pathname === "/developer" || pathname === "/developer/") return "Developer Dashboard";
    if (pathname?.includes("/developer/api-docs")) return "API Documentation";
    if (pathname?.includes("/developer/api-keys")) return "API Keys";
    if (pathname?.includes("/developer/webhooks")) return "Webhooks";
    if (pathname?.includes("/developer/sdks")) return "SDKs & Code Examples";
    if (pathname?.includes("/developer/logs")) return "Logs & Debugging";
    if (pathname?.includes("/developer/testing")) return "Testing Tools";
    return "Developer";
  };

  const handleMenuPress = () => {
    onMenuPress();
  };

  return (
    <View
      style={{
        height: 64,
        backgroundColor: "#232323",
        borderBottomWidth: 1,
        borderBottomColor: "#474747",
        paddingHorizontal: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 1000,
        elevation: 1000,
      }}
    >
      {/* Page Title */}
      <View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: "#ffffff",
          }}
        >
          {getPageTitle()}
        </Text>
      </View>

      {/* Right Side Actions */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        {/* Back to User Dashboard */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/dashboard")}
          activeOpacity={0.7}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            backgroundColor: "#474747",
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <MaterialIcons name="arrow-back" size={16} color="rgba(255, 255, 255, 0.7)" />
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            User View
          </Text>
        </TouchableOpacity>

        {/* Menu Button */}
        <TouchableOpacity
          onPress={handleMenuPress}
          activeOpacity={0.7}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#474747",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
            elevation: 1001,
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessible={true}
          accessibilityLabel="Open developer menu"
          accessibilityRole="button"
        >
          <MaterialIcons name="menu" size={24} color="rgba(255, 255, 255, 0.7)" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

