import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { LineChart } from "../../components/charts/LineChart";
import { BarChart } from "../../components/charts/BarChart";
import { PieChart } from "../../components/charts/PieChart";
import { AreaChart } from "../../components/charts/AreaChart";

export default function AdminAnalytics() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [selectedPeriod, setSelectedPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");

  const metrics = [
    { label: "New Users", value: 1250, change: 12.5, trend: "up" },
    { label: "Active Users", value: 8900, change: 8.3, trend: "up" },
    { label: "New Businesses", value: 45, change: -5.2, trend: "down" },
    { label: "Total Revenue", value: 1250000, change: 15.8, trend: "up" },
    { label: "Transactions", value: 12500, change: 22.1, trend: "up" },
    { label: "Support Tickets", value: 45, change: -10.5, trend: "down" },
  ];

  // Chart data
  const userGrowthData = [
    { label: "Jan", value: 7500 },
    { label: "Feb", value: 8200 },
    { label: "Mar", value: 8900 },
    { label: "Apr", value: 9500 },
    { label: "May", value: 10200 },
    { label: "Jun", value: 11000 },
  ];

  const revenueData = [
    { label: "Jan", value: 950000, color: "#ba9988" },
    { label: "Feb", value: 1100000, color: "#4caf50" },
    { label: "Mar", value: 1250000, color: "#2196f3" },
    { label: "Apr", value: 1180000, color: "#ff9800" },
    { label: "May", value: 1320000, color: "#9c27b0" },
    { label: "Jun", value: 1450000, color: "#ba9988" },
  ];

  const userTypeData = [
    { label: "Consumers", value: 10500, color: "#ba9988" },
    { label: "Businesses", value: 450, color: "#4caf50" },
    { label: "Nonprofits", value: 89, color: "#2196f3" },
  ];

  const transactionTrendData = [
    { label: "Mon", value: 1850 },
    { label: "Tue", value: 2100 },
    { label: "Wed", value: 1950 },
    { label: "Thu", value: 2250 },
    { label: "Fri", value: 2400 },
    { label: "Sat", value: 1800 },
    { label: "Sun", value: 1500 },
  ];

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
        {/* Description */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Platform analytics and insights
          </Text>
        </View>

        {/* Period Selector */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#474747",
            borderRadius: 12,
            padding: 4,
            marginBottom: 24,
          }}
        >
          {[
            { key: "daily", label: "Daily" },
            { key: "weekly", label: "Weekly" },
            { key: "monthly", label: "Monthly" },
            { key: "yearly", label: "Yearly" },
          ].map((period) => (
            <TouchableOpacity
              key={period.key}
              onPress={() => setSelectedPeriod(period.key as any)}
              style={{
                flex: 1,
                backgroundColor: selectedPeriod === period.key ? "#ffd700" : "transparent",
                borderRadius: 8,
                paddingVertical: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: selectedPeriod === period.key ? "#232323" : "rgba(255, 255, 255, 0.7)",
                }}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Metrics Grid */}
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {metrics.map((metric, index) => (
            <View
              key={index}
              style={{
                width: isMobile ? "100%" : "48%",
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
                {metric.label}
              </Text>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "700",
                  color: "#ba9988",
                  marginBottom: 8,
                }}
              >
                {typeof metric.value === "number" && metric.value > 1000
                  ? metric.value.toLocaleString()
                  : metric.value}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <MaterialIcons
                  name={metric.trend === "up" ? "trending-up" : "trending-down"}
                  size={16}
                  color={metric.trend === "up" ? "#4caf50" : "#ff4444"}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: metric.trend === "up" ? "#4caf50" : "#ff4444",
                  }}
                >
                  {metric.change > 0 ? "+" : ""}
                  {metric.change}%
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Charts Section */}
        <View style={{ gap: 24 }}>
          {/* User Growth Chart */}
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
              User Growth Trend
            </Text>
            <LineChart data={userGrowthData} height={250} color="#ba9988" />
          </View>

          {/* Revenue Chart */}
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
              Revenue by Month
            </Text>
            <BarChart data={revenueData} height={250} />
          </View>

          {/* User Type Distribution */}
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
              User Type Distribution
            </Text>
            <PieChart data={userTypeData} size={isMobile ? 250 : 300} />
          </View>

          {/* Transaction Trends */}
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
              Weekly Transaction Trends
            </Text>
            <AreaChart data={transactionTrendData} height={250} color="#4caf50" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

