import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform, TextInput, Alert, Switch } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Merchant } from '@/types/merchant';
import { HeroSection } from '@/components/layouts/HeroSection';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { FormInput, FormTextArea } from '@/components/forms';
import { InternationalAddressForm } from '@/components/forms/InternationalAddressForm';
import { InternationalAddress } from '@/types/international';
import { convertToInternationalAddress } from '@/lib/international';
import { platformValues } from "../../../utils/platform";

// Mock merchant data
const mockMerchant: Merchant = {
  id: "1",
  userId: "user1",
  name: "Soul Food Kitchen",
  type: "local-shop",
  level: "premier",
  description: "Authentic Southern cuisine",
  address: convertToInternationalAddress({
  address: "123 Main Street",
  city: "Atlanta",
  state: "GA",
  zipCode: "30309",
    country: "US",
  }),
  phone: "(404) 555-0123",
  email: "info@soulfoodkitchen.com",
  website: "www.soulfoodkitchen.com",
  category: "Restaurant",
  isVerified: true,
  isActive: true,
  blackOwnedVerificationStatus: "verified",
  createdAt: "2024-01-01T00:00:00Z",
};

export default function BusinessSettings() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { isMobile, paddingHorizontal } = useResponsive();
  const [merchant, setMerchant] = useState<Merchant>(mockMerchant);
  const [isEditing, setIsEditing] = useState(false);

  // Business Information
  const [businessName, setBusinessName] = useState(merchant.name);
  const [description, setDescription] = useState(merchant.description);
  const [category, setCategory] = useState(merchant.category);
  const [phone, setPhone] = useState(merchant.phone);
  const [email, setEmail] = useState(merchant.email);
  const [website, setWebsite] = useState(merchant.website);
  const [internationalAddress, setInternationalAddress] = useState<Partial<InternationalAddress>>(
    merchant.address || convertToInternationalAddress({
      address: merchant.address?.street || "",
      city: merchant.city || "",
      state: merchant.state,
      zipCode: merchant.zipCode || "",
      country: "US",
    })
  );

  // Business Preferences
  const [isActive, setIsActive] = useState(merchant.isActive);
  const [acceptOrders, setAcceptOrders] = useState(true);
  const [showInventory, setShowInventory] = useState(true);
  const [allowReviews, setAllowReviews] = useState(true);
  const [autoAcceptPayments, setAutoAcceptPayments] = useState(true);

  // Payment Settings
  const [acceptCash, setAcceptCash] = useState(true);
  const [acceptCard, setAcceptCard] = useState(true);
  const [acceptWallet, setAcceptWallet] = useState(true);
  const [acceptCrypto, setAcceptCrypto] = useState(false);

  // Media
  const [heroImage, setHeroImage] = useState("");
  const [imageGallery, setImageGallery] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [videoUrlInput, setVideoUrlInput] = useState("");

  const handleSave = () => {
    if (!businessName.trim() || !email.trim()) {
      Alert.alert("Error", "Please fill in required fields (Business Name and Email)");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    // TODO: Save business settings via API
    setMerchant({
      ...merchant,
      name: businessName,
      description,
      category,
      phone,
      email,
      website,
      address: internationalAddress as InternationalAddress,
      isActive,
    });
    setIsEditing(false);
    Alert.alert("Success", "Business settings have been saved successfully");
  };

  const handleCancel = () => {
    setBusinessName(merchant.name);
    setDescription(merchant.description);
    setCategory(merchant.category);
    setPhone(merchant.phone);
    setEmail(merchant.email);
    setWebsite(merchant.website);
    setInternationalAddress(
      merchant.address || convertToInternationalAddress({
        address: merchant.address?.street || "",
        city: merchant.city || "",
        state: merchant.state,
        zipCode: merchant.zipCode || "",
        country: "US",
      })
    );
    setIsActive(merchant.isActive);
    setIsEditing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <StatusBar style="light" />
      <ScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={Platform.OS === "android"}
        bounces={platformValues.scrollViewBounces}
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: platformValues.scrollViewPaddingTop,
          paddingBottom: 40,
        }}
      >
        {/* Hero Section */}
        <HeroSection
          title="Settings"
          subtitle="Manage your business information, preferences, and payment options"
        />

        {/* Edit/Save/Cancel Button */}
        <View style={{ marginBottom: spacing.xl, alignItems: "flex-end" }}>
            {!isEditing ? (
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                activeOpacity={platformValues.touchOpacity}
                hitSlop={platformValues.hitSlop}
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
                  activeOpacity={platformValues.touchOpacity}
                  hitSlop={platformValues.hitSlop}
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
                  activeOpacity={platformValues.touchOpacity}
                  hitSlop={platformValues.hitSlop}
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

        {/* Two Column Layout */}
        <View style={{ flexDirection: isMobile ? "column" : "row", gap: isMobile ? 0 : spacing.xl, alignItems: "flex-start" }}>
          {/* Column 1: Business Information */}
          <View style={{ flex: 1, minWidth: isMobile ? "100%" : 400 }}>
        {/* Business Information */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.fontSize["2xl"],
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Business Information
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
                label="Business Name"
                value={businessName}
                onChangeText={setBusinessName}
                placeholder="Enter business name"
                editable={isEditing}
                required
              />
                  <FormTextArea
                label="Description"
                value={description}
                onChangeText={setDescription}
                placeholder="Enter business description"
                editable={isEditing}
                    rows={3}
              />
              <FormInput
                label="Category"
                value={category}
                onChangeText={setCategory}
                placeholder="Enter category"
                editable={isEditing}
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
            <View style={{ marginBottom: isMobile ? 0 : spacing.xl }}>
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
                <InternationalAddressForm
                  value={internationalAddress}
                  onChange={setInternationalAddress}
                editable={isEditing}
                  required
                />
              </View>
            </View>
          </View>

          {/* Column 2: Media, Preferences, Payment, and Status */}
          <View style={{ flex: 1, minWidth: isMobile ? "100%" : 400 }}>
            {/* Hero Image */}
            <View style={{ marginBottom: spacing.xl }}>
              <Text
                style={{
                  fontSize: typography.fontSize["2xl"],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.md,
                }}
              >
                Hero Image
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
                {heroImage ? (
                  <View style={{ marginBottom: spacing.md }}>
                    <Image
                      source={{ uri: heroImage }}
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: borderRadius.md,
                        backgroundColor: colors.primary.bg,
                      }}
                      contentFit="cover"
cachePolicy="memory-disk"
                    />
                    <TouchableOpacity
                      onPress={() => setHeroImage("")}
                      style={{
                        marginTop: spacing.sm,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.xs,
                      }}
                    >
                      <MaterialIcons name="delete" size={18} color={colors.status.error} />
                      <Text style={{ fontSize: typography.fontSize.sm, color: colors.status.error }}>
                        Remove Image
                      </Text>
                    </TouchableOpacity>
                </View>
                ) : null}
                <TouchableOpacity
                  onPress={() => {
                    // TODO: Open image picker
                    Alert.alert("Image Picker", "Image picker will be implemented");
                  }}
                  style={{
                    borderWidth: 2,
                    borderStyle: "dashed",
                    borderColor: colors.border.light,
                    borderRadius: borderRadius.md,
                    padding: spacing.xl,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: heroImage ? "transparent" : colors.primary.bg,
                  }}
                >
                  <MaterialIcons name="add-photo-alternate" size={32} color={colors.text.tertiary} />
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      color: colors.text.secondary,
                      marginTop: spacing.sm,
                    }}
                  >
                    {heroImage ? "Change Hero Image" : "Upload Hero Image"}
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                      marginTop: spacing.xs,
                    }}
                  >
                    Recommended: 1920x1080px
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Image Gallery */}
            <View style={{ marginBottom: spacing.xl }}>
              <Text
                style={{
                  fontSize: typography.fontSize["2xl"],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.md,
                }}
              >
                Image Gallery
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
                {imageGallery.length > 0 && (
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginBottom: spacing.md }}>
                    {imageGallery.map((image, index) => (
                      <View key={index} style={{ position: "relative", width: 100, height: 100 }}>
                        <Image
                          source={{ uri: image }}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: borderRadius.md,
                            backgroundColor: colors.primary.bg,
                          }}
                          contentFit="cover"
cachePolicy="memory-disk"
                        />
                        <TouchableOpacity
                          onPress={() => setImageGallery(imageGallery.filter((_, i) => i !== index))}
                          style={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            backgroundColor: colors.status.error,
                            borderRadius: 12,
                            width: 24,
                            height: 24,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MaterialIcons name="close" size={16} color={colors.text.primary} />
                        </TouchableOpacity>
                </View>
                    ))}
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => {
                    // TODO: Open image picker
                    Alert.alert("Image Picker", "Image picker will be implemented");
                  }}
                  style={{
                    borderWidth: 2,
                    borderStyle: "dashed",
                    borderColor: colors.border.light,
                    borderRadius: borderRadius.md,
                    padding: spacing.lg,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.primary.bg,
                  }}
                >
                  <MaterialIcons name="add-photo-alternate" size={24} color={colors.text.tertiary} />
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.secondary,
                      marginTop: spacing.xs,
                    }}
                  >
                    Add Images
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Videos */}
            <View style={{ marginBottom: spacing.xl }}>
              <Text
                style={{
                  fontSize: typography.fontSize["2xl"],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.md,
                }}
              >
                Videos
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
                {videos.length > 0 && (
                  <View style={{ gap: spacing.md, marginBottom: spacing.md }}>
                    {videos.map((video, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: colors.primary.bg,
                          padding: spacing.md,
                          borderRadius: borderRadius.md,
                        }}
                      >
                        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, flex: 1 }}>
                          <MaterialIcons name="play-circle-filled" size={24} color={colors.accent} />
                          <Text
                            style={{
                              fontSize: typography.fontSize.sm,
                              color: colors.text.secondary,
                              flex: 1,
                            }}
                            numberOfLines={1}
                          >
                            {video}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => setVideos(videos.filter((_, i) => i !== index))}
                          style={{ padding: spacing.xs }}
                        >
                          <MaterialIcons name="delete" size={20} color={colors.status.error} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
                <View style={{ gap: spacing.md }}>
                  <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <View style={{ flex: 1 }}>
                  <FormInput
                        label="Video URL"
                        value={videoUrlInput}
                        onChangeText={setVideoUrlInput}
                        placeholder="Enter The BlackTube or video URL"
                    editable={isEditing}
                        keyboardType="url"
                        onSubmitEditing={() => {
                          if (videoUrlInput.trim()) {
                            setVideos([...videos, videoUrlInput.trim()]);
                            setVideoUrlInput("");
                          }
                        }}
                  />
                </View>
                    {isEditing && videoUrlInput.trim() && (
                      <TouchableOpacity
                        onPress={() => {
                          setVideos([...videos, videoUrlInput.trim()]);
                          setVideoUrlInput("");
                        }}
                        style={{
                          alignSelf: "flex-end",
                          backgroundColor: colors.accent,
                          paddingHorizontal: spacing.md,
                          paddingVertical: spacing.md,
                          borderRadius: borderRadius.md,
                          marginTop: 24,
                        }}
                      >
                        <MaterialIcons name="add" size={20} color={colors.text.primary} />
                      </TouchableOpacity>
                    )}
              </View>
                  <Text
                    style={{
                      fontSize: typography.fontSize.xs,
                      color: colors.text.tertiary,
                    }}
                  >
                    Add The BlackTube or other video URLs
                  </Text>
            </View>
          </View>
        </View>

        {/* Business Preferences */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.fontSize["2xl"],
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Business Preferences
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
                    Business Active
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                    }}
                  >
                    Show your business in the directory
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
                    Accept Orders
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                    }}
                  >
                    Allow customers to place orders
                  </Text>
                </View>
                <Switch
                  value={acceptOrders}
                  onValueChange={setAcceptOrders}
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
                    Show Inventory
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                    }}
                  >
                    Display product inventory to customers
                  </Text>
                </View>
                <Switch
                  value={showInventory}
                  onValueChange={setShowInventory}
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
                    Allow Reviews
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                    }}
                  >
                    Let customers leave reviews and ratings
                  </Text>
                </View>
                <Switch
                  value={allowReviews}
                  onValueChange={setAllowReviews}
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
                    Auto-Accept Payments
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                    }}
                  >
                    Automatically accept incoming payments
                  </Text>
                </View>
                <Switch
                  value={autoAcceptPayments}
                  onValueChange={setAutoAcceptPayments}
                  trackColor={{ false: colors.secondary.bg, true: colors.accent }}
                  thumbColor={colors.text.primary}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Payment Settings */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.fontSize["2xl"],
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Payment Methods
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
                    Accept Cash
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                    }}
                  >
                    Allow cash payments
                  </Text>
                </View>
                <Switch
                  value={acceptCash}
                  onValueChange={setAcceptCash}
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
                    Accept Credit/Debit Cards
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                    }}
                  >
                    Process card payments
                  </Text>
                </View>
                <Switch
                  value={acceptCard}
                  onValueChange={setAcceptCard}
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
                    Accept Digital Wallet
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                    }}
                  >
                    Accept BDN wallet payments
                  </Text>
                </View>
                <Switch
                  value={acceptWallet}
                  onValueChange={setAcceptWallet}
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
                    Accept Cryptocurrency
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                    }}
                  >
                    Accept crypto payments
                  </Text>
                </View>
                <Switch
                  value={acceptCrypto}
                  onValueChange={setAcceptCrypto}
                  trackColor={{ false: colors.secondary.bg, true: colors.accent }}
                  thumbColor={colors.text.primary}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Business Status */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.fontSize["2xl"],
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Business Status
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
                  Business Level
                </Text>
                <View
                  style={{
                    backgroundColor: merchant.level === "premier" ? "#ffd70020" : "#8d8d8d20",
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                    borderRadius: borderRadius.md,
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.semibold,
                      color: merchant.level === "premier" ? "#ffd700" : "#8d8d8d",
                      textTransform: "uppercase",
                    }}
                  >
                    {merchant.level}
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
                    name={merchant.isVerified ? "verified" : "verified-user"}
                    size={20}
                    color={merchant.isVerified ? colors.status.success : colors.text.tertiary}
                  />
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.semibold,
                      color: merchant.isVerified ? colors.status.success : colors.text.tertiary,
                    }}
                  >
                    {merchant.isVerified ? "Verified" : "Pending"}
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
                  Member Since
                </Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.text.tertiary,
                  }}
                >
                  {new Date(merchant.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

