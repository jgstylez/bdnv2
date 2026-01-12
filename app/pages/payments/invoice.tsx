import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
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
      <View style={{ flex: 1, backgroundColor: "#232323", justifyContent: "center", alignItems: "center", padding: 20 }}>
        <StatusBar style="light" />
        <MaterialIcons name="error-outline" size={64} color="#f44336" />
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#ffffff", marginTop: 24, marginBottom: 8 }}>
          Invoice Not Found
        </Text>
        <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", textAlign: "center", marginBottom: 8 }}>
          The invoice you're trying to pay could not be found.
        </Text>
        {invoiceId && (
          <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.5)", textAlign: "center", marginBottom: 24 }}>
            Invoice ID: {invoiceId}
          </Text>
        )}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: "#ba9988",
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 32,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>
            Go Back
          </Text>
        </TouchableOpacity>
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
        alert("Please select a payment method");
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
    <View style={{ gap: 24 }}>
      <View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#ffffff",
            marginBottom: 8,
          }}
        >
          Pay Invoice
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          Select a payment method to pay {formatCurrency(invoice.amountDue, invoice.currency)} to {invoice.issuerName}
        </Text>
      </View>

      {/* Invoice Summary Card */}
      <View
        style={{
          backgroundColor: "#474747",
          borderRadius: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: "rgba(186, 153, 136, 0.2)",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
          {business && <BusinessPlaceholder width={40} height={40} aspectRatio={1} />}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 2,
              }}
            >
              {invoice.invoiceNumber}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              {invoice.issuerName}
            </Text>
          </View>
        </View>
        
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Invoice Amount</Text>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>
              {formatCurrency(invoice.amountDue, invoice.currency)}
            </Text>
          </View>
          
          {/* Service Fee */}
          {serviceFee > 0 ? (
            <>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Service Fee (10%)</Text>
                  {hasBDNPlus && (
                    <View
                      style={{
                        backgroundColor: "rgba(186, 153, 136, 0.2)",
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                      }}
                    >
                      <Text style={{ fontSize: 10, color: "#ba9988", fontWeight: "600" }}>BDN+</Text>
                    </View>
                  )}
                </View>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "rgba(255, 255, 255, 0.7)" }}>
                  {formatCurrency(serviceFee, currency)}
                </Text>
              </View>
              {hasBDNPlus && (
                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, color: "#ba9988", fontStyle: "italic" }}>
                    ✓ Service fee waived with BDN+
                  </Text>
                </View>
              )}
            </>
          ) : hasBDNPlus ? (
            <View style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Service Fee</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ba9988", textDecorationLine: "line-through" }}>
                    {formatCurrency(numericAmount * 0.10, currency)}
                  </Text>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ba9988" }}>
                    {formatCurrency(0, currency)}
                  </Text>
                </View>
              </View>
              <Text style={{ fontSize: 12, color: "#ba9988", fontStyle: "italic" }}>
                ✓ Service fee waived with BDN+
              </Text>
            </View>
          ) : null}
          
          <View style={{ height: 1, backgroundColor: "rgba(186, 153, 136, 0.2)", marginTop: 8, marginBottom: 8 }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff" }}>Total</Text>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#ba9988" }}>
              {formatCurrency(totalAmount, currency)}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ gap: 12 }}>
        {/* BLKD Toggle Option */}
        {blkdWallet && blkdBalance > 0 && (
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: useBLKD ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
            }}
          >
            <TouchableOpacity
              onPress={() => setUseBLKD(!useBLKD)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: useBLKD ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                  backgroundColor: useBLKD ? "#ba9988" : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {useBLKD && <MaterialIcons name="check" size={16} color="#ffffff" />}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <MaterialIcons name="stars" size={20} color="#ba9988" />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#ffffff",
                    }}
                  >
                    Apply BLKD
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.6)",
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
                    backgroundColor: isSelected ? "#ba9988" : "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 2,
                    borderColor: isSelected ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: isSelected ? "rgba(255, 255, 255, 0.2)" : "rgba(186, 153, 136, 0.2)",
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
                      color={isSelected ? "#ffffff" : "#ba9988"}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      {(wallet as MockWallet).name}
                    </Text>
                    {(wallet as MockWallet).type === "creditcard" && (
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        •••• {(wallet as CreditCardWallet).last4}
                      </Text>
                    )}
                    {(wallet as MockWallet).type === "bankaccount" && (
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        •••• {(wallet as MockWallet).last4}
                      </Text>
                    )}
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: isSelected ? "#ffffff" : "#ba9988",
                      }}
                    >
                      {currency === "USD" ? "$" : ""}{balance.toFixed(2)}{currency === "BLKD" ? " BLKD" : ""}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.6)",
                      }}
                    >
                      Available
                    </Text>
                  </View>
                  {isSelected && (
                    <MaterialIcons name="check-circle" size={24} color="#ffffff" />
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
      <View style={{ gap: 24 }}>
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            Review Payment
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Please review your payment details before confirming.
          </Text>
        </View>

        {/* Invoice Info */}
        <View
          style={{
            backgroundColor: "rgba(71, 71, 71, 0.3)",
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          {business && <BusinessPlaceholder width={40} height={40} aspectRatio={1} />}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 2,
              }}
            >
              {invoice.invoiceNumber}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              {invoice.issuerName}
            </Text>
          </View>
        </View>

        {/* Payment Summary */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            gap: 16,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.6)",
                marginBottom: 8,
              }}
            >
              Invoice Amount
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: "#ba9988",
              }}
            >
              {formatCurrency(totalAmount, currency)}
            </Text>
          </View>

          {useBLKD && blkdCoverage > 0 && (
            <>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>BLKD Applied</Text>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#ba9988" }}>
                  -{blkdCoverage.toFixed(2)} BLKD
                </Text>
              </View>
              <View style={{ height: 1, backgroundColor: "rgba(186, 153, 136, 0.2)" }} />
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff" }}>Amount to Pay</Text>
                <Text style={{ fontSize: 18, fontWeight: "700", color: "#ba9988" }}>
                  {formatCurrency(remainingAfterBLKD, currency)}
                </Text>
              </View>
            </>
          )}

          <View style={{ height: 1, backgroundColor: "rgba(186, 153, 136, 0.2)" }} />
          <View style={{ gap: 12 }}>
            {serviceFee > 0 ? (
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Service Fee (10%)</Text>
                  {hasBDNPlus && (
                    <View
                      style={{
                        backgroundColor: "rgba(186, 153, 136, 0.2)",
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                      }}
                    >
                      <Text style={{ fontSize: 10, color: "#ba9988", fontWeight: "600" }}>BDN+</Text>
                    </View>
                  )}
                </View>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
                  {formatCurrency(serviceFee, currency)}
                </Text>
              </View>
            ) : hasBDNPlus ? (
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Service Fee</Text>
                  <View
                    style={{
                      backgroundColor: "rgba(186, 153, 136, 0.2)",
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ fontSize: 10, color: "#ba9988", fontWeight: "600" }}>BDN+</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ba9988", textDecorationLine: "line-through" }}>
                    {formatCurrency(numericAmount * 0.10, currency)}
                  </Text>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ba9988" }}>
                    {formatCurrency(0, currency)}
                  </Text>
                </View>
              </View>
            ) : null}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Payment Method</Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
                {useBLKD && blkdCoverage > 0 ? "BLKD" : ""}
                {useBLKD && blkdCoverage > 0 && remainingAfterBLKD > 0 ? " + " : ""}
                {remainingAfterBLKD > 0 ? selectedWallet?.name : ""}
              </Text>
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: "rgba(186, 153, 136, 0.2)" }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#ffffff" }}>Total</Text>
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#ba9988" }}>
              {formatCurrency(remainingAfterBLKD > 0 ? remainingAfterBLKD : totalAmount, currency)}
            </Text>
          </View>

          {remainingAfterBLKD > 0 && selectedWallet && (
            <View
              style={{
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 16,
                marginTop: 8,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>Current Balance</Text>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
                  {currency === "USD" ? "$" : ""}{balance.toFixed(2)}{currency === "BLKD" ? " BLKD" : ""}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>After Payment</Text>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#4caf50" }}>
                  {currency === "USD" ? "$" : ""}{(balance - remainingAfterBLKD).toFixed(2)}{currency === "BLKD" ? " BLKD" : ""}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderProcessingStep = () => (
    <View style={{ alignItems: "center", paddingVertical: 60, gap: 24 }}>
      <MaterialIcons name="hourglass-empty" size={64} color="#ba9988" />
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          color: "#ffffff",
        }}
      >
        Processing Payment...
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "rgba(255, 255, 255, 0.7)",
          textAlign: "center",
        }}
      >
        Please wait while we process your payment for {invoice.invoiceNumber}.
      </Text>
    </View>
  );

  const renderErrorStep = () => (
    <View style={{ alignItems: "center", paddingVertical: 60, gap: 24 }}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: "rgba(244, 67, 54, 0.2)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialIcons name="info-outline" size={48} color="#f44336" />
      </View>
      <View style={{ alignItems: "center", gap: 8 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#ffffff",
          }}
        >
          Payment Not Completed
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.7)",
            textAlign: "center",
            lineHeight: 20,
            paddingHorizontal: 20,
          }}
        >
          {errorMessage || "We couldn't complete your payment right now. Please check your payment method and try again, or contact support if the issue persists."}
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 12, width: "100%", marginTop: 8 }}>
        <TouchableOpacity
          onPress={() => {
            setStep("payment-method");
            setErrorMessage(null);
          }}
          style={{
            flex: 1,
            backgroundColor: "#ba9988",
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#ffffff",
            }}
          >
            Try Again
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flex: 1,
            backgroundColor: "#232323",
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#ffffff",
            }}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSuccessStep = () => (
    <View style={{ alignItems: "center", paddingVertical: 60, gap: 24 }}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: "#4caf50",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialIcons name="check" size={48} color="#ffffff" />
      </View>
      <View style={{ alignItems: "center", gap: 8 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#ffffff",
          }}
        >
          Payment Successful!
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#ba9988",
          }}
        >
          {formatCurrency(numericAmount, currency)} paid for {invoice.invoiceNumber}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#474747",
          borderRadius: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: "rgba(186, 153, 136, 0.2)",
          width: "100%",
          gap: 12,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Invoice</Text>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>{invoice.invoiceNumber}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Transaction ID</Text>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>{transactionId}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Amount</Text>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
            {formatCurrency(numericAmount, currency)}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Recipient</Text>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>{invoice.issuerName}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleComplete}
        style={{
          backgroundColor: "#ba9988",
          borderRadius: 12,
          paddingVertical: 16,
          paddingHorizontal: 32,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#ffffff",
          }}
        >
          Done
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        {/* Progress Steps */}
        {step !== "processing" && step !== "success" && step !== "error" && (
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
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
                        backgroundColor: isActive ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "700",
                          color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                        }}
                      >
                        {index + 1}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: isCurrent ? "#ba9988" : "rgba(255, 255, 255, 0.5)",
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
          <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                flex: 1,
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: "#232323",
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#ffffff",
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
                paddingVertical: 16,
                paddingHorizontal: isMobile ? 20 : 32,
                borderRadius: 12,
                backgroundColor:
                  step === "payment-method" && remainingAfterBLKD > 0 && !selectedWallet && !useBLKD
                    ? "rgba(186, 153, 136, 0.3)"
                    : "#ba9988",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                {step === "review" ? "Confirm Payment" : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
