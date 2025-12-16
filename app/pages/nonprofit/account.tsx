import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { OrganizationTransaction } from "../../../types/nonprofit";

// Mock transactions
const mockTransactions: OrganizationTransaction[] = [
  {
    id: "1",
    organizationId: "org1",
    type: "donation",
    amount: 100.00,
    currency: "USD",
    description: "Donation from John Doe",
    donorId: "user1",
    donorName: "John Doe",
    campaignId: "1",
    status: "completed",
    createdAt: "2024-02-15T10:30:00Z",
    processedAt: "2024-02-15T10:30:05Z",
  },
  {
    id: "2",
    organizationId: "org1",
    type: "donation",
    amount: 50.00,
    currency: "USD",
    description: "Donation from Jane Smith",
    donorId: "user2",
    donorName: "Jane Smith",
    campaignId: "1",
    status: "completed",
    createdAt: "2024-02-15T09:15:00Z",
    processedAt: "2024-02-15T09:15:03Z",
  },
  {
    id: "3",
    organizationId: "org1",
    type: "withdrawal",
    amount: 500.00,
    currency: "USD",
    description: "Withdrawal to bank account",
    status: "completed",
    createdAt: "2024-02-14T14:20:00Z",
    processedAt: "2024-02-14T14:25:00Z",
  },
  {
    id: "4",
    organizationId: "org1",
    type: "donation",
    amount: 25.00,
    currency: "BLKD",
    description: "Donation from Anonymous",
    donorName: "Anonymous",
    campaignId: "2",
    status: "completed",
    createdAt: "2024-02-14T08:00:00Z",
    processedAt: "2024-02-14T08:00:02Z",
  },
];

export default function OrganizationAccount() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const usdBalance = 12500.50;
  const blkdBalance = 850.25;
  const filteredTransactions = mockTransactions;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "donation":
        return "favorite";
      case "withdrawal":
        return "arrow-downward";
      case "transfer":
        return "swap-horiz";
      case "fee":
        return "receipt";
      default:
        return "payment";
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "donation":
        return "#4caf50";
      case "withdrawal":
        return "#f44336";
      case "transfer":
        return "#2196f3";
      case "fee":
        return "#ff9800";
      default:
        return "#ba9988";
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
        {/* Balance Card */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 24,
            marginBottom: 32,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: 16,
            }}
          >
            Current Balance
          </Text>
          <View style={{ gap: 12, marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
              <Text
                style={{
                  fontSize: isMobile ? 36 : 48,
                  fontWeight: "800",
                  color: "#ffffff",
                }}
              >
                ${usdBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: "600",
                }}
              >
                USD
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
              <Text
                style={{
                  fontSize: isMobile ? 36 : 48,
                  fontWeight: "800",
                  color: "#ba9988",
                }}
              >
                {blkdBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(186, 153, 136, 0.6)",
                  fontWeight: "600",
                }}
              >
                BLKD
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#232323",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <MaterialIcons name="arrow-downward" size={18} color="#ba9988" />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                Withdraw
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#232323",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <MaterialIcons name="swap-horiz" size={18} color="#ba9988" />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                Transfer
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transactions */}
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Recent Transactions
          </Text>
          {filteredTransactions.length > 0 ? (
            <View style={{ gap: 12 }}>
              {filteredTransactions.map((transaction) => (
                <View
                  key={transaction.id}
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: `${getTransactionColor(transaction.type)}20`,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MaterialIcons
                        name={getTransactionIcon(transaction.type) as any}
                        size={24}
                        color={getTransactionColor(transaction.type)}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "700",
                          color: "#ffffff",
                          marginBottom: 4,
                        }}
                      >
                        {transaction.description}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        {formatDate(transaction.createdAt)}
                      </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "700",
                          color: transaction.type === "donation" ? "#4caf50" : "#f44336",
                        }}
                      >
                        {transaction.type === "donation" ? "+" : "-"}
                        {transaction.currency === "USD" ? "$" : ""}
                        {transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        {transaction.currency === "BLKD" ? " BLKD" : ""}
                      </Text>
                      <View
                        style={{
                          backgroundColor: transaction.status === "completed" ? "rgba(76, 175, 80, 0.15)" : "rgba(255, 152, 0, 0.15)",
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 6,
                          marginTop: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            color: transaction.status === "completed" ? "#4caf50" : "#ff9800",
                            fontWeight: "600",
                            textTransform: "capitalize",
                          }}
                        >
                          {transaction.status}
                        </Text>
                      </View>
                    </View>
                  </View>
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
              <MaterialIcons name="receipt" size={48} color="rgba(186, 153, 136, 0.5)" />
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.6)",
                  textAlign: "center",
                  marginTop: 16,
                }}
              >
                No transactions found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

