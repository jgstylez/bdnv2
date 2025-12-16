import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { MediaChannel } from "../../../types/media";

// Mock channels
const mockChannels: MediaChannel[] = [
  {
    id: "1",
    name: "Premium Business Insights",
    description: "Exclusive content for entrepreneurs",
    icon: "business",
    category: "video",
    subscriptionRequired: true,
    subscriptionPrice: 9.99,
    currency: "USD",
    contentCount: 120,
    subscriberCount: 450,
    isSubscribed: false,
  },
  {
    id: "2",
    name: "Community Podcast",
    description: "Weekly conversations with community leaders",
    icon: "podcasts",
    category: "podcast",
    subscriptionRequired: false,
    contentCount: 85,
    subscriberCount: 1200,
    isSubscribed: true,
  },
  {
    id: "3",
    name: "Live Events",
    description: "Stream live community events and workshops",
    icon: "live-tv",
    category: "live",
    subscriptionRequired: true,
    subscriptionPrice: 4.99,
    currency: "USD",
    contentCount: 25,
    subscriberCount: 320,
    isSubscribed: false,
  },
];

export default function MediaChannels() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { key: "all", label: "All" },
    { key: "video", label: "Video" },
    { key: "audio", label: "Audio" },
    { key: "podcast", label: "Podcast" },
    { key: "live", label: "Live" },
  ];

  const filteredChannels = selectedCategory === "all"
    ? mockChannels
    : mockChannels.filter((channel) => channel.category === selectedCategory);

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
        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 24 }}
          contentContainerStyle={{ gap: 8 }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              onPress={() => setSelectedCategory(category.key)}
              style={{
                backgroundColor: selectedCategory === category.key ? "#2196f3" : "#474747",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: selectedCategory === category.key ? "#2196f3" : "rgba(186, 153, 136, 0.2)",
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

        {/* Channels List */}
        {filteredChannels.length > 0 ? (
          <View style={{ gap: 16 }}>
            {filteredChannels.map((channel) => (
              <View
                key={channel.id}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 16 }}>
                  <View
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      backgroundColor: "#232323",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons name={channel.icon as any} size={32} color="#ba9988" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "700",
                          color: "#ffffff",
                        }}
                      >
                        {channel.name}
                      </Text>
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
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                        marginBottom: 12,
                      }}
                    >
                      {channel.description}
                    </Text>
                    <View style={{ flexDirection: "row", gap: 16, marginBottom: 12 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <MaterialIcons name="library-books" size={14} color="rgba(255, 255, 255, 0.5)" />
                        <Text
                          style={{
                            fontSize: 12,
                            color: "rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          {channel.contentCount} items
                        </Text>
                      </View>
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
                    </View>
                    {channel.subscriptionRequired && (
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "700",
                            color: "#ba9988",
                          }}
                        >
                          {channel.currency === "USD" ? `$${channel.subscriptionPrice?.toFixed(2)}` : `${channel.subscriptionPrice} ${channel.currency}`} / month
                        </Text>
                        <TouchableOpacity
                          style={{
                            backgroundColor: channel.isSubscribed ? "#474747" : "#ba9988",
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 12,
                            borderWidth: channel.isSubscribed ? 1 : 0,
                            borderColor: "#ba9988",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "600",
                              color: "#ffffff",
                            }}
                          >
                            {channel.isSubscribed ? "Manage" : "Subscribe"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
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
            <MaterialIcons name="subscriptions" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              No channels found for this category
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

