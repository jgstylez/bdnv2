import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

interface AdminHeaderProps {
  onMenuPress: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuPress }) => {
  const pathname = usePathname();
  const router = useRouter();

  const getPageTitle = () => {
    if (pathname === "/admin" || pathname === "/admin/") return "Admin Dashboard";
    if (pathname?.includes("/admin/users")) return "User Management";
    if (pathname?.includes("/admin/businesses")) return "Business Management";
    if (pathname?.includes("/admin/content")) return "Content Management";
    if (pathname?.includes("/admin/bi")) {
      if (pathname?.includes("/bi/business-model")) return "Business Model";
      if (pathname?.includes("/bi/transactions")) return "Transaction Tracking";
      if (pathname?.includes("/bi/user-behavior")) return "User Behavior Analytics";
      if (pathname?.includes("/bi/revenue-sharing")) return "Revenue Sharing";
      return "Business Intelligence";
    }
    if (pathname?.includes("/admin/analytics")) return "Analytics & Reports";
    if (pathname?.includes("/admin/settings")) return "Platform Settings";
    return "Admin";
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
          accessibilityLabel="Open admin menu"
          accessibilityRole="button"
        >
          <MaterialIcons name="menu" size={24} color="rgba(255, 255, 255, 0.7)" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

