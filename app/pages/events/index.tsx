import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Event, EventCategory } from "../../../types/events";
import { HeroSection } from "../../../components/layouts/HeroSection";

// Mock events data with real placeholder images
const mockEvents: Event[] = [
  {
    id: "1",
    organizerId: "org1",
    organizerName: "Soul Food Kitchen",
    organizerType: "business",
    title: "Jazz & Soul Food Night",
    description: "An evening of live jazz music paired with authentic soul food cuisine",
    category: "music",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    venue: {
      name: "Soul Food Kitchen",
      street: "123 Main St",
      city: "Atlanta",
      state: "GA",
      postalCode: "30303",
      country: "US",
    },
    startDate: "2024-03-15T19:00:00Z",
    endDate: "2024-03-15T23:00:00Z",
    timezone: "America/New_York",
    status: "published",
    isPublic: true,
    maxAttendees: 150,
    currentAttendees: 87,
    ticketTypes: [
      {
        id: "tt1",
        eventId: "1",
        name: "General Admission",
        price: 45,
        currency: "USD",
        quantity: 150,
        availableQuantity: 63,
        isTransferable: true,
        maxPerOrder: 10,
        minPerOrder: 1,
        createdAt: "2024-02-01T00:00:00Z",
      },
    ],
    tags: ["jazz", "music", "food", "entertainment"],
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
    publishedAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "2",
    organizerId: "org2",
    organizerName: "Black Business Network",
    organizerType: "business",
    title: "Networking Mixer: Black Entrepreneurs",
    description: "Connect with fellow Black entrepreneurs and business owners",
    category: "business",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop",
    venue: {
      name: "Convention Center",
      street: "456 Business Ave",
      city: "Atlanta",
      state: "GA",
      postalCode: "30309",
      country: "US",
    },
    startDate: "2024-03-20T18:00:00Z",
    endDate: "2024-03-20T21:00:00Z",
    timezone: "America/New_York",
    status: "published",
    isPublic: true,
    maxAttendees: 200,
    currentAttendees: 145,
    ticketTypes: [
      {
        id: "tt2",
        eventId: "2",
        name: "Early Bird",
        price: 25,
        currency: "USD",
        quantity: 50,
        availableQuantity: 5,
        salesEndDate: "2024-03-10T00:00:00Z",
        isTransferable: true,
        maxPerOrder: 5,
        minPerOrder: 1,
        createdAt: "2024-02-01T00:00:00Z",
      },
      {
        id: "tt3",
        eventId: "2",
        name: "Regular",
        price: 35,
        currency: "USD",
        quantity: 150,
        availableQuantity: 50,
        isTransferable: true,
        maxPerOrder: 10,
        minPerOrder: 1,
        createdAt: "2024-02-01T00:00:00Z",
      },
    ],
    tags: ["networking", "business", "entrepreneurship"],
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
    publishedAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "3",
    organizerId: "org3",
    organizerName: "Atlanta Hawks Community",
    organizerType: "nonprofit",
    title: "Community Basketball Tournament",
    description: "Join us for a day of competitive basketball and community building",
    category: "sports",
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop",
    venue: {
      name: "Community Sports Center",
      street: "789 Sports Way",
      city: "Atlanta",
      state: "GA",
      postalCode: "30310",
      country: "US",
    },
    startDate: "2024-03-25T10:00:00Z",
    endDate: "2024-03-25T18:00:00Z",
    timezone: "America/New_York",
    status: "published",
    isPublic: true,
    maxAttendees: 300,
    currentAttendees: 198,
    ticketTypes: [
      {
        id: "tt4",
        eventId: "3",
        name: "Spectator",
        price: 15,
        currency: "USD",
        quantity: 200,
        availableQuantity: 102,
        isTransferable: true,
        maxPerOrder: 8,
        minPerOrder: 1,
        createdAt: "2024-02-05T00:00:00Z",
      },
    ],
    tags: ["basketball", "sports", "community"],
    createdAt: "2024-02-05T00:00:00Z",
    updatedAt: "2024-02-05T00:00:00Z",
    publishedAt: "2024-02-05T00:00:00Z",
  },
  {
    id: "4",
    organizerId: "org4",
    organizerName: "Black Art Collective",
    organizerType: "nonprofit",
    title: "Black Art Exhibition: Voices & Visions",
    description: "Showcasing works from emerging and established Black artists",
    category: "arts",
    imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
    venue: {
      name: "Art Gallery Downtown",
      street: "321 Culture Blvd",
      city: "Atlanta",
      state: "GA",
      postalCode: "30308",
      country: "US",
    },
    startDate: "2024-04-01T17:00:00Z",
    endDate: "2024-04-01T21:00:00Z",
    timezone: "America/New_York",
    status: "published",
    isPublic: true,
    maxAttendees: 100,
    currentAttendees: 42,
    ticketTypes: [
      {
        id: "tt5",
        eventId: "4",
        name: "General Admission",
        price: 20,
        currency: "USD",
        quantity: 100,
        availableQuantity: 58,
        isTransferable: true,
        maxPerOrder: 6,
        minPerOrder: 1,
        createdAt: "2024-02-10T00:00:00Z",
      },
    ],
    tags: ["art", "exhibition", "culture"],
    createdAt: "2024-02-10T00:00:00Z",
    updatedAt: "2024-02-10T00:00:00Z",
    publishedAt: "2024-02-10T00:00:00Z",
  },
  {
    id: "5",
    organizerId: "org5",
    organizerName: "Community Food Bank",
    organizerType: "nonprofit",
    title: "Community Food Drive & Festival",
    description: "Help fight hunger while enjoying live music, food vendors, and family activities",
    category: "community",
    imageUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop",
    venue: {
      name: "City Park",
      street: "555 Park Avenue",
      city: "Atlanta",
      state: "GA",
      postalCode: "30311",
      country: "US",
    },
    startDate: "2024-04-06T12:00:00Z",
    endDate: "2024-04-06T18:00:00Z",
    timezone: "America/New_York",
    status: "published",
    isPublic: true,
    maxAttendees: 500,
    currentAttendees: 312,
    ticketTypes: [
      {
        id: "tt6",
        eventId: "5",
        name: "Free Entry",
        price: 0,
        currency: "USD",
        quantity: 500,
        availableQuantity: 188,
        isTransferable: false,
        maxPerOrder: 10,
        minPerOrder: 1,
        createdAt: "2024-02-12T00:00:00Z",
      },
    ],
    tags: ["community", "food", "festival"],
    createdAt: "2024-02-12T00:00:00Z",
    updatedAt: "2024-02-12T00:00:00Z",
    publishedAt: "2024-02-12T00:00:00Z",
  },
  {
    id: "6",
    organizerId: "org6",
    organizerName: "BDN University",
    organizerType: "business",
    title: "Financial Literacy Workshop",
    description: "Learn essential money management skills and investment strategies",
    category: "education",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
    venue: {
      name: "BDN University Campus",
      street: "888 Education Drive",
      city: "Atlanta",
      state: "GA",
      postalCode: "30312",
      country: "US",
    },
    startDate: "2024-04-10T14:00:00Z",
    endDate: "2024-04-10T17:00:00Z",
    timezone: "America/New_York",
    status: "published",
    isPublic: true,
    maxAttendees: 75,
    currentAttendees: 28,
    ticketTypes: [
      {
        id: "tt7",
        eventId: "6",
        name: "Workshop Ticket",
        price: 30,
        currency: "USD",
        quantity: 75,
        availableQuantity: 47,
        isTransferable: true,
        maxPerOrder: 5,
        minPerOrder: 1,
        createdAt: "2024-02-15T00:00:00Z",
      },
    ],
    tags: ["education", "finance", "workshop"],
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z",
    publishedAt: "2024-02-15T00:00:00Z",
  },
  {
    id: "7",
    organizerId: "org7",
    organizerName: "Soulful Eats",
    organizerType: "business",
    title: "Soul Food Cooking Class",
    description: "Master the art of Southern cooking with hands-on instruction",
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop",
    venue: {
      name: "Soulful Eats Kitchen",
      street: "222 Culinary Street",
      city: "Atlanta",
      state: "GA",
      postalCode: "30313",
      country: "US",
    },
    startDate: "2024-04-12T18:00:00Z",
    endDate: "2024-04-12T21:00:00Z",
    timezone: "America/New_York",
    status: "published",
    isPublic: true,
    maxAttendees: 20,
    currentAttendees: 12,
    ticketTypes: [
      {
        id: "tt8",
        eventId: "7",
        name: "Cooking Class",
        price: 65,
        currency: "USD",
        quantity: 20,
        availableQuantity: 8,
        isTransferable: true,
        maxPerOrder: 4,
        minPerOrder: 1,
        createdAt: "2024-02-18T00:00:00Z",
      },
    ],
    tags: ["cooking", "food", "class"],
    createdAt: "2024-02-18T00:00:00Z",
    updatedAt: "2024-02-18T00:00:00Z",
    publishedAt: "2024-02-18T00:00:00Z",
  },
  {
    id: "8",
    organizerId: "org8",
    organizerName: "R&B Nightlife",
    organizerType: "business",
    title: "R&B Live: Neo-Soul Edition",
    description: "Experience the best in contemporary R&B and neo-soul music",
    category: "music",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
    venue: {
      name: "The Venue",
      street: "777 Music Row",
      city: "Atlanta",
      state: "GA",
      postalCode: "30314",
      country: "US",
    },
    startDate: "2024-04-15T20:00:00Z",
    endDate: "2024-04-16T02:00:00Z",
    timezone: "America/New_York",
    status: "published",
    isPublic: true,
    maxAttendees: 250,
    currentAttendees: 156,
    ticketTypes: [
      {
        id: "tt9",
        eventId: "8",
        name: "General Admission",
        price: 40,
        currency: "USD",
        quantity: 200,
        availableQuantity: 44,
        isTransferable: true,
        maxPerOrder: 8,
        minPerOrder: 1,
        createdAt: "2024-02-20T00:00:00Z",
      },
      {
        id: "tt10",
        eventId: "8",
        name: "VIP",
        price: 75,
        currency: "USD",
        quantity: 50,
        availableQuantity: 12,
        isTransferable: true,
        maxPerOrder: 4,
        minPerOrder: 1,
        createdAt: "2024-02-20T00:00:00Z",
      },
    ],
    tags: ["music", "R&B", "live"],
    createdAt: "2024-02-20T00:00:00Z",
    updatedAt: "2024-02-20T00:00:00Z",
    publishedAt: "2024-02-20T00:00:00Z",
  },
  {
    id: "9",
    organizerId: "org9",
    organizerName: "Tech Startups ATL",
    organizerType: "business",
    title: "Black Tech Founders Summit",
    description: "Connect with investors, mentors, and fellow tech entrepreneurs",
    category: "business",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    venue: {
      name: "Tech Hub Atlanta",
      street: "999 Innovation Drive",
      city: "Atlanta",
      state: "GA",
      postalCode: "30315",
      country: "US",
    },
    startDate: "2024-04-18T09:00:00Z",
    endDate: "2024-04-18T17:00:00Z",
    timezone: "America/New_York",
    status: "published",
    isPublic: true,
    maxAttendees: 150,
    currentAttendees: 89,
    ticketTypes: [
      {
        id: "tt11",
        eventId: "9",
        name: "Early Bird",
        price: 50,
        currency: "USD",
        quantity: 50,
        availableQuantity: 11,
        salesEndDate: "2024-04-01T00:00:00Z",
        isTransferable: true,
        maxPerOrder: 3,
        minPerOrder: 1,
        createdAt: "2024-02-22T00:00:00Z",
      },
      {
        id: "tt12",
        eventId: "9",
        name: "Regular",
        price: 75,
        currency: "USD",
        quantity: 100,
        availableQuantity: 50,
        isTransferable: true,
        maxPerOrder: 5,
        minPerOrder: 1,
        createdAt: "2024-02-22T00:00:00Z",
      },
    ],
    tags: ["tech", "startup", "business"],
    createdAt: "2024-02-22T00:00:00Z",
    updatedAt: "2024-02-22T00:00:00Z",
    publishedAt: "2024-02-22T00:00:00Z",
  },
];

const categories: EventCategory[] = ["music", "sports", "business", "community", "education", "arts", "food", "other"];

export default function Events() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate card width for 3-column layout
  const getCardWidth = () => {
    if (isMobile) return "100%";
    if (isTablet) return "calc(50% - 8px)"; // 2 columns on tablet
    return "calc(33.333% - 11px)"; // 3 columns on desktop
  };

  const filteredEvents = mockEvents.filter((event) => {
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
      <ScrollView
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
                  width: getCardWidth(),
                  maxWidth: isMobile ? "100%" : "calc(33.333% - 11px)",
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ width: "100%", height: 200, overflow: "hidden", backgroundColor: "#232323" }}>
                  {event.imageUrl ? (
                    <Image
                      source={{ uri: event.imageUrl }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                      cachePolicy="memory-disk"
                    />
                  ) : (
                    <View style={{ width: "100%", height: "100%", backgroundColor: "#474747", justifyContent: "center", alignItems: "center" }}>
                      <MaterialIcons name="event" size={48} color="rgba(186, 153, 136, 0.5)" />
                    </View>
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
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>View Details</Text>
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
      </ScrollView>
    </View>
  );
}

