import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { ImpactPoint } from '@/types/impact';

// Mock impact points
const mockPoints: ImpactPoint[] = [
  {
    id: "1",
    userId: "user1",
    points: 250,
    source: "purchase",
    description: "Purchase at Soul Food Kitchen",
    relatedTransactionId: "txn-001",
    createdAt: "2024-02-15T10:30:00Z",
  },
  {
    id: "2",
    userId: "user1",
    points: 500,
    source: "referral",
    description: "Referred Sarah Johnson",
    relatedUserId: "user2",
    createdAt: "2024-02-10T14:20:00Z",
  },
  {
    id: "3",
    userId: "user1",
    points: 100,
    source: "feedback",
    description: "Left review for Black Beauty Salon",
    relatedTransactionId: "txn-002",
    createdAt: "2024-02-08T09:15:00Z",
  },
  {
    id: "4",
    userId: "user1",
    points: 200,
    source: "donation",
    description: "Donated to Community Scholarship Fund",
    relatedTransactionId: "don-001",
    createdAt: "2024-02-05T16:45:00Z",
  },
];

export default function ImpactPoints() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [selectedFilter, setSelectedFilter] = useState<"all" | ImpactPoint["source"]>("all");

  const filteredPoints = selectedFilter === "all" 
    ? mockPoints 
    : mockPoints.filter((point) => point.source === selectedFilter);

  const totalPoints = mockPoints.reduce((sum, point) => sum + point.points, 0);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "purchase":
        return "shopping-bag";
      case "referral":
        return "people";
      case "feedback":
        return "rate-review";
      case "donation":
        return "favorite";
      case "sponsorship":
        return "trending-up";
      case "achievement":
        return "emoji-events";
      default:
        return "stars";
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case "purchase":
        return "#ba9988";
      case "referral":
        return "#4caf50";
      case "feedback":
        return "#ffd700";
      case "donation":
        return "#ff4444";
      case "sponsorship":
        return "#9c27b0";
      case "achievement":
        return "#2196f3";
      default:
        return "#ba9988";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filters: { key: "all" | ImpactPoint["source"]; label: string }[] = [
    { key: "all", label: "All" },
    { key: "purchase", label: "Purchases" },
    { key: "referral", label: "Referrals" },
    { key: "feedback", label: "Feedback" },
    { key: "donation", label: "Donations" },
    { key: "sponsorship", label: "Sponsorship" },
    { key: "achievement", label: "Achievements" },
  ];

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
        {/* Total Points */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 20,
            padding: 24,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: 8,
            }}
          >
            Total Points Earned
          </Text>
          <Text
            style={{
              fontSize: isMobile ? 36 : 48,
              fontWeight: "800",
              color: "#ba9988",
              letterSpacing: -1,
            }}
          >
            {totalPoints.toLocaleString()}
          </Text>
        </View>

        {/* Filters */}
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
                  color: selectedFilter === filter.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                }}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Points History */}
        {filteredPoints.length > 0 ? (
          <View style={{ gap: 12 }}>
            {filteredPoints.map((point) => (
              <View
                key={point.id}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: `${getSourceColor(point.source)}20`,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MaterialIcons
                        name={getSourceIcon(point.source) as any}
                        size={24}
                        color={getSourceColor(point.source)}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#ffffff",
                          marginBottom: 4,
                        }}
                      >
                        {point.description}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        {formatDate(point.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: getSourceColor(point.source),
                      }}
                    >
                      +{point.points}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: "rgba(255, 255, 255, 0.5)",
                        textTransform: "capitalize",
                        marginTop: 2,
                      }}
                    >
                      {point.source}
                    </Text>
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
            <MaterialIcons name="stars" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              No points found for this filter
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

