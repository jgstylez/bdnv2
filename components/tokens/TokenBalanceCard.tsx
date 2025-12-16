import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";

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

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onViewCertificate}
          style={styles.viewButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="View Certificate"
          accessibilityHint="View your certificate of token holdings"
        >
          <MaterialIcons name="visibility" size={typography.fontSize.xl} color={colors.accent} />
          <Text style={styles.buttonText}>View Certificate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDownloadCertificate}
          style={styles.downloadButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Download Certificate"
          accessibilityHint="Download your certificate of token holdings as a PDF"
        >
          <MaterialIcons name="download" size={typography.fontSize.xl} color={colors.text.primary} />
          <Text style={[styles.buttonText, styles.downloadButtonText]}>Download</Text>
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
    marginBottom: spacing["2xl"],
  },
  label: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  amount: {
    fontSize: 48,
    fontWeight: "800",
    color: colors.accent,
    letterSpacing: -1,
  },
  mobileAmount: {
    fontSize: 36,
  },
  date: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing["2xl"],
  },
  viewButton: {
    backgroundColor: colors.background.input,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  downloadButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  buttonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  downloadButtonText: {
    color: colors.text.primary,
  },
});

