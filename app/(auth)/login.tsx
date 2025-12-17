import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../hooks/useAuth"; // Corrected import path

export default function Login() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, handleBiometricAuth } = useAuth();

  const handleLogin = () => {
    login(email, password);
  };

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
          {/* Logo */}
          <View style={{ alignItems: "center", marginBottom: 40 }}>
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
              <Text style={{ fontSize: 32, fontWeight: "800", color: "#ffffff" }}>B</Text>
            </View>
            <Text
              style={{
                fontSize: isMobile ? 32 : 36,
                fontWeight: "800",
                color: "#ffffff",
                marginBottom: 8,
                letterSpacing: -1,
              }}
            >
              Welcome Back
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
              }}
            >
              Sign in to your BDN account
            </Text>
          </View>

          {/* Login Form */}
          <View style={{ gap: 20 }}>
            {/* Email Input */}
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Email Address
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
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

            {/* Password Input */}
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Password
              </Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: "#ffffff",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    paddingRight: 50,
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 16,
                    top: 16,
                  }}
                >
                  <Text style={{ color: "#ba9988", fontSize: 14, fontWeight: "600" }}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={{ alignSelf: "flex-end" }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "#ba9988",
                  fontWeight: "500",
                }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.8}
              style={{
                backgroundColor: "#ba9988",
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            {/* Biometric Button */}
            <TouchableOpacity
              onPress={handleBiometricAuth}
              activeOpacity={0.8}
              style={{
                borderColor: "#ba9988",
                borderWidth: 1,
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#ba9988",
                }}
              >
                Use Biometrics
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#ba9988",
                    fontWeight: "600",
                  }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
