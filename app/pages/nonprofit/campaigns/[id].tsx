import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform, Alert } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { PayItForward } from '@/types/nonprofit';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { formatCurrency } from '@/lib/international';
import { BackButton } from '@/components/navigation/BackButton';
import { useNonprofit } from '@/contexts/NonprofitContext';
import { getMockCampaign, mockDonors } from '@/data/mocks/campaigns';
import { getMockOrganization } from '@/data/mocks/organizations';
import { DonationModule } from '@/components/campaigns/DonationModule';
import { logger } from '@/lib/logger';
import { CampaignSEO } from '@/components/seo/CampaignSEO';
import { ImagePlaceholder } from '@/components/placeholders/SVGPlaceholders';

export default function CampaignDetail() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const { selectedNonprofit } = useNonprofit();
  const [imageError, setImageError] = useState(false);
  
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
            logger.info("Deleting campaign", { campaignId: campaign.id });
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

  // Filter donations for this specific campaign
  const campaignDonations = mockDonors.filter((donor) => {
    // In a real app, this would filter by campaignId
    // For now, we'll use all mock donors as they're associated with campaign "1"
    return true;
  });

  const totalDonations = campaignDonations.reduce((sum, d) => sum + d.amount, 0);
  const totalContributors = campaign.contributors;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const progress = campaign.targetAmount ? Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100) : 0;

  // Get organization data for SEO
  const organization = getMockOrganization(campaign.organizationId || '1');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <CampaignSEO campaign={campaign} organization={organization} />
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
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

        {/* Campaign Image */}
        <View style={{ marginBottom: spacing.lg, borderRadius: borderRadius.lg, overflow: "hidden" }}>
          {campaign.imageUrl && campaign.imageUrl.trim() !== "" && !imageError ? (
            <Image
              source={{ uri: campaign.imageUrl }}
              style={{ width: "100%", height: isMobile ? 200 : 300 }}
              contentFit="cover"
              cachePolicy="memory-disk"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={{ width: "100%", height: isMobile ? 200 : 300, justifyContent: "center", alignItems: "center", backgroundColor: colors.secondary.bg }}>
              <ImagePlaceholder width={isMobile ? width - 80 : 600} height={isMobile ? 200 : 300} />
            </View>
          )}
        </View>

        {/* Campaign Title */}
        <Text
          style={{
            fontSize: isMobile ? typography.fontSize["2xl"] : typography.fontSize["3xl"],
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            marginBottom: spacing.sm,
          }}
        >
          {campaign.title}
        </Text>

        {/* Campaign Type Badge */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md }}>
          <View
            style={{
              backgroundColor: "rgba(186, 153, 136, 0.15)",
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              borderRadius: borderRadius.md,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.xs,
                color: colors.accent,
                fontWeight: typography.fontWeight.semibold,
                textTransform: "uppercase",
              }}
            >
              {campaign.type}
            </Text>
          </View>
          {daysRemaining !== null && daysRemaining > 0 && (
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
              {daysRemaining} days remaining
            </Text>
          )}
        </View>

        {/* Campaign Description */}
        <Text
          style={{
            fontSize: typography.fontSize.base,
            color: colors.text.secondary,
            lineHeight: typography.lineHeight.relaxed,
            marginBottom: spacing.xl,
          }}
        >
          {campaign.description}
        </Text>

        {/* Campaign Stats - Campaign-Specific */}
        <View
          style={{
            flexDirection: "row",
            gap: spacing.md,
            marginBottom: spacing.xl,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginBottom: spacing.xs,
              }}
            >
              Total Donations
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize["2xl"],
                fontWeight: typography.fontWeight.bold,
                color: colors.status.success,
              }}
            >
              {formatCurrency(campaign.currentAmount, campaign.currency)}
            </Text>
            {campaign.targetAmount && (
              <Text
                style={{
                  fontSize: typography.fontSize.xs,
                  color: colors.text.tertiary,
                  marginTop: spacing.xs,
                }}
              >
                of {formatCurrency(campaign.targetAmount, campaign.currency)} goal
              </Text>
            )}
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginBottom: spacing.xs,
              }}
            >
              Contributors
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize["2xl"],
                fontWeight: typography.fontWeight.bold,
                color: colors.accent,
              }}
            >
              {totalContributors}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        {campaign.targetAmount && (
          <View style={{ marginBottom: spacing.xl }}>
            <View
              style={{
                height: 12,
                backgroundColor: colors.background.primary,
                borderRadius: borderRadius.md,
                overflow: "hidden",
                marginBottom: spacing.xs,
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  backgroundColor: colors.accent,
                }}
              />
            </View>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                textAlign: "center",
              }}
            >
              {Math.round(progress)}% funded
            </Text>
          </View>
        )}

        {/* Recent Donations - Campaign-Specific */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Recent Donations
          </Text>
          {campaignDonations.length > 0 ? (
            <View style={{ gap: spacing.md }}>
              {campaignDonations.slice(0, 5).map((donation, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: colors.secondary.bg,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs }}>
                      <MaterialIcons name="favorite" size={16} color={colors.accent} />
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.text.primary,
                        }}
                      >
                        {donation.anonymous ? "Anonymous" : donation.name || "Anonymous"}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {campaign.title}
                    </Text>
                    {donation.name && !donation.anonymous && (
                      <Text
                        style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.text.tertiary,
                          fontStyle: "italic",
                        }}
                      >
                        "{donation.name === "John Doe" ? "Happy to help!" : ""}"
                      </Text>
                    )}
                    <Text
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.text.tertiary,
                        marginTop: spacing.xs,
                      }}
                    >
                      {formatDate(donation.date)}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: typography.fontSize.lg,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.status.success,
                    }}
                  >
                    +{formatCurrency(donation.amount, donation.currency as any)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View
              style={{
                backgroundColor: colors.secondary.bg,
                borderRadius: borderRadius.md,
                padding: spacing.xl,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <MaterialIcons name="favorite-border" size={48} color={colors.text.tertiary} />
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.secondary,
                  marginTop: spacing.md,
                  textAlign: "center",
                }}
              >
                No donations yet. Be the first to support this campaign!
              </Text>
            </View>
          )}
        </View>

        {/* Donation Module */}
        <DonationModule campaign={campaign} />

      </ScrollView>
    </View>
  );
}
