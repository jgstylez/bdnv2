import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TokenPurchase } from "../types/token";

interface TokenPurchaseCardProps {
  purchase: TokenPurchase;
  onViewCertificate?: () => void;
}

export const TokenPurchaseCard: React.FC<TokenPurchaseCardProps> = ({
  purchase,
  onViewCertificate,
}) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#ba9988";
      case "pending":
        return "#ffd700";
      case "failed":
        return "#ff4444";
      default:
        return "rgba(255, 255, 255, 0.5)";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View
      style={{
        backgroundColor: "#474747",
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(186, 153, 136, 0.2)",
        marginBottom: 12,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <MaterialIcons name="account-balance-wallet" size={20} color="#ba9988" />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              {purchase.tokens} BDN Token{purchase.tokens !== 1 ? "s" : ""}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: 4,
            }}
          >
            {formatDate(purchase.purchaseDate)}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#ba9988",
            }}
          >
            {purchase.currency === "USD"
              ? `$${purchase.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : `${purchase.totalCost.toLocaleString()} BLKD`}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: `${getStatusColor(purchase.status)}20`,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "600",
              color: getStatusColor(purchase.status),
              textTransform: "uppercase",
            }}
          >
            {purchase.status}
          </Text>
        </View>
      </View>

      {purchase.certificateUrl && (
        <TouchableOpacity
          onPress={onViewCertificate}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <MaterialIcons name="picture-as-pdf" size={18} color="#ba9988" />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#ba9988",
            }}
          >
            View Certificate
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

