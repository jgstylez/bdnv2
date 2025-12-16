import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { Transaction, TransactionType, TransactionStatus } from "../../../types/transactions";
import { formatCurrency } from "../../../lib/international";
import { useResponsive } from "../../../hooks/useResponsive";
import { HeroSection } from "../../../components/layouts/HeroSection";

// Mock transactions data - in production, fetch by ID
const mockTransactions: Record<string, Transaction> = {
  "1": {
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
    paymentMethod: "Credit Card ****1234",
    metadata: { hasBDNPlus: false, hasReview: true },
  },
  "2": {
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
    paymentMethod: "Credit Card ****1234",
    metadata: { hasReview: false },
  },
  "3": {
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
    paymentMethod: "Credit Card ****1234",
    metadata: { hasBDNPlus: false, hasReview: false },
  },
};

export default function TransactionDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isMobile, scrollViewBottomPadding } = useResponsive();

  const transaction = mockTransactions[id || "1"] || mockTransactions["1"];

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
        return "#4caf50";
      case "withdrawal":
      case "payment":
      case "transfer":
      case "fee":
        return "#ff4444";
      case "token-purchase":
      case "event-ticket":
      case "donation":
        return "#ba9988";
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatTransactionType = (type: TransactionType) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const isIncome = ["deposit", "cashback", "refund"].includes(transaction.type);
  const amountColor = isIncome ? "#4caf50" : getTransactionColor(transaction.type);
  const showAmount = transaction.netAmount !== undefined ? transaction.netAmount : transaction.amount;
  // Allow reviews for completed transactions that have a related entity (business, event, etc.) or are purchases
  const canReview = 
    transaction.status === "completed" && 
    (["payment", "event-ticket", "token-purchase", "donation"].includes(transaction.type) || 
     transaction.relatedEntityType !== undefined);
  const hasReview = transaction.metadata?.hasReview || false;

  const handleLeaveReview = () => {
    if (transaction.relatedEntityType === "event" && transaction.relatedEntityId) {
      router.push(`/pages/events/${transaction.relatedEntityId}?review=true`);
    } else if (transaction.relatedEntityType === "business" && transaction.relatedEntityId) {
      router.push(`/pages/businesses/${transaction.relatedEntityId}?review=true`);
    } else if (transaction.type === "token-purchase") {
      // For token purchases, could navigate to a general review page or the tokens page
      router.push(`/pages/tokens?review=true`);
    } else {
      // Fallback: navigate to a general review page or back to transactions
      router.push(`/pages/transactions?review=true&transactionId=${transaction.id}`);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
            <Text
              style={{
                fontSize: 16,
                color: "#ffffff",
                marginLeft: 8,
              }}
            >
              Back to Transactions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Receipt Card */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 24,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            marginBottom: 24,
          }}
        >
          {/* Receipt Header */}
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: `${getTransactionColor(transaction.type)}20`,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <MaterialIcons
                name={getTransactionIcon(transaction.type) as any}
                size={32}
                color={getTransactionColor(transaction.type)}
              />
            </View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 8,
              }}
            >
              {formatTransactionType(transaction.type)}
            </Text>
            <View
              style={{
                backgroundColor: `${getStatusColor(transaction.status)}20`,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: getStatusColor(transaction.status),
                  fontWeight: "600",
                  textTransform: "capitalize",
                }}
              >
                {transaction.status}
              </Text>
            </View>
          </View>

          {/* Transaction Details */}
          <View style={{ gap: 20 }}>
            {/* Description */}
            <View>
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.6)",
                  marginBottom: 4,
                }}
              >
                Description
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                {transaction.description}
              </Text>
            </View>

            {/* Amount */}
            <View>
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.6)",
                  marginBottom: 4,
                }}
              >
                Amount
              </Text>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "700",
                  color: amountColor,
                }}
              >
                {isIncome ? "+" : "-"}{formatCurrency(showAmount, transaction.currency)}
              </Text>
            </View>

            {/* Divider */}
            <View
              style={{
                height: 1,
                backgroundColor: "rgba(186, 153, 136, 0.2)",
              }}
            />

            {/* Transaction ID */}
            {transaction.transactionId && (
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.6)",
                    marginBottom: 4,
                  }}
                >
                  Transaction ID
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#ffffff",
                    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                  }}
                >
                  {transaction.transactionId}
                </Text>
              </View>
            )}

            {/* Category */}
            {transaction.category && (
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.6)",
                    marginBottom: 4,
                  }}
                >
                  Category
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#ba9988",
                    fontWeight: "500",
                  }}
                >
                  {transaction.category}
                </Text>
              </View>
            )}

            {/* Payment Method */}
            {transaction.paymentMethod && (
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.6)",
                    marginBottom: 4,
                  }}
                >
                  Payment Method
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#ffffff",
                  }}
                >
                  {transaction.paymentMethod}
                </Text>
              </View>
            )}

            {/* Dates */}
            <View>
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.6)",
                  marginBottom: 4,
                }}
              >
                Date
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#ffffff",
                }}
              >
                {formatDate(transaction.createdAt)}
              </Text>
            </View>

            {transaction.completedAt && (
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.6)",
                    marginBottom: 4,
                  }}
                >
                  Completed At
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#ffffff",
                  }}
                >
                  {formatDate(transaction.completedAt)}
                </Text>
              </View>
            )}

            {/* Fee Breakdown */}
            {transaction.fee !== undefined && (
              <>
                <View
                  style={{
                    height: 1,
                    backgroundColor: "rgba(186, 153, 136, 0.2)",
                  }}
                />
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.6)",
                      marginBottom: 8,
                    }}
                  >
                    Fee Breakdown
                  </Text>
                  <View style={{ gap: 8 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "rgba(255, 255, 255, 0.8)",
                        }}
                      >
                        Subtotal
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#ffffff",
                          fontWeight: "500",
                        }}
                      >
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </Text>
                    </View>
                    {transaction.fee > 0 && (
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: "rgba(255, 255, 255, 0.8)",
                            }}
                          >
                            {transaction.feeType === "service"
                              ? "Service Fee"
                              : transaction.feeType === "platform"
                              ? "Platform Fee"
                              : "Fee"}
                            {transaction.feePercentage && ` (${transaction.feePercentage}%)`}
                          </Text>
                          {transaction.metadata?.hasBDNPlus && transaction.feeType === "service" && (
                            <View
                              style={{
                                backgroundColor: "rgba(186, 153, 136, 0.2)",
                                paddingHorizontal: 4,
                                paddingVertical: 1,
                                borderRadius: 3,
                              }}
                            >
                              <Text style={{ fontSize: 8, color: "#ba9988", fontWeight: "600" }}>
                                BDN+
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "rgba(255, 255, 255, 0.8)",
                          }}
                        >
                          {formatCurrency(transaction.fee, transaction.currency)}
                        </Text>
                      </View>
                    )}
                    {transaction.fee === 0 && transaction.metadata?.hasBDNPlus && transaction.feeType === "service" && (
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: "#ba9988",
                              fontStyle: "italic",
                            }}
                          >
                            Service Fee (Waived)
                          </Text>
                          <View
                            style={{
                              backgroundColor: "rgba(186, 153, 136, 0.2)",
                              paddingHorizontal: 4,
                              paddingVertical: 1,
                              borderRadius: 3,
                            }}
                          >
                            <Text style={{ fontSize: 8, color: "#ba9988", fontWeight: "600" }}>
                              BDN+
                            </Text>
                          </View>
                        </View>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#ba9988",
                            fontStyle: "italic",
                          }}
                        >
                          {formatCurrency(0, transaction.currency)}
                        </Text>
                      </View>
                    )}
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "rgba(186, 153, 136, 0.2)",
                        marginTop: 4,
                      }}
                    />
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "700",
                          color: "#ffffff",
                        }}
                      >
                        Total
                      </Text>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "700",
                          color: amountColor,
                        }}
                      >
                        {isIncome ? "+" : "-"}{formatCurrency(showAmount, transaction.currency)}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Review Section */}
        {canReview && (
          <View
            style={{
              backgroundColor: hasReview ? "#474747" : "rgba(186, 153, 136, 0.1)",
              borderRadius: 16,
              padding: 24,
              borderWidth: hasReview ? 1 : 2,
              borderColor: hasReview ? "rgba(186, 153, 136, 0.2)" : "#ba9988",
            }}
          >
            {hasReview ? (
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <MaterialIcons name="check-circle" size={20} color="#4caf50" />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#ffffff",
                      }}
                    >
                      Review Submitted
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    Thank you for your feedback! Your review helps others make informed decisions.
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleLeaveReview}
                  style={{
                    backgroundColor: "rgba(186, 153, 136, 0.2)",
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <MaterialIcons name="star" size={20} color="#ba9988" />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ba9988",
                    }}
                  >
                    View Review
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                      backgroundColor: "rgba(186, 153, 136, 0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <MaterialIcons name="star" size={28} color="#ba9988" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      Share Your Experience
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "rgba(255, 255, 255, 0.8)",
                        lineHeight: 22,
                        marginBottom: 4,
                      }}
                    >
                      Help others in the community by leaving a review. Your feedback makes a difference!
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: "rgba(255, 255, 255, 0.6)",
                        fontStyle: "italic",
                      }}
                    >
                      Reviews help businesses improve and help customers make better choices.
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={handleLeaveReview}
                  style={{
                    backgroundColor: "#ba9988",
                    paddingVertical: 14,
                    paddingHorizontal: 24,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <MaterialIcons name="star-outline" size={22} color="#ffffff" />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#ffffff",
                    }}
                  >
                    Leave a Review
                  </Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

