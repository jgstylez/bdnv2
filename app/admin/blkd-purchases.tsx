import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { BLKDPurchase } from "../../types/blkd-purchase";
import { formatCurrency } from "../../lib/international";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { FilterDropdown } from "../../components/admin/FilterDropdown";
import { AdminDataCard } from "../../components/admin/AdminDataCard";
import { AdminModal } from "../../components/admin/AdminModal";
import { Pagination } from "../../components/admin/Pagination";
import { useResponsive } from "../../hooks/useResponsive";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";

// Mock BLKD purchases
const mockBLKDPurchases: BLKDPurchase[] = [
  {
    id: "blkd-001",
    userId: "user1",
    blkdAmount: 100,
    usdPrice: 95,
    discountPercent: 5,
    savings: 5,
    paymentMethodId: "wallet-1",
    status: "completed",
    createdAt: "2024-02-15T10:30:00Z",
    completedAt: "2024-02-15T10:30:05Z",
    transactionId: "txn-blkd-001",
  },
  {
    id: "blkd-002",
    userId: "user2",
    blkdAmount: 1000,
    usdPrice: 890,
    discountPercent: 11,
    savings: 110,
    paymentMethodId: "wallet-2",
    status: "completed",
    createdAt: "2024-02-14T14:20:00Z",
    completedAt: "2024-02-14T14:20:03Z",
    transactionId: "txn-blkd-002",
  },
  {
    id: "blkd-003",
    userId: "user3",
    blkdAmount: 250,
    usdPrice: 230,
    discountPercent: 8,
    savings: 20,
    paymentMethodId: "wallet-3",
    status: "processing",
    createdAt: "2024-02-16T09:15:00Z",
  },
  {
    id: "blkd-004",
    userId: "user4",
    blkdAmount: 500,
    usdPrice: 455,
    discountPercent: 9,
    savings: 45,
    paymentMethodId: "wallet-4",
    status: "failed",
    createdAt: "2024-02-17T11:00:00Z",
  },
];

export default function BLKDPurchasesManagement() {
  const { width } = useWindowDimensions();
  const { isMobile, paddingHorizontal } = useResponsive();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<BLKDPurchase | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagNote, setFlagNote] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPurchases = mockBLKDPurchases.filter((purchase) => {
    const matchesSearch =
      searchQuery === "" ||
      purchase.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.transactionId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || purchase.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPurchases = filteredPurchases.slice(startIndex, endIndex);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus]);

  const getStatusColor = (status: BLKDPurchase["status"]) => {
    switch (status) {
      case "completed":
        return "#4caf50";
      case "processing":
        return "#ffd700";
      case "pending":
        return "#ff9800";
      case "failed":
        return "#ff4444";
      default:
        return "rgba(255, 255, 255, 0.5)";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTierLabel = (amount: number) => {
    if (amount >= 5000) return "5,000 BLKD";
    if (amount >= 2500) return "2,500 BLKD";
    if (amount >= 1000) return "1,000 BLKD";
    if (amount >= 500) return "500 BLKD";
    if (amount >= 250) return "250 BLKD";
    return "100 BLKD";
  };

  const handleFlagForReview = () => {
    if (!selectedOrder || !flagNote.trim()) {
      alert("Please add a note explaining why this purchase needs review.");
      return;
    }
    // TODO: Flag purchase via API
    alert(`Purchase ${selectedOrder.id} flagged for review.`);
    setShowFlagModal(false);
    setFlagNote("");
    setSelectedOrder(null);
  };

  const handleRetryProcessing = (purchase: BLKDPurchase) => {
    // TODO: Retry processing via API
    alert(`Retrying processing for purchase ${purchase.id}...`);
  };

  // Statistics
  const totalPurchases = mockBLKDPurchases.length;
  const totalBLKD = mockBLKDPurchases.reduce((sum, p) => sum + p.blkdAmount, 0);
  const totalRevenue = mockBLKDPurchases.reduce((sum, p) => sum + p.usdPrice, 0);
  const totalSavings = mockBLKDPurchases.reduce((sum, p) => sum + (p.savings || 0), 0);
  const failedCount = mockBLKDPurchases.filter((p) => p.status === "failed").length;

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? paddingHorizontal : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        {/* Header */}
        <AdminPageHeader
          title="BLKD Purchases"
          description="View and monitor all BLKD purchases. Handle rare disputes and unexpected issues only. System is automated - no routine manual intervention needed. Purchases are non-refundable."
        />

        {/* Statistics */}
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            flexWrap: "wrap",
            gap: 12,
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
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
              Total Purchases
            </Text>
            <Text style={{ fontSize: 28, fontWeight: "700", color: "#ba9988" }}>
              {totalPurchases.toLocaleString()}
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
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
              Total BLKD Sold
            </Text>
            <Text style={{ fontSize: 28, fontWeight: "700", color: "#4caf50" }}>
              {totalBLKD.toLocaleString()} BLKD
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
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
              Total Revenue
            </Text>
            <Text style={{ fontSize: 28, fontWeight: "700", color: "#2196f3" }}>
              {formatCurrency(totalRevenue, "USD")}
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
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
              Failed Purchases
            </Text>
            <Text style={{ fontSize: 28, fontWeight: "700", color: "#ff4444" }}>
              {failedCount}
            </Text>
          </View>
        </View>

        {/* Search and Filters */}
        <View style={{ marginBottom: spacing["2xl"], gap: spacing.md }}>
          {/* Search Bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.md,
              paddingHorizontal: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <MaterialIcons name="search" size={20} color={colors.text.tertiary} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by purchase ID, user ID, or transaction ID..."
              placeholderTextColor={colors.text.placeholder}
              style={{
                flex: 1,
                paddingVertical: spacing.md - 2,
                paddingHorizontal: spacing.md,
                fontSize: typography.fontSize.base,
                color: colors.text.primary,
              }}
            />
          </View>

          {/* Filter Dropdowns */}
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              gap: spacing.md,
            }}
          >
            <FilterDropdown
              label="Status"
              options={[
                { value: "", label: "All Status" },
                { value: "pending", label: "Pending" },
                { value: "processing", label: "Processing" },
                { value: "completed", label: "Completed" },
                { value: "failed", label: "Failed" },
              ]}
              value={selectedStatus === "all" ? "" : selectedStatus}
              onSelect={(value) => setSelectedStatus(value === "" ? "all" : value)}
            />
          </View>
        </View>

        {/* Purchases List */}
        {filteredPurchases.length > 0 ? (
          <View style={{ gap: spacing.md }}>
            {paginatedPurchases.map((purchase) => {
              const statusColor = getStatusColor(purchase.status);
              return (
                <AdminDataCard
                  key={purchase.id}
                  title={`Purchase ${purchase.id}`}
                  subtitle={`${getTierLabel(purchase.blkdAmount)} • ${formatCurrency(purchase.usdPrice, "USD")} • Save ${purchase.discountPercent}%`}
                  badges={[
                    {
                      label: purchase.status,
                      color: statusColor,
                      backgroundColor: `${statusColor}20`,
                    },
                    {
                      label: `${purchase.discountPercent}% OFF`,
                      color: "#4caf50",
                      backgroundColor: "#4caf5020",
                    },
                  ]}
                  actions={[
                    {
                      label: "View Details",
                      icon: "info",
                      variant: "info",
                      onPress: () => {
                        setSelectedOrder(purchase);
                        setShowDetailModal(true);
                      },
                    },
                    ...(purchase.status === "failed"
                      ? [
                          {
                            label: "Retry Processing",
                            icon: "refresh" as keyof typeof MaterialIcons.glyphMap,
                            variant: "primary" as const,
                            onPress: () => handleRetryProcessing(purchase),
                          },
                        ]
                      : []),
                    {
                      label: "Flag for Review",
                      icon: "flag" as keyof typeof MaterialIcons.glyphMap,
                      variant: "secondary" as const,
                      onPress: () => {
                        setSelectedOrder(purchase);
                        setShowFlagModal(true);
                      },
                    },
                  ]}
                >
                  <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                        User:
                      </Text>
                      <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                        {purchase.userId}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                        Savings:
                      </Text>
                      <Text style={{ fontSize: typography.fontSize.sm, color: "#4caf50" }}>
                        {formatCurrency(purchase.savings || 0, "USD")}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                        Created:
                      </Text>
                      <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                        {formatDate(purchase.createdAt)}
                      </Text>
                    </View>
                    {purchase.completedAt && (
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                          Completed:
                        </Text>
                        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                          {formatDate(purchase.completedAt)}
                        </Text>
                      </View>
                    )}
                  </View>
                </AdminDataCard>
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
            <MaterialIcons name="account-balance-wallet" size={48} color="rgba(255, 255, 255, 0.5)" />
            <Text style={{ fontSize: 18, color: "rgba(255, 255, 255, 0.7)", marginTop: 16, textAlign: "center" }}>
              No BLKD purchases found
            </Text>
          </View>
        )}

        {/* Pagination */}
        {filteredPurchases.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredPurchases.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Detail Modal */}
        <AdminModal
          visible={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedOrder(null);
          }}
          title={`BLKD Purchase ${selectedOrder?.id}`}
        >
          {selectedOrder && (
            <View style={{ gap: spacing.md }}>
              <View style={{ gap: spacing.sm }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  Purchase ID
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                  {selectedOrder.id}
                </Text>
              </View>
              <View style={{ gap: spacing.sm }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  User ID
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                  {selectedOrder.userId}
                </Text>
              </View>
              <View style={{ gap: spacing.sm }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  BLKD Amount
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                  {selectedOrder.blkdAmount.toLocaleString()} BLKD
                </Text>
              </View>
              <View style={{ gap: spacing.sm }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  USD Price
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                  {formatCurrency(selectedOrder.usdPrice, "USD")}
                </Text>
              </View>
              <View style={{ gap: spacing.sm }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  Discount
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, color: "#4caf50" }}>
                  {selectedOrder.discountPercent}% ({formatCurrency(selectedOrder.savings || 0, "USD")})
                </Text>
              </View>
              <View style={{ gap: spacing.sm }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  Tier
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                  {getTierLabel(selectedOrder.blkdAmount)}
                </Text>
              </View>
              <View style={{ gap: spacing.sm }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  Status
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, color: getStatusColor(selectedOrder.status) }}>
                  {selectedOrder.status}
                </Text>
              </View>
              <View style={{ gap: spacing.sm }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  Payment Method ID
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                  {selectedOrder.paymentMethodId}
                </Text>
              </View>
              {selectedOrder.transactionId && (
                <View style={{ gap: spacing.sm }}>
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Transaction ID
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                    {selectedOrder.transactionId}
                  </Text>
                </View>
              )}
              <View style={{ gap: spacing.sm }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  Created At
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                  {formatDate(selectedOrder.createdAt)}
                </Text>
              </View>
              {selectedOrder.completedAt && (
                <View style={{ gap: spacing.sm }}>
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Completed At
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                    {formatDate(selectedOrder.completedAt)}
                  </Text>
                </View>
              )}
            </View>
          )}
        </AdminModal>

        {/* Flag for Review Modal */}
        <AdminModal
          visible={showFlagModal}
          onClose={() => {
            setShowFlagModal(false);
            setFlagNote("");
            setSelectedOrder(null);
          }}
          title="Flag Purchase for Review"
          actions={[
            {
              label: "Cancel",
              onPress: () => {
                setShowFlagModal(false);
                setFlagNote("");
                setSelectedOrder(null);
              },
              variant: "secondary",
            },
            {
              label: "Flag Purchase",
              onPress: handleFlagForReview,
              variant: "primary",
            },
          ]}
        >
          <View style={{ gap: spacing.md }}>
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>
              Add a note explaining why this purchase needs review:
            </Text>
            <TextInput
              value={flagNote}
              onChangeText={setFlagNote}
              placeholder="Enter reason for flagging..."
              placeholderTextColor={colors.text.placeholder}
              multiline
              numberOfLines={4}
              style={{
                backgroundColor: colors.primary.bg,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                color: colors.text.primary,
                fontSize: typography.fontSize.base,
                borderWidth: 1,
                borderColor: colors.border.light,
                minHeight: 100,
                textAlignVertical: "top",
              }}
            />
          </View>
        </AdminModal>
      </ScrollView>
    </View>
  );
}
