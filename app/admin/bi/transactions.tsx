import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { TransactionReport } from '@/types/bi';

// Mock transaction report
const mockTransactionReport: TransactionReport = {
  period: {
    start: "2024-02-01T00:00:00Z",
    end: "2024-02-29T23:59:59Z",
  },
  summary: {
    totalTransactions: 1040,
    totalRevenue: 57500,
    totalFees: 2875,
    netRevenue: 54625,
    currency: "USD",
    averageTransactionValue: 55.29,
  },
  byType: [
    { type: "Payment", count: 450, revenue: 24800, percentage: 43.1 },
    { type: "Event Ticket", count: 180, revenue: 8100, percentage: 14.1 },
    { type: "Token Purchase", count: 250, revenue: 18750, percentage: 32.6 },
    { type: "Donation", count: 120, revenue: 6000, percentage: 10.4 },
    { type: "Transfer", count: 40, revenue: 850, percentage: 1.5 },
  ],
  byStatus: [
    { status: "completed", count: 1000, revenue: 55000, percentage: 96.2 },
    { status: "pending", count: 30, revenue: 4000, percentage: 2.9 },
    { status: "failed", count: 10, revenue: 500, percentage: 0.9 },
  ],
  byBusiness: [
    {
      businessId: "business1",
      businessName: "Soul Food Kitchen",
      transactionCount: 450,
      revenue: 45000,
      fees: 2250,
    },
    {
      businessId: "business2",
      businessName: "Black Business Network",
      transactionCount: 180,
      revenue: 12500,
      fees: 625,
    },
  ],
  trends: [
    { date: "2024-02-01", transactions: 35, revenue: 1935 },
    { date: "2024-02-05", transactions: 42, revenue: 2322 },
    { date: "2024-02-10", transactions: 38, revenue: 2101 },
    { date: "2024-02-15", transactions: 45, revenue: 2488 },
    { date: "2024-02-20", transactions: 50, revenue: 2765 },
    { date: "2024-02-25", transactions: 48, revenue: 2654 },
    { date: "2024-02-29", transactions: 52, revenue: 2876 },
  ],
  topTransactions: [
    {
      id: "txn1",
      type: "Token Purchase",
      amount: 300,
      currency: "USD",
      userName: "John Doe",
      date: "2024-02-15T10:30:00Z",
    },
    {
      id: "txn2",
      type: "Event Ticket",
      amount: 85,
      currency: "USD",
      businessName: "Soul Food Kitchen",
      userName: "Jane Smith",
      date: "2024-02-14T14:20:00Z",
    },
    {
      id: "txn3",
      type: "Payment",
      amount: 150,
      currency: "USD",
      businessName: "Soul Food Kitchen",
      userName: "Bob Johnson",
      date: "2024-02-13T09:15:00Z",
    },
  ],
};

export default function TransactionTracking() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "quarter" | "year">("month");
  const report = mockTransactionReport;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
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
            Transaction Tracking
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Detailed financial reporting and transaction analysis
          </Text>
        </View>

        {/* Period Selector */}
        <View style={{ marginBottom: 24 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {(["week", "month", "quarter", "year"] as const).map((period) => (
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

        {/* Summary Cards */}
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
              Total Transactions
            </Text>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "700",
                color: "#ba9988",
              }}
            >
              {report.summary.totalTransactions.toLocaleString()}
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
              Total Revenue
            </Text>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "700",
                color: "#4caf50",
              }}
            >
              ${report.summary.totalRevenue.toLocaleString()}
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
              Platform Fees
            </Text>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "700",
                color: "#ff9800",
              }}
            >
              ${report.summary.totalFees.toLocaleString()}
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
              Net Revenue
            </Text>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "700",
                color: "#2196f3",
              }}
            >
              ${report.summary.netRevenue.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Transactions by Type */}
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
            Transactions by Type
          </Text>
          <View style={{ gap: 16 }}>
            {report.byType.map((item, index) => (
              <View key={index}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, color: "#ffffff", fontWeight: "600" }}>
                      {item.type}
                    </Text>
                    <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginTop: 4 }}>
                      {item.count} transactions
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ fontSize: 18, color: "#ba9988", fontWeight: "700" }}>
                      ${item.revenue.toLocaleString()}
                    </Text>
                    <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginTop: 4 }}>
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
                      backgroundColor: "#ba9988",
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Transactions by Status */}
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
            Transactions by Status
          </Text>
          <View style={{ gap: 12 }}>
            {report.byStatus.map((item, index) => {
              const statusColor =
                item.status === "completed"
                  ? "#4caf50"
                  : item.status === "pending"
                  ? "#ff9800"
                  : "#f44336";
              return (
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
                    <Text
                      style={{
                        fontSize: 16,
                        color: "#ffffff",
                        fontWeight: "600",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.status}
                    </Text>
                    <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginTop: 4 }}>
                      {item.count} transactions
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ fontSize: 18, color: statusColor, fontWeight: "700" }}>
                      ${item.revenue.toLocaleString()}
                    </Text>
                    <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginTop: 4 }}>
                      {item.percentage.toFixed(1)}%
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Revenue by Business */}
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
            Revenue by Business
          </Text>
          <View style={{ gap: 12 }}>
            {report.byBusiness.map((business) => (
              <View
                key={business.businessId}
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  backgroundColor: "#232323",
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: "#ffffff",
                    fontWeight: "600",
                    marginBottom: 12,
                  }}
                >
                  {business.businessName}
                </Text>
                <View
                  style={{
                    flexDirection: isMobile ? "column" : "row",
                    gap: 16,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginBottom: 4 }}>
                      Transactions
                    </Text>
                    <Text style={{ fontSize: 20, fontWeight: "700", color: "#ba9988" }}>
                      {business.transactionCount}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginBottom: 4 }}>
                      Revenue
                    </Text>
                    <Text style={{ fontSize: 20, fontWeight: "700", color: "#4caf50" }}>
                      ${business.revenue.toLocaleString()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginBottom: 4 }}>
                      Platform Fees
                    </Text>
                    <Text style={{ fontSize: 20, fontWeight: "700", color: "#ff9800" }}>
                      ${business.fees.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Top Transactions */}
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
            Top Transactions
          </Text>
          <View style={{ gap: 12 }}>
            {report.topTransactions.map((transaction) => (
              <View
                key={transaction.id}
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
                    {transaction.type}
                  </Text>
                  <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginTop: 4 }}>
                    {transaction.businessName || transaction.userName} • {formatDate(transaction.date)}
                  </Text>
                </View>
                <Text style={{ fontSize: 18, color: "#ba9988", fontWeight: "700" }}>
                  ${transaction.amount.toFixed(2)} {transaction.currency}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

