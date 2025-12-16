import React from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
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

  if (!campaign) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background.primary, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.text.primary }}>Campaign not found</Text>
      </View>
    );
  }

  // Render Campaign Content JSX
  const renderCampaignContentJSX = () => (
    <>
      {/* Description */}
      <View style={{ marginTop: spacing.xl, marginBottom: spacing.lg }}>
        <Text
          style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            marginBottom: spacing.md,
          }}
        >
          About This Campaign
        </Text>
        <Text
          style={{
            fontSize: typography.fontSize.base,
            color: colors.text.secondary,
            lineHeight: 24,
          }}
        >
          {campaign.description}
        </Text>
      </View>

      {/* Campaign Info */}
      <View style={{ marginBottom: spacing["2xl"] }}>
        <Text
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.primary,
            marginBottom: spacing.md,
          }}
        >
          Details
        </Text>
        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Type</Text>
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, textTransform: "capitalize" }}>
              {campaign.type}
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Started</Text>
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
              {new Date(campaign.startDate).toLocaleDateString()}
            </Text>
          </View>
          {campaign.endDate && (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Ends</Text>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                {new Date(campaign.endDate).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Tags */}
      {campaign.tags.length > 0 && (
        <View style={{ marginBottom: spacing["2xl"] }}>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}
          >
            Tags
          </Text>
          <View style={{ flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" }}>
            {campaign.tags.map((tag) => (
              <View
                key={tag}
                style={{
                  backgroundColor: colors.accent + "20",
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  borderRadius: borderRadius.md,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.accent,
                    fontWeight: typography.fontWeight.medium,
                  }}
                >
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Donors List */}
      <View
        style={{
          backgroundColor: colors.secondary.bg,
          borderRadius: borderRadius.md,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: colors.border.light,
        }}
      >
        <Text
          style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            marginBottom: spacing.md,
          }}
        >
          Recent Donors
        </Text>
        <View style={{ gap: spacing.sm }}>
          {mockDonors.map((donor) => (
            <View
              key={donor.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: spacing.sm,
                borderBottomWidth: 1,
                borderBottomColor: colors.border.light,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, flex: 1 }}>
                {donor.anonymous ? (
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: colors.secondary.bg,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: colors.border.light,
                    }}
                  >
                    <MaterialIcons name="person" size={20} color={colors.text.tertiary} />
                  </View>
                ) : (
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: colors.accent + "20",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.bold,
                        color: colors.accent,
                      }}
                    >
                      {donor.name?.charAt(0).toUpperCase() || "?"}
                    </Text>
                  </View>
                )}
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.text.secondary,
                  }}
                >
                  {donor.anonymous ? "Anonymous" : donor.name}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.primary,
                }}
              >
                {formatCurrency(donor.amount, donor.currency)}
              </Text>
            </View>
          ))}
        </View>
      </View>
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
        <BackButton onPress={() => router.back()} />

        {/* Campaign Image - Full Width */}
        <View style={{ marginBottom: spacing["2xl"] }}>
          {campaign.imageUrl ? (
            <Image
              source={{ uri: campaign.imageUrl }}
              style={{
                width: "100%",
                height: 300,
                borderRadius: borderRadius.lg,
              }}
              contentFit="cover"
cachePolicy="memory-disk"
            />
          ) : (
            <View
              style={{
                width: "100%",
                height: 300,
                borderRadius: borderRadius.lg,
                backgroundColor: colors.secondary.bg,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="campaign" size={64} color={colors.text.tertiary} />
            </View>
          )}
        </View>

        {/* Two Column Layout (Desktop) or Stacked (Mobile) */}
        {isMobile ? (
          <>
            {/* Campaign Title - Mobile */}
            <View style={{ marginBottom: spacing["2xl"] }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm }}>
                <Text
                  style={{
                    fontSize: typography.fontSize["2xl"],
                    fontWeight: typography.fontWeight.bold,
                    color: colors.text.primary,
                  }}
                >
                  {campaign.title}
                </Text>
                <View
                  style={{
                    backgroundColor: campaign.status === "active" ? "#4caf5020" : colors.accent + "20",
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                    borderRadius: borderRadius.sm,
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.fontSize.xs,
                      color: campaign.status === "active" ? "#4caf50" : colors.accent,
                      fontWeight: typography.fontWeight.semibold,
                      textTransform: "capitalize",
                    }}
                  >
                    {campaign.status}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.secondary,
                }}
              >
                by {getMockOrganization("org1")?.name || "Organization"}
              </Text>
            </View>
            <DonationModule campaign={campaign} />
            {renderCampaignContentJSX()}
          </>
        ) : (
          <View
            style={{
              flexDirection: "row",
              gap: spacing.lg,
              alignItems: "flex-start",
            }}
          >
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingBottom: scrollViewBottomPadding,
              }}
            >
              {/* Campaign Title - In First Column */}
              <View style={{ marginBottom: spacing["2xl"] }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize["2xl"],
                      fontWeight: typography.fontWeight.bold,
                      color: colors.text.primary,
                    }}
                  >
                    {campaign.title}
                  </Text>
                  <View
                    style={{
                      backgroundColor: campaign.status === "active" ? "#4caf5020" : colors.accent + "20",
                      paddingHorizontal: spacing.sm,
                      paddingVertical: spacing.xs,
                      borderRadius: borderRadius.sm,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: campaign.status === "active" ? "#4caf50" : colors.accent,
                        fontWeight: typography.fontWeight.semibold,
                        textTransform: "capitalize",
                      }}
                    >
                      {campaign.status}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.text.secondary,
                  }}
                >
                  by {getMockOrganization("org1")?.name || "Organization"}
                </Text>
              </View>

              {renderCampaignContentJSX()}
            </ScrollView>
            <View
              style={{
                width: 400,
                ...(isMobile ? {} : { position: "sticky" as any, top: spacing.lg, alignSelf: "flex-start", maxHeight: "calc(100vh - 40px)" }),
              }}
            >
              <DonationModule campaign={campaign} />
            </View>
          </View>
        )}
      </ScrollView>

    </View>
  );
}

