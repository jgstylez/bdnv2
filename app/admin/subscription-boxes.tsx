import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { SubscriptionBox, SubscriptionBoxPlan, SubscriptionBoxShipment, SubscriptionStatus, SubscriptionFrequency, getFrequencyLabel, getDurationLabel } from '@/types/subscription-box';
import { formatCurrency } from '@/lib/international';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { FilterDropdown } from '@/components/admin/FilterDropdown';
import { AdminDataCard } from '@/components/admin/AdminDataCard';
import { AdminModal } from '@/components/admin/AdminModal';
import { Pagination } from '@/components/admin/Pagination';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

// Mock subscription boxes
const mockSubscriptionBoxes: SubscriptionBox[] = [
  {
    id: "sub-001",
    userId: "user1",
    productId: "prod-1",
    merchantId: "merchant-1",
    planId: "plan-1",
    quantity: 1,
    frequency: "monthly",
    duration: 12,
    status: "active",
    pricePerShipment: 24.99,
    shippingCostPerShipment: 5.99,
    currency: "USD",
    discountPercentage: 5,
    paymentMethodId: "wallet-1",
    nextBillingDate: "2024-03-15T10:00:00Z",
    nextShipmentDate: "2024-03-15T10:00:00Z",
    shipmentsCompleted: 2,
    shipmentsRemaining: 10,
    startDate: "2024-01-15T10:00:00Z",
    endDate: "2024-12-15T10:00:00Z",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "sub-002",
    userId: "user2",
    productId: "prod-2",
    merchantId: "merchant-1",
    planId: "plan-2",
    quantity: 2,
    frequency: "bi-weekly",
    duration: -1,
    status: "active",
    pricePerShipment: 49.98,
    shippingCostPerShipment: 5.99,
    currency: "USD",
    discountPercentage: 8,
    paymentMethodId: "wallet-2",
    nextBillingDate: "2024-02-29T10:00:00Z",
    nextShipmentDate: "2024-02-29T10:00:00Z",
    shipmentsCompleted: 4,
    shipmentsRemaining: -1,
    startDate: "2024-01-01T10:00:00Z",
    createdAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "sub-003",
    userId: "user3",
    productId: "prod-3",
    merchantId: "merchant-2",
    planId: "plan-3",
    quantity: 1,
    frequency: "quarterly",
    duration: 4,
    status: "paused",
    pricePerShipment: 79.99,
    shippingCostPerShipment: 8.99,
    currency: "USD",
    discountPercentage: 10,
    paymentMethodId: "wallet-3",
    nextBillingDate: "2024-04-01T10:00:00Z",
    nextShipmentDate: "2024-04-01T10:00:00Z",
    shipmentsCompleted: 1,
    shipmentsRemaining: 3,
    startDate: "2024-01-01T10:00:00Z",
    pausedUntil: "2024-04-01T10:00:00Z",
    createdAt: "2024-01-01T10:00:00Z",
  },
];

// Mock subscription plans
const mockSubscriptionPlans: SubscriptionBoxPlan[] = [
  {
    id: "plan-1",
    productId: "prod-1",
    merchantId: "merchant-1",
    name: "Monthly Coffee Subscription",
    description: "Get fresh coffee delivered monthly",
    frequency: "monthly",
    duration: 12,
    pricePerShipment: 24.99,
    currency: "USD",
    shippingCostPerShipment: 5.99,
    discountPercentage: 5,
    isActive: true,
    createdAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "plan-2",
    productId: "prod-2",
    merchantId: "merchant-1",
    name: "Bi-Weekly Coffee Subscription",
    description: "Get fresh coffee delivered every two weeks",
    frequency: "bi-weekly",
    duration: -1,
    pricePerShipment: 24.99,
    currency: "USD",
    shippingCostPerShipment: 5.99,
    discountPercentage: 8,
    isActive: true,
    createdAt: "2024-01-01T10:00:00Z",
  },
];

// Mock shipments
const mockShipments: SubscriptionBoxShipment[] = [
  {
    id: "ship-001",
    subscriptionBoxId: "sub-001",
    shipmentNumber: 1,
    status: "delivered",
    orderId: "order-001",
    transactionId: "txn-001",
    trackingNumber: "TRACK123456",
    carrier: "USPS",
    scheduledShipDate: "2024-01-15T10:00:00Z",
    shippedAt: "2024-01-15T10:00:00Z",
    estimatedDeliveryDate: "2024-01-18T10:00:00Z",
    deliveredAt: "2024-01-17T10:00:00Z",
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "ship-002",
    subscriptionBoxId: "sub-001",
    shipmentNumber: 2,
    status: "delivered",
    orderId: "order-002",
    transactionId: "txn-002",
    trackingNumber: "TRACK123457",
    carrier: "USPS",
    scheduledShipDate: "2024-02-15T10:00:00Z",
    shippedAt: "2024-02-15T10:00:00Z",
    estimatedDeliveryDate: "2024-02-18T10:00:00Z",
    deliveredAt: "2024-02-17T10:00:00Z",
    createdAt: "2024-02-10T10:00:00Z",
  },
  {
    id: "ship-003",
    subscriptionBoxId: "sub-002",
    shipmentNumber: 3,
    status: "shipped",
    orderId: "order-003",
    transactionId: "txn-003",
    trackingNumber: "TRACK123458",
    carrier: "FedEx",
    scheduledShipDate: "2024-02-15T10:00:00Z",
    shippedAt: "2024-02-15T10:00:00Z",
    estimatedDeliveryDate: "2024-02-17T10:00:00Z",
    createdAt: "2024-02-10T10:00:00Z",
  },
];

type TabType = "subscriptions" | "plans" | "shipments";

export default function SubscriptionBoxesManagement() {
  const { width } = useWindowDimensions();
  const { isMobile, paddingHorizontal } = useResponsive();
  const [activeTab, setActiveTab] = useState<TabType>("subscriptions");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<SubscriptionBox | SubscriptionBoxPlan | SubscriptionBoxShipment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagNote, setFlagNote] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSubscriptions = mockSubscriptionBoxes.filter((sub) => {
    const matchesSearch =
      searchQuery === "" ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.productId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || sub.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredPlans = mockSubscriptionPlans.filter((plan) => {
    const matchesSearch =
      searchQuery === "" ||
      plan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.merchantId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredShipments = mockShipments.filter((shipment) => {
    const matchesSearch =
      searchQuery === "" ||
      shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.subscriptionBoxId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || shipment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination for each tab
  const subscriptionsTotalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const subscriptionsStartIndex = (currentPage - 1) * itemsPerPage;
  const subscriptionsEndIndex = subscriptionsStartIndex + itemsPerPage;
  const paginatedSubscriptions = filteredSubscriptions.slice(subscriptionsStartIndex, subscriptionsEndIndex);

  const plansTotalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const plansStartIndex = (currentPage - 1) * itemsPerPage;
  const plansEndIndex = plansStartIndex + itemsPerPage;
  const paginatedPlans = filteredPlans.slice(plansStartIndex, plansEndIndex);

  const shipmentsTotalPages = Math.ceil(filteredShipments.length / itemsPerPage);
  const shipmentsStartIndex = (currentPage - 1) * itemsPerPage;
  const shipmentsEndIndex = shipmentsStartIndex + itemsPerPage;
  const paginatedShipments = filteredShipments.slice(shipmentsStartIndex, shipmentsEndIndex);

  // Reset to page 1 when filters, search, or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, activeTab]);

  const getStatusColor = (status: SubscriptionStatus | SubscriptionBoxShipment["status"]) => {
    switch (status) {
      case "active":
        return "#4caf50";
      case "paused":
        return "#ffd700";
      case "cancelled":
        return "#ff4444";
      case "expired":
        return "#ff9800";
      case "pending":
        return "#ff9800";
      case "processing":
        return "#ffd700";
      case "shipped":
        return "#2196f3";
      case "delivered":
        return "#4caf50";
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

  const handleFlagForReview = () => {
    if (!selectedOrder || !flagNote.trim()) {
      alert("Please add a note explaining why this needs review.");
      return;
    }
    // TODO: Flag via API
    alert(`Item flagged for review.`);
    setShowFlagModal(false);
    setFlagNote("");
    setSelectedOrder(null);
  };

  // Statistics
  const activeSubscriptions = mockSubscriptionBoxes.filter((s) => s.status === "active").length;
  const pausedSubscriptions = mockSubscriptionBoxes.filter((s) => s.status === "paused").length;
  const cancelledSubscriptions = mockSubscriptionBoxes.filter((s) => s.status === "cancelled").length;
  const totalPlans = mockSubscriptionPlans.length;
  const totalShipments = mockShipments.length;

  const renderSubscriptionsTab = () => (
    <>
      <View style={{ marginBottom: spacing["2xl"], gap: spacing.md }}>
        {/* Search Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.secondary,
            borderRadius: borderRadius.md,
            paddingHorizontal: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <MaterialIcons name="search" size={20} color={colors.text.tertiary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by subscription ID, user ID, or product ID..."
            placeholderTextColor={colors.text.placeholder}
            style={{
              flex: 1,
              paddingVertical: spacing.md - 2,
              paddingHorizontal: spacing.md,
              fontSize: typography.sizes.md,
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
              { value: "active", label: "Active" },
              { value: "paused", label: "Paused" },
              { value: "cancelled", label: "Cancelled" },
              { value: "expired", label: "Expired" },
              { value: "pending", label: "Pending" },
            ]}
            value={selectedStatus === "all" ? "" : selectedStatus}
            onSelect={(value) => setSelectedStatus(value === "" ? "all" : value)}
          />
        </View>
      </View>

      {filteredSubscriptions.length > 0 ? (
        <View style={{ gap: spacing.md }}>
          {paginatedSubscriptions.map((subscription) => {
            const statusColor = getStatusColor(subscription.status);
            return (
              <AdminDataCard
                key={subscription.id}
                title={`Subscription ${subscription.id}`}
                subtitle={`${getFrequencyLabel(subscription.frequency)} • ${getDurationLabel(subscription.duration)} • ${formatCurrency(subscription.pricePerShipment + subscription.shippingCostPerShipment, subscription.currency)}/shipment`}
                badges={[
                  {
                    label: subscription.status,
                    color: statusColor,
                    backgroundColor: `${statusColor}20`,
                  },
                  {
                    label: `${subscription.discountPercentage}% OFF`,
                    color: "#4caf50",
                    backgroundColor: "#4caf5020",
                  },
                ]}
                actions={[
                  {
                    label: "View Details",
                    icon: "visibility",
                    variant: "info",
                    onPress: () => {
                      setSelectedOrder(subscription);
                      setShowDetailModal(true);
                    },
                  },
                  {
                    label: "Flag for Review",
                    icon: "flag",
                    variant: "secondary",
                    onPress: () => {
                      setSelectedOrder(subscription);
                      setShowFlagModal(true);
                    },
                  },
                ]}
              >
                <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                      User:
                    </Text>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.primary }}>
                      {subscription.userId}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                      Next Billing:
                    </Text>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.primary }}>
                      {formatDate(subscription.nextBillingDate)}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                      Shipments:
                    </Text>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.primary }}>
                      {subscription.shipmentsCompleted} / {subscription.shipmentsRemaining === -1 ? "∞" : subscription.shipmentsRemaining + subscription.shipmentsCompleted}
                    </Text>
                  </View>
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
          <MaterialIcons name="subscriptions" size={48} color="rgba(255, 255, 255, 0.5)" />
          <Text style={{ fontSize: 18, color: "rgba(255, 255, 255, 0.7)", marginTop: 16, textAlign: "center" }}>
            No subscriptions found
          </Text>
        </View>
      )}

      {/* Pagination */}
      {filteredSubscriptions.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={subscriptionsTotalPages}
          totalItems={filteredSubscriptions.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );

  const renderPlansTab = () => (
    <>
      <View style={{ marginBottom: spacing["2xl"], gap: spacing.md }}>
        {/* Search Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.secondary,
            borderRadius: borderRadius.md,
            paddingHorizontal: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <MaterialIcons name="search" size={20} color={colors.text.tertiary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by plan ID, product ID, or merchant ID..."
            placeholderTextColor={colors.text.placeholder}
            style={{
              flex: 1,
              paddingVertical: spacing.md - 2,
              paddingHorizontal: spacing.md,
              fontSize: typography.sizes.md,
              color: colors.text.primary,
            }}
          />
        </View>
      </View>

      {filteredPlans.length > 0 ? (
        <View style={{ gap: spacing.md }}>
          {paginatedPlans.map((plan) => (
            <AdminDataCard
              key={plan.id}
              title={plan.name}
              subtitle={`${getFrequencyLabel(plan.frequency)} • ${getDurationLabel(plan.duration)} • ${formatCurrency(plan.pricePerShipment + plan.shippingCostPerShipment, plan.currency)}/shipment`}
              badges={[
                {
                  label: plan.isActive ? "Active" : "Inactive",
                  color: plan.isActive ? "#4caf50" : "rgba(255, 255, 255, 0.5)",
                  backgroundColor: plan.isActive ? "#4caf5020" : "rgba(255, 255, 255, 0.1)",
                },
                {
                  label: `${plan.discountPercentage}% OFF`,
                  color: "#4caf50",
                  backgroundColor: "#4caf5020",
                },
              ]}
              actions={[
                {
                  label: "View Details",
                  icon: "visibility",
                  variant: "info",
                  onPress: () => {
                    setSelectedOrder(plan);
                    setShowDetailModal(true);
                  },
                },
              ]}
            >
              <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                    Product ID:
                  </Text>
                  <Text style={{ fontSize: typography.sizes.sm, color: colors.text.primary }}>
                    {plan.productId}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                    Merchant ID:
                  </Text>
                  <Text style={{ fontSize: typography.sizes.sm, color: colors.text.primary }}>
                    {plan.merchantId}
                  </Text>
                </View>
              </View>
            </AdminDataCard>
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
          <MaterialIcons name="list-alt" size={48} color="rgba(255, 255, 255, 0.5)" />
          <Text style={{ fontSize: 18, color: "rgba(255, 255, 255, 0.7)", marginTop: 16, textAlign: "center" }}>
            No subscription plans found
          </Text>
        </View>
      )}

      {/* Pagination */}
      {filteredPlans.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={plansTotalPages}
          totalItems={filteredPlans.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );

  const renderShipmentsTab = () => (
    <>
      <View style={{ marginBottom: spacing["2xl"], gap: spacing.md }}>
        {/* Search Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.secondary,
            borderRadius: borderRadius.md,
            paddingHorizontal: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <MaterialIcons name="search" size={20} color={colors.text.tertiary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by shipment ID, subscription ID, or tracking number..."
            placeholderTextColor={colors.text.placeholder}
            style={{
              flex: 1,
              paddingVertical: spacing.md - 2,
              paddingHorizontal: spacing.md,
              fontSize: typography.sizes.md,
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
              { value: "shipped", label: "Shipped" },
              { value: "delivered", label: "Delivered" },
              { value: "failed", label: "Failed" },
              { value: "cancelled", label: "Cancelled" },
            ]}
            value={selectedStatus === "all" ? "" : selectedStatus}
            onSelect={(value) => setSelectedStatus(value === "" ? "all" : value)}
          />
        </View>
      </View>

      {filteredShipments.length > 0 ? (
        <View style={{ gap: spacing.md }}>
          {paginatedShipments.map((shipment) => {
            const statusColor = getStatusColor(shipment.status);
            return (
              <AdminDataCard
                key={shipment.id}
                title={`Shipment #${shipment.shipmentNumber}`}
                subtitle={`Subscription ${shipment.subscriptionBoxId} • ${formatDate(shipment.scheduledShipDate)}`}
                badges={[
                  {
                    label: shipment.status,
                    color: statusColor,
                    backgroundColor: `${statusColor}20`,
                  },
                ]}
                actions={[
                  {
                    label: "View Details",
                    icon: "visibility",
                    variant: "info",
                    onPress: () => {
                      setSelectedOrder(shipment);
                      setShowDetailModal(true);
                    },
                  },
                  {
                    label: "Flag for Review",
                    icon: "flag",
                    variant: "secondary",
                    onPress: () => {
                      setSelectedOrder(shipment);
                      setShowFlagModal(true);
                    },
                  },
                ]}
              >
                <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
                  {shipment.trackingNumber && (
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                        Tracking:
                      </Text>
                      <Text style={{ fontSize: typography.sizes.sm, color: colors.text.primary }}>
                        {shipment.trackingNumber}
                      </Text>
                    </View>
                  )}
                  {shipment.carrier && (
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                        Carrier:
                      </Text>
                      <Text style={{ fontSize: typography.sizes.sm, color: colors.text.primary }}>
                        {shipment.carrier}
                      </Text>
                    </View>
                  )}
                  {shipment.deliveredAt && (
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                        Delivered:
                      </Text>
                      <Text style={{ fontSize: typography.sizes.sm, color: colors.text.primary }}>
                        {formatDate(shipment.deliveredAt)}
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
          <MaterialIcons name="local-shipping" size={48} color="rgba(255, 255, 255, 0.5)" />
          <Text style={{ fontSize: 18, color: "rgba(255, 255, 255, 0.7)", marginTop: 16, textAlign: "center" }}>
            No shipments found
          </Text>
        </View>
      )}

      {/* Pagination */}
      {filteredShipments.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={shipmentsTotalPages}
          totalItems={filteredShipments.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );

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
          title="Subscription Boxes"
          description="Oversight and dispute resolution for subscription boxes. Users manage their own subscriptions, businesses handle fulfillment. Admin provides monitoring and dispute resolution only."
        />

        {/* Statistics */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: isMobile ? "wrap" : "nowrap",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <View
            style={{
              flex: isMobile ? 1 : 1,
              minWidth: isMobile ? "47%" : undefined,
              maxWidth: isMobile ? "47%" : undefined,
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
              Active Subscriptions
            </Text>
            <Text style={{ fontSize: 28, fontWeight: "700", color: "#4caf50" }}>
              {activeSubscriptions}
            </Text>
          </View>
          <View
            style={{
              flex: isMobile ? 1 : 1,
              minWidth: isMobile ? "47%" : undefined,
              maxWidth: isMobile ? "47%" : undefined,
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
              Paused
            </Text>
            <Text style={{ fontSize: 28, fontWeight: "700", color: "#ffd700" }}>
              {pausedSubscriptions}
            </Text>
          </View>
          <View
            style={{
              flex: isMobile ? 1 : 1,
              minWidth: isMobile ? "47%" : undefined,
              maxWidth: isMobile ? "47%" : undefined,
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
              Total Plans
            </Text>
            <Text style={{ fontSize: 28, fontWeight: "700", color: "#ba9988" }}>
              {totalPlans}
            </Text>
          </View>
          <View
            style={{
              flex: isMobile ? 1 : 1,
              minWidth: isMobile ? "47%" : undefined,
              maxWidth: isMobile ? "47%" : undefined,
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
              Total Shipments
            </Text>
            <Text style={{ fontSize: 28, fontWeight: "700", color: "#2196f3" }}>
              {totalShipments}
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            marginBottom: 24,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          {[
            { key: "subscriptions" as TabType, label: "Subscriptions", icon: "subscriptions" },
            { key: "plans" as TabType, label: "Plans", icon: "list-alt" },
            { key: "shipments" as TabType, label: "Shipments", icon: "local-shipping" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => {
                setActiveTab(tab.key);
                setSearchQuery("");
                setSelectedStatus("all");
              }}
              style={{
                paddingBottom: 12,
                paddingHorizontal: 16,
                borderBottomWidth: activeTab === tab.key ? 2 : 0,
                borderBottomColor: activeTab === tab.key ? "#ba9988" : "transparent",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <MaterialIcons
                  name={tab.icon as any}
                  size={18}
                  color={activeTab === tab.key ? "#ba9988" : "rgba(255, 255, 255, 0.5)"}
                />
                <Text
                  style={{
                    fontSize: typography.sizes.md,
                    fontWeight: activeTab === tab.key ? "600" : "500",
                    color: activeTab === tab.key ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === "subscriptions" && renderSubscriptionsTab()}
        {activeTab === "plans" && renderPlansTab()}
        {activeTab === "shipments" && renderShipmentsTab()}

        {/* Detail Modal */}
        <AdminModal
          visible={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedOrder(null);
          }}
          title={
            activeTab === "subscriptions"
              ? `Subscription ${(selectedOrder as SubscriptionBox)?.id}`
              : activeTab === "plans"
              ? `Plan ${(selectedOrder as SubscriptionBoxPlan)?.name}`
              : `Shipment #${(selectedOrder as SubscriptionBoxShipment)?.shipmentNumber}`
          }
        >
          {selectedOrder && (
            <View style={{ gap: spacing.md }}>
              {activeTab === "subscriptions" && selectedOrder && "userId" in selectedOrder && (
                <>
                  <View style={{ gap: spacing.sm }}>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                      Subscription ID
                    </Text>
                    <Text style={{ fontSize: typography.sizes.md, color: colors.text.primary }}>
                      {(selectedOrder as SubscriptionBox).id}
                    </Text>
                  </View>
                  <View style={{ gap: spacing.sm }}>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                      User ID
                    </Text>
                    <Text style={{ fontSize: typography.sizes.md, color: colors.text.primary }}>
                      {(selectedOrder as SubscriptionBox).userId}
                    </Text>
                  </View>
                  <View style={{ gap: spacing.sm }}>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                      Frequency
                    </Text>
                    <Text style={{ fontSize: typography.sizes.md, color: colors.text.primary }}>
                      {getFrequencyLabel((selectedOrder as SubscriptionBox).frequency)}
                    </Text>
                  </View>
                  <View style={{ gap: spacing.sm }}>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                      Duration
                    </Text>
                    <Text style={{ fontSize: typography.sizes.md, color: colors.text.primary }}>
                      {getDurationLabel((selectedOrder as SubscriptionBox).duration)}
                    </Text>
                  </View>
                  <View style={{ gap: spacing.sm }}>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                      Status
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.sizes.md,
                        color: getStatusColor((selectedOrder as SubscriptionBox).status),
                      }}
                    >
                      {(selectedOrder as SubscriptionBox).status}
                    </Text>
                  </View>
                  <View style={{ gap: spacing.sm }}>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                      Next Billing Date
                    </Text>
                    <Text style={{ fontSize: typography.sizes.md, color: colors.text.primary }}>
                      {formatDate((selectedOrder as SubscriptionBox).nextBillingDate)}
                    </Text>
                  </View>
                  <View style={{ gap: spacing.sm }}>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                      Next Shipment Date
                    </Text>
                    <Text style={{ fontSize: typography.sizes.md, color: colors.text.primary }}>
                      {formatDate((selectedOrder as SubscriptionBox).nextShipmentDate)}
                    </Text>
                  </View>
                  <View style={{ gap: spacing.sm }}>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                      Shipments Completed
                    </Text>
                    <Text style={{ fontSize: typography.sizes.md, color: colors.text.primary }}>
                      {(selectedOrder as SubscriptionBox).shipmentsCompleted} /{" "}
                      {(selectedOrder as SubscriptionBox).shipmentsRemaining === -1
                        ? "∞"
                        : (selectedOrder as SubscriptionBox).shipmentsRemaining +
                          (selectedOrder as SubscriptionBox).shipmentsCompleted}
                    </Text>
                  </View>
                </>
              )}
              {activeTab === "plans" && selectedOrder && "productId" in selectedOrder && (
                <>
                  <View style={{ gap: spacing.sm }}>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                      Plan ID
                    </Text>
                    <Text style={{ fontSize: typography.sizes.md, color: colors.text.primary }}>
                      {(selectedOrder as SubscriptionBoxPlan).id}
                    </Text>
                  </View>
                  <View style={{ gap: spacing.sm }}>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                      Product ID
                    </Text>
                    <Text style={{ fontSize: typography.sizes.md, color: colors.text.primary }}>
                      {(selectedOrder as SubscriptionBoxPlan).productId}
                    </Text>
                  </View>
                  <View style={{ gap: spacing.sm }}>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                      Merchant ID
                    </Text>
                    <Text style={{ fontSize: typography.sizes.md, color: colors.text.primary }}>
                      {(selectedOrder as SubscriptionBoxPlan).merchantId}
                    </Text>
                  </View>
                  <View style={{ gap: spacing.sm }}>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                      Frequency
                    </Text>
                    <Text style={{ fontSize: typography.sizes.md, color: colors.text.primary }}>
                      {getFrequencyLabel((selectedOrder as SubscriptionBoxPlan).frequency)}
                    </Text>
                  </View>
                  <View style={{ gap: spacing.sm }}>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                      Price Per Shipment
                    </Text>
                    <Text style={{ fontSize: typography.sizes.md, color: colors.text.primary }}>
                      {formatCurrency(
                        (selectedOrder as SubscriptionBoxPlan).pricePerShipment +
                          (selectedOrder as SubscriptionBoxPlan).shippingCostPerShipment,
                        (selectedOrder as SubscriptionBoxPlan).currency
                      )}
                    </Text>
                  </View>
                </>
              )}
              {activeTab === "shipments" && selectedOrder && "shipmentNumber" in selectedOrder && (
                <>
                  <View style={{ gap: spacing.sm }}>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                      Shipment ID
                    </Text>
                    <Text style={{ fontSize: typography.sizes.md, color: colors.text.primary }}>
                      {(selectedOrder as SubscriptionBoxShipment).id}
                    </Text>
                  </View>
                  <View style={{ gap: spacing.sm }}>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                      Subscription ID
                    </Text>
                    <Text style={{ fontSize: typography.sizes.md, color: colors.text.primary }}>
                      {(selectedOrder as SubscriptionBoxShipment).subscriptionBoxId}
                    </Text>
                  </View>
                  <View style={{ gap: spacing.sm }}>
                    <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                      Status
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.sizes.md,
                        color: getStatusColor((selectedOrder as SubscriptionBoxShipment).status),
                      }}
                    >
                      {(selectedOrder as SubscriptionBoxShipment).status}
                    </Text>
                  </View>
                  {(selectedOrder as SubscriptionBoxShipment).trackingNumber && (
                    <View style={{ gap: spacing.sm }}>
                      <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                        Tracking Number
                      </Text>
                      <Text style={{ fontSize: typography.sizes.md, color: colors.text.primary }}>
                        {(selectedOrder as SubscriptionBoxShipment).trackingNumber}
                      </Text>
                    </View>
                  )}
                  {(selectedOrder as SubscriptionBoxShipment).carrier && (
                    <View style={{ gap: spacing.sm }}>
                      <Text style={{ fontSize: typography.sizes.sm, color: colors.text.secondary }}>
                        Carrier
                      </Text>
                      <Text style={{ fontSize: typography.sizes.md, color: colors.text.primary }}>
                        {(selectedOrder as SubscriptionBoxShipment).carrier}
                      </Text>
                    </View>
                  )}
                </>
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
          title="Flag for Review"
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
              label: "Flag",
              onPress: handleFlagForReview,
              variant: "primary",
            },
          ]}
        >
          <View style={{ gap: spacing.md }}>
            <Text style={{ fontSize: typography.sizes.md, color: colors.text.secondary }}>
              Add a note explaining why this needs review:
            </Text>
            <TextInput
              value={flagNote}
              onChangeText={setFlagNote}
              placeholder="Enter reason for flagging..."
              placeholderTextColor={colors.text.placeholder}
              multiline
              numberOfLines={4}
              style={{
                backgroundColor: colors.background,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                color: colors.text.primary,
                fontSize: typography.sizes.md,
                borderWidth: 1,
                borderColor: colors.border,
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

