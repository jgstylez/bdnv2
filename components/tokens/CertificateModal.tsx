import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TokenCertificate } from "./TokenCertificate";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

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
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isMobile = windowWidth < 768;

  // Keep certificate aspect ratio aligned with the SVG viewBox (200x140 => 1.428:1)
  const overlayPadding = isMobile ? spacing.md : spacing.lg;
  const maxCertWidth = Math.min(isMobile ? windowWidth - overlayPadding * 2 : 520, windowWidth - overlayPadding * 2);
  const certWidth = Math.max(260, Math.min(maxCertWidth, 520));
  const certHeight = Math.round(certWidth * 0.7);
  const useLargeCert = certWidth >= 360;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      accessible={true}
      accessibilityLabel="Token certificate modal"
    >
      <View style={[styles.overlay, { padding: overlayPadding }]}>
        <View style={[styles.modalContent, isMobile && { maxHeight: Math.min(windowHeight * 0.92, 760) }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Token Certificate</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Close certificate modal"
            >
              <MaterialIcons name="close" size={20} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.certificateContainer}>
              <TokenCertificate
                totalTokens={totalTokens}
                width={certWidth}
                height={certHeight}
                isLarge={useLargeCert}
              />
            </View>

            {!isMobile && (
              <Text style={styles.description}>
              This certificate documents your total token holdings. Each token purchase is recorded
              and accumulates to your total balance. Token purchases are non-refundable.
              </Text>
            )}
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
              <MaterialIcons name="download" size={18} color={colors.text.primary} />
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
    padding: spacing.lg,
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  certificateContainer: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  description: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  cancelButton: {
    backgroundColor: colors.primary.bg,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  cancelButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  downloadButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
});

