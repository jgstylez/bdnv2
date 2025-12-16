import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Modal, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { Transaction, TransactionType, TransactionStatus } from "../../types/transactions";
import { formatCurrency } from "../../lib/international";
import { Pagination } from "../../components/admin/Pagination";

// Mock transactions
const mockTransactions: Transaction[] = [
  {
    id: "txn-001",
    userId: "user1",
    type: "payment",
    status: "completed",
    amount: 45.99,
    currency: "USD",
    description: "Purchase at Soul Food Kitchen",
    category: "Restaurant",
    relatedEntityId: "business-1",
    relatedEntityType: "business",
    paymentMethod: "Credit Card",
    transactionId: "ch_1234567890",
    fee: 1.38,
    netAmount: 44.61,
    createdAt: "2024-02-15T10:30:00Z",
    completedAt: "2024-02-15T10:30:05Z",
  },
  {
    id: "txn-002",
    userId: "user2",
    type: "token-purchase",
    status: "completed",
    amount: 150.00,
    currency: "USD",
    description: "Purchased 10 BDN Tokens",
    paymentMethod: "Credit Card",
    transactionId: "ch_0987654321",
    fee: 4.50,
    netAmount: 145.50,
    createdAt: "2024-02-14T14:20:00Z",
    completedAt: "2024-02-14T14:20:03Z",
  },
  {
    id: "txn-003",
    userId: "user3",
    type: "payment",
    status: "pending",
    amount: 89.50,
    currency: "USD",
    description: "Purchase at Black Beauty Salon",
    category: "Beauty & Wellness",
    relatedEntityId: "business-2",
    relatedEntityType: "business",
    paymentMethod: "BLKD",
    createdAt: "2024-02-16T09:15:00Z",
  },
  {
    id: "txn-004",
    userId: "user1",
    type: "donation",
    status: "completed",
    amount: 25.00,
    currency: "USD",
    description: "Donation to Community Scholarship Fund",
    relatedEntityId: "nonprofit-1",
    relatedEntityType: "nonprofit",
    paymentMethod: "Credit Card",
    transactionId: "ch_1122334455",
    fee: 0.75,
    netAmount: 24.25,
    createdAt: "2024-02-10T16:45:00Z",
    completedAt: "2024-02-10T16:45:02Z",
  },
];

export default function TransactionManagement() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTransactions = mockTransactions.filter((txn) => {
    const matchesSearch = searchQuery === "" ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.userId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || txn.status === selectedStatus;
    const matchesType = selectedType === "all" || txn.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedType]);

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case "completed":
        return "#4caf50";
      case "pending":
        return "#ffd700";
      case "failed":
        return "#ff4444";
      case "cancelled":
        return "rgba(255, 255, 255, 0.5)";
      case "refunded":
        return "#2196f3";
      default:
        return "rgba(255, 255, 255, 0.5)";
    }
  };

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case "payment":
        return "shopping-bag";
      case "token-purchase":
        return "account-balance-wallet";
      case "donation":
        return "favorite";
      case "event-ticket":
        return "event";
      case "refund":
        return "undo";
      default:
        return "receipt";
    }
  };

  const handleRefund = () => {
    if (!selectedTransaction || !refundAmount || !refundReason) {
      alert("Please fill in all required fields");
      return;
    }
    // TODO: Process refund via API
    alert(`Refund of $${refundAmount} processed successfully.`);
    setShowRefundModal(false);
    setRefundAmount("");
    setRefundReason("");
    setSelectedTransaction(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: isMobile ? 28 : 36,
              fontWeight: "800",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            Transaction Management
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 24,
            }}
          >
            Review transactions, process refunds, and manage disputes. All transactions are logged for audit purposes.
          </Text>
        </View>

        {/* Search and Filters */}
        <View style={{ marginBottom: 24, gap: 12 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#474747",
              borderRadius: 12,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <MaterialIcons name="search" size={20} color="rgba(255, 255, 255, 0.5)" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by transaction ID, description, or user ID..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              style={{
                flex: 1,
                paddingVertical: 14,
                paddingHorizontal: 12,
                color: "#ffffff",
                fontSize: 14,
              }}
            />
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {[
              { key: "all", label: "All Status" },
              { key: "completed", label: "Completed" },
              { key: "pending", label: "Pending" },
              { key: "failed", label: "Failed" },
              { key: "refunded", label: "Refunded" },
            ].map((status) => (
              <TouchableOpacity
                key={status.key}
                onPress={() => setSelectedStatus(status.key)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: selectedStatus === status.key ? "#ba9988" : "#474747",
                  borderWidth: 1,
                  borderColor:
                    selectedStatus === status.key
                      ? "#ba9988"
                      : "rgba(186, 153, 136, 0.2)",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: selectedStatus === status.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  {status.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {[
              { key: "all", label: "All Types" },
              { key: "payment", label: "Payments" },
              { key: "token-purchase", label: "Token Purchases" },
              { key: "donation", label: "Donations" },
              { key: "event-ticket", label: "Event Tickets" },
            ].map((type) => (
              <TouchableOpacity
                key={type.key}
                onPress={() => setSelectedType(type.key)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: selectedType === type.key ? "#ba9988" : "#474747",
                  borderWidth: 1,
                  borderColor:
                    selectedType === type.key
                      ? "#ba9988"
                      : "rgba(186, 153, 136, 0.2)",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: selectedType === type.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Transactions List */}
        <View style={{ gap: 12 }}>
          {paginatedTransactions.map((txn) => (
            <TouchableOpacity
              key={txn.id}
              onPress={() => setSelectedTransaction(txn)}
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
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <MaterialIcons
                      name={getTypeIcon(txn.type) as keyof typeof MaterialIcons.glyphMap}
                      size={20}
                      color="#ba9988"
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "#ffffff",
                      }}
                    >
                      {txn.description}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.5)",
                      marginTop: 4,
                    }}
                  >
                    {txn.id} • User: {txn.userId}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#ba9988",
                      marginBottom: 4,
                    }}
                  >
                    {formatCurrency(txn.amount, txn.currency)}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 8,
                      backgroundColor: `${getStatusColor(txn.status)}20`,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "600",
                        color: getStatusColor(txn.status),
                        textTransform: "uppercase",
                      }}
                    >
                      {txn.status}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  {formatDate(txn.createdAt)}
                </Text>
                {txn.fee && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    Fee: {formatCurrency(txn.fee || 0, txn.currency)}
                  </Text>
                )}
                {txn.netAmount && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    Net: {formatCurrency(txn.netAmount, txn.currency)}
                  </Text>
                )}
              </View>

              {txn.status === "completed" && txn.type !== "refund" && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setSelectedTransaction(txn);
                    setRefundAmount(txn.amount.toString());
                    setShowRefundModal(true);
                  }}
                  style={{
                    marginTop: 12,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    backgroundColor: "rgba(33, 150, 243, 0.2)",
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#2196f3",
                    alignSelf: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: "#2196f3",
                    }}
                  >
                    Process Refund
                  </Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredTransactions.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Refund Modal */}
        <Modal
          visible={showRefundModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowRefundModal(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "#474747",
                borderRadius: 20,
                padding: 24,
                width: "100%",
                maxWidth: 500,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Process Refund
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: 24,
                }}
              >
                Issue a refund for transaction {selectedTransaction?.id}
              </Text>

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Refund Amount ({selectedTransaction?.currency})
                </Text>
                <TextInput
                  value={refundAmount}
                  onChangeText={setRefundAmount}
                  placeholder="Enter refund amount"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  keyboardType="decimal-pad"
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 14,
                    color: "#ffffff",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                />
              </View>

              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Reason for Refund *
                </Text>
                <TextInput
                  value={refundReason}
                  onChangeText={setRefundReason}
                  placeholder="Enter reason for refund..."
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  multiline
                  numberOfLines={4}
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 14,
                    color: "#ffffff",
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    textAlignVertical: "top",
                  }}
                />
              </View>

              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowRefundModal(false);
                    setRefundAmount("");
                    setRefundReason("");
                  }}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: "#232323",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleRefund}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: "#2196f3",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    Process Refund
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

