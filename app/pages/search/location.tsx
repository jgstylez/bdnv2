import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SearchResult } from "../../../types/search";
import { BusinessPlaceholder } from "../../../components/BusinessPlaceholder";

// Mock nearby businesses
const mockNearbyBusinesses: SearchResult[] = [
  {
    id: "1",
    type: "business",
    title: "Soul Food Kitchen",
    description: "Authentic Southern cuisine",
    metadata: {
      category: "Restaurant",
      location: {
        address: "123 Main Street",
        city: "Atlanta",
        state: "GA",
        zipCode: "30309",
        coordinates: { lat: 33.749, lng: -84.388 },
      },
      distance: 0.3,
      rating: 4.8,
    },
  },
  {
    id: "2",
    type: "business",
    title: "Black Beauty Salon",
    description: "Professional hair styling and beauty services",
    metadata: {
      category: "Beauty & Wellness",
      location: {
        address: "456 Oak Avenue",
        city: "Atlanta",
        state: "GA",
        zipCode: "30310",
        coordinates: { lat: 33.755, lng: -84.395 },
      },
      distance: 0.8,
      rating: 4.9,
    },
  },
  {
    id: "3",
    type: "business",
    title: "Community Bookstore",
    description: "Books by Black authors and community events",
    metadata: {
      category: "Retail",
      location: {
        address: "789 Pine Street",
        city: "Atlanta",
        state: "GA",
        zipCode: "30311",
        coordinates: { lat: 33.760, lng: -84.400 },
      },
      distance: 1.2,
      rating: 4.7,
    },
  },
];

export default function LocationSearch() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [radius, setRadius] = useState(5); // miles
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [locationQuery, setLocationQuery] = useState("");

  const sortedBusinesses = [...mockNearbyBusinesses].sort(
    (a, b) => (a.metadata.distance || Infinity) - (b.metadata.distance || Infinity)
  );

  const formatDistance = (distance?: number) => {
    if (!distance) return "";
    return distance < 1 ? `${Math.round(distance * 5280)} ft` : `${distance.toFixed(1)} mi`;
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
        {/* Location Input */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#474747",
              borderRadius: 12,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              marginBottom: 12,
            }}
          >
            <MaterialIcons name="location-on" size={20} color="#ba9988" />
            <TextInput
              value={locationQuery}
              onChangeText={setLocationQuery}
              placeholder={useCurrentLocation ? "Using current location" : "Enter address or city"}
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              editable={!useCurrentLocation}
              style={{
                flex: 1,
                paddingVertical: 14,
                paddingHorizontal: 12,
                fontSize: 16,
                color: "#ffffff",
              }}
            />
            <TouchableOpacity
              onPress={() => setUseCurrentLocation(!useCurrentLocation)}
              style={{ padding: 4 }}
            >
              <MaterialIcons
                name={useCurrentLocation ? "my-location" : "location-searching"}
                size={20}
                color={useCurrentLocation ? "#ba9988" : "rgba(255, 255, 255, 0.5)"}
              />
            </TouchableOpacity>
          </View>

          {/* Radius Selector */}
          <View>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 8,
              }}
            >
              Search Radius: {radius} mile{radius !== 1 ? "s" : ""}
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {[1, 5, 10, 25, 50].map((value) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => setRadius(value)}
                  style={{
                    flex: 1,
                    backgroundColor: radius === value ? "#ba9988" : "#474747",
                    paddingVertical: 10,
                    borderRadius: 8,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: radius === value ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: radius === value ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {value} mi
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Results */}
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Nearby Businesses ({sortedBusinesses.length})
          </Text>
          <View style={{ gap: 16 }}>
            {sortedBusinesses.map((business) => (
              <TouchableOpacity
                key={business.id}
                onPress={() => router.push(`/pages/businesses/${business.id}`)}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                {/* Business Image Placeholder */}
                <BusinessPlaceholder width="100%" height={isMobile ? 180 : 200} aspectRatio={16 / 9} />
                
                <View style={{ padding: 20 }}>
                  <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      {business.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                        marginBottom: 8,
                      }}
                    >
                      {business.description}
                    </Text>
                    <View style={{ flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <MaterialIcons name="location-on" size={14} color="#ba9988" />
                        <Text
                          style={{
                            fontSize: 12,
                            color: "rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          {formatDistance(business.metadata.distance)}
                        </Text>
                      </View>
                      {business.metadata.rating && (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                          <MaterialIcons name="star" size={14} color="#ffd700" />
                          <Text
                            style={{
                              fontSize: 12,
                              color: "rgba(255, 255, 255, 0.6)",
                            }}
                          >
                            {business.metadata.rating}
                          </Text>
                        </View>
                      )}
                      {business.metadata.location && (
                        <Text
                          style={{
                            fontSize: 12,
                            color: "rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          {business.metadata.location.city}, {business.metadata.location.state}
                        </Text>
                      )}
                    </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

