import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, Share } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Video } from '@/types/education';
import { HeroSection } from '@/components/layouts/HeroSection';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { logError } from '@/lib/logger';

// Mock videos - in production, fetch from API
const mockVideos: Record<string, Video> = {
  "1": {
    id: "1",
    title: "Welcome to BDN",
    description: "Introduction to the Black Dollar Network platform and its mission. Learn about our commitment to supporting Black-owned businesses and empowering the community through economic growth and financial inclusion.",
    thumbnailUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=450&fit=crop",
    videoUrl: "",
    duration: "2:30",
    category: "tutorial",
    tags: ["getting-started", "overview", "platform-intro"],
    views: 1250,
    createdAt: "2024-01-15T00:00:00Z",
  },
  "2": {
    id: "2",
    title: "Making Your First Purchase",
    description: "Step-by-step guide to making purchases and earning rewards. This comprehensive tutorial covers everything from browsing products to completing your first transaction and understanding your impact points.",
    thumbnailUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=450&fit=crop",
    videoUrl: "",
    duration: "4:15",
    category: "tutorial",
    tags: ["purchases", "rewards", "getting-started"],
    views: 890,
    createdAt: "2024-01-20T00:00:00Z",
  },
  "3": {
    id: "3",
    title: "Understanding Impact Points",
    description: "Learn how to earn and use impact points effectively. Discover strategies to maximize your rewards and understand the different ways you can accumulate points through various platform activities.",
    thumbnailUrl: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=450&fit=crop",
    videoUrl: "",
    duration: "3:45",
    category: "feature",
    tags: ["points", "rewards", "features"],
    views: 650,
    createdAt: "2024-02-01T00:00:00Z",
  },
  "4": {
    id: "4",
    title: "Merchant Onboarding Guide",
    description: "Complete walkthrough for businesses joining BDN. Learn how to set up your business profile, add products, manage inventory, and start accepting payments through the platform.",
    thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop",
    videoUrl: "",
    duration: "8:20",
    category: "business",
    tags: ["merchant", "onboarding", "business"],
    views: 420,
    createdAt: "2024-02-05T00:00:00Z",
  },
};

// Related videos (excluding current video)
const getAllVideos = (): Video[] => [
  mockVideos["1"],
  mockVideos["2"],
  mockVideos["3"],
  mockVideos["4"],
];

export default function VideoDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isMobile, isDesktop, paddingHorizontal } = useResponsive();
  const [isLiked, setIsLiked] = useState(false);

  const video = mockVideos[id || "1"] || mockVideos["1"];
  const relatedVideos = getAllVideos().filter((v) => v.id !== video.id);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out "${video.title}" on BDN University: ${video.description}`,
        url: `/pages/university/videos/${video.id}`,
      });
    } catch (error) {
      logError("Error sharing video", error, { videoId: video.id });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
          title={video.title}
          subtitle={`${video.category.charAt(0).toUpperCase() + video.category.slice(1)} • ${video.duration} • ${video.views.toLocaleString()} views`}
        />

        {/* Main Content */}
        <View style={{ flexDirection: isDesktop ? "row" : "column", gap: spacing["2xl"] }}>
          {/* Video Player Section */}
          <View style={{ flex: isDesktop ? 2 : undefined }}>
            {/* Video Player */}
            <View
              style={{
                width: "100%",
                aspectRatio: 16 / 9,
                backgroundColor: colors.secondary.bg,
                borderRadius: borderRadius.lg,
                overflow: "hidden",
                marginBottom: spacing.lg,
                borderWidth: 1,
                borderColor: colors.border.light,
                position: "relative",
              }}
            >
              {video.thumbnailUrl ? (
                <Image
                  source={{ uri: video.thumbnailUrl }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  contentFit="cover"
cachePolicy="memory-disk"
                />
              ) : (
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="play-circle-filled" size={isDesktop ? 80 : 64} color={colors.accent} />
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.secondary,
                  marginTop: spacing.md,
                }}
              >
                Video Player Placeholder
              </Text>
                </View>
              )}
              {/* Play Button Overlay */}
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                }}
              >
                <MaterialIcons name="play-circle-filled" size={isDesktop ? 80 : 64} color={colors.accent} />
              </View>
            </View>

            {/* Video Info */}
            <View style={{ marginBottom: spacing.xl }}>
              <Text
                style={{
                  fontSize: typography.fontSize["2xl"],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.md,
                }}
              >
                {video.title}
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.secondary,
                  lineHeight: 24,
                  marginBottom: spacing.md,
                }}
              >
                {video.description}
              </Text>

              {/* Metadata */}
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: spacing.md,
                  marginBottom: spacing.md,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                  <MaterialIcons name="schedule" size={16} color={colors.text.tertiary} />
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.tertiary }}>
                    {video.duration}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                  <MaterialIcons name="visibility" size={16} color={colors.text.tertiary} />
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.tertiary }}>
                    {video.views.toLocaleString()} views
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                  <MaterialIcons name="calendar-today" size={16} color={colors.text.tertiary} />
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.tertiary }}>
                    {formatDate(video.createdAt)}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                  <MaterialIcons name="category" size={16} color={colors.text.tertiary} />
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.tertiary }}>
                    {video.category.charAt(0).toUpperCase() + video.category.slice(1)}
                  </Text>
                </View>
              </View>

              {/* Tags */}
              {video.tags.length > 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: spacing.sm,
                    marginBottom: spacing.md,
                  }}
                >
                  {video.tags.map((tag) => (
                    <View
                      key={tag}
                      style={{
                        backgroundColor: colors.secondary.bg,
                        borderRadius: borderRadius.md,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.xs,
                        borderWidth: 1,
                        borderColor: colors.border.light,
                      }}
                    >
                      <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                        #{tag}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Actions */}
              <View style={{ flexDirection: "row", gap: spacing.md }}>
                <TouchableOpacity
                  onPress={() => setIsLiked(!isLiked)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.sm,
                    backgroundColor: colors.secondary.bg,
                    borderRadius: borderRadius.md,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    borderWidth: 1,
                    borderColor: isLiked ? colors.accent : colors.border.light,
                  }}
                >
                  <MaterialIcons
                    name={isLiked ? "favorite" : "favorite-border"}
                    size={20}
                    color={isLiked ? colors.accent : colors.text.secondary}
                  />
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      color: isLiked ? colors.accent : colors.text.secondary,
                      fontWeight: typography.fontWeight.semibold,
                    }}
                  >
                    Like
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleShare}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.sm,
                    backgroundColor: colors.secondary.bg,
                    borderRadius: borderRadius.md,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    borderWidth: 1,
                    borderColor: colors.border.light,
                  }}
                >
                  <MaterialIcons name="share" size={20} color={colors.text.secondary} />
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      color: colors.text.secondary,
                      fontWeight: typography.fontWeight.semibold,
                    }}
                  >
                    Share
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Sidebar - Related Videos */}
          {isDesktop && (
            <View style={{ flex: 1, maxWidth: 400 }}>
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.md,
                }}
              >
                Related Videos
              </Text>
              <View style={{ gap: spacing.md }}>
                {relatedVideos.slice(0, 3).map((relatedVideo) => (
                  <TouchableOpacity
                    key={relatedVideo.id}
                    onPress={() => router.push(`/pages/university/videos/${relatedVideo.id}`)}
                    style={{
                      backgroundColor: colors.secondary.bg,
                      borderRadius: borderRadius.md,
                      overflow: "hidden",
                      borderWidth: 1,
                      borderColor: colors.border.light,
                    }}
                  >
                    <View
                      style={{
                        height: 100,
                        backgroundColor: colors.primary.bg,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {relatedVideo.thumbnailUrl ? (
                        <Image
                          source={{ uri: relatedVideo.thumbnailUrl }}
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                          contentFit="cover"
cachePolicy="memory-disk"
                        />
                      ) : (
                        <View
                          style={{
                            width: "100%",
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MaterialIcons name="play-circle-filled" size={40} color={colors.accent} />
                        </View>
                      )}
                      {/* Play Button Overlay */}
                      <View
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      <MaterialIcons name="play-circle-filled" size={40} color={colors.accent} />
                      </View>
                      {/* Duration Badge */}
                      <View
                        style={{
                          position: "absolute",
                          bottom: 8,
                          right: 8,
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                          paddingHorizontal: spacing.xs,
                          paddingVertical: 2,
                          borderRadius: borderRadius.sm,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            fontWeight: typography.fontWeight.semibold,
                            color: colors.text.primary,
                          }}
                        >
                          {relatedVideo.duration}
                        </Text>
                      </View>
                    </View>
                    <View style={{ padding: spacing.md }}>
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.bold,
                          color: colors.text.primary,
                          marginBottom: spacing.xs,
                        }}
                        numberOfLines={2}
                      >
                        {relatedVideo.title}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                          <MaterialIcons name="visibility" size={12} color={colors.text.tertiary} />
                          <Text
                            style={{
                              fontSize: typography.fontSize.xs,
                              color: colors.text.tertiary,
                            }}
                          >
                            {relatedVideo.views.toLocaleString()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Related Videos - Mobile */}
        {!isDesktop && (
          <View style={{ marginTop: spacing.xl }}>
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginBottom: spacing.md,
              }}
            >
              Related Videos
            </Text>
            <View style={{ gap: spacing.md }}>
              {relatedVideos.map((relatedVideo) => (
                <TouchableOpacity
                  key={relatedVideo.id}
                  onPress={() => router.push(`/pages/university/videos/${relatedVideo.id}`)}
                  style={{
                    backgroundColor: colors.secondary.bg,
                    borderRadius: borderRadius.md,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: colors.border.light,
                  }}
                >
                  <View
                    style={{
                      height: 180,
                      backgroundColor: colors.primary.bg,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {relatedVideo.thumbnailUrl ? (
                      <Image
                        source={{ uri: relatedVideo.thumbnailUrl }}
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        contentFit="cover"
cachePolicy="memory-disk"
                      />
                    ) : (
                      <View
                        style={{
                          width: "100%",
                          height: "100%",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MaterialIcons name="play-circle-filled" size={64} color={colors.accent} />
                      </View>
                    )}
                    {/* Play Button Overlay */}
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <MaterialIcons name="play-circle-filled" size={64} color={colors.accent} />
                    </View>
                    {/* Duration Badge */}
                    <View
                      style={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        paddingHorizontal: spacing.sm,
                        paddingVertical: spacing.xs,
                        borderRadius: borderRadius.sm,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.text.primary,
                        }}
                      >
                        {relatedVideo.duration}
                      </Text>
                    </View>
                  </View>
                  <View style={{ padding: spacing.md }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: typography.fontWeight.bold,
                        color: colors.text.primary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {relatedVideo.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        marginBottom: spacing.sm,
                      }}
                      numberOfLines={2}
                    >
                      {relatedVideo.description}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                        <MaterialIcons name="visibility" size={14} color={colors.text.tertiary} />
                        <Text
                          style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.text.tertiary,
                          }}
                        >
                          {relatedVideo.views.toLocaleString()} views
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                        <MaterialIcons name="schedule" size={14} color={colors.text.tertiary} />
                        <Text
                          style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.text.tertiary,
                          }}
                        >
                          {relatedVideo.duration}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

