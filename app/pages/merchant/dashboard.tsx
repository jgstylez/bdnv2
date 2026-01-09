import React from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { HeroSection } from '@/components/layouts/HeroSection';
import { BusinessSwitcher } from '@/components/BusinessSwitcher';
import { useBusiness } from '@/contexts/BusinessContext';
import { useResponsive } from '@/hooks/useResponsive';
import { mockBusinessMetrics } from '@/contexts/BusinessContext';

export default function MerchantDashboard() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const { selectedBusiness, isLoading } = useBusiness();

  const getLevelColor = (level: string) => {
    switch (level) {
      case "platinum":
        return "#b9f2ff";
      case "premier":
        return "#ffd700";
      case "basic":
        return "#8d8d8d";
      default:
        return "#8d8d8d";
    }
  };

  if (isLoading || !selectedBusiness) {
    return (
      <View style={{ flex: 1, backgroundColor: "#232323", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#ffffff" }}>Loading...</Text>
      </View>
    );
  }

  // Get metrics for the selected business
  const metrics = mockBusinessMetrics[selectedBusiness.id] || mockBusinessMetrics["1"];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#232323" }} edges={Platform.OS === "web" ? [] : ["top"]}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 16,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        {/* Business Switcher */}
        <BusinessSwitcher />

        {/* Hero Section */}
        <HeroSection
          title="Business"
          subtitle={`${selectedBusiness.name} • ${selectedBusiness.level.charAt(0).toUpperCase() + selectedBusiness.level.slice(1)} Level`}
        />

        {/* Quick Stats - 4 Column Layout */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginBottom: 24,
            gap: isMobile ? 12 : 16,
          }}
        >
          {[
            {
              label: "Total Sales",
              value: `$${Math.round(metrics.totalSales).toLocaleString()}`,
              icon: "attach-money",
              color: "#4caf50",
            },
            {
              label: "Total Orders",
              value: metrics.totalOrders.toLocaleString(),
              icon: "receipt",
              color: "#2196f3",
            },
            {
              label: "Customers",
              value: metrics.totalCustomers.toLocaleString(),
              icon: "people",
              color: "#ba9988",
            },
            {
              label: "Inventory",
              value: metrics.inventory.toLocaleString(),
              icon: "inventory",
              color: "#ff9800",
            },
          ].map((stat, index) => (
            <View
              key={index}
              style={{
                flex: isMobile ? 1 : 1,
                minWidth: isMobile ? "48%" : "23%",
                maxWidth: isMobile ? "48%" : "23%",
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: `${stat.color}20`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons name={stat.icon as any} size={24} color={stat.color} />
                </View>
              </View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "800",
                  color: "#ffffff",
                  marginBottom: 4,
                }}
              >
                {stat.value}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                {stat.label}
              </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions - 4 Column Layout */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Quick Actions
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <View style={{ flex: 1, minWidth: isMobile ? "48%" : "23%", maxWidth: isMobile ? "48%" : "23%", marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() => router.push("/pages/merchant/products")}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: isMobile ? 16 : 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  alignItems: "center",
                  minHeight: isMobile ? 110 : undefined,
                  justifyContent: "center",
                }}
              >
              <MaterialIcons name="inventory" size={isMobile ? 20 : 24} color="#ba9988" style={{ marginBottom: 8 }} />
              <Text
                style={{
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                Products
              </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, minWidth: isMobile ? "48%" : "23%", maxWidth: isMobile ? "48%" : "23%", marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() => router.push("/pages/merchant/qrcode")}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: isMobile ? 16 : 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  alignItems: "center",
                  minHeight: isMobile ? 110 : undefined,
                  justifyContent: "center",
                }}
              >
              <MaterialIcons name="qr-code" size={isMobile ? 20 : 24} color="#ba9988" style={{ marginBottom: 8 }} />
              <Text
                style={{
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                QR Code
              </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, minWidth: isMobile ? "48%" : "23%", maxWidth: isMobile ? "48%" : "23%", marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() => router.push("/pages/merchant/orders")}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: isMobile ? 16 : 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  alignItems: "center",
                  minHeight: isMobile ? 110 : undefined,
                  justifyContent: "center",
                }}
              >
              <MaterialIcons name="shopping-cart" size={isMobile ? 20 : 24} color="#ba9988" style={{ marginBottom: 8 }} />
              <Text
                style={{
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                Orders
              </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, minWidth: isMobile ? "48%" : "23%", maxWidth: isMobile ? "48%" : "23%", marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() => router.push("/pages/merchant/subscriptions")}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: isMobile ? 16 : 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  alignItems: "center",
                  minHeight: isMobile ? 110 : undefined,
                  justifyContent: "center",
                }}
              >
              <MaterialIcons name="subscriptions" size={isMobile ? 20 : 24} color="#ba9988" style={{ marginBottom: 8 }} />
              <Text
                style={{
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                Subscriptions
              </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, minWidth: isMobile ? "48%" : "23%", maxWidth: isMobile ? "48%" : "23%", marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() => router.push("/pages/merchant/analytics")}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: isMobile ? 16 : 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  alignItems: "center",
                  minHeight: isMobile ? 110 : undefined,
                  justifyContent: "center",
                }}
              >
              <MaterialIcons name="analytics" size={isMobile ? 20 : 24} color="#ba9988" style={{ marginBottom: 8 }} />
              <Text
                style={{
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                Analytics
              </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, minWidth: isMobile ? "48%" : "23%", maxWidth: isMobile ? "48%" : "23%", marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() => router.push("/pages/merchant/settings")}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: isMobile ? 16 : 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  alignItems: "center",
                  minHeight: isMobile ? 110 : undefined,
                  justifyContent: "center",
                }}
              >
              <MaterialIcons name="settings" size={isMobile ? 20 : 24} color="#ba9988" style={{ marginBottom: 8 }} />
              <Text
                style={{
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                Settings
              </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Recent Orders
          </Text>
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                paddingVertical: 20,
              }}
            >
              No recent orders. Start selling to see your activity!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
