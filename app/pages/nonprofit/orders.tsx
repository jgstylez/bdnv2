/**
 * Orders Fulfillment Page for Nonprofits
 * 
 * Allows nonprofits to view, filter, and fulfill orders
 * Supports product orders, donations, and subscription boxes
 */

import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useNonprofit } from '@/contexts/NonprofitContext';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { HeroSection } from '@/components/layouts/HeroSection';
import { NonprofitSwitcher } from '@/components/NonprofitSwitcher';
import { BackButton } from '@/components/navigation/BackButton';
import { FilterDropdown } from '@/components/admin/FilterDropdown';
import { Order, OrderStatus, FulfillmentStatus, PaymentStatus, OrderType, OrderStats } from '@/types/orders';
import { formatCurrency } from '@/lib/international';

// Major shipping carriers
const SHIPPING_CARRIERS = [
  { value: "", label: "Select carrier..." },
  { value: "USPS", label: "USPS (United States Postal Service)" },
  { value: "FedEx", label: "FedEx" },
  { value: "UPS", label: "UPS (United Parcel Service)" },
  { value: "DHL", label: "DHL" },
  { value: "OnTrac", label: "OnTrac" },
  { value: "LaserShip", label: "LaserShip" },
  { value: "Amazon Logistics", label: "Amazon Logistics" },
  { value: "Other", label: "Other" },
];

// Mock orders data for nonprofits - in production, fetch from API
const mockNonprofitOrders: Order[] = [
  {
    id: "ord-np-1",
    orderNumber: "ORD-NP-2024-001234",
    entityId: "org1",
    entityType: "nonprofit",
    entityName: "Community Empowerment Foundation",
    orderType: "donation",
    customerId: "user-1",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    items: [
      {
        id: "item-np-1",
        productId: "donation-1",
        productName: "General Donation",
        productType: "service",
        quantity: 1,
        unitPrice: 50.00,
        totalPrice: 50.00,
        currency: "USD",
      },
    ],
    subtotal: 50.00,
    tax: 0,
    shippingCost: 0,
    serviceFee: 2.50,
    discount: 0,
    total: 52.50,
    currency: "USD",
    paymentStatus: "completed",
    paymentMethod: "Credit Card",
    transactionId: "txn-np-12345",
    paidAt: "2024-02-20T10:30:00Z",
    status: "completed",
    fulfillmentStatus: "fulfilled",
    campaignId: "campaign-1",
    createdAt: "2024-02-20T10:25:00Z",
    confirmedAt: "2024-02-20T10:30:00Z",
    completedAt: "2024-02-20T10:30:00Z",
  },
  {
    id: "ord-np-2",
    orderNumber: "ORD-NP-2024-001235",
    entityId: "org1",
    entityType: "nonprofit",
    entityName: "Community Empowerment Foundation",
    orderType: "product",
    customerId: "user-2",
    customerName: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    items: [
      {
        id: "item-np-2",
        productId: "prod-np-1",
        productName: "Community T-Shirt",
        productType: "physical",
        quantity: 2,
        unitPrice: 25.00,
        totalPrice: 50.00,
        currency: "USD",
      },
    ],
    subtotal: 50.00,
    tax: 4.00,
    shippingCost: 5.99,
    serviceFee: 3.00,
    discount: 0,
    total: 62.99,
    currency: "USD",
    paymentStatus: "completed",
    paymentMethod: "BLKD",
    transactionId: "txn-np-12346",
    paidAt: "2024-02-20T11:15:00Z",
    status: "confirmed",
    fulfillmentStatus: "unfulfilled",
    shippingAddress: {
      fullName: "Jane Smith",
      street: "456 Oak Ave",
      city: "Atlanta",
      state: "GA",
      postalCode: "30310",
      country: "US",
    },
    createdAt: "2024-02-20T11:10:00Z",
    confirmedAt: "2024-02-20T11:15:00Z",
  },
];

export default function NonprofitOrdersFulfillment() {
  const router = useRouter();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const { selectedNonprofit, isLoading } = useNonprofit();
  const [orders, setOrders] = useState<Order[]>(mockNonprofitOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockNonprofitOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedFulfillmentStatus, setSelectedFulfillmentStatus] = useState<string>("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>("all");
  const [selectedOrderType, setSelectedOrderType] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFulfillModal, setShowFulfillModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.customerEmail.toLowerCase().includes(query) ||
          order.items.some((item) => item.productName.toLowerCase().includes(query))
      );
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    // Filter by fulfillment status
    if (selectedFulfillmentStatus !== "all") {
      filtered = filtered.filter((order) => order.fulfillmentStatus === selectedFulfillmentStatus);
    }

    // Filter by payment status
    if (selectedPaymentStatus !== "all") {
      filtered = filtered.filter((order) => order.paymentStatus === selectedPaymentStatus);
    }

    // Filter by order type
    if (selectedOrderType !== "all") {
      filtered = filtered.filter((order) => order.orderType === selectedOrderType);
    }

    // Filter by nonprofit
    if (selectedNonprofit) {
      filtered = filtered.filter((order) => order.entityId === selectedNonprofit.id);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedFulfillmentStatus, selectedPaymentStatus, selectedOrderType, orders, selectedNonprofit]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Calculate stats
  const stats: OrderStats = {
    totalOrders: filteredOrders.length,
    pendingOrders: filteredOrders.filter((o) => o.status === "pending").length,
    processingOrders: filteredOrders.filter((o) => o.status === "processing").length,
    completedOrders: filteredOrders.filter((o) => o.status === "completed").length,
    totalRevenue: filteredOrders.reduce((sum, o) => sum + (o.paymentStatus === "completed" ? o.total : 0), 0),
    averageOrderValue: filteredOrders.length > 0
      ? filteredOrders.reduce((sum, o) => sum + o.total, 0) / filteredOrders.length
      : 0,
    period: "all",
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return colors.status.warning;
      case "confirmed":
      case "processing":
        return colors.status.info;
      case "shipped":
        return "#9c27b0";
      case "delivered":
      case "completed":
        return colors.status.success;
      case "cancelled":
      case "failed":
        return colors.status.error;
      default:
        return colors.text.secondary;
    }
  };

  const getFulfillmentStatusColor = (status: FulfillmentStatus) => {
    switch (status) {
      case "unfulfilled":
        return colors.status.warning;
      case "partial":
        return colors.status.info;
      case "fulfilled":
      case "shipped":
      case "delivered":
        return colors.status.success;
      default:
        return colors.text.secondary;
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleFulfillOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowFulfillModal(true);
  };

  const handleMarkAsShipped = () => {
    if (!selectedOrder || !trackingNumber || !carrier || carrier === "") {
      Alert.alert("Error", "Please select a carrier and provide tracking number");
      return;
    }

    // TODO: Update order via API
    setOrders(
      orders.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              status: "shipped" as OrderStatus,
              fulfillmentStatus: "shipped" as FulfillmentStatus,
              shippingInfo: {
                ...order.shippingInfo,
                carrier,
                trackingNumber,
                shippedAt: new Date().toISOString(),
                estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
              },
            }
          : order
      )
    );

    setShowFulfillModal(false);
    setTrackingNumber("");
    setCarrier("");
    setSelectedOrder(null);
    Alert.alert("Success", "Order marked as shipped");
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    // TODO: Update order status via API
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              ...(newStatus === "completed" && { completedAt: new Date().toISOString() }),
            }
          : order
      )
    );
  };

  const handleCancelOrder = (orderId: string) => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            // TODO: Cancel order via API
            handleUpdateStatus(orderId, "cancelled");
          },
        },
      ]
    );
  };

  if (isLoading || !selectedNonprofit) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.primary.bg, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.text.primary }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        {/* Nonprofit Switcher */}
        <NonprofitSwitcher />

        {/* Back Button */}
        <BackButton />

        {/* Header */}
        <HeroSection
          title="Orders Fulfillment"
          subtitle={`Manage orders and donations for ${selectedNonprofit.name}`}
        />

        {/* Stats Cards */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: isMobile ? "wrap" : "nowrap",
            gap: isMobile ? spacing.md : spacing.md,
            marginBottom: spacing.xl,
          }}
        >
          {[
            { label: "Total Orders", value: stats.totalOrders, icon: "receipt", color: colors.status.info },
            { label: "Pending", value: stats.pendingOrders, icon: "schedule", color: colors.status.warning },
            { label: "Processing", value: stats.processingOrders, icon: "autorenew", color: colors.status.info },
            { label: "Completed", value: stats.completedOrders, icon: "check-circle", color: colors.status.success },
            {
              label: "Total Revenue",
              value: formatCurrency(stats.totalRevenue, "USD"),
              icon: "attach-money",
              color: colors.status.success,
            },
            {
              label: "Avg Order Value",
              value: formatCurrency(stats.averageOrderValue, "USD"),
              icon: "trending-up",
              color: colors.accent,
            },
          ].map((stat, index) => (
            <View
              key={index}
              style={{
                ...(isMobile 
                  ? { width: "calc(50% - 8px)" }
                  : { flex: 1, minWidth: 0 }
                ),
                backgroundColor: colors.secondary.bg,
                borderRadius: borderRadius.lg,
                padding: spacing.lg,
                borderWidth: 1,
                borderColor: colors.accentBorder,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.sm }}>
                <MaterialIcons name={stat.icon as any} size={20} color={stat.color} />
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.text.secondary,
                    marginLeft: spacing.xs,
                  }}
                >
                  {stat.label}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: typography.fontSize["2xl"],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                }}
              >
                {stat.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Filters */}
        <View
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.xl,
            borderWidth: 1,
            borderColor: colors.accentBorder,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Filters
          </Text>

          {/* Search */}
          <View style={{ marginBottom: spacing.lg }}>
            <TextInput
              style={{
                backgroundColor: colors.background.input,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                color: colors.text.primary,
                borderWidth: 1,
                borderColor: colors.border.light,
              }}
              placeholder="Search by order number, customer, or product..."
              placeholderTextColor={colors.text.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filter Dropdowns */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: spacing.md,
            }}
          >
            <FilterDropdown
              label="Status"
              options={[
                { value: "all", label: "All Statuses" },
                { value: "pending", label: "Pending" },
                { value: "confirmed", label: "Confirmed" },
                { value: "processing", label: "Processing" },
                { value: "shipped", label: "Shipped" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
              ]}
              value={selectedStatus}
              onSelect={setSelectedStatus}
            />
            <FilterDropdown
              label="Fulfillment"
              options={[
                { value: "all", label: "All" },
                { value: "unfulfilled", label: "Unfulfilled" },
                { value: "partial", label: "Partial" },
                { value: "fulfilled", label: "Fulfilled" },
                { value: "shipped", label: "Shipped" },
                { value: "delivered", label: "Delivered" },
              ]}
              value={selectedFulfillmentStatus}
              onSelect={setSelectedFulfillmentStatus}
            />
            <FilterDropdown
              label="Payment"
              options={[
                { value: "all", label: "All" },
                { value: "pending", label: "Pending" },
                { value: "completed", label: "Completed" },
                { value: "failed", label: "Failed" },
                { value: "refunded", label: "Refunded" },
              ]}
              value={selectedPaymentStatus}
              onSelect={setSelectedPaymentStatus}
            />
            <FilterDropdown
              label="Type"
              options={[
                { value: "all", label: "All Types" },
                { value: "product", label: "Product" },
                { value: "donation", label: "Donation" },
                { value: "subscription-box", label: "Subscription Box" },
              ]}
              value={selectedOrderType}
              onSelect={setSelectedOrderType}
            />
          </View>
        </View>

        {/* Orders List */}
        <View>
          <Text
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Orders ({filteredOrders.length})
          </Text>

          {paginatedOrders.length === 0 ? (
            <View
              style={{
                backgroundColor: colors.secondary.bg,
                borderRadius: borderRadius.lg,
                padding: spacing["4xl"],
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.accentBorder,
              }}
            >
              <MaterialIcons name="inbox" size={64} color={colors.text.tertiary} />
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  color: colors.text.secondary,
                  marginTop: spacing.md,
                }}
              >
                No orders found
              </Text>
            </View>
          ) : (
            paginatedOrders.map((order) => (
              <TouchableOpacity
                key={order.id}
                onPress={() => handleViewOrder(order)}
                style={{
                  backgroundColor: colors.secondary.bg,
                  borderRadius: borderRadius.lg,
                  padding: spacing.lg,
                  marginBottom: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.accentBorder,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize.lg,
                        fontWeight: typography.fontWeight.bold,
                        color: colors.text.primary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {order.orderNumber}
                    </Text>
                    <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                      {order.customerName}
                    </Text>
                    <View style={{ flexDirection: "row", gap: spacing.xs, flexWrap: "wrap", marginTop: spacing.xs }}>
                      <View
                        style={{
                          paddingHorizontal: spacing.sm,
                          paddingVertical: 2,
                          borderRadius: borderRadius.sm,
                          backgroundColor: getStatusColor(order.status) + "20",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: getStatusColor(order.status),
                            textTransform: "capitalize",
                          }}
                        >
                          {order.status}
                        </Text>
                      </View>
                      <View
                        style={{
                          paddingHorizontal: spacing.sm,
                          paddingVertical: 2,
                          borderRadius: borderRadius.sm,
                          backgroundColor: getFulfillmentStatusColor(order.fulfillmentStatus) + "20",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: getFulfillmentStatusColor(order.fulfillmentStatus),
                            textTransform: "capitalize",
                          }}
                        >
                          {order.fulfillmentStatus}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize.xl,
                        fontWeight: typography.fontWeight.bold,
                        color: colors.text.primary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {formatCurrency(order.total, order.currency)}
                    </Text>
                    <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                {/* Tracking Info */}
                {order.shippingInfo?.trackingNumber && (
                  <View
                    style={{
                      backgroundColor: colors.accentLight,
                      borderRadius: borderRadius.md,
                      padding: spacing.sm,
                      marginBottom: spacing.md,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: spacing.xs,
                    }}
                  >
                    <MaterialIcons name="local-shipping" size={16} color={colors.accent} />
                    <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, flex: 1 }}>
                      <Text style={{ fontWeight: typography.fontWeight.semibold }}>{order.shippingInfo.carrier}:</Text>{" "}
                      {order.shippingInfo.trackingNumber}
                    </Text>
                  </View>
                )}

                <View style={{ flexDirection: "row", gap: spacing.sm }}>
                  <TouchableOpacity
                    onPress={() => handleViewOrder(order)}
                    style={{
                      flex: 1,
                      paddingVertical: spacing.sm,
                      borderRadius: borderRadius.md,
                      backgroundColor: colors.accent + "20",
                      borderWidth: 1,
                      borderColor: colors.accent,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: typography.fontSize.sm, color: colors.accent, fontWeight: typography.fontWeight.semibold }}>
                      View Details
                    </Text>
                  </TouchableOpacity>
                  {order.paymentStatus === "completed" && !order.shippingInfo?.trackingNumber && order.orderType !== "donation" && (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleFulfillOrder(order);
                      }}
                      style={{
                        flex: 1,
                        paddingVertical: spacing.sm,
                        borderRadius: borderRadius.md,
                        backgroundColor: colors.status.info + "20",
                        borderWidth: 1,
                        borderColor: colors.status.info,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.status.info,
                          fontWeight: typography.fontWeight.semibold,
                        }}
                      >
                        Add Tracking #
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: spacing.md,
                marginTop: spacing.xl,
              }}
            >
              <TouchableOpacity
                onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: spacing.sm,
                  borderRadius: borderRadius.md,
                  backgroundColor: currentPage === 1 ? colors.background.input : colors.secondary.bg,
                  borderWidth: 1,
                  borderColor: colors.border.light,
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
              >
                <MaterialIcons name="chevron-left" size={20} color={colors.text.primary} />
              </TouchableOpacity>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                Page {currentPage} of {totalPages}
              </Text>
              <TouchableOpacity
                onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: spacing.sm,
                  borderRadius: borderRadius.md,
                  backgroundColor: currentPage === totalPages ? colors.background.input : colors.secondary.bg,
                  borderWidth: 1,
                  borderColor: colors.border.light,
                  opacity: currentPage === totalPages ? 0.5 : 1,
                }}
              >
                <MaterialIcons name="chevron-right" size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Order Detail Modal - Same as business version but adapted for nonprofits */}
      <Modal visible={showDetailModal} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: colors.secondary.bg,
              borderTopLeftRadius: borderRadius["2xl"],
              borderTopRightRadius: borderRadius["2xl"],
              padding: spacing.xl,
              maxHeight: "90%",
            }}
          >
            <ScrollView>
              {selectedOrder && (
                <>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.xl }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize["2xl"],
                        fontWeight: typography.fontWeight.bold,
                        color: colors.text.primary,
                      }}
                    >
                      Order Details
                    </Text>
                    <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                      <MaterialIcons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                  </View>

                  <View style={{ marginBottom: spacing.lg }}>
                    <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                      Order Number
                    </Text>
                    <Text style={{ fontSize: typography.fontSize.lg, color: colors.text.primary, fontWeight: typography.fontWeight.bold }}>
                      {selectedOrder.orderNumber}
                    </Text>
                  </View>

                  <View style={{ marginBottom: spacing.lg }}>
                    <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                      Customer
                    </Text>
                    <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>{selectedOrder.customerName}</Text>
                    <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>{selectedOrder.customerEmail}</Text>
                    {selectedOrder.customerPhone && (
                      <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>{selectedOrder.customerPhone}</Text>
                    )}
                  </View>

                  <View style={{ marginBottom: spacing.lg }}>
                    <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                      Items
                    </Text>
                    {selectedOrder.items.map((item) => (
                      <View
                        key={item.id}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingVertical: spacing.sm,
                          borderBottomWidth: 1,
                          borderBottomColor: colors.border.light,
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                            {item.quantity}x {item.productName}
                          </Text>
                          {item.variantName && (
                            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>{item.variantName}</Text>
                          )}
                        </View>
                        <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                          {formatCurrency(item.totalPrice, item.currency)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={{ marginBottom: spacing.lg }}>
                    <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                      Pricing Breakdown
                    </Text>
                    <View style={{ gap: spacing.xs }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Subtotal</Text>
                        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                          {formatCurrency(selectedOrder.subtotal, selectedOrder.currency)}
                        </Text>
                      </View>
                      {selectedOrder.tax > 0 && (
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Tax</Text>
                          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                            {formatCurrency(selectedOrder.tax, selectedOrder.currency)}
                          </Text>
                        </View>
                      )}
                      {selectedOrder.shippingCost > 0 && (
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Shipping</Text>
                          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                            {formatCurrency(selectedOrder.shippingCost, selectedOrder.currency)}
                          </Text>
                        </View>
                      )}
                      {selectedOrder.serviceFee > 0 && (
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Service Fee</Text>
                          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                            {formatCurrency(selectedOrder.serviceFee, selectedOrder.currency)}
                          </Text>
                        </View>
                      )}
                      {selectedOrder.discount > 0 && (
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Discount</Text>
                          <Text style={{ fontSize: typography.fontSize.sm, color: colors.status.success }}>
                            -{formatCurrency(selectedOrder.discount, selectedOrder.currency)}
                          </Text>
                        </View>
                      )}
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginTop: spacing.xs,
                          paddingTop: spacing.xs,
                          borderTopWidth: 1,
                          borderTopColor: colors.border.light,
                        }}
                      >
                        <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>
                          Total
                        </Text>
                        <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>
                          {formatCurrency(selectedOrder.total, selectedOrder.currency)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {selectedOrder.shippingAddress && (
                    <View style={{ marginBottom: spacing.lg }}>
                      <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                        Shipping Address
                      </Text>
                      <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                        {selectedOrder.shippingAddress.fullName}
                      </Text>
                      <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                        {selectedOrder.shippingAddress.street}
                      </Text>
                      <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                      </Text>
                      <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                        {selectedOrder.shippingAddress.country}
                      </Text>
                    </View>
                  )}

                  {selectedOrder.shippingInfo?.trackingNumber && (
                    <View style={{ marginBottom: spacing.lg }}>
                      <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                        Tracking Information
                      </Text>
                      <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                        Carrier: {selectedOrder.shippingInfo.carrier}
                      </Text>
                      <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                        Tracking: {selectedOrder.shippingInfo.trackingNumber}
                      </Text>
                      {selectedOrder.shippingInfo.shippedAt && (
                        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                          Shipped: {new Date(selectedOrder.shippingInfo.shippedAt).toLocaleString()}
                        </Text>
                      )}
                      {selectedOrder.shippingInfo.estimatedDeliveryDate && (
                        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                          Estimated Delivery: {new Date(selectedOrder.shippingInfo.estimatedDeliveryDate).toLocaleDateString()}
                        </Text>
                      )}
                    </View>
                  )}

                  <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.xl }}>
                    <TouchableOpacity
                      onPress={() => setShowDetailModal(false)}
                      style={{
                        flex: 1,
                        paddingVertical: spacing.md,
                        borderRadius: borderRadius.md,
                        backgroundColor: colors.secondary.bg,
                        borderWidth: 1,
                        borderColor: colors.border.light,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>Close</Text>
                    </TouchableOpacity>
                    {selectedOrder.fulfillmentStatus === "unfulfilled" &&
                      selectedOrder.paymentStatus === "completed" &&
                      selectedOrder.orderType !== "donation" && (
                        <TouchableOpacity
                          onPress={() => {
                            setShowDetailModal(false);
                            handleFulfillOrder(selectedOrder);
                          }}
                          style={{
                            flex: 1,
                            paddingVertical: spacing.md,
                            borderRadius: borderRadius.md,
                            backgroundColor: colors.status.success,
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary, fontWeight: typography.fontWeight.bold }}>
                            Add Tracking #
                          </Text>
                        </TouchableOpacity>
                      )}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Fulfill Order Modal - Same as business version */}
      <Modal visible={showFulfillModal} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: colors.secondary.bg,
              borderTopLeftRadius: borderRadius["2xl"],
              borderTopRightRadius: borderRadius["2xl"],
              padding: spacing.xl,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.xl }}>
              <Text
                style={{
                  fontSize: typography.fontSize["2xl"],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                }}
              >
                Add Tracking Information
              </Text>
              <TouchableOpacity onPress={() => setShowFulfillModal(false)}>
                <MaterialIcons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            {selectedOrder && (
              <>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary, marginBottom: spacing.lg }}>
                  Order: {selectedOrder.orderNumber}
                </Text>

                <View style={{ marginBottom: spacing.lg }}>
                  <FilterDropdown
                    label="Carrier *"
                    options={SHIPPING_CARRIERS}
                    value={carrier}
                    onSelect={setCarrier}
                    placeholder="Select carrier..."
                  />
                </View>

                <View style={{ marginBottom: spacing.xl }}>
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                    Tracking Number *
                  </Text>
                  <TextInput
                    style={{
                      backgroundColor: colors.background.input,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                      color: colors.text.primary,
                      borderWidth: 1,
                      borderColor: colors.border.light,
                    }}
                    placeholder="Enter tracking number"
                    placeholderTextColor={colors.text.placeholder}
                    value={trackingNumber}
                    onChangeText={setTrackingNumber}
                  />
                </View>

                <View style={{ flexDirection: "row", gap: spacing.md }}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowFulfillModal(false);
                      setTrackingNumber("");
                      setCarrier("");
                    }}
                    style={{
                      flex: 1,
                      paddingVertical: spacing.md,
                      borderRadius: borderRadius.md,
                      backgroundColor: colors.secondary.bg,
                      borderWidth: 1,
                      borderColor: colors.border.light,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleMarkAsShipped}
                    style={{
                      flex: 1,
                      paddingVertical: spacing.md,
                      borderRadius: borderRadius.md,
                      backgroundColor: colors.status.success,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary, fontWeight: typography.fontWeight.bold }}>
                      Add Tracking #
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

