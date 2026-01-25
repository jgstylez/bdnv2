/**
 * Business Map View Component
 * 
 * Map view for discovering businesses by location
 * Uses a simple web-based map implementation (can be enhanced with react-native-maps)
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions, Linking } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "@/constants/theme";
import { SearchResult } from "@/types/search";
import { BusinessPlaceholder } from "@/components/BusinessPlaceholder";

interface BusinessMapViewProps {
  businesses: SearchResult[];
  userLocation?: {
    lat: number;
    lng: number;
  };
  onBusinessPress: (businessId: string) => void;
  onLocationChange?: (location: { lat: number; lng: number }) => void;
}

export function BusinessMapView({
  businesses,
  userLocation,
  onBusinessPress,
  onLocationChange,
}: BusinessMapViewProps) {
  const { width, height } = useWindowDimensions();
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState(
    userLocation || { lat: 33.749, lng: -84.388 } // Default to Atlanta
  );

  // Generate Google Maps URL for web view
  const generateMapUrl = () => {
    const markers = businesses
      .map((b) => {
        const coords = b.metadata.location?.coordinates;
        if (!coords) return null;
        return `${coords.lat},${coords.lng}`;
      })
      .filter(Boolean)
      .join("|");

    const center = `${mapCenter.lat},${mapCenter.lng}`;
    return `https://www.google.com/maps/dir/${center}/${markers}`;
  };

  const openInMaps = () => {
    const url = generateMapUrl();
    Linking.openURL(url).catch((err) => console.error("Failed to open maps:", err));
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return "";
    return distance < 1
      ? `${Math.round(distance * 5280)} ft`
      : `${distance.toFixed(1)} mi`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Map Placeholder */}
      <View
        style={{
          width: "100%",
          height: height * 0.5,
          backgroundColor: colors.secondary,
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        {/* Map Icon Placeholder */}
        <MaterialIcons name="map" size={64} color={colors.text.secondary} />
        <Text
          style={{
            fontSize: typography.fontSize.base,
            color: colors.text.secondary,
            marginTop: spacing.md,
            textAlign: "center",
            paddingHorizontal: spacing.lg,
          }}
        >
          Map View
        </Text>
        <Text
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.tertiary,
            marginTop: spacing.sm,
            textAlign: "center",
            paddingHorizontal: spacing.lg,
          }}
        >
          {businesses.length} business{businesses.length !== 1 ? "es" : ""} nearby
        </Text>

        {/* Open in Maps Button */}
        <TouchableOpacity
          onPress={openInMaps}
          style={{
            position: "absolute",
            bottom: spacing.lg,
            right: spacing.lg,
            backgroundColor: colors.accent,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: borderRadius.md,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.xs,
          }}
        >
          <MaterialIcons name="open-in-new" size={16} color={colors.textColors.onAccent} />
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold as any,
              color: colors.textColors.onAccent,
            }}
          >
            Open in Maps
          </Text>
        </TouchableOpacity>

        {/* User Location Indicator */}
        {userLocation && (
          <View
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: colors.accent,
              borderWidth: 3,
              borderColor: colors.background,
              transform: [{ translateX: -10 }, { translateY: -10 }],
            }}
          />
        )}
      </View>

      {/* Business List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: spacing.lg,
          gap: spacing.md,
        }}
      >
        <Text
          style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.bold as any,
            color: colors.text.primary,
            marginBottom: spacing.sm,
          }}
        >
          Nearby Businesses
        </Text>

        {businesses.map((business) => {
          const coords = business.metadata.location?.coordinates;
          const isSelected = selectedBusiness === business.id;

          return (
            <TouchableOpacity
              key={business.id}
              onPress={() => {
                setSelectedBusiness(business.id);
                onBusinessPress(business.id);
              }}
              style={{
                backgroundColor: isSelected ? colors.accent + "20" : colors.secondary,
                borderRadius: borderRadius.lg,
                padding: spacing.md,
                borderWidth: 1,
                borderColor: isSelected ? colors.accent : colors.border,
              }}
            >
              <View style={{ flexDirection: "row", gap: spacing.md }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold as any,
                      color: colors.text.primary,
                      marginBottom: spacing.xs,
                    }}
                  >
                    {business.title}
                  </Text>
                  {business.metadata.category && (
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {business.metadata.category}
                    </Text>
                  )}
                  {business.metadata.location && (
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {business.metadata.location.address}, {business.metadata.location.city}
                    </Text>
                  )}
                  <View style={{ flexDirection: "row", gap: spacing.md, alignItems: "center" }}>
                    {business.metadata.distance && (
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
                    )}
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
                  </View>
                </View>
                {coords && (
                  <TouchableOpacity
                    onPress={() => {
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
                      Linking.openURL(url);
                    }}
                    style={{
                      padding: spacing.sm,
                      borderRadius: borderRadius.md,
                      backgroundColor: colors.accent + "20",
                    }}
                  >
                    <MaterialIcons name="directions" size={20} color={colors.accent} />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
