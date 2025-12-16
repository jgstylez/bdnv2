import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";

export default function Verify() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [verificationMethod, setVerificationMethod] = useState<"email" | "sms">("email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const inputRefs = React.useRef<(TextInput | null)[]>([]);

  const handleCodeChange = (value: string, index: number) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (code.every((digit) => digit !== "")) {
      // TODO: Verify code with backend
      router.push("/(auth)/onboarding");
    }
  };

  const handleResend = () => {
    // TODO: Resend verification code
    alert("Verification code resent!");
  };

  const isComplete = code.every((digit) => digit !== "");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#232323" }}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: isMobile ? 20 : 40,
          paddingVertical: 40,
        }}
      >
        <View
          style={{
            maxWidth: 500,
            width: "100%",
            alignSelf: "center",
          }}
        >
          {/* Header */}
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                backgroundColor: "#ba9988",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <MaterialIcons name="verified" size={32} color="#ffffff" />
            </View>
            <Text
              style={{
                fontSize: isMobile ? 32 : 36,
                fontWeight: "800",
                color: "#ffffff",
                marginBottom: 8,
                letterSpacing: -1,
                textAlign: "center",
              }}
            >
              Verify Your Account
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
              }}
            >
              {verificationMethod === "email"
                ? "We sent a verification code to your email"
                : "We sent a verification code to your phone"}
            </Text>
          </View>

          {/* Verification Method Toggle */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#474747",
              borderRadius: 12,
              padding: 4,
              marginBottom: 32,
            }}
          >
            <TouchableOpacity
              onPress={() => setVerificationMethod("email")}
              style={{
                flex: 1,
                backgroundColor: verificationMethod === "email" ? "#ba9988" : "transparent",
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: verificationMethod === "email" ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                }}
              >
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setVerificationMethod("sms")}
              style={{
                flex: 1,
                backgroundColor: verificationMethod === "sms" ? "#ba9988" : "transparent",
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: verificationMethod === "sms" ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                }}
              >
                SMS
              </Text>
            </TouchableOpacity>
          </View>

          {/* Phone Number Input (if SMS selected) */}
          {verificationMethod === "sms" && (
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Phone Number *
              </Text>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="+1 (555) 123-4567"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                keyboardType="phone-pad"
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  color: "#ffffff",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              />
            </View>
          )}

          {/* Code Input */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Enter verification code
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 12,
              }}
            >
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  value={digit}
                  onChangeText={(value) => handleCodeChange(value, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={{
                    width: 48,
                    height: 56,
                    backgroundColor: "#474747",
                    borderRadius: 12,
                    textAlign: "center",
                    fontSize: 24,
                    fontWeight: "600",
                    color: "#ffffff",
                    borderWidth: 1,
                    borderColor: digit ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                  }}
                />
              ))}
            </View>
          </View>

          {/* Resend Code */}
          <TouchableOpacity onPress={handleResend} style={{ alignItems: "center", marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 14,
                color: "#ba9988",
                fontWeight: "500",
              }}
            >
              Didn't receive code? Resend
            </Text>
          </TouchableOpacity>

          {/* Verify Button */}
          <TouchableOpacity
            onPress={handleVerify}
            disabled={!isComplete || (verificationMethod === "sms" && !phoneNumber)}
            activeOpacity={0.8}
            style={{
              backgroundColor: isComplete && (verificationMethod === "email" || phoneNumber) ? "#ba9988" : "rgba(186, 153, 136, 0.3)",
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: isComplete && (verificationMethod === "email" || phoneNumber) ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
              }}
            >
              Verify Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

