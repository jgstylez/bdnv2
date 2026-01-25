import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { MediaChannel } from '@/types/media';
import { showSuccessToast, showErrorToast, showInfoToast } from '@/lib/toast';
import { BackButton } from '@/components/navigation/BackButton';

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
  const router = useRouter();
  const isMobile = width < 768;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // State for subscription status and subscriber counts
  const [channelStates, setChannelStates] = useState<Record<string, { isSubscribed: boolean; subscriberCount: number; isLoading: boolean }>>(() => {
    const initialState: Record<string, { isSubscribed: boolean; subscriberCount: number; isLoading: boolean }> = {};
    mockChannels.forEach((channel) => {
      initialState[channel.id] = {
        isSubscribed: channel.isSubscribed,
        subscriberCount: channel.subscriberCount,
        isLoading: false,
      };
    });
    return initialState;
  });

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

  const handleSubscribe = async (channel: MediaChannel, e: any) => {
    e.stopPropagation(); // Prevent navigation when clicking subscribe button
    
    setChannelStates((prev) => ({
      ...prev,
      [channel.id]: { ...prev[channel.id], isLoading: true },
    }));
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // If subscription requires payment, show info about payment flow
      if (channel.subscriptionRequired && channel.subscriptionPrice) {
        showInfoToast(
          "Subscription Required",
          `This channel requires a ${channel.currency === "USD" ? `$${channel.subscriptionPrice.toFixed(2)}` : `${channel.subscriptionPrice} ${channel.currency}`} monthly subscription. Redirecting to checkout...`
        );
        
        // Simulate successful subscription after payment
        setTimeout(() => {
          setChannelStates((prev) => ({
            ...prev,
            [channel.id]: {
              isSubscribed: true,
              subscriberCount: prev[channel.id].subscriberCount + 1,
              isLoading: false,
            },
          }));
          showSuccessToast(
            "Successfully Subscribed!",
            `You're now subscribed to ${channel.name}. Enjoy exclusive content!`
          );
        }, 1500);
      } else {
        // Free subscription (like Community Podcast)
        setChannelStates((prev) => ({
          ...prev,
          [channel.id]: {
            isSubscribed: true,
            subscriberCount: prev[channel.id].subscriberCount + 1,
            isLoading: false,
          },
        }));
        showSuccessToast(
          "Subscribed!",
          `You're now following ${channel.name}. You'll be notified of new content.`
        );
      }
    } catch (error) {
      setChannelStates((prev) => ({
        ...prev,
        [channel.id]: { ...prev[channel.id], isLoading: false },
      }));
      showErrorToast(
        "Subscription Failed",
        "Unable to complete subscription. Please try again later."
      );
    }
  };

  const handleUnsubscribe = async (channel: MediaChannel, e: any) => {
    e.stopPropagation(); // Prevent navigation when clicking unsubscribe button
    
    setChannelStates((prev) => ({
      ...prev,
      [channel.id]: { ...prev[channel.id], isLoading: true },
    }));
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      setChannelStates((prev) => ({
        ...prev,
        [channel.id]: {
          isSubscribed: false,
          subscriberCount: Math.max(0, prev[channel.id].subscriberCount - 1),
          isLoading: false,
        },
      }));
      
      if (channel.subscriptionRequired && channel.subscriptionPrice) {
        showInfoToast(
          "Unsubscribed",
          `You've unsubscribed from ${channel.name}. Your subscription will remain active until the end of the billing period.`
        );
      } else {
        showInfoToast(
          "Unsubscribed",
          `You've unsubscribed from ${channel.name}. You won't receive notifications for new content.`
        );
      }
    } catch (error) {
      setChannelStates((prev) => ({
        ...prev,
        [channel.id]: { ...prev[channel.id], isLoading: false },
      }));
      showErrorToast(
        "Unsubscribe Failed",
        "Unable to unsubscribe. Please try again later."
      );
    }
  };

  const handleManageSubscription = (channel: MediaChannel, e: any) => {
    e.stopPropagation(); // Prevent navigation when clicking manage button
    
    // In a real app, this would navigate to subscription management page
    showInfoToast(
      "Manage Subscription",
      "Redirecting to subscription settings..."
    );
  };

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
        {/* Back Button */}
        <View style={{ marginBottom: 24 }}>
          <BackButton 
            label="Back"
            textColor="#ffffff"
            iconColor="#ffffff"
            marginBottom={0}
            onPress={() => {
              router.back();
            }}
          />
        </View>

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
            {filteredChannels.map((channel) => {
              const channelState = channelStates[channel.id];
              const isSubscribed = channelState?.isSubscribed ?? channel.isSubscribed;
              const subscriberCount = channelState?.subscriberCount ?? channel.subscriberCount;
              const isLoading = channelState?.isLoading ?? false;
              
              return (
                <TouchableOpacity
                  key={channel.id}
                  onPress={() => router.push(`/pages/media/channels/${channel.id}`)}
                  activeOpacity={0.7}
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
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: Platform.OS === "ios" ? 12 : 8 }}>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "700",
                            color: "#ffffff",
                            flex: 1,
                            marginRight: Platform.OS === "ios" ? 12 : 8,
                          }}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {channel.name}
                        </Text>
                        {isSubscribed && (
                          <View
                            style={{
                              backgroundColor: "#4caf50",
                              paddingHorizontal: Platform.OS === "ios" ? 12 : 10,
                              paddingVertical: Platform.OS === "ios" ? 6 : 4,
                              borderRadius: 8,
                              flexShrink: 0,
                              alignSelf: "flex-start",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: Platform.OS === "ios" ? 12 : 11,
                                fontWeight: "600",
                                color: "#ffffff",
                                textTransform: "uppercase",
                                letterSpacing: Platform.OS === "ios" ? 0.5 : 0,
                              }}
                            >
                              {channel.subscriptionRequired ? "Subscribed" : "Following"}
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
                            {subscriberCount.toLocaleString()} subscribers
                          </Text>
                        </View>
                      </View>
                      {/* Subscription Button - Show for paid channels or free channels that can be followed */}
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        {channel.subscriptionRequired && channel.subscriptionPrice && (
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "700",
                              color: "#ba9988",
                            }}
                          >
                            {channel.currency === "USD" ? `$${channel.subscriptionPrice.toFixed(2)}` : `${channel.subscriptionPrice} ${channel.currency}`} / month
                          </Text>
                        )}
                        {!channel.subscriptionRequired && (
                          <View style={{ flex: 1 }} />
                        )}
                        <TouchableOpacity
                          onPress={(e) => isSubscribed ? handleUnsubscribe(channel, e) : handleSubscribe(channel, e)}
                          disabled={isLoading}
                          style={{
                            backgroundColor: isSubscribed ? "#474747" : "#ba9988",
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 12,
                            borderWidth: isSubscribed ? 1 : 0,
                            borderColor: "#ba9988",
                            opacity: isLoading ? 0.6 : 1,
                            minWidth: 120,
                            alignItems: "center",
                          }}
                        >
                          {isLoading ? (
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: "600",
                                color: "#ffffff",
                              }}
                            >
                              Processing...
                            </Text>
                          ) : (
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: "600",
                                color: "#ffffff",
                              }}
                            >
                              {isSubscribed ? (channel.subscriptionRequired ? "Manage" : "Unsubscribe") : (channel.subscriptionRequired ? "Subscribe" : "Follow")}
                            </Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
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

