import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { SearchResult } from '@/types/search';
import { BusinessPlaceholder } from '@/components/BusinessPlaceholder';
import { BusinessMapView } from '@/components/search/BusinessMapView';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { BackButton } from '@/components/navigation/BackButton';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';
import { useResponsive } from '@/hooks/useResponsive';

// Mock nearby businesses
const mockNearbyBusinesses: (SearchResult & { imageUrl?: string })[] = [
  {
    id: "1",
    type: "business",
    title: "Soul Food Kitchen",
    description: "Authentic Southern cuisine",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=450&fit=crop",
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
    imageUrl: "https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?w=800&h=450&fit=crop",
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
    imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=450&fit=crop",
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
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const [radius, setRadius] = useState(5); // miles
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [locationQuery, setLocationQuery] = useState("");
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>({
    lat: 33.749, // Mock user location (Atlanta)
    lng: -84.388,
  });

  const sortedBusinesses = [...mockNearbyBusinesses].sort(
    (a, b) => (a.metadata.distance || Infinity) - (b.metadata.distance || Infinity)
  );

  const formatDistance = (distance?: number) => {
    if (!distance) return "";
    return distance < 1 ? `${Math.round(distance * 5280)} ft` : `${distance.toFixed(1)} mi`;
  };

  // Show map view if selected
  if (viewMode === "map") {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style="light" />
        <BusinessMapView
          businesses={sortedBusinesses}
          userLocation={userLocation}
          onBusinessPress={(businessId) => router.push(`/pages/businesses/${businessId}`)}
          onLocationChange={setUserLocation}
        />
        {/* View Toggle */}
        <View
          style={{
            position: "absolute",
            top: spacing.lg,
            right: spacing.lg,
            flexDirection: "row",
            gap: spacing.sm,
            backgroundColor: colors.secondary,
            borderRadius: borderRadius.md,
            padding: spacing.xs,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <TouchableOpacity
            onPress={() => setViewMode("list")}
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              borderRadius: borderRadius.sm,
              backgroundColor: viewMode === "list" ? colors.accent : "transparent",
            }}
          >
            <MaterialIcons
              name="list"
              size={20}
              color={viewMode === "list" ? colors.textColors.onAccent : colors.text.secondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode("map")}
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              borderRadius: borderRadius.sm,
              backgroundColor: viewMode === "map" ? colors.accent : "transparent",
            }}
          >
            <MaterialIcons
              name="map"
              size={20}
              color={viewMode === "map" ? colors.textColors.onAccent : colors.text.secondary}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      <OptimizedScrollView
        showBackToTop={true}
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: spacing.lg,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        <BackButton label="Back to Search" />

        {/* Header with View Toggle */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: spacing.lg,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold as any,
              color: colors.text.primary,
            }}
          >
            Location Search
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: spacing.xs,
              backgroundColor: colors.secondary,
              borderRadius: borderRadius.md,
              padding: spacing.xs,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <TouchableOpacity
              onPress={() => setViewMode("list")}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: borderRadius.sm,
                backgroundColor: viewMode === "list" ? colors.accent : "transparent",
              }}
            >
              <MaterialIcons
                name="list"
                size={20}
                color={viewMode === "list" ? colors.textColors.onAccent : colors.text.secondary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewMode("map")}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: borderRadius.sm,
                backgroundColor: viewMode === "map" ? colors.accent : "transparent",
              }}
            >
              <MaterialIcons
                name="map"
                size={20}
                color={viewMode === "map" ? colors.textColors.onAccent : colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Location Input */}
        <View style={{ marginBottom: spacing.lg }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.secondary,
              borderRadius: borderRadius.md,
              paddingHorizontal: spacing.md,
              borderWidth: 1,
              borderColor: colors.border,
              marginBottom: spacing.md,
            }}
          >
            <MaterialIcons name="location-on" size={20} color={colors.accent} />
            <TextInput
              value={locationQuery}
              onChangeText={setLocationQuery}
              placeholder={useCurrentLocation ? "Using current location" : "Enter address or city"}
              placeholderTextColor={colors.text.placeholder}
              editable={!useCurrentLocation}
              style={{
                flex: 1,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.sm,
                fontSize: typography.fontSize.base,
                color: colors.text.primary,
              }}
            />
            <TouchableOpacity
              onPress={() => setUseCurrentLocation(!useCurrentLocation)}
              style={{ padding: spacing.xs }}
            >
              <MaterialIcons
                name={useCurrentLocation ? "my-location" : "location-searching"}
                size={20}
                color={useCurrentLocation ? colors.accent : colors.text.secondary}
              />
            </TouchableOpacity>
          </View>

          {/* Radius Selector */}
          <View>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginBottom: spacing.sm,
              }}
            >
              Search Radius: {radius} mile{radius !== 1 ? "s" : ""}
            </Text>
            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              {[1, 5, 10, 25, 50].map((value) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => setRadius(value)}
                  style={{
                    flex: 1,
                    backgroundColor: radius === value ? colors.accent : colors.secondary,
                    paddingVertical: spacing.sm,
                    borderRadius: borderRadius.md,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: radius === value ? colors.accent : colors.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.semibold as any,
                      color: radius === value ? colors.textColors.onAccent : colors.text.secondary,
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
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold as any,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Nearby Businesses ({sortedBusinesses.length})
          </Text>
          <View style={{ gap: spacing.md }}>
            {sortedBusinesses.map((business) => (
              <TouchableOpacity
                key={business.id}
                onPress={() => router.push(`/pages/businesses/${business.id}`)}
                style={{
                  backgroundColor: colors.secondary,
                  borderRadius: borderRadius.lg,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                {/* Business Image */}
                <View style={{ width: "100%", height: isMobile ? 180 : 200, backgroundColor: colors.background }}>
                  {business.imageUrl && !imageErrors.has(business.id) ? (
                    <Image
                      source={{ uri: business.imageUrl }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                      cachePolicy="memory-disk"
                      onError={() => {
                        setImageErrors((prev) => new Set(prev).add(business.id));
                      }}
                    />
                  ) : (
                    <BusinessPlaceholder width="100%" height={isMobile ? 180 : 200} aspectRatio={16 / 9} />
                  )}
                </View>
                
                <View style={{ padding: spacing.lg }}>
                  <Text
                      style={{
                        fontSize: typography.fontSize.lg,
                        fontWeight: typography.fontWeight.bold as any,
                        color: colors.text.primary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {business.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        marginBottom: spacing.sm,
                      }}
                    >
                      {business.description}
                    </Text>
                    <View style={{ flexDirection: "row", gap: spacing.md, flexWrap: "wrap" }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                        <MaterialIcons name="location-on" size={14} color={colors.accent} />
                        <Text
                          style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.text.secondary,
                          }}
                        >
                          {formatDistance(business.metadata.distance)}
                        </Text>
                      </View>
                      {business.metadata.rating && (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                          <MaterialIcons name="star" size={14} color="#ffd700" />
                          <Text
                            style={{
                              fontSize: typography.fontSize.sm,
                              color: colors.text.secondary,
                            }}
                          >
                            {business.metadata.rating}
                          </Text>
                        </View>
                      )}
                      {business.metadata.location && (
                        <Text
                          style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.text.secondary,
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
      </OptimizedScrollView>
    </View>
  );
}

