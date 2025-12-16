import React from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { RecurringPurchase } from "../../types/token";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";

interface RecurringPurchaseManagerProps {
  recurringPurchase: RecurringPurchase | null;
  isEditing: boolean;
  editTokens: string;
  editFrequency: "weekly" | "monthly" | "bi-monthly" | "quarterly" | "annually";
  isMobile: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onPause: () => void;
  onResume: () => void;
  onCancelPurchase: () => void;
  onTokensChange: (tokens: string) => void;
  onFrequencyChange: (frequency: "weekly" | "monthly" | "bi-monthly" | "quarterly" | "annually") => void;
  getFrequencyLabel: (frequency: string) => string;
  getPaymentMethodDisplay: (paymentMethodId: string) => string;
}

export function RecurringPurchaseManager({
  recurringPurchase,
  isEditing,
  editTokens,
  editFrequency,
  isMobile,
  onEdit,
  onSave,
  onCancel,
  onPause,
  onResume,
  onCancelPurchase,
  onTokensChange,
  onFrequencyChange,
  getFrequencyLabel,
  getPaymentMethodDisplay,
}: RecurringPurchaseManagerProps) {
  const presetAmounts = [1, 5, 10, 25, 50, 100];
  const frequencies = [
    { value: "weekly" as const, label: "Weekly" },
    { value: "monthly" as const, label: "Monthly" },
    { value: "bi-monthly" as const, label: "Bi-monthly" },
    { value: "quarterly" as const, label: "Quarterly" },
  ];

  if (!recurringPurchase) {
    return (
      <View style={styles.emptyState}>
        <MaterialIcons name="repeat" size={48} color="rgba(186, 153, 136, 0.5)" />
        <Text style={styles.emptyStateText}>No active recurring purchases</Text>
      </View>
    );
  }

  if (isEditing) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Edit Recurring Purchase</Text>
        
        {/* Token Amount Selection */}
        <View style={styles.editSection}>
          <Text style={styles.editLabel}>Tokens per Purchase</Text>
          <View style={styles.presetContainer}>
            {presetAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                onPress={() => onTokensChange(amount.toString())}
                style={[
                  styles.presetButton,
                  editTokens === amount.toString() && styles.presetButtonActive,
                ]}
                accessible={true}
                accessibilityRole="button"
                accessibilityState={{ selected: editTokens === amount.toString() }}
                accessibilityLabel={`${amount} tokens`}
              >
                <Text style={styles.presetButtonText}>{amount}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            value={editTokens}
            onChangeText={(text) => {
              const num = parseInt(text) || 0;
              if (num >= 1) {
                onTokensChange(text);
              } else if (text === "" || text === "0") {
                onTokensChange("1");
              }
            }}
            keyboardType="number-pad"
            placeholder="Enter amount (min 1)"
            placeholderTextColor={colors.text.placeholder}
            style={styles.editInput}
            accessible={true}
            accessibilityLabel="Edit token amount input"
            accessibilityHint="Enter at least 1 token"
          />
        </View>

        {/* Frequency Selection */}
        <View style={styles.editSection}>
          <Text style={styles.editLabel}>Frequency</Text>
          <View style={styles.frequencyContainer}>
            {frequencies.map((freq) => (
              <TouchableOpacity
                key={freq.value}
                onPress={() => onFrequencyChange(freq.value)}
                style={[
                  styles.frequencyButton,
                  editFrequency === freq.value && styles.frequencyButtonActive,
                ]}
                accessible={true}
                accessibilityRole="button"
                accessibilityState={{ selected: editFrequency === freq.value }}
                accessibilityLabel={`${freq.label} frequency`}
              >
                <Text style={styles.frequencyText}>{freq.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.editActions}>
          <TouchableOpacity
            onPress={onCancel}
            style={styles.cancelButton}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Cancel editing"
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSave}
            style={styles.saveButton}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Save changes"
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{recurringPurchase.tokensPerPurchase} Tokens</Text>
          <Text style={styles.subtitle}>
            {getFrequencyLabel(recurringPurchase.frequency)} • {getPaymentMethodDisplay(recurringPurchase.paymentMethodId)}
          </Text>
        </View>
        <View style={[styles.statusBadge, recurringPurchase.isActive && styles.statusBadgeActive]}>
          <Text style={styles.statusText}>{recurringPurchase.isActive ? "Active" : "Paused"}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Next Purchase</Text>
          <Text style={styles.detailValue}>
            {new Date(recurringPurchase.nextPurchaseDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Cost per Purchase</Text>
          <Text style={styles.detailValue}>
            ${(recurringPurchase.tokensPerPurchase * 15).toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        {recurringPurchase.isActive ? (
          <>
            <TouchableOpacity
              onPress={onEdit}
              style={styles.actionButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Edit recurring purchase"
            >
              <MaterialIcons name="edit" size={18} color={colors.accent} />
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onPause}
              style={styles.actionButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Pause recurring purchase"
            >
              <MaterialIcons name="pause" size={18} color={colors.accent} />
              <Text style={styles.actionButtonText}>Pause</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onCancelPurchase}
              style={[styles.actionButton, styles.cancelActionButton]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Cancel recurring purchase"
            >
              <MaterialIcons name="cancel" size={18} color={colors.status.error} />
              <Text style={[styles.actionButtonText, styles.cancelActionText]}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={onResume}
            style={styles.resumeButton}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Resume recurring purchase"
          >
            <MaterialIcons name="play-arrow" size={18} color={colors.text.primary} />
            <Text style={styles.resumeButtonText}>Resume</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary.bg,
    borderRadius: borderRadius.lg,
    padding: spacing["2xl"],
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing["3xl"],
  },
  emptyState: {
    backgroundColor: colors.secondary.bg,
    borderRadius: borderRadius.lg,
    padding: spacing["4xl"],
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  emptyStateText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.tertiary,
    textAlign: "center",
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  statusBadge: {
    backgroundColor: colors.status.warningLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusBadgeActive: {
    backgroundColor: colors.status.successLight,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    textTransform: "uppercase",
  },
  details: {
    marginBottom: spacing.xl,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  detailLabel: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  detailValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.primary.bg,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  actionButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent,
  },
  cancelActionButton: {
    borderColor: colors.status.errorLight,
  },
  cancelActionText: {
    color: colors.status.error,
  },
  resumeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flex: 1,
  },
  resumeButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  editSection: {
    marginBottom: spacing.xl,
  },
  editLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  presetContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  presetButton: {
    backgroundColor: colors.primary.bg,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  presetButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  presetButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  editInput: {
    backgroundColor: colors.primary.bg,
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
    backgroundColor: colors.primary.bg,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    flex: 1,
    minWidth: "30%",
  },
  frequencyButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  frequencyText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    textAlign: "center",
  },
  editActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.primary.bg,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  cancelButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
});

