import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Video } from '@/types/education';
import { platformValues, isAndroid } from "../../../utils/platform";
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

// Mock videos
const mockVideos: Video[] = [
  {
    id: "1",
    title: "Welcome to BDN",
    description: "Introduction to the Black Dollar Network platform and its mission",
    thumbnailUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=450&fit=crop",
    videoUrl: "",
    duration: "2:30",
    category: "tutorial",
    tags: ["getting-started", "overview"],
    views: 1250,
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    title: "Making Your First Purchase",
    description: "Step-by-step guide to making purchases and earning rewards",
    thumbnailUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=450&fit=crop",
    videoUrl: "",
    duration: "4:15",
    category: "tutorial",
    tags: ["purchases", "rewards"],
    views: 890,
    createdAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "3",
    title: "Understanding Impact Points",
    description: "Learn how to earn and use impact points effectively",
    thumbnailUrl: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=450&fit=crop",
    videoUrl: "",
    duration: "3:45",
    category: "feature",
    tags: ["points", "rewards"],
    views: 650,
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "4",
    title: "Merchant Onboarding Guide",
    description: "Complete walkthrough for businesses joining BDN",
    thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop",
    videoUrl: "",
    duration: "8:20",
    category: "business",
    tags: ["merchant", "onboarding"],
    views: 420,
    createdAt: "2024-02-05T00:00:00Z",
  },
];

const categories = [
  { key: "all", label: "All Videos" },
  { key: "tutorial", label: "Tutorials" },
  { key: "feature", label: "Features" },
  { key: "tips", label: "Tips" },
  { key: "community", label: "Community" },
  { key: "business", label: "Business" },
];

export default function Videos() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredVideos = selectedCategory === "all"
    ? mockVideos
    : mockVideos.filter((video) => video.category === selectedCategory);

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <OptimizedScrollView
        showBackToTop={true}
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: platformValues.scrollViewPaddingTop,
          paddingBottom: 40,
        }}
      >
        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          nestedScrollEnabled={isAndroid}
          style={{ marginBottom: 24 }}
          contentContainerStyle={{ gap: 8 }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              onPress={() => setSelectedCategory(category.key)}
              activeOpacity={platformValues.touchOpacity}
              hitSlop={platformValues.hitSlop}
              style={{
                backgroundColor: selectedCategory === category.key ? "#4caf50" : "#474747",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: selectedCategory === category.key ? "#4caf50" : "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: selectedCategory === category.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                }}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Videos Grid */}
        {filteredVideos.length > 0 ? (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            {filteredVideos.map((video) => (
              <TouchableOpacity
                key={video.id}
                onPress={() => router.push(`/pages/university/videos/${video.id}`)}
                activeOpacity={platformValues.touchOpacity}
                style={{
                  flex: isMobile ? undefined : 1,
                  width: isMobile ? "100%" : undefined,
                  minWidth: isMobile ? "100%" : "30%",
                  maxWidth: isMobile ? "100%" : "33.333%",
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                {/* Thumbnail */}
                <View
                  style={{
                    height: 180,
                    backgroundColor: "#232323",
                    position: "relative",
                    overflow: "hidden",
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
                      <MaterialIcons name="play-circle-filled" size={64} color="#4caf50" />
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
                  <MaterialIcons name="play-circle-filled" size={64} color="#4caf50" />
                  </View>
                  {/* Duration Badge */}
                  <View
                    style={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: "#ffffff",
                      }}
                    >
                      {video.duration}
                    </Text>
                  </View>
                </View>

                {/* Video Info */}
                <View style={{ padding: 16 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 4,
                    }}
                  >
                    {video.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: 12,
                    }}
                  >
                    {video.description}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <MaterialIcons name="visibility" size={14} color="rgba(255, 255, 255, 0.5)" />
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        {video.views.toLocaleString()} views
                      </Text>
                    </View>
                    {video.tags.length > 0 && (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <MaterialIcons name="label" size={14} color="rgba(255, 255, 255, 0.5)" />
                        <Text
                          style={{
                            fontSize: 12,
                            color: "rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          {video.tags[0]}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 40,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <MaterialIcons name="play-circle-filled" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              No videos found for this category
            </Text>
          </View>
        )}
      </OptimizedScrollView>
    </View>
  );
}

