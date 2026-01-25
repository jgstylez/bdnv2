import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Donation, CommunityImpact } from '@/types/impact';
import { BackButton } from '@/components/navigation/BackButton';

// Mock donations
const mockDonations: Donation[] = [
  {
    id: "1",
    userId: "user1",
    amount: 100.00,
    currency: "USD",
    recipientType: "scholarship",
    recipientId: "sch-001",
    recipientName: "Community Scholarship Fund",
    impactCategory: "Education",
    isAnonymous: false,
    createdAt: "2024-02-15T10:30:00Z",
  },
  {
    id: "2",
    userId: "user1",
    amount: 50.00,
    currency: "USD",
    recipientType: "nonprofit",
    recipientId: "np-001",
    recipientName: "Black Community Foundation",
    impactCategory: "Community Development",
    isAnonymous: false,
    createdAt: "2024-02-10T14:20:00Z",
  },
  {
    id: "3",
    userId: "user1",
    amount: 200.00,
    currency: "USD",
    recipientType: "business",
    recipientId: "biz-001",
    recipientName: "Small Business Grant Program",
    impactCategory: "Economic Empowerment",
    isAnonymous: true,
    createdAt: "2024-02-05T09:15:00Z",
  },
];

const mockCommunityImpact: CommunityImpact = {
  totalDonations: 1250.00,
  totalDonors: 189,
  impactCategories: [
    { category: "Education", amount: 500.00, donorCount: 45 },
    { category: "Community Development", amount: 400.00, donorCount: 38 },
    { category: "Economic Empowerment", amount: 350.00, donorCount: 32 },
  ],
  recentDonations: mockDonations.slice(0, 3),
};

export default function Donations() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [selectedFilter, setSelectedFilter] = useState<"all" | Donation["recipientType"]>("all");

  const filteredDonations = selectedFilter === "all"
    ? mockDonations
    : mockDonations.filter((donation) => donation.recipientType === selectedFilter);

  const totalDonations = mockDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const contributors = new Set(mockDonations.map(d => d.recipientId)).size;

  const getRecipientIcon = (type: string) => {
    switch (type) {
      case "nonprofit":
        return "favorite";
      case "community":
        return "groups";
      case "scholarship":
        return "school";
      case "business":
        return "store";
      default:
        return "favorite";
    }
  };

  const getRecipientColor = (type: string) => {
    switch (type) {
      case "nonprofit":
        return "#ff4444";
      case "community":
        return "#4caf50";
      case "scholarship":
        return "#2196f3";
      case "business":
        return "#ba9988";
      default:
        return "#ba9988";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filters: { key: "all" | Donation["recipientType"]; label: string }[] = [
    { key: "all", label: "All" },
    { key: "nonprofit", label: "Nonprofits" },
    { key: "community", label: "Community" },
    { key: "scholarship", label: "Scholarships" },
    { key: "business", label: "Business" },
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

        {/* Community Impact Summary */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 20,
            padding: 24,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Community Impact
          </Text>
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 16 : 24,
              marginBottom: 20,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: 8,
                }}
              >
                Total Donated
              </Text>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "700",
                  color: "#ba9988",
                }}
              >
                ${mockCommunityImpact.totalDonations.toFixed(2)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: 8,
                }}
              >
                Total Donors
              </Text>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "700",
                  color: "#ba9988",
                }}
              >
                {mockCommunityImpact.totalDonors}
              </Text>
            </View>
          </View>
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: 12,
              }}
            >
              Impact by Category
            </Text>
            {mockCommunityImpact.impactCategories.map((category, index) => (
              <View
                key={index}
                style={{
                  marginBottom: 12,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {category.category}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ba9988",
                    }}
                  >
                    ${category.amount.toFixed(2)}
                  </Text>
                </View>
                <View
                  style={{
                    height: 6,
                    backgroundColor: "#232323",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      width: `${(category.amount / mockCommunityImpact.totalDonations) * 100}%`,
                      backgroundColor: "#ba9988",
                      borderRadius: 3,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Your Donations Summary */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 24,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: 8,
                }}
              >
                Total Donations
              </Text>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "700",
                  color: "#ba9988",
                }}
              >
                ${totalDonations.toFixed(2)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: 8,
                }}
              >
                Contributors
              </Text>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "700",
                  color: "#ba9988",
                }}
              >
                {contributors}
              </Text>
            </View>
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

        {/* Donations History */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#ffffff",
            marginBottom: 16,
          }}
        >
          Your Donations
        </Text>
        {filteredDonations.length > 0 ? (
          <View style={{ gap: 12 }}>
            {filteredDonations.map((donation) => (
              <View
                key={donation.id}
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
                        backgroundColor: `${getRecipientColor(donation.recipientType)}20`,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MaterialIcons
                        name={getRecipientIcon(donation.recipientType) as any}
                        size={24}
                        color={getRecipientColor(donation.recipientType)}
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
                        {donation.isAnonymous ? "Anonymous Donation" : donation.recipientName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        {donation.impactCategory} • {formatDate(donation.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: getRecipientColor(donation.recipientType),
                      }}
                    >
                      ${donation.amount.toFixed(2)}
                    </Text>
                    {donation.isAnonymous && (
                      <MaterialIcons name="visibility-off" size={16} color="rgba(255, 255, 255, 0.5)" style={{ marginTop: 4 }} />
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
            <MaterialIcons name="favorite" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              No donations found for this filter
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

