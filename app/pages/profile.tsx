import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, useWindowDimensions, Platform } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

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
    "African American",
    "Afro-Caribbean",
    "Afro-Latino",
    "African",
    "Multiracial (Black)",
    "Other",
    "Prefer not to say",
  ];

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
    "Food & Beverage",
    "Real Estate",
    "Entertainment",
    "Legal",
    "Marketing & Advertising",
    "Construction",
    "Transportation",
    "Other",
    "Prefer not to say",
  ];

  const ageRanges = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+", "Prefer not to say"];

  const genders = ["Male", "Female", "Non-binary", "Other", "Prefer not to say"];

  const educationLevels = [
    "High School",
    "Some College",
    "Associate's Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate/PhD",
    "Professional Degree",
    "Other",
    "Prefer not to say",
  ];

  const hbcuList = [
    "Howard University",
    "Spelman College",
    "Morehouse College",
    "Hampton University",
    "Tuskegee University",
    "Fisk University",
    "Xavier University of Louisiana",
    "North Carolina A&T State University",
    "Florida A&M University",
    "Clark Atlanta University",
    "Other HBCU",
    "Not an HBCU graduate",
    "Prefer not to say",
  ];

  const incomeRanges = [
    "Under $25,000",
    "$25,000 - $49,999",
    "$50,000 - $74,999",
    "$75,000 - $99,999",
    "$100,000 - $149,999",
    "$150,000 - $199,999",
    "$200,000+",
    "Prefer not to say",
  ];

  const employmentStatuses = ["Employed Full-time", "Employed Part-time", "Self-employed", "Unemployed", "Retired", "Student", "Prefer not to say"];

  const householdSizes = ["1", "2", "3", "4", "5", "6+", "Prefer not to say"];

  const languages = ["English", "Spanish", "French", "Other", "Prefer not to say"];

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

  const handleSaveProfile = () => {
    // TODO: Save profile data to API
    alert("Profile updated successfully!");
  };

  const handleSaveDemographics = () => {
    // TODO: Save demographics data to API
    alert("Demographics information saved! Thank you for contributing to our case study.");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
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
                  Save Changes
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
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Ethnicity
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {ethnicities.map((ethnicity) => (
                    <TouchableOpacity
                      key={ethnicity}
                      onPress={() => setDemographicsData({ ...demographicsData, ethnicity })}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 20,
                        backgroundColor: demographicsData.ethnicity === ethnicity ? "#ba9988" : "rgba(186, 153, 136, 0.15)",
                        borderWidth: 1,
                        borderColor: demographicsData.ethnicity === ethnicity ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: demographicsData.ethnicity === ethnicity ? "#ffffff" : "#ba9988",
                        }}
                      >
                        {ethnicity}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Industry */}
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Industry
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {industries.map((industry) => (
                    <TouchableOpacity
                      key={industry}
                      onPress={() => setDemographicsData({ ...demographicsData, industry })}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 20,
                        backgroundColor: demographicsData.industry === industry ? "#ba9988" : "rgba(186, 153, 136, 0.15)",
                        borderWidth: 1,
                        borderColor: demographicsData.industry === industry ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: demographicsData.industry === industry ? "#ffffff" : "#ba9988",
                        }}
                      >
                        {industry}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Age Range */}
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Age Range
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {ageRanges.map((range) => (
                    <TouchableOpacity
                      key={range}
                      onPress={() => setDemographicsData({ ...demographicsData, ageRange: range })}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 20,
                        backgroundColor: demographicsData.ageRange === range ? "#ba9988" : "rgba(186, 153, 136, 0.15)",
                        borderWidth: 1,
                        borderColor: demographicsData.ageRange === range ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: demographicsData.ageRange === range ? "#ffffff" : "#ba9988",
                        }}
                      >
                        {range}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Gender */}
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Gender
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {genders.map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      onPress={() => setDemographicsData({ ...demographicsData, gender })}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 20,
                        backgroundColor: demographicsData.gender === gender ? "#ba9988" : "rgba(186, 153, 136, 0.15)",
                        borderWidth: 1,
                        borderColor: demographicsData.gender === gender ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: demographicsData.gender === gender ? "#ffffff" : "#ba9988",
                        }}
                      >
                        {gender}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Educational Background */}
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Educational Background
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {educationLevels.map((level) => (
                    <TouchableOpacity
                      key={level}
                      onPress={() => setDemographicsData({ ...demographicsData, educationalBackground: level })}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 20,
                        backgroundColor: demographicsData.educationalBackground === level ? "#ba9988" : "rgba(186, 153, 136, 0.15)",
                        borderWidth: 1,
                        borderColor: demographicsData.educationalBackground === level ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: demographicsData.educationalBackground === level ? "#ffffff" : "#ba9988",
                        }}
                      >
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* HBCU */}
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  HBCU (Historically Black Colleges and Universities)
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {hbcuList.map((hbcu) => (
                    <TouchableOpacity
                      key={hbcu}
                      onPress={() => setDemographicsData({ ...demographicsData, hbcu })}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 20,
                        backgroundColor: demographicsData.hbcu === hbcu ? "#ba9988" : "rgba(186, 153, 136, 0.15)",
                        borderWidth: 1,
                        borderColor: demographicsData.hbcu === hbcu ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: demographicsData.hbcu === hbcu ? "#ffffff" : "#ba9988",
                        }}
                      >
                        {hbcu}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Income Range */}
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Annual Household Income Range
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {incomeRanges.map((range) => (
                    <TouchableOpacity
                      key={range}
                      onPress={() => setDemographicsData({ ...demographicsData, incomeRange: range })}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 20,
                        backgroundColor: demographicsData.incomeRange === range ? "#ba9988" : "rgba(186, 153, 136, 0.15)",
                        borderWidth: 1,
                        borderColor: demographicsData.incomeRange === range ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: demographicsData.incomeRange === range ? "#ffffff" : "#ba9988",
                        }}
                      >
                        {range}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Employment Status */}
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Employment Status
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {employmentStatuses.map((status) => (
                    <TouchableOpacity
                      key={status}
                      onPress={() => setDemographicsData({ ...demographicsData, employmentStatus: status })}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 20,
                        backgroundColor: demographicsData.employmentStatus === status ? "#ba9988" : "rgba(186, 153, 136, 0.15)",
                        borderWidth: 1,
                        borderColor: demographicsData.employmentStatus === status ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: demographicsData.employmentStatus === status ? "#ffffff" : "#ba9988",
                        }}
                      >
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Household Size */}
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Household Size
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {householdSizes.map((size) => (
                    <TouchableOpacity
                      key={size}
                      onPress={() => setDemographicsData({ ...demographicsData, householdSize: size })}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 20,
                        backgroundColor: demographicsData.householdSize === size ? "#ba9988" : "rgba(186, 153, 136, 0.15)",
                        borderWidth: 1,
                        borderColor: demographicsData.householdSize === size ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: demographicsData.householdSize === size ? "#ffffff" : "#ba9988",
                        }}
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Preferred Language */}
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Preferred Language
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {languages.map((language) => (
                    <TouchableOpacity
                      key={language}
                      onPress={() => setDemographicsData({ ...demographicsData, preferredLanguage: language })}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 20,
                        backgroundColor: demographicsData.preferredLanguage === language ? "#ba9988" : "rgba(186, 153, 136, 0.15)",
                        borderWidth: 1,
                        borderColor: demographicsData.preferredLanguage === language ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: demographicsData.preferredLanguage === language ? "#ffffff" : "#ba9988",
                        }}
                      >
                        {language}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                onPress={handleSaveDemographics}
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
                  Save Demographics
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

