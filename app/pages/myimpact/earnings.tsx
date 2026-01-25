import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { EarningsReward } from '@/types/impact';
import { BackButton } from '@/components/navigation/BackButton';

// Mock earnings rewards
const mockEarningsRewards: EarningsReward[] = [
  {
    id: "1",
    sponsorId: "user1",
    referredUserId: "user2",
    rewardType: "purchase",
    points: 50,
    cashback: 2.50,
    description: "Sarah Johnson made a purchase",
    createdAt: "2024-02-15T10:30:00Z",
  },
  {
    id: "2",
    sponsorId: "user1",
    referredUserId: "user3",
    rewardType: "signup",
    points: 100,
    description: "Marcus Williams signed up",
    createdAt: "2024-02-10T14:20:00Z",
  },
  {
    id: "3",
    sponsorId: "user1",
    referredUserId: "user2",
    rewardType: "referral",
    points: 200,
    cashback: 5.00,
    description: "Sarah Johnson referred a new user",
    createdAt: "2024-02-08T09:15:00Z",
  },
  {
    id: "4",
    sponsorId: "user1",
    referredUserId: "user4",
    rewardType: "activity",
    points: 25,
    description: "Aisha Davis completed profile",
    createdAt: "2024-02-05T16:45:00Z",
  },
];

export default function Earnings() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [selectedFilter, setSelectedFilter] = useState<"all" | EarningsReward["rewardType"]>("all");

  const filteredRewards = selectedFilter === "all"
    ? mockEarningsRewards
    : mockEarningsRewards.filter((reward) => reward.rewardType === selectedFilter);

  const totalPoints = mockEarningsRewards.reduce((sum, reward) => sum + reward.points, 0);
  const totalCashback = mockEarningsRewards.reduce((sum, reward) => sum + (reward.cashback || 0), 0);

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return "shopping-bag";
      case "signup":
        return "person-add";
      case "referral":
        return "people";
      case "activity":
        return "check-circle";
      default:
        return "trending-up";
    }
  };

  const getRewardColor = (type: string) => {
    switch (type) {
      case "purchase":
        return "#ba9988";
      case "signup":
        return "#4caf50";
      case "referral":
        return "#2196f3";
      case "activity":
        return "#ffd700";
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

  const filters: { key: "all" | EarningsReward["rewardType"]; label: string }[] = [
    { key: "all", label: "All" },
    { key: "purchase", label: "Purchases" },
    { key: "signup", label: "Signups" },
    { key: "referral", label: "Referrals" },
    { key: "activity", label: "Activity" },
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
        {/* Back Button */}
        <BackButton 
          textColor="#ffffff"
          iconColor="#ffffff"
          onPress={() => {
            router.back();
          }}
        />

        {/* Summary */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
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
                fontSize: 28,
                fontWeight: "700",
                color: "#ba9988",
              }}
            >
              {totalPoints.toLocaleString()}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 8,
              }}
            >
              Total Cashback
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#4caf50",
              }}
            >
              ${totalCashback.toFixed(2)}
            </Text>
          </View>
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

        {/* Rewards History */}
        {filteredRewards.length > 0 ? (
          <View style={{ gap: 12 }}>
            {filteredRewards.map((reward) => (
              <View
                key={reward.id}
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
                        backgroundColor: `${getRewardColor(reward.rewardType)}20`,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MaterialIcons
                        name={getRewardIcon(reward.rewardType) as any}
                        size={24}
                        color={getRewardColor(reward.rewardType)}
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
                        {reward.description}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        {formatDate(reward.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    {reward.points > 0 && (
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "700",
                          color: getRewardColor(reward.rewardType),
                        }}
                      >
                        +{reward.points} pts
                      </Text>
                    )}
                    {reward.cashback && (
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#4caf50",
                          marginTop: 4,
                        }}
                      >
                        +${reward.cashback.toFixed(2)}
                      </Text>
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
            <MaterialIcons name="trending-up" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              No earnings rewards found for this filter
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
