import React from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
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
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        {/* Business Switcher */}
        <BusinessSwitcher />

        {/* Hero Section */}
        <HeroSection
          title="Business Dashboard"
          subtitle={`${selectedBusiness.name} • ${selectedBusiness.level.charAt(0).toUpperCase() + selectedBusiness.level.slice(1)} Level`}
        />

        {/* Quick Stats - 4 Column Layout */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 24,
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
                flex: isMobile ? "0 0 calc(50% - 8px)" : "0 0 calc(25% - 12px)",
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
            <TouchableOpacity
              onPress={() => router.push("/pages/merchant/products")}
              style={{
                flex: 1,
                minWidth: 0,
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: isMobile ? 16 : 20,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
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
            <TouchableOpacity
              onPress={() => router.push("/pages/merchant/qrcode")}
              style={{
                flex: 1,
                minWidth: 0,
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: isMobile ? 16 : 20,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
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
            <TouchableOpacity
              onPress={() => router.push("/pages/merchant/orders")}
              style={{
                flex: 1,
                minWidth: 0,
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: isMobile ? 16 : 20,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
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
             <TouchableOpacity
              onPress={() => router.push("/pages/merchant/subscriptions")}
              style={{
                flex: 1,
                minWidth: 0,
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: isMobile ? 16 : 20,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
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
            <TouchableOpacity
              onPress={() => router.push("/pages/merchant/analytics")}
              style={{
                flex: 1,
                minWidth: 0,
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: isMobile ? 16 : 20,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
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
            <TouchableOpacity
              onPress={() => router.push("/pages/merchant/settings")}
              style={{
                flex: 1,
                minWidth: 0,
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: isMobile ? 16 : 20,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
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
    </View>
  );
}
