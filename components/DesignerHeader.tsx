import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions, Platform } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

interface DesignerHeaderProps {
  onMenuPress: () => void;
}

export const DesignerHeader: React.FC<DesignerHeaderProps> = ({ onMenuPress }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024 && Platform.OS === "web";

  const getPageTitle = () => {
    if (pathname === "/designer" || pathname === "/designer/") return "Designer Dashboard";
    if (pathname?.includes("/designer/brand-identity")) return "Brand Identity";
    if (pathname?.includes("/designer/logo")) return "Logo";
    if (pathname?.includes("/designer/ui-design")) return "UI Design";
    if (pathname?.includes("/designer/color-palette")) return "Color Palette";
    if (pathname?.includes("/designer/typography")) return "Typography";
    if (pathname?.includes("/designer/components")) return "Components";
    if (pathname?.includes("/designer/spacing")) return "Spacing";
    if (pathname?.includes("/designer/icons")) return "Icons";
    return "Designer";
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

        {/* Menu Button - Mobile only */}
        {!isDesktop && (
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
            accessibilityLabel="Open designer menu"
            accessibilityRole="button"
          >
            <MaterialIcons name="menu" size={24} color="rgba(255, 255, 255, 0.7)" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
