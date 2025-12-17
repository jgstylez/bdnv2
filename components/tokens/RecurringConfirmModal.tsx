import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { TOKEN_PRICE } from '../../types/token';

interface RecurringConfirmModalProps {
  visible: boolean;
  tokenAmount: string;
  frequency: "weekly" | "monthly" | "bi-monthly" | "quarterly" | "annually";
  onConfirm: () => void;
  onCancel: () => void;
  getFrequencyLabel: (frequency: string) => string;
}

export function RecurringConfirmModal({
  visible,
  tokenAmount,
  frequency,
  onConfirm,
  onCancel,
  getFrequencyLabel,
}: RecurringConfirmModalProps) {
  const tokens = parseInt(tokenAmount) || 1;
  const costPerPurchase = tokens * TOKEN_PRICE;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
      accessible={true}
      accessibilityLabel="Confirm recurring purchase modal"
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Confirm Recurring Purchase</Text>
          
          <Text style={styles.subtitle}>
            You're about to set up a recurring purchase that will automatically charge your payment method.
          </Text>

          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tokens per Purchase</Text>
              <Text style={styles.detailValue}>{tokens} Tokens</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Frequency</Text>
              <Text style={styles.detailValue}>{getFrequencyLabel(frequency)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cost per Purchase</Text>
              <Text style={styles.detailValue}>${costPerPurchase.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onCancel}
              style={styles.cancelButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Cancel recurring purchase setup"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={styles.confirmButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Confirm recurring purchase setup"
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.secondary.bg,
    borderRadius: borderRadius.xl,
    padding: spacing["2xl"],
    width: "100%",
    maxWidth: 500,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    lineHeight: typography.lineHeight.relaxed,
  },
  details: {
    backgroundColor: colors.primary.bg,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
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
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.primary.bg,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  cancelButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
});

