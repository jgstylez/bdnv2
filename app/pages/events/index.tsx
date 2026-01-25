import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Event, EventCategory } from '@/types/events';
import { HeroSection } from '@/components/layouts/HeroSection';
import { EventPlaceholder } from '@/components/EventPlaceholder';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

import { mockEvents } from '@/data/mocks/events';

const categories: EventCategory[] = ["music", "sports", "business", "community", "education", "arts", "food", "other"];

export default function Events() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Calculate card width for 3-column layout
  const getCardWidth = () => {
    if (isMobile) return "100%";
    if (isTablet) {
      // 2 columns on tablet: (width - gap) / 2
      return Platform.OS === 'web' ? "calc(50% - 8px)" : ((width - 16 - 16) / 2);
    }
    // 3 columns on desktop: (width - 2*gap) / 3
    return Platform.OS === 'web' ? "calc(33.333% - 11px)" : ((width - 32 - 32) / 3);
  };

  const filteredEvents = Object.values(mockEvents).filter((event) => {
    if (selectedCategory !== "all" && event.category !== selectedCategory) return false;
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return event.status === "published";
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getLowestPrice = (ticketTypes: Event["ticketTypes"]) => {
    if (ticketTypes.length === 0) return 0;
    return Math.min(...ticketTypes.map((tt) => tt.price));
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
        {/* Hero Section */}
        <HeroSection
          title="Browse Events"
          subtitle="Discover and join events from Black-owned businesses and community organizations"
        />

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 24 }}
          contentContainerStyle={{ gap: 12 }}
        >
          <TouchableOpacity
            onPress={() => setSelectedCategory("all")}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Show all events"
            accessibilityState={{ selected: selectedCategory === "all" }}
            style={{
              backgroundColor: selectedCategory === "all" ? "#ba9988" : "#474747",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: selectedCategory === "all" ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: selectedCategory === "all" ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
              }}
            >
              All
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={{
                backgroundColor: selectedCategory === category ? "#ba9988" : "#474747",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: selectedCategory === category ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: selectedCategory === category ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                  textTransform: "capitalize",
                }}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            {filteredEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                onPress={() => router.push(`/pages/events/${event.id}`)}
                style={{
                  width: getCardWidth() as any,
                  maxWidth: isMobile ? "100%" : (Platform.OS === 'web' ? "calc(33.333% - 11px)" as any : undefined),
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ width: "100%", height: 200, overflow: "hidden", backgroundColor: "#232323", position: "relative" }}>
                  {event.imageUrl && event.imageUrl.trim() !== "" ? (
                    imageErrors.has(event.id) ? (
                      <EventPlaceholder width="100%" height={200} />
                    ) : (
                      <Image
                        source={{ uri: event.imageUrl }}
                        style={{ 
                          width: "100%", 
                          height: "100%",
                        }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        transition={200}
                        priority="high"
                        {...(Platform.OS !== 'web' && {
                          accessible: false,
                        })}
                        onError={() => {
                          setImageErrors((prev) => new Set(prev).add(event.id));
                        }}
                      />
                    )
                  ) : (
                    <EventPlaceholder width="100%" height={200} />
                  )}
                </View>
                <View style={{ padding: 20 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <View
                      style={{
                        backgroundColor: "rgba(186, 153, 136, 0.15)",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#ba9988",
                          fontWeight: "600",
                          textTransform: "capitalize",
                        }}
                      >
                        {event.category}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.6)",
                      }}
                    >
                      {event.currentAttendees} / {event.maxAttendees} attending
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 8,
                    }}
                  >
                    {event.title}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: 12,
                    }}
                  >
                    {event.description}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <MaterialIcons name="event" size={16} color="rgba(255, 255, 255, 0.6)" />
                    <Text style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.7)" }}>
                      {formatDate(event.startDate)}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <MaterialIcons name="location-on" size={16} color="rgba(255, 255, 255, 0.6)" />
                    <Text style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.7)" }}>
                      {event.venue.name}, {event.venue.city}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: "#ba9988",
                      }}
                    >
                      ${getLowestPrice(event.ticketTypes)}
                      {event.ticketTypes.length > 1 && "+"}
                    </Text>
                    <TouchableOpacity
                      onPress={() => router.push(`/pages/events/${event.id}`)}
                      style={{
                        backgroundColor: "#ba9988",
                        paddingHorizontal: isMobile ? 12 : 16,
                        paddingVertical: isMobile ? 6 : 8,
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{ fontSize: isMobile ? 13 : 14, fontWeight: "600", color: "#ffffff" }}>View Details</Text>
                    </TouchableOpacity>
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
            <MaterialIcons name="event-busy" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              No events found. Try adjusting your filters.
            </Text>
          </View>
        )}
      </OptimizedScrollView>
    </View>
  );
}
