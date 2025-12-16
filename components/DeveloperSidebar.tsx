import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

interface NavItem {
  label: string;
  href: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/developer", icon: "dashboard" },
  { label: "API Documentation", href: "/developer/api-docs", icon: "menu-book" },
  { label: "API Keys", href: "/developer/api-keys", icon: "vpn-key" },
  { label: "API Playground", href: "/developer/api-playground", icon: "code" },
  { label: "Webhooks", href: "/developer/webhooks", icon: "webhook" },
  { label: "SDKs & Examples", href: "/developer/sdks", icon: "code" },
  { label: "Logs & Debugging", href: "/developer/logs", icon: "bug-report" },
  { label: "Testing Tools", href: "/developer/testing", icon: "science" },
];

export const DeveloperSidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/developer") {
      return pathname === "/developer" || pathname === "/developer/";
    }
    return pathname?.includes(href);
  };

  return (
    <View
      style={{
        width: 240,
        backgroundColor: "#232323",
        borderRightWidth: 1,
        borderRightColor: "#474747",
        height: "100%",
      }}
    >
      {/* Logo */}
      <View
        style={{
          height: 64,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#474747",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: "#2196f3",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons name="developer-mode" size={18} color="#ffffff" />
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: "#ffffff",
              letterSpacing: -0.5,
            }}
          >
            Developer
          </Text>
        </View>
      </View>

      {/* Navigation Items */}
      <View style={{ paddingHorizontal: 12, paddingTop: 20, gap: 4 }}>
        {navItems.map((item, index) => {
          const active = isActive(item.href);
          return (
            <TouchableOpacity
              key={item.href + index}
              onPress={() => router.push(item.href as any)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: active ? "rgba(33, 150, 243, 0.15)" : "transparent",
              }}
            >
              <MaterialIcons
                name={item.icon}
                size={20}
                color={active ? "#2196f3" : "rgba(255, 255, 255, 0.6)"}
                style={{ marginRight: 12 }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: active ? "600" : "500",
                  color: active ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                  flex: 1,
                }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

