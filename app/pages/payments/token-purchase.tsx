import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { PaymentKeypad } from '@/components/PaymentKeypad';
import { TOKEN_PRICE } from '@/types/token';
import { Wallet as WalletType, BankAccountWallet, CreditCardWallet } from '@/types/wallet';
import { BackButton } from '@/components/navigation/BackButton';
import { StepIndicator } from '@/components/StepIndicator';

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
  {
    id: "5",
    userId: "user-1",
    provider: "bdn",
    type: "creditcard",
    name: "Visa Card",
    currency: "USD",
    balance: 0,
    availableBalance: 5000,
    isActive: true,
    cardBrand: "Visa",
    last4: "8765",
    expirationDate: "12/25",
    cardholderName: "John Doe",
  } as MockWallet,
];

type PaymentStep = "amount" | "payment-method" | "review" | "processing" | "success" | "error";

export default function TokenPurchase() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [step, setStep] = useState<PaymentStep>("amount");
  const [amount, setAmount] = useState("0");
  const [selectedWallet, setSelectedWallet] = useState<MockWallet | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const numericAmount = parseFloat(amount) || 0;
  const tokenCount = Math.floor(numericAmount / TOKEN_PRICE);
  const totalCost = tokenCount * TOKEN_PRICE;
  const availableWallets = mockWallets.filter((w) => w.currency === "USD" && ((w as MockWallet).availableBalance || w.balance) >= totalCost);

  const handleProceed = () => {
    if (step === "amount") {
      if (numericAmount < TOKEN_PRICE) {
        alert(`Minimum purchase is $${TOKEN_PRICE.toFixed(2)}`);
        return;
      }
      if (availableWallets.length === 0) {
        alert("No wallets with sufficient balance");
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
    setErrorMessage(null);
    // Simulate payment processing
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
          "We couldn't complete your token purchase right now. Please check your payment method and try again, or contact support if the issue persists."
        );
        setStep("error");
      }
    }, 2000);
  };

  const handleComplete = () => {
    router.push("/pages/tokens");
  };

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
          Purchase BDN Tokens
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          Tokens cost ${TOKEN_PRICE.toFixed(2)} each. Enter the amount you'd like to spend.
        </Text>
      </View>

      <PaymentKeypad value={amount} onValueChange={setAmount} currency="USD" />

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
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Amount</Text>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>${numericAmount.toFixed(2)}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Tokens</Text>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#ba9988" }}>{tokenCount} tokens</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 12, borderTopWidth: 1, borderTopColor: "rgba(186, 153, 136, 0.2)" }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff" }}>Total</Text>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#ba9988" }}>${totalCost.toFixed(2)}</Text>
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
          Choose how you'd like to pay for {tokenCount} tokens (${totalCost.toFixed(2)})
        </Text>
      </View>

      <View style={{ gap: 12 }}>
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
                    •••• {(wallet as MockWallet).last4}
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
                  ${balance.toFixed(2)}
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
            Review Purchase
        </Text>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Please review your purchase details before confirming.
          </Text>
        </View>

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
              Tokens
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: "#ba9988",
              }}
            >
              {tokenCount} tokens
            </Text>
          </View>

          <View style={{ height: 1, backgroundColor: "rgba(186, 153, 136, 0.2)" }} />

          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Token Price</Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>${TOKEN_PRICE.toFixed(2)} each</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Subtotal</Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>${totalCost.toFixed(2)}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Payment Method</Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>{selectedWallet?.name}</Text>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: "rgba(186, 153, 136, 0.2)" }} />

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#ffffff" }}>Total</Text>
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#ba9988" }}>${totalCost.toFixed(2)}</Text>
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
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>${balance.toFixed(2)}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
              <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>After Purchase</Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#4caf50" }}>${(balance - totalCost).toFixed(2)}</Text>
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
        Please wait while we process your token purchase.
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
          Purchase Not Completed
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
          {errorMessage || "We couldn't complete your token purchase right now. Please check your payment method and try again, or contact support if the issue persists."}
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
          {tokenCount} tokens added to your account
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
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>${totalCost.toFixed(2)}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Tokens</Text>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#ba9988" }}>{tokenCount}</Text>
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
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        {/* Back Button */}
        {step !== "processing" && step !== "success" && step !== "error" && (
          <BackButton label="Back to Pay" to="/(tabs)/pay" marginBottom={16} />
        )}

        {/* Step Indicator */}
        {step !== "processing" && step !== "success" && step !== "error" && (() => {
          const stepIndex = ["amount", "payment-method", "review"].indexOf(step);
          const currentStepNumber = stepIndex >= 0 ? stepIndex + 1 : 1;
          return (
            <StepIndicator
              currentStep={currentStepNumber}
              steps={[
                { number: 1, label: "Amount", key: "amount" },
                { number: 2, label: "Payment", key: "payment-method" },
                { number: 3, label: "Review", key: "review" },
              ]}
            />
          );
        })()}

        {/* Step Content */}
        {step === "amount" && renderAmountStep()}
        {step === "payment-method" && renderPaymentMethodStep()}
        {step === "review" && renderReviewStep()}
        {step === "processing" && renderProcessingStep()}
        {step === "success" && renderSuccessStep()}
        {step === "error" && renderErrorStep()}

        {/* Navigation Buttons */}
        {step !== "processing" && step !== "success" && step !== "error" && (
          <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
            <TouchableOpacity
              onPress={() => {
                if (step === "amount") {
                  router.back();
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
                {step === "amount" ? "Cancel" : "Back"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleProceed}
              disabled={
                (step === "amount" && numericAmount < TOKEN_PRICE) ||
                (step === "payment-method" && !selectedWallet)
              }
              style={{
                flex: 1,
                paddingVertical: 16,
                paddingHorizontal: isMobile ? 20 : 32,
                borderRadius: 12,
                backgroundColor:
                  (step === "amount" && numericAmount < TOKEN_PRICE) ||
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
                {step === "review" ? "Confirm Purchase" : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

