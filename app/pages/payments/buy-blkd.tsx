import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useResponsive } from "../../../hooks/useResponsive";
import {
  BLKDPurchaseTier,
  BLKDPurchaseFormData,
} from "../../../types/blkd-purchase";
import { Wallet } from "../../../types/wallet";
import { PaymentMethodSelector } from "../../../components/checkout/PaymentMethodSelector";
import { formatCurrency } from "../../../lib/international";

// BLKD Purchase Tiers with bulk discounts
// Base rate: 1 BLKD = $1 USD
// Start at 5% discount for 100 BLKD, increase by 2% per tier
const BLKD_PURCHASE_TIERS: BLKDPurchaseTier[] = [
  { blkdAmount: 100, usdPrice: 95, discountPercent: 5, savings: 5 },
  { blkdAmount: 250, usdPrice: 230, discountPercent: 8, savings: 20 },
  { blkdAmount: 500, usdPrice: 455, discountPercent: 9, savings: 45 },
  {
    blkdAmount: 1000,
    usdPrice: 890,
    discountPercent: 11,
    savings: 110,
    popular: true,
  },
  { blkdAmount: 2500, usdPrice: 2175, discountPercent: 13, savings: 325 },
  { blkdAmount: 5000, usdPrice: 4250, discountPercent: 15, savings: 750 },
];

export default function BuyBLKD() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { isMobile, paddingHorizontal } = useResponsive();
  const [formData, setFormData] = useState<BLKDPurchaseFormData>({
    blkdAmount: 1000,
    usdPrice: 890,
    discountPercent: 11,
    savings: 110,
  });
  const [customAmount, setCustomAmount] = useState("");
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [step, setStep] = useState<
    "form" | "review" | "processing" | "success"
  >("form");

  // Mock wallets
  useEffect(() => {
    const mockWallets: Wallet[] = [
      {
        id: "1",
        type: "primary",
        name: "Primary",
        currency: "USD",
        balance: 1250.75,
        isActive: true,
        isDefault: true,
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
      },
      {
        id: "5",
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
      },
    ];
    setWallets(mockWallets);
    const defaultWallet = mockWallets.find((w) => w.isDefault);
    if (defaultWallet) {
      setSelectedWalletId(defaultWallet.id);
    }
  }, []);

  const handleSelectTier = (tier: BLKDPurchaseTier) => {
    setFormData({
      blkdAmount: tier.blkdAmount,
      usdPrice: tier.usdPrice,
      discountPercent: tier.discountPercent,
      savings: tier.savings,
    });
    setCustomAmount(tier.blkdAmount.toString());
  };

  const handleCustomAmount = (text: string) => {
    setCustomAmount(text);
    const amount = parseFloat(text) || 0;
    if (amount > 0) {
      // Calculate price based on amount
      // Start at 5% discount for 100 BLKD, increase by 2% per tier
      let discountPercent = 0;
      let savings = 0;

      if (amount >= 5000) {
        discountPercent = 15;
      } else if (amount >= 2500) {
        discountPercent = 13;
      } else if (amount >= 1000) {
        discountPercent = 11;
      } else if (amount >= 500) {
        discountPercent = 9;
      } else if (amount >= 250) {
        discountPercent = 8;
      } else if (amount >= 100) {
        discountPercent = 5;
      } else {
        discountPercent = 0; // No discount below 100 BLKD
      }

      const basePrice = amount;
      savings = (basePrice * discountPercent) / 100;
      const usdPrice = basePrice - savings;

      setFormData({
        blkdAmount: amount,
        usdPrice,
        discountPercent,
        savings,
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedWalletId) {
      alert("Please select a payment method");
      return;
    }
    if (formData.blkdAmount <= 0) {
      alert("Please select a valid amount");
      return;
    }

    // Navigate to review step
    setStep("review");
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    setStep("processing");

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setStep("success");
    }, 1500);
  };

  const selectedWallet = wallets.find((w) => w.id === selectedWalletId);

  const renderReviewStep = () => {
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
            Please review your BLKD purchase before confirming.
          </Text>
        </View>

        {/* Purchase Details */}
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
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            Purchase Details
          </Text>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
              BLKD Amount
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
              {formData.blkdAmount.toLocaleString()} BLKD
            </Text>
          </View>

          {formData.discountPercent && formData.discountPercent > 0 && (
            <>
              <View
                style={{
                  height: 1,
                  backgroundColor: "rgba(186, 153, 136, 0.2)",
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}
                >
                  Discount ({formData.discountPercent}%)
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#ba9988" }}
                >
                  -${formData.savings?.toLocaleString()}
                </Text>
              </View>
            </>
          )}

          <View
            style={{ height: 1, backgroundColor: "rgba(186, 153, 136, 0.2)" }}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#ffffff" }}>
              Total
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#ba9988" }}>
              ${formData.usdPrice.toLocaleString()}
            </Text>
          </View>

          {selectedWallet && (
            <>
              <View
                style={{
                  height: 1,
                  backgroundColor: "rgba(186, 153, 136, 0.2)",
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}
                >
                  Payment Method
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}
                >
                  {selectedWallet.name}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            onPress={() => setStep("form")}
            style={{
              flex: 1,
              backgroundColor: "#474747",
              borderRadius: 12,
              padding: 18,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={isProcessing}
            style={{
              flex: 1,
              backgroundColor: isProcessing ? "#666666" : "#ba9988",
              borderRadius: 12,
              padding: 18,
              alignItems: "center",
              opacity: isProcessing ? 0.6 : 1,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              {isProcessing ? "Processing..." : "Confirm Purchase"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderProcessingStep = () => {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 60,
          gap: 24,
        }}
      >
        <MaterialIcons name="hourglass-empty" size={64} color="#ba9988" />
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#ffffff",
          }}
        >
          Processing Purchase...
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.7)",
            textAlign: "center",
          }}
        >
          Please wait while we process your BLKD purchase.
        </Text>
      </View>
    );
  };

  const renderSuccessStep = () => {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 60,
          gap: 24,
        }}
      >
        <MaterialIcons name="check-circle" size={64} color="#4caf50" />
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#ffffff",
          }}
        >
          Purchase Successful!
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.7)",
            textAlign: "center",
          }}
        >
          {formData.blkdAmount.toLocaleString()} BLKD has been added to your
          account.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/pay")}
          style={{
            backgroundColor: "#ba9988",
            borderRadius: 12,
            paddingHorizontal: 32,
            paddingVertical: 16,
            marginTop: 8,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#ffffff",
            }}
          >
            View Wallet
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: 20,
          paddingBottom: isMobile ? 100 : 40,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (step === "review") {
                setStep("form");
              } else {
                router.back();
              }
            }}
            style={{ marginRight: 16 }}
          >
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: isMobile ? 24 : 28,
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              {step === "review"
                ? "Review Purchase"
                : step === "processing"
                ? "Processing"
                : step === "success"
                ? "Success"
                : "Buy BLKD"}
            </Text>
            {step === "form" && (
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.6)",
                  marginTop: 4,
                }}
              >
                Buy in bulk and save
              </Text>
            )}
          </View>
        </View>

        {step === "review" && renderReviewStep()}
        {step === "processing" && renderProcessingStep()}
        {step === "success" && renderSuccessStep()}
        {step === "form" && (
          <>
            {/* Info Banner - Collapsible */}
            <TouchableOpacity
              onPress={() => setShowInfo(!showInfo)}
              style={{
                backgroundColor: "#474747",
                borderRadius: 12,
                padding: 12,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    flex: 1,
                  }}
                >
                  <MaterialIcons name="info" size={18} color="#ba9988" />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    About BLKD (Black dollars)
                  </Text>
                </View>
                <MaterialIcons
                  name={showInfo ? "expand-less" : "expand-more"}
                  size={20}
                  color="rgba(255, 255, 255, 0.6)"
                />
              </View>
              {showInfo && (
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 18,
                    marginTop: 8,
                    paddingLeft: 26,
                  }}
                >
                  BLKD are non-redeemable credits that you can purchase in bulk
                  to save money. Use them to pay and shop on the platform and
                  get discounts when buying larger amounts.
                </Text>
              )}
            </TouchableOpacity>

            {/* Amount Selection */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Select Amount
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.6)",
                  marginBottom: 12,
                }}
              >
                Select a preset amount or enter a custom amount
              </Text>

              {/* Preset Tiers */}
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                {BLKD_PURCHASE_TIERS.map((tier) => (
                  <TouchableOpacity
                    key={tier.blkdAmount}
                    onPress={() => handleSelectTier(tier)}
                    style={{
                      flex: isMobile ? undefined : 1,
                      minWidth: isMobile ? "48%" : 0,
                      backgroundColor:
                        formData.blkdAmount === tier.blkdAmount
                          ? "#ba9988"
                          : "#474747",
                      borderRadius: 12,
                      padding: 14,
                      borderWidth: 1,
                      borderColor:
                        formData.blkdAmount === tier.blkdAmount
                          ? "#ba9988"
                          : "rgba(186, 153, 136, 0.2)",
                      position: "relative",
                    }}
                  >
                    {tier.popular && (
                      <View
                        style={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          backgroundColor: "#ba9988",
                          paddingHorizontal: 5,
                          paddingVertical: 1,
                          borderRadius: 3,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 8,
                            fontWeight: "700",
                            color: "#000000",
                          }}
                        >
                          POPULAR
                        </Text>
                      </View>
                    )}
                    <View style={{ alignItems: "center" }}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "700",
                          color: "#ffffff",
                          marginBottom: 6,
                        }}
                      >
                        {tier.blkdAmount.toLocaleString()} BLKD
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color:
                            formData.blkdAmount === tier.blkdAmount
                              ? "#ffffff"
                              : "#ba9988",
                        }}
                      >
                        ${tier.usdPrice.toLocaleString()}
                      </Text>
                      {tier.discountPercent && tier.discountPercent > 0 && (
                        <Text
                          style={{
                            fontSize: 11,
                            color: "rgba(255, 255, 255, 0.6)",
                            fontWeight: "600",
                            marginTop: 4,
                          }}
                        >
                          Save {tier.discountPercent}%
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Custom Amount */}
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.6)",
                    marginBottom: 8,
                  }}
                >
                  Or enter custom amount
                </Text>
                <TextInput
                  value={customAmount || formData.blkdAmount.toString()}
                  onChangeText={handleCustomAmount}
                  keyboardType="numeric"
                  placeholder="Enter BLKD amount"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: "#ffffff",
                    borderWidth: 1,
                    borderColor:
                      customAmount &&
                      !BLKD_PURCHASE_TIERS.some(
                        (t) => t.blkdAmount === parseFloat(customAmount)
                      )
                        ? "#ba9988"
                        : "rgba(186, 153, 136, 0.2)",
                  }}
                />
              </View>
            </View>

            {/* Payment Method */}
            <View style={{ marginBottom: 24 }}>
              <PaymentMethodSelector
                wallets={wallets}
                selectedWalletId={selectedWalletId}
                onSelectWallet={setSelectedWalletId}
                totalAmount={formData.usdPrice}
                currency="USD"
                blkdBalance={0}
                useBLKD={false}
                onToggleBLKD={() => {}}
                onAddPaymentMethod={() => {}}
              />
            </View>

            {/* Order Summary */}
            <View
              style={{
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 16,
                }}
              >
                Order Summary
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}
                >
                  BLKD
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}
                >
                  {formData.blkdAmount.toLocaleString()} BLKD
                </Text>
              </View>
              {formData.discountPercent && formData.discountPercent > 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}
                  >
                    Discount ({formData.discountPercent}%)
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ba9988",
                    }}
                  >
                    -${formData.savings?.toLocaleString()}
                  </Text>
                </View>
              )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 16,
                  paddingTop: 16,
                  borderTopWidth: 1,
                  borderTopColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: "700", color: "#ffffff" }}
                >
                  Total
                </Text>
                <Text
                  style={{ fontSize: 18, fontWeight: "700", color: "#ba9988" }}
                >
                  ${formData.usdPrice.toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Non-Refundable Disclaimer */}
            <View
              style={{
                backgroundColor: "rgba(255, 152, 0, 0.1)",
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: "rgba(255, 152, 0, 0.3)",
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <MaterialIcons
                name="info"
                size={20}
                color="#ff9800"
                style={{ marginTop: 2 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 4,
                  }}
                >
                  Non-Refundable Purchase
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 18,
                  }}
                >
                  BLKD purchases are final and non-refundable. BLKD can be used
                  to pay pay and shop on the BDN platform and get discounts when
                  buying larger amounts.
                </Text>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isProcessing}
              style={{
                backgroundColor: isProcessing ? "#666666" : "#ba9988",
                borderRadius: 12,
                padding: 18,
                alignItems: "center",
                opacity: isProcessing ? 0.6 : 1,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#ffffff",
                }}
              >
                {isProcessing
                  ? "Processing..."
                  : `Purchase ${formData.blkdAmount.toLocaleString()} BLKD`}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}
