import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SearchResult, SearchFilters, RecentActivity } from '@/types/search';
import { Carousel } from '@/components/layouts/Carousel';

// Mock recent searches
const mockRecentSearches: RecentActivity[] = [
  {
    id: "1",
    userId: "user1",
    type: "search",
    targetId: "",
    targetType: "business",
    query: "soul food",
    timestamp: "2024-02-15T10:30:00Z",
  },
  {
    id: "2",
    userId: "user1",
    type: "search",
    targetId: "",
    targetType: "product",
    query: "hair products",
    timestamp: "2024-02-14T14:20:00Z",
  },
];

// Mock search suggestions
const mockSuggestions = [
  { id: "1", text: "Restaurants", type: "category" as const, category: "Restaurant" },
  { id: "2", text: "Beauty Salons", type: "category" as const, category: "Beauty & Wellness" },
  { id: "3", text: "Soul Food Kitchen", type: "business" as const },
  { id: "4", text: "Black-owned businesses near me", type: "query" as const },
];

export default function Search() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Convert filters to URL-safe params
      const params: Record<string, string> = { q: searchQuery };
      if (filters.category) params.category = filters.category;
      if (filters.type && filters.type.length > 0) params.type = filters.type.join(",");
      if (filters.priceRange) {
        params.priceMin = filters.priceRange.min.toString();
        params.priceMax = filters.priceRange.max.toString();
      }
      if (filters.rating) params.rating = filters.rating.toString();
      if (filters.location) {
        params.lat = filters.location.lat.toString();
        params.lng = filters.location.lng.toString();
        params.radius = filters.location.radius.toString();
      }
      if (filters.tags && filters.tags.length > 0) params.tags = filters.tags.join(",");
      
      router.push({
        pathname: "/pages/search/results",
        params,
      });
    }
  };

  const handleSuggestionPress = (suggestion: typeof mockSuggestions[0]) => {
    if (suggestion.type === "query") {
      setSearchQuery(suggestion.text);
      handleSearch();
    } else if (suggestion.type === "category") {
      setFilters({ ...filters, category: suggestion.category });
      router.push({
        pathname: "/pages/search/results",
        params: { category: suggestion.category },
      });
    } else {
      router.push(`/pages/businesses/${suggestion.id}`);
    }
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
        {/* Search Bar */}
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
            }}
          >
            <MaterialIcons name="search" size={20} color="rgba(255, 255, 255, 0.5)" />
            <TextInput
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setShowSuggestions(text.length > 0);
              }}
              onSubmitEditing={handleSearch}
              placeholder="Search businesses, products, services..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              style={{
                flex: 1,
                paddingVertical: 14,
                paddingHorizontal: 12,
                fontSize: 16,
                color: "#ffffff",
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  setShowSuggestions(false);
                }}
                style={{ padding: 4 }}
              >
                <MaterialIcons name="close" size={20} color="rgba(255, 255, 255, 0.5)" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleSearch}
              style={{
                backgroundColor: "#ba9988",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 8,
                marginLeft: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                Search
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search Suggestions */}
          {showSuggestions && searchQuery.length > 0 && (
            <View
              style={{
                backgroundColor: "#474747",
                borderRadius: 12,
                marginTop: 8,
                padding: 12,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              {mockSuggestions
                .filter((s) => s.text.toLowerCase().includes(searchQuery.toLowerCase()))
                .slice(0, 5)
                .map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion.id}
                    onPress={() => handleSuggestionPress(suggestion)}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 8,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <MaterialIcons
                      name={
                        suggestion.type === "category"
                          ? "category"
                          : suggestion.type === "business"
                          ? "store"
                          : "search"
                      }
                      size={20}
                      color="rgba(255, 255, 255, 0.5)"
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ffffff",
                        flex: 1,
                      }}
                    >
                      {suggestion.text}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>

        {/* Quick Filters */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Quick Filters
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {[
              { key: "businesses", label: "Businesses", icon: "store" },
              { key: "products", label: "Products", icon: "shopping-bag" },
              { key: "services", label: "Services", icon: "build" },
              { key: "media", label: "Media", icon: "movie" },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.key}
                onPress={() => {
                  setFilters({ ...filters, type: [filter.key as any] });
                  router.push({
                    pathname: "/pages/search/results",
                    params: { type: filter.key },
                  });
                }}
                style={{
                  backgroundColor: "#474747",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <MaterialIcons name={filter.icon as any} size={18} color="#ba9988" />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Searches - Pill Carousel */}
        {mockRecentSearches.length > 0 && (
          <View style={{ marginBottom: 32 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#ffffff",
                }}
              >
                Recent Searches
              </Text>
              <TouchableOpacity>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ba9988",
                  }}
                >
                  Clear
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 12,
                paddingRight: isMobile ? 0 : 20,
              }}
            >
              {mockRecentSearches.map((activity) => (
                <TouchableOpacity
                  key={activity.id}
                  onPress={() => {
                    setSearchQuery(activity.query || "");
                    handleSearch();
                  }}
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <MaterialIcons name="history" size={16} color="rgba(255, 255, 255, 0.6)" />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#ffffff",
                    }}
                  >
                    {activity.query}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Location-Based Search */}
        <View style={{ marginBottom: 32 }}>
          <TouchableOpacity
            onPress={() => router.push("/pages/search/location")}
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#232323",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="location-on" size={28} color="#ba9988" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 4,
                }}
              >
                Find Nearby Merchants
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                Discover Black-owned businesses in your area
              </Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color="rgba(255, 255, 255, 0.5)" />
          </TouchableOpacity>
        </View>

        {/* Popular Categories - Bento Cards Carousel */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Popular Categories
          </Text>
          <Carousel itemsPerView={isMobile ? 2.2 : isTablet ? 3.2 : 4.2} showControls={!isMobile} showIndicators={false} gap={12}>
            {[
              { name: "Restaurants", icon: "restaurant", gradient: ["#ba9988", "#9d7f6f"] },
              { name: "Beauty & Wellness", icon: "spa", gradient: ["#e91e63", "#c2185b"] },
              { name: "Retail", icon: "store", gradient: ["#ffd700", "#ffb300"] },
              { name: "Services", icon: "build", gradient: ["#2196f3", "#1976d2"] },
              { name: "Technology", icon: "computer", gradient: ["#9c27b0", "#7b1fa2"] },
              { name: "Education", icon: "school", gradient: ["#4caf50", "#388e3c"] },
            ].map((category) => (
              <TouchableOpacity
                key={category.name}
                onPress={() => {
                  setFilters({ ...filters, category: category.name });
                  router.push({
                    pathname: "/pages/search/results",
                    params: { category: category.name },
                  });
                }}
                activeOpacity={0.8}
                style={{
                  borderRadius: 20,
                  padding: isMobile ? 16 : 20,
                  minHeight: isMobile ? 140 : 160,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 4,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <LinearGradient
                  colors={category.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.1,
                  }}
                />
                <View style={{ flex: 1, justifyContent: "space-between" }}>
                  <View>
                    <MaterialIcons
                      name={category.icon as keyof typeof MaterialIcons.glyphMap}
                      size={isMobile ? 24 : 28}
                      color={category.gradient[0]}
                      style={{ marginBottom: 8 }}
                    />
                    <Text
                      style={{
                        fontSize: isMobile ? 14 : 16,
                        fontWeight: "700",
                        color: "#ffffff",
                        lineHeight: isMobile ? 20 : 22,
                      }}
                    >
                      {category.name}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "600",
                        color: "rgba(255, 255, 255, 0.6)",
                        marginRight: 4,
                      }}
                    >
                      Explore
                    </Text>
                    <MaterialIcons name="arrow-forward" size={14} color="rgba(255, 255, 255, 0.6)" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </Carousel>
        </View>
      </ScrollView>
    </View>
  );
}

