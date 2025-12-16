import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { GiftCardOrder, GiftCardType } from "../../types/gift-card-order";
import { formatCurrency } from "../../lib/international";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { FilterDropdown } from "../../components/admin/FilterDropdown";
import { AdminDataCard } from "../../components/admin/AdminDataCard";
import { AdminModal } from "../../components/admin/AdminModal";
import { Pagination } from "../../components/admin/Pagination";
import { useResponsive } from "../../hooks/useResponsive";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";

// Mock gift card orders
const mockGiftCardOrders: GiftCardOrder[] = [
  {
    id: "gc-001",
    type: "universal",
    amount: 50,
    senderUserId: "user1",
    senderName: "John Doe",
    recipientUserId: "user2",
    recipientName: "Jane Smith",
    recipientEmail: "jane@example.com",
    note: "Happy Birthday!",
    status: "sent",
    createdAt: "2024-02-15T10:30:00Z",
    sentAt: "2024-02-15T10:30:05Z",
    giftCardId: "wallet-gc-001",
  },
  {
    id: "gc-002",
    type: "merchant",
    amount: 100,
    merchantId: "merchant-1",
    merchantName: "Soul Food Kitchen",
    senderUserId: "user3",
    senderName: "Alice Johnson",
    recipientUserId: "user4",
    recipientName: "Bob Williams",
    recipientEmail: "bob@example.com",
    note: "Enjoy!",
    status: "redeemed",
    createdAt: "2024-02-10T14:20:00Z",
    sentAt: "2024-02-10T14:20:03Z",
    giftCardId: "wallet-gc-002",
  },
  {
    id: "gc-003",
    type: "universal",
    amount: 25,
    senderUserId: "user5",
    senderName: "Charlie Brown",
    recipientEmail: "recipient@example.com",
    recipientName: "Recipient Name",
    note: "Thank you!",
    status: "scheduled",
    scheduledSendDate: "2024-12-25T00:00:00Z",
    createdAt: "2024-02-16T09:15:00Z",
    giftCardId: "wallet-gc-003",
  },
  {
    id: "gc-004",
    type: "universal",
    amount: 75,
    senderUserId: "user6",
    senderName: "Diana Prince",
    recipientUserId: "user7",
    recipientName: "Clark Kent",
    status: "pending",
    createdAt: "2024-02-17T11:00:00Z",
  },
];

export default function GiftCardOrdersManagement() {
  const { width } = useWindowDimensions();
  const { isMobile, paddingHorizontal } = useResponsive();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<GiftCardOrder | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagNote, setFlagNote] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredOrders = mockGiftCardOrders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.senderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.recipientEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.merchantName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    const matchesType = selectedType === "all" || order.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedType]);

  const getStatusColor = (status: GiftCardOrder["status"]) => {
    switch (status) {
      case "sent":
        return "#4caf50";
      case "redeemed":
        return "#2196f3";
      case "scheduled":
        return "#ffd700";
      case "pending":
        return "#ff9800";
      case "expired":
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

  const handleFlagForReview = () => {
    if (!selectedOrder || !flagNote.trim()) {
      alert("Please add a note explaining why this order needs review.");
      return;
    }
    // TODO: Flag order via API
    alert(`Order ${selectedOrder.id} flagged for review.`);
    setShowFlagModal(false);
    setFlagNote("");
    setSelectedOrder(null);
  };

  const handleResend = (order: GiftCardOrder) => {
    // TODO: Resend gift card via API
    alert(`Gift card ${order.id} resent successfully.`);
  };

  // Statistics
  const totalOrders = mockGiftCardOrders.length;
  const totalBLKD = mockGiftCardOrders.reduce((sum, order) => sum + order.amount, 0);
  const pendingCount = mockGiftCardOrders.filter((o) => o.status === "pending" || o.status === "scheduled").length;
  const redeemedCount = mockGiftCardOrders.filter((o) => o.status === "redeemed").length;

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
          title="Gift Card Orders"
          description="View and monitor all gift card orders. Handle rare disputes and unexpected issues only. System is automated - no routine manual intervention needed."
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
              Total Orders
            </Text>
            <Text style={{ fontSize: 28, fontWeight: "700", color: "#ba9988" }}>
              {totalOrders.toLocaleString()}
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
              Total BLKD Value
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
              Pending/Scheduled
            </Text>
            <Text style={{ fontSize: 28, fontWeight: "700", color: "#ffd700" }}>
              {pendingCount}
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
              Redeemed
            </Text>
            <Text style={{ fontSize: 28, fontWeight: "700", color: "#2196f3" }}>
              {redeemedCount}
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
              placeholder="Search by order ID, sender, recipient, or merchant..."
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
                { value: "scheduled", label: "Scheduled" },
                { value: "sent", label: "Sent" },
                { value: "redeemed", label: "Redeemed" },
                { value: "expired", label: "Expired" },
              ]}
              value={selectedStatus === "all" ? "" : selectedStatus}
              onSelect={(value) => setSelectedStatus(value === "" ? "all" : value)}
            />
            <FilterDropdown
              label="Type"
              options={[
                { value: "", label: "All Types" },
                { value: "universal", label: "Universal" },
                { value: "merchant", label: "Merchant-Specific" },
              ]}
              value={selectedType === "all" ? "" : selectedType}
              onSelect={(value) => setSelectedType(value === "" ? "all" : value)}
            />
          </View>
        </View>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <View style={{ gap: spacing.md }}>
            {paginatedOrders.map((order) => {
              const statusColor = getStatusColor(order.status);
              return (
                <AdminDataCard
                  key={order.id}
                  title={`Order ${order.id}`}
                  subtitle={`${order.type === "universal" ? "Universal" : order.merchantName} • ${formatCurrency(order.amount, "BLKD")}`}
                  badges={[
                    {
                      label: order.status,
                      color: statusColor,
                      backgroundColor: `${statusColor}20`,
                    },
                    {
                      label: order.type,
                      color: order.type === "universal" ? "#ba9988" : colors.text.secondary,
                      backgroundColor: order.type === "universal" ? colors.accentLight : colors.secondary.bg,
                    },
                  ]}
                  actions={[
                    {
                      label: "View Details",
                      icon: "visibility",
                      variant: "info",
                      onPress: () => {
                        setSelectedOrder(order);
                        setShowDetailModal(true);
                      },
                    },
                    ...(order.status === "pending" || order.status === "scheduled"
                      ? [
                          {
                            label: "Resend",
                            icon: "send",
                            variant: "primary" as const,
                            onPress: () => handleResend(order),
                          },
                        ]
                      : []),
                    {
                      label: "Flag for Review",
                      icon: "flag",
                      variant: "secondary" as const,
                      onPress: () => {
                        setSelectedOrder(order);
                        setShowFlagModal(true);
                      },
                    },
                  ]}
                >
                  <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                        From:
                      </Text>
                      <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                        {order.senderName || order.senderUserId}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                        To:
                      </Text>
                      <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                        {order.recipientName || order.recipientEmail || order.recipientUserId}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                        Created:
                      </Text>
                      <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                        {formatDate(order.createdAt)}
                      </Text>
                    </View>
                    {order.scheduledSendDate && (
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                          Scheduled:
                        </Text>
                        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                          {formatDate(order.scheduledSendDate)}
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
            <MaterialIcons name="card-giftcard" size={48} color="rgba(255, 255, 255, 0.5)" />
            <Text style={{ fontSize: 18, color: "rgba(255, 255, 255, 0.7)", marginTop: 16, textAlign: "center" }}>
              No gift card orders found
            </Text>
          </View>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredOrders.length}
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
          title={`Gift Card Order ${selectedOrder?.id}`}
        >
          {selectedOrder && (
            <View style={{ gap: spacing.md }}>
              <View style={{ gap: spacing.sm }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  Order ID
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                  {selectedOrder.id}
                </Text>
              </View>
              <View style={{ gap: spacing.sm }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  Type
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                  {selectedOrder.type === "universal" ? "Universal" : "Merchant-Specific"}
                </Text>
              </View>
              {selectedOrder.merchantName && (
                <View style={{ gap: spacing.sm }}>
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Merchant
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                    {selectedOrder.merchantName}
                  </Text>
                </View>
              )}
              <View style={{ gap: spacing.sm }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  Amount
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                  {formatCurrency(selectedOrder.amount, "BLKD")}
                </Text>
              </View>
              <View style={{ gap: spacing.sm }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  Sender
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                  {selectedOrder.senderName || selectedOrder.senderUserId}
                </Text>
              </View>
              <View style={{ gap: spacing.sm }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  Recipient
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                  {selectedOrder.recipientName || selectedOrder.recipientEmail || selectedOrder.recipientUserId}
                </Text>
              </View>
              {selectedOrder.note && (
                <View style={{ gap: spacing.sm }}>
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Note
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                    {selectedOrder.note}
                  </Text>
                </View>
              )}
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
                  Created At
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                  {formatDate(selectedOrder.createdAt)}
                </Text>
              </View>
              {selectedOrder.sentAt && (
                <View style={{ gap: spacing.sm }}>
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Sent At
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                    {formatDate(selectedOrder.sentAt)}
                  </Text>
                </View>
              )}
              {selectedOrder.giftCardId && (
                <View style={{ gap: spacing.sm }}>
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Gift Card ID
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                    {selectedOrder.giftCardId}
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
          title="Flag Order for Review"
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
              label: "Flag Order",
              onPress: handleFlagForReview,
              variant: "primary",
            },
          ]}
        >
          <View style={{ gap: spacing.md }}>
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>
              Add a note explaining why this order needs review:
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

