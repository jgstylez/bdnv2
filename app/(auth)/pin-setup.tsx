import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function PinSetup() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handlePinChange = (value: string, index: number) => {
    if (value.length > 1) return; // Only allow single digit

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    if (pin.every((digit) => digit !== "")) {
      // TODO: Save PIN and complete setup
      router.push("/(tabs)/dashboard");
    }
  };

  const isComplete = pin.every((digit) => digit !== "");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#232323" }}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: isMobile ? 20 : 40,
          paddingVertical: 40,
        }}
      >
        <View
          style={{
            maxWidth: 450,
            width: "100%",
            alignSelf: "center",
          }}
        >
          {/* Header */}
          <View style={{ alignItems: "center", marginBottom: 48 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                backgroundColor: "#ba9988",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <Text style={{ fontSize: 32, fontWeight: "800", color: "#ffffff" }}>🔒</Text>
            </View>
            <Text
              style={{
                fontSize: isMobile ? 28 : 32,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Set Up Your PIN
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
                lineHeight: 24,
              }}
            >
              Create a 6-digit PIN for secure access to your account. You'll use this along with your password for multi-factor authentication.
            </Text>
          </View>

          {/* PIN Inputs */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 32,
            }}
          >
            {pin.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                value={digit}
                onChangeText={(value) => handlePinChange(value, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                style={{
                  flex: 1,
                  aspectRatio: 1,
                  backgroundColor: "#474747",
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: digit ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                  fontSize: 24,
                  fontWeight: "600",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              />
            ))}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!isComplete}
            activeOpacity={0.8}
            style={{
              backgroundColor: isComplete ? "#ba9988" : "#474747",
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              opacity: isComplete ? 1 : 0.5,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#ffffff",
              }}
            >
              Complete Setup
            </Text>
          </TouchableOpacity>

          {/* Security Note */}
          <Text
            style={{
              fontSize: 12,
              color: "rgba(255, 255, 255, 0.5)",
              textAlign: "center",
              marginTop: 24,
              lineHeight: 18,
            }}
          >
            Your PIN is encrypted and stored securely. Never share your PIN with anyone.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

