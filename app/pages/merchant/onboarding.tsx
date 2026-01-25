import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { MerchantType } from '@/types/merchant';
import { InternationalAddress, CountryCode, Currency } from '@/types/international';
import { InternationalAddressForm } from '@/components/forms/InternationalAddressForm';
import { CurrencySelector } from '@/components/forms/CurrencySelector';
import { TaxIdSelector } from '@/components/forms/TaxIdSelector';
import { TaxIdentification } from '@/types/international';
import { requiresStateField } from '@/lib/international';
import { BUSINESS_CATEGORIES } from '@/constants/categories';
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import { useLoading } from '@/hooks/useLoading';
import { StepIndicator } from '@/components/StepIndicator';

const MERCHANT_TYPES: { value: MerchantType; label: string; description: string }[] = [
  { value: "local-shop", label: "Local Shop", description: "Physical retail location" },
  { value: "local-service", label: "Local Service", description: "Service-based business" },
  { value: "national-service", label: "National Service", description: "Service across multiple locations" },
  { value: "online-shopping", label: "Online Shopping", description: "E-commerce business" },
  { value: "restaurant", label: "Restaurant", description: "Food service establishment" },
];

export default function MerchantOnboarding() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const params = useLocalSearchParams<{ blackOwnedVerificationStatus?: string; businessName?: string }>();
  const isMobile = width < 768;
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Check if Black-owned verification is required
  useEffect(() => {
    // In production, check verification status from backend/context
    // For now, if no status is provided, redirect to verification
    if (!params.blackOwnedVerificationStatus) {
      Alert.alert(
        "Verification Required",
        "You must complete Black-owned business verification before proceeding with onboarding.",
        [
          {
            text: "Go to Verification",
            onPress: () => router.replace("/pages/merchant/verify-black-owned"),
          },
        ]
      );
    }
  }, [params.blackOwnedVerificationStatus]);

  const [formData, setFormData] = useState({
    businessName: params.businessName || "",
    merchantTypes: [] as MerchantType[],
    category: "",
    description: "",
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
    hours: "",
    taxIdentification: {
      type: "EIN" as TaxIdentification["type"],
      number: "",
      country: "US" as CountryCode,
    } as TaxIdentification,
    currency: "USD" as Currency,
    isIncorporated: false,
    incorporationType: "" as "llc" | "corporation" | "partnership" | "sole-proprietorship" | "nonprofit" | "",
    incorporationState: "",
    incorporationDate: "",
  });

  const categories = [...BUSINESS_CATEGORIES];

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
        return formData.businessName.trim() !== "" && formData.merchantTypes.length > 0;
      case 2:
        return formData.category.trim() !== "" && formData.description.trim() !== "";
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
        return formData.isIncorporated ? (formData.incorporationType !== "" && formData.incorporationState !== "") : true;
      case 6:
        return formData.hours.trim() !== "" && formData.taxIdentification.number.trim() !== "";
      default:
        return false;
    }
  };

  const toggleMerchantType = (type: MerchantType) => {
    setFormData((prev) => {
      const currentTypes = prev.merchantTypes;
      if (currentTypes.includes(type)) {
        return { ...prev, merchantTypes: currentTypes.filter((t) => t !== type) };
      } else {
        return { ...prev, merchantTypes: [...currentTypes, type] };
      }
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!validateStep()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare onboarding data
      const onboardingData = {
        businessName: formData.businessName,
        merchantTypes: formData.merchantTypes,
        category: formData.category,
        description: formData.description,
        address: formData.address,
        phone: formData.phone,
        phoneCountryCode: formData.phoneCountryCode,
        email: formData.email,
        website: formData.website,
        hours: formData.hours,
        taxIdentification: formData.taxIdentification,
        currency: formData.currency,
        isIncorporated: formData.isIncorporated,
        incorporationType: formData.incorporationType || undefined,
        incorporationState: formData.incorporationState || undefined,
        incorporationDate: formData.incorporationDate || undefined,
        blackOwnedVerificationStatus: params.blackOwnedVerificationStatus || "pending",
      };

      // Submit onboarding application
      const response = await api.post('/businesses/onboarding', onboardingData);
      
      logger.info('Business onboarding submitted', { 
        businessName: formData.businessName,
        applicationId: response.data?.id 
      });

      Alert.alert(
        "Application Submitted",
        "Your business application has been submitted! We'll review your application and get back to you soon. You'll receive an email notification once your application is reviewed.",
        [
          {
            text: "OK",
            onPress: () => router.push("/pages/merchant/dashboard"),
          },
        ]
      );
    } catch (error: any) {
      logger.error('Failed to submit business onboarding', error);
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
              Business Information
            </Text>
            {formData.businessName ? (
              <View
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600", color: "rgba(255, 255, 255, 0.6)", marginBottom: 4 }}>
                  Business Name
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff", flex: 1 }}>
                    {formData.businessName}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setFormData({ ...formData, businessName: "" })}
                    style={{ padding: 4 }}
                  >
                    <MaterialIcons name="edit" size={18} color="#ba9988" />
                  </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.5)", marginTop: 4 }}>
                  Pre-filled from verification. Tap edit to change.
                </Text>
              </View>
            ) : (
              <View>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
                  Business Name *
                </Text>
                <TextInput
                  value={formData.businessName}
                  onChangeText={(text) => setFormData({ ...formData, businessName: text })}
                  placeholder="Enter business name"
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
            )}
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
                Merchant Type * (Select all that apply)
              </Text>
              <View style={{ gap: 12 }}>
                {MERCHANT_TYPES.map((type) => {
                  const isSelected = formData.merchantTypes.includes(type.value);
                  return (
                    <TouchableOpacity
                      key={type.value}
                      onPress={() => toggleMerchantType(type.value)}
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
              Category & Description
            </Text>
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
                Category *
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setFormData({ ...formData, category: cat })}
                    style={{
                      backgroundColor: formData.category === cat ? "#ba9988" : "#474747",
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: formData.category === cat ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
                Description *
              </Text>
              <TextInput
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Describe your business"
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
                placeholder="business@example.com"
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
              Incorporation Status
            </Text>
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 12 }}>
                Is your business incorporated? *
              </Text>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, isIncorporated: true })}
                  style={{
                    flex: 1,
                    backgroundColor: formData.isIncorporated ? "#ba9988" : "#474747",
                    borderRadius: 12,
                    padding: 16,
                    alignItems: "center",
                    borderWidth: 2,
                    borderColor: formData.isIncorporated ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, isIncorporated: false, incorporationType: "", incorporationState: "", incorporationDate: "" })}
                  style={{
                    flex: 1,
                    backgroundColor: !formData.isIncorporated ? "#ba9988" : "#474747",
                    borderRadius: 12,
                    padding: 16,
                    alignItems: "center",
                    borderWidth: 2,
                    borderColor: !formData.isIncorporated ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
            {formData.isIncorporated && (
              <>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
                    Incorporation Type *
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {["LLC", "Corporation", "Partnership", "Sole Proprietorship", "Nonprofit"].map((type) => {
                      const value = type.toLowerCase().replace(" ", "-") as "llc" | "corporation" | "partnership" | "sole-proprietorship" | "nonprofit";
                      return (
                        <TouchableOpacity
                          key={type}
                          onPress={() => setFormData({ ...formData, incorporationType: value })}
                          style={{
                            backgroundColor: formData.incorporationType === value ? "#ba9988" : "#474747",
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            borderRadius: 8,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "600",
                              color: formData.incorporationType === value ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            {type}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
                    State of Incorporation *
                  </Text>
                  <TextInput
                    value={formData.incorporationState}
                    onChangeText={(text) => setFormData({ ...formData, incorporationState: text })}
                    placeholder="e.g., Delaware, California"
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
                    Date of Incorporation (Optional)
                  </Text>
                  <TextInput
                    value={formData.incorporationDate}
                    onChangeText={(text) => setFormData({ ...formData, incorporationDate: text })}
                    placeholder="YYYY-MM-DD"
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
              </>
            )}
          </View>
        );
      case 6:
        return (
          <View style={{ gap: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#ffffff", marginBottom: 16, textAlign: "center" }}>
              Additional Details
            </Text>
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
                Business Hours *
              </Text>
              <TextInput
                value={formData.hours}
                onChangeText={(text) => setFormData({ ...formData, hours: text })}
                placeholder="Mon-Fri: 9am-5pm, Sat: 10am-3pm"
                placeholderTextColor="rgba(186, 153, 136, 0.5)"
                multiline
                numberOfLines={3}
                style={{
                  backgroundColor: "#2a2a2a",
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  color: "#ffffff",
                  borderWidth: 1.5,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                  minHeight: 80,
                  textAlignVertical: "top",
                }}
              />
            </View>
            <CurrencySelector
              value={formData.currency}
              onChange={(currency) => setFormData({ ...formData, currency })}
              showBLKD={true}
            />
            <TaxIdSelector
              value={formData.taxIdentification}
              onChange={(taxId) => setFormData({ ...formData, taxIdentification: taxId })}
              country={formData.address.country || "US"}
              required
            />
          </View>
        );
      default:
        return null;
    }
  };

  const progress = (step / totalSteps) * 100;

  // Business enrollment steps
  const stepIndicatorSteps = [
    { number: 1, label: "Type" }, // Business Information
    { number: 2, label: "Details" }, // Category & Description
    { number: 3, label: "Location" }, // Location Information
    { number: 4, label: "Contact" }, // Contact Information
    { number: 5, label: "Legal" }, // Incorporation Status
    { number: 6, label: "Review" }, // Additional Details
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

