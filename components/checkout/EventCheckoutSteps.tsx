import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { Event, TicketOrder } from '../../types/events';
import { Wallet } from '../../types/wallet';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { BackButton } from "../navigation/BackButton";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { formatCurrency } from '../../lib/international';

type CheckoutStep = "review" | "payment" | "processing" | "success" | "error";

interface TicketDetail {
  ticketType: { id: string; name: string; price: number; currency: string } | undefined;
  quantity: number;
  subtotal: number;
}

interface EventCheckoutStepsProps {
  step: CheckoutStep;
  event: Event;
  ticketDetails: TicketDetail[];
  totalTickets: number;
  subtotal: number;
  serviceFee: number;
  finalTotal: number;
  wallets: Wallet[];
  selectedWalletId: string | null;
  useBLKD: boolean;
  blkdBalance: number;
  blkdCoverage: number;
  remainingAfterBLKD: number;
  order: TicketOrder | null;
  onBack: () => void;
  onProceedToPayment: () => void;
  onSelectWallet: (walletId: string) => void;
  onToggleBLKD: () => void;
  onProcessPayment: () => void;
  onViewTickets: () => void;
  onBackToEvent: () => void;
  onAddPaymentMethod: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export function EventCheckoutReviewStep({
  event,
  ticketDetails,
  totalTickets,
  subtotal,
  serviceFee,
  finalTotal,
  onProceedToPayment,
}: Pick<
  EventCheckoutStepsProps,
  "event" | "ticketDetails" | "totalTickets" | "subtotal" | "serviceFee" | "finalTotal" | "onProceedToPayment"
>) {
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        <Text
          style={{
            fontSize: typography.fontSize["2xl"],
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            marginTop: spacing.lg,
            marginBottom: spacing.xl,
          }}
        >
          Review Your Order
        </Text>

        {/* Event Summary */}
        <View
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <View
            style={{
              width: "100%",
              height: isMobile ? 200 : 300,
              borderRadius: borderRadius.md,
              overflow: "hidden",
              marginBottom: spacing.md,
              backgroundColor: "#474747",
            }}
          >
            <Image
              source={{ uri: event.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop" }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={200}
            />
          </View>

          <Text
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.xs,
            }}
          >
            {event.title}
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
              marginBottom: spacing.sm,
            }}
          >
            {formatDate(event.startDate)}
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
            }}
          >
            {event.venue.name} • {event.venue.city}, {event.venue.state}
          </Text>
        </View>

        {/* Ticket Details */}
        <View
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border.light,
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
            Ticket Details
          </Text>

          {ticketDetails.map((detail, index) => {
            if (!detail.ticketType) return null;
            return (
              <View
                key={detail.ticketType.id}
                style={{
                  marginBottom: index < ticketDetails.length - 1 ? spacing.md : 0,
                  paddingBottom: index < ticketDetails.length - 1 ? spacing.md : 0,
                  borderBottomWidth: index < ticketDetails.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border.light,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xs }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.text.primary,
                    }}
                  >
                    {detail.ticketType.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.text.primary,
                    }}
                  >
                    {formatCurrency(detail.subtotal, detail.ticketType.currency)}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    {detail.quantity} × {formatCurrency(detail.ticketType.price, detail.ticketType.currency)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Order Summary */}
        <View
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.xl,
            borderWidth: 1,
            borderColor: colors.border.light,
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
            Order Summary
          </Text>

          <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>
                Subtotal ({totalTickets} {totalTickets === 1 ? "ticket" : "tickets"})
              </Text>
              <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                {formatCurrency(subtotal, "USD")}
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>
                Service Fee
              </Text>
              <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                {formatCurrency(serviceFee, "USD")}
              </Text>
            </View>
          </View>

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: colors.border.light,
              paddingTop: spacing.md,
              marginTop: spacing.md,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                }}
              >
                Total
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.accent,
                }}
              >
                {formatCurrency(finalTotal, "USD")}
              </Text>
            </View>
          </View>
        </View>

        {/* Proceed Button */}
        <TouchableOpacity
          onPress={onProceedToPayment}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Proceed to Payment"
          accessibilityHint="Continue to payment step"
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{
            backgroundColor: colors.accent,
            borderRadius: borderRadius.md,
            padding: spacing.lg,
            alignItems: "center",
            marginBottom: spacing.lg,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
            }}
          >
            Proceed to Payment
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export function EventCheckoutPaymentStep({
  event,
  totalTickets,
  finalTotal,
  wallets,
  selectedWalletId,
  useBLKD,
  blkdBalance,
  blkdCoverage,
  remainingAfterBLKD,
  onBack,
  onSelectWallet,
  onToggleBLKD,
  onProcessPayment,
  onAddPaymentMethod,
}: Pick<
  EventCheckoutStepsProps,
  | "event"
  | "totalTickets"
  | "finalTotal"
  | "wallets"
  | "selectedWalletId"
  | "useBLKD"
  | "blkdBalance"
  | "blkdCoverage"
  | "remainingAfterBLKD"
  | "onBack"
  | "onSelectWallet"
  | "onToggleBLKD"
  | "onProcessPayment"
  | "onAddPaymentMethod"
>) {
  const { paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const availableWallets = wallets.filter(
    (w) => w.currency === "USD" && (w.availableBalance || w.balance) >= remainingAfterBLKD && w.isActive
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        <BackButton onPress={onBack} />

        <Text
          style={{
            fontSize: typography.fontSize["2xl"],
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            marginTop: spacing.lg,
            marginBottom: spacing.xl,
          }}
        >
          Payment
        </Text>

        {/* Order Summary */}
        <View
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}
          >
            {event.title}
          </Text>
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.md }}>
            {totalTickets} {totalTickets === 1 ? "ticket" : "tickets"}
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              Total
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                color: colors.accent,
              }}
            >
              {formatCurrency(finalTotal, "USD")}
            </Text>
          </View>
        </View>

        {/* BLKD Payment Option */}
        {blkdBalance > 0 && (
          <View
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              marginBottom: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
                  }}
                >
                  Use MyImpact Rewards (BLKD)
                </Text>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  Balance: {formatCurrency(blkdBalance, "BLKD")}
                  {blkdCoverage > 0 && ` • Covering ${formatCurrency(blkdCoverage, "USD")}`}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onToggleBLKD}
                accessible={true}
                accessibilityRole="switch"
                accessibilityLabel="Use MyImpact Rewards"
                accessibilityState={{ checked: useBLKD }}
                accessibilityHint={useBLKD ? "Disable MyImpact Rewards" : "Enable MyImpact Rewards"}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={{
                  width: 48,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: useBLKD ? colors.accent : colors.border.light,
                  alignItems: useBLKD ? "flex-end" : "flex-start",
                  justifyContent: "center",
                  padding: 2,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: colors.text.primary,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Payment Method Selector */}
        {remainingAfterBLKD > 0 && (
          <PaymentMethodSelector
            wallets={availableWallets}
            selectedWalletId={selectedWalletId}
            onSelectWallet={onSelectWallet}
            totalAmount={remainingAfterBLKD}
            currency="USD"
            blkdBalance={0}
            useBLKD={false}
            onToggleBLKD={() => {}}
            onAddPaymentMethod={onAddPaymentMethod}
          />
        )}

        {/* Process Payment Button */}
        <TouchableOpacity
          onPress={onProcessPayment}
          disabled={remainingAfterBLKD > 0 && !selectedWalletId && !useBLKD}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Complete Purchase"
          accessibilityState={{ 
            disabled: remainingAfterBLKD > 0 && !selectedWalletId && !useBLKD 
          }}
          accessibilityHint="Finalize and complete your purchase"
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{
            backgroundColor:
              remainingAfterBLKD > 0 && !selectedWalletId && !useBLKD ? colors.border.light : colors.accent,
            borderRadius: borderRadius.md,
            paddingVertical: spacing.md + 2,
            paddingHorizontal: paddingHorizontal,
            alignItems: "center",
            marginTop: spacing.lg,
            marginBottom: spacing.lg,
            opacity: remainingAfterBLKD > 0 && !selectedWalletId && !useBLKD ? 0.5 : 1,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.textColors.onAccent,
            }}
          >
            Complete Purchase
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export function EventCheckoutProcessingStep() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text
        style={{
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: colors.text.primary,
          marginTop: spacing.lg,
        }}
      >
        Processing your payment...
      </Text>
    </View>
  );
}

export function EventCheckoutErrorStep({
  errorMessage,
  onTryAgain,
  onGoBack,
}: {
  errorMessage?: string | null;
  onTryAgain: () => void;
  onGoBack: () => void;
}) {
  const { paddingHorizontal, scrollViewBottomPadding } = useResponsive();

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: scrollViewBottomPadding,
          alignItems: "center",
        }}
      >
        <View style={{ alignItems: "center", marginTop: spacing["2xl"], marginBottom: spacing.xl }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.status.errorLight,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: spacing.lg,
            }}
          >
            <MaterialIcons name="info-outline" size={48} color={colors.status.error} />
          </View>

          <Text
            style={{
              fontSize: typography.fontSize["2xl"],
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.sm,
              textAlign: "center",
            }}
          >
            Purchase Not Completed
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              textAlign: "center",
              marginBottom: spacing.xl,
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            {errorMessage || "We couldn't complete your ticket purchase right now. Please check your payment method and try again, or contact support if the issue persists."}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: spacing.md, width: "100%" }}>
          <TouchableOpacity
            onPress={onTryAgain}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Try Again"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              flex: 1,
              backgroundColor: colors.accent,
              paddingHorizontal: paddingHorizontal,
              paddingVertical: spacing.md + 2,
              borderRadius: borderRadius.md,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.textColors.onAccent,
              }}
            >
              Try Again
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onGoBack}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Go Back"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              flex: 1,
              backgroundColor: colors.secondary.bg,
              paddingHorizontal: paddingHorizontal,
              paddingVertical: spacing.md + 2,
              borderRadius: borderRadius.md,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
              }}
            >
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export function EventCheckoutSuccessStep({
  order,
  onViewTickets,
  onBackToEvent,
}: Pick<EventCheckoutStepsProps, "order" | "onViewTickets" | "onBackToEvent">) {
  const { paddingHorizontal, scrollViewBottomPadding } = useResponsive();

  if (!order) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: scrollViewBottomPadding,
          alignItems: "center",
        }}
      >
        <View style={{ alignItems: "center", marginTop: spacing["2xl"], marginBottom: spacing.xl }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.status.success,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: spacing.lg,
            }}
          >
            <MaterialIcons name="check" size={48} color={colors.text.primary} />
          </View>

          <Text
            style={{
              fontSize: typography.fontSize["2xl"],
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.sm,
              textAlign: "center",
            }}
          >
            Purchase Successful!
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              textAlign: "center",
              marginBottom: spacing.xl,
            }}
          >
            Your tickets have been confirmed. Check your email for details.
          </Text>
        </View>

        {/* Order Details */}
        <View
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border.light,
            width: "100%",
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
            Order Confirmation
          </Text>

          <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Order ID</Text>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>{order.id}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Event</Text>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>{order.eventTitle}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Tickets</Text>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                {order.tickets.length}
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Total</Text>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                {formatCurrency(order.totalAmount, order.currency)}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ width: "100%", gap: spacing.md }}>
          <TouchableOpacity
            onPress={onViewTickets}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="View My Tickets"
            accessibilityHint="View your purchased event tickets"
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{
              backgroundColor: colors.accent,
              borderRadius: borderRadius.md,
              padding: spacing.lg,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              View My Tickets
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onBackToEvent}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Back to Event"
            accessibilityHint="Return to event details page"
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.md,
              padding: spacing.lg,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
              }}
            >
              Back to Event
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

