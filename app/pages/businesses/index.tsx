import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TextInput, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { HeroSection } from '@/components/layouts/HeroSection';

// Mock businesses data
const mockBusinesses = [
  {
    id: 1,
    name: "Soul Food Kitchen",
    category: "Restaurant",
    location: "Atlanta, GA",
    rating: 4.8,
    description: "Authentic Southern cuisine with a modern twist.",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=450&fit=crop",
  },
  {
    id: 2,
    name: "Black Excellence Barbershop",
    category: "Services",
    location: "Chicago, IL",
    rating: 4.9,
    description: "Premium grooming services for the modern professional.",
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=450&fit=crop",
  },
  {
    id: 3,
    name: "Tech Solutions LLC",
    category: "Technology",
    location: "New York, NY",
    rating: 4.7,
    description: "Custom software development and IT consulting.",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=450&fit=crop",
  },
  {
    id: 4,
    name: "Heritage Boutique",
    category: "Retail",
    location: "Los Angeles, CA",
    rating: 4.6,
    description: "Curated fashion and accessories celebrating Black culture.",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=450&fit=crop",
  },
  {
    id: 5,
    name: "Glow Beauty Studio",
    category: "Beauty",
    location: "Houston, TX",
    rating: 4.9,
    description: "Full-service beauty salon specializing in natural hair care.",
    imageUrl: "https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?w=800&h=450&fit=crop",
  },
  {
    id: 6,
    name: "Wellness Center",
    category: "Health",
    location: "Washington, DC",
    rating: 4.8,
    description: "Holistic health services and wellness programs for the community.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop",
  },
  {
    id: 7,
    name: "Jazz & Soul Café",
    category: "Restaurant",
    location: "New Orleans, LA",
    rating: 4.9,
    description: "Live music venue and restaurant featuring local jazz artists.",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=450&fit=crop",
  },
  {
    id: 8,
    name: "Creative Design Agency",
    category: "Services",
    location: "Miami, FL",
    rating: 4.7,
    description: "Graphic design and branding services for businesses.",
    imageUrl: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&h=450&fit=crop",
  },
  {
    id: 9,
    name: "Community Bookstore",
    category: "Retail",
    location: "Philadelphia, PA",
    rating: 4.8,
    description: "Books by Black authors and community event space.",
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=450&fit=crop",
  },
  {
    id: 10,
    name: "Fit & Strong Gym",
    category: "Health",
    location: "Detroit, MI",
    rating: 4.6,
    description: "Fitness center focused on community health and wellness.",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop",
  },
  {
    id: 11,
    name: "Artisan Coffee Roasters",
    category: "Restaurant",
    location: "Seattle, WA",
    rating: 4.7,
    description: "Specialty coffee roasted from Black-owned farms worldwide.",
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=450&fit=crop",
  },
  {
    id: 12,
    name: "Digital Marketing Pro",
    category: "Technology",
    location: "Austin, TX",
    rating: 4.8,
    description: "Social media and digital marketing services for small businesses.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
  },
  {
    id: 13,
    name: "Natural Hair Care Products",
    category: "Beauty",
    location: "Charlotte, NC",
    rating: 4.9,
    description: "Premium natural hair care products and styling tools.",
    imageUrl: "https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?w=800&h=450&fit=crop",
  },
  {
    id: 14,
    name: "Home Repair Services",
    category: "Services",
    location: "Baltimore, MD",
    rating: 4.7,
    description: "Professional home repair and renovation services.",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=450&fit=crop",
  },
  {
    id: 15,
    name: "Urban Fashion House",
    category: "Retail",
    location: "Brooklyn, NY",
    rating: 4.8,
    description: "Contemporary streetwear and urban fashion for all ages.",
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=450&fit=crop",
  },
];

export default function Businesses() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSearchPress = () => {
    router.push("/pages/search");
  };

  const categories = ["All", "Restaurant", "Services", "Technology", "Retail", "Beauty", "Health"];

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: 20,
          paddingBottom: 40,
        }}
      >
        {/* Hero Section */}
        <HeroSection
          title="Business Directory"
          subtitle="Discover and support Black-owned businesses in your community"
        />

        {/* Search Bar */}
        <TouchableOpacity
          onPress={handleSearchPress}
          style={{ marginBottom: 20 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#474747",
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <MaterialIcons name="search" size={20} color="rgba(255, 255, 255, 0.5)" style={{ marginRight: 12 }} />
            <Text
              style={{
                fontSize: 16,
                color: searchQuery ? "#ffffff" : "rgba(255, 255, 255, 0.4)",
                flex: 1,
              }}
            >
              {searchQuery || "Search businesses..."}
            </Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="rgba(255, 255, 255, 0.5)" />
          </View>
        </TouchableOpacity>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 24 }}
          contentContainerStyle={{ gap: 12, paddingRight: 20 }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category === "All" ? null : category)}
              style={{
                backgroundColor: selectedCategory === category || (category === "All" && selectedCategory === null) ? "#ba9988" : "#474747",
                borderRadius: 20,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderWidth: 1,
                borderColor: selectedCategory === category || (category === "All" && selectedCategory === null) ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Business List - Multi-column Grid */}
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            flexWrap: "wrap",
            gap: 16,
            marginHorizontal: isMobile ? 0 : -8,
          }}
        >
          {mockBusinesses.map((business) => (
            <TouchableOpacity
              key={business.id}
              onPress={() => router.push(`/pages/businesses/${business.id}`)}
              style={{
                flex: isMobile ? undefined : 1,
                width: isMobile ? "100%" : undefined,
                minWidth: isMobile ? undefined : 300,
                maxWidth: isMobile ? undefined : "48%",
                backgroundColor: "#474747",
                borderRadius: 16,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              {/* Business Image */}
              <Image
                source={{ uri: business.imageUrl }}
                style={{
                  width: "100%",
                  height: isMobile ? 180 : 200,
                }}
                contentFit="cover"
cachePolicy="memory-disk"
              />
              
              <View style={{ padding: 20 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#ffffff",
                    flex: 1,
                  }}
                >
                  {business.name}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    marginLeft: 12,
                  }}
                >
                  <MaterialIcons name="star" size={16} color="#ba9988" />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    {business.rating}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: "#ba9988",
                  marginBottom: 8,
                }}
              >
                {business.category} • {business.location}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                  lineHeight: 20,
                }}
              >
                {business.description}
              </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

