import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { Cashback } from '@/types/impact';

// Mock cashback data
const mockCashback: Cashback[] = [
  {
    id: "1",
    userId: "user1",
    amount: 12.50,
    currency: "USD",
    percentage: 5,
    purchaseAmount: 250.00,
    merchantId: "merchant1",
    merchantName: "Soul Food Kitchen",
    transactionId: "txn-001",
    status: "completed",
    createdAt: "2024-02-15T10:30:00Z",
    processedAt: "2024-02-16T08:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    amount: 8.75,
    currency: "USD",
    percentage: 3.5,
    purchaseAmount: 250.00,
    merchantId: "merchant2",
    merchantName: "Black Beauty Salon",
    transactionId: "txn-002",
    status: "pending",
    createdAt: "2024-02-20T14:20:00Z",
  },
  {
    id: "3",
    userId: "user1",
    amount: 15.00,
    currency: "USD",
    percentage: 6,
    purchaseAmount: 250.00,
    merchantId: "merchant3",
    merchantName: "Community Bookstore",
    transactionId: "txn-003",
    status: "completed",
    createdAt: "2024-02-10T09:15:00Z",
    processedAt: "2024-02-11T08:00:00Z",
  },
];

export default function CashbackPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [selectedFilter, setSelectedFilter] = useState<"all" | Cashback["status"]>("all");

  const filteredCashback = selectedFilter === "all"
    ? mockCashback
    : mockCashback.filter((cb) => cb.status === selectedFilter);

  const totalCashback = mockCashback
    .filter((cb) => cb.status === "completed")
    .reduce((sum, cb) => sum + cb.amount, 0);

  const pendingCashback = mockCashback
    .filter((cb) => cb.status === "pending")
    .reduce((sum, cb) => sum + cb.amount, 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#4caf50";
      case "pending":
        return "#ffd700";
      case "cancelled":
        return "#ff4444";
      default:
        return "rgba(255, 255, 255, 0.5)";
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        {/* Cashback Summary */}
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <View
            style={{
              flex: 1,
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
              Total Cashback
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#4caf50",
              }}
            >
              ${totalCashback.toFixed(2)}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
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
              Pending
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#ffd700",
              }}
            >
              ${pendingCashback.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Filters */}
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
            { key: "all", label: "All" },
            { key: "completed", label: "Completed" },
            { key: "pending", label: "Pending" },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setSelectedFilter(filter.key as any)}
              style={{
                flex: 1,
                backgroundColor: selectedFilter === filter.key ? "#ba9988" : "transparent",
                borderRadius: 8,
                paddingVertical: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: selectedFilter === filter.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                }}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cashback History */}
        {filteredCashback.length > 0 ? (
          <View style={{ gap: 12 }}>
            {filteredCashback.map((cb) => (
              <View
                key={cb.id}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      {cb.merchantName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                        marginBottom: 8,
                      }}
                    >
                      {formatDate(cb.createdAt)}
                    </Text>
                    <View style={{ flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
                      <View>
                        <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>Purchase</Text>
                        <Text style={{ fontSize: 14, fontWeight: "600", color: "rgba(255, 255, 255, 0.7)" }}>
                          ${cb.purchaseAmount.toFixed(2)}
                        </Text>
                      </View>
                      <View>
                        <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>Cashback Rate</Text>
                        <Text style={{ fontSize: 14, fontWeight: "600", color: "#ba9988" }}>
                          {cb.percentage}%
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: "700",
                        color: getStatusColor(cb.status),
                      }}
                    >
                      ${cb.amount.toFixed(2)}
                    </Text>
                    <View
                      style={{
                        backgroundColor: `${getStatusColor(cb.status)}20`,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 8,
                        marginTop: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "600",
                          color: getStatusColor(cb.status),
                          textTransform: "uppercase",
                        }}
                      >
                        {cb.status}
                      </Text>
                    </View>
                  </View>
                </View>
                {cb.processedAt && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.5)",
                      marginTop: 8,
                      paddingTop: 8,
                      borderTopWidth: 1,
                      borderTopColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  >
                    Processed: {formatDate(cb.processedAt)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 40,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <MaterialIcons name="account-balance-wallet" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              No cashback found for this filter
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

