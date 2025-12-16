import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TokenPurchase } from "../../types/token";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";

interface PurchaseHistoryListProps {
  purchases: TokenPurchase[];
  onViewCertificate?: (purchaseId: string) => void;
}

export function PurchaseHistoryList({ purchases, onViewCertificate }: PurchaseHistoryListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return colors.status.success;
      case "pending":
        return colors.status.warning;
      case "failed":
        return colors.status.error;
      default:
        return colors.text.secondary;
    }
  };

  if (purchases.length === 0) {
    return (
      <View style={styles.emptyState}>
        <MaterialIcons name="receipt" size={48} color="rgba(186, 153, 136, 0.5)" />
        <Text style={styles.emptyStateText}>No purchase history</Text>
      </View>
    );
  }

  return (
    <View>
      {purchases.map((purchase) => (
        <View key={purchase.id} style={styles.purchaseCard}>
          <View style={styles.purchaseHeader}>
            <View style={styles.purchaseInfo}>
              <Text style={styles.purchaseAmount}>{purchase.tokens} Tokens</Text>
              <Text style={styles.purchaseDate}>{formatDate(purchase.purchaseDate)}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(purchase.status)}20` }]}>
              <Text style={[styles.statusText, { color: getStatusColor(purchase.status) }]}>
                {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
              </Text>
            </View>
          </View>
          
          <View style={styles.purchaseDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID</Text>
              <Text style={styles.detailValue}>{purchase.transactionId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Cost</Text>
              <Text style={styles.detailValue}>
                ${purchase.totalCost.toFixed(2)} {purchase.currency}
              </Text>
            </View>
          </View>

          {purchase.status === "completed" && purchase.certificateUrl && onViewCertificate && (
            <TouchableOpacity
              onPress={() => onViewCertificate(purchase.id)}
              style={styles.certificateButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="View certificate for this purchase"
            >
              <MaterialIcons name="description" size={18} color={colors.accent} />
              <Text style={styles.certificateButtonText}>View Certificate</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
  purchaseCard: {
    backgroundColor: colors.secondary.bg,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.md,
  },
  purchaseHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  purchaseInfo: {
    flex: 1,
  },
  purchaseAmount: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  purchaseDate: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    textTransform: "capitalize",
  },
  purchaseDetails: {
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  detailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  detailValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  certificateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  certificateButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent,
  },
});

