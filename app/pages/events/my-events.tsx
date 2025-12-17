import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Event, EventStatus } from '@/types/events';

// Mock events data
const mockEvents: Event[] = [
  {
    id: "1",
    organizerId: "org1",
    organizerName: "Soul Food Kitchen",
    organizerType: "business",
    title: "Jazz & Soul Food Night",
    description: "An evening of live jazz music paired with authentic soul food cuisine",
    category: "music",
    imageUrl: "",
    venue: {
      name: "Soul Food Kitchen",
      address: "123 Main St",
      city: "Atlanta",
      state: "GA",
      zipCode: "30303",
      country: "USA",
    },
    startDate: "2024-03-15T19:00:00Z",
    endDate: "2024-03-15T23:00:00Z",
    timezone: "America/New_York",
    status: "published",
    isPublic: true,
    maxAttendees: 150,
    currentAttendees: 87,
    ticketTypes: [],
    tags: [],
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
    publishedAt: "2024-02-01T00:00:00Z",
  },
];

export default function MyEvents() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [filter, setFilter] = useState<EventStatus | "all">("all");

  const filteredEvents = mockEvents.filter((event) => {
    if (filter === "all") return true;
    return event.status === filter;
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

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case "published":
        return "#4caf50";
      case "draft":
        return "#ff9800";
      case "cancelled":
        return "#f44336";
      case "completed":
        return "#2196f3";
      default:
        return "rgba(255, 255, 255, 0.6)";
    }
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
        {/* Create Event Button */}
        <View style={{ marginBottom: 32, alignItems: "flex-end" }}>
          <TouchableOpacity
            onPress={() => router.push("/pages/events/create")}
            style={{
              backgroundColor: "#ba9988",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <MaterialIcons name="add-circle-outline" size={20} color="#ffffff" />
            <Text style={{ color: "#ffffff", fontWeight: "600" }}>Create Event</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 24 }}
          contentContainerStyle={{ gap: 8 }}
        >
          {(["all", "published", "draft", "completed", "cancelled"] as const).map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setFilter(status)}
              style={{
                backgroundColor: filter === status ? "#ba9988" : "#474747",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: filter === status ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: filter === status ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                  textTransform: "capitalize",
                }}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Events List */}
        {filteredEvents.length > 0 ? (
          <View style={{ gap: 16 }}>
            {filteredEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                onPress={() => router.push(`/pages/events/${event.id}`)}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: isMobile ? "column" : "row" }}>
                  <View
                    style={{
                      width: isMobile ? "100%" : 200,
                      height: isMobile ? 200 : 200,
                      overflow: "hidden",
                    }}
                  >
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
                  <View style={{ flex: 1, padding: 20 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <View
                        style={{
                          backgroundColor: `rgba(${getStatusColor(event.status).replace("#", "")}, 0.15)`,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 6,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            color: getStatusColor(event.status),
                            fontWeight: "600",
                            textTransform: "capitalize",
                          }}
                        >
                          {event.status}
                        </Text>
                      </View>
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

                    <View style={{ gap: 8, marginBottom: 16 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <MaterialIcons name="event" size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Text style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.7)" }}>
                          {formatDate(event.startDate)}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <MaterialIcons name="location-on" size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Text style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.7)" }}>
                          {event.venue.name}, {event.venue.city}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <MaterialIcons name="people" size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Text style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.7)" }}>
                          {event.currentAttendees} / {event.maxAttendees} attendees
                        </Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <TouchableOpacity
                        onPress={() => router.push(`/pages/events/${event.id}`)}
                        style={{
                          flex: 1,
                          backgroundColor: "#232323",
                          borderRadius: 8,
                          paddingVertical: 10,
                          alignItems: "center",
                          borderWidth: 1,
                          borderColor: "rgba(186, 153, 136, 0.2)",
                        }}
                      >
                        <Text style={{ fontSize: 14, fontWeight: "600", color: "#ba9988" }}>
                          View Details
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => alert("Edit event")}
                        style={{
                          flex: 1,
                          backgroundColor: "#ba9988",
                          borderRadius: 8,
                          paddingVertical: 10,
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
                          Manage
                        </Text>
                      </TouchableOpacity>
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
            <MaterialIcons name="event-busy" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#ffffff",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              No Events Yet
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              Create your first event to start selling tickets
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/pages/events/create")}
              style={{
                backgroundColor: "#ba9988",
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 24,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
                Create Event
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

