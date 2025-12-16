import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface PaymentKeypadProps {
  value: string;
  onValueChange: (value: string) => void;
  currency?: "USD" | "BLKD";
  maxAmount?: number;
}

export const PaymentKeypad: React.FC<PaymentKeypadProps> = ({ value, onValueChange, currency = "USD", maxAmount }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const buttonSize = isMobile ? 70 : 80;

  const handleNumberPress = (num: string) => {
    if (value === "0") {
      onValueChange(num);
      return;
    }
    const newValue = value + num;
    const numericValue = parseFloat(newValue);
    if (maxAmount && numericValue > maxAmount) {
      return; // Don't allow exceeding max amount
    }
    // Limit to 2 decimal places
    if (newValue.includes(".")) {
      const parts = newValue.split(".");
      if (parts[1] && parts[1].length > 2) {
        return;
      }
    }
    onValueChange(newValue);
  };

  const handleDecimalPress = () => {
    if (!value.includes(".")) {
      onValueChange(value + ".");
    }
  };

  const handleBackspace = () => {
    if (value.length > 1) {
      onValueChange(value.slice(0, -1));
    } else {
      onValueChange("0");
    }
  };

  const handleClear = () => {
    onValueChange("0");
  };

  const formatDisplayValue = () => {
    if (value === "0" || value === "") return "0.00";
    const num = parseFloat(value);
    if (isNaN(num)) return "0.00";
    return num.toFixed(2);
  };

  return (
    <View>
      {/* Display */}
      <View
        style={{
          backgroundColor: "#474747",
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: "rgba(186, 153, 136, 0.2)",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.6)",
            marginBottom: 8,
          }}
        >
          Amount
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text
            style={{
              fontSize: isMobile ? 36 : 48,
              fontWeight: "800",
              color: "#ba9988",
              letterSpacing: -1,
            }}
          >
            {currency === "USD" ? "$" : ""}
          </Text>
          <Text
            style={{
              fontSize: isMobile ? 36 : 48,
              fontWeight: "800",
              color: "#ffffff",
              letterSpacing: -1,
            }}
          >
            {formatDisplayValue()}
          </Text>
          {currency === "BLKD" && (
            <Text
              style={{
                fontSize: isMobile ? 24 : 32,
                fontWeight: "700",
                color: "rgba(255, 255, 255, 0.7)",
                marginLeft: 8,
              }}
            >
              BLKD
            </Text>
          )}
        </View>
      </View>

      {/* Keypad */}
      <View style={{ gap: 12 }}>
        {/* Row 1: 1, 2, 3 */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          {[1, 2, 3].map((num) => (
            <TouchableOpacity
              key={num}
              onPress={() => handleNumberPress(num.toString())}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Number ${num}`}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                flex: 1,
                height: buttonSize,
                backgroundColor: "#474747",
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: isMobile ? 24 : 28,
                  fontWeight: "700",
                  color: "#ffffff",
                }}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Row 2: 4, 5, 6 */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          {[4, 5, 6].map((num) => (
            <TouchableOpacity
              key={num}
              onPress={() => handleNumberPress(num.toString())}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Number ${num}`}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                flex: 1,
                height: buttonSize,
                backgroundColor: "#474747",
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: isMobile ? 24 : 28,
                  fontWeight: "700",
                  color: "#ffffff",
                }}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Row 3: 7, 8, 9 */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          {[7, 8, 9].map((num) => (
            <TouchableOpacity
              key={num}
              onPress={() => handleNumberPress(num.toString())}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Number ${num}`}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                flex: 1,
                height: buttonSize,
                backgroundColor: "#474747",
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: isMobile ? 24 : 28,
                  fontWeight: "700",
                  color: "#ffffff",
                }}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Row 4: ., 0, Backspace */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            onPress={handleDecimalPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Decimal point"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              flex: 1,
              height: buttonSize,
              backgroundColor: "#474747",
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
            activeOpacity={0.7}
          >
            <Text
              style={{
                fontSize: isMobile ? 24 : 28,
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              .
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleNumberPress("0")}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Number zero"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              flex: 1,
              height: buttonSize,
              backgroundColor: "#474747",
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
            activeOpacity={0.7}
          >
            <Text
              style={{
                fontSize: isMobile ? 24 : 28,
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              0
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleBackspace}
            onLongPress={handleClear}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Backspace"
            accessibilityHint="Double tap and hold to clear all"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              flex: 1,
              height: buttonSize,
              backgroundColor: "#474747",
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
            activeOpacity={0.7}
          >
            <MaterialIcons name="backspace" size={isMobile ? 24 : 28} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Quick Amount Buttons */}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
          {currency === "USD"
            ? [10, 25, 50, 100].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  onPress={() => {
                    const newValue = amount.toString();
                    if (!maxAmount || amount <= maxAmount) {
                      onValueChange(newValue);
                    }
                  }}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Quick amount ${currency === "USD" ? "$" : ""}${amount}`}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    backgroundColor: "rgba(186, 153, 136, 0.15)",
                    borderRadius: 12,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ba9988",
                    }}
                  >
                    ${amount}
                  </Text>
                </TouchableOpacity>
              ))
            : [100, 250, 500, 1000].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  onPress={() => {
                    const newValue = amount.toString();
                    if (!maxAmount || amount <= maxAmount) {
                      onValueChange(newValue);
                    }
                  }}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Quick amount ${amount} BLKD`}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    backgroundColor: "rgba(186, 153, 136, 0.15)",
                    borderRadius: 12,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ba9988",
                    }}
                  >
                    {amount} BLKD
                  </Text>
                </TouchableOpacity>
              ))}
        </View>
      </View>
    </View>
  );
};

