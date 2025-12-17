import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform, Alert, Switch } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Organization } from '@/types/nonprofit';
import { HeroSection } from '@/components/layouts/HeroSection';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { FormInput } from '@/components/forms';

// Mock organization data
const mockOrganization: Organization = {
  id: "org1",
  name: "Community Foundation",
  type: "nonprofit",
  status: "approved",
  ein: "12-3456789",
  description: "A community-focused nonprofit organization",
  mission: "To empower and support our local community through various programs and initiatives",
  website: "https://communityfoundation.org",
  email: "info@communityfoundation.org",
  phone: "(404) 555-0123",
  address: {
    street: "123 Community Way",
    city: "Atlanta",
    state: "GA",
    zipCode: "30309",
    country: "USA",
  },
  verified: true,
  createdAt: "2024-01-15T00:00:00Z",
  approvedAt: "2024-01-20T00:00:00Z",
  userId: "user1",
};

export default function NonprofitSettings() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { isMobile, paddingHorizontal } = useResponsive();
  const [organization, setOrganization] = useState<Organization>(mockOrganization);
  const [isEditing, setIsEditing] = useState(false);

  // Organization Information
  const [organizationName, setOrganizationName] = useState(organization.name);
  const [ein, setEin] = useState(organization.ein || "");
  const [description, setDescription] = useState(organization.description);
  const [mission, setMission] = useState(organization.mission);
  const [phone, setPhone] = useState(organization.phone || "");
  const [email, setEmail] = useState(organization.email);
  const [website, setWebsite] = useState(organization.website || "");
  const [street, setStreet] = useState(organization.address.street);
  const [city, setCity] = useState(organization.address.city);
  const [state, setState] = useState(organization.address.state);
  const [zipCode, setZipCode] = useState(organization.address.zipCode);

  // Organization Preferences
  const [isActive, setIsActive] = useState(organization.status === "active" || organization.status === "approved");
  const [acceptDonations, setAcceptDonations] = useState(true);
  const [showCampaigns, setShowCampaigns] = useState(true);
  const [allowVolunteers, setAllowVolunteers] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);

  const handleSave = () => {
    if (!organizationName.trim() || !email.trim()) {
      Alert.alert("Error", "Please fill in required fields (Organization Name and Email)");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    // TODO: Save organization settings via API
    setOrganization({
      ...organization,
      name: organizationName,
      ein: ein || undefined,
      description,
      mission,
      phone: phone || undefined,
      email,
      website: website || undefined,
      address: {
        ...organization.address,
        street,
        city,
        state,
        zipCode,
      },
      status: isActive ? "active" : organization.status,
    });
    setIsEditing(false);
    Alert.alert("Success", "Organization settings have been saved successfully");
  };

  const handleCancel = () => {
    setOrganizationName(organization.name);
    setEin(organization.ein || "");
    setDescription(organization.description);
    setMission(organization.mission);
    setPhone(organization.phone || "");
    setEmail(organization.email);
    setWebsite(organization.website || "");
    setStreet(organization.address.street);
    setCity(organization.address.city);
    setState(organization.address.state);
    setZipCode(organization.address.zipCode);
    setIsActive(organization.status === "active" || organization.status === "approved");
    setIsEditing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        {/* Hero Section */}
        <HeroSection
          title="Organization Settings"
          subtitle="Manage your organization information, preferences, and visibility"
        />

        {/* Edit Button */}
        <View style={{ marginBottom: spacing.xl, alignItems: "flex-end" }}>
          {!isEditing ? (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              style={{
                backgroundColor: colors.accent,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
                borderRadius: borderRadius.md,
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              <MaterialIcons name="edit" size={18} color={colors.text.primary} />
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.primary,
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <TouchableOpacity
                onPress={handleCancel}
                style={{
                  backgroundColor: colors.secondary.bg,
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.md,
                  borderRadius: borderRadius.md,
                  borderWidth: 1,
                  borderColor: colors.border.light,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.sm,
                }}
              >
                <MaterialIcons name="close" size={18} color={colors.text.secondary} />
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text.secondary,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={{
                  backgroundColor: colors.accent,
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.md,
                  borderRadius: borderRadius.md,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.sm,
                }}
              >
                <MaterialIcons name="check" size={18} color={colors.text.primary} />
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text.primary,
                  }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Organization Information */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.fontSize["2xl"],
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Organization Information
          </Text>
          <View
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <View style={{ gap: spacing.md }}>
              <FormInput
                label="Organization Name"
                value={organizationName}
                onChangeText={setOrganizationName}
                placeholder="Enter organization name"
                editable={isEditing}
                required
              />
              <FormInput
                label="EIN (Employer Identification Number)"
                value={ein}
                onChangeText={setEin}
                placeholder="Enter EIN"
                editable={isEditing}
              />
              <FormInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                placeholder="Enter organization description"
                editable={isEditing}
                multiline
                numberOfLines={3}
              />
              <FormInput
                label="Mission Statement"
                value={mission}
                onChangeText={setMission}
                placeholder="Enter mission statement"
                editable={isEditing}
                multiline
                numberOfLines={4}
              />
              <FormInput
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                editable={isEditing}
                keyboardType="phone-pad"
              />
              <FormInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email address"
                editable={isEditing}
                keyboardType="email-address"
                required
              />
              <FormInput
                label="Website"
                value={website}
                onChangeText={setWebsite}
                placeholder="Enter website URL"
                editable={isEditing}
                keyboardType="url"
              />
            </View>
          </View>
        </View>

        {/* Address Information */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.fontSize["2xl"],
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Address Information
          </Text>
          <View
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <View style={{ gap: spacing.md }}>
              <FormInput
                label="Street Address"
                value={street}
                onChangeText={setStreet}
                placeholder="Enter street address"
                editable={isEditing}
              />
              <View style={{ flexDirection: isMobile ? "column" : "row", gap: spacing.md }}>
                <View style={{ flex: 1 }}>
                  <FormInput
                    label="City"
                    value={city}
                    onChangeText={setCity}
                    placeholder="Enter city"
                    editable={isEditing}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <FormInput
                    label="State"
                    value={state}
                    onChangeText={setState}
                    placeholder="Enter state"
                    editable={isEditing}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <FormInput
                    label="Zip Code"
                    value={zipCode}
                    onChangeText={setZipCode}
                    placeholder="Enter zip code"
                    editable={isEditing}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Organization Preferences */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.fontSize["2xl"],
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Organization Preferences
          </Text>
          <View
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <View style={{ gap: spacing.md }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.text.primary,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Organization Active
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                    }}
                  >
                    Show your organization in the directory
                  </Text>
                </View>
                <Switch
                  value={isActive}
                  onValueChange={setIsActive}
                  trackColor={{ false: colors.secondary.bg, true: colors.accent }}
                  thumbColor={colors.text.primary}
                />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.text.primary,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Accept Donations
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                    }}
                  >
                    Allow donors to contribute to your organization
                  </Text>
                </View>
                <Switch
                  value={acceptDonations}
                  onValueChange={setAcceptDonations}
                  trackColor={{ false: colors.secondary.bg, true: colors.accent }}
                  thumbColor={colors.text.primary}
                />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.text.primary,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Show Campaigns
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                    }}
                  >
                    Display active campaigns publicly
                  </Text>
                </View>
                <Switch
                  value={showCampaigns}
                  onValueChange={setShowCampaigns}
                  trackColor={{ false: colors.secondary.bg, true: colors.accent }}
                  thumbColor={colors.text.primary}
                />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.text.primary,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Allow Volunteers
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                    }}
                  >
                    Let people sign up to volunteer
                  </Text>
                </View>
                <Switch
                  value={allowVolunteers}
                  onValueChange={setAllowVolunteers}
                  trackColor={{ false: colors.secondary.bg, true: colors.accent }}
                  thumbColor={colors.text.primary}
                />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.text.primary,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Public Profile
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                    }}
                  >
                    Make organization profile visible to everyone
                  </Text>
                </View>
                <Switch
                  value={publicProfile}
                  onValueChange={setPublicProfile}
                  trackColor={{ false: colors.secondary.bg, true: colors.accent }}
                  thumbColor={colors.text.primary}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Organization Status */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.fontSize["2xl"],
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Organization Status
          </Text>
          <View
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <View style={{ gap: spacing.md }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.text.secondary,
                  }}
                >
                  Status
                </Text>
                <View
                  style={{
                    backgroundColor:
                      organization.status === "approved" || organization.status === "active"
                        ? colors.status.success + "20"
                        : organization.status === "pending"
                        ? colors.status.warning + "20"
                        : colors.status.error + "20",
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                    borderRadius: borderRadius.md,
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.semibold,
                      color:
                        organization.status === "approved" || organization.status === "active"
                          ? colors.status.success
                          : organization.status === "pending"
                          ? colors.status.warning
                          : colors.status.error,
                      textTransform: "capitalize",
                    }}
                  >
                    {organization.status}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.text.secondary,
                  }}
                >
                  Verification Status
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                  <MaterialIcons
                    name={organization.verified ? "verified" : "verified-user"}
                    size={20}
                    color={organization.verified ? colors.status.success : colors.text.tertiary}
                  />
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.semibold,
                      color: organization.verified ? colors.status.success : colors.text.tertiary,
                    }}
                  >
                    {organization.verified ? "Verified" : "Pending"}
                  </Text>
                </View>
              </View>
              {organization.approvedAt && (
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      color: colors.text.secondary,
                    }}
                  >
                    Approved On
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                    }}
                  >
                    {new Date(organization.approvedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              )}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.text.secondary,
                  }}
                >
                  Member Since
                </Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.text.tertiary,
                  }}
                >
                  {new Date(organization.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
