import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { TOKEN_PRICE } from '../../types/token';

interface OneTimePurchaseConfirmModalProps {
  visible: boolean;
  tokenAmount: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function OneTimePurchaseConfirmModal({
  visible,
  tokenAmount,
  onConfirm,
  onCancel,
}: OneTimePurchaseConfirmModalProps) {
  const tokens = parseInt(tokenAmount) || 0;
  const totalCost = tokens * TOKEN_PRICE;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
      accessible={true}
      accessibilityLabel="Confirm one-time purchase modal"
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onCancel}
      >
        <TouchableOpacity 
          style={styles.modalContent}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Confirm Token Purchase</Text>
            <TouchableOpacity
              onPress={onCancel}
              style={styles.closeButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Close modal"
            >
              <MaterialIcons name="close" size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.subtitle}>
            You're about to purchase tokens. This is a one-time purchase that will be charged immediately.
          </Text>

          <View style={styles.details}>
            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <MaterialIcons name="shopping-cart" size={18} color={colors.accent} />
                <Text style={styles.detailLabel}>Tokens</Text>
              </View>
              <Text style={styles.detailValue}>{tokens} Token{tokens !== 1 ? "s" : ""}</Text>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <MaterialIcons name="attach-money" size={18} color={colors.accent} />
                <Text style={styles.detailLabel}>Price per Token</Text>
              </View>
              <Text style={styles.detailValue}>${TOKEN_PRICE.toFixed(2)}</Text>
            </View>
            <View style={[styles.detailRow, styles.lastDetailRow]}>
              <View style={styles.detailLabelContainer}>
                <MaterialIcons name="receipt" size={18} color={colors.accent} />
                <Text style={styles.detailLabel}>Total Cost</Text>
              </View>
              <Text style={styles.detailValueHighlight}>${totalCost.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.warningBox}>
            <MaterialIcons name="info" size={20} color="#ff9800" />
            <Text style={styles.warningText}>
              Token purchases are final and non-refundable. You will receive a certificate documenting your purchase.
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onCancel}
              style={styles.cancelButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Cancel purchase"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={styles.confirmButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Confirm purchase"
            >
              <Text style={styles.confirmButtonText}>Confirm Purchase</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
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
    borderWidth: 2,
    borderColor: colors.border.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    flex: 1,
  },
  closeButton: {
    padding: spacing.xs,
    marginLeft: spacing.md,
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
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(186, 153, 136, 0.2)",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
    paddingVertical: spacing.xs,
  },
  lastDetailRow: {
    marginBottom: 0,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "rgba(186, 153, 136, 0.1)",
    marginTop: spacing.sm,
  },
  detailLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    flex: 1,
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
  detailValueHighlight: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent,
  },
  warningBox: {
    backgroundColor: "rgba(255, 152, 0, 0.1)",
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: "rgba(255, 152, 0, 0.3)",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  warningText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: typography.lineHeight.relaxed,
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
    borderWidth: 2,
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
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: "#ffffff",
  },
});
