import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { OrganizationType } from '@/types/nonprofit';
import { InternationalAddress, CountryCode } from '@/types/international';
import { InternationalAddressForm } from '@/components/forms/InternationalAddressForm';
import { TaxIdSelector } from '@/components/forms/TaxIdSelector';
import { TaxIdentification } from '@/types/international';
import { requiresStateField } from '@/lib/international';
import { StepIndicator } from '@/components/StepIndicator';

const ORGANIZATION_TYPES: { value: OrganizationType; label: string; description: string }[] = [
  { value: "nonprofit", label: "Nonprofit", description: "501(c)(3) nonprofit organization" },
  { value: "charity", label: "Charity", description: "Charitable organization" },
  { value: "foundation", label: "Foundation", description: "Private or public foundation" },
  { value: "community-organization", label: "Community Organization", description: "Community-based organization" },
];

export default function NonprofitOnboarding() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "" as OrganizationType | "",
    taxIdentification: {
      type: "EIN" as TaxIdentification["type"],
      number: "",
      country: "US" as CountryCode,
    } as TaxIdentification,
    description: "",
    mission: "",
    address: {
      street: "",
    city: "",
    state: "",
      postalCode: "",
      country: "US" as CountryCode,
    } as Partial<InternationalAddress>,
    phone: "",
    phoneCountryCode: "US" as CountryCode,
    email: "",
    website: "",
  });

  const handleNext = () => {
    if (validateStep()) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.organizationName.trim() !== "" && formData.organizationType !== "";
      case 2:
        return formData.description.trim() !== "" && formData.mission.trim() !== "";
      case 3:
        return (
          formData.address.street?.trim() !== "" &&
          formData.address.city?.trim() !== "" &&
          formData.address.postalCode?.trim() !== "" &&
          formData.address.country !== undefined &&
          (!requiresStateField(formData.address.country) || formData.address.state?.trim() !== "")
        );
      case 4:
        return formData.phone.trim() !== "" && formData.email.trim() !== "";
      case 5:
        return formData.taxIdentification.number.trim() !== "";
      default:
        return false;
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!validateStep()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Submit nonprofit onboarding application
      // const response = await api.post('/nonprofits/onboarding', formData);
      
      Alert.alert(
        "Application Submitted",
        "Your organization application has been submitted! We'll review your application and get back to you soon. You'll receive an email notification once your application is reviewed.",
        [
          {
            text: "OK",
            onPress: () => router.push("/pages/nonprofit/dashboard"),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Submission Failed",
        error?.message || "Failed to submit your application. Please check your information and try again, or contact support if the problem persists."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={{ gap: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#ffffff", marginBottom: 16, textAlign: "center" }}>
              Organization Information
            </Text>
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
                Organization Name *
              </Text>
              <TextInput
                value={formData.organizationName}
                onChangeText={(text) => setFormData({ ...formData, organizationName: text })}
                placeholder="Enter organization name"
                placeholderTextColor="rgba(186, 153, 136, 0.5)"
                style={{
                  backgroundColor: "#2a2a2a",
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  color: "#ffffff",
                  borderWidth: 1.5,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                  minHeight: 48,
                }}
              />
            </View>
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
                Organization Type * (Select one)
              </Text>
              <View style={{ gap: 12 }}>
                {ORGANIZATION_TYPES.map((type) => {
                  const isSelected = formData.organizationType === type.value;
                  return (
                    <TouchableOpacity
                      key={type.value}
                      onPress={() => setFormData({ ...formData, organizationType: type.value })}
                      style={{
                        backgroundColor: isSelected ? "#474747" : "#232323",
                        borderRadius: 12,
                        padding: 16,
                        borderWidth: 2,
                        borderColor: isSelected ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          borderWidth: 2,
                          borderColor: isSelected ? "#ba9988" : "rgba(255, 255, 255, 0.3)",
                          backgroundColor: isSelected ? "#ba9988" : "transparent",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {isSelected && <MaterialIcons name="check" size={16} color="#ffffff" />}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff", marginBottom: 4 }}>
                          {type.label}
                        </Text>
                        <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
                          {type.description}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={{ gap: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#ffffff", marginBottom: 16, textAlign: "center" }}>
              Description & Mission
            </Text>
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
                Description *
              </Text>
              <TextInput
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Brief description of your organization"
                placeholderTextColor="rgba(186, 153, 136, 0.5)"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "#2a2a2a",
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  color: "#ffffff",
                  borderWidth: 1.5,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                  minHeight: 100,
                  textAlignVertical: "top",
                }}
              />
            </View>
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
                Mission Statement *
              </Text>
              <TextInput
                value={formData.mission}
                onChangeText={(text) => setFormData({ ...formData, mission: text })}
                placeholder="Your organization's mission statement"
                placeholderTextColor="rgba(186, 153, 136, 0.5)"
                multiline
                numberOfLines={5}
                style={{
                  backgroundColor: "#2a2a2a",
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  color: "#ffffff",
                  borderWidth: 1.5,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                  minHeight: 120,
                  textAlignVertical: "top",
                }}
              />
            </View>
          </View>
        );
      case 3:
        return (
          <View style={{ gap: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#ffffff", marginBottom: 16, textAlign: "center" }}>
              Location Information
            </Text>
            <InternationalAddressForm
                value={formData.address}
              onChange={(address) => setFormData({ ...formData, address: { ...formData.address, ...address } })}
              required
              defaultCountry="US"
            />
          </View>
        );
      case 4:
        return (
          <View style={{ gap: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#ffffff", marginBottom: 16, textAlign: "center" }}>
              Contact Information
            </Text>
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
                Phone Number *
              </Text>
              <TextInput
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="(555) 123-4567"
                placeholderTextColor="rgba(186, 153, 136, 0.5)"
                keyboardType="phone-pad"
                style={{
                  backgroundColor: "#2a2a2a",
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  color: "#ffffff",
                  borderWidth: 1.5,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                  minHeight: 48,
                }}
              />
            </View>
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
                Email Address *
              </Text>
              <TextInput
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="organization@example.com"
                placeholderTextColor="rgba(186, 153, 136, 0.5)"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  backgroundColor: "#2a2a2a",
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  color: "#ffffff",
                  borderWidth: 1.5,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                  minHeight: 48,
                }}
              />
            </View>
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
                Website (Optional)
              </Text>
              <TextInput
                value={formData.website}
                onChangeText={(text) => setFormData({ ...formData, website: text })}
                placeholder="www.example.com"
                placeholderTextColor="rgba(186, 153, 136, 0.5)"
                keyboardType="url"
                autoCapitalize="none"
                style={{
                  backgroundColor: "#2a2a2a",
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  color: "#ffffff",
                  borderWidth: 1.5,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                  minHeight: 48,
                }}
              />
            </View>
          </View>
        );
      case 5:
        return (
          <View style={{ gap: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#ffffff", marginBottom: 16, textAlign: "center" }}>
              Tax Identification
            </Text>
            <TaxIdSelector
              value={formData.taxIdentification}
              onChange={(taxId) => setFormData({ ...formData, taxIdentification: taxId })}
              country={formData.address.country || "US"}
              required
            />
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.6)", marginTop: 8 }}>
              Your tax ID is required for organization verification. This will be verified during the approval process.
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  const progress = (step / totalSteps) * 100;

  // Nonprofit enrollment steps
  const stepIndicatorSteps = [
    { number: 1, label: "Type" }, // Organization Information
    { number: 2, label: "Details" }, // Description & Mission
    { number: 3, label: "Location" }, // Location Information
    { number: 4, label: "Contact" }, // Contact Information
    { number: 5, label: "Tax ID" }, // Tax Identification
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#232323" }}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: 12,
          paddingBottom: 40,
        }}
      >
        <View
          style={{
            maxWidth: 600,
            width: "100%",
            alignSelf: "center",
          }}
        >
          {/* Step Indicator */}
          <StepIndicator currentStep={step} steps={stepIndicatorSteps} />

          {/* Progress Bar */}
          <View style={{ marginBottom: 32 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
              <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
                Step {step} of {totalSteps}
              </Text>
              <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
                {Math.round(progress)}% Complete
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: "#474747",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  backgroundColor: "#ba9988",
                  borderRadius: 4,
                }}
              />
            </View>
          </View>

          {/* Step Content */}
          <View style={{ marginBottom: 32 }}>{renderStepContent()}</View>

          {/* Navigation Buttons */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
            <TouchableOpacity
              onPress={handleBack}
              activeOpacity={0.8}
              style={{
                flex: 1,
                backgroundColor: "#474747",
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
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
            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={0.8}
              disabled={!validateStep() || isSubmitting}
              style={{
                flex: 1,
                backgroundColor: !validateStep() || isSubmitting ? "rgba(186, 153, 136, 0.5)" : "#ba9988",
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {isSubmitting && <ActivityIndicator size="small" color="#ffffff" />}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                {isSubmitting ? "Submitting..." : step === totalSteps ? "Submit" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

