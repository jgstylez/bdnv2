/**
 * Fee Breakdown Component
 * 
 * Displays fee breakdown for transactions, showing service fees
 * and platform fees with BDN+ subscription benefits
 */

import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Currency } from '../types/international';
import { formatCurrency } from '../lib/international';

interface FeeBreakdownProps {
  amount: number;
  fee: number;
  currency: Currency;
  feeType: "service" | "platform";
  hasBDNPlus?: boolean;
  hasBDNPlusBusiness?: boolean;
  showTotal?: boolean;
  showTooltip?: boolean;
  style?: any;
}

export function FeeBreakdown({
  amount,
  fee,
  currency,
  feeType,
  hasBDNPlus = false,
  hasBDNPlusBusiness = false,
  showTotal = true,
  showTooltip = false,
  style,
}: FeeBreakdownProps) {
  const feePercentage = feeType === "service" 
    ? (hasBDNPlus ? 0 : 10)
    : (hasBDNPlusBusiness ? 5 : 10);
  
  const feeLabel = feeType === "service" 
    ? "Service Fee"
    : "Platform Fee";
  
  const hasDiscount = feeType === "service" ? hasBDNPlus : hasBDNPlusBusiness;
  const subscriptionBadge = feeType === "service" ? "BDN+" : "BDN+ Business";

  const handleTooltipPress = () => {
    if (feeType === "service") {
      Alert.alert(
        "Service Fee",
        "The service fee helps us maintain the BDN platform, provide secure payment processing, customer support, and continue building tools that support Black-owned businesses. BDN+ members enjoy 0% service fees on all purchases.",
        [{ text: "Got it", style: "default" }]
      );
    } else {
      Alert.alert(
        "Platform Fee",
        "The platform fee helps us maintain the BDN marketplace, provide business tools, payment processing, and support services for merchants. BDN+ Business members enjoy reduced platform fees.",
        [{ text: "Got it", style: "default" }]
      );
    }
  };

  return (
    <View style={[{ gap: 8 }, style]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
            {feeLabel} ({feePercentage}%)
          </Text>
          {showTooltip && (
            <TouchableOpacity
              onPress={handleTooltipPress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons name="info-outline" size={16} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          )}
          {hasDiscount && (
            <View
              style={{
                backgroundColor: "rgba(186, 153, 136, 0.2)",
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 10, color: "#ba9988", fontWeight: "600" }}>
                {subscriptionBadge}
              </Text>
            </View>
          )}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {hasDiscount && fee > 0 && (
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "rgba(255, 255, 255, 0.4)",
                textDecorationLine: "line-through",
              }}
            >
              {formatCurrency(
                feeType === "service" 
                  ? amount * 0.10 
                  : amount * 0.10,
                currency
              )}
            </Text>
          )}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: hasDiscount ? "#ba9988" : "rgba(255, 255, 255, 0.7)",
            }}
          >
            {formatCurrency(fee, currency)}
          </Text>
        </View>
      </View>
      
      {hasDiscount && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <MaterialIcons name="check-circle" size={14} color="#ba9988" />
          <Text style={{ fontSize: 12, color: "#ba9988", fontStyle: "italic" }}>
            {feeType === "service" 
              ? "Service fee waived with BDN+"
              : "Reduced platform fee with BDN+ Business"}
          </Text>
        </View>
      )}
      
      {showTotal && (
        <>
          <View style={{ height: 1, backgroundColor: "rgba(186, 153, 136, 0.2)", marginTop: 4 }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff" }}>
              {feeType === "service" ? "Total" : "Net Amount"}
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#ba9988" }}>
              {formatCurrency(feeType === "service" ? amount + fee : amount - fee, currency)}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

