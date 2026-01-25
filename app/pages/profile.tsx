import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, useWindowDimensions, Platform, Alert, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';
import { FormSelect } from '@/components/forms/FormSelect';
import { BackButton } from '@/components/navigation/BackButton';
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { useLoading } from '@/hooks/useLoading';

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "(555) 123-4567",
  location: {
    city: "Atlanta",
    state: "GA",
    zipCode: "30309",
    country: "United States",
  },
  profileImage: null,
};

export default function Profile() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [activeSection, setActiveSection] = useState<"profile" | "demographics">("profile");
  const [profileData, setProfileData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
    city: mockUser.location.city,
    state: mockUser.location.state,
    zipCode: mockUser.location.zipCode,
    country: mockUser.location.country,
    profileImage: mockUser.profileImage as string | null,
  });
  const [demographicsData, setDemographicsData] = useState({
    ethnicity: "",
    industry: "",
    ageRange: "",
    gender: "",
    educationalBackground: "",
    hbcu: "",
    incomeRange: "",
    employmentStatus: "",
    householdSize: "",
    preferredLanguage: "",
  });

  const ethnicities = [
    { label: "African American", value: "African American" },
    { label: "Afro-Caribbean", value: "Afro-Caribbean" },
    { label: "Afro-Latino", value: "Afro-Latino" },
    { label: "African", value: "African" },
    { label: "Multiracial (Black)", value: "Multiracial (Black)" },
    { label: "Other", value: "Other" },
    { label: "Prefer not to say", value: "Prefer not to say" },
  ];

  const industries = [
    { label: "Technology", value: "Technology" },
    { label: "Healthcare", value: "Healthcare" },
    { label: "Finance", value: "Finance" },
    { label: "Education", value: "Education" },
    { label: "Retail", value: "Retail" },
    { label: "Food & Beverage", value: "Food & Beverage" },
    { label: "Real Estate", value: "Real Estate" },
    { label: "Entertainment", value: "Entertainment" },
    { label: "Legal", value: "Legal" },
    { label: "Marketing & Advertising", value: "Marketing & Advertising" },
    { label: "Construction", value: "Construction" },
    { label: "Transportation", value: "Transportation" },
    { label: "Other", value: "Other" },
    { label: "Prefer not to say", value: "Prefer not to say" },
  ];

  const ageRanges = [
    { label: "18-24", value: "18-24" },
    { label: "25-34", value: "25-34" },
    { label: "35-44", value: "35-44" },
    { label: "45-54", value: "45-54" },
    { label: "55-64", value: "55-64" },
    { label: "65+", value: "65+" },
    { label: "Prefer not to say", value: "Prefer not to say" },
  ];

  const genders = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Non-binary", value: "Non-binary" },
    { label: "Other", value: "Other" },
    { label: "Prefer not to say", value: "Prefer not to say" },
  ];

  const educationLevels = [
    { label: "High School", value: "High School" },
    { label: "Some College", value: "Some College" },
    { label: "Associate's Degree", value: "Associate's Degree" },
    { label: "Bachelor's Degree", value: "Bachelor's Degree" },
    { label: "Master's Degree", value: "Master's Degree" },
    { label: "Doctorate/PhD", value: "Doctorate/PhD" },
    { label: "Professional Degree", value: "Professional Degree" },
    { label: "Other", value: "Other" },
    { label: "Prefer not to say", value: "Prefer not to say" },
  ];

  const hbcuList = [
    { label: "Howard University", value: "Howard University" },
    { label: "Spelman College", value: "Spelman College" },
    { label: "Morehouse College", value: "Morehouse College" },
    { label: "Hampton University", value: "Hampton University" },
    { label: "Tuskegee University", value: "Tuskegee University" },
    { label: "Fisk University", value: "Fisk University" },
    { label: "Xavier University of Louisiana", value: "Xavier University of Louisiana" },
    { label: "North Carolina A&T State University", value: "North Carolina A&T State University" },
    { label: "Florida A&M University", value: "Florida A&M University" },
    { label: "Clark Atlanta University", value: "Clark Atlanta University" },
    { label: "Other HBCU", value: "Other HBCU" },
    { label: "Not an HBCU graduate", value: "Not an HBCU graduate" },
    { label: "Prefer not to say", value: "Prefer not to say" },
  ];

  const incomeRanges = [
    { label: "Under $25,000", value: "Under $25,000" },
    { label: "$25,000 - $49,999", value: "$25,000 - $49,999" },
    { label: "$50,000 - $74,999", value: "$50,000 - $74,999" },
    { label: "$75,000 - $99,999", value: "$75,000 - $99,999" },
    { label: "$100,000 - $149,999", value: "$100,000 - $149,999" },
    { label: "$150,000 - $199,999", value: "$150,000 - $199,999" },
    { label: "$200,000+", value: "$200,000+" },
    { label: "Prefer not to say", value: "Prefer not to say" },
  ];

  const employmentStatuses = [
    { label: "Employed Full-time", value: "Employed Full-time" },
    { label: "Employed Part-time", value: "Employed Part-time" },
    { label: "Self-employed", value: "Self-employed" },
    { label: "Unemployed", value: "Unemployed" },
    { label: "Retired", value: "Retired" },
    { label: "Student", value: "Student" },
    { label: "Prefer not to say", value: "Prefer not to say" },
  ];

  const householdSizes = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6+", value: "6+" },
    { label: "Prefer not to say", value: "Prefer not to say" },
  ];

  const languages = [
    { label: "English", value: "English" },
    { label: "Spanish", value: "Spanish" },
    { label: "French", value: "French" },
    { label: "Other", value: "Other" },
    { label: "Prefer not to say", value: "Prefer not to say" },
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to update your profile picture!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileData({ ...profileData, profileImage: result.assets[0].uri });
    }
  };

  const { loading: savingProfile, execute: executeSaveProfile } = useLoading();
  const { loading: savingDemographics, execute: executeSaveDemographics } = useLoading();

  const handleSaveProfile = async () => {
    try {
      await executeSaveProfile(async () => {
        // Prepare profile data for API
        const profilePayload = {
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          location: {
            city: profileData.city,
            state: profileData.state,
            zipCode: profileData.zipCode,
            country: profileData.country,
          },
          profileImage: profileData.profileImage,
        };

        // Upload profile image if changed
        let imageUrl = profileData.profileImage;
        if (profileData.profileImage && profileData.profileImage.startsWith('file://')) {
          // TODO: Upload image to storage service and get URL
          // For now, we'll just send the local URI
          logger.info('Profile image upload would happen here', { imageUri: profileData.profileImage });
        }

        // Save profile data
        const response = await api.put('/account/profile', profilePayload);
        logger.info('Profile updated successfully', { response });
        return response;
      });

      if (!savingProfile) {
        showSuccessToast("Profile Updated", "Your profile has been updated successfully!");
      }
    } catch (error: any) {
      logger.error('Failed to save profile', error);
      showErrorToast(
        "Failed to Update Profile",
        error?.message || "Please check your information and try again"
      );
    }
  };

  const handleSaveDemographics = async () => {
    try {
      await executeSaveDemographics(async () => {
        const demographicsPayload = {
          ethnicity: demographicsData.ethnicity,
          industry: demographicsData.industry,
          ageRange: demographicsData.ageRange,
          gender: demographicsData.gender,
          educationalBackground: demographicsData.educationalBackground,
          hbcu: demographicsData.hbcu,
          incomeRange: demographicsData.incomeRange,
          employmentStatus: demographicsData.employmentStatus,
          householdSize: demographicsData.householdSize,
          preferredLanguage: demographicsData.preferredLanguage,
        };

        const response = await api.put('/account/demographics', demographicsPayload);
        logger.info('Demographics saved successfully', { response });
        return response;
      });

      if (!savingDemographics) {
        showSuccessToast(
          "Demographics Saved",
          "Thank you for contributing to our case study!"
        );
      }
    } catch (error: any) {
      logger.error('Failed to save demographics', error);
      showErrorToast(
        "Failed to Save Demographics",
        error?.message || "Please try again"
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <OptimizedScrollView
        showBackToTop={true}
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        <BackButton 
          textColor="#ffffff"
          iconColor="#ffffff"
          onPress={() => {
            router.back();
          }}
        />
        {/* Section Selector */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#474747",
            borderRadius: 12,
            padding: 4,
            marginBottom: 24,
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveSection("profile")}
            style={{
              flex: 1,
              backgroundColor: activeSection === "profile" ? "#ba9988" : "transparent",
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: activeSection === "profile" ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
              }}
            >
              Profile Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveSection("demographics")}
            style={{
              flex: 1,
              backgroundColor: activeSection === "demographics" ? "#ba9988" : "transparent",
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: activeSection === "demographics" ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
              }}
            >
              Demographics
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Details Section */}
        {activeSection === "profile" && (
          <View style={{ gap: 24 }}>
            <View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Edit Profile
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                Update your personal information and profile picture.
              </Text>
            </View>

            {/* Profile Picture */}
            <View
              style={{
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={pickImage} style={{ alignItems: "center" }}>
                {profileData.profileImage ? (
                  <Image
                    source={{ uri: profileData.profileImage }}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 60,
                      marginBottom: 12,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 60,
                      backgroundColor: "#ba9988",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Text style={{ fontSize: 48, fontWeight: "700", color: "#ffffff" }}>
                      {profileData.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ba9988",
                  }}
                >
                  Change Photo
                </Text>
              </TouchableOpacity>
            </View>

            {/* Profile Form */}
            <View
              style={{
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                gap: 20,
              }}
            >
              {/* Name */}
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Full Name
                </Text>
                <TextInput
                  value={profileData.name}
                  onChangeText={(text) => setProfileData({ ...profileData, name: text })}
                  placeholder="Enter your full name"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 16,
                    color: "#ffffff",
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                />
              </View>

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
                  Email Address
                </Text>
                <TextInput
                  value={profileData.email}
                  onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                  placeholder="your.email@example.com"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 16,
                    color: "#ffffff",
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                />
              </View>

              {/* Phone */}
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Phone Number
                </Text>
                <TextInput
                  value={profileData.phone}
                  onChangeText={(text) => setProfileData({ ...profileData, phone: text })}
                  placeholder="(555) 123-4567"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  keyboardType="phone-pad"
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 16,
                    color: "#ffffff",
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                />
              </View>

              {/* Location */}
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Location
                </Text>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <View style={{ flex: 2 }}>
                    <TextInput
                      value={profileData.city}
                      onChangeText={(text) => setProfileData({ ...profileData, city: text })}
                      placeholder="City"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      style={{
                        backgroundColor: "#232323",
                        borderRadius: 12,
                        padding: 16,
                        color: "#ffffff",
                        fontSize: 14,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextInput
                      value={profileData.state}
                      onChangeText={(text) => setProfileData({ ...profileData, state: text })}
                      placeholder="State"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      style={{
                        backgroundColor: "#232323",
                        borderRadius: 12,
                        padding: 16,
                        color: "#ffffff",
                        fontSize: 14,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextInput
                      value={profileData.zipCode}
                      onChangeText={(text) => setProfileData({ ...profileData, zipCode: text })}
                      placeholder="ZIP"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      keyboardType="numeric"
                      style={{
                        backgroundColor: "#232323",
                        borderRadius: 12,
                        padding: 16,
                        color: "#ffffff",
                        fontSize: 14,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                      }}
                    />
                  </View>
                </View>
              </View>

              {/* Country */}
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Country
                </Text>
                <TextInput
                  value={profileData.country}
                  onChangeText={(text) => setProfileData({ ...profileData, country: text })}
                  placeholder="United States"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 16,
                    color: "#ffffff",
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                onPress={handleSaveProfile}
                disabled={savingProfile}
                style={{
                  backgroundColor: savingProfile ? "#474747" : "#ba9988",
                  borderRadius: 12,
                  paddingVertical: 16,
                  alignItems: "center",
                  marginTop: 8,
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {savingProfile && (
                  <ActivityIndicator size="small" color="#ffffff" />
                )}
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Demographics Section */}
        {activeSection === "demographics" && (
          <View style={{ gap: 24 }}>
            <View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Demographics Case Study
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                  lineHeight: 20,
                  marginBottom: 4,
                }}
              >
                Help us trace the flow of Black dollars within our communities. Your participation in this case study is optional but highly recommended.
              </Text>
              <View
                style={{
                  backgroundColor: "rgba(186, 153, 136, 0.15)",
                  borderRadius: 12,
                  padding: 16,
                  marginTop: 12,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: "#ba9988",
                    lineHeight: 18,
                  }}
                >
                  <MaterialIcons name="info" size={16} color="#ba9988" style={{ marginRight: 4 }} />
                  This data helps us analyze economic patterns, support Black-owned businesses, and provide valuable insights for community development. All information is kept confidential and used solely for research purposes.
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                gap: 20,
              }}
            >
              {/* Ethnicity */}
              <FormSelect
                label="Ethnicity"
                value={demographicsData.ethnicity}
                options={ethnicities}
                onSelect={(value) => setDemographicsData({ ...demographicsData, ethnicity: value })}
                placeholder="Select ethnicity"
              />

              {/* Industry */}
              <FormSelect
                label="Industry"
                value={demographicsData.industry}
                options={industries}
                onSelect={(value) => setDemographicsData({ ...demographicsData, industry: value })}
                placeholder="Select industry"
              />

              {/* Age Range */}
              <FormSelect
                label="Age Range"
                value={demographicsData.ageRange}
                options={ageRanges}
                onSelect={(value) => setDemographicsData({ ...demographicsData, ageRange: value })}
                placeholder="Select age range"
              />

              {/* Gender */}
              <FormSelect
                label="Gender"
                value={demographicsData.gender}
                options={genders}
                onSelect={(value) => setDemographicsData({ ...demographicsData, gender: value })}
                placeholder="Select gender"
              />

              {/* Educational Background */}
              <FormSelect
                label="Educational Background"
                value={demographicsData.educationalBackground}
                options={educationLevels}
                onSelect={(value) => setDemographicsData({ ...demographicsData, educationalBackground: value })}
                placeholder="Select educational background"
              />

              {/* HBCU */}
              <FormSelect
                label="HBCU (Historically Black Colleges and Universities)"
                value={demographicsData.hbcu}
                options={hbcuList}
                onSelect={(value) => setDemographicsData({ ...demographicsData, hbcu: value })}
                placeholder="Select HBCU"
              />

              {/* Income Range */}
              <FormSelect
                label="Annual Household Income Range"
                value={demographicsData.incomeRange}
                options={incomeRanges}
                onSelect={(value) => setDemographicsData({ ...demographicsData, incomeRange: value })}
                placeholder="Select income range"
              />

              {/* Employment Status */}
              <FormSelect
                label="Employment Status"
                value={demographicsData.employmentStatus}
                options={employmentStatuses}
                onSelect={(value) => setDemographicsData({ ...demographicsData, employmentStatus: value })}
                placeholder="Select employment status"
              />

              {/* Household Size */}
              <FormSelect
                label="Household Size"
                value={demographicsData.householdSize}
                options={householdSizes}
                onSelect={(value) => setDemographicsData({ ...demographicsData, householdSize: value })}
                placeholder="Select household size"
              />

              {/* Preferred Language */}
              <FormSelect
                label="Preferred Language"
                value={demographicsData.preferredLanguage}
                options={languages}
                onSelect={(value) => setDemographicsData({ ...demographicsData, preferredLanguage: value })}
                placeholder="Select preferred language"
              />

              {/* Save Button */}
              <TouchableOpacity
                onPress={handleSaveDemographics}
                disabled={savingDemographics}
                style={{
                  backgroundColor: savingDemographics ? "#474747" : "#ba9988",
                  borderRadius: 12,
                  paddingVertical: 16,
                  alignItems: "center",
                  marginTop: 8,
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {savingDemographics && (
                  <ActivityIndicator size="small" color="#ffffff" />
                )}
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  {savingDemographics ? "Saving..." : "Save Demographics"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </OptimizedScrollView>
    </View>
  );
}

