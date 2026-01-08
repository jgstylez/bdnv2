import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

interface TokenBalanceCardProps {
  totalTokens: number;
  onViewCertificate: () => void;
  onDownloadCertificate: () => void;
  isMobile?: boolean;
}

export function TokenBalanceCard({
  totalTokens,
  onViewCertificate,
  onDownloadCertificate,
  isMobile = false,
}: TokenBalanceCardProps) {
  return (
    <View
      style={[
        styles.container,
        isMobile && styles.mobileContainer,
      ]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`Total tokens you hold: ${totalTokens}`}
    >
      <Text style={styles.label}>Total Tokens You Hold</Text>
      <Text style={[styles.amount, isMobile && styles.mobileAmount]}>
        {totalTokens}
      </Text>
      <Text style={styles.date}>
        as of {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </Text>

      <View style={[styles.actions, isMobile && styles.mobileActions]}>
        <TouchableOpacity
          onPress={onViewCertificate}
          style={[styles.viewButton, isMobile && styles.mobileButton]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="View Certificate"
          accessibilityHint="View your certificate of token holdings"
        >
          <MaterialIcons name="visibility" size={isMobile ? 18 : typography.fontSize.xl} color={colors.accent} />
          <Text style={[styles.buttonText, isMobile && styles.mobileButtonText]}>View Certificate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDownloadCertificate}
          style={[styles.downloadButton, isMobile && styles.mobileButton]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Download Certificate"
          accessibilityHint="Download your certificate of token holdings as a PDF"
        >
          <MaterialIcons name="download" size={isMobile ? 18 : typography.fontSize.xl} color={colors.text.primary} />
          <Text style={[styles.buttonText, styles.downloadButtonText, isMobile && styles.mobileButtonText]}>Download</Text>
        </TouchableOpacity>
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
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  mobileContainer: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  label: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  amount: {
    fontSize: 48,
    fontWeight: "800",
    color: colors.textColors.accent,
    letterSpacing: -1,
  },
  mobileAmount: {
    fontSize: 36,
  },
  date: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing["2xl"],
    width: "100%",
  },
  mobileActions: {
    flexDirection: "column",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  viewButton: {
    backgroundColor: colors.background.input,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    flex: 1,
  },
  downloadButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    flex: 1,
  },
  mobileButton: {
    width: "100%",
    paddingVertical: spacing.md,
  },
  buttonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  mobileButtonText: {
    fontSize: typography.fontSize.sm,
  },
  downloadButtonText: {
    color: colors.text.primary,
  },
});

