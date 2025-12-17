import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { HeroSection } from '@/components/layouts/HeroSection';
import { useResponsive } from '@/hooks/useResponsive';
import { typography, spacing } from '@/constants/theme';
import { logError } from '@/lib/logger';
import { parseDocument, RECOMMENDED_DOCUMENTS, ParsedBusinessInfo } from '@/lib/documentParser';

export default function VerifyBlackOwned() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  // Use direct calculation instead of hook to avoid web issues
  const paddingHorizontal = isMobile ? 20 : 40;

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    ownershipPercentage: "",
    documents: [] as string[], // URLs to uploaded business documents
    photoId: null as string | null, // URL to uploaded photo ID
  });

  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; uri: string }>>([]);
  const [photoIdFile, setPhotoIdFile] = useState<{ name: string; uri: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedInfo, setParsedInfo] = useState<ParsedBusinessInfo | null>(null);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        setUploadedFiles((prev) => [...prev, { name: file.name, uri: file.uri }]);
        // In production, upload to server and get URL
        setFormData((prev) => ({
          ...prev,
          documents: [...prev.documents, file.uri],
        }));

        // Parse document to extract information
        setIsParsing(true);
        try {
          const parsed = await parseDocument(file.uri, file.name);
          setParsedInfo(parsed);
          
          // Auto-fill form fields if we have high confidence data
          if (parsed.confidence > 0.7) {
            const updates: Partial<typeof formData> = {};
            
            if (parsed.businessName && !formData.businessName) {
              updates.businessName = parsed.businessName;
            }
            if (parsed.ownerName && !formData.ownerName) {
              updates.ownerName = parsed.ownerName;
            }
            
            if (Object.keys(updates).length > 0) {
              setFormData((prev) => ({ ...prev, ...updates }));
              Alert.alert(
                "Document Parsed",
                "We've extracted some information from your document and pre-filled the form. Please review and update as needed.",
                [{ text: "OK" }]
              );
            }
          } else if (parsed.confidence > 0) {
            Alert.alert(
              "Document Processing",
              "We're processing your document. Some information may be extracted automatically. Please continue filling out the form.",
              [{ text: "OK" }]
            );
          }
        } catch (parseError) {
          logError("Document parsing error", parseError, { documentType: result.type });
          // Don't show error to user, just continue
        } finally {
          setIsParsing(false);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document. Please try again.");
    }
  };

  const handleRemoveDocument = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handlePickPhotoId = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        setPhotoIdFile({ name: file.name, uri: file.uri });
        setFormData((prev) => ({
          ...prev,
          photoId: file.uri,
        }));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick photo ID. Please try again.");
    }
  };

  const handleRemovePhotoId = () => {
    setPhotoIdFile(null);
    setFormData((prev) => ({
      ...prev,
      photoId: null,
    }));
  };

  const validateForm = () => {
    if (!formData.businessName.trim()) {
      Alert.alert("Validation Error", "Business name is required");
      return false;
    }
    if (!formData.ownerName.trim()) {
      Alert.alert("Validation Error", "Owner name is required");
      return false;
    }
    if (!formData.ownerEmail.trim()) {
      Alert.alert("Validation Error", "Owner email is required");
      return false;
    }
    if (!formData.ownerPhone.trim()) {
      Alert.alert("Validation Error", "Owner phone is required");
      return false;
    }
    if (!formData.ownershipPercentage.trim()) {
      Alert.alert("Validation Error", "Ownership percentage is required");
      return false;
    }
    const percentage = parseFloat(formData.ownershipPercentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      Alert.alert("Validation Error", "Ownership percentage must be between 0 and 100");
      return false;
    }
    if (uploadedFiles.length === 0) {
      Alert.alert("Validation Error", "Please upload at least one verification document");
      return false;
    }
    if (!formData.photoId) {
      Alert.alert("Validation Error", "Please upload a photo ID");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // TODO: Submit verification request to backend
      // This would typically:
      // 1. Upload documents to storage
      // 2. Create verification request record
      // 3. Send notification to admin team
      
      Alert.alert(
        "Verification Submitted",
        "Your Black-owned business verification request has been submitted. Our team will review your documents and get back to you within 2-3 business days. You'll receive an email notification once your verification is complete.",
        [
          {
            text: "OK",
            onPress: () => {
              // Store verification status in local storage/context
              // Navigate to onboarding with verification pending status
              // Pass parsed information to onboarding for pre-filling
              const onboardingParams: Record<string, string> = {
                blackOwnedVerificationStatus: "pending",
                businessName: formData.businessName,
              };
              
              // Include parsed info if available
              if (parsedInfo) {
                if (parsedInfo.taxId) onboardingParams.taxId = parsedInfo.taxId;
                if (parsedInfo.incorporationType) onboardingParams.incorporationType = parsedInfo.incorporationType;
                if (parsedInfo.incorporationState) onboardingParams.incorporationState = parsedInfo.incorporationState;
                if (parsedInfo.incorporationDate) onboardingParams.incorporationDate = parsedInfo.incorporationDate;
              }
              
              router.push({
                pathname: "/pages/merchant/onboarding",
                params: onboardingParams,
              });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to submit verification. Please try again.");
    } finally {
      setIsSubmitting(false);
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
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 40 : 56,
          paddingBottom: 40,
        }}
      >
        <HeroSection
          title="Black-Owned Business Verification"
          subtitle="Verify your business ownership to join the BDN platform. This verification must be completed before onboarding."
        />

        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <MaterialIcons name="info" size={24} color="#ba9988" />
            <Text style={{ fontSize: typography.fontSize.base, fontWeight: "600", color: "#ffffff", flex: 1 }}>
              Why Verification is Required
            </Text>
          </View>
          <Text style={{ fontSize: typography.fontSize.sm, color: "rgba(255, 255, 255, 0.7)", lineHeight: 20 }}>
            BDN is committed to supporting Black-owned businesses. To maintain the integrity of our platform, we require
            verification of Black ownership before businesses can join. This helps ensure that our community and resources
            are directed to authentic Black-owned enterprises.
          </Text>
        </View>

        <View style={{ gap: 20 }}>
          <View>
            <Text style={{ fontSize: typography.fontSize.sm, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
              Business Name *
            </Text>
            <TextInput
              value={formData.businessName}
              onChangeText={(text) => setFormData({ ...formData, businessName: text })}
              placeholder="Enter your business name"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              style={{
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 16,
                fontSize: typography.fontSize.base,
                color: "#ffffff",
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            />
          </View>

          <View>
            <Text style={{ fontSize: typography.fontSize.sm, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
              Owner Name *
            </Text>
            <TextInput
              value={formData.ownerName}
              onChangeText={(text) => setFormData({ ...formData, ownerName: text })}
              placeholder="Full name of business owner"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              style={{
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 16,
                fontSize: typography.fontSize.base,
                color: "#ffffff",
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            />
          </View>

          <View style={{ flexDirection: isMobile ? "column" : "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: typography.fontSize.sm, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
                Owner Email *
              </Text>
              <TextInput
                value={formData.ownerEmail}
                onChangeText={(text) => setFormData({ ...formData, ownerEmail: text })}
                placeholder="owner@example.com"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  backgroundColor: "#232323",
                  borderRadius: 12,
                  padding: 16,
                  fontSize: typography.fontSize.base,
                  color: "#ffffff",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: typography.fontSize.sm, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
                Owner Phone *
              </Text>
              <TextInput
                value={formData.ownerPhone}
                onChangeText={(text) => setFormData({ ...formData, ownerPhone: text })}
                placeholder="(555) 123-4567"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                keyboardType="phone-pad"
                style={{
                  backgroundColor: "#232323",
                  borderRadius: 12,
                  padding: 16,
                  fontSize: typography.fontSize.base,
                  color: "#ffffff",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              />
            </View>
          </View>

          <View>
            <Text style={{ fontSize: typography.fontSize.sm, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
              Ownership Percentage *
            </Text>
            <TextInput
              value={formData.ownershipPercentage}
              onChangeText={(text) => setFormData({ ...formData, ownershipPercentage: text })}
              placeholder="e.g., 100"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              keyboardType="numeric"
              style={{
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 16,
                fontSize: typography.fontSize.base,
                color: "#ffffff",
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            />
            <Text style={{ fontSize: typography.fontSize.xs, color: "rgba(255, 255, 255, 0.5)", marginTop: 4 }}>
              Percentage of business owned by Black individuals (0-100)
            </Text>
          </View>

          <View>
            <Text style={{ fontSize: typography.fontSize.sm, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
              Owner Photo ID *
            </Text>
            <Text style={{ fontSize: typography.fontSize.xs, color: "rgba(255, 255, 255, 0.5)", marginBottom: 12 }}>
              Upload a clear photo of a government-issued ID (driver's license, passport, or state ID) to verify your identity.
            </Text>

            {photoIdFile ? (
              <View
                style={{
                  backgroundColor: "#232323",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                    <MaterialIcons name="badge" size={20} color="#ba9988" />
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: "#ffffff",
                        flex: 1,
                      }}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {photoIdFile.name}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={handleRemovePhotoId}>
                    <MaterialIcons name="close" size={20} color="rgba(255, 255, 255, 0.5)" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handlePickPhotoId}
                style={{
                  backgroundColor: "#232323",
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 2,
                  borderStyle: "dashed",
                  borderColor: "rgba(186, 153, 136, 0.3)",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                <MaterialIcons name="badge" size={20} color="#ba9988" />
                <Text style={{ fontSize: typography.fontSize.base, fontWeight: "600", color: "#ba9988" }}>
                  Upload Photo ID
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View>
            <Text style={{ fontSize: typography.fontSize.sm, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
              Verification Documents *
            </Text>
            <Text style={{ fontSize: typography.fontSize.xs, color: "rgba(255, 255, 255, 0.5)", marginBottom: 12 }}>
              Upload documents that verify Black ownership. We recommend uploading your{" "}
              <Text style={{ fontWeight: "600", color: "#ba9988" }}>
                Articles of Incorporation
              </Text>
              {" "}as it contains the most complete information and will auto-fill your form.
            </Text>
            
            {/* Recommended Documents Info */}
            <View
              style={{
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <MaterialIcons name="lightbulb" size={16} color="#ba9988" />
                <Text style={{ fontSize: typography.fontSize.xs, fontWeight: "600", color: "#ba9988" }}>
                  Best Documents for Auto-Fill
                </Text>
              </View>
              <View style={{ gap: 6 }}>
                {RECOMMENDED_DOCUMENTS.slice(0, 2).map((doc, index) => (
                  <View key={index} style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
                    <MaterialIcons
                      name={index === 0 ? "star" : "description"}
                      size={14}
                      color={index === 0 ? "#ba9988" : "rgba(255, 255, 255, 0.5)"}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: typography.fontSize.xs, fontWeight: "600", color: "#ffffff" }}>
                        {doc.type}
                      </Text>
                      <Text style={{ fontSize: typography.fontSize.xs, color: "rgba(255, 255, 255, 0.5)" }}>
                        {doc.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {uploadedFiles.length > 0 && (
              <View style={{ gap: 8, marginBottom: 12 }}>
                {uploadedFiles.map((file, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      padding: 12,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                      <MaterialIcons name="description" size={20} color="#ba9988" />
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: "#ffffff",
                          flex: 1,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="middle"
                      >
                        {file.name}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleRemoveDocument(index)}>
                      <MaterialIcons name="close" size={20} color="rgba(255, 255, 255, 0.5)" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              onPress={handlePickDocument}
              disabled={isParsing}
              style={{
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 16,
                borderWidth: 2,
                borderStyle: "dashed",
                borderColor: isParsing ? "rgba(186, 153, 136, 0.5)" : "rgba(186, 153, 136, 0.3)",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
                opacity: isParsing ? 0.6 : 1,
              }}
            >
              {isParsing ? (
                <>
                  <ActivityIndicator size="small" color="#ba9988" />
                  <Text style={{ fontSize: typography.fontSize.base, fontWeight: "600", color: "#ba9988" }}>
                    Processing Document...
                  </Text>
                </>
              ) : (
                <>
                  <MaterialIcons name="cloud-upload" size={20} color="#ba9988" />
                  <Text style={{ fontSize: typography.fontSize.base, fontWeight: "600", color: "#ba9988" }}>
                    Upload Document
                  </Text>
                </>
              )}
            </TouchableOpacity>
            
            {parsedInfo && parsedInfo.confidence > 0 && (
              <View
                style={{
                  backgroundColor: parsedInfo.confidence > 0.7 ? "rgba(76, 175, 80, 0.1)" : "rgba(255, 152, 0, 0.1)",
                  borderRadius: 12,
                  padding: 12,
                  marginTop: 12,
                  borderWidth: 1,
                  borderColor: parsedInfo.confidence > 0.7 ? "rgba(76, 175, 80, 0.3)" : "rgba(255, 152, 0, 0.3)",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <MaterialIcons
                    name={parsedInfo.confidence > 0.7 ? "check-circle" : "info"}
                    size={16}
                    color={parsedInfo.confidence > 0.7 ? "#4caf50" : "#ff9800"}
                  />
                  <Text
                    style={{
                      fontSize: typography.fontSize.xs,
                      fontWeight: "600",
                      color: parsedInfo.confidence > 0.7 ? "#4caf50" : "#ff9800",
                    }}
                  >
                    {parsedInfo.confidence > 0.7
                      ? "Information Extracted Successfully"
                      : "Document Processed (Low Confidence)"}
                  </Text>
                </View>
                <Text style={{ fontSize: typography.fontSize.xs, color: "rgba(255, 255, 255, 0.7)" }}>
                  {parsedInfo.confidence > 0.7
                    ? "Form fields have been pre-filled. Please review and update as needed."
                    : "Some information may have been extracted. Please verify all fields."}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 12, marginTop: 32 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              flex: 1,
              backgroundColor: "#474747",
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: typography.fontSize.base, fontWeight: "600", color: "#ffffff" }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={{
              flex: 1,
              backgroundColor: isSubmitting ? "#666666" : "#ba9988",
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: typography.fontSize.base, fontWeight: "600", color: "#ffffff" }}>
              {isSubmitting ? "Submitting..." : "Submit Verification"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

