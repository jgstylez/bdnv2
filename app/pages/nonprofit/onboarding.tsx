import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { OrganizationType } from '@/types/nonprofit';
import { InternationalAddress, CountryCode } from '@/types/international';
import { InternationalAddressForm } from '@/components/forms/InternationalAddressForm';
import { TaxIdSelector } from '@/components/forms/TaxIdSelector';
import { TaxIdentification } from '@/types/international';
import { requiresStateField } from '@/lib/international';

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

  const handleSubmit = () => {
    // TODO: Submit nonprofit onboarding application
    alert("Organization application submitted! We'll review your application and get back to you soon.");
    router.push("/pages/nonprofit/dashboard");
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={{ gap: 24 }}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#ffffff", marginBottom: 8 }}>Organization Name</Text>
              <TextInput
                value={formData.organizationName}
                onChangeText={(text) => setFormData({ ...formData, organizationName: text })}
                placeholder="Enter organization name"
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
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#ffffff", marginBottom: 16 }}>Organization Type</Text>
              <View style={{ gap: 12 }}>
                {ORGANIZATION_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    onPress={() => setFormData({ ...formData, organizationType: type.value })}
                    style={{
                      backgroundColor: formData.organizationType === type.value ? "#ba9988" : "#474747",
                      borderRadius: 12,
                      padding: 16,
                      borderWidth: 1,
                      borderColor: formData.organizationType === type.value ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                    }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff", marginBottom: 4 }}>{type.label}</Text>
                    <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>{type.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={{ gap: 24 }}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#ffffff", marginBottom: 8 }}>Description</Text>
              <TextInput
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Brief description of your organization"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  color: "#ffffff",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  minHeight: 100,
                  textAlignVertical: "top",
                }}
              />
            </View>
            <View>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#ffffff", marginBottom: 8 }}>Mission Statement</Text>
              <TextInput
                value={formData.mission}
                onChangeText={(text) => setFormData({ ...formData, mission: text })}
                placeholder="Your organization's mission statement"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                multiline
                numberOfLines={5}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  color: "#ffffff",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  minHeight: 120,
                  textAlignVertical: "top",
                }}
              />
            </View>
          </View>
        );
      case 3:
        return (
          <View style={{ gap: 24 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#ffffff", marginBottom: 8 }}>
              Organization Address
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
          <View style={{ gap: 24 }}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#ffffff", marginBottom: 8 }}>Phone</Text>
              <TextInput
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="Enter phone number"
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
            <View>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#ffffff", marginBottom: 8 }}>Email</Text>
              <TextInput
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="Enter email address"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                keyboardType="email-address"
                autoCapitalize="none"
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
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#ffffff", marginBottom: 8 }}>Website (Optional)</Text>
              <TextInput
                value={formData.website}
                onChangeText={(text) => setFormData({ ...formData, website: text })}
                placeholder="Enter website URL"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                keyboardType="url"
                autoCapitalize="none"
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
          <View style={{ gap: 24 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#ffffff", marginBottom: 8 }}>
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#232323" }}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <TouchableOpacity
            onPress={handleBack}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 24,
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
            <Text style={{ fontSize: 16, color: "#ffffff" }}>Back</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: isMobile ? 28 : 36, fontWeight: "800", color: "#ffffff", marginBottom: 8 }}>
            Organization Onboarding
          </Text>
          <Text style={{ fontSize: 16, color: "rgba(255, 255, 255, 0.7)", lineHeight: 24 }}>
            Complete the steps below to enroll your organization on BDN
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={{ marginBottom: 32 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ba9988" }}>
              Step {step} of {totalSteps}
            </Text>
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
              {Math.round((step / totalSteps) * 100)}% Complete
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
                width: `${(step / totalSteps) * 100}%`,
                backgroundColor: "#ba9988",
                borderRadius: 4,
              }}
            />
          </View>
        </View>

        {/* Step Content */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 24,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            marginBottom: 24,
          }}
        >
          {renderStepContent()}
        </View>

        {/* Navigation Buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <TouchableOpacity
            onPress={handleBack}
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
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            disabled={!validateStep()}
            style={{
              flex: 1,
              backgroundColor: validateStep() ? "#ba9988" : "#474747",
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              opacity: validateStep() ? 1 : 0.5,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>
              {step === totalSteps ? "Submit" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

