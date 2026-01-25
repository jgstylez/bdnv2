/**
 * Service Booking Page
 * 
 * Handles booking flow for service products
 * Includes date/time selection, special requirements, and payment processing
 */

import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { calculateConsumerTotalWithFee, checkBDNPlusSubscription } from '@/lib/fees';
import { formatCurrency } from '@/lib/international';
import { Product } from '@/types/merchant';
import { Currency } from '@/types/wallet';
import { ProductPlaceholder } from '@/components/ProductPlaceholder';
import { PaymentMethodSelector } from '@/components/checkout/PaymentMethodSelector';
import { getMerchantName } from '@/lib/merchant-lookup';
import { BackButton } from '@/components/navigation/BackButton';
import { mockProducts as centralizedMockProducts, getMockProduct } from '@/data/mocks/products';
import { mockWallets } from '@/data/mocks/wallets';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

type BookingStep = "details" | "date-time" | "review" | "processing" | "success";

export default function BookService() {
  const router = useRouter();
  const params = useLocalSearchParams<{ productId?: string }>();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const [currentStep, setCurrentStep] = useState<BookingStep>("details");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [useBLKD, setUseBLKD] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Get product
  const productId = params.productId || "";
  const product = getMockProduct(productId);

  useEffect(() => {
    if (!product) {
      Alert.alert("Error", "Service not found", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } else if (product.productType !== "service") {
      Alert.alert("Error", "This is not a service product", [
        { text: "OK", onPress: () => router.back() }
      ]);
    }
  }, [product]);

  if (!product || product.productType !== "service") {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.text.primary }}>Loading...</Text>
      </View>
    );
  }

  // Calculate pricing
  const hasBDNPlus = checkBDNPlusSubscription("current-user-id");
  const feeCalculation = calculateConsumerTotalWithFee(product.price, product.currency, hasBDNPlus);
  const serviceFee = feeCalculation.serviceFee;
  const totalAmount = feeCalculation.total;

  // Get BLKD wallet
  const blkdWallet = mockWallets.find((w) => (w as any).type === "myimpact" && w.currency === "BLKD");
  const blkdBalance = blkdWallet?.balance || 0;

  // Calculate BLKD coverage
  const blkdCoverage = useBLKD && blkdBalance > 0 ? Math.min(blkdBalance, totalAmount) : 0;
  const remainingAfterBLKD = totalAmount - blkdCoverage;

  // Available payment methods (PaymentMethodSelector will filter by balance internally)
  const availableWallets = mockWallets.filter(
    (w) => (w as any).type !== "myimpact" && w.currency === product.currency
  );

  // Generate available time slots (example: every hour from 9 AM to 5 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const time = `${hour.toString().padStart(2, "0")}:00`;
      slots.push(time);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Get next available dates (next 30 days)
  const getAvailableDates = () => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  const handleNext = () => {
    if (currentStep === "details") {
      if (product.bookingRequired) {
        setCurrentStep("date-time");
      } else {
        setCurrentStep("review");
      }
    } else if (currentStep === "date-time") {
      if (!selectedDate || !selectedTime) {
        Alert.alert("Required", "Please select both date and time");
        return;
      }
      setCurrentStep("review");
    } else if (currentStep === "review") {
      if (remainingAfterBLKD > 0 && !selectedPaymentMethodId) {
        Alert.alert("Required", "Please select a payment method");
        return;
      }
      handleProcessBooking();
    }
  };

  const handleBack = () => {
    if (currentStep === "review") {
      if (product.bookingRequired) {
        setCurrentStep("date-time");
      } else {
        setCurrentStep("details");
      }
    } else if (currentStep === "date-time") {
      setCurrentStep("details");
    }
  };

  const handleProcessBooking = async () => {
    setCurrentStep("processing");
    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate booking ID
    const newBookingId = `BK-${Date.now()}`;
    setBookingId(newBookingId);
    setIsProcessing(false);
    setCurrentStep("success");
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderDetailsStep = () => (
    <View style={{ gap: spacing.lg }}>
      {/* Service Info */}
      <View
        style={{
          backgroundColor: colors.secondary,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View style={{ flexDirection: "row", gap: spacing.md, marginBottom: spacing.md }}>
          {product.images && 
           product.images.length > 0 && 
           product.images[0] && 
           product.images[0].trim() !== "" ? (
            <Image
              source={{ uri: product.images[0] }}
              style={{ width: 80, height: 80, borderRadius: borderRadius.md }}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          ) : (
            <ProductPlaceholder width={80} height={80} aspectRatio={1} />
          )}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold as any,
                color: colors.text.primary,
                marginBottom: spacing.xs,
              }}
            >
              {product.name}
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
              }}
            >
              {getMerchantName(product.merchantId)}
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: typography.fontSize.base,
            color: colors.text.primary,
            marginBottom: spacing.md,
          }}
        >
          {product.description}
        </Text>

        {/* Service Details */}
        <View style={{ gap: spacing.sm }}>
          {product.duration && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <MaterialIcons name="schedule" size={20} color={colors.text.secondary} />
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                Duration: {product.duration}
              </Text>
            </View>
          )}
          {product.serviceLocation && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <MaterialIcons
                name={
                  product.serviceLocation === "remote"
                    ? "videocam"
                    : product.serviceLocation === "on-site"
                    ? "home"
                    : "store"
                }
                size={20}
                color={colors.text.secondary}
              />
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                Location: {product.serviceLocation.replace("-", " ")}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Special Requirements */}
      <View>
        <Text
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold as any,
            color: colors.text.primary,
            marginBottom: spacing.sm,
          }}
        >
          Special Requirements (Optional)
        </Text>
        <TextInput
          value={specialRequirements}
          onChangeText={setSpecialRequirements}
          placeholder="Any special requests or requirements..."
          placeholderTextColor={colors.text.placeholder}
          multiline
          numberOfLines={4}
          style={{
            backgroundColor: colors.secondary,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            borderWidth: 1,
            borderColor: colors.border,
            color: colors.text.primary,
            fontSize: typography.fontSize.base,
            minHeight: 100,
            textAlignVertical: "top",
          }}
        />
      </View>

      {/* Pricing Summary */}
      <View
        style={{
          backgroundColor: colors.secondary,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.bold as any,
            color: colors.text.primary,
            marginBottom: spacing.md,
          }}
        >
          Pricing Summary
        </Text>
        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
              Service Price
            </Text>
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
              {formatCurrency(product.price, product.currency as Currency)}
            </Text>
          </View>
          {serviceFee > 0 && (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                Service Fee
              </Text>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                {formatCurrency(serviceFee, product.currency as Currency)}
              </Text>
            </View>
          )}
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: colors.border,
              marginTop: spacing.sm,
              paddingTop: spacing.sm,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.bold as any,
                color: colors.text.primary,
              }}
            >
              Total
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.bold as any,
                color: colors.accent,
              }}
            >
              {formatCurrency(totalAmount, product.currency as Currency)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderDateTimeStep = () => (
    <View style={{ gap: spacing.lg }}>
      {/* Date Selection */}
      <View>
        <Text
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold as any,
            color: colors.text.primary,
            marginBottom: spacing.md,
          }}
        >
          Select Date
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing.sm, paddingHorizontal: spacing.xs }}
        >
          {availableDates.map((date, index) => {
            const isSelected = selectedDate?.getTime() === date.getTime();
            return (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedDate(date)}
                style={{
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.lg,
                  borderRadius: borderRadius.md,
                  backgroundColor: isSelected ? colors.accent : colors.secondary,
                  borderWidth: 1,
                  borderColor: isSelected ? colors.accent : colors.border,
                  minWidth: 120,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold as any,
                    color: isSelected ? colors.textColors.onAccent : colors.text.primary,
                  }}
                >
                  {formatDate(date)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Time Selection */}
      {selectedDate && (
        <View>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold as any,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Select Time
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: spacing.sm,
            }}
          >
            {timeSlots.map((time, index) => {
              const isSelected = selectedTime === time;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedTime(time)}
                  style={{
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.md,
                    borderRadius: borderRadius.md,
                    backgroundColor: isSelected ? colors.accent : colors.secondary,
                    borderWidth: 1,
                    borderColor: isSelected ? colors.accent : colors.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium as any,
                      color: isSelected ? colors.textColors.onAccent : colors.text.primary,
                    }}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );

  const renderReviewStep = () => (
    <View style={{ gap: spacing.lg }}>
      {/* Booking Summary */}
      <View
        style={{
          backgroundColor: colors.secondary,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.bold as any,
            color: colors.text.primary,
            marginBottom: spacing.md,
          }}
        >
          Booking Summary
        </Text>
        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
              Service
            </Text>
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
              {product.name}
            </Text>
          </View>
          {selectedDate && selectedTime && (
            <>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  Date
                </Text>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                  {formatDate(selectedDate)}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  Time
                </Text>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                  {selectedTime}
                </Text>
              </View>
            </>
          )}
          {specialRequirements && (
            <View>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                Special Requirements
              </Text>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                {specialRequirements}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Payment Method */}
      {remainingAfterBLKD > 0 && (
        <View>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold as any,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Payment Method
          </Text>
          <PaymentMethodSelector
            wallets={mockWallets}
            selectedWalletId={selectedPaymentMethodId}
            onSelectWallet={setSelectedPaymentMethodId}
            useBLKD={useBLKD}
            onToggleBLKD={setUseBLKD}
            blkdBalance={blkdBalance}
            totalAmount={totalAmount}
            currency={product.currency}
          />
        </View>
      )}

      {/* Final Pricing */}
      <View
        style={{
          backgroundColor: colors.secondary,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.bold as any,
            color: colors.text.primary,
            marginBottom: spacing.md,
          }}
        >
          Payment Summary
        </Text>
        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
              Service Price
            </Text>
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
              {formatCurrency(product.price, product.currency as Currency)}
            </Text>
          </View>
          {serviceFee > 0 && (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                Service Fee
              </Text>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                {formatCurrency(serviceFee, product.currency as Currency)}
              </Text>
            </View>
          )}
          {blkdCoverage > 0 && (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.textColors.success }}>
                BLKD Applied
              </Text>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.textColors.success }}>
                -{formatCurrency(blkdCoverage, "BLKD" as Currency)}
              </Text>
            </View>
          )}
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: colors.border,
              marginTop: spacing.sm,
              paddingTop: spacing.sm,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.bold as any,
                color: colors.text.primary,
              }}
            >
              Total
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.bold as any,
                color: colors.accent,
              }}
            >
              {formatCurrency(remainingAfterBLKD, product.currency as Currency)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderProcessingStep = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.lg }}>
      <MaterialIcons name="hourglass-empty" size={64} color={colors.accent} />
      <Text
        style={{
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.bold as any,
          color: colors.text.primary,
        }}
      >
        Processing Booking...
      </Text>
      <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
        Please wait while we confirm your booking
      </Text>
    </View>
  );

  const renderSuccessStep = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.lg, padding: spacing.lg }}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.status.success + "20",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MaterialIcons name="check-circle" size={48} color={colors.status.success} />
      </View>
      <Text
        style={{
          fontSize: typography.fontSize["2xl"],
          fontWeight: typography.fontWeight.bold as any,
          color: colors.text.primary,
          textAlign: "center",
        }}
      >
        Booking Confirmed!
      </Text>
      <Text
        style={{
          fontSize: typography.fontSize.base,
          color: colors.text.secondary,
          textAlign: "center",
        }}
      >
        Your booking has been confirmed. Booking ID: {bookingId}
      </Text>
      {selectedDate && selectedTime && (
        <View
          style={{
            backgroundColor: colors.secondary,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            width: "100%",
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold as any,
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}
          >
            Booking Details
          </Text>
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
            {formatDate(selectedDate)} at {selectedTime}
          </Text>
        </View>
      )}
      <TouchableOpacity
        onPress={() => router.push("/pages/my-bookings")}
        style={{
          backgroundColor: colors.accent,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xl,
          borderRadius: borderRadius.md,
          marginTop: spacing.md,
        }}
      >
        <Text
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.bold as any,
            color: colors.textColors.onAccent,
          }}
        >
          View My Bookings
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      <OptimizedScrollView
        showBackToTop={true}
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: spacing.lg,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        <BackButton />

        {currentStep === "details" && renderDetailsStep()}
        {currentStep === "date-time" && renderDateTimeStep()}
        {currentStep === "review" && renderReviewStep()}
        {currentStep === "processing" && renderProcessingStep()}
        {currentStep === "success" && renderSuccessStep()}

        {/* Navigation Buttons */}
        {currentStep !== "processing" && currentStep !== "success" && (
          <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.lg }}>
            {currentStep !== "details" && (
              <TouchableOpacity
                onPress={handleBack}
                style={{
                  flex: 1,
                  backgroundColor: colors.secondary,
                  paddingVertical: spacing.md + 2,
                  borderRadius: borderRadius.md,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold as any,
                    color: colors.text.primary,
                  }}
                >
                  Back
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleNext}
              disabled={
                (currentStep === "review" && remainingAfterBLKD > 0 && !selectedPaymentMethodId) ||
                (currentStep === "date-time" && (!selectedDate || !selectedTime))
              }
              style={{
                flex: 1,
                backgroundColor: colors.accent,
                paddingVertical: spacing.md + 2,
                borderRadius: borderRadius.md,
                alignItems: "center",
                opacity:
                  (currentStep === "review" && remainingAfterBLKD > 0 && !selectedPaymentMethodId) ||
                  (currentStep === "date-time" && (!selectedDate || !selectedTime))
                    ? 0.6
                    : 1,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold as any,
                  color: colors.textColors.onAccent,
                }}
              >
                {currentStep === "review" ? "Confirm Booking" : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </OptimizedScrollView>
    </View>
  );
}
