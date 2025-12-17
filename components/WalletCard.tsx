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
      return "#5a7a8a";
    case "creditcard":
      return "#837a5a";
    default:
      return "#ba9988";
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
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const padding = compact ? 10 : 14;
  const iconSize = compact ? 16 : 20;
  const iconContainerSize = compact ? 32 : 40;
  const titleFontSize = compact ? 12 : 14;
  const subtitleFontSize = compact ? 10 : 11;
  const balanceFontSize = compact ? (isMobile ? 14 : 16) : (isMobile ? 16 : 18);
  const badgeFontSize = compact ? 8 : 9;
  const badgePadding = compact ? { paddingHorizontal: 4, paddingVertical: 1 } : { paddingHorizontal: 5, paddingVertical: 1 };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: "#474747",
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
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: compact ? 8 : 10, flex: 1 }}>
          <View
            style={{
              width: iconContainerSize,
              height: iconContainerSize,
              borderRadius: compact ? 8 : 10,
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
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: compact ? 1 : 2,
              }}
              numberOfLines={1}
            >
              {wallet.name}
            </Text>
            <Text
              style={{
                fontSize: subtitleFontSize,
                color: "rgba(255, 255, 255, 0.6)",
              }}
              numberOfLines={1}
            >
              {wallet.type === "bankaccount"
                ? `${(wallet as BankAccountWallet).bankName} •••• ${(wallet as BankAccountWallet).last4}`
                : wallet.type === "creditcard"
                ? `${(wallet as CreditCardWallet).cardBrand} •••• ${(wallet as CreditCardWallet).last4}`
                : wallet.type === "giftcard"
                ? "Universal"
                : wallet.type === "primary"
                ? username
                : wallet.type === "business"
                ? "Soul Food Kitchen"
                : wallet.type === "organization"
                ? "Community Empowerment Foundation"
                : wallet.type.charAt(0).toUpperCase() + wallet.type.slice(1)}
            </Text>
          </View>
        </View>
        {/* Only show balance for non-bank/credit card accounts */}
        {(wallet.type !== "bankaccount" && wallet.type !== "creditcard") && (
        <View style={{ alignItems: "flex-end", marginLeft: compact ? 4 : 8 }}>
          <Text
            style={{
              fontSize: balanceFontSize,
              fontWeight: "700",
              color: iconColor,
            }}
          >
            {formatBalance(wallet.balance, wallet.currency)}
          </Text>
        </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

