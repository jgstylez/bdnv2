import React from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform, Alert } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { PayItForward } from "../../../../types/nonprofit";
import { useResponsive } from "../../../../hooks/useResponsive";
import { colors, spacing, typography, borderRadius } from "../../../../constants/theme";
import { formatCurrency } from "../../../../lib/international";
import { BackButton } from "../../../../components/navigation/BackButton";
import { useNonprofit } from "../../../../contexts/NonprofitContext";
import { getMockCampaign, mockDonors } from "../../../../data/mocks/campaigns";
import { getMockOrganization } from "../../../../data/mocks/organizations";
import { DonationModule } from "../../../../components/campaigns/DonationModule";

export default function CampaignDetail() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const { selectedNonprofit } = useNonprofit();
  
  const campaign = getMockCampaign(params.id || "1");
  const isOwner = true; // Mock ownership

  const handleEdit = () => {
    router.push(`/nonprofit/campaigns/edit/${campaign.id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Campaign",
      "Are you sure you want to delete this campaign? This will also remove all associated donations and data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("Deleting campaign:", campaign.id);
            router.back();
          },
        },
      ]
    );
  };

  // Early return if campaign not found
  if (!campaign) {
    return (
      <View style={{ flex: 1, backgroundColor: "#232323", justifyContent: "center", alignItems: "center" }}>
        <StatusBar style="light" />
        <Text style={{ color: "#ffffff", fontSize: 16 }}>Campaign not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginTop: 16,
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: "#ba9988",
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#ffffff", fontWeight: "600" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const daysRemaining = campaign.endDate
    ? Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Render Campaign Content JSX
  const renderCampaignContentJSX = () => (
    <>
      {/* ... Campaign Content ... */}
    </>
  );


  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <BackButton onPress={() => router.back()} />
          {isOwner && (
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <TouchableOpacity onPress={handleEdit} style={{ padding: spacing.xs }}>
                <MaterialIcons name="edit" size={24} color={colors.accent} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={{ padding: spacing.xs }}>
                <MaterialIcons name="delete" size={24} color={colors.status.error} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ... Rest of the component ... */}

      </ScrollView>

    </View>
  );
}
