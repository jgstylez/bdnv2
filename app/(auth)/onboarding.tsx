import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    photo: null as string | null,
    country: "",
    zipCode: "",
    dateOfBirth: "",
  });

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({ ...formData, photo: result.assets[0].uri });
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    // TODO: Save onboarding data
    router.push("/(tabs)/dashboard");
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.firstName.trim() !== "" && formData.lastName.trim() !== "";
      case 2:
        return true; // Photo is optional
      case 3:
        return formData.country.trim() !== "";
      case 4:
        return formData.zipCode.trim() !== "";
      case 5:
        return formData.dateOfBirth.trim() !== "";
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={{ gap: 20 }}>
            <Text
              style={{
                fontSize: isMobile ? 24 : 28,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              What's your name?
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              Let's personalize your BDN experience
            </Text>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                First Name *
              </Text>
              <TextInput
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                placeholder="First name"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
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
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Last Name *
              </Text>
              <TextInput
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                placeholder="Last name"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
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
          </View>
        );

      case 2:
        return (
          <View style={{ gap: 20 }}>
            <Text
              style={{
                fontSize: isMobile ? 24 : 28,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Add a photo
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              Help others recognize you (optional but recommended)
            </Text>
            <TouchableOpacity
              onPress={handlePickImage}
              style={{
                alignSelf: "center",
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: "#474747",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "#ba9988",
                borderStyle: "dashed",
              }}
            >
              {formData.photo ? (
                <Image source={{ uri: formData.photo }} style={{ width: 120, height: 120, borderRadius: 60 }} />
              ) : (
                <>
                  <MaterialIcons name="add-a-photo" size={32} color="#ba9988" />
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#ba9988",
                      marginTop: 8,
                    }}
                  >
                    Add Photo
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        );

      case 3:
        return (
          <View style={{ gap: 20 }}>
            <Text
              style={{
                fontSize: isMobile ? 24 : 28,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Where are you located?
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              Help us connect you with local businesses
            </Text>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Country *
              </Text>
              <TextInput
                value={formData.country}
                onChangeText={(text) => setFormData({ ...formData, country: text })}
                placeholder="United States"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
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
          </View>
        );

      case 4:
        return (
          <View style={{ gap: 20 }}>
            <Text
              style={{
                fontSize: isMobile ? 24 : 28,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              What's your zip code?
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              We'll show you businesses near you
            </Text>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Zip Code *
              </Text>
              <TextInput
                value={formData.zipCode}
                onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
                placeholder="12345"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                keyboardType="number-pad"
                maxLength={10}
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
          </View>
        );

      case 5:
        return (
          <View style={{ gap: 20 }}>
            <Text
              style={{
                fontSize: isMobile ? 24 : 28,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              When were you born?
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              We need this to verify your account
            </Text>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Date of Birth *
              </Text>
              <TextInput
                value={formData.dateOfBirth}
                onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                keyboardType="number-pad"
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
          </View>
        );

      default:
        return null;
    }
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
          {/* Progress Indicator */}
          <View style={{ marginBottom: 32 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                Step {step} of 5
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                {Math.round((step / 5) * 100)}%
              </Text>
            </View>
            <View
              style={{
                height: 4,
                backgroundColor: "#474747",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${(step / 5) * 100}%`,
                  backgroundColor: "#ba9988",
                  borderRadius: 2,
                }}
              />
            </View>
          </View>

          {/* Step Content */}
          {renderStep()}

          {/* Navigation Buttons */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginTop: 32,
            }}
          >
            {step > 1 && (
              <TouchableOpacity
                onPress={handleBack}
                style={{
                  flex: 1,
                  backgroundColor: "#474747",
                  borderRadius: 12,
                  paddingVertical: 16,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  Back
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleNext}
              disabled={!isStepValid()}
              activeOpacity={0.8}
              style={{
                flex: 1,
                backgroundColor: isStepValid() ? "#ba9988" : "rgba(186, 153, 136, 0.3)",
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: isStepValid() ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                }}
              >
                {step === 5 ? "Complete" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

