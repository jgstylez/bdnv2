import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Wallet, WalletType, BankAccountWallet, CreditCardWallet, GiftCardWallet } from '../types/wallet';

interface WalletCardProps {
  wallet: Wallet;
  onPress?: () => void;
  compact?: boolean;
}

const getWalletIcon = (type: WalletType): keyof typeof MaterialIcons.glyphMap => {
  switch (type) {
    case "primary":
      return "account-balance-wallet";
    case "myimpact":
      return "stars";
    case "giftcard":
      return "card-giftcard";
    case "business":
      return "business";
    case "organization":
      return "groups";
    case "bankaccount":
      return "account-balance";
    case "creditcard":
      return "credit-card";
    default:
      return "account-balance-wallet";
  }
};

const getWalletColor = (type: WalletType): string => {
  switch (type) {
    case "primary":
      return "#ba9988";
    case "myimpact":
      return "#ffd700";
    case "giftcard":
      return "#9d8b6f";
    case "business":
      return "#6b8e9f";
    case "organization":
      return "#8b6f9d";
    case "bankaccount":
    case "bank":
      return "#5a7a8a";
    case "creditcard":
    case "card":
      return "#837a5a";
    default:
      return "#ba9988";
  }
};

// Get background color for card based on account type
const getWalletBackgroundColor = (type: WalletType): string => {
  switch (type) {
    case "primary":
      return "rgba(186, 153, 136, 0.15)"; // Brown/tan tint
    case "business":
      return "rgba(107, 142, 159, 0.15)"; // Blue tint
    case "organization":
      return "rgba(139, 111, 157, 0.15)"; // Purple tint
    case "myimpact":
      return "rgba(255, 215, 0, 0.15)"; // Gold tint
    case "giftcard":
      return "rgba(157, 139, 111, 0.15)"; // Beige tint
    case "bankaccount":
    case "bank":
      return "rgba(90, 122, 138, 0.15)"; // Dark blue tint
    case "creditcard":
    case "card":
      return "rgba(131, 122, 90, 0.15)"; // Olive tint
    default:
      return "#474747";
  }
};

export const WalletCard: React.FC<WalletCardProps> = ({ wallet, onPress, compact = false }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const iconColor = getWalletColor(wallet.type);
  const iconName = getWalletIcon(wallet.type);
  
  // Mock username - will be replaced with actual user context
  const username = "John Doe";

  const formatBalance = (amount: number, currency: string) => {
    if (currency === "BLKD") {
      return `${amount.toLocaleString()} BLKD`;
    }
    // For compact cards, show integers only (no decimals)
    if (compact) {
      return `$${Math.round(amount).toLocaleString()}`;
    }
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const padding = compact ? (isMobile ? 12 : 14) : 14;
  const iconSize = compact ? (isMobile ? 14 : 16) : 20;
  const iconContainerSize = compact ? (isMobile ? 24 : 28) : 40;
  const titleFontSize = compact ? (isMobile ? 12 : 13) : 14;
  const subtitleFontSize = compact ? (isMobile ? 10 : 11) : 12;
  const balanceFontSize = compact ? (isMobile ? 13 : 15) : (isMobile ? 16 : 18);
  const badgeFontSize = compact ? 8 : 9;
  const badgePadding = compact ? { paddingHorizontal: 4, paddingVertical: 1 } : { paddingHorizontal: 5, paddingVertical: 1 };

  // Get account type label
  const getAccountTypeLabel = (type: WalletType): string => {
    switch (type) {
      case "primary":
        return "Primary";
      case "business":
        return "Business";
      case "organization":
        return "Nonprofit";
      case "myimpact":
        return "MyImpact";
      case "giftcard":
        return "Gift Card";
      case "bank":
      case "bankaccount":
        return "Bank Account";
      case "card":
      case "creditcard":
        return "Credit Card";
      default:
        return wallet.name || "Account";
    }
  };

  // Get account name/subtitle
  const getAccountSubtitle = (): string => {
    if (wallet.type === "bank" || wallet.type === "bankaccount") {
      const bankWallet = wallet as BankAccountWallet & { bankName?: string; last4?: string };
      return `${bankWallet.bankName || "Bank"} •••• ${bankWallet.last4 || "****"}`;
    }
    if (wallet.type === "card" || wallet.type === "creditcard") {
      const cardWallet = wallet as CreditCardWallet & { cardBrand?: string; last4?: string };
      return `${cardWallet.cardBrand || "Card"} •••• ${cardWallet.last4 || "****"}`;
    }
    if (wallet.type === "giftcard") {
      return "Universal";
    }
    if (wallet.type === "primary") {
      return username;
    }
    if (wallet.type === "business") {
      return "Soul Food Kitchen";
    }
    if (wallet.type === "organization") {
      return "Community Empowerment Foundation";
    }
    return wallet.name || "";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: compact ? getWalletBackgroundColor(wallet.type) : "#474747",
        borderRadius: 12,
        padding: padding,
        borderWidth: wallet.isBackup ? 1 : 0,
        borderColor: wallet.isBackup ? iconColor : "transparent",
        position: "relative",
      }}
    >
      {wallet.isBackup && (
        <View
          style={{
            position: "absolute",
            top: 4,
            left: 4,
            backgroundColor: iconColor,
            ...badgePadding,
            borderRadius: 3,
            zIndex: 10,
          }}
        >
          <Text
            style={{
              fontSize: badgeFontSize,
              fontWeight: "600",
              color: "#ffffff",
            }}
          >
            BACKUP
          </Text>
        </View>
      )}
      {compact ? (
        // Vertical layout for compact cards - account type, balance, name, icon on right
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            {/* Account Type */}
            <Text
              style={{
                fontSize: titleFontSize,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 4,
              }}
              numberOfLines={1}
            >
              {getAccountTypeLabel(wallet.type)}
            </Text>
            {/* Balance */}
            <Text
              style={{
                fontSize: balanceFontSize,
                fontWeight: "700",
                color: iconColor,
                marginBottom: 4,
              }}
              numberOfLines={1}
            >
              {formatBalance((wallet as any).availableBalance ?? wallet.balance, wallet.currency)}
            </Text>
            {/* Account Name */}
            <Text
              style={{
                fontSize: subtitleFontSize,
                color: "rgba(255, 255, 255, 0.7)",
                fontWeight: "500",
              }}
              numberOfLines={1}
            >
              {getAccountSubtitle()}
            </Text>
          </View>
          {/* Icon on the right */}
          <View
            style={{
              width: iconContainerSize,
              height: iconContainerSize,
              borderRadius: 6,
              backgroundColor: `${iconColor}25`,
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 8,
              flexShrink: 0,
            }}
          >
            <MaterialIcons name={iconName} size={iconSize} color={iconColor} />
          </View>
        </View>
      ) : (
        // Horizontal layout for full-size cards
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
            <View
              style={{
                width: iconContainerSize,
                height: iconContainerSize,
                borderRadius: 10,
                backgroundColor: `${iconColor}20`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name={iconName} size={iconSize} color={iconColor} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                style={{
                  fontSize: titleFontSize,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 3,
                }}
                numberOfLines={1}
              >
                {getAccountTypeLabel(wallet.type)}
              </Text>
              <Text
                style={{
                  fontSize: subtitleFontSize,
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: "500",
                }}
                numberOfLines={1}
              >
                {getAccountSubtitle()}
              </Text>
            </View>
          </View>
          {/* Show balance for all accounts */}
          {(
            <View style={{ alignItems: "flex-end", marginLeft: 8, flexShrink: 0 }}>
              <Text
                style={{
                  fontSize: balanceFontSize,
                  fontWeight: "700",
                  color: iconColor,
                }}
                numberOfLines={1}
              >
                {formatBalance((wallet as any).availableBalance ?? wallet.balance, wallet.currency)}
              </Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

