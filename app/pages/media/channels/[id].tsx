import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { MediaChannel, MediaContentItem } from '@/types/media';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';
import { showSuccessToast, showErrorToast, showInfoToast } from '@/lib/toast';
import { BackButton } from '@/components/navigation/BackButton';

// Mock channels data (same as channels.tsx)
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

// Mock content items
const mockContentItems: MediaContentItem[] = [
  {
    id: "1",
    channelId: "1",
    title: "Building a Successful Business in 2024",
    description: "Learn the key strategies for building and scaling your business in today's market",
    contentType: "video",
    duration: "15:30",
    views: 1250,
    likes: 89,
    publishedAt: "2024-01-15T10:00:00Z",
    isPremium: true,
    tags: ["business", "entrepreneurship", "strategy"],
  },
  {
    id: "2",
    channelId: "1",
    title: "Financial Planning for Entrepreneurs",
    description: "Essential financial planning tips for new business owners",
    contentType: "video",
    duration: "22:15",
    views: 980,
    likes: 67,
    publishedAt: "2024-01-10T10:00:00Z",
    isPremium: true,
    tags: ["finance", "planning", "business"],
  },
  {
    id: "3",
    channelId: "1",
    title: "Marketing Strategies That Work",
    description: "Discover proven marketing strategies to grow your customer base",
    contentType: "audio",
    duration: "18:45",
    views: 1450,
    likes: 102,
    publishedAt: "2024-01-05T10:00:00Z",
    isPremium: false,
    tags: ["marketing", "growth", "strategy"],
  },
  {
    id: "4",
    channelId: "2",
    title: "Community Leaders Roundtable",
    description: "A discussion with local community leaders about building stronger neighborhoods",
    contentType: "podcast",
    duration: "45:20",
    views: 2100,
    likes: 156,
    publishedAt: "2024-01-20T10:00:00Z",
    isPremium: false,
    tags: ["community", "leadership", "discussion"],
  },
  {
    id: "5",
    channelId: "2",
    title: "Youth Empowerment Initiatives",
    description: "How community programs are empowering the next generation",
    contentType: "podcast",
    duration: "38:10",
    views: 1890,
    likes: 134,
    publishedAt: "2024-01-13T10:00:00Z",
    isPremium: false,
    tags: ["youth", "empowerment", "community"],
  },
  {
    id: "6",
    channelId: "3",
    title: "Live: Q&A with Business Experts",
    description: "Join us for a live Q&A session with industry experts",
    contentType: "live",
    duration: "60:00",
    views: 3200,
    likes: 245,
    publishedAt: "2024-01-25T18:00:00Z",
    isPremium: true,
    tags: ["live", "q&a", "experts"],
  },
];

export default function ChannelDetail() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isMobile = width < 768;
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  
  // Find initial channel data
  const initialChannel = mockChannels.find((c) => c.id === id);
  
  // State for subscription status and subscriber count
  const [isSubscribed, setIsSubscribed] = useState(initialChannel?.isSubscribed || false);
  const [subscriberCount, setSubscriberCount] = useState(initialChannel?.subscriberCount || 0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Create channel object with current state
  const channel: MediaChannel | undefined = initialChannel ? {
    ...initialChannel,
    isSubscribed,
    subscriberCount,
  } : undefined;
  
  const channelContent = mockContentItems.filter((item) => item.channelId === id);

  const filters = [
    { key: "all", label: "All" },
    { key: "video", label: "Video" },
    { key: "audio", label: "Audio" },
    { key: "podcast", label: "Podcast" },
    { key: "live", label: "Live" },
  ];

  const filteredContent =
    selectedFilter === "all"
      ? channelContent
      : channelContent.filter((item) => item.contentType === selectedFilter);

  if (!channel) {
    return (
      <View style={{ flex: 1, backgroundColor: "#232323", justifyContent: "center", alignItems: "center" }}>
        <StatusBar style="light" />
        <Text style={{ color: "#ffffff", fontSize: 16 }}>Channel not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginTop: 16,
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: "#ba9988",
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#232323", fontWeight: "600" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return "play-circle-filled";
      case "audio":
        return "headset";
      case "podcast":
        return "podcasts";
      case "live":
        return "live-tv";
      default:
        return "play-circle-filled";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleSubscribe = async () => {
    if (!channel) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // If subscription requires payment, show info about payment flow
      if (channel.subscriptionRequired && channel.subscriptionPrice) {
        // In a real app, this would navigate to payment/checkout
        showInfoToast(
          "Subscription Required",
          `This channel requires a ${channel.currency === "USD" ? `$${channel.subscriptionPrice.toFixed(2)}` : `${channel.subscriptionPrice} ${channel.currency}`} monthly subscription. Redirecting to checkout...`
        );
        
        // Simulate successful subscription after payment
        setTimeout(() => {
          setIsSubscribed(true);
          setSubscriberCount((prev) => prev + 1);
          showSuccessToast(
            "Successfully Subscribed!",
            `You're now subscribed to ${channel.name}. Enjoy exclusive content!`
          );
        }, 1500);
      } else {
        // Free subscription (like Community Podcast)
        setIsSubscribed(true);
        setSubscriberCount((prev) => prev + 1);
        showSuccessToast(
          "Subscribed!",
          `You're now following ${channel.name}. You'll be notified of new content.`
        );
      }
    } catch (error) {
      showErrorToast(
        "Subscription Failed",
        "Unable to complete subscription. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!channel) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      setIsSubscribed(false);
      setSubscriberCount((prev) => Math.max(0, prev - 1));
      
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
      showErrorToast(
        "Unsubscribe Failed",
        "Unable to unsubscribe. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = () => {
    if (!channel) return;
    
    // In a real app, this would navigate to subscription management page
    showInfoToast(
      "Manage Subscription",
      "Redirecting to subscription settings..."
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <OptimizedScrollView
        showBackToTop={true}
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        {/* Header with Back Button */}
        <BackButton 
          label="Back to Channels"
          textColor="#ffffff"
          iconColor="#ffffff"
          onPress={() => {
            router.back();
          }}
        />

        {/* Channel Header Card */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 16 }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#232323",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name={channel.icon as any} size={40} color="#ba9988" />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 12 }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "700",
                    color: "#ffffff",
                    flex: 1,
                  }}
                  numberOfLines={2}
                >
                  {channel.name}
                </Text>
                {isSubscribed && (
                  <View
                    style={{
                      backgroundColor: "#4caf50",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 8,
                      flexShrink: 0,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: "#ffffff",
                        textTransform: "uppercase",
                      }}
                    >
                      {channel.subscriptionRequired ? "Subscribed" : "Following"}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: 16,
                }}
              >
                {channel.description}
              </Text>
              <View style={{ flexDirection: "row", gap: 24, marginBottom: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <MaterialIcons name="library-books" size={16} color="rgba(255, 255, 255, 0.5)" />
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    {channel.contentCount} items
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <MaterialIcons name="people" size={16} color="rgba(255, 255, 255, 0.5)" />
                  <Text
                    style={{
                      fontSize: 14,
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
                      fontSize: 18,
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
                  onPress={isSubscribed ? handleUnsubscribe : handleSubscribe}
                  disabled={isLoading}
                  style={{
                    backgroundColor: isSubscribed ? "#474747" : "#ba9988",
                    paddingHorizontal: 24,
                    paddingVertical: 12,
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
                        color: isSubscribed ? "#ffffff" : "#232323",
                      }}
                    >
                      Processing...
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: isSubscribed ? "#ffffff" : "#232323",
                      }}
                    >
                      {isSubscribed ? (channel.subscriptionRequired ? "Manage" : "Unsubscribe") : (channel.subscriptionRequired ? "Subscribe" : "Follow")}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Content Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 24 }}
          contentContainerStyle={{ gap: 8 }}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setSelectedFilter(filter.key)}
              style={{
                backgroundColor: selectedFilter === filter.key ? "#ba9988" : "#474747",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: selectedFilter === filter.key ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: selectedFilter === filter.key ? "#232323" : "rgba(255, 255, 255, 0.7)",
                }}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content Items */}
        {filteredContent.length > 0 ? (
          <View style={{ gap: 16 }}>
            {filteredContent.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: isMobile ? "column" : "row", gap: 16 }}>
                  {/* Thumbnail */}
                  <View
                    style={{
                      width: isMobile ? "100%" : 200,
                      height: isMobile ? 200 : 120,
                      borderRadius: 12,
                      backgroundColor: "#232323",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {item.thumbnailUrl ? (
                      <Image
                        source={{ uri: item.thumbnailUrl }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                      />
                    ) : (
                      <MaterialIcons
                        name={getContentTypeIcon(item.contentType) as any}
                        size={48}
                        color="#ba9988"
                      />
                    )}
                    {item.contentType === "live" && (
                      <View
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "#ff0000",
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 4,
                        }}
                      >
                        <Text style={{ color: "#ffffff", fontSize: 10, fontWeight: "700" }}>LIVE</Text>
                      </View>
                    )}
                    {item.duration && (
                      <View
                        style={{
                          position: "absolute",
                          bottom: 8,
                          right: 8,
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          paddingHorizontal: 6,
                          paddingVertical: 4,
                          borderRadius: 4,
                        }}
                      >
                        <Text style={{ color: "#ffffff", fontSize: 12, fontWeight: "600" }}>
                          {item.duration}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Content Info */}
                  <View style={{ flex: 1, gap: 8 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      {item.isPremium && (
                        <View
                          style={{
                            backgroundColor: "#ba9988",
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 6,
                          }}
                        >
                          <Text style={{ color: "#232323", fontSize: 10, fontWeight: "700" }}>PREMIUM</Text>
                        </View>
                      )}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <MaterialIcons
                          name={getContentTypeIcon(item.contentType) as any}
                          size={16}
                          color="rgba(255, 255, 255, 0.5)"
                        />
                        <Text style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 12, textTransform: "capitalize" }}>
                          {item.contentType}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: "#ffffff",
                      }}
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                      numberOfLines={2}
                    >
                      {item.description}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginTop: 4 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <MaterialIcons name="visibility" size={14} color="rgba(255, 255, 255, 0.5)" />
                        <Text style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 12 }}>
                          {item.views.toLocaleString()}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <MaterialIcons name="favorite" size={14} color="rgba(255, 255, 255, 0.5)" />
                        <Text style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 12 }}>
                          {item.likes}
                        </Text>
                      </View>
                      <Text style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 12 }}>
                        {formatDate(item.publishedAt)}
                      </Text>
                    </View>
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
            <MaterialIcons name="library-books" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              No content found for this filter
            </Text>
          </View>
        )}
      </OptimizedScrollView>
    </View>
  );
}
