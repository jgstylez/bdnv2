/**
 * Service Bookings Management Page for Nonprofits
 * 
 * Allows nonprofits to view, filter, and manage service bookings
 */

import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Platform } from "react-native";
import { Image } from "expo-image";
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
import { formatCurrency } from '@/lib/international';
import { ProductPlaceholder } from '@/components/ProductPlaceholder';

interface ServiceBooking {
  id: string;
  bookingNumber: string;
  productId: string;
  productName: string;
  organizationId: string;
  organizationName: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  bookingDate: string; // ISO date string
  bookingTime: string; // e.g., "14:00"
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no-show";
  price: number;
  currency: string;
  specialRequirements?: string;
  imageUrl?: string;
  duration?: string;
  serviceLocation?: string;
  createdAt: string;
  confirmedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}

// Mock bookings data for nonprofits
const mockNonprofitBookings: ServiceBooking[] = [
  {
    id: "BK-NP-001",
    bookingNumber: "BK-NP-2024-001234",
    productId: "prod-np-1",
    productName: "Community Workshop: Financial Literacy",
    organizationId: "org1",
    organizationName: "Community Empowerment Foundation",
    customerId: "user-1",
    customerName: "Marcus Williams",
    customerEmail: "marcus.williams@example.com",
    customerPhone: "(404) 555-1234",
    bookingDate: "2024-03-25",
    bookingTime: "10:00",
    status: "confirmed",
    price: 0.0,
    currency: "USD",
    specialRequirements: "Need materials for 20 participants",
    duration: "2 hours",
    serviceLocation: "Community Center - Room A",
    createdAt: "2024-03-15T10:00:00Z",
    confirmedAt: "2024-03-15T10:05:00Z",
  },
  {
    id: "BK-NP-002",
    bookingNumber: "BK-NP-2024-001235",
    productId: "prod-np-2",
    productName: "Volunteer Orientation Session",
    organizationId: "org1",
    organizationName: "Community Empowerment Foundation",
    customerId: "user-2",
    customerName: "Jamal Thompson",
    customerEmail: "jamal.t@example.com",
    bookingDate: "2024-03-22",
    bookingTime: "14:00",
    status: "pending",
    price: 0.0,
    currency: "USD",
    duration: "1 hour",
    serviceLocation: "Main Office",
    createdAt: "2024-03-10T09:00:00Z",
  },
  {
    id: "BK-NP-003",
    bookingNumber: "BK-NP-2024-001236",
    productId: "prod-np-3",
    productName: "Mentorship Program - Initial Consultation",
    organizationId: "org2",
    organizationName: "Youth Development Initiative",
    customerId: "user-3",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@example.com",
    bookingDate: "2024-03-05",
    bookingTime: "11:00",
    status: "completed",
    price: 0.0,
    currency: "USD",
    duration: "1 hour",
    serviceLocation: "remote",
    createdAt: "2024-02-28T15:00:00Z",
    confirmedAt: "2024-02-28T15:10:00Z",
    completedAt: "2024-03-05T12:00:00Z",
  },
];

export default function NonprofitBookingsManagement() {
  const router = useRouter();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const { selectedNonprofit, isLoading } = useNonprofit();
  const [bookings, setBookings] = useState<ServiceBooking[]>(mockNonprofitBookings);
  const [filteredBookings, setFilteredBookings] = useState<ServiceBooking[]>(mockNonprofitBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load bookings for selected nonprofit
  useEffect(() => {
    if (selectedNonprofit) {
      const nonprofitBookings = mockNonprofitBookings.filter(booking => booking.organizationId === selectedNonprofit.id);
      setBookings(nonprofitBookings);
    } else {
      setBookings([]);
    }
  }, [selectedNonprofit]);

  // Filter bookings
  useEffect(() => {
    let filtered = bookings;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.bookingNumber.toLowerCase().includes(query) ||
          booking.customerName.toLowerCase().includes(query) ||
          booking.customerEmail.toLowerCase().includes(query) ||
          booking.productName.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((booking) => booking.status === selectedStatus);
    }

    // Filter by nonprofit
    if (selectedNonprofit) {
      filtered = filtered.filter((booking) => booking.organizationId === selectedNonprofit.id);
    }

    setFilteredBookings(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, bookings, selectedNonprofit]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: filteredBookings.length,
      pending: filteredBookings.filter((b) => b.status === "pending").length,
      confirmed: filteredBookings.filter((b) => b.status === "confirmed").length,
      completed: filteredBookings.filter((b) => b.status === "completed").length,
      cancelled: filteredBookings.filter((b) => b.status === "cancelled").length,
    };
  }, [filteredBookings]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(`${dateString}T${timeString}`);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: ServiceBooking["status"]) => {
    switch (status) {
      case "confirmed":
        return colors.status.success;
      case "pending":
        return colors.status.warning;
      case "completed":
        return colors.status.info;
      case "cancelled":
      case "no-show":
        return colors.status.error;
      default:
        return colors.text.secondary;
    }
  };

  const getStatusLabel = (status: ServiceBooking["status"]) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "pending":
        return "Pending";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      case "no-show":
        return "No Show";
      default:
        return status;
    }
  };

  const handleUpdateStatus = (bookingId: string, newStatus: ServiceBooking["status"]) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status: newStatus,
              confirmedAt: newStatus === "confirmed" ? new Date().toISOString() : booking.confirmedAt,
              completedAt: newStatus === "completed" ? new Date().toISOString() : booking.completedAt,
              cancelledAt: newStatus === "cancelled" ? new Date().toISOString() : booking.cancelledAt,
            }
          : booking
      )
    );
    setShowDetailModal(false);
    Alert.alert("Success", `Booking status updated to ${getStatusLabel(newStatus)}`);
  };

  const handleConfirmBooking = (booking: ServiceBooking) => {
    Alert.alert(
      "Confirm Booking",
      `Confirm booking ${booking.bookingNumber}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => handleUpdateStatus(booking.id, "confirmed"),
        },
      ]
    );
  };

  const handleCompleteBooking = (booking: ServiceBooking) => {
    Alert.alert(
      "Complete Booking",
      `Mark booking ${booking.bookingNumber} as completed?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Complete",
          onPress: () => handleUpdateStatus(booking.id, "completed"),
        },
      ]
    );
  };

  const handleCancelBooking = (booking: ServiceBooking) => {
    Alert.alert(
      "Cancel Booking",
      `Cancel booking ${booking.bookingNumber}? This action cannot be undone.`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => handleUpdateStatus(booking.id, "cancelled"),
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: spacing.lg,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        <BackButton />

        <HeroSection
          title="Service Bookings"
          subtitle="Manage and track your service appointments"
        />

        {/* Nonprofit Switcher */}
        <NonprofitSwitcher />

        {/* Stats Cards */}
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            gap: spacing.md,
            marginBottom: spacing.lg,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: colors.input,
              borderRadius: borderRadius.lg,
              padding: spacing.md,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize["2xl"],
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              {stats.total}
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginTop: spacing.xs,
              }}
            >
              Total Bookings
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.input,
              borderRadius: borderRadius.lg,
              padding: spacing.md,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize["2xl"],
                fontWeight: typography.fontWeight.bold,
                color: colors.status.warning,
              }}
            >
              {stats.pending}
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginTop: spacing.xs,
              }}
            >
              Pending
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.input,
              borderRadius: borderRadius.lg,
              padding: spacing.md,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize["2xl"],
                fontWeight: typography.fontWeight.bold,
                color: colors.status.success,
              }}
            >
              {stats.confirmed}
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginTop: spacing.xs,
              }}
            >
              Confirmed
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.input,
              borderRadius: borderRadius.lg,
              padding: spacing.md,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize["2xl"],
                fontWeight: typography.fontWeight.bold,
                color: colors.status.info,
              }}
            >
              {stats.completed}
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginTop: spacing.xs,
              }}
            >
              Completed
            </Text>
          </View>
        </View>

        {/* Search and Filters */}
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            gap: spacing.md,
            marginBottom: spacing.lg,
          }}
        >
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by booking number, customer, or service..."
            placeholderTextColor={colors.text.placeholder}
            style={{
              flex: 1,
              backgroundColor: colors.input,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              borderWidth: 1,
              borderColor: colors.border.light,
              color: colors.text.primary,
              fontSize: typography.fontSize.base,
            }}
          />
          <FilterDropdown
            label="Status"
            options={[
              { value: "all", label: "All" },
              { value: "pending", label: "Pending" },
              { value: "confirmed", label: "Confirmed" },
              { value: "completed", label: "Completed" },
              { value: "cancelled", label: "Cancelled" },
            ]}
            value={selectedStatus}
            onSelect={setSelectedStatus}
          />
        </View>

        {/* Bookings List */}
        {paginatedBookings.length === 0 ? (
          <View
            style={{
              backgroundColor: colors.input,
              borderRadius: borderRadius.lg,
              padding: spacing["2xl"],
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <MaterialIcons name="event-busy" size={64} color={colors.text.secondary} />
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
                marginTop: spacing.md,
                marginBottom: spacing.xs,
              }}
            >
              No Bookings Found
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                textAlign: "center",
              }}
            >
              {selectedStatus === "all"
                ? "You don't have any service bookings yet."
                : `You don't have any ${selectedStatus} bookings.`}
            </Text>
          </View>
        ) : (
          <View style={{ gap: spacing.md }}>
            {paginatedBookings.map((booking) => (
              <TouchableOpacity
                key={booking.id}
                onPress={() => {
                  setSelectedBooking(booking);
                  setShowDetailModal(true);
                }}
                style={{
                  backgroundColor: colors.input,
                  borderRadius: borderRadius.lg,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.border.light,
                  ...(Platform.OS === "web" && {
                    // @ts-ignore - Web-only CSS properties
                    cursor: "pointer",
                  }),
                }}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: "row", gap: spacing.md }}>
                  {/* Service Image */}
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: borderRadius.md,
                      overflow: "hidden",
                      backgroundColor: colors.input,
                    }}
                  >
                    {booking.imageUrl ? (
                      <Image
                        source={{ uri: booking.imageUrl }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                      />
                    ) : (
                      <ProductPlaceholder width={80} height={80} aspectRatio={1} />
                    )}
                  </View>

                  {/* Booking Info */}
                  <View style={{ flex: 1, gap: spacing.xs }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: typography.fontSize.base,
                            fontWeight: typography.fontWeight.bold,
                            color: colors.text.primary,
                            marginBottom: spacing.xs / 2,
                          }}
                          numberOfLines={1}
                        >
                          {booking.productName}
                        </Text>
                        <Text
                          style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.text.secondary,
                          }}
                        >
                          {booking.customerName}
                        </Text>
                      </View>
                      <View
                        style={{
                          backgroundColor: getStatusColor(booking.status) + "20",
                          paddingVertical: spacing.xs / 2,
                          paddingHorizontal: spacing.sm,
                          borderRadius: borderRadius.sm,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            fontWeight: typography.fontWeight.semibold,
                            color: getStatusColor(booking.status),
                            textTransform: "uppercase",
                          }}
                        >
                          {getStatusLabel(booking.status)}
                        </Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                      <MaterialIcons name="event" size={16} color={colors.text.secondary} />
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.secondary,
                        }}
                      >
                        {formatDateTime(booking.bookingDate, booking.bookingTime)}
                      </Text>
                    </View>

                    {booking.serviceLocation && (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                        <MaterialIcons name="location-on" size={16} color={colors.text.secondary} />
                        <Text
                          style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.text.secondary,
                          }}
                          numberOfLines={1}
                        >
                          {booking.serviceLocation}
                        </Text>
                      </View>
                    )}

                    {booking.price > 0 && (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                        <MaterialIcons name="attach-money" size={16} color={colors.text.secondary} />
                        <Text
                          style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.text.primary,
                            fontWeight: typography.fontWeight.semibold,
                          }}
                        >
                          {formatCurrency(booking.price, booking.currency as any)}
                        </Text>
                      </View>
                    )}

                    <Text
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.text.tertiary,
                      }}
                    >
                      Booking #{booking.bookingNumber}
                    </Text>
                  </View>
                </View>

                {/* Quick Actions */}
                {booking.status === "pending" && (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: spacing.sm,
                      marginTop: spacing.md,
                      paddingTop: spacing.md,
                      borderTopWidth: 1,
                      borderTopColor: colors.border.light,
                    }}
                  >
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleConfirmBooking(booking);
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: colors.status.success + "20",
                        paddingVertical: spacing.sm,
                        borderRadius: borderRadius.md,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: colors.status.success,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.status.success,
                        }}
                      >
                        Confirm
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleCancelBooking(booking);
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: colors.status.error + "20",
                        paddingVertical: spacing.sm,
                        borderRadius: borderRadius.md,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: colors.status.error,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.status.error,
                        }}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {booking.status === "confirmed" && (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: spacing.sm,
                      marginTop: spacing.md,
                      paddingTop: spacing.md,
                      borderTopWidth: 1,
                      borderTopColor: colors.border.light,
                    }}
                  >
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleCompleteBooking(booking);
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: colors.status.info + "20",
                        paddingVertical: spacing.sm,
                        borderRadius: borderRadius.md,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: colors.status.info,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.status.info,
                        }}
                      >
                        Mark Complete
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleCancelBooking(booking);
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: colors.status.error + "20",
                        paddingVertical: spacing.sm,
                        borderRadius: borderRadius.md,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: colors.status.error,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.status.error,
                        }}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: spacing.sm,
              marginTop: spacing.lg,
            }}
          >
            <TouchableOpacity
              onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                borderRadius: borderRadius.md,
                backgroundColor: currentPage === 1 ? colors.input : colors.input,
                borderWidth: 1,
                borderColor: colors.border.light,
                opacity: currentPage === 1 ? 0.6 : 1,
              }}
            >
              <MaterialIcons
                name="chevron-left"
                size={20}
                color={currentPage === 1 ? colors.text.secondary : colors.text.primary}
              />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                paddingHorizontal: spacing.md,
              }}
            >
              Page {currentPage} of {totalPages}
            </Text>

            <TouchableOpacity
              onPress={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              style={{
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                borderRadius: borderRadius.md,
                backgroundColor: currentPage === totalPages ? colors.input : colors.input,
                borderWidth: 1,
                borderColor: colors.border.light,
                opacity: currentPage === totalPages ? 0.6 : 1,
              }}
            >
              <MaterialIcons
                name="chevron-right"
                size={20}
                color={currentPage === totalPages ? colors.text.secondary : colors.text.primary}
              />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Booking Detail Modal */}
      <Modal
        visible={showDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setShowDetailModal(false)}
          />
          {selectedBooking && (
            <View
              style={{
                backgroundColor: colors.input,
                borderTopLeftRadius: borderRadius.lg,
                borderTopRightRadius: borderRadius.lg,
                padding: spacing.lg,
                maxHeight: "90%",
              }}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.lg }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.xl,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.text.primary,
                    }}
                  >
                    Booking Details
                  </Text>
                  <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                    <MaterialIcons name="close" size={24} color={colors.text.secondary} />
                  </TouchableOpacity>
                </View>

                {/* Booking Info */}
                <View style={{ gap: spacing.md }}>
                  <View>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      Booking Number
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.text.primary,
                      }}
                    >
                      {selectedBooking.bookingNumber}
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      Service
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.text.primary,
                      }}
                    >
                      {selectedBooking.productName}
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      Customer
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        color: colors.text.primary,
                      }}
                    >
                      {selectedBooking.customerName}
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        marginTop: spacing.xs / 2,
                      }}
                    >
                      {selectedBooking.customerEmail}
                    </Text>
                    {selectedBooking.customerPhone && (
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.secondary,
                          marginTop: spacing.xs / 2,
                        }}
                      >
                        {selectedBooking.customerPhone}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      Date & Time
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        color: colors.text.primary,
                      }}
                    >
                      {formatDateTime(selectedBooking.bookingDate, selectedBooking.bookingTime)}
                    </Text>
                  </View>

                  {selectedBooking.duration && (
                    <View>
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.secondary,
                          marginBottom: spacing.xs,
                        }}
                      >
                        Duration
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          color: colors.text.primary,
                        }}
                      >
                        {selectedBooking.duration}
                      </Text>
                    </View>
                  )}

                  {selectedBooking.serviceLocation && (
                    <View>
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.secondary,
                          marginBottom: spacing.xs,
                        }}
                      >
                        Location
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          color: colors.text.primary,
                        }}
                      >
                        {selectedBooking.serviceLocation}
                      </Text>
                    </View>
                  )}

                  {selectedBooking.specialRequirements && (
                    <View>
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.secondary,
                          marginBottom: spacing.xs,
                        }}
                      >
                        Special Requirements
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          color: colors.text.primary,
                        }}
                      >
                        {selectedBooking.specialRequirements}
                      </Text>
                    </View>
                  )}

                  {selectedBooking.price > 0 && (
                    <View>
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.secondary,
                          marginBottom: spacing.xs,
                        }}
                      >
                        Price
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.fontSize.lg,
                          fontWeight: typography.fontWeight.bold,
                          color: colors.accent,
                        }}
                      >
                        {formatCurrency(selectedBooking.price, selectedBooking.currency as any)}
                      </Text>
                    </View>
                  )}

                  <View>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      Status
                    </Text>
                    <View
                      style={{
                        alignSelf: "flex-start",
                        backgroundColor: getStatusColor(selectedBooking.status) + "20",
                        paddingVertical: spacing.xs,
                        paddingHorizontal: spacing.md,
                        borderRadius: borderRadius.sm,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                          color: getStatusColor(selectedBooking.status),
                          textTransform: "uppercase",
                        }}
                      >
                        {getStatusLabel(selectedBooking.status)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                {selectedBooking.status === "pending" && (
                  <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.lg }}>
                    <TouchableOpacity
                      onPress={() => handleConfirmBooking(selectedBooking)}
                      style={{
                        flex: 1,
                        backgroundColor: colors.status.success,
                        paddingVertical: spacing.md,
                        borderRadius: borderRadius.md,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.bold,
                          color: "#ffffff",
                        }}
                      >
                        Confirm Booking
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleCancelBooking(selectedBooking)}
                      style={{
                        flex: 1,
                        backgroundColor: colors.status.error + "20",
                        paddingVertical: spacing.md,
                        borderRadius: borderRadius.md,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: colors.status.error,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.status.error,
                        }}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {selectedBooking.status === "confirmed" && (
                  <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.lg }}>
                    <TouchableOpacity
                      onPress={() => handleCompleteBooking(selectedBooking)}
                      style={{
                        flex: 1,
                        backgroundColor: colors.status.info,
                        paddingVertical: spacing.md,
                        borderRadius: borderRadius.md,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.bold,
                          color: "#ffffff",
                        }}
                      >
                        Mark Complete
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleCancelBooking(selectedBooking)}
                      style={{
                        flex: 1,
                        backgroundColor: colors.status.error + "20",
                        paddingVertical: spacing.md,
                        borderRadius: borderRadius.md,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: colors.status.error,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.status.error,
                        }}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}
