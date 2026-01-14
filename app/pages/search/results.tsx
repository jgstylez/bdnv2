import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SearchResult, SearchFilters } from '@/types/search';
import { BusinessPlaceholder } from '@/components/BusinessPlaceholder';
import { ProductPlaceholder } from '@/components/ProductPlaceholder';
import { BUSINESS_CATEGORIES, getStandardizedCategory } from '@/constants/categories';

// Mock search results
const mockResults: SearchResult[] = [
  {
    id: "1",
    type: "business",
    title: "Soul Food Kitchen",
    description: "Authentic Southern cuisine in the heart of Atlanta",
    imageUrl: "",
    metadata: {
      category: "Restaurant",
      location: {
        address: "123 Main Street",
        city: "Atlanta",
        state: "GA",
        zipCode: "30309",
        coordinates: { lat: 33.749, lng: -84.388 },
      },
      distance: 0.5,
      rating: 4.8,
    },
    relevanceScore: 0.95,
  },
  {
    id: "2",
    type: "product",
    title: "Natural Hair Care Bundle",
    description: "Complete hair care set for natural hair",
    imageUrl: "",
    metadata: {
      category: "Beauty & Wellness",
      price: 49.99,
      currency: "USD",
      rating: 4.6,
    },
    relevanceScore: 0.87,
  },
  {
    id: "3",
    type: "service",
    title: "Professional Hair Styling",
    description: "Expert hair styling and braiding services",
    imageUrl: "",
    metadata: {
      category: "Beauty & Wellness",
      location: {
        address: "456 Oak Avenue",
        city: "Atlanta",
        state: "GA",
        zipCode: "30310",
        coordinates: { lat: 33.755, lng: -84.395 },
      },
      distance: 1.2,
      price: 75.0,
      currency: "USD",
      rating: 4.9,
    },
    relevanceScore: 0.82,
  },
];

const categories = [
  "All",
  ...BUSINESS_CATEGORIES.slice(0, 30), // Show first 30 categories for filter
];

export default function SearchResults() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const params = useLocalSearchParams();
  const isMobile = width < 768;
  const [searchQuery, setSearchQuery] = useState((params.q as string) || "");
  const [selectedCategory, setSelectedCategory] = useState(
    (params.category as string) || "All"
  );
  const [sortBy, setSortBy] = useState<
    "relevance" | "distance" | "rating" | "price"
  >("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: selectedCategory !== "All" ? selectedCategory : undefined,
    location: {
      lat: 33.749, // Mock user location (Atlanta)
      lng: -84.388,
      radius: 10,
    },
  });

  const filteredResults = mockResults.filter((result) => {
    if (
      selectedCategory !== "All" &&
      result.metadata.category
    ) {
      // Normalize both product category and selected category for comparison
      const normalizedProductCategory = getStandardizedCategory(result.metadata.category);
      const normalizedSelectedCategory = getStandardizedCategory(selectedCategory);
      if (normalizedProductCategory !== normalizedSelectedCategory) {
        return false;
      }
    }
    if (
      searchQuery &&
      !result.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !result.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case "distance":
        return (
          (a.metadata.distance || Infinity) - (b.metadata.distance || Infinity)
        );
      case "rating":
        return (b.metadata.rating || 0) - (a.metadata.rating || 0);
      case "price":
        return (a.metadata.price || Infinity) - (b.metadata.price || Infinity);
      default:
        return (b.relevanceScore || 0) - (a.relevanceScore || 0);
    }
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "business":
        return "store";
      case "product":
        return "shopping-bag";
      case "service":
        return "build";
      case "media":
        return "movie";
      default:
        return "search";
    }
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return "";
    return distance < 1
      ? `${Math.round(distance * 5280)} ft`
      : `${distance.toFixed(1)} mi`;
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
            <MaterialIcons
              name="search"
              size={20}
              color="rgba(255, 255, 255, 0.5)"
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => {
                router.push({
                  pathname: "/pages/search/results",
                  params: { q: searchQuery },
                });
              }}
              placeholder="Search..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              style={{
                flex: 1,
                paddingVertical: 14,
                paddingHorizontal: 12,
                fontSize: 16,
                color: "#ffffff",
              }}
            />
            <TouchableOpacity
              onPress={() => setShowFilters(!showFilters)}
              style={{ padding: 4 }}
            >
              <MaterialIcons
                name="tune"
                size={20}
                color={showFilters ? "#ba9988" : "rgba(255, 255, 255, 0.5)"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters */}
        {showFilters && (
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 12,
              }}
            >
              Filters
            </Text>
            <View style={{ gap: 12 }}>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: 8,
                  }}
                >
                  Sort By
                </Text>
                <View
                  style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}
                >
                  {[
                    { key: "relevance", label: "Relevance" },
                    { key: "distance", label: "Distance" },
                    { key: "rating", label: "Rating" },
                    { key: "price", label: "Price" },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.key}
                      onPress={() => setSortBy(option.key as any)}
                      style={{
                        backgroundColor:
                          sortBy === option.key ? "#ba9988" : "#232323",
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color:
                            sortBy === option.key
                              ? "#ffffff"
                              : "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 24 }}
          contentContainerStyle={{ gap: 8 }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={{
                backgroundColor:
                  selectedCategory === category ? "#ba9988" : "#474747",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor:
                  selectedCategory === category
                    ? "#ba9988"
                    : "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color:
                    selectedCategory === category
                      ? "#ffffff"
                      : "rgba(255, 255, 255, 0.7)",
                }}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Count */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            {sortedResults.length} result{sortedResults.length !== 1 ? "s" : ""}{" "}
            found
          </Text>
        </View>

        {/* Results List - 3 Column Grid */}
        {sortedResults.length > 0 ? (
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              flexWrap: "wrap",
              gap: 16,
              marginHorizontal: isMobile ? 0 : -8,
            }}
          >
            {sortedResults.map((result) => (
              <TouchableOpacity
                key={result.id}
                onPress={() => {
                  if (result.type === "business") {
                    router.push(`/pages/businesses/${result.id}`);
                  } else {
                    // Handle other types
                  }
                }}
                style={{
                  flex: isMobile ? undefined : 1,
                  width: isMobile ? "100%" : undefined,
                  minWidth: isMobile ? undefined : 300,
                  maxWidth: isMobile
                    ? undefined
                    : Platform.OS === "web"
                    ? "calc((100% - 32px) / 3)"
                    : "33.333%",
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                {/* Image Placeholder */}
                {result.type === "business" ? (
                  <BusinessPlaceholder
                    width="100%"
                    height={150}
                    aspectRatio={16 / 9}
                  />
                ) : result.type === "product" ? (
                  <ProductPlaceholder
                    width="100%"
                    height={150}
                    aspectRatio={16 / 9}
                  />
                ) : (
                  <BusinessPlaceholder
                    width="100%"
                    height={150}
                    aspectRatio={16 / 9}
                  />
                )}
                <View style={{ padding: 16 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: "#232323",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MaterialIcons
                        name={getTypeIcon(result.type) as any}
                        size={20}
                        color="#ba9988"
                      />
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 16,
                          fontWeight: "700",
                          color: "#ffffff",
                          marginBottom: 4,
                        }}
                      >
                        {result.title}
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.7)",
                          marginBottom: 8,
                        }}
                      >
                        {result.description}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: 6,
                        }}
                      >
                        {result.metadata.category && (
                          <View
                            style={{
                              backgroundColor: "rgba(186, 153, 136, 0.15)",
                              paddingHorizontal: 6,
                              paddingVertical: 3,
                              borderRadius: 4,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 10,
                                color: "#ba9988",
                                fontWeight: "600",
                              }}
                            >
                              {result.metadata.category}
                            </Text>
                          </View>
                        )}
                        {result.metadata.distance && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            <MaterialIcons
                              name="location-on"
                              size={12}
                              color="rgba(255, 255, 255, 0.5)"
                            />
                            <Text
                              style={{
                                fontSize: 10,
                                color: "rgba(255, 255, 255, 0.6)",
                              }}
                            >
                              {formatDistance(result.metadata.distance)}
                            </Text>
                          </View>
                        )}
                        {result.metadata.rating && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            <MaterialIcons
                              name="star"
                              size={12}
                              color="#ffd700"
                            />
                            <Text
                              style={{
                                fontSize: 10,
                                color: "rgba(255, 255, 255, 0.6)",
                              }}
                            >
                              {result.metadata.rating}
                            </Text>
                          </View>
                        )}
                        {result.metadata.price && (
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "600",
                              color: "#ba9988",
                            }}
                          >
                            {result.metadata.currency === "USD" ? "$" : ""}
                            {result.metadata.price.toFixed(2)}
                            {result.metadata.currency === "BLKD" ? " BLKD" : ""}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
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
            <MaterialIcons
              name="search-off"
              size={48}
              color="rgba(186, 153, 136, 0.5)"
            />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              No results found. Try adjusting your search or filters.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
