import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { PayItForward, CampaignStatus } from "types/nonprofit";
import { useResponsive } from "hooks/useResponsive";
import { colors, spacing, borderRadius, typography } from "constants/theme";
import { getMockCampaign } from "data/mocks/campaigns";
import { BackButton } from "components/navigation/BackButton";
import { FormInput, FormTextArea } from "components/forms";
import { DateTimePickerComponent } from "components/forms/DateTimePicker";

// Mock fetch and update functions
const fetchCampaignById = async (id: string): Promise<PayItForward | null> => {
  console.log(`Fetching campaign with ID: ${id}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return getMockCampaign(id);
};

const updateCampaign = async (id: string, data: Partial<PayItForward>) => {
  console.log(`Updating campaign ${id} with`, data);
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { ...getMockCampaign(id), ...data };
};


export default function EditCampaign() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isMobile, paddingHorizontal } = useResponsive();

  const [campaign, setCampaign] = useState<PayItForward | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<CampaignStatus>("active");

  useEffect(() => {
    if (id) {
      const loadCampaign = async () => {
        setLoading(true);
        const fetchedCampaign = await fetchCampaignById(id);
        if (fetchedCampaign) {
          setCampaign(fetchedCampaign);
          setTitle(fetchedCampaign.title);
          setDescription(fetchedCampaign.description);
          setTargetAmount(fetchedCampaign.targetAmount.toString());
          setStartDate(new Date(fetchedCampaign.startDate));
          setEndDate(fetchedCampaign.endDate ? new Date(fetchedCampaign.endDate) : null);
          setStatus(fetchedCampaign.status);
        } else {
          alert("Campaign not found.");
          router.back();
        }
        setLoading(false);
      };
      loadCampaign();
    }
  }, [id]);

  const handleUpdate = async () => {
    if (!campaign) return;

    setIsSubmitting(true);
    const updatedData: Partial<PayItForward> = {
      title,
      description,
      targetAmount: parseFloat(targetAmount) || 0,
      startDate: startDate?.toISOString() || "",
      endDate: endDate?.toISOString(),
      status,
    };

    await updateCampaign(campaign.id, updatedData);
    setIsSubmitting(false);
    alert("Campaign updated successfully!");
    router.push(`/nonprofit/campaigns/${id}`);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background.primary }}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={{ color: colors.text.primary, marginTop: spacing.md }}>Loading Campaign...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        <BackButton onPress={() => router.back()} />

        <Text
          style={{
            fontSize: typography.fontSize["2xl"],
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            marginBottom: spacing.xl,
          }}
        >
          Edit Campaign
        </Text>

        {/* Form */}
        <View style={{ gap: spacing.lg }}>
          <FormInput
            label="Campaign Title"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Community Food Drive 2024"
          />
          <FormTextArea
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your campaign..."
            numberOfLines={6}
          />
          <FormInput
            label="Fundraising Goal"
            value={targetAmount}
            onChangeText={setTargetAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />
          <DateTimePickerComponent
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
            mode="date"
          />
          <DateTimePickerComponent
            label="End Date (Optional)"
            value={endDate}
            onChange={setEndDate}
            mode="date"
            placeholder="No end date"
          />
        </View>
        
        {/* Action Buttons */}
        <View
          style={{
            flexDirection: "row",
            gap: spacing.md,
            marginTop: spacing.xl,
          }}
        >
          <TouchableOpacity
              onPress={() => router.back()}
              style={{
                flex: 1,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                backgroundColor: colors.secondary.bg,
                borderWidth: 1,
                borderColor: colors.border.light,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.primary,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          <TouchableOpacity
            onPress={handleUpdate}
            disabled={isSubmitting}
            style={{
              flex: 1,
              padding: spacing.md,
              borderRadius: borderRadius.md,
              backgroundColor: !isSubmitting ? colors.accent : colors.border.light,
              alignItems: "center",
              opacity: !isSubmitting ? 1 : 0.5,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
              }}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
