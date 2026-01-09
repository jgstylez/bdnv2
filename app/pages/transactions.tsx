import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Transaction, TransactionType, TransactionStatus } from '@/types/transactions';
import { formatCurrency } from '@/lib/international';
import { FilterDropdown } from '@/components/admin/FilterDropdown';
import { HeroSection } from '@/components/layouts/HeroSection';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

// Mock transactions data
const mockTransactions: Transaction[] = [
  {
    id: "1",
    userId: "user1",
    type: "event-ticket",
    status: "completed",
    amount: 45.0,
    currency: "USD",
    description: "Jazz & Soul Food Night - General Admission",
    category: "Entertainment",
    relatedEntityId: "event1",
    relatedEntityType: "event",
    transactionId: "TXN-2024-001",
    fee: 4.50,
    feeType: "service",
    feePercentage: 10,
    netAmount: 45.0,
    createdAt: "2024-02-15T10:30:00Z",
    completedAt: "2024-02-15T10:30:05Z",
    metadata: { hasBDNPlus: false, hasReview: true },
  },
  {
    id: "2",
    userId: "user1",
    type: "token-purchase",
    status: "completed",
    amount: 150.0,
    currency: "USD",
    description: "BDN Tokens Purchase - 10 tokens",
    category: "Tokens",
    transactionId: "TXN-2024-002",
    createdAt: "2024-02-10T14:20:00Z",
    completedAt: "2024-02-10T14:20:03Z",
    metadata: { hasReview: false },
  },
  {
    id: "3",
    userId: "user1",
    type: "donation",
    status: "completed",
    amount: 50.0,
    currency: "USD",
    description: "Donation to Community Food Drive",
    category: "Donations",
    relatedEntityId: "org1",
    relatedEntityType: "nonprofit",
    transactionId: "TXN-2024-003",
    fee: 5.00,
    feeType: "service",
    feePercentage: 10,
    netAmount: 50.0,
    createdAt: "2024-02-08T09:15:00Z",
    completedAt: "2024-02-08T09:15:02Z",
    metadata: { hasBDNPlus: false, hasReview: false },
  },
  {
    id: "4",
    userId: "user1",
    type: "cashback",
    status: "completed",
    amount: 5.25,
    currency: "USD",
    description: "Cashback from purchase at Soul Food Kitchen",
    category: "Rewards",
    relatedEntityId: "business1",
    relatedEntityType: "business",
    createdAt: "2024-02-05T16:45:00Z",
    completedAt: "2024-02-05T16:45:01Z",
  },
  {
    id: "5",
    userId: "user1",
    type: "transfer",
    status: "completed",
    amount: 25.0,
    currency: "USD",
    description: "Transfer to @sarah_johnson",
    category: "Transfers",
    relatedEntityId: "user2",
    relatedEntityType: "user",
    transactionId: "TXN-2024-004",
    fee: 0,
    feeType: "service",
    feePercentage: 0,
    netAmount: 25.0,
    createdAt: "2024-02-03T11:20:00Z",
    completedAt: "2024-02-03T11:20:02Z",
    metadata: { hasBDNPlus: true },
  },
  {
    id: "6",
    userId: "user1",
    type: "payment",
    status: "pending",
    amount: 35.0,
    currency: "USD",
    description: "Payment to Black Business Network",
    category: "Payments",
    relatedEntityId: "business2",
    relatedEntityType: "business",
    transactionId: "TXN-2024-005",
    fee: 3.50,
    feeType: "service",
    feePercentage: 10,
    netAmount: 35.0,
    createdAt: "2024-02-20T08:00:00Z",
    metadata: { hasBDNPlus: false },
  },
  {
    id: "7",
    userId: "user1",
    type: "deposit",
    status: "completed",
    amount: 200.0,
    currency: "USD",
    description: "Deposit from bank account",
    category: "Deposits",
    paymentMethod: "Bank Account ****4321",
    transactionId: "TXN-2024-006",
    createdAt: "2024-02-01T12:00:00Z",
    completedAt: "2024-02-01T12:05:00Z",
  },
  {
    id: "8",
    userId: "user1",
    type: "withdrawal",
    status: "completed",
    amount: 100.0,
    currency: "USD",
    description: "Withdrawal to bank account",
    category: "Withdrawals",
    fee: 1.0,
    netAmount: 99.0,
    paymentMethod: "Bank Account ****4321",
    transactionId: "TXN-2024-007",
    createdAt: "2024-01-28T15:30:00Z",
    completedAt: "2024-01-28T15:35:00Z",
  },
];

const transactionTypes: TransactionType[] = [
  "payment",
  "transfer",
  "refund",
  "token-purchase",
  "event-ticket",
  "donation",
  "cashback",
  "withdrawal",
  "deposit",
  "fee",
];

export default function TransactionHistory() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [filterType, setFilterType] = useState<TransactionType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<TransactionStatus | "all">("all");

  const filteredTransactions = mockTransactions.filter((transaction) => {
    if (filterType !== "all" && transaction.type !== filterType) return false;
    if (filterStatus !== "all" && transaction.status !== filterStatus) return false;
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case "payment":
        return "payment";
      case "transfer":
        return "swap-horiz";
      case "refund":
        return "undo";
      case "token-purchase":
        return "account-balance-wallet";
      case "event-ticket":
        return "confirmation-number";
      case "donation":
        return "favorite";
      case "cashback":
        return "attach-money";
      case "withdrawal":
        return "arrow-downward";
      case "deposit":
        return "arrow-upward";
      case "fee":
        return "info";
      default:
        return "receipt";
    }
  };

  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case "deposit":
      case "cashback":
      case "refund":
        return "#4caf50"; // Green for money in
      case "withdrawal":
      case "payment":
      case "transfer":
      case "fee":
        return "#ff4444"; // Red for money out
      case "token-purchase":
      case "event-ticket":
      case "donation":
        return "#ba9988"; // Accent color
      default:
        return "rgba(255, 255, 255, 0.7)";
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case "completed":
        return "#4caf50";
      case "pending":
        return "#ff9800";
      case "failed":
        return "#f44336";
      case "cancelled":
        return "#9e9e9e";
      case "refunded":
        return "#2196f3";
      default:
        return "rgba(255, 255, 255, 0.6)";
    }
  };

  const formatTransactionType = (type: TransactionType) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const totalIncome = mockTransactions
    .filter((t) => ["deposit", "cashback", "refund"].includes(t.type) && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = mockTransactions
    .filter((t) => ["withdrawal", "payment", "transfer", "fee"].includes(t.type) && t.status === "completed")
    .reduce((sum, t) => sum + (t.netAmount || t.amount), 0);

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <OptimizedScrollView
        showBackToTop={true}
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        {/* Hero Section */}
        <HeroSection
          title="Transactions"
          subtitle="View and manage all your transactions"
        />

        {/* Summary Cards */}
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            marginBottom: 32,
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
              Total Income
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#4caf50",
              }}
            >
              ${totalIncome.toFixed(2)}
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
              Total Expenses
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#ff4444",
              }}
            >
              ${totalExpenses.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Filters */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              gap: 12,
            }}
          >
            <FilterDropdown
              label="Type"
              options={[
                { value: "all", label: "All Types" },
                { value: "payment", label: "Payment" },
                { value: "transfer", label: "Transfer" },
                { value: "event-ticket", label: "Event Ticket" },
                { value: "token-purchase", label: "Token Purchase" },
                { value: "donation", label: "Donation" },
                { value: "cashback", label: "Cashback" },
                { value: "deposit", label: "Deposit" },
                { value: "withdrawal", label: "Withdrawal" },
                { value: "refund", label: "Refund" },
                { value: "fee", label: "Fee" },
              ]}
              value={filterType}
              onSelect={(value) => setFilterType(value as TransactionType | "all")}
            />
            <FilterDropdown
              label="Status"
              options={[
                { value: "all", label: "All Status" },
                { value: "completed", label: "Completed" },
                { value: "pending", label: "Pending" },
                { value: "failed", label: "Failed" },
                { value: "cancelled", label: "Cancelled" },
                { value: "refunded", label: "Refunded" },
              ]}
              value={filterStatus}
              onSelect={(value) => setFilterStatus(value as TransactionStatus | "all")}
            />
          </View>
        </View>

        {/* Transactions List */}
        {filteredTransactions.length > 0 ? (
          <View style={{ gap: 12 }}>
            {filteredTransactions.map((transaction) => {
              const isIncome = ["deposit", "cashback", "refund"].includes(transaction.type);
              const amountColor = isIncome ? "#4caf50" : getTransactionColor(transaction.type);
              const showAmount = transaction.netAmount !== undefined ? transaction.netAmount : transaction.amount;
              // Allow reviews for completed transactions that have a related entity or are purchases
              const canReview = 
                transaction.status === "completed" && 
                (["payment", "event-ticket", "token-purchase", "donation"].includes(transaction.type) || 
                 transaction.relatedEntityType !== undefined);
              const hasReview = transaction.metadata?.hasReview || false;

              return (
                <TouchableOpacity
                  key={transaction.id}
                  onPress={() => {
                    router.push(`/pages/transactions/${transaction.id}`);
                  }}
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    {/* Icon */}
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: `${getTransactionColor(transaction.type)}20`,
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <MaterialIcons
                        name={getTransactionIcon(transaction.type) as any}
                        size={20}
                        color={getTransactionColor(transaction.type)}
                      />
                    </View>

                    {/* Main Content */}
                    <View style={{ flex: 1, minWidth: 0 }}>
                      {/* First Row: Description and Amount */}
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <View style={{ flex: 1, marginRight: 12, minWidth: 0, flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: "600",
                              color: "#ffffff",
                              flex: 1,
                            }}
                            numberOfLines={1}
                          >
                            {transaction.description}
                          </Text>
                          {canReview && (
                            <MaterialIcons
                              name={hasReview ? "star" : "star-outline"}
                              size={18}
                              color={hasReview ? "#ba9988" : "rgba(255, 255, 255, 0.4)"}
                              style={{ marginTop: 2 }}
                            />
                          )}
                        </View>
                        <View style={{ alignItems: "flex-end", flexShrink: 0 }}>
                          <Text
                            style={{
                              fontSize: 17,
                              fontWeight: "700",
                              color: amountColor,
                            }}
                          >
                            {isIncome ? "+" : "-"}{formatCurrency(showAmount, transaction.currency)}
                          </Text>
                        </View>
                      </View>

                      {/* Second Row: Category and Date */}
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        {transaction.category && (
                          <>
                            <Text
                              style={{
                                fontSize: 11,
                                color: "#ba9988",
                                fontWeight: "500",
                              }}
                            >
                              {transaction.category}
                            </Text>
                            <Text style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.3)" }}>•</Text>
                          </>
                        )}
                        <Text
                          style={{
                            fontSize: 11,
                            color: "rgba(255, 255, 255, 0.5)",
                          }}
                        >
                          {formatDate(transaction.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
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
                fontWeight: "600",
                color: "#ffffff",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              No Transactions Found
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
              }}
            >
              Try adjusting your filters to see more transactions
            </Text>
          </View>
        )}
      </OptimizedScrollView>
    </View>
  );
}

