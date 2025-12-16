import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

// Mock revenue data
const mockRevenueData = {
  transactionFees: {
    total: 28750,
    percentage: 5,
    transactions: 57500,
    period: "February 2024",
  },
  tokenSales: {
    total: 187500,
    tokensSold: 12500,
    pricePerToken: 15,
    period: "February 2024",
  },
  merchantFees: {
    total: 12500,
    businesses: 450,
    averagePerBusiness: 27.78,
    period: "February 2024",
  },
  premiumSubscriptions: {
    total: 45000,
    subscribers: 4500,
    averagePerSubscriber: 10,
    period: "February 2024",
  },
  revenueSharing: {
    totalDistributed: 250000,
    toUsers: 150000,
    toOrganizations: 100000,
    period: "February 2024",
  },
};

export default function BusinessModel() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [selectedPeriod, setSelectedPeriod] = useState<"month" | "quarter" | "year">("month");

  const totalRevenue =
    mockRevenueData.transactionFees.total +
    mockRevenueData.tokenSales.total +
    mockRevenueData.merchantFees.total +
    mockRevenueData.premiumSubscriptions.total;

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
            Business Model Overview
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Comprehensive view of platform revenue streams
          </Text>
        </View>

        {/* Period Selector */}
        <View style={{ marginBottom: 24 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {(["month", "quarter", "year"] as const).map((period) => (
              <TouchableOpacity
                key={period}
                onPress={() => setSelectedPeriod(period)}
                style={{
                  backgroundColor: selectedPeriod === period ? "#ba9988" : "#474747",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: selectedPeriod === period ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: selectedPeriod === period ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                    textTransform: "capitalize",
                  }}
                >
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Total Revenue */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 24,
            marginBottom: 32,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: 8,
            }}
          >
            Total Platform Revenue
          </Text>
          <Text
            style={{
              fontSize: 48,
              fontWeight: "800",
              color: "#ba9988",
              marginBottom: 4,
            }}
          >
            ${totalRevenue.toLocaleString()}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            {mockRevenueData.transactionFees.period}
          </Text>
        </View>

        {/* Revenue Streams */}
        <View style={{ gap: 20, marginBottom: 32 }}>
          {/* Transaction Fees */}
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "rgba(186, 153, 136, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons name="payment" size={24} color="#ba9988" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  Transaction Fees
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  {mockRevenueData.transactionFees.percentage}% fee on all transactions
                </Text>
              </View>
            </View>
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                  Total Revenue
                </Text>
                <Text style={{ fontSize: 24, fontWeight: "700", color: "#ba9988" }}>
                  ${mockRevenueData.transactionFees.total.toLocaleString()}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                  Total Transactions
                </Text>
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#ffffff" }}>
                  {mockRevenueData.transactionFees.transactions.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Token Sales */}
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "rgba(186, 153, 136, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons name="account-balance-wallet" size={24} color="#ba9988" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  Token Sales
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  Revenue from BDN token purchases
                </Text>
              </View>
            </View>
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                  Total Revenue
                </Text>
                <Text style={{ fontSize: 24, fontWeight: "700", color: "#ba9988" }}>
                  ${mockRevenueData.tokenSales.total.toLocaleString()}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                  Tokens Sold
                </Text>
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#ffffff" }}>
                  {mockRevenueData.tokenSales.tokensSold.toLocaleString()}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                  Price per Token
                </Text>
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#ffffff" }}>
                  ${mockRevenueData.tokenSales.pricePerToken.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Merchant Fees */}
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "rgba(186, 153, 136, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons name="store" size={24} color="#ba9988" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  Merchant Fees
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  Fees for business services and features
                </Text>
              </View>
            </View>
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                  Total Revenue
                </Text>
                <Text style={{ fontSize: 24, fontWeight: "700", color: "#ba9988" }}>
                  ${mockRevenueData.merchantFees.total.toLocaleString()}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                  Active Businesses
                </Text>
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#ffffff" }}>
                  {mockRevenueData.merchantFees.businesses}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                  Average per Business
                </Text>
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#ffffff" }}>
                  ${mockRevenueData.merchantFees.averagePerBusiness.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Premium Subscriptions */}
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "rgba(186, 153, 136, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons name="workspace-premium" size={24} color="#ba9988" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  Premium Features (BDN+)
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  Subscription revenue from BDN+ memberships
                </Text>
              </View>
            </View>
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                  Total Revenue
                </Text>
                <Text style={{ fontSize: 24, fontWeight: "700", color: "#ba9988" }}>
                  ${mockRevenueData.premiumSubscriptions.total.toLocaleString()}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                  Active Subscribers
                </Text>
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#ffffff" }}>
                  {mockRevenueData.premiumSubscriptions.subscribers.toLocaleString()}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                  Average per Subscriber
                </Text>
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#ffffff" }}>
                  ${mockRevenueData.premiumSubscriptions.averagePerSubscriber.toFixed(2)}/month
                </Text>
              </View>
            </View>
          </View>

          {/* Revenue Sharing */}
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "rgba(186, 153, 136, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons name="account-balance" size={24} color="#ba9988" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  Revenue Sharing
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  Distribution of fees to users and organizations
                </Text>
              </View>
            </View>
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                  Total Distributed
                </Text>
                <Text style={{ fontSize: 24, fontWeight: "700", color: "#4caf50" }}>
                  ${mockRevenueData.revenueSharing.totalDistributed.toLocaleString()}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#232323",
                  borderRadius: 12,
                  padding: 16,
                  marginTop: 8,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                  <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                    To Users
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: "600", color: "#4caf50" }}>
                    ${mockRevenueData.revenueSharing.toUsers.toLocaleString()}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                    To Organizations
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: "600", color: "#4caf50" }}>
                    ${mockRevenueData.revenueSharing.toOrganizations.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Revenue Breakdown Chart */}
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
            Revenue Breakdown
          </Text>
          <View style={{ gap: 16 }}>
            {[
              {
                label: "Transaction Fees",
                amount: mockRevenueData.transactionFees.total,
                percentage: (mockRevenueData.transactionFees.total / totalRevenue) * 100,
                color: "#ba9988",
              },
              {
                label: "Token Sales",
                amount: mockRevenueData.tokenSales.total,
                percentage: (mockRevenueData.tokenSales.total / totalRevenue) * 100,
                color: "#4caf50",
              },
              {
                label: "Merchant Fees",
                amount: mockRevenueData.merchantFees.total,
                percentage: (mockRevenueData.merchantFees.total / totalRevenue) * 100,
                color: "#2196f3",
              },
              {
                label: "Premium Subscriptions",
                amount: mockRevenueData.premiumSubscriptions.total,
                percentage: (mockRevenueData.premiumSubscriptions.total / totalRevenue) * 100,
                color: "#ff9800",
              },
            ].map((item, index) => (
              <View key={index}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                  <Text style={{ fontSize: 16, color: "#ffffff", fontWeight: "600" }}>
                    {item.label}
                  </Text>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ fontSize: 18, color: item.color, fontWeight: "700" }}>
                      ${item.amount.toLocaleString()}
                    </Text>
                    <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginTop: 2 }}>
                      {item.percentage.toFixed(1)}%
                    </Text>
                  </View>
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
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

