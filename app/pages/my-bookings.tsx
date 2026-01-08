/**
 * My Bookings Page
 * 
 * Displays user's service bookings/appointments
 * Allows viewing, managing, and canceling bookings
 */

import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, Alert } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { BackButton } from '@/components/navigation/BackButton';
import { formatCurrency } from '@/lib/international';
import { ProductPlaceholder } from '@/components/ProductPlaceholder';

interface ServiceBooking {
  id: string;
  productId: string;
  productName: string;
  merchantId: string;
  merchantName: string;
  bookingDate: string; // ISO date string
  bookingTime: string; // e.g., "14:00"
  status: "confirmed" | "pending" | "completed" | "cancelled";
  price: number;
  currency: string;
  specialRequirements?: string;
  imageUrl?: string;
  createdAt: string;
}

// Mock bookings data
const mockBookings: ServiceBooking[] = [
  {
    id: "BK-001",
    productId: "prod-7",
    productName: "Virtual Fitness Coaching",
    merchantId: "merchant-7",
    merchantName: "Fit & Strong Wellness",
    bookingDate: "2024-03-20",
    bookingTime: "10:00",
    status: "confirmed",
    price: 60.0,
    currency: "USD",
    specialRequirements: "Focus on upper body strength",
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "BK-002",
    productId: "prod-6",
    productName: "Professional Resume Review",
    merchantId: "merchant-6",
    merchantName: "Career Boost Services",
    bookingDate: "2024-03-18",
    bookingTime: "14:00",
    status: "pending",
    price: 75.0,
    currency: "USD",
    createdAt: "2024-03-10T09:00:00Z",
  },
  {
    id: "BK-003",
    productId: "prod-8",
    productName: "Custom Logo Design",
    merchantId: "merchant-8",
    merchantName: "Creative Design Studio",
    bookingDate: "2024-03-05",
    bookingTime: "11:00",
    status: "completed",
    price: 299.99,
    currency: "USD",
    createdAt: "2024-02-28T15:00:00Z",
  },
];

export default function MyBookings() {
  const router = useRouter();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending" | "completed" | "cancelled">("all");

  const filteredBookings = mockBookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
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
      default:
        return status;
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => {
            // TODO: Implement cancellation API call
            Alert.alert("Success", "Booking cancelled successfully");
          },
        },
      ]
    );
  };

  const handleViewDetails = (booking: ServiceBooking) => {
    // TODO: Navigate to booking details page
    Alert.alert("Booking Details", `Booking ID: ${booking.id}\nStatus: ${getStatusLabel(booking.status)}`);
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

        <Text
          style={{
            fontSize: isMobile ? typography.fontSize["2xl"] : typography.fontSize["3xl"],
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            marginBottom: spacing.lg,
          }}
        >
          My Bookings
        </Text>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing.sm, marginBottom: spacing.lg }}
        >
          {(["all", "confirmed", "pending", "completed", "cancelled"] as const).map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setFilter(status)}
              style={{
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                borderRadius: borderRadius.full,
                backgroundColor: filter === status ? colors.accent : colors.secondary.bg,
                borderWidth: 1,
                borderColor: filter === status ? colors.accent : colors.border.light,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: filter === status ? colors.textColors.onAccent : colors.text.secondary,
                  textTransform: "capitalize",
                }}
              >
                {status === "all" ? "All" : status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <View
            style={{
              backgroundColor: colors.secondary.bg,
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
              {filter === "all"
                ? "You don't have any service bookings yet."
                : `You don't have any ${filter} bookings.`}
            </Text>
          </View>
        ) : (
          <View style={{ gap: spacing.md }}>
            {filteredBookings.map((booking) => (
              <TouchableOpacity
                key={booking.id}
                onPress={() => handleViewDetails(booking)}
                style={{
                  backgroundColor: colors.secondary.bg,
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
                      backgroundColor: colors.secondary.bg,
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
                            marginBottom: spacing.xs,
                          }}
                        >
                          {booking.merchantName}
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

                    {booking.specialRequirements && (
                      <View style={{ marginTop: spacing.xs }}>
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.text.tertiary,
                            fontStyle: "italic",
                          }}
                          numberOfLines={2}
                        >
                          "{booking.specialRequirements}"
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Actions */}
                {(booking.status === "confirmed" || booking.status === "pending") && (
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
                      onPress={() => router.push(`/pages/products/${booking.productId}`)}
                      style={{
                        flex: 1,
                        backgroundColor: colors.secondary.bg,
                        paddingVertical: spacing.sm,
                        borderRadius: borderRadius.md,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: colors.border.light,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.text.primary,
                        }}
                      >
                        View Service
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleCancelBooking(booking.id)}
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
      </ScrollView>
    </View>
  );
}
