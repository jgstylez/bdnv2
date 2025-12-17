import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput, Platform, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { PayItForward } from '../../types/nonprofit';
import { Currency, Wallet } from '../../types/wallet';
import { PaymentMethodSelector } from "../checkout/PaymentMethodSelector";
import { PaymentKeypad } from "../PaymentKeypad";
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { formatCurrency } from '../../lib/international';
import { mockWallets } from '../../data/mocks/wallets';

type DonationStep = "amount" | "payment" | "review" | "processing" | "success" | null;
type DonationType = "one-time" | "recurring";
type RecurringFrequency = "weekly" | "bi-weekly" | "monthly" | "quarterly" | "annually";

interface DonationModuleProps {
  campaign: PayItForward;
  onDonationComplete?: (transactionId: string) => void;
}

// Preset donation amounts
const presetAmounts = [10, 25, 50, 100, 250, 500];

export function DonationModule({ campaign, onDonationComplete }: DonationModuleProps) {
  const [donationStep, setDonationStep] = useState<DonationStep>(null);
  const [donationAmount, setDonationAmount] = useState("0");
  const [donationCurrency, setDonationCurrency] = useState<Currency>("USD");
  const [donationType, setDonationType] = useState<DonationType>("one-time");
  const [recurringFrequency, setRecurringFrequency] = useState<RecurringFrequency>("monthly");
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [useBLKD, setUseBLKD] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [donationMessage, setDonationMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const numericAmount = parseFloat(donationAmount) || 0;
  const progress = campaign.targetAmount ? Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100) : 0;

  const availableWallets = mockWallets.filter(
    (w) => w.currency === donationCurrency && (w.availableBalance || w.balance) >= numericAmount
  );

  const blkdWallet = mockWallets.find((w) => w.type === "myimpact" && w.currency === "BLKD");
  const blkdBalance = blkdWallet?.balance || 0;
  const blkdCoverage = useBLKD && blkdBalance > 0 ? Math.min(blkdBalance, numericAmount) : 0;
  const remainingAfterBLKD = numericAmount - blkdCoverage;

  useEffect(() => {
    const defaultWallet = mockWallets.find((w) => w.isDefault && w.currency === donationCurrency);
    if (defaultWallet) {
      setSelectedWalletId(defaultWallet.id);
    }
  }, [donationCurrency]);

  const handlePresetAmount = (amount: number) => {
    setDonationAmount(amount.toString());
  };

  const getFrequencyLabel = (freq: RecurringFrequency) => {
    switch (freq) {
      case "weekly":
        return "Weekly";
      case "bi-weekly":
        return "Bi-weekly";
      case "monthly":
        return "Monthly";
      case "quarterly":
        return "Quarterly";
      case "annually":
        return "Annually";
      default:
        return "Monthly";
    }
  };

  const handleProceedDonation = () => {
    if (donationStep === "amount") {
      if (numericAmount <= 0) {
        alert("Please enter a valid amount");
        return;
      }
      if (availableWallets.length === 0 && (!useBLKD || blkdBalance < numericAmount)) {
        alert(`No ${donationCurrency} wallets with sufficient balance`);
        return;
      }
      setDonationStep("payment");
    } else if (donationStep === "payment") {
      if (!selectedWalletId && (!useBLKD || blkdBalance < numericAmount)) {
        alert("Please select a payment method");
        return;
      }
      setDonationStep("review");
    } else if (donationStep === "review") {
      handleProcessDonation();
    }
  };

  const handleProcessDonation = async () => {
    setDonationStep("processing");
    setIsProcessing(true);
    // TODO: Process donation via API
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const newTransactionId = `txn-${Date.now()}`;
    setTransactionId(newTransactionId);
    setIsProcessing(false);
    setDonationStep("success");
    if (onDonationComplete) {
      onDonationComplete(newTransactionId);
    }
  };

  const handleCloseDonation = () => {
    setDonationStep(null);
    setDonationAmount("0");
    setDonationCurrency("USD");
    setSelectedWalletId(null);
    setUseBLKD(false);
    setAnonymous(false);
    setDonationMessage("");
    setTransactionId(null);
  };

  const renderDonationModal = () => {
    if (!donationStep) return null;

    return (
      <Modal visible={donationStep !== null} transparent animationType="slide" onRequestClose={handleCloseDonation}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: colors.background.primary,
              borderTopLeftRadius: borderRadius.lg,
              borderTopRightRadius: borderRadius.lg,
              padding: spacing.lg,
              maxHeight: "90%",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.lg }}>
              <Text
                style={{
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                }}
              >
                {donationStep === "amount" && "Donate"}
                {donationStep === "payment" && "Payment Method"}
                {donationStep === "review" && "Review Donation"}
                {donationStep === "processing" && "Processing..."}
                {donationStep === "success" && "Thank You!"}
              </Text>
              {donationStep !== "processing" && donationStep !== "success" && (
                <TouchableOpacity onPress={handleCloseDonation}>
                  <MaterialIcons name="close" size={24} color={colors.text.primary} />
                </TouchableOpacity>
              )}
            </View>

            {donationStep === "amount" && (
              <ScrollView style={{ maxHeight: 600 }}>
                <View style={{ gap: spacing.lg }}>
                  <PaymentKeypad
                    value={donationAmount}
                    onValueChange={setDonationAmount}
                    currency={donationCurrency}
                  />

                  <TouchableOpacity
                    onPress={handleProceedDonation}
                    disabled={numericAmount <= 0}
                    style={{
                      backgroundColor: numericAmount > 0 ? colors.accent : colors.border.light,
                      padding: spacing.lg,
                      borderRadius: borderRadius.md,
                      alignItems: "center",
                      opacity: numericAmount > 0 ? 1 : 0.5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.lg,
                        fontWeight: typography.fontWeight.bold,
                        color: colors.text.primary,
                      }}
                    >
                      Continue
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}

            {donationStep === "payment" && (
              <ScrollView style={{ maxHeight: 600 }}>
                <View style={{ gap: spacing.lg }}>
                  <PaymentMethodSelector
                    wallets={mockWallets}
                    selectedWalletId={selectedWalletId}
                    onSelectWallet={setSelectedWalletId}
                    totalAmount={remainingAfterBLKD}
                    currency={donationCurrency}
                    blkdBalance={blkdBalance}
                    useBLKD={useBLKD}
                    onToggleBLKD={setUseBLKD}
                    onAddPaymentMethod={() => {}}
                  />

                  <View>
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.text.primary,
                        marginBottom: spacing.sm,
                      }}
                    >
                      Donation Message (Optional)
                    </Text>
                    <TextInput
                      value={donationMessage}
                      onChangeText={setDonationMessage}
                      placeholder="Leave a message of support..."
                      placeholderTextColor={colors.text.placeholder}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                      style={{
                        backgroundColor: colors.secondary.bg,
                        borderRadius: borderRadius.md,
                        padding: spacing.md,
                        fontSize: typography.fontSize.base,
                        color: colors.text.primary,
                        borderWidth: 1,
                        borderColor: colors.border.light,
                        minHeight: 80,
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={handleProceedDonation}
                    disabled={remainingAfterBLKD > 0 && !selectedWalletId && !useBLKD}
                    style={{
                      backgroundColor:
                        remainingAfterBLKD > 0 && !selectedWalletId && !useBLKD ? colors.border.light : colors.accent,
                      padding: spacing.lg,
                      borderRadius: borderRadius.md,
                      alignItems: "center",
                      opacity: remainingAfterBLKD > 0 && !selectedWalletId && !useBLKD ? 0.5 : 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.lg,
                        fontWeight: typography.fontWeight.bold,
                        color: colors.text.primary,
                      }}
                    >
                      Continue to Review
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}

            {donationStep === "review" && (
              <ScrollView style={{ maxHeight: 600 }}>
                <View style={{ gap: spacing.lg }}>
                  <View
                    style={{
                      backgroundColor: colors.secondary.bg,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.text.primary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      Campaign
                    </Text>
                    <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.sm }}>
                      {campaign.title}
                    </Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Amount</Text>
                      <Text
                        style={{
                          fontSize: typography.fontSize.lg,
                          fontWeight: typography.fontWeight.bold,
                          color: colors.accent,
                        }}
                      >
                        {formatCurrency(numericAmount, donationCurrency)}
                      </Text>
                    </View>
                    {donationType === "recurring" && (
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: spacing.xs }}>
                        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Frequency</Text>
                        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                          {getFrequencyLabel(recurringFrequency)}
                        </Text>
                      </View>
                    )}
                    {anonymous && (
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: spacing.xs }}>
                        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Anonymous</Text>
                        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>Yes</Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    onPress={handleProceedDonation}
                    style={{
                      backgroundColor: colors.accent,
                      padding: spacing.lg,
                      borderRadius: borderRadius.md,
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
                      Complete Donation
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}

            {donationStep === "processing" && (
              <View style={{ alignItems: "center", paddingVertical: spacing["2xl"] }}>
                <ActivityIndicator size="large" color={colors.accent} />
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.text.secondary,
                    marginTop: spacing.lg,
                  }}
                >
                  Processing your donation...
                </Text>
              </View>
            )}

            {donationStep === "success" && (
              <View style={{ alignItems: "center", paddingVertical: spacing["2xl"] }}>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: colors.accent,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: spacing.lg,
                  }}
                >
                  <MaterialIcons name="check" size={48} color={colors.text.primary} />
                </View>
                <Text
                  style={{
                    fontSize: typography.fontSize.xl,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.text.primary,
                    marginBottom: spacing.sm,
                    textAlign: "center",
                  }}
                >
                  Thank You!
                </Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.text.secondary,
                    marginBottom: spacing.lg,
                    textAlign: "center",
                  }}
                >
                  Your donation has been processed successfully.
                </Text>
                {transactionId && (
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                      marginBottom: spacing.lg,
                    }}
                  >
                    Transaction ID: {transactionId}
                  </Text>
                )}
                <TouchableOpacity
                  onPress={handleCloseDonation}
                  style={{
                    backgroundColor: colors.accent,
                    paddingHorizontal: spacing.xl,
                    paddingVertical: spacing.md,
                    borderRadius: borderRadius.md,
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.text.primary,
                    }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View
      style={{
        backgroundColor: colors.secondary.bg,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border.light,
        width: "100%",
      }}
    >
      {/* Progress Summary */}
      {campaign.targetAmount && (
        <View style={{ marginBottom: spacing.lg }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.sm }}>
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              {formatCurrency(campaign.currentAmount, campaign.currency)}
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.base,
                color: colors.text.secondary,
              }}
            >
              of {formatCurrency(campaign.targetAmount, campaign.currency)}
            </Text>
          </View>
          <View
            style={{
              height: 8,
              backgroundColor: colors.background.primary,
              borderRadius: borderRadius.sm,
              overflow: "hidden",
              marginBottom: spacing.sm,
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${progress}%`,
                backgroundColor: colors.accent,
              }}
            />
          </View>
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.tertiary,
            }}
          >
            {campaign.contributors} contributors
          </Text>
        </View>
      )}

      {/* Donation Type Toggle */}
      <View style={{ marginBottom: spacing.md }}>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: colors.background.primary,
            borderRadius: borderRadius.md,
            padding: 4,
          }}
        >
          {(["one-time", "recurring"] as DonationType[]).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setDonationType(type)}
              style={{
                flex: 1,
                backgroundColor: donationType === type ? colors.accent : "transparent",
                paddingVertical: spacing.sm,
                borderRadius: borderRadius.sm,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: donationType === type ? colors.text.primary : colors.text.secondary,
                  textTransform: "capitalize",
                }}
              >
                {type === "one-time" ? "One-Time" : "Recurring"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recurring Frequency (if recurring) */}
      {donationType === "recurring" && (
        <View style={{ marginBottom: spacing.md }}>
          <Text
            style={{
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.secondary,
              marginBottom: spacing.xs,
            }}
          >
            Frequency
          </Text>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.background.primary,
              borderRadius: borderRadius.md,
              padding: 4,
              gap: 4,
            }}
          >
            {(["weekly", "bi-weekly", "monthly", "quarterly", "annually"] as RecurringFrequency[]).map((freq) => (
              <TouchableOpacity
                key={freq}
                onPress={() => setRecurringFrequency(freq)}
                style={{
                  flex: 1,
                  backgroundColor: recurringFrequency === freq ? colors.accent : "transparent",
                  paddingVertical: spacing.xs,
                  borderRadius: borderRadius.sm,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.semibold,
                    color: recurringFrequency === freq ? colors.text.primary : colors.text.secondary,
                  }}
                  numberOfLines={1}
                >
                  {freq === "bi-weekly" ? "Bi-Wk" : freq === "annually" ? "Annual" : freq.charAt(0).toUpperCase() + freq.slice(1, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Preset Amounts */}
      <View style={{ marginBottom: spacing.md }}>
        <Text
          style={{
            fontSize: typography.fontSize.xs,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.secondary,
            marginBottom: spacing.xs,
          }}
        >
          Quick Select
        </Text>
        <View style={{ flexDirection: "row", gap: spacing.xs, flexWrap: "wrap" }}>
          {presetAmounts.map((amount) => (
            <TouchableOpacity
              key={amount}
              onPress={() => handlePresetAmount(amount)}
              style={{
                flex: 1,
                minWidth: "30%",
                paddingVertical: spacing.sm,
                borderRadius: borderRadius.md,
                backgroundColor: parseFloat(donationAmount) === amount ? colors.accent : colors.background.primary,
                borderWidth: 1,
                borderColor: parseFloat(donationAmount) === amount ? colors.accent : colors.border.light,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.semibold,
                  color: parseFloat(donationAmount) === amount ? colors.text.primary : colors.text.secondary,
                }}
              >
                {formatCurrency(amount, donationCurrency)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Custom Amount Input */}
      <View style={{ marginBottom: spacing.lg }}>
        <Text
          style={{
            fontSize: typography.fontSize.xs,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.secondary,
            marginBottom: spacing.xs,
          }}
        >
          Custom Amount
        </Text>
        <TouchableOpacity
          onPress={() => setDonationStep("amount")}
          style={{
            backgroundColor: colors.background.primary,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              textAlign: "center",
            }}
          >
            {formatCurrency(numericAmount || 0, donationCurrency)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Anonymous Donation Toggle */}
      <View style={{ marginBottom: spacing.lg }}>
        <TouchableOpacity
          onPress={() => setAnonymous(!anonymous)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: spacing.md,
            backgroundColor: "transparent",
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              borderWidth: 2,
              borderColor: anonymous ? colors.accent : colors.border.light,
              backgroundColor: anonymous ? colors.accent : "transparent",
              alignItems: "center",
              justifyContent: "center",
              marginRight: spacing.sm,
            }}
          >
            {anonymous && <MaterialIcons name="check" size={14} color={colors.text.primary} />}
          </View>
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.primary,
              fontWeight: typography.fontWeight.medium,
            }}
          >
            Make this donation anonymous
          </Text>
        </TouchableOpacity>
      </View>

      {/* Donate Button */}
      <TouchableOpacity
        onPress={() => {
          if (numericAmount > 0) {
            setDonationStep("payment");
          } else {
            setDonationStep("amount");
          }
        }}
        disabled={numericAmount <= 0}
        style={{
          backgroundColor: numericAmount > 0 ? colors.accent : colors.border.light,
          padding: spacing.lg,
          borderRadius: borderRadius.md,
          alignItems: "center",
          marginBottom: spacing.lg,
          opacity: numericAmount > 0 ? 1 : 0.5,
        }}
      >
        <Text
          style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
          }}
        >
          Donate Now
        </Text>
      </TouchableOpacity>

      {renderDonationModal()}
    </View>
  );
}

