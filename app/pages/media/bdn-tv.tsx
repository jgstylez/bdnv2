import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { VideoChannel, VideoContent } from "../../../types/media";

// Mock data
const mockChannels: VideoChannel[] = [
  {
    id: "1",
    name: "BDN Community Spotlight",
    description: "Stories from Black entrepreneurs and community leaders",
    thumbnailUrl: "",
    category: "community",
    isSubscribed: true,
    subscriberCount: 1250,
    videoCount: 45,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Business Success Stories",
    description: "Learn from successful Black-owned businesses",
    thumbnailUrl: "",
    category: "business",
    isSubscribed: false,
    subscriberCount: 890,
    videoCount: 32,
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "3",
    name: "Financial Education",
    description: "Tips and strategies for financial empowerment",
    thumbnailUrl: "",
    category: "education",
    isSubscribed: true,
    subscriberCount: 2100,
    videoCount: 67,
    createdAt: "2024-02-01T00:00:00Z",
  },
];

const mockVideos: VideoContent[] = [
  {
    id: "1",
    channelId: "1",
    channelName: "BDN Community Spotlight",
    title: "Building Economic Power Together",
    description: "How BDN is transforming communities",
    thumbnailUrl: "",
    videoUrl: "",
    duration: "8:45",
    views: 1250,
    likes: 89,
    publishedAt: "2024-02-15T10:00:00Z",
    isPremium: false,
    tags: ["community", "empowerment"],
  },
  {
    id: "2",
    channelId: "2",
    channelName: "Business Success Stories",
    title: "From Idea to $1M Revenue",
    description: "Interview with a successful BDN merchant",
    thumbnailUrl: "",
    videoUrl: "",
    duration: "12:30",
    views: 890,
    likes: 67,
    publishedAt: "2024-02-10T14:00:00Z",
    isPremium: true,
    tags: ["business", "success"],
  },
];

export default function BDNTV() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [selectedTab, setSelectedTab] = useState<"channels" | "videos">("channels");

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        {/* Tabs */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#474747",
            borderRadius: 12,
            padding: 4,
            marginBottom: 24,
          }}
        >
          {[
            { key: "channels", label: "Channels" },
            { key: "videos", label: "Videos" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setSelectedTab(tab.key as any)}
              style={{
                flex: 1,
                backgroundColor: selectedTab === tab.key ? "#ba9988" : "transparent",
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: selectedTab === tab.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Channels Tab */}
        {selectedTab === "channels" && (
          <View style={{ gap: 16 }}>
            {mockChannels.map((channel) => (
              <TouchableOpacity
                key={channel.id}
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
                    height: 180,
                    backgroundColor: "#232323",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons name="tv" size={48} color="#ba9988" />
                </View>
                <View style={{ padding: 20 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "700",
                          color: "#ffffff",
                          marginBottom: 4,
                        }}
                      >
                        {channel.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "rgba(255, 255, 255, 0.7)",
                          marginBottom: 12,
                        }}
                      >
                        {channel.description}
                      </Text>
                    </View>
                    {channel.isSubscribed && (
                      <View
                        style={{
                          backgroundColor: "#4caf50",
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: "600",
                            color: "#ffffff",
                            textTransform: "uppercase",
                          }}
                        >
                          Subscribed
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={{ flexDirection: "row", gap: 16 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <MaterialIcons name="people" size={14} color="rgba(255, 255, 255, 0.5)" />
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        {channel.subscriberCount.toLocaleString()} subscribers
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <MaterialIcons name="video-library" size={14} color="rgba(255, 255, 255, 0.5)" />
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        {channel.videoCount} videos
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Videos Tab */}
        {selectedTab === "videos" && (
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            {mockVideos.map((video) => (
              <TouchableOpacity
                key={video.id}
                style={{
                  width: isMobile ? "100%" : "48%",
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View
                  style={{
                    height: 200,
                    backgroundColor: "#232323",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <MaterialIcons name="play-circle-filled" size={64} color="#ba9988" />
                  {video.isPremium && (
                    <View
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "#ffd700",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "600",
                          color: "#232323",
                        }}
                      >
                        PREMIUM
                      </Text>
                    </View>
                  )}
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
                      fontSize: 12,
                      color: "#ba9988",
                      marginBottom: 8,
                    }}
                  >
                    {video.channelName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: 12,
                    }}
                    numberOfLines={2}
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
                        {video.views.toLocaleString()}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <MaterialIcons name="thumb-up" size={14} color="rgba(255, 255, 255, 0.5)" />
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        {video.likes}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

