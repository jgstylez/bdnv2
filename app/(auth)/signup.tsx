import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";

export default function Signup() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    referralCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  
  // Password validation rules
  const passwordRules = {
    minLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordRules).every((rule) => rule === true);

  const handleSignup = () => {
    if (!formData.email || !isPasswordValid || !formData.referralCode) {
      return;
    }
    // TODO: Implement signup logic
    router.push("/(auth)/verify");
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
              Join BDN
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
              }}
            >
              Start building economic power with your community
            </Text>
          </View>

          {/* Form Fields */}
          <View style={{ gap: 20 }}>
            {/* Email */}
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Email Address *
              </Text>
              <TextInput
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
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
                  borderColor: formData.email ? "rgba(186, 153, 136, 0.2)" : "rgba(186, 153, 136, 0.2)",
                }}
              />
            </View>

            {/* Password */}
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Password *
              </Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  placeholder="Create a password"
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
                    borderColor: formData.password && isPasswordValid ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
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
                  <MaterialIcons 
                    name={showPassword ? "visibility-off" : "visibility"} 
                    size={20} 
                    color="rgba(255, 255, 255, 0.6)" 
                  />
                </TouchableOpacity>
              </View>
              
              {/* Password Validation */}
              {formData.password.length > 0 && (
                <View
                  style={{
                    marginTop: 12,
                    backgroundColor: "#232323",
                    borderRadius: 8,
                    padding: 12,
                    gap: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: 4,
                    }}
                  >
                    Password must contain:
                  </Text>
                  {[
                    { label: "At least 8 characters", valid: passwordRules.minLength },
                    { label: "One uppercase letter", valid: passwordRules.hasUpperCase },
                    { label: "One lowercase letter", valid: passwordRules.hasLowerCase },
                    { label: "One number", valid: passwordRules.hasNumber },
                    { label: "One special character", valid: passwordRules.hasSpecialChar },
                  ].map((rule, index) => (
                    <View key={index} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <MaterialIcons
                        name={rule.valid ? "check-circle" : "radio-button-unchecked"}
                        size={16}
                        color={rule.valid ? "#ba9988" : "rgba(255, 255, 255, 0.3)"}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          color: rule.valid ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.4)",
                        }}
                      >
                        {rule.label}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Invite code */}
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Invite code *
              </Text>
              <TextInput
                value={formData.referralCode}
                onChangeText={(text) => setFormData({ ...formData, referralCode: text })}
                placeholder="Enter invite code"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                autoCapitalize="characters"
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

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSignup}
              activeOpacity={0.8}
              disabled={!formData.email || !isPasswordValid || !formData.referralCode}
              style={{
                backgroundColor: formData.email && isPasswordValid && formData.referralCode ? "#ba9988" : "rgba(186, 153, 136, 0.3)",
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
                  color: formData.email && isPasswordValid && formData.referralCode ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                }}
              >
                Create Account
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
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
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#ba9988",
                    fontWeight: "600",
                  }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

