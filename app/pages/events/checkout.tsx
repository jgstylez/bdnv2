import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, Alert, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Event, TicketType, TicketOrder, Ticket, TicketStatus } from '@/types/events';
import { Currency } from '@/types/international';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { Wallet } from '@/types/wallet';

// Extended wallet type for mock data with additional properties
type MockWallet = Wallet & {
  type?: string;
  name?: string;
  isActive?: boolean;
  isDefault?: boolean;
  availableBalance?: number;
  [key: string]: any;
};
import { calculateConsumerTotalWithFee, checkBDNPlusSubscription } from '@/lib/fees';
import { getMockEvent } from '@/data/mocks/events';
import { mockWallets } from '@/data/mocks/wallets';
import { BackButton } from '@/components/navigation/BackButton';
import {
  EventCheckoutReviewStep,
  EventCheckoutPaymentStep,
  EventCheckoutProcessingStep,
  EventCheckoutSuccessStep,
  EventCheckoutErrorStep,
} from '@/components/checkout/EventCheckoutSteps';

type CheckoutStep = "review" | "payment" | "processing" | "success" | "error";

export default function EventCheckout() {
  const router = useRouter();
  const params = useLocalSearchParams<{ eventId?: string; tickets?: string }>();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const [step, setStep] = useState<CheckoutStep>("review");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [useBLKD, setUseBLKD] = useState(false);
  const [wallets, setWallets] = useState<MockWallet[]>([]);
  const [order, setOrder] = useState<TicketOrder | null>(null);

  const eventId = params.eventId || "1";
  const event = getMockEvent(eventId);
  const selectedTickets: Record<string, number> = params.tickets ? JSON.parse(params.tickets) : {};

  // Early return if event not found
  if (!event) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
        <StatusBar style="light" />
        <Text style={{ color: colors.text.primary, fontSize: 16 }}>Event not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginTop: 16,
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: colors.accent,
            borderRadius: borderRadius.md,
          }}
        >
          <Text style={{ color: colors.text.primary, fontWeight: "600" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate ticket details
  const ticketDetails = Object.entries(selectedTickets).map(([ticketTypeId, quantity]) => {
    const ticketType = event.ticketTypes.find((tt) => tt.id === ticketTypeId);
    return {
      ticketType,
      quantity,
      subtotal: ticketType ? ticketType.price * quantity : 0,
    };
  });

  const subtotal = ticketDetails.reduce((sum, detail) => sum + detail.subtotal, 0);
  const totalTickets = Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);

  // Calculate fees
  const hasBDNPlus = checkBDNPlusSubscription("current-user-id");
  const feeCalculation = calculateConsumerTotalWithFee(subtotal, "USD", hasBDNPlus);
  const serviceFee = feeCalculation.serviceFee;
  const finalTotal = feeCalculation.total;

  // Load wallets
  useEffect(() => {
    setWallets(mockWallets as MockWallet[]);

    // Pre-select default wallet
    const defaultWallet = (mockWallets as MockWallet[]).find((w) => w.isDefault && w.currency === "USD");
    if (defaultWallet) {
      setSelectedWalletId(defaultWallet.id);
    }
  }, []);

  const blkdWallet = wallets.find((w) => (w as MockWallet).type === "myimpact" && w.currency === "BLKD");
  const blkdBalance = blkdWallet?.balance || 0;
  const blkdCoverage = useBLKD ? Math.min(blkdBalance, finalTotal) : 0;
  const remainingAfterBLKD = finalTotal - blkdCoverage;

  const handleProceedToPayment = () => {
    if (totalTickets === 0) {
      Alert.alert("No Tickets Selected", "Please select at least one ticket.");
      return;
    }
    setStep("payment");
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setStep("processing");
    setErrorMessage(null);

    // Simulate payment processing
    setTimeout(async () => {
      try {
        // TODO: Process payment via API
        // - Create ticket order
        // - Generate tickets with QR codes
        // - Process payment
        // - Update event attendee count
        // - Send confirmation emails

        // Simulate potential errors (for testing - remove in production)
        const shouldFail = false; // Set to true to test error handling
        
        if (shouldFail) {
          throw new Error("Payment processing failed");
        }

        // Mock order creation
        const mockOrder: TicketOrder = {
          id: `order-${Date.now()}`,
          userId: "current-user-id",
          eventId: event.id,
          eventTitle: event.title,
          tickets: ticketDetails.flatMap((detail) => {
            const tickets: Ticket[] = [];
            for (let i = 0; i < detail.quantity; i++) {
              tickets.push({
                id: `ticket-${Date.now()}-${i}`,
                eventId: event.id,
                eventTitle: event.title,
                ticketTypeId: detail.ticketType!.id,
                ticketTypeName: detail.ticketType!.name,
                userId: "current-user-id",
                userName: "John Doe",
                userEmail: "john.doe@example.com",
                purchasePrice: detail.ticketType!.price,
                currency: detail.ticketType!.currency as Currency,
                status: "purchased" as TicketStatus,
                qrCode: `BDN-TICKET-${event.id}-${Date.now()}-${i}`,
                purchaseDate: new Date().toISOString(),
                orderId: `order-${Date.now()}`,
              });
            }
            return tickets;
          }),
          totalAmount: finalTotal,
          currency: "USD",
          paymentStatus: "completed",
          paymentMethod: selectedWalletId || "blkd",
          transactionId: `txn-${Date.now()}`,
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
        };

        setOrder(mockOrder);
        setStep("success");
      } catch (error) {
        setErrorMessage(
          "We couldn't complete your ticket purchase right now. Please check your payment method and try again, or contact support if the issue persists."
        );
        setStep("error");
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  const handleViewTickets = () => {
    router.push("/pages/events/tickets");
  };

  const handleBackToEvent = () => {
    router.push(`/pages/events/${eventId}`);
  };

  // Review Step
  if (step === "review") {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style="light" />
        <BackButton onPress={() => router.back()} />
        <EventCheckoutReviewStep
          event={event}
          ticketDetails={ticketDetails}
          totalTickets={totalTickets}
          subtotal={subtotal}
          serviceFee={serviceFee}
          finalTotal={finalTotal}
          onProceedToPayment={handleProceedToPayment}
        />
      </View>
    );
  }

  // Payment Step
  if (step === "payment") {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style="light" />
        <EventCheckoutPaymentStep
          event={event}
          totalTickets={totalTickets}
          finalTotal={finalTotal}
          wallets={wallets}
          selectedWalletId={selectedWalletId}
          useBLKD={useBLKD}
          blkdBalance={blkdBalance}
          blkdCoverage={blkdCoverage}
          remainingAfterBLKD={remainingAfterBLKD}
          onBack={() => setStep("review")}
          onSelectWallet={setSelectedWalletId}
          onToggleBLKD={() => setUseBLKD(!useBLKD)}
          onProcessPayment={handleProcessPayment}
          onAddPaymentMethod={() => router.push("/(tabs)/pay")}
        />
      </View>
    );
  }

  // Error Step
  if (step === "error") {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style="light" />
        <EventCheckoutErrorStep
          errorMessage={errorMessage}
          onTryAgain={() => {
            setStep("payment");
            setErrorMessage(null);
          }}
          onGoBack={() => router.back()}
        />
      </View>
    );
  }

  // Processing Step
  if (step === "processing") {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style="light" />
        <EventCheckoutProcessingStep />
      </View>
    );
  }

  // Success Step
  if (step === "success" && order) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style="light" />
        <EventCheckoutSuccessStep order={order} onViewTickets={handleViewTickets} onBackToEvent={handleBackToEvent} />
      </View>
    );
  }

  return null;
}
