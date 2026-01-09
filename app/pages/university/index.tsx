import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { HeroSection } from '@/components/layouts/HeroSection';
import { Carousel } from '@/components/layouts/Carousel';
import { useResponsive } from '@/hooks/useResponsive';

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
  const router = useRouter();
  const { isMobile, isDesktop, paddingHorizontal, scrollViewBottomPadding } = useResponsive();

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={Platform.OS === 'android'}
        bounces={Platform.OS !== 'web'}
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        {/* Hero Section */}
        <HeroSection
          title="BDN University"
          subtitle="Learn, grow, and get the most out of using the BDN platform."
        />

        {/* Categories */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: isMobile ? 20 : 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 20,
            }}
          >
            Explore Learning Resources
          </Text>
          {isMobile ? (
            // Mobile: 2x2 Grid - Two rows of two cards each
            <View>
              {/* First Row */}
              <View style={{ flexDirection: "row", marginBottom: 16 }}>
                {categories.slice(0, 2).map((category, index) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => router.push(category.route as any)}
                    style={{
                      flex: 1,
                      marginRight: index === 0 ? 8 : 0,
                      marginLeft: index === 1 ? 8 : 0,
                      backgroundColor: "#474747",
                      borderRadius: 16,
                      padding: 16,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                      minHeight: 160,
                    }}
                  >
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        backgroundColor: `${category.color}20`,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 12,
                      }}
                    >
                      <MaterialIcons name={category.icon as any} size={24} color={category.color} />
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff", marginBottom: 6 }}>
                      {category.name}
                    </Text>
                    <Text style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.8)", lineHeight: 18 }}>
                      {category.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {/* Second Row */}
              <View style={{ flexDirection: "row" }}>
                {categories.slice(2, 4).map((category, index) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => router.push(category.route as any)}
                    style={{
                      flex: 1,
                      marginRight: index === 0 ? 8 : 0,
                      marginLeft: index === 1 ? 8 : 0,
                      backgroundColor: "#474747",
                      borderRadius: 16,
                      padding: 16,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                      minHeight: 160,
                    }}
                  >
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        backgroundColor: `${category.color}20`,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 12,
                      }}
                    >
                      <MaterialIcons name={category.icon as any} size={24} color={category.color} />
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff", marginBottom: 6 }}>
                      {category.name}
                    </Text>
                    <Text style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.8)", lineHeight: 18 }}>
                      {category.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            // Desktop: All 4 cards in one row
            <View style={{ flexDirection: "row", gap: 20 }}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => router.push(category.route as any)}
                  style={{
                    flex: 1,
                    backgroundColor: "#474747",
                    borderRadius: 20,
                    padding: 24,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    minHeight: 180,
                  }}
                >
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      backgroundColor: `${category.color}20`,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    <MaterialIcons name={category.icon as any} size={28} color={category.color} />
                  </View>
                  <Text style={{ fontSize: 20, fontWeight: "700", color: "#ffffff", marginBottom: 8 }}>
                    {category.name}
                  </Text>
                  <Text style={{ fontSize: 15, color: "rgba(255, 255, 255, 0.8)", lineHeight: 22 }}>
                    {category.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Featured Guides */}
        <View style={{ marginBottom: 32 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <Text
              style={{
                fontSize: isMobile ? 20 : 24,
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
          <View 
            style={Platform.OS === "web" 
              ? {} 
              : { gap: 16 }
            }
          >
            {featuredGuides.map((guide, index) => (
              <TouchableOpacity
                key={guide.id}
                onPress={() => router.push(`/pages/university/guides/${guide.id}`)}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  ...(Platform.OS === "web" && index < featuredGuides.length - 1 && {
                    marginBottom: 16,
                  }),
                }}
              >
                <View 
                  style={{ 
                    flexDirection: "row", 
                    alignItems: "flex-start",
                    ...(Platform.OS === "web" ? { marginHorizontal: -8 } : { gap: 16 })
                  }}
                >
                  <View style={Platform.OS === "web" ? { marginHorizontal: 8 } : {}}>
                    <MaterialIcons name="menu-book" size={28} color="#ba9988" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 6,
                      }}
                    >
                      {guide.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "rgba(255, 255, 255, 0.8)",
                        marginBottom: 12,
                        lineHeight: 22,
                      }}
                    >
                      {guide.description}
                    </Text>
                    <View 
                      style={{ 
                        flexDirection: "row", 
                        alignItems: "center",
                        ...(Platform.OS === "web" ? { marginHorizontal: -3 } : { gap: 16 })
                      }}
                    >
                      <View 
                        style={{ 
                          flexDirection: "row", 
                          alignItems: "center",
                          ...(Platform.OS === "web" ? { marginHorizontal: 3 } : { gap: 6 })
                        }}
                      >
                        <MaterialIcons name="schedule" size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Text
                          style={{
                            fontSize: 13,
                            color: "rgba(255, 255, 255, 0.7)",
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
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <Text
              style={{
                fontSize: isMobile ? 20 : 24,
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
            <Carousel itemsPerView={3} gap={16} showControls={true} showIndicators={true}>
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
                        marginBottom: 6,
                      }}
                      numberOfLines={2}
                    >
                      {video.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.8)",
                        marginBottom: 12,
                        lineHeight: 20,
                      }}
                      numberOfLines={2}
                    >
                      {video.description}
                    </Text>
                    <View 
                      style={{ 
                        flexDirection: "row", 
                        alignItems: "center",
                        ...(Platform.OS === "web" ? { marginHorizontal: -3 } : { gap: 16 })
                      }}
                    >
                      <View 
                        style={{ 
                          flexDirection: "row", 
                          alignItems: "center",
                          ...(Platform.OS === "web" ? { marginHorizontal: 3 } : { gap: 6 })
                        }}
                      >
                        <MaterialIcons name="schedule" size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Text
                          style={{
                            fontSize: 13,
                            color: "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          {video.duration}
                        </Text>
                      </View>
                      <View 
                        style={{ 
                          flexDirection: "row", 
                          alignItems: "center",
                          ...(Platform.OS === "web" ? { marginHorizontal: 3 } : { gap: 6 })
                        }}
                      >
                        <MaterialIcons name="visibility" size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Text
                          style={{
                            fontSize: 13,
                            color: "rgba(255, 255, 255, 0.7)",
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
            <View 
              style={Platform.OS === "web" 
                ? {} 
                : { gap: 16 }
              }
            >
              {featuredVideos.map((video, index) => (
                <TouchableOpacity
                  key={video.id}
                  onPress={() => router.push(`/pages/university/videos/${video.id}`)}
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    ...(Platform.OS === "web" && index < featuredVideos.length - 1 && {
                      marginBottom: 16,
                    }),
                  }}
                >
                  <View
                    style={{
                      height: 180,
                      backgroundColor: "#232323",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons name="play-circle-filled" size={64} color="#4caf50" />
                  </View>
                  <View style={{ padding: 20 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 6,
                      }}
                    >
                      {video.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "rgba(255, 255, 255, 0.8)",
                        marginBottom: 12,
                        lineHeight: 22,
                      }}
                    >
                      {video.description}
                    </Text>
                    <View 
                      style={{ 
                        flexDirection: "row", 
                        alignItems: "center",
                        ...(Platform.OS === "web" ? { marginHorizontal: -3 } : { gap: 20 })
                      }}
                    >
                      <View 
                        style={{ 
                          flexDirection: "row", 
                          alignItems: "center",
                          ...(Platform.OS === "web" ? { marginHorizontal: 3 } : { gap: 6 })
                        }}
                      >
                        <MaterialIcons name="schedule" size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Text
                          style={{
                            fontSize: 13,
                            color: "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          {video.duration}
                        </Text>
                      </View>
                      <View 
                        style={{ 
                          flexDirection: "row", 
                          alignItems: "center",
                          ...(Platform.OS === "web" ? { marginHorizontal: 3 } : { gap: 6 })
                        }}
                      >
                        <MaterialIcons name="visibility" size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Text
                          style={{
                            fontSize: 13,
                            color: "rgba(255, 255, 255, 0.7)",
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

