import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { Donation } from "../../../types/nonprofit";

// Mock donations
const mockDonations: Donation[] = [
  {
    id: "1",
    donorId: "user1",
    donorName: "John Doe",
    organizationId: "org1",
    organizationName: "Community Foundation",
    campaignId: "1",
    campaignTitle: "Community Food Drive 2024",
    amount: 100.00,
    currency: "USD",
    anonymous: false,
    message: "Happy to help!",
    status: "completed",
    createdAt: "2024-02-15T10:30:00Z",
    processedAt: "2024-02-15T10:30:05Z",
  },
  {
    id: "2",
    donorId: "user2",
    donorName: "Jane Smith",
    organizationId: "org1",
    organizationName: "Community Foundation",
    campaignId: "1",
    campaignTitle: "Community Food Drive 2024",
    amount: 50.00,
    currency: "USD",
    anonymous: false,
    status: "completed",
    createdAt: "2024-02-15T09:15:00Z",
    processedAt: "2024-02-15T09:15:03Z",
  },
  {
    id: "3",
    donorId: "user3",
    donorName: "Anonymous",
    organizationId: "org1",
    organizationName: "Community Foundation",
    campaignId: "2",
    campaignTitle: "Youth Education Program",
    amount: 25.00,
    currency: "BLKD",
    anonymous: true,
    status: "completed",
    createdAt: "2024-02-14T08:00:00Z",
    processedAt: "2024-02-14T08:00:02Z",
  },
];

export default function NonprofitDonations() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [filter, setFilter] = useState<"all" | "USD" | "BLKD">("all");

  const filteredDonations = mockDonations.filter((donation) => {
    if (filter === "all") return true;
    return donation.currency === filter;
  });

  const totalDonations = filteredDonations.reduce((sum, d) => sum + d.amount, 0);
  const totalContributors = new Set(filteredDonations.map((d) => d.donorId)).size;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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
        {/* Summary Cards */}
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            gap: 16,
            marginBottom: 32,
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
              Total Donations
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "800",
                color: "#4caf50",
              }}
            >
              ${totalDonations.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
              Contributors
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "800",
                color: "#ba9988",
              }}
            >
              {totalContributors}
            </Text>
          </View>
        </View>

        {/* Filter */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#474747",
              borderRadius: 12,
              padding: 4,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            {(["all", "USD", "BLKD"] as const).map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setFilter(option)}
                style={{
                  flex: 1,
                  backgroundColor: filter === option ? "#ba9988" : "transparent",
                  paddingVertical: 10,
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: filter === option ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  {option === "all" ? "All" : option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Donations List */}
        {filteredDonations.length > 0 ? (
          <View style={{ gap: 12 }}>
            {filteredDonations.map((donation) => (
              <View
                key={donation.id}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: "rgba(76, 175, 80, 0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons name="favorite" size={24} color="#4caf50" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      {donation.anonymous ? "Anonymous Donor" : donation.donorName}
                    </Text>
                    {donation.campaignTitle && (
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                          marginBottom: 4,
                        }}
                      >
                        {donation.campaignTitle}
                      </Text>
                    )}
                    {donation.message && (
                      <Text
                        style={{
                          fontSize: 13,
                          color: "rgba(255, 255, 255, 0.7)",
                          fontStyle: "italic",
                          marginTop: 4,
                        }}
                      >
                        "{donation.message}"
                      </Text>
                    )}
                    <Text
                      style={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.5)",
                        marginTop: 4,
                      }}
                    >
                      {formatDate(donation.createdAt)}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#4caf50",
                      }}
                    >
                      +{donation.currency === "USD" ? "$" : ""}
                      {donation.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      {donation.currency === "BLKD" ? " BLKD" : ""}
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
            <MaterialIcons name="favorite-border" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              No donations found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

