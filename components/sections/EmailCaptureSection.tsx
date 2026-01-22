import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

export const EmailCaptureSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter your email address.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    
    // TODO: Integrate with email service/API
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        "Thank You!",
        "We've added you to our mailing list. Check your inbox for updates.",
        [{ text: "OK", onPress: () => setEmail("") }]
      );
    }, 1000);
  };

  return (
    <ScrollAnimatedView delay={900}>
      <View
        style={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingVertical: isMobile ? 60 : 80,
          backgroundColor: "#232323",
        }}
      >
        <View
          style={{
            maxWidth: 1000,
            alignSelf: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              backgroundColor: "rgba(71, 71, 71, 0.4)",
              borderRadius: 24,
              padding: isMobile ? 32 : 48,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.3)",
              position: "relative",
            }}
          >
            <View style={{ alignItems: "center" }}>
              {/* Icon */}
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: "rgba(186, 153, 136, 0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <MaterialIcons name="email" size={28} color="#ba9988" />
              </View>

              {/* Heading */}
              <Text
                style={{
                  fontSize: isMobile ? 28 : 36,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 12,
                  textAlign: "center",
                  letterSpacing: -0.5,
                }}
              >
                Stay Connected
              </Text>

              {/* Description */}
              <Text
                style={{
                  fontSize: isMobile ? 15 : 17,
                  color: "rgba(255, 255, 255, 0.8)",
                  textAlign: "center",
                  lineHeight: isMobile ? 22 : 26,
                  maxWidth: 600,
                  marginBottom: 32,
                }}
              >
                Get the latest updates on Black-owned businesses, exclusive deals, and community events delivered to your inbox.
              </Text>

              {/* Email Input Form */}
              <View
                style={{
                  width: "100%",
                  maxWidth: 500,
                  flexDirection: isMobile ? "column" : "row",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#1a1a1a",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    paddingHorizontal: 16,
                    paddingVertical: isMobile ? 14 : 16,
                  }}
                >
                  <MaterialIcons name="email" size={20} color="rgba(255, 255, 255, 0.5)" style={{ marginRight: 12 }} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    style={{
                      flex: 1,
                      fontSize: isMobile ? 15 : 16,
                      color: "#ffffff",
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isSubmitting}
                  />
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: "#ba9988",
                    paddingHorizontal: isMobile ? 32 : 40,
                    paddingVertical: isMobile ? 14 : 16,
                    borderRadius: 12,
                    minWidth: isMobile ? "100%" : 140,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    gap: 8,
                    shadowColor: "#ba9988",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
                    elevation: 6,
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <MaterialIcons name="hourglass-empty" size={18} color="#ffffff" />
                      <Text
                        style={{
                          fontSize: isMobile ? 15 : 16,
                          fontWeight: "600",
                          color: "#ffffff",
                        }}
                      >
                        Submitting...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text
                        style={{
                          fontSize: isMobile ? 15 : 16,
                          fontWeight: "600",
                          color: "#ffffff",
                        }}
                      >
                        Subscribe
                      </Text>
                      <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Trust Text */}
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.5)",
                  textAlign: "center",
                }}
              >
                We respect your privacy. Unsubscribe at any time.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};

