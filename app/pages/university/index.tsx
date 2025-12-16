import React from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { HeroSection } from "../../../components/layouts/HeroSection";
import { Carousel } from "../../../components/layouts/Carousel";
import { useResponsive } from "../../../hooks/useResponsive";
import { platformValues, isAndroid } from "../../../utils/platform";

const categories = [
  {
    id: "guides",
    name: "Step-by-Step Guides",
    description: "Learn how to use platform features",
    icon: "menu-book",
    color: "#ba9988",
    route: "/pages/university/guides",
  },
  {
    id: "videos",
    name: "Video Tutorials",
    description: "Watch educational videos and tutorials",
    icon: "play-circle-filled",
    color: "#4caf50",
    route: "/pages/university/videos",
  },
  {
    id: "help",
    name: "Help Center",
    description: "Comprehensive help documentation",
    icon: "help-outline",
    color: "#2196f3",
    route: "/pages/university/help",
  },
  {
    id: "blog",
    name: "Blog & Updates",
    description: "Articles, news, and platform updates",
    icon: "article",
    color: "#ffd700",
    route: "/pages/university/blog",
  },
];

const featuredGuides = [
  {
    id: "1",
    title: "Getting Started with BDN",
    description: "Learn the basics of using BDN",
    category: "getting-started",
    estimatedTime: "5 min",
  },
  {
    id: "2",
    title: "How to Earn Impact Points",
    description: "Maximize your rewards",
    category: "rewards",
    estimatedTime: "3 min",
  },
];

const featuredVideos = [
  {
    id: "1",
    title: "Welcome to BDN",
    description: "Introduction to the platform",
    duration: "2:30",
    views: 1250,
  },
  {
    id: "2",
    title: "Making Your First Purchase",
    description: "Step-by-step purchase guide",
    duration: "4:15",
    views: 890,
  },
];

export default function University() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { isMobile, isDesktop } = useResponsive();

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={isAndroid}
        bounces={platformValues.scrollViewBounces}
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: platformValues.scrollViewPaddingTop,
          paddingBottom: 40,
        }}
      >
        {/* Hero Section */}
        <HeroSection
          title="BDN University"
          subtitle="Learn, grow, and master the BDN platform with guides, tutorials, and resources"
        />

        {/* Categories */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Explore Learning Resources
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => router.push(category.route as any)}
                style={{
                  flex: isMobile ? "0 0 calc(50% - 6px)" : 1,
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  minHeight: 140,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: `${category.color}20`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <MaterialIcons name={category.icon as any} size={24} color={category.color} />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 4,
                  }}
                >
                  {category.name}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  {category.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Guides */}
        <View style={{ marginBottom: 32 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              Featured Guides
            </Text>
            <TouchableOpacity onPress={() => router.push("/pages/university/guides")}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ba9988",
                }}
              >
                View All →
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ gap: 12 }}>
            {featuredGuides.map((guide) => (
              <TouchableOpacity
                key={guide.id}
                onPress={() => router.push(`/pages/university/guides/${guide.id}`)}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                  <MaterialIcons name="menu-book" size={24} color="#ba9988" />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      {guide.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                        marginBottom: 8,
                      }}
                    >
                      {guide.description}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <MaterialIcons name="schedule" size={14} color="rgba(255, 255, 255, 0.5)" />
                        <Text
                          style={{
                            fontSize: 12,
                            color: "rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          {guide.estimatedTime}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Videos */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              Featured Videos
            </Text>
            <TouchableOpacity onPress={() => router.push("/pages/university/videos")}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ba9988",
                }}
              >
                View All →
              </Text>
            </TouchableOpacity>
          </View>
          {isDesktop ? (
            <Carousel itemsPerView={3} gap={16}>
              {featuredVideos.map((video) => (
                <TouchableOpacity
                  key={video.id}
                  onPress={() => router.push(`/pages/university/videos/${video.id}`)}
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <View
                    style={{
                      height: 100,
                      backgroundColor: "#232323",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons name="play-circle-filled" size={40} color="#4caf50" />
                  </View>
                  <View style={{ padding: 12 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                      numberOfLines={2}
                    >
                      {video.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.7)",
                        marginBottom: 8,
                      }}
                      numberOfLines={2}
                    >
                      {video.description}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <MaterialIcons name="schedule" size={12} color="rgba(255, 255, 255, 0.5)" />
                        <Text
                          style={{
                            fontSize: 11,
                            color: "rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          {video.duration}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <MaterialIcons name="visibility" size={12} color="rgba(255, 255, 255, 0.5)" />
                        <Text
                          style={{
                            fontSize: 11,
                            color: "rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          {video.views.toLocaleString()} views
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </Carousel>
          ) : (
            <View style={{ gap: 12 }}>
              {featuredVideos.map((video) => (
                <TouchableOpacity
                  key={video.id}
                  onPress={() => router.push(`/pages/university/videos/${video.id}`)}
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <View
                    style={{
                      height: 120,
                      backgroundColor: "#232323",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons name="play-circle-filled" size={48} color="#4caf50" />
                  </View>
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
                        marginBottom: 8,
                      }}
                    >
                      {video.description}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <MaterialIcons name="schedule" size={14} color="rgba(255, 255, 255, 0.5)" />
                        <Text
                          style={{
                            fontSize: 12,
                            color: "rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          {video.duration}
                        </Text>
                      </View>
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
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

