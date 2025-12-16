import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TokenCertificate } from "./TokenCertificate";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";

interface CertificateModalProps {
  visible: boolean;
  totalTokens: number;
  onClose: () => void;
  onDownload: () => void;
}

export function CertificateModal({
  visible,
  totalTokens,
  onClose,
  onDownload,
}: CertificateModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      accessible={true}
      accessibilityLabel="Token certificate modal"
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Token Certificate</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Close certificate modal"
            >
              <MaterialIcons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.certificateContainer}>
              <TokenCertificate
                totalTokens={totalTokens}
                width={400}
                height={280}
                isLarge={true}
              />
            </View>

            <Text style={styles.description}>
              This certificate documents your total token holdings. Each token purchase is recorded
              and accumulates to your total balance. Token purchases are non-refundable.
            </Text>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.cancelButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Close certificate"
            >
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onDownload}
              style={styles.downloadButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Download certificate as PDF"
            >
              <MaterialIcons name="download" size={20} color={colors.text.primary} />
              <Text style={styles.downloadButtonText}>Download PDF</Text>
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
    width: "100%",
    maxWidth: 600,
    maxHeight: "90%",
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  scrollContent: {
    padding: spacing.xl,
  },
  certificateContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
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
  downloadButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
  },
  downloadButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
});

