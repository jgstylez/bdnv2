import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TokenLedgerEntry } from "../../types/token";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";

interface TokenLedgerEntriesProps {
  entries: TokenLedgerEntry[];
}

export function TokenLedgerEntries({ entries }: TokenLedgerEntriesProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return "add-shopping-cart";
      case "transfer":
        return "swap-horiz";
      case "reward":
        return "stars";
      case "redemption":
        return "redeem";
      default:
        return "account-balance-wallet";
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "purchase":
      case "reward":
        return colors.status.success;
      case "transfer":
      case "redemption":
        return colors.status.error;
      default:
        return colors.accent;
    }
  };

  if (entries.length === 0) {
    return (
      <View style={styles.emptyState}>
        <MaterialIcons name="receipt" size={48} color="rgba(186, 153, 136, 0.5)" />
        <Text style={styles.emptyStateText}>No ledger entries</Text>
      </View>
    );
  }

  return (
    <View>
      {entries.map((entry) => {
        const isPositive = entry.transactionType === "purchase" || entry.transactionType === "reward";
        const iconColor = getTransactionColor(entry.transactionType);
        
        return (
          <View key={entry.id} style={styles.entryCard}>
            <View style={styles.entryContent}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${iconColor}20` },
                ]}
              >
                <MaterialIcons
                  name={getTransactionIcon(entry.transactionType) as any}
                  size={24}
                  color={iconColor}
                />
              </View>
              <View style={styles.entryInfo}>
                <Text style={styles.entryDescription}>{entry.description}</Text>
                <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
              </View>
              <View style={styles.entryAmount}>
                <Text
                  style={[
                    styles.amountText,
                    { color: isPositive ? colors.status.success : colors.status.error },
                  ]}
                >
                  {isPositive ? "+" : "-"}
                  {entry.tokens} Tokens
                </Text>
                <Text style={styles.balanceText}>Balance: {entry.balance}</Text>
              </View>
            </View>
          </View>
        );
      })}
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
  entryCard: {
    backgroundColor: colors.secondary.bg,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.md,
  },
  entryContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  entryInfo: {
    flex: 1,
  },
  entryDescription: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  entryDate: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  entryAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  balanceText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
});

