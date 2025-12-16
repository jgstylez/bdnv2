/**
 * Payment Method Selector Component
 * 
 * Displays available payment methods and allows selection
 * Includes BLKD token application option
 */

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Wallet, BankAccountWallet, CreditCardWallet } from "../../types/wallet";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";
import { formatCurrency } from "../../lib/international";

interface PaymentMethodSelectorProps {
  wallets: Wallet[];
  selectedWalletId: string | null;
  onSelectWallet: (walletId: string) => void;
  totalAmount: number;
  currency: string;
  blkdBalance?: number;
  useBLKD: boolean;
  onToggleBLKD: (use: boolean) => void;
  onAddPaymentMethod?: () => void;
}

export function PaymentMethodSelector({
  wallets,
  selectedWalletId,
  onSelectWallet,
  totalAmount,
  currency,
  blkdBalance = 0,
  useBLKD,
  onToggleBLKD,
  onAddPaymentMethod,
}: PaymentMethodSelectorProps) {
  // Get all wallets (exclude BLKD/myimpact wallet from main list)
  const allPaymentWallets = wallets.filter((w) => w.type !== "myimpact");
  
  // Filter wallets that match currency and can cover the amount
  const paymentWallets = allPaymentWallets.filter(
    (w) => w.currency === currency && (w.availableBalance || w.balance) >= totalAmount
  );

  // Get BLKD wallet separately
  const blkdWallet = wallets.find((w) => w.type === "myimpact" && w.currency === "BLKD");

  const getWalletIcon = (type: string) => {
    switch (type) {
      case "creditcard":
        return "credit-card";
      case "bankaccount":
        return "account-balance";
      case "primary":
        return "account-balance-wallet";
      default:
        return "account-balance-wallet";
    }
  };

  const getWalletDisplayName = (wallet: Wallet) => {
    if (wallet.type === "creditcard") {
      const ccWallet = wallet as CreditCardWallet;
      return `${ccWallet.cardBrand} •••• ${ccWallet.last4}`;
    }
    if (wallet.type === "bankaccount") {
      const baWallet = wallet as BankAccountWallet;
      return `${baWallet.bankName} •••• ${baWallet.last4}`;
    }
    return wallet.name;
  };

  // Calculate how much BLKD can cover
  const blkdCoverage = useBLKD && blkdBalance > 0 ? Math.min(blkdBalance, totalAmount) : 0;
  const remainingAfterBLKD = totalAmount - blkdCoverage;

  return (
    <View style={{ gap: spacing.lg }}>
      {/* Payment Method Selection */}
      <View>
        <Text
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.primary,
            marginBottom: spacing.md,
          }}
        >
          Payment Method
        </Text>

        {/* Show "No Payment Methods Available" message if none can cover the amount */}
        {paymentWallets.length === 0 && allPaymentWallets.length === 0 && (
          <View
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.md,
              padding: spacing.xl,
              borderWidth: 1,
              borderColor: colors.border.light,
              alignItems: "center",
              marginBottom: spacing.md,
            }}
          >
            <MaterialIcons name="payment" size={48} color={colors.text.tertiary} />
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
                marginTop: spacing.md,
                marginBottom: spacing.xs,
              }}
            >
              No Payment Methods Available
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginBottom: spacing.md,
                textAlign: "center",
              }}
            >
              {remainingAfterBLKD > 0
                ? `You need ${formatCurrency(remainingAfterBLKD, currency)} to complete this order.`
                : "Please add a payment method to continue."}
            </Text>
            {onAddPaymentMethod && (
              <TouchableOpacity
                onPress={onAddPaymentMethod}
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
                    fontWeight: typography.fontWeight.bold,
                    color: colors.text.primary,
                  }}
                >
                  Add Payment Method
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Show warning message if wallets exist but none can cover the amount */}
        {paymentWallets.length === 0 && allPaymentWallets.length > 0 && (
          <View
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              borderWidth: 1,
              borderColor: colors.border.light,
              marginBottom: spacing.md,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs, marginBottom: spacing.xs }}>
              <MaterialIcons name="info" size={20} color={colors.status.warning} />
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.primary,
                }}
              >
                No Payment Methods Available
              </Text>
            </View>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
              }}
            >
              {remainingAfterBLKD > 0
                ? `You need ${formatCurrency(remainingAfterBLKD, currency)} to complete this order.`
                : "Please add a payment method to continue."}
            </Text>
          </View>
        )}

        {/* Display all payment wallets */}
        {allPaymentWallets.length > 0 && (
          <View style={{ gap: spacing.md }}>
            {allPaymentWallets.map((wallet) => {
              const balance = wallet.availableBalance || wallet.balance;
              const isSelected = selectedWalletId === wallet.id;
              const isDefault = wallet.isDefault;
              const matchesCurrency = wallet.currency === currency;
              const canCoverRemaining = matchesCurrency && balance >= remainingAfterBLKD;

              return (
                <TouchableOpacity
                  key={wallet.id}
                  onPress={() => onSelectWallet(wallet.id)}
                  disabled={!canCoverRemaining}
                  style={{
                    backgroundColor: isSelected ? colors.accent : colors.secondary.bg,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    borderWidth: 2,
                    borderColor: isSelected ? colors.accent : colors.border.light,
                    opacity: canCoverRemaining ? 1 : 0.5,
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
                      backgroundColor: isSelected ? "rgba(255, 255, 255, 0.2)" : "rgba(186, 153, 136, 0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons
                      name={getWalletIcon(wallet.type) as any}
                      size={24}
                      color={isSelected ? colors.text.primary : colors.accent}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs, marginBottom: spacing.xs }}>
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.bold,
                          color: isSelected ? colors.text.primary : colors.text.primary,
                        }}
                      >
                        {getWalletDisplayName(wallet)}
                      </Text>
                      {isDefault && (
                        <View
                          style={{
                            backgroundColor: isSelected ? "rgba(255, 255, 255, 0.2)" : colors.accentLight,
                            paddingHorizontal: spacing.xs,
                            paddingVertical: 2,
                            borderRadius: borderRadius.sm,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: typography.fontSize.xs,
                              fontWeight: typography.fontWeight.bold,
                              color: isSelected ? colors.text.primary : colors.accent,
                            }}
                          >
                            DEFAULT
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: isSelected ? "rgba(255, 255, 255, 0.8)" : colors.text.secondary,
                      }}
                    >
                      Balance: {formatCurrency(balance, wallet.currency)}
                    </Text>
                    {!matchesCurrency && (
                      <Text
                        style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.status.error,
                          marginTop: spacing.xs,
                        }}
                      >
                        Currency mismatch (need {currency})
                      </Text>
                    )}
                    {matchesCurrency && !canCoverRemaining && (
                      <Text
                        style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.status.error,
                          marginTop: spacing.xs,
                        }}
                      >
                        Insufficient balance (need {formatCurrency(remainingAfterBLKD, currency)})
                      </Text>
                    )}
                  </View>
                  {isSelected && (
                    <MaterialIcons name="check-circle" size={24} color={colors.text.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {onAddPaymentMethod && allPaymentWallets.length > 0 && (
          <TouchableOpacity
            onPress={onAddPaymentMethod}
            style={{
              marginTop: spacing.md,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: spacing.xs,
              paddingVertical: spacing.md,
            }}
          >
            <MaterialIcons name="add" size={20} color={colors.accent} />
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.accent,
              }}
            >
              Add Another Payment Method
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* BLKD Token Application */}
      {blkdWallet && blkdBalance > 0 && (
        <View
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            borderWidth: 1,
            borderColor: useBLKD ? colors.accent : colors.border.light,
          }}
        >
          <TouchableOpacity
            onPress={() => onToggleBLKD(!useBLKD)}
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
                borderColor: useBLKD ? colors.accent : colors.border.light,
                backgroundColor: useBLKD ? colors.accent : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {useBLKD && <MaterialIcons name="check" size={16} color={colors.text.primary} />}
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs, marginBottom: spacing.xs }}>
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
                  marginBottom: spacing.xs,
                }}
              >
                Available: {formatCurrency(blkdBalance, "BLKD")}
              </Text>
              {useBLKD && blkdCoverage > 0 && (
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.accent,
                    fontWeight: typography.fontWeight.semibold,
                  }}
                >
                  {blkdCoverage >= totalAmount
                    ? `Covering full amount (${formatCurrency(blkdCoverage, "BLKD")})`
                    : `Covering ${formatCurrency(blkdCoverage, "BLKD")}, ${formatCurrency(remainingAfterBLKD, currency)} remaining`}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

