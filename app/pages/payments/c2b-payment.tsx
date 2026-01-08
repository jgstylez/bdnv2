import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform, TextInput, Modal } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { PaymentKeypad } from '@/components/PaymentKeypad';
import { Wallet as WalletType, Currency, BankAccountWallet, CreditCardWallet } from '@/types/wallet';
import { BusinessPlaceholder } from '@/components/BusinessPlaceholder';
import { calculateConsumerTotalWithFee, checkBDNPlusSubscription } from '@/lib/fees';
import { formatCurrency } from '@/lib/international';
import { ReviewReason, REVIEW_REASONS } from '@/types/review';
import { logger } from '@/lib/logger';

// Mock wallets
const mockWallets: WalletType[] = [
  {
    id: "1",
    type: "primary",
    name: "Primary Wallet",
    currency: "USD",
    balance: 1250.75,
    isActive: true,
    isDefault: true,
  },
  {
    id: "2",
    type: "myimpact",
    name: "MyImpact Rewards",
    currency: "BLKD",
    balance: 3420,
    isActive: true,
  },
  {
    id: "4",
    type: "bankaccount",
    name: "Chase Checking",
    currency: "USD",
    balance: 5432.18,
    availableBalance: 5432.18,
    isActive: true,
    bankName: "Chase",
    accountType: "checking" as const,
    last4: "4321",
  } as BankAccountWallet,
];

// Import centralized mock businesses
import { mockBusinesses as centralizedMockBusinesses, getAllMockBusinesses } from '@/data/mocks/businesses';

// Use centralized mock businesses
const mockBusinesses: Record<string, any> = {
  "1": centralizedMockBusinesses["1"],
  "2": centralizedMockBusinesses["2"],
  "3": centralizedMockBusinesses["3"],
  "4": centralizedMockBusinesses["4"],
  "5": centralizedMockBusinesses["5"],
  "6": centralizedMockBusinesses["6"],
};

// All businesses list for search
const allBusinesses = getAllMockBusinesses();

type PaymentStep = "select-business" | "amount" | "payment-method" | "review" | "processing" | "success";

export default function C2BPayment() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const params = useLocalSearchParams<{ businessId?: string; amount?: string; currency?: Currency }>();
  const isMobile = width < 768;
  const [step, setStep] = useState<PaymentStep>(params.businessId ? "amount" : "select-business");
  const [amount, setAmount] = useState(params.amount || "0");
  const [currency, setCurrency] = useState<Currency>((params.currency as Currency) || "USD");
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const [useBLKD, setUseBLKD] = useState(false);
  const [note, setNote] = useState("");
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(params.businessId || null);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [businessSearchQuery, setBusinessSearchQuery] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [selectedReasons, setSelectedReasons] = useState<ReviewReason[]>([]);

  const business = selectedBusinessId ? mockBusinesses[selectedBusinessId] : null;
  const numericAmount = parseFloat(amount) || 0;

  // Filter businesses based on search query
  const filteredBusinesses = allBusinesses.filter((b) =>
    b.name.toLowerCase().includes(businessSearchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(businessSearchQuery.toLowerCase())
  );

  const handleSelectBusiness = (businessId: string) => {
    setSelectedBusinessId(businessId);
    setShowBusinessModal(false);
    setBusinessSearchQuery("");
  };
  
  // Check if user has BDN+ subscription (TODO: Replace with actual check)
  const hasBDNPlus = checkBDNPlusSubscription("current-user-id");
  
  // Calculate BDN service fee
  const feeCalculation = calculateConsumerTotalWithFee(numericAmount, currency, hasBDNPlus);
  const serviceFee = feeCalculation.serviceFee;
  const totalAmount = feeCalculation.total;
  
  // Get BLKD wallet separately
  const blkdWallet = mockWallets.find((w) => w.type === "myimpact" && w.currency === "BLKD");
  const blkdBalance = blkdWallet ? (blkdWallet.availableBalance || blkdWallet.balance) : 0;
  
  // Calculate BLKD coverage and remaining amount
  const blkdCoverage = useBLKD && blkdBalance > 0 ? Math.min(blkdBalance, totalAmount) : 0;
  const remainingAfterBLKD = totalAmount - blkdCoverage;
  
  // Filter wallets that match the payment currency and have sufficient balance for remaining amount
  const availableWallets = mockWallets.filter(
    (w) => w.type !== "myimpact" && w.currency === currency && (w.availableBalance || w.balance) >= remainingAfterBLKD
  );

  const handleProceed = () => {
    if (step === "select-business") {
      if (!business) {
        alert("Please select a business");
        return;
      }
      setStep("amount");
      return;
    }
    if (step === "amount") {
      if (numericAmount <= 0) {
        alert("Please enter a valid amount");
        return;
      }
      if (availableWallets.length === 0) {
        alert(`No ${currency} wallets with sufficient balance`);
        return;
      }
      setStep("payment-method");
    } else if (step === "payment-method") {
      if (!selectedWallet) {
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
    // TODO: Process payment via API
    // This should:
    // 1. Deduct totalAmount (including service fee) from user's wallet
    // 2. Add numericAmount to business account
    // 3. Calculate and deduct platform fee from business (10% or 5% with BDN+ Business)
    // 4. Create transaction records with fee breakdown
    
    setTimeout(() => {
      const newTransactionId = `TXN-${Date.now()}`;
      setTransactionId(newTransactionId);
      setStep("success");
    }, 2000);
  };

  const handleComplete = () => {
    router.push("/pages/transactions");
  };

  const renderSelectBusinessStep = () => (
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
          Select Business
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          Choose the business you'd like to pay.
        </Text>
      </View>

      {/* Business Selector or Info */}
      {!business ? (
        <TouchableOpacity
          onPress={() => setShowBusinessModal(true)}
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
        >
          <MaterialIcons name="search" size={24} color="rgba(255, 255, 255, 0.5)" />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              Select a business
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.5)",
                marginTop: 2,
              }}
            >
              Tap to search and select
            </Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={16} color="rgba(255, 255, 255, 0.5)" />
        </TouchableOpacity>
      ) : (
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
          <BusinessPlaceholder width={40} height={40} aspectRatio={1} />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 2,
              }}
            >
              {business.name}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              {business.category}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setSelectedBusinessId(null)}
            style={{ padding: 4 }}
          >
            <MaterialIcons name="close" size={18} color="rgba(255, 255, 255, 0.5)" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderAmountStep = () => (
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
          Pay Business
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          {business 
            ? `Enter the amount you'd like to send to ${business.name}.`
            : "Enter the amount you'd like to send."}
        </Text>
      </View>

      {/* Selected Business Info */}
      {business && (
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
          <BusinessPlaceholder width={40} height={40} aspectRatio={1} />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 2,
              }}
            >
              {business.name}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              {business.category}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setSelectedBusinessId(null);
              setStep("select-business");
            }}
            style={{ padding: 4 }}
          >
            <MaterialIcons name="edit" size={18} color="rgba(255, 255, 255, 0.5)" />
          </TouchableOpacity>
        </View>
      )}

      <PaymentKeypad value={amount} onValueChange={setAmount} currency={currency} />

      {numericAmount > 0 && (
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Payment Amount</Text>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>
              {formatCurrency(numericAmount, currency)}
            </Text>
          </View>
          
          {/* Service Fee */}
          {serviceFee > 0 ? (
            <>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
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
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 12, color: "#ba9988", fontStyle: "italic" }}>
                    ✓ Service fee waived with BDN+
                  </Text>
                </View>
              )}
            </>
          ) : hasBDNPlus ? (
            <View style={{ marginBottom: 12 }}>
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
          
              <View style={{ height: 1, backgroundColor: "rgba(186, 153, 136, 0.2)", marginBottom: 12 }} />
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff" }}>Total</Text>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#ba9988" }}>
              {formatCurrency(totalAmount, currency)}
            </Text>
              </View>
        </View>
      )}
    </View>
  );

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
          Select Payment Method
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          {remainingAfterBLKD > 0
            ? `Pay ${currency === "USD" ? `$${remainingAfterBLKD.toFixed(2)}` : `${remainingAfterBLKD.toFixed(2)} BLKD`} to ${business?.name || "business"}${useBLKD && blkdCoverage > 0 ? ` (${blkdCoverage.toFixed(2)} BLKD applied)` : ""}`
            : `Pay ${currency === "USD" ? `$${numericAmount.toFixed(2)}` : `${numericAmount.toFixed(2)} BLKD`} to ${business?.name || "business"}`}
        </Text>
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
          const balance = wallet.availableBalance || wallet.balance;
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
                    wallet.type === "creditcard"
                      ? "credit-card"
                      : wallet.type === "bankaccount"
                      ? "account-balance"
                      : wallet.type === "myimpact"
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
                  {wallet.name}
                </Text>
                {wallet.type === "creditcard" && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    •••• {(wallet as CreditCardWallet).last4}
                  </Text>
                )}
                {wallet.type === "bankaccount" && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    •••• {(wallet as BankAccountWallet).last4}
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
    const balance = selectedWallet ? (selectedWallet.availableBalance || selectedWallet.balance) : 0;
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

        {/* Business Info */}
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
          <BusinessPlaceholder width={40} height={40} aspectRatio={1} />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 2,
              }}
            >
              {business?.name || ""}
            </Text>
            {business?.category && (
              <Text
                style={{
                  fontSize: 11,
                  color: "rgba(255, 255, 255, 0.6)",
                }}
              >
                {business.category}
              </Text>
            )}
          </View>
        </View>

        {/* Payment Note */}
        <View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            Add a Note (Optional)
          </Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="What is this payment for?"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            multiline
            numberOfLines={3}
            style={{
              backgroundColor: "#474747",
              borderRadius: 12,
              padding: 16,
              color: "#ffffff",
              fontSize: 14,
              minHeight: 80,
              textAlignVertical: "top",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          />
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
              Payment Amount
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
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>{selectedWallet?.name}</Text>
                </View>
              </View>
              <View style={{ height: 1, backgroundColor: "rgba(186, 153, 136, 0.2)" }} />
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 18, fontWeight: "700", color: "#ffffff" }}>Total</Text>
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#ba9988" }}>
              {formatCurrency(remainingAfterBLKD > 0 ? remainingAfterBLKD : totalAmount, currency)}
            </Text>
              </View>

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
                {currency === "USD" ? "$" : ""}{(balance - totalAmount).toFixed(2)}{currency === "BLKD" ? " BLKD" : ""}
              </Text>
            </View>
          </View>
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
        Please wait while we process your payment to {business?.name || "business"}.
      </Text>
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
          {currency === "USD" ? "$" : ""}{numericAmount.toFixed(2)}{currency === "BLKD" ? " BLKD" : ""} sent to {business?.name || "business"}
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
          <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Transaction ID</Text>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>{transactionId}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Amount</Text>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
            {currency === "USD" ? "$" : ""}{numericAmount.toFixed(2)}{currency === "BLKD" ? " BLKD" : ""}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Recipient</Text>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>{business?.name || ""}</Text>
        </View>
        {note && (
          <View style={{ marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: "rgba(186, 153, 136, 0.2)" }}>
            <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginBottom: 4 }}>Note</Text>
            <Text style={{ fontSize: 14, color: "#ffffff" }}>{note}</Text>
          </View>
        )}
      </View>

      {/* Feedback Prompt */}
      {business && (
        <TouchableOpacity
          onPress={() => setShowFeedbackModal(true)}
          style={{
            backgroundColor: "#474747",
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
          }}
        >
          <MaterialIcons name="rate-review" size={20} color="#ba9988" />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#ba9988",
            }}
          >
            Leave Feedback
          </Text>
        </TouchableOpacity>
      )}

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
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        {/* Progress Steps */}
        {step !== "processing" && step !== "success" && (
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
              {[
                { step: "select-business", label: "Business" },
                { step: "amount", label: "Amount" },
                { step: "payment-method", label: "Payment" },
                { step: "review", label: "Review" },
              ].map((s, index) => {
                const stepIndex = ["select-business", "amount", "payment-method", "review"].indexOf(step);
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
        {step === "select-business" && renderSelectBusinessStep()}
        {step === "amount" && renderAmountStep()}
        {step === "payment-method" && renderPaymentMethodStep()}
        {step === "review" && renderReviewStep()}
        {step === "processing" && renderProcessingStep()}
        {step === "success" && renderSuccessStep()}

        {/* Navigation Buttons */}
        {step !== "processing" && step !== "success" && (
          <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
            <TouchableOpacity
              onPress={() => {
                if (step === "select-business") {
                  router.back();
                } else if (step === "amount") {
                  setStep("select-business");
                } else if (step === "payment-method") {
                  setStep("amount");
                } else {
                  setStep("payment-method");
                }
              }}
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
                {step === "select-business" ? "Cancel" : "Back"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleProceed}
              disabled={
                (step === "select-business" && !business) ||
                (step === "amount" && numericAmount <= 0) ||
                (step === "payment-method" && remainingAfterBLKD > 0 && !selectedWallet && !useBLKD)
              }
              style={{
                flex: 1,
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor:
                  (step === "amount" && numericAmount <= 0) ||
                  (step === "payment-method" && !selectedWallet)
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

      {/* Business Search Modal */}
      <Modal
        visible={showBusinessModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowBusinessModal(false);
          setBusinessSearchQuery("");
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "center",
            alignItems: "center",
            padding: isMobile ? 16 : 24,
          }}
          activeOpacity={1}
          onPress={() => {
            setShowBusinessModal(false);
            setBusinessSearchQuery("");
          }}
        >
          <View
            style={{
              backgroundColor: "#232323",
              borderRadius: 16,
              width: "100%",
              maxWidth: 500,
              maxHeight: "80%",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10,
            }}
            onStartShouldSetResponder={() => true}
          >
            {/* Header */}
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(186, 153, 136, 0.2)",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#ffffff",
                }}
              >
                Select a Business
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowBusinessModal(false);
                  setBusinessSearchQuery("");
                }}
                style={{ padding: 4 }}
              >
                <MaterialIcons name="close" size={24} color="rgba(255, 255, 255, 0.7)" />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#474747",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  gap: 12,
                }}
              >
                <MaterialIcons name="search" size={20} color="rgba(255, 255, 255, 0.5)" />
                <TextInput
                  placeholder="Search businesses..."
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={businessSearchQuery}
                  onChangeText={setBusinessSearchQuery}
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: "#ffffff",
                  }}
                  autoFocus
                />
                {businessSearchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setBusinessSearchQuery("")}
                    style={{ padding: 4 }}
                  >
                    <MaterialIcons name="close" size={18} color="rgba(255, 255, 255, 0.5)" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Business List */}
            <ScrollView
              style={{ maxHeight: 400 }}
              showsVerticalScrollIndicator={false}
            >
              {filteredBusinesses.length === 0 ? (
                <View
                  style={{
                    padding: 40,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons name="search-off" size={48} color="rgba(255, 255, 255, 0.3)" />
                  <Text
                    style={{
                      fontSize: 16,
                      color: "rgba(255, 255, 255, 0.5)",
                      marginTop: 16,
                      textAlign: "center",
                    }}
                  >
                    No businesses found
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.4)",
                      marginTop: 8,
                      textAlign: "center",
                    }}
                  >
                    Try a different search term
                  </Text>
                </View>
              ) : (
                filteredBusinesses.map((b) => (
                  <TouchableOpacity
                    key={b.id}
                    onPress={() => handleSelectBusiness(b.id)}
                    style={{
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: "rgba(186, 153, 136, 0.1)",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <BusinessPlaceholder width={50} height={50} aspectRatio={1} />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#ffffff",
                          marginBottom: 4,
                        }}
                      >
                        {b.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        {b.category}
                      </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color="rgba(255, 255, 255, 0.5)" />
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        visible={showFeedbackModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowFeedbackModal(false);
          setFeedbackRating(0);
          setFeedbackComment("");
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "center",
            alignItems: "center",
            padding: isMobile ? 16 : 24,
          }}
          activeOpacity={1}
          onPress={() => {
            setShowFeedbackModal(false);
            setFeedbackRating(0);
            setFeedbackComment("");
          }}
        >
          <View
            style={{
              backgroundColor: "#232323",
              borderRadius: 16,
              width: "100%",
              maxWidth: 500,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10,
            }}
            onStartShouldSetResponder={() => true}
          >
            {/* Header */}
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(186, 153, 136, 0.2)",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#ffffff",
                }}
              >
                Rate Your Experience
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowFeedbackModal(false);
                  setFeedbackRating(0);
                  setFeedbackComment("");
                }}
                style={{ padding: 4 }}
              >
                <MaterialIcons name="close" size={24} color="rgba(255, 255, 255, 0.7)" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={{ padding: 20, gap: 20 }}>
              {business && (
                <View style={{ alignItems: "center", gap: 8 }}>
                  <BusinessPlaceholder width={60} height={60} aspectRatio={1} />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#ffffff",
                      textAlign: "center",
                    }}
                  >
                    How was your experience with {business.name}?
                  </Text>
                </View>
              )}

              {/* Star Rating */}
              <View style={{ alignItems: "center", gap: 12 }}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => {
                        setFeedbackRating(star);
                        // Clear reasons when rating changes to avoid mismatched selections
                        if ((star >= 4 && feedbackRating < 4) || (star <= 2 && feedbackRating > 2)) {
                          setSelectedReasons([]);
                        }
                      }}
                      style={{ padding: 4 }}
                    >
                      <MaterialIcons
                        name={star <= feedbackRating ? "star" : "star-border"}
                        size={40}
                        color={star <= feedbackRating ? "#ffd700" : "rgba(255, 255, 255, 0.3)"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                {feedbackRating > 0 && (
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {feedbackRating === 5 && "Excellent!"}
                    {feedbackRating === 4 && "Great!"}
                    {feedbackRating === 3 && "Good"}
                    {feedbackRating === 2 && "Fair"}
                    {feedbackRating === 1 && "Poor"}
                  </Text>
                )}
              </View>

              {/* Reason Pills */}
              {feedbackRating > 0 && (
                <View>
                  {feedbackRating >= 3 && (
                    <View style={{ marginBottom: 12 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "rgba(255, 255, 255, 0.7)",
                          marginBottom: 12,
                        }}
                      >
                        What did you like? (Select all that apply)
                      </Text>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                        {REVIEW_REASONS.filter((r) => r.category === "positive").map((reason) => (
                          <TouchableOpacity
                            key={reason.id}
                            onPress={() => {
                              if (selectedReasons.includes(reason.id)) {
                                setSelectedReasons(selectedReasons.filter((r) => r !== reason.id));
                              } else {
                                setSelectedReasons([...selectedReasons, reason.id]);
                              }
                            }}
                            style={{
                              paddingHorizontal: 16,
                              paddingVertical: 8,
                              borderRadius: 20,
                              backgroundColor: selectedReasons.includes(reason.id)
                                ? "#ba9988"
                                : "rgba(186, 153, 136, 0.15)",
                              borderWidth: 1,
                              borderColor: selectedReasons.includes(reason.id)
                                ? "#ba9988"
                                : "rgba(186, 153, 136, 0.2)",
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            {reason.icon && (
                              <MaterialIcons
                                name={reason.icon as any}
                                size={16}
                                color={selectedReasons.includes(reason.id) ? "#ffffff" : "#ba9988"}
                              />
                            )}
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: "600",
                                color: selectedReasons.includes(reason.id) ? "#ffffff" : "#ba9988",
                              }}
                            >
                              {reason.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}
                  {feedbackRating <= 3 && (
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "rgba(255, 255, 255, 0.7)",
                          marginBottom: 12,
                        }}
                      >
                        What could be improved? (Select all that apply)
                      </Text>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                        {REVIEW_REASONS.filter((r) => r.category === "negative").map((reason) => (
                          <TouchableOpacity
                            key={reason.id}
                            onPress={() => {
                              if (selectedReasons.includes(reason.id)) {
                                setSelectedReasons(selectedReasons.filter((r) => r !== reason.id));
                              } else {
                                setSelectedReasons([...selectedReasons, reason.id]);
                              }
                            }}
                            style={{
                              paddingHorizontal: 16,
                              paddingVertical: 8,
                              borderRadius: 20,
                              backgroundColor: selectedReasons.includes(reason.id)
                                ? "#ba9988"
                                : "rgba(186, 153, 136, 0.15)",
                              borderWidth: 1,
                              borderColor: selectedReasons.includes(reason.id)
                                ? "#ba9988"
                                : "rgba(186, 153, 136, 0.2)",
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            {reason.icon && (
                              <MaterialIcons
                                name={reason.icon as any}
                                size={16}
                                color={selectedReasons.includes(reason.id) ? "#ffffff" : "#ba9988"}
                              />
                            )}
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: "600",
                                color: selectedReasons.includes(reason.id) ? "#ffffff" : "#ba9988",
                              }}
                            >
                              {reason.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              )}

              {/* Comment */}
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Add a comment (optional)
                </Text>
                <TextInput
                  value={feedbackComment}
                  onChangeText={setFeedbackComment}
                  placeholder="Share your experience..."
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  multiline
                  numberOfLines={4}
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 12,
                    padding: 16,
                    color: "#ffffff",
                    fontSize: 14,
                    minHeight: 100,
                    textAlignVertical: "top",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                />
              </View>

              {/* Actions */}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowFeedbackModal(false);
                    setFeedbackRating(0);
                    setFeedbackComment("");
                    setSelectedReasons([]);
                  }}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: "#474747",
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
                    Skip
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (feedbackRating > 0) {
                      // TODO: Submit feedback to API
                      logger.info("Feedback submitted", {
                        businessId: business?.id,
                        rating: feedbackRating,
                        selectedReasons,
                        comment: feedbackComment,
                      });
                      alert("Thank you for your feedback!");
                    }
                    setShowFeedbackModal(false);
                    setFeedbackRating(0);
                    setFeedbackComment("");
                    setSelectedReasons([]);
                  }}
                  disabled={feedbackRating === 0}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: feedbackRating > 0 ? "#ba9988" : "#474747",
                    alignItems: "center",
                    opacity: feedbackRating > 0 ? 1 : 0.5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

