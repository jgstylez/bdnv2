import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { UserBehaviorAnalytics } from '@/types/bi';

// Mock user behavior analytics
const mockUserBehavior: UserBehaviorAnalytics = {
  period: {
    start: "2024-02-01T00:00:00Z",
    end: "2024-02-29T23:59:59Z",
  },
  interactions: {
    pageViews: 125000,
    uniquePages: 45,
    averageSessionDuration: 420, // seconds
    bounceRate: 32.5,
  },
  actions: {
    searches: 18500,
    purchases: 1040,
    shares: 3200,
    reviews: 890,
    referrals: 450,
  },
  engagement: {
    dailyActiveUsers: 3500,
    weeklyActiveUsers: 8900,
    monthlyActiveUsers: 12500,
    retentionRate: 68.5,
  },
  topPages: [
    { path: "/pages/businesses", views: 25000, uniqueViews: 8500 },
    { path: "/pages/events", views: 18000, uniqueViews: 6200 },
    { path: "/pages/search", views: 15000, uniqueViews: 12000 },
    { path: "/(tabs)/dashboard", views: 22000, uniqueViews: 8900 },
    { path: "/pages/myimpact", views: 12000, uniqueViews: 4500 },
  ],
  topActions: [
    { action: "Search", count: 18500 },
    { action: "View Business", count: 12500 },
    { action: "Purchase", count: 1040 },
    { action: "Share", count: 3200 },
    { action: "Review", count: 890 },
  ],
  deviceBreakdown: [
    { device: "mobile", percentage: 68.5 },
    { device: "desktop", percentage: 28.2 },
    { device: "tablet", percentage: 3.3 },
  ],
  locationBreakdown: [
    { location: "Atlanta, GA", users: 3200, percentage: 25.6 },
    { location: "New York, NY", users: 2100, percentage: 16.8 },
    { location: "Los Angeles, CA", users: 1800, percentage: 14.4 },
    { location: "Chicago, IL", users: 1500, percentage: 12.0 },
    { location: "Houston, TX", users: 1200, percentage: 9.6 },
  ],
};

export default function UserBehavior() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const analytics = mockUserBehavior;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: 20,
          paddingBottom: 40,
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginBottom: 20, alignSelf: "flex-start" }}
          >
            <Text style={{ fontSize: 20, color: "#ffffff" }}>← Back</Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: isMobile ? 28 : 36,
              fontWeight: "800",
              color: "#ffffff",
              marginBottom: 8,
              letterSpacing: -1,
            }}
          >
            User Behavior Analytics
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Insights into user interactions and engagement patterns
          </Text>
        </View>

        {/* Key Metrics */}
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <View
            style={{
              flex: 1,
              minWidth: isMobile ? "100%" : 200,
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
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 8,
              }}
            >
              Page Views
            </Text>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "700",
                color: "#ba9988",
              }}
            >
              {analytics.interactions.pageViews.toLocaleString()}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              minWidth: isMobile ? "100%" : 200,
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
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 8,
              }}
            >
              Avg. Session Duration
            </Text>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "700",
                color: "#4caf50",
              }}
            >
              {formatDuration(analytics.interactions.averageSessionDuration)}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              minWidth: isMobile ? "100%" : 200,
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
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 8,
              }}
            >
              Bounce Rate
            </Text>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "700",
                color: "#ff9800",
              }}
            >
              {analytics.interactions.bounceRate.toFixed(1)}%
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              minWidth: isMobile ? "100%" : 200,
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
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 8,
              }}
            >
              Retention Rate
            </Text>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "700",
                color: "#2196f3",
              }}
            >
              {analytics.engagement.retentionRate.toFixed(1)}%
            </Text>
          </View>
        </View>

        {/* Engagement Metrics */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 20,
            }}
          >
            User Engagement
          </Text>
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              gap: 16,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
                Daily Active Users
              </Text>
              <Text style={{ fontSize: 28, fontWeight: "700", color: "#ba9988" }}>
                {analytics.engagement.dailyActiveUsers.toLocaleString()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
                Weekly Active Users
              </Text>
              <Text style={{ fontSize: 28, fontWeight: "700", color: "#4caf50" }}>
                {analytics.engagement.weeklyActiveUsers.toLocaleString()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
                Monthly Active Users
              </Text>
              <Text style={{ fontSize: 28, fontWeight: "700", color: "#2196f3" }}>
                {analytics.engagement.monthlyActiveUsers.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* User Actions */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 20,
            }}
          >
            User Actions
          </Text>
          <View style={{ gap: 12 }}>
            {analytics.actions.searches > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: "#232323",
                  borderRadius: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <MaterialIcons name="search" size={20} color="#ba9988" />
                  <Text style={{ fontSize: 16, color: "#ffffff", fontWeight: "600" }}>Searches</Text>
                </View>
                <Text style={{ fontSize: 18, color: "#ba9988", fontWeight: "700" }}>
                  {analytics.actions.searches.toLocaleString()}
                </Text>
              </View>
            )}
            {analytics.actions.purchases > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: "#232323",
                  borderRadius: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <MaterialIcons name="shopping-cart" size={20} color="#4caf50" />
                  <Text style={{ fontSize: 16, color: "#ffffff", fontWeight: "600" }}>Purchases</Text>
                </View>
                <Text style={{ fontSize: 18, color: "#4caf50", fontWeight: "700" }}>
                  {analytics.actions.purchases.toLocaleString()}
                </Text>
              </View>
            )}
            {analytics.actions.shares > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: "#232323",
                  borderRadius: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <MaterialIcons name="share" size={20} color="#2196f3" />
                  <Text style={{ fontSize: 16, color: "#ffffff", fontWeight: "600" }}>Shares</Text>
                </View>
                <Text style={{ fontSize: 18, color: "#2196f3", fontWeight: "700" }}>
                  {analytics.actions.shares.toLocaleString()}
                </Text>
              </View>
            )}
            {analytics.actions.reviews > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: "#232323",
                  borderRadius: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <MaterialIcons name="rate-review" size={20} color="#ff9800" />
                  <Text style={{ fontSize: 16, color: "#ffffff", fontWeight: "600" }}>Reviews</Text>
                </View>
                <Text style={{ fontSize: 18, color: "#ff9800", fontWeight: "700" }}>
                  {analytics.actions.reviews.toLocaleString()}
                </Text>
              </View>
            )}
            {analytics.actions.referrals > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: "#232323",
                  borderRadius: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <MaterialIcons name="people" size={20} color="#9c27b0" />
                  <Text style={{ fontSize: 16, color: "#ffffff", fontWeight: "600" }}>Referrals</Text>
                </View>
                <Text style={{ fontSize: 18, color: "#9c27b0", fontWeight: "700" }}>
                  {analytics.actions.referrals.toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Top Pages */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 20,
            }}
          >
            Top Pages
          </Text>
          <View style={{ gap: 12 }}>
            {analytics.topPages.map((page, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: "#232323",
                  borderRadius: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, color: "#ffffff", fontWeight: "600" }}>
                    {page.path}
                  </Text>
                  <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginTop: 4 }}>
                    {page.uniqueViews.toLocaleString()} unique views
                  </Text>
                </View>
                <Text style={{ fontSize: 18, color: "#ba9988", fontWeight: "700" }}>
                  {page.views.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Device Breakdown */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 20,
            }}
          >
            Device Breakdown
          </Text>
          <View style={{ gap: 12 }}>
            {analytics.deviceBreakdown.map((device, index) => (
              <View key={index}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#ffffff",
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                  >
                    {device.device}
                  </Text>
                  <Text style={{ fontSize: 16, color: "#ba9988", fontWeight: "700" }}>
                    {device.percentage.toFixed(1)}%
                  </Text>
                </View>
                <View
                  style={{
                    height: 8,
                    backgroundColor: "#232323",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      width: `${device.percentage}%`,
                      backgroundColor: "#ba9988",
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Location Breakdown */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 24,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 20,
            }}
          >
            Top Locations
          </Text>
          <View style={{ gap: 12 }}>
            {analytics.locationBreakdown.map((location, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: "#232323",
                  borderRadius: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, color: "#ffffff", fontWeight: "600" }}>
                    {location.location}
                  </Text>
                  <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginTop: 4 }}>
                    {location.users.toLocaleString()} users
                  </Text>
                </View>
                <Text style={{ fontSize: 18, color: "#ba9988", fontWeight: "700" }}>
                  {location.percentage.toFixed(1)}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

