import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Organization } from "../../../types/nonprofit";
import { HeroSection } from "../../../components/layouts/HeroSection";
import { useResponsive } from "../../../hooks/useResponsive";
import { spacing } from "../../../constants/theme";

// Mock organizations available for Pay-It-Forward
const mockOrganizations: Organization[] = [
  {
    id: "org1",
    name: "Community Food Bank",
    type: "nonprofit",
    status: "approved",
    ein: "12-3456789",
    description: "Providing meals and food assistance to families in need",
    mission: "To eliminate hunger in our community through food distribution and support services",
    website: "https://communityfoodbank.org",
    email: "info@communityfoodbank.org",
    phone: "(404) 555-0100",
    address: {
      street: "123 Food Drive Way",
      city: "Atlanta",
      state: "GA",
      zipCode: "30309",
      country: "USA",
    },
    verified: true,
    createdAt: "2024-01-15T00:00:00Z",
    approvedAt: "2024-01-20T00:00:00Z",
    userId: "user1",
  },
  {
    id: "org2",
    name: "Youth Education Foundation",
    type: "nonprofit",
    status: "approved",
    ein: "12-3456790",
    description: "Supporting after-school programs and educational opportunities for underserved youth",
    mission: "Empowering youth through education and mentorship programs",
    website: "https://youtheducation.org",
    email: "info@youtheducation.org",
    phone: "(404) 555-0101",
    address: {
      street: "456 Education Blvd",
      city: "Atlanta",
      state: "GA",
      zipCode: "30310",
      country: "USA",
    },
    verified: true,
    createdAt: "2024-01-10T00:00:00Z",
    approvedAt: "2024-01-18T00:00:00Z",
    userId: "user2",
  },
  {
    id: "org3",
    name: "Community Health Initiative",
    type: "nonprofit",
    status: "approved",
    ein: "12-3456791",
    description: "Providing healthcare services and wellness programs to underserved communities",
    mission: "Improving community health through accessible healthcare and prevention programs",
    website: "https://communityhealth.org",
    email: "info@communityhealth.org",
    phone: "(404) 555-0102",
    address: {
      street: "789 Health Center Dr",
      city: "Atlanta",
      state: "GA",
      zipCode: "30311",
      country: "USA",
    },
    verified: true,
    createdAt: "2024-01-05T00:00:00Z",
    approvedAt: "2024-01-15T00:00:00Z",
    userId: "user3",
  },
];

// Mock selected organization (would come from user preferences)
const mockSelectedOrgId = "org1";

export default function PayItForwardPage() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { isMobile, paddingHorizontal } = useResponsive();
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(mockSelectedOrgId);

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        {/* Hero Section */}
        <HeroSection
          title="Pay It Forward"
          subtitle="Support charitable organizations with every purchase - BDN covers the donation"
        />

        {/* Info Card */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            marginBottom: 24,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
            <MaterialIcons name="info" size={24} color="#ba9988" />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                How It Works
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                  lineHeight: 20,
                }}
              >
                Select a charitable organization below. Every time you make a purchase through BDN, we'll automatically donate a percentage of your purchase amount to your selected organization. There's no extra cost to you - BDN covers the donation.
              </Text>
            </View>
          </View>
        </View>

        {/* Currently Selected Organization */}
        {selectedOrgId && (
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 2,
              borderColor: "#ba9988",
              marginBottom: 32,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: "#ba9988",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons name="favorite" size={24} color="#ffffff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ba9988",
                      marginBottom: 4,
                    }}
                  >
                    Currently Supporting
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#ffffff",
                    }}
                  >
                    {mockOrganizations.find((org) => org.id === selectedOrgId)?.name}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedOrgId(null)}
                style={{
                  padding: 8,
                }}
              >
                <MaterialIcons name="close" size={20} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: 20,
              }}
            >
              {mockOrganizations.find((org) => org.id === selectedOrgId)?.mission}
            </Text>
          </View>
        )}

        {/* Organizations List */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Select an Organization
          </Text>
          {mockOrganizations.length > 0 ? (
            <View style={{ gap: 16 }}>
              {mockOrganizations.map((org) => {
                const isSelected = selectedOrgId === org.id;
                return (
                  <TouchableOpacity
                    key={org.id}
                    onPress={() => setSelectedOrgId(org.id)}
                    style={{
                      backgroundColor: "#474747",
                      borderRadius: 16,
                      padding: 20,
                      borderWidth: 2,
                      borderColor: isSelected ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 16 }}>
                      <View
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 28,
                          backgroundColor: isSelected ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 24, fontWeight: "700", color: "#ffffff" }}>
                          {org.name.charAt(0)}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: "700",
                              color: "#ffffff",
                            }}
                          >
                            {org.name}
                          </Text>
                          {isSelected && (
                            <View
                              style={{
                                backgroundColor: "rgba(76, 175, 80, 0.15)",
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderRadius: 6,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 10,
                                  color: "#4caf50",
                                  fontWeight: "600",
                                }}
                              >
                                Selected
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "rgba(255, 255, 255, 0.7)",
                            marginBottom: 8,
                            lineHeight: 20,
                          }}
                        >
                          {org.description}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: "rgba(255, 255, 255, 0.6)",
                            fontStyle: "italic",
                            lineHeight: 18,
                          }}
                        >
                          {org.mission}
                        </Text>
                        {org.verified && (
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8 }}>
                            <MaterialIcons name="verified" size={16} color="#4caf50" />
                            <Text
                              style={{
                                fontSize: 12,
                                color: "#4caf50",
                                fontWeight: "600",
                              }}
                            >
                              Verified Organization
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
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
              <MaterialIcons name="handshake" size={48} color="rgba(186, 153, 136, 0.5)" />
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.6)",
                  textAlign: "center",
                  marginTop: 16,
                }}
              >
                No organizations available
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

