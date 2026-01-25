import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Wallet as WalletType, Currency, BankAccountWallet, CreditCardWallet } from '@/types/wallet';
import { BusinessPlaceholder } from '@/components/BusinessPlaceholder';
import { calculateConsumerTotalWithFee, checkBDNPlusSubscription } from '@/lib/fees';
import { formatCurrency } from '@/lib/international';
import { Invoice } from '@/types/invoices';
import { getAllMockBusinesses } from '@/data/mocks/businesses';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { HeroSection } from '@/components/layouts/HeroSection';
import { BackButton } from '@/components/navigation/BackButton';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';
import { FeeBreakdown } from '@/components/FeeBreakdown';

// Extended wallet type for mock data with additional properties
type MockWallet = WalletType & {
  type?: string;
  name?: string;
  isActive?: boolean;
  isDefault?: boolean;
  availableBalance?: number;
  [key: string]: any;
};

// Mock wallets
const mockWallets: MockWallet[] = [
  {
    id: "1",
    userId: "user-1",
    provider: "bdn",
    type: "primary",
    name: "Primary Wallet",
    currency: "USD",
    balance: 1250.75,
    isActive: true,
    isDefault: true,
  },
  {
    id: "2",
    userId: "user-1",
    provider: "bdn",
    type: "myimpact",
    name: "MyImpact Rewards",
    currency: "BLKD",
    balance: 3420,
    isActive: true,
  },
  {
    id: "4",
    userId: "user-1",
    provider: "bdn",
    type: "bankaccount",
    name: "Chase Checking",
    currency: "USD",
    balance: 5432.18,
    availableBalance: 5432.18,
    isActive: true,
    bankName: "Chase",
    accountType: "checking" as const,
    last4: "4321",
  } as MockWallet,
];

// Mock invoices - in production, fetch from API
// These should match the invoices in app/pages/invoices/user.tsx and app/pages/invoices/[id].tsx
const mockInvoices: Record<string, Invoice> = {
  "inv-1": {
    id: "inv-1",
    invoiceNumber: "INV-2024-001",
    issuerId: "1", // Matches business ID in mock businesses
    issuerType: "business",
    issuerName: "Soul Food Kitchen",
    recipientId: "user-1",
    recipientName: "John Doe",
    recipientEmail: "john@example.com",
    billingType: "one-time",
    status: "sent",
    currency: "USD",
    subtotal: 150.00,
    tax: 12.00,
    discount: 0,
    total: 162.00,
    amountPaid: 0,
    amountDue: 162.00,
    lineItems: [
      {
        id: "1",
        description: "Catering Services for Corporate Event",
        quantity: 1,
        unitPrice: 150.00,
        tax: 12.00,
        total: 162.00,
      },
    ],
    issueDate: "2024-02-01T00:00:00Z",
    dueDate: "2024-03-02T00:00:00Z",
    paymentTerms: "Net 30",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  "inv-2": {
    id: "inv-2",
    invoiceNumber: "INV-2024-002",
    issuerId: "2", // Matches nonprofit ID if exists, or use business ID
    issuerType: "nonprofit",
    issuerName: "Community Foundation",
    recipientId: "user-1",
    recipientName: "John Doe",
    recipientEmail: "john@example.com",
    billingType: "recurring",
    status: "sent",
    currency: "USD",
    subtotal: 50.00,
    tax: 0,
    discount: 0,
    total: 50.00,
    amountPaid: 0,
    amountDue: 50.00,
    lineItems: [
      {
        id: "1",
        description: "Monthly Donation",
        quantity: 1,
        unitPrice: 50.00,
        total: 50.00,
      },
    ],
    recurringSettings: {
      frequency: "monthly",
      startDate: "2024-01-01T00:00:00Z",
      nextBillingDate: "2024-03-01T00:00:00Z",
      currentCycle: 2,
    },
    issueDate: "2024-02-01T00:00:00Z",
    dueDate: "2024-02-15T00:00:00Z",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  "inv-3": {
    id: "inv-3",
    invoiceNumber: "INV-2024-003",
    issuerId: "2", // Matches business ID in mock businesses
    issuerType: "business",
    issuerName: "Black Business Network Services",
    recipientId: "user-1",
    recipientName: "John Doe",
    recipientEmail: "john@example.com",
    billingType: "one-time",
    status: "overdue",
    currency: "USD",
    subtotal: 75.00,
    tax: 6.00,
    discount: 0,
    total: 81.00,
    amountPaid: 0,
    amountDue: 81.00,
    lineItems: [
      {
        id: "1",
        description: "Consultation Services",
        quantity: 2,
        unitPrice: 37.50,
        tax: 6.00,
        total: 81.00,
      },
    ],
    issueDate: "2024-01-15T00:00:00Z",
    dueDate: "2024-02-14T00:00:00Z",
    paymentTerms: "Net 30",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
};

type PaymentStep = "payment-method" | "review" | "processing" | "success" | "error";

export default function InvoicePayment() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const params = useLocalSearchParams<{ invoiceId?: string }>();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const [step, setStep] = useState<PaymentStep>("payment-method");
  const [selectedWallet, setSelectedWallet] = useState<MockWallet | null>(null);
  const [useBLKD, setUseBLKD] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load invoice data - handle both invoiceId from query params
  // Note: useLocalSearchParams may return array for query params, so handle both cases
  const invoiceId = Array.isArray(params.invoiceId) ? params.invoiceId[0] : params.invoiceId;
  const invoice = invoiceId ? mockInvoices[invoiceId] : null;
  
  // Load business data from issuerId
  const allBusinesses = getAllMockBusinesses();
  const business = invoice ? allBusinesses.find(b => b.id === invoice.issuerId) : null;

  // If invoice not found, show error with helpful message
  if (!invoice) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style="light" />
        <OptimizedScrollView
          contentContainerStyle={{
            paddingHorizontal,
            paddingTop: spacing.xl,
            paddingBottom: scrollViewBottomPadding,
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100%",
          }}
        >
          <MaterialIcons name="error-outline" size={64} color={colors.status.error} />
          <Text
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm,
            }}
          >
            Invoice Not Found
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              textAlign: "center",
              marginBottom: spacing.sm,
            }}
          >
            The invoice you're trying to pay could not be found.
          </Text>
          {invoiceId && (
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.tertiary,
                textAlign: "center",
                marginBottom: spacing.xl,
              }}
            >
              Invoice ID: {invoiceId}
            </Text>
          )}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: colors.accent,
              borderRadius: borderRadius.md,
              paddingVertical: spacing.md + 2,
              paddingHorizontal: paddingHorizontal,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.textColors.onAccent,
              }}
            >
              Go Back
            </Text>
          </TouchableOpacity>
        </OptimizedScrollView>
      </View>
    );
  }

  // Invoice amount (amountDue)
  const numericAmount = invoice.amountDue;
  const currency = invoice.currency as Currency;

  // Check if user has BDN+ subscription (TODO: Replace with actual check)
  const hasBDNPlus = checkBDNPlusSubscription("current-user-id");
  
  // Calculate BDN service fee
  const feeCalculation = calculateConsumerTotalWithFee(numericAmount, currency, hasBDNPlus);
  const serviceFee = feeCalculation.serviceFee;
  const totalAmount = feeCalculation.total;
  
  // Get BLKD wallet separately
  const blkdWallet = mockWallets.find((w) => (w as MockWallet).type === "myimpact" && w.currency === "BLKD");
  const blkdBalance = blkdWallet ? (blkdWallet.availableBalance || blkdWallet.balance) : 0;
  
  // Calculate BLKD coverage and remaining amount
  const blkdCoverage = useBLKD && blkdBalance > 0 ? Math.min(blkdBalance, totalAmount) : 0;
  const remainingAfterBLKD = totalAmount - blkdCoverage;
  
  // Filter wallets that match the payment currency and have sufficient balance for remaining amount
  const availableWallets = mockWallets.filter(
    (w) => w.type !== "myimpact" && w.currency === currency && (w.availableBalance || w.balance) >= remainingAfterBLKD
  );

  const handleProceed = () => {
    if (step === "payment-method") {
      if (remainingAfterBLKD > 0 && !selectedWallet && !useBLKD) {
        Alert.alert("Payment Method Required", "Please select a payment method.");
        return;
      }
      setStep("review");
    } else if (step === "review") {
      handleProcessPayment();
    }
  };

  const handleProcessPayment = () => {
    setStep("processing");
    setErrorMessage(null);
    
    // TODO: Process payment via API
    // This should:
    // 1. Deduct totalAmount (including service fee) from user's wallet
    // 2. Add numericAmount to business/nonprofit account
    // 3. Calculate and deduct platform fee from business (10% or 5% with BDN+ Business)
    // 4. Create transaction records with fee breakdown
    // 5. Update invoice status to "paid"
    
    setTimeout(() => {
      try {
        // Simulate potential errors (for testing - remove in production)
        const shouldFail = false; // Set to true to test error handling
        
        if (shouldFail) {
          throw new Error("Payment processing failed");
        }

        const newTransactionId = `TXN-${Date.now()}`;
        setTransactionId(newTransactionId);
        setStep("success");
      } catch (error) {
        setErrorMessage(
          "We couldn't complete your payment right now. Please check your payment method and try again, or contact support if the issue persists."
        );
        setStep("error");
      }
    }, 2000);
  };

  const handleComplete = () => {
    router.push("/pages/transactions");
  };

  const renderPaymentMethodStep = () => (
    <View style={{ gap: spacing.xl }}>
      {/* Invoice Summary Card */}
      <View
        style={{
          backgroundColor: colors.input,
          borderRadius: borderRadius.lg,
          padding: spacing.xl,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.md }}>
          {business && <BusinessPlaceholder width={40} height={40} aspectRatio={1} />}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginBottom: spacing.xs / 2,
              }}
            >
              {invoice.invoiceNumber}
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
              }}
            >
              {invoice.issuerName}
            </Text>
          </View>
        </View>

        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Invoice Amount</Text>
            <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
              {formatCurrency(invoice.amountDue, invoice.currency)}
            </Text>
          </View>

          {/* Service Fee */}
          <FeeBreakdown
            amount={numericAmount}
            fee={serviceFee}
            currency={currency}
            feeType="service"
            hasBDNPlus={hasBDNPlus}
            showTotal={false}
            showTooltip={true}
          />

          <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.sm }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>Total</Text>
            <Text style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.accent }}>
              {formatCurrency(totalAmount, currency)}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ gap: spacing.md }}>
        {/* BLKD Toggle Option */}
        {blkdWallet && blkdBalance > 0 && (
          <View
            style={{
              backgroundColor: colors.input,
              borderRadius: borderRadius.lg,
              padding: spacing.md,
              borderWidth: 2,
              borderColor: useBLKD ? colors.accent : colors.border,
            }}
          >
            <TouchableOpacity
              onPress={() => setUseBLKD(!useBLKD)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: useBLKD ? colors.accent : colors.border,
                  backgroundColor: useBLKD ? colors.accent : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {useBLKD && <MaterialIcons name="check" size={16} color={colors.textColors.onAccent} />}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs, marginBottom: spacing.xs / 2 }}>
                  <MaterialIcons name="stars" size={20} color={colors.accent} />
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.text.primary,
                    }}
                  >
                    Apply BLKD
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.text.secondary,
                  }}
                >
                  Available: {blkdBalance.toFixed(2)} BLKD
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Wallet Options - Only show if there's remaining amount after BLKD */}
        {remainingAfterBLKD > 0 && (
          <>
            {availableWallets.map((wallet) => {
              const balance = (wallet as MockWallet).availableBalance || wallet.balance;
              const isSelected = selectedWallet?.id === wallet.id;
              return (
                <TouchableOpacity
                  key={wallet.id}
                  onPress={() => setSelectedWallet(wallet)}
                  style={{
                    backgroundColor: isSelected ? colors.accent : colors.input,
                    borderRadius: borderRadius.lg,
                    padding: spacing.lg,
                    borderWidth: 2,
                    borderColor: isSelected ? colors.accent : colors.border,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.md,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: isSelected ? "rgba(255, 255, 255, 0.2)" : colors.accent + "20",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons
                      name={
                        (wallet as MockWallet).type === "creditcard"
                          ? "credit-card"
                          : (wallet as MockWallet).type === "bankaccount"
                          ? "account-balance"
                          : (wallet as MockWallet).type === "myimpact"
                          ? "stars"
                          : "account-balance-wallet"
                      }
                      size={24}
                      color={isSelected ? colors.textColors.onAccent : colors.accent}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: typography.fontWeight.bold,
                        color: isSelected ? colors.textColors.onAccent : colors.text.primary,
                        marginBottom: spacing.xs / 2,
                      }}
                    >
                      {(wallet as MockWallet).name}
                    </Text>
                    {(wallet as MockWallet).type === "creditcard" && (
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: isSelected ? colors.textColors.onAccent + "CC" : colors.text.secondary,
                        }}
                      >
                        •••• {(wallet as CreditCardWallet).last4}
                      </Text>
                    )}
                    {(wallet as MockWallet).type === "bankaccount" && (
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: isSelected ? colors.textColors.onAccent + "CC" : colors.text.secondary,
                        }}
                      >
                        •••• {(wallet as MockWallet).last4}
                      </Text>
                    )}
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: typography.fontWeight.semibold,
                        color: isSelected ? colors.textColors.onAccent : colors.accent,
                      }}
                    >
                      {formatCurrency(balance, currency)}
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: isSelected ? colors.textColors.onAccent + "CC" : colors.text.secondary,
                      }}
                    >
                      Available
                    </Text>
                  </View>
                  {isSelected && (
                    <MaterialIcons name="check-circle" size={24} color={colors.textColors.onAccent} />
                  )}
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </View>
    </View>
  );

  const renderReviewStep = () => {
    const balance = selectedWallet ? ((selectedWallet as MockWallet).availableBalance || selectedWallet.balance) : 0;
    return (
      <View style={{ gap: spacing.xl }}>
        {/* Invoice Info */}
        <View
          style={{
            backgroundColor: colors.input,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            borderWidth: 1,
            borderColor: colors.border,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          {business && <BusinessPlaceholder width={40} height={40} aspectRatio={1} />}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginBottom: spacing.xs / 2,
              }}
            >
              {invoice.invoiceNumber}
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.xs,
                color: colors.text.secondary,
              }}
            >
              {invoice.issuerName}
            </Text>
          </View>
        </View>

        {/* Payment Summary */}
        <View
          style={{
            backgroundColor: colors.input,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: colors.border,
            gap: spacing.md,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: typography.fontSize.base,
                color: colors.text.secondary,
                marginBottom: spacing.sm,
              }}
            >
              Invoice Amount
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize["2xl"],
                fontWeight: typography.fontWeight.bold,
                color: colors.accent,
              }}
            >
              {formatCurrency(totalAmount, currency)}
            </Text>
          </View>

          {useBLKD && blkdCoverage > 0 && (
            <>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>BLKD Applied</Text>
                <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.accent }}>
                  -{formatCurrency(blkdCoverage, "BLKD")}
                </Text>
              </View>
              <View style={{ height: 1, backgroundColor: colors.border }} />
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>Amount to Pay</Text>
                <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.accent }}>
                  {formatCurrency(remainingAfterBLKD, currency)}
                </Text>
              </View>
            </>
          )}

          <View style={{ height: 1, backgroundColor: colors.border }} />
          <View style={{ gap: spacing.sm }}>
            <FeeBreakdown
              amount={numericAmount}
              fee={serviceFee}
              currency={currency}
              feeType="service"
              hasBDNPlus={hasBDNPlus}
              showTotal={false}
              showTooltip={true}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Payment Method</Text>
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
                {useBLKD && blkdCoverage > 0 ? "BLKD" : ""}
                {useBLKD && blkdCoverage > 0 && remainingAfterBLKD > 0 ? " + " : ""}
                {remainingAfterBLKD > 0 ? selectedWallet?.name : ""}
              </Text>
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: colors.border }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>Total</Text>
            <Text style={{ fontSize: typography.fontSize["2xl"], fontWeight: typography.fontWeight.bold, color: colors.accent }}>
              {formatCurrency(remainingAfterBLKD > 0 ? remainingAfterBLKD : totalAmount, currency)}
            </Text>
          </View>

          {remainingAfterBLKD > 0 && selectedWallet && (
            <View
              style={{
                backgroundColor: colors.background,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                marginTop: spacing.sm,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.sm }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Current Balance</Text>
                <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
                  {formatCurrency(balance, currency)}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>After Payment</Text>
                <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.status.success }}>
                  {formatCurrency(balance - remainingAfterBLKD, currency)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderProcessingStep = () => (
    <View style={{ alignItems: "center", paddingVertical: spacing["4xl"], gap: spacing.xl }}>
      <MaterialIcons name="hourglass-empty" size={64} color={colors.accent} />
      <Text
        style={{
          fontSize: typography.fontSize.xl,
          fontWeight: typography.fontWeight.bold,
          color: colors.text.primary,
        }}
      >
        Processing Payment...
      </Text>
      <Text
        style={{
          fontSize: typography.fontSize.base,
          color: colors.text.secondary,
          textAlign: "center",
        }}
      >
        Please wait while we process your payment for {invoice.invoiceNumber}.
      </Text>
    </View>
  );

  const renderErrorStep = () => (
    <View style={{ alignItems: "center", paddingVertical: spacing["4xl"], paddingHorizontal: paddingHorizontal, gap: spacing.xl }}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.status.errorLight,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialIcons name="info-outline" size={48} color={colors.status.error} />
      </View>
      <View style={{ alignItems: "center", gap: spacing.sm }}>
        <Text
          style={{
            fontSize: typography.fontSize["2xl"],
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
          }}
        >
          Payment Not Completed
        </Text>
        <Text
          style={{
            fontSize: typography.fontSize.base,
            color: colors.text.secondary,
            textAlign: "center",
            lineHeight: typography.lineHeight.relaxed,
          }}
        >
          {errorMessage || "We couldn't complete your payment right now. Please check your payment method and try again, or contact support if the issue persists."}
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: spacing.md, width: "100%", marginTop: spacing.sm }}>
        <TouchableOpacity
          onPress={() => {
            setStep("payment-method");
            setErrorMessage(null);
          }}
          style={{
            flex: 1,
            backgroundColor: colors.accent,
            borderRadius: borderRadius.md,
            paddingVertical: spacing.md + 2,
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
          onPress={() => router.back()}
          style={{
            flex: 1,
            backgroundColor: colors.input,
            borderRadius: borderRadius.md,
            paddingVertical: spacing.md + 2,
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.border,
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
    </View>
  );

  const renderSuccessStep = () => (
    <View style={{ alignItems: "center", paddingVertical: spacing["4xl"], paddingHorizontal: paddingHorizontal, gap: spacing.xl }}>
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
      <View style={{ alignItems: "center", gap: spacing.sm }}>
        <Text
          style={{
            fontSize: typography.fontSize["2xl"],
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
          }}
        >
          Payment Successful!
        </Text>
        <Text
          style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.semibold,
            color: colors.accent,
          }}
        >
          {formatCurrency(numericAmount, currency)} paid for {invoice.invoiceNumber}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: colors.input,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: colors.border,
          width: "100%",
          gap: spacing.sm,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Invoice</Text>
          <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>{invoice.invoiceNumber}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Transaction ID</Text>
          <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>{transactionId}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Amount</Text>
          <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
            {formatCurrency(numericAmount, currency)}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Recipient</Text>
          <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>{invoice.issuerName}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleComplete}
        style={{
          backgroundColor: colors.accent,
          borderRadius: borderRadius.md,
          paddingVertical: spacing.md + 2,
          paddingHorizontal: paddingHorizontal,
          width: "100%",
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
          Done
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
        {/* Back Button */}
        <BackButton label="Back" />

        {/* Hero Section */}
        <HeroSection
          title="Pay Invoice"
          subtitle={`${invoice.invoiceNumber} • ${formatCurrency(invoice.amountDue, invoice.currency)}`}
        />

        {/* Progress Steps */}
        {step !== "processing" && step !== "success" && step !== "error" && (
          <View style={{ marginBottom: spacing.xl }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.md }}>
              {[
                { step: "payment-method", label: "Payment" },
                { step: "review", label: "Review" },
              ].map((s, index) => {
                const stepIndex = ["payment-method", "review"].indexOf(step);
                const isActive = index <= stepIndex;
                const isCurrent = index === stepIndex;
                return (
                  <View key={s.step} style={{ flex: 1, alignItems: "center" }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: isActive ? colors.accent : colors.accent + "20",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: spacing.sm,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.bold,
                          color: isActive ? colors.textColors.onAccent : colors.text.secondary,
                        }}
                      >
                        {index + 1}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: isCurrent ? colors.accent : colors.text.secondary,
                      }}
                    >
                      {s.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Step Content */}
        {step === "payment-method" && renderPaymentMethodStep()}
        {step === "review" && renderReviewStep()}
        {step === "processing" && renderProcessingStep()}
        {step === "success" && renderSuccessStep()}
        {step === "error" && renderErrorStep()}

        {/* Navigation Buttons */}
        {step !== "processing" && step !== "success" && step !== "error" && (
          <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.xl }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                flex: 1,
                paddingVertical: spacing.md + 2,
                borderRadius: borderRadius.md,
                backgroundColor: colors.input,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.primary,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleProceed}
              disabled={
                step === "payment-method" && remainingAfterBLKD > 0 && !selectedWallet && !useBLKD
              }
              style={{
                flex: 1,
                paddingVertical: spacing.md + 2,
                paddingHorizontal: paddingHorizontal,
                borderRadius: borderRadius.md,
                backgroundColor:
                  step === "payment-method" && remainingAfterBLKD > 0 && !selectedWallet && !useBLKD
                    ? colors.input
                    : colors.accent,
                alignItems: "center",
                opacity: step === "payment-method" && remainingAfterBLKD > 0 && !selectedWallet && !useBLKD ? 0.5 : 1,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.textColors.onAccent,
                }}
              >
                {step === "review" ? "Confirm Payment" : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </OptimizedScrollView>
    </View>
  );
}
