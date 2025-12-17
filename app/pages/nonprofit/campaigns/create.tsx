import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform, TextInput } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNonprofit } from '@/contexts/NonprofitContext';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { Currency } from '@/types/international';
import { formatCurrency } from '@/lib/international';
import { BackButton } from '@/components/navigation/BackButton';
import { DateTimePickerComponent } from '@/components/forms/DateTimePicker';

type CampaignType = "donation" | "sponsorship" | "volunteer" | "fundraiser";
type MediaType = "image" | "video";

export default function CreateCampaign() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { isMobile, paddingHorizontal } = useResponsive();
  const { selectedNonprofit } = useNonprofit();
  const [step, setStep] = useState<"details" | "goal" | "media" | "review">("details");
  
  // Form state
  const [type, setType] = useState<CampaignType>("fundraiser");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to upload images!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
      setMediaType("image");
    }
  };

  const handlePickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to upload videos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setVideo(result.assets[0].uri);
      setMediaType("video");
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const canProceed = () => {
    switch (step) {
      case "details":
        return title.trim() && description.trim();
      case "goal":
        return !targetAmount || parseFloat(targetAmount) > 0;
      case "media":
        return image !== null; // Image is required
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!canProceed()) {
      if (step === "media" && !image) {
        alert("Please upload a campaign image. Image is required.");
        return;
      }
      alert("Please fill in all required fields");
      return;
    }
    if (step === "review") {
      handleSubmit();
    } else {
      const steps: ("details" | "goal" | "media" | "review")[] = ["details", "goal", "media", "review"];
      const currentIndex = steps.indexOf(step);
      if (currentIndex < steps.length - 1) {
        setStep(steps[currentIndex + 1]);
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: Submit to API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    router.back();
    // Show success message
    alert("Campaign created successfully!");
  };

  const renderDetailsStep = () => (
    <View style={{ gap: spacing.lg }}>
      <View>
        <Text
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.primary,
            marginBottom: spacing.sm,
          }}
        >
          Campaign Type <Text style={{ color: colors.accent }}>*</Text>
        </Text>
        <View style={{ flexDirection: "row", gap: spacing.md, flexWrap: "wrap" }}>
          {(["fundraiser", "donation", "sponsorship", "volunteer"] as CampaignType[]).map((campaignType) => (
            <TouchableOpacity
              key={campaignType}
              onPress={() => setType(campaignType)}
              style={{
                flex: 1,
                minWidth: 120,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                backgroundColor: type === campaignType ? colors.accent : colors.secondary.bg,
                borderWidth: 1,
                borderColor: type === campaignType ? colors.accent : colors.border.light,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: type === campaignType ? colors.text.primary : colors.text.secondary,
                  textTransform: "capitalize",
                }}
              >
                {campaignType}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View>
        <Text
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.primary,
            marginBottom: spacing.sm,
          }}
        >
          Campaign Title <Text style={{ color: colors.accent }}>*</Text>
        </Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Community Food Drive 2024"
          placeholderTextColor={colors.text.placeholder}
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            fontSize: typography.fontSize.base,
            color: colors.text.primary,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        />
      </View>

      <View>
        <Text
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.primary,
            marginBottom: spacing.sm,
          }}
        >
          Description <Text style={{ color: colors.accent }}>*</Text>
        </Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your campaign, its goals, and impact..."
          placeholderTextColor={colors.text.placeholder}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            fontSize: typography.fontSize.base,
            color: colors.text.primary,
            borderWidth: 1,
            borderColor: colors.border.light,
            minHeight: 120,
          }}
        />
      </View>
    </View>
  );

  const renderGoalStep = () => (
    <View style={{ gap: spacing.lg }}>
      <View>
        <Text
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.primary,
            marginBottom: spacing.sm,
          }}
        >
          Fundraising Goal (Optional)
        </Text>
        <Text
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            marginBottom: spacing.md,
          }}
        >
          Leave empty for open-ended campaigns
        </Text>
        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <View style={{ flex: 1 }}>
            <TextInput
              value={targetAmount}
              onChangeText={setTargetAmount}
              placeholder="0.00"
              placeholderTextColor={colors.text.placeholder}
              keyboardType="decimal-pad"
              style={{
                backgroundColor: colors.secondary.bg,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                fontSize: typography.fontSize.lg,
                color: colors.text.primary,
                borderWidth: 1,
                borderColor: colors.border.light,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.md,
              borderWidth: 1,
              borderColor: colors.border.light,
              overflow: "hidden",
            }}
          >
            {(["USD", "BLKD"] as Currency[]).map((curr) => (
              <TouchableOpacity
                key={curr}
                onPress={() => setCurrency(curr)}
                style={{
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.md,
                  backgroundColor: currency === curr ? colors.accent : "transparent",
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: currency === curr ? colors.text.primary : colors.text.secondary,
                  }}
                >
                  {curr}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View>
        <Text
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.primary,
            marginBottom: spacing.sm,
          }}
        >
          Campaign Dates
        </Text>
        <View style={{ gap: spacing.md }}>
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
      </View>

      <View>
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
        <View style={{ flexDirection: "row", gap: spacing.sm, marginBottom: spacing.sm }}>
          <TextInput
            value={tagInput}
            onChangeText={setTagInput}
            placeholder="Add a tag"
            placeholderTextColor={colors.text.placeholder}
            onSubmitEditing={handleAddTag}
            style={{
              flex: 1,
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              fontSize: typography.fontSize.base,
              color: colors.text.primary,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          />
          <TouchableOpacity
            onPress={handleAddTag}
            style={{
              backgroundColor: colors.accent,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="add" size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        {tags.length > 0 && (
          <View style={{ flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" }}>
            {tags.map((tag) => (
              <View
                key={tag}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.xs,
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
                <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                  <MaterialIcons name="close" size={16} color={colors.accent} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  const renderMediaStep = () => (
    <View style={{ gap: spacing.lg }}>
      <View
        style={{
          flexDirection: isMobile ? "column" : "row",
          gap: spacing.lg,
        }}
      >
        {/* Thumbnail Column */}
        <View style={{ flex: isMobile ? undefined : 1 }}>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}
          >
            Campaign Thumbnail <Text style={{ color: colors.accent }}>*</Text>
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
              marginBottom: spacing.md,
            }}
          >
            Upload a thumbnail image for your campaign. Video can be added optionally.
          </Text>
          
          {/* Image Upload */}
          <TouchableOpacity
            onPress={handlePickImage}
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.md,
              borderWidth: 2,
              borderColor: image ? colors.accent : colors.border.light,
              borderStyle: image ? "solid" : "dashed",
              padding: spacing["2xl"],
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
            }}
          >
            {image ? (
              <View style={{ width: "100%", position: "relative" }}>
                <Image source={{ uri: image }} style={{ width: "100%", height: 200, borderRadius: borderRadius.md }} contentFit="cover"
cachePolicy="memory-disk" />
                <TouchableOpacity
                  onPress={() => setImage(null)}
                  style={{
                    position: "absolute",
                    top: spacing.sm,
                    right: spacing.sm,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    borderRadius: borderRadius.full,
                    padding: spacing.xs,
                  }}
                >
                  <MaterialIcons name="close" size={20} color={colors.text.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <MaterialIcons name="image" size={48} color={colors.text.tertiary} />
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.text.secondary,
                    marginTop: spacing.md,
                  }}
                >
                  Tap to upload an image
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Video Column */}
        <View style={{ flex: isMobile ? undefined : 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs, marginBottom: spacing.sm }}>
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
              }}
            >
              Campaign Video
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.secondary,
                opacity: 0.8,
              }}
            >
              (Recommended)
            </Text>
          </View>
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
              marginBottom: spacing.md,
            }}
          >
            Add a video to showcase your campaign and increase engagement
          </Text>
          <TouchableOpacity
            onPress={handlePickVideo}
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.md,
              borderWidth: 2,
              borderColor: video ? colors.accent : colors.border.light,
              borderStyle: video ? "solid" : "dashed",
              padding: spacing["2xl"],
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
            }}
          >
            {video ? (
              <View style={{ width: "100%", position: "relative" }}>
                <View
                  style={{
                    width: "100%",
                    height: 200,
                    borderRadius: borderRadius.md,
                    backgroundColor: colors.background.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons name="play-circle-filled" size={64} color={colors.accent} />
                </View>
                <TouchableOpacity
                  onPress={() => setVideo(null)}
                  style={{
                    position: "absolute",
                    top: spacing.sm,
                    right: spacing.sm,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    borderRadius: borderRadius.full,
                    padding: spacing.xs,
                  }}
                >
                  <MaterialIcons name="close" size={20} color={colors.text.primary} />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.text.secondary,
                    marginTop: spacing.sm,
                    textAlign: "center",
                  }}
                >
                  Video selected
                </Text>
              </View>
            ) : (
              <>
                <MaterialIcons name="videocam" size={48} color={colors.text.tertiary} />
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.text.secondary,
                    marginTop: spacing.md,
                  }}
                >
                  Tap to upload a video
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderReviewStep = () => (
    <View style={{ gap: spacing.lg }}>
      <View
        style={{
          backgroundColor: colors.secondary.bg,
          borderRadius: borderRadius.md,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: colors.border.light,
        }}
      >
        {/* Media Preview */}
        {image && (
          <View style={{ marginBottom: spacing.md }}>
            <Image
              source={{ uri: image }}
              style={{
                width: "100%",
                height: 200,
                borderRadius: borderRadius.md,
              }}
              contentFit="cover"
cachePolicy="memory-disk"
            />
            <Text
              style={{
                fontSize: typography.fontSize.xs,
                color: colors.text.tertiary,
                marginTop: spacing.xs,
              }}
            >
              Campaign Thumbnail
            </Text>
          </View>
        )}
        {video && (
          <View style={{ marginBottom: spacing.md }}>
            <View
              style={{
                width: "100%",
                height: 200,
                borderRadius: borderRadius.md,
                backgroundColor: colors.background.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="play-circle-filled" size={64} color={colors.accent} />
            </View>
            <Text
              style={{
                fontSize: typography.fontSize.xs,
                color: colors.text.tertiary,
                marginTop: spacing.xs,
              }}
            >
              Campaign Video
            </Text>
          </View>
        )}

        <Text
          style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            marginBottom: spacing.sm,
          }}
        >
          {title || "Untitled Campaign"}
        </Text>
        <Text
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            textTransform: "capitalize",
            marginBottom: spacing.md,
          }}
        >
          {type}
        </Text>
        <Text
          style={{
            fontSize: typography.fontSize.base,
            color: colors.text.secondary,
            marginBottom: spacing.md,
          }}
        >
          {description || "No description"}
        </Text>
        {targetAmount && (
          <View style={{ marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border.light }}>
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
              }}
            >
              Goal: {formatCurrency(parseFloat(targetAmount), currency)}
            </Text>
          </View>
        )}
        {tags.length > 0 && (
          <View style={{ flexDirection: "row", gap: spacing.sm, flexWrap: "wrap", marginTop: spacing.md }}>
            {tags.map((tag) => (
              <View
                key={tag}
                style={{
                  backgroundColor: colors.accent + "20",
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                  borderRadius: borderRadius.sm,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.accent,
                  }}
                >
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  const steps = [
    { key: "details", label: "Details" },
    { key: "goal", label: "Goal" },
    { key: "media", label: "Media" },
    { key: "review", label: "Review" },
  ];

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
            marginBottom: spacing.md,
          }}
        >
          Create Campaign
        </Text>
        {selectedNonprofit && (
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              marginBottom: spacing["2xl"],
            }}
          >
            For {selectedNonprofit.name}
          </Text>
        )}

        {/* Step Indicator */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: spacing["2xl"],
            gap: spacing.sm,
          }}
        >
          {steps.map((stepItem, index) => {
            const stepIndex = steps.findIndex((s) => s.key === step);
            const isActive = stepItem.key === step;
            const isCompleted = steps.findIndex((s) => s.key === stepItem.key) < stepIndex;
            return (
              <View key={stepItem.key} style={{ flex: 1, gap: spacing.xs }}>
                <View
                  style={{
                    height: 4,
                    backgroundColor: isActive || isCompleted ? colors.accent : colors.border.light,
                    borderRadius: 2,
                  }}
                />
                <Text
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: isActive || isCompleted ? colors.text.primary : colors.text.tertiary,
                    textAlign: "center",
                  }}
                >
                  {stepItem.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Step Content */}
        {step === "details" && renderDetailsStep()}
        {step === "goal" && renderGoalStep()}
        {step === "media" && renderMediaStep()}
        {step === "review" && renderReviewStep()}

        {/* Navigation Buttons */}
        <View
          style={{
            flexDirection: "row",
            gap: spacing.md,
            marginTop: spacing["2xl"],
          }}
        >
          {step !== "details" && (
            <TouchableOpacity
              onPress={() => {
                const steps: ("details" | "goal" | "media" | "review")[] = ["details", "goal", "media", "review"];
                const currentIndex = steps.indexOf(step);
                if (currentIndex > 0) {
                  setStep(steps[currentIndex - 1]);
                }
              }}
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
                Back
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleNext}
            disabled={!canProceed() || isSubmitting}
            style={{
              flex: 1,
              padding: spacing.md,
              borderRadius: borderRadius.md,
              backgroundColor: canProceed() && !isSubmitting ? colors.accent : colors.border.light,
              alignItems: "center",
              opacity: canProceed() && !isSubmitting ? 1 : 0.5,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
              }}
            >
              {isSubmitting ? "Creating..." : step === "review" ? "Create Campaign" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

