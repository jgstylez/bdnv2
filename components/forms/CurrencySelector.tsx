/**
 * Currency Selector Component
 * 
 * A reusable component for selecting currencies, with support for
 * international currencies and the BLKD token
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Currency, getCurrencySymbol } from "../../lib/international";

interface CurrencySelectorProps {
  value: Currency;
  onChange: (currency: Currency) => void;
  showBLKD?: boolean;
  allowedCurrencies?: Currency[];
  style?: any;
}

const COMMON_CURRENCIES: Currency[] = [
  "USD",
  "CAD",
  "GBP",
  "EUR",
  "AUD",
  "ZAR",
  "NGN",
  "JMD",
  "BRL",
  "MXN",
];

const ALL_CURRENCIES: Currency[] = [
  "USD",
  "BLKD",
  "CAD",
  "GBP",
  "EUR",
  "AUD",
  "NZD",
  "ZAR",
  "NGN",
  "KES",
  "GHS",
  "JMD",
  "TTD",
  "BBD",
  "BSD",
  "XCD",
  "BZD",
  "GYD",
  "SRD",
  "BRL",
  "MXN",
  "ARS",
  "CLP",
  "COP",
  "PEN",
  "JPY",
  "CNY",
  "INR",
  "SGD",
  "AED",
  "SAR",
];

const CURRENCY_NAMES: Record<Currency, string> = {
  USD: "US Dollar",
  BLKD: "BDN Token",
  CAD: "Canadian Dollar",
  GBP: "British Pound",
  EUR: "Euro",
  AUD: "Australian Dollar",
  NZD: "New Zealand Dollar",
  ZAR: "South African Rand",
  NGN: "Nigerian Naira",
  KES: "Kenyan Shilling",
  GHS: "Ghanaian Cedi",
  JMD: "Jamaican Dollar",
  TTD: "Trinidad and Tobago Dollar",
  BBD: "Barbadian Dollar",
  BSD: "Bahamian Dollar",
  XCD: "East Caribbean Dollar",
  BZD: "Belize Dollar",
  GYD: "Guyanese Dollar",
  SRD: "Surinamese Dollar",
  BRL: "Brazilian Real",
  MXN: "Mexican Peso",
  ARS: "Argentine Peso",
  CLP: "Chilean Peso",
  COP: "Colombian Peso",
  PEN: "Peruvian Sol",
  JPY: "Japanese Yen",
  CNY: "Chinese Yuan",
  INR: "Indian Rupee",
  SGD: "Singapore Dollar",
  AED: "UAE Dirham",
  SAR: "Saudi Riyal",
};

export function CurrencySelector({
  value,
  onChange,
  showBLKD = true,
  allowedCurrencies,
  style,
}: CurrencySelectorProps) {
  const [showList, setShowList] = useState(false);

  const currencies = allowedCurrencies || (showBLKD ? ALL_CURRENCIES : COMMON_CURRENCIES);

  return (
    <View style={style}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: "#ffffff",
          marginBottom: 8,
        }}
      >
        Currency
      </Text>
      <TouchableOpacity
        onPress={() => setShowList(!showList)}
        style={{
          backgroundColor: "#232323",
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: "rgba(186, 153, 136, 0.2)",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600" }}>
            {getCurrencySymbol(value)}
          </Text>
          <Text style={{ color: "#ffffff", fontSize: 14 }}>
            {CURRENCY_NAMES[value] || value}
          </Text>
        </View>
        <MaterialIcons
          name={showList ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={20}
          color="#ba9988"
        />
      </TouchableOpacity>

      {showList && (
        <View
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 4,
            backgroundColor: "#474747",
            borderRadius: 12,
            maxHeight: 400,
            zIndex: 1000,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <ScrollView style={{ maxHeight: 400 }}>
            {currencies.map((currency) => (
              <TouchableOpacity
                key={currency}
                onPress={() => {
                  onChange(currency);
                  setShowList(false);
                }}
                style={{
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(186, 153, 136, 0.1)",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: value === currency ? "rgba(186, 153, 136, 0.1)" : "transparent",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600", minWidth: 40 }}>
                    {getCurrencySymbol(currency)}
                  </Text>
                  <View>
                    <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "600" }}>
                      {currency}
                    </Text>
                    <Text style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 12 }}>
                      {CURRENCY_NAMES[currency] || currency}
                    </Text>
                  </View>
                </View>
                {value === currency && (
                  <MaterialIcons name="check" size={20} color="#ba9988" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

