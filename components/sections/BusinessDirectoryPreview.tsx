import React, { useState } from "react";
import { View, Text, TouchableOpacity, useWindowDimensions, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

// Mock businesses for preview
const previewBusinesses = [
  {
    id: 1,
    name: "Soul Food Kitchen",
    category: "Restaurant",
    location: "Atlanta, GA",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Black Excellence Barbershop",
    category: "Services",
    location: "Chicago, IL",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Tech Solutions LLC",
    category: "Technology",
    location: "New York, NY",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Heritage Boutique",
    category: "Retail",
    location: "Los Angeles, CA",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
  },
];

export const BusinessDirectoryPreview: React.FC = () => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleBusinessPress = () => {
    // Redirect to login/signup
    router.push("/(auth)/signup");
  };

  const handleViewAll = () => {
    router.push("/(auth)/signup");
  };

  return (
    <ScrollAnimatedView delay={300}>
      <View
        style={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingVertical: isMobile ? 60 : 80,
          backgroundColor: "#1a1a1a",
        }}
      >
        <View
          style={{
            maxWidth: 1200,
            alignSelf: "center",
            width: "100%",
          }}
        >
          {/* Section Header */}
          <View
            style={{
              marginBottom: isMobile ? 32 : 48,
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "rgba(186, 153, 136, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons name="store" size={24} color="#ba9988" />
              </View>
              <Text
                style={{
                  fontSize: isMobile ? 32 : 44,
                  fontWeight: "700",
                  color: "#ffffff",
                  letterSpacing: -0.5,
                }}
              >
                Discover Black-Owned Businesses
              </Text>
            </View>
            <Text
              style={{
                fontSize: isMobile ? 16 : 18,
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
                maxWidth: 700,
                lineHeight: 26,
              }}
            >
              Search thousands of verified Black-owned businesses. Find restaurants, services, products, and more—all in one place.
            </Text>
          </View>

          {/* Search Bar Preview */}
          <View
            style={{
              marginBottom: 40,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleBusinessPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(71, 71, 71, 0.4)",
                borderRadius: 16,
                padding: 20,
                borderWidth: 2,
                borderColor: "rgba(186, 153, 136, 0.3)",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 4,
              }}
            >
              <MaterialIcons name="search" size={24} color="rgba(255, 255, 255, 0.5)" style={{ marginRight: 16 }} />
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.5)",
                  flex: 1,
                }}
              >
                Search businesses, categories, or locations...
              </Text>
              <MaterialIcons name="arrow-forward-ios" size={18} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          </View>

          {/* Business Cards Grid */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingRight: isMobile ? 0 : 20,
              gap: 20,
            }}
            style={{
              marginBottom: 32,
            }}
          >
            {previewBusinesses.map((business, index) => (
              <TouchableOpacity
                key={business.id}
                activeOpacity={0.9}
                onPress={handleBusinessPress}
                style={{
                  width: isMobile ? width - 80 : 320,
                  backgroundColor: "rgba(71, 71, 71, 0.4)",
                  borderRadius: 20,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: hoveredIndex === index ? "rgba(186, 153, 136, 0.5)" : "rgba(186, 153, 136, 0.3)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 4,
                }}
                onPressIn={() => setHoveredIndex(index)}
                onPressOut={() => setHoveredIndex(null)}
              >
                {/* Image with Overlay */}
                <View style={{ position: "relative", height: 200 }}>
                  <Image
                    source={{ uri: business.imageUrl }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.7)"]}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 80,
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 12,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <MaterialIcons name="star" size={16} color="#ba9988" />
                    <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "600" }}>
                      {business.rating}
                    </Text>
                  </View>
                </View>

                {/* Business Info */}
                <View style={{ padding: 20 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "rgba(186, 153, 136, 0.15)",
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#ba9988",
                          fontWeight: "600",
                        }}
                      >
                        {business.category}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 6,
                    }}
                  >
                    {business.name}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 16,
                    }}
                  >
                    <MaterialIcons name="location-on" size={16} color="rgba(255, 255, 255, 0.5)" />
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.6)",
                      }}
                    >
                      {business.location}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      paddingTop: 16,
                      borderTopWidth: 1,
                      borderTopColor: "rgba(186, 153, 136, 0.1)",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: "rgba(255, 255, 255, 0.5)",
                        flex: 1,
                      }}
                    >
                      Sign in to view details
                    </Text>
                    <MaterialIcons name="lock" size={18} color="rgba(255, 255, 255, 0.5)" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* CTA */}
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleViewAll}
              style={{
                backgroundColor: "#ba9988",
                paddingHorizontal: 32,
                paddingVertical: 16,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                shadowColor: "#ba9988",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                Explore All Businesses
              </Text>
              <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.5)",
                marginTop: 16,
                textAlign: "center",
              }}
            >
              Join thousands of members discovering and supporting Black-owned businesses
            </Text>
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};

