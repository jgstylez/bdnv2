import React from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";
import { TOKEN_PRICE } from "../../types/token";

interface TokenPurchaseFormProps {
  purchaseType: "one-time" | "recurring";
  tokenAmount: string;
  recurringFrequency: "weekly" | "monthly" | "bi-monthly" | "quarterly" | "annually";
  isMobile: boolean;
  onPurchaseTypeChange: (type: "one-time" | "recurring") => void;
  onTokenAmountChange: (amount: string) => void;
  onRecurringFrequencyChange: (frequency: "weekly" | "monthly" | "bi-monthly" | "quarterly" | "annually") => void;
  onPurchase: () => void;
  onSetupRecurring: () => void;
}

const getFrequencyLabel = (frequency: string) => {
  const labels: Record<string, string> = {
    "weekly": "Weekly",
    "monthly": "Monthly",
    "bi-monthly": "Bi-monthly",
    "quarterly": "Quarterly",
    "annually": "Annually",
  };
  return labels[frequency] || frequency.charAt(0).toUpperCase() + frequency.slice(1);
};

export function TokenPurchaseForm({
  purchaseType,
  tokenAmount,
  recurringFrequency,
  isMobile,
  onPurchaseTypeChange,
  onTokenAmountChange,
  onRecurringFrequencyChange,
  onPurchase,
  onSetupRecurring,
}: TokenPurchaseFormProps) {
  const presetAmounts = [1, 5, 10, 25, 50, 100];
  const frequencies = [
    { value: "weekly" as const, label: "Weekly" },
    { value: "monthly" as const, label: "Monthly" },
    { value: "bi-monthly" as const, label: "Bi-monthly" },
    { value: "quarterly" as const, label: "Quarterly" },
    { value: "annually" as const, label: "Annually" },
  ];

  const selectedTokens = parseInt(tokenAmount) || (purchaseType === "recurring" ? 1 : 0);
  const totalPrice = selectedTokens * TOKEN_PRICE;
  const isDisabled = purchaseType === "recurring"
    ? !tokenAmount || parseInt(tokenAmount) < 1
    : !tokenAmount || parseInt(tokenAmount) <= 0;

  return (
    <View>
      {/* Purchase Type Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Purchase Type</Text>
        <View style={styles.typeContainer}>
          <TouchableOpacity
            onPress={() => onPurchaseTypeChange("recurring")}
            style={[
              styles.typeCard,
              purchaseType === "recurring" && styles.typeCardActive,
            ]}
            accessible={true}
            accessibilityRole="button"
            accessibilityState={{ selected: purchaseType === "recurring" }}
            accessibilityLabel="Recurring purchase, auto-renewal"
          >
            <MaterialIcons
              name="repeat"
              size={32}
              color={purchaseType === "recurring" ? colors.text.primary : colors.accent}
            />
            <Text style={[styles.typeLabel, purchaseType === "recurring" && styles.typeLabelActive]}>
              Recurring
            </Text>
            <Text style={[styles.typeSubtext, purchaseType === "recurring" && styles.typeSubtextActive]}>
              Auto-renewal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onPurchaseTypeChange("one-time")}
            style={[
              styles.typeCard,
              purchaseType === "one-time" && styles.typeCardActive,
            ]}
            accessible={true}
            accessibilityRole="button"
            accessibilityState={{ selected: purchaseType === "one-time" }}
            accessibilityLabel="One-time purchase, single purchase"
          >
            <MaterialIcons
              name="shopping-cart"
              size={32}
              color={purchaseType === "one-time" ? colors.text.primary : colors.accent}
            />
            <Text style={[styles.typeLabel, purchaseType === "one-time" && styles.typeLabelActive]}>
              One-time
            </Text>
            <Text style={[styles.typeSubtext, purchaseType === "one-time" && styles.typeSubtextActive]}>
              Single purchase
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Amount Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Amount</Text>
        <Text style={styles.sectionSubtext}>Select a preset amount or enter a custom amount</Text>
        
        {/* Preset Amount Cards */}
        <View style={styles.presetContainer}>
          {presetAmounts.map((amount) => {
            const selected = tokenAmount === amount.toString();
            const totalPrice = amount * TOKEN_PRICE;
            return (
              <TouchableOpacity
                key={amount}
                onPress={() => onTokenAmountChange(amount.toString())}
                style={[
                  styles.presetCard,
                  isMobile && styles.presetCardMobile,
                  selected && styles.presetCardActive,
                ]}
                accessible={true}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`${amount} tokens for $${totalPrice.toFixed(2)}`}
              >
                <Text style={styles.presetAmount}>{amount} Token{amount !== 1 ? "s" : ""}</Text>
                <Text style={[styles.presetPrice, selected && styles.presetPriceActive]}>
                  ${totalPrice.toFixed(2)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom Amount */}
        <View>
          <Text style={styles.customLabel}>Or enter custom amount</Text>
          <TextInput
            value={tokenAmount}
            onChangeText={(text) => {
              const num = parseInt(text) || 0;
              if (purchaseType === "recurring" && num < 1 && text !== "") {
                onTokenAmountChange("1");
              } else {
                onTokenAmountChange(text);
              }
            }}
            keyboardType="number-pad"
            placeholder={purchaseType === "recurring" ? "Enter amount (min 1)" : "Enter custom amount"}
            placeholderTextColor={colors.text.placeholder}
            style={styles.customInput}
            accessible={true}
            accessibilityLabel="Custom token amount input"
            accessibilityHint={purchaseType === "recurring" ? "Enter at least 1 token" : "Enter custom amount"}
          />
        </View>
      </View>

      {/* Frequency Selection (only for recurring) */}
      {purchaseType === "recurring" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequency</Text>
          <Text style={styles.sectionSubtext}>How often should tokens be purchased?</Text>
          <View style={styles.frequencyContainer}>
            {frequencies.map((freq) => (
              <TouchableOpacity
                key={freq.value}
                onPress={() => onRecurringFrequencyChange(freq.value)}
                style={[
                  styles.frequencyButton,
                  recurringFrequency === freq.value && styles.frequencyButtonActive,
                ]}
                accessible={true}
                accessibilityRole="button"
                accessibilityState={{ selected: recurringFrequency === freq.value }}
                accessibilityLabel={`${freq.label} frequency`}
              >
                <Text style={styles.frequencyText}>{freq.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tokens</Text>
          <Text style={styles.summaryValue}>{selectedTokens}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Price per Token</Text>
          <Text style={styles.summaryValue}>${TOKEN_PRICE.toFixed(2)}</Text>
        </View>
        {purchaseType === "recurring" && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Frequency</Text>
            <Text style={styles.summaryValue}>{getFrequencyLabel(recurringFrequency)}</Text>
          </View>
        )}
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotalLabel}>
            {purchaseType === "recurring" ? "Total per Purchase" : "Total"}
          </Text>
          <Text style={styles.summaryTotalValue}>${totalPrice.toFixed(2)}</Text>
        </View>
      </View>

      {/* Non-Refundable Disclaimer */}
      <View style={styles.disclaimer}>
        <MaterialIcons name="info" size={16} color={colors.status.warning} />
        <Text style={styles.disclaimerText}>
          Token purchases are final and non-refundable. Upon completion, you will receive a certificate documenting your token holdings.
        </Text>
      </View>

      {/* Purchase Button */}
      <TouchableOpacity
        onPress={purchaseType === "recurring" ? onSetupRecurring : onPurchase}
        disabled={isDisabled}
        style={[styles.purchaseButton, isDisabled && styles.purchaseButtonDisabled]}
        accessible={true}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        accessibilityLabel={purchaseType === "recurring" ? "Set up recurring purchase" : "Make one-time purchase"}
      >
        <Text style={[styles.purchaseButtonText, isDisabled && styles.purchaseButtonTextDisabled]}>
          {purchaseType === "recurring" ? "Set Up Recurring Purchase" : "Make One-Time Purchase"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing["2xl"],
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  sectionSubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
  },
  typeContainer: {
    flexDirection: "row",
    gap: spacing.md,
  },
  typeCard: {
    flex: 1,
    backgroundColor: colors.secondary.bg,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: "center",
  },
  typeCardActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  typeLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  typeLabelActive: {
    color: colors.text.primary,
  },
  typeSubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  typeSubtextActive: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  presetContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  presetCard: {
    flex: 1,
    minWidth: "48%",
    backgroundColor: colors.secondary.bg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  presetCardMobile: {
    minWidth: "48%",
  },
  presetCardActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  presetAmount: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  presetPrice: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent,
    textAlign: "center",
  },
  presetPriceActive: {
    color: colors.text.primary,
  },
  customLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
  },
  customInput: {
    backgroundColor: colors.secondary.bg,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  frequencyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  frequencyButton: {
    backgroundColor: colors.secondary.bg,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  frequencyButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  frequencyText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  summary: {
    backgroundColor: colors.secondary.bg,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing["2xl"],
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.md,
  },
  summaryTotalLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  summaryTotalValue: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.accent,
  },
  disclaimer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 152, 0, 0.1)",
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing["2xl"],
    borderWidth: 1,
    borderColor: "rgba(255, 152, 0, 0.2)",
    gap: spacing.sm,
  },
  disclaimerText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.normal,
  },
  purchaseButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  purchaseButtonDisabled: {
    backgroundColor: "rgba(186, 153, 136, 0.3)",
  },
  purchaseButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  purchaseButtonTextDisabled: {
    color: "rgba(255, 255, 255, 0.5)",
  },
});

