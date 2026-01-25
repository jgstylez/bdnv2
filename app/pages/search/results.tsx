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
import { Image } from "expo-image";
import { SearchResult, SearchFilters } from '@/types/search';
import { BusinessPlaceholder } from '@/components/BusinessPlaceholder';
import { ProductPlaceholder } from '@/components/ProductPlaceholder';
import { BUSINESS_CATEGORIES, getStandardizedCategory } from '@/constants/categories';
import { SearchFiltersPanel } from '@/components/search/SearchFiltersPanel';
import { SortSelector, SortOption } from '@/components/search/SortSelector';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { BackButton } from '@/components/navigation/BackButton';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';
import { EmptyState } from '@/components/feedback';

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
  {
    id: "4",
    type: "product",
    title: "Artisan Hot Sauce Collection",
    description: "Handcrafted hot sauces with unique flavor profiles",
    imageUrl: "https://images.unsplash.com/photo-1700133501984-f057ecbcc960",
    metadata: {
      category: "Food & Beverage",
      price: 29.99,
      currency: "USD",
      rating: 4.7,
    },
    relevanceScore: 0.85,
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
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [showSortSelector, setShowSortSelector] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<SearchFilters>({
    category: selectedCategory !== "All" ? selectedCategory : undefined,
    location: {
      lat: 33.749, // Mock user location (Atlanta)
      lng: -84.388,
      radius: 10,
    },
  });

  const filteredResults = mockResults.filter((result) => {
    if (selectedCategory !== "All") {
      // Only check category match if the result has a category
      // Results without categories pass through (lenient behavior for uncategorized results)
      if (result.metadata.category) {
        // Normalize both product category and selected category for comparison
        const normalizedProductCategory = getStandardizedCategory(result.metadata.category);
        const normalizedSelectedCategory = getStandardizedCategory(selectedCategory);
        if (normalizedProductCategory !== normalizedSelectedCategory) {
          return false; // Filter out results with non-matching categories
        }
      }
      // If no category exists, allow it through (don't filter it out)
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
      case "newest":
        // Sort by relevance score as proxy for newest (would use createdAt in real implementation)
        return (b.relevanceScore || 0) - (a.relevanceScore || 0);
      case "name":
        return a.title.localeCompare(b.title);
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

  const getSortLabel = () => {
    const option = [
      { key: "relevance", label: "Relevance" },
      { key: "distance", label: "Distance" },
      { key: "rating", label: "Rating" },
      { key: "price", label: "Price" },
      { key: "newest", label: "Newest" },
      { key: "name", label: "Name" },
    ].find((opt) => opt.key === sortBy);
    return option?.label || "Relevance";
  };

  const activeFilterCount = Object.keys(filters).filter(
    (key) => filters[key as keyof SearchFilters] !== undefined
  ).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      <OptimizedScrollView
        showBackToTop={true}
        contentContainerStyle={{
          paddingHorizontal: isMobile ? spacing.md : spacing.xl,
          paddingTop: spacing.lg,
          paddingBottom: 40,
        }}
      >
        <BackButton label="Back to Search" />

        {/* Search Bar */}
        <View style={{ marginBottom: spacing.lg }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.secondary,
              borderRadius: borderRadius.md,
              paddingHorizontal: spacing.md,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <MaterialIcons
              name="search"
              size={20}
              color={colors.text.secondary}
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
              placeholderTextColor={colors.text.placeholder}
              style={{
                flex: 1,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.sm,
                fontSize: typography.fontSize.base,
                color: colors.text.primary,
              }}
            />
            <TouchableOpacity
              onPress={() => setShowSortSelector(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.xs,
                padding: spacing.xs,
                marginRight: spacing.xs,
              }}
            >
              <MaterialIcons
                name="sort"
                size={18}
                color={colors.text.secondary}
              />
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                }}
              >
                {getSortLabel()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowFilters(true)}
              style={{ padding: spacing.xs, position: "relative" }}
            >
              <MaterialIcons
                name="tune"
                size={20}
                color={activeFilterCount > 0 ? colors.accent : colors.text.secondary}
              />
              {activeFilterCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.status.error,
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: spacing.lg }}
          contentContainerStyle={{ gap: spacing.sm }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={{
                backgroundColor:
                  selectedCategory === category ? colors.accent : colors.secondary,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: borderRadius.md,
                borderWidth: 1,
                borderColor:
                  selectedCategory === category
                    ? colors.accent
                    : colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold as any,
                  color:
                    selectedCategory === category
                      ? colors.textColors.onAccent
                      : colors.text.secondary,
                }}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Count and View Toggle */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: spacing.md,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
            }}
          >
            {sortedResults.length} result{sortedResults.length !== 1 ? "s" : ""}{" "}
            found
            {searchQuery && ` for "${searchQuery}"`}
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
                  backgroundColor: colors.secondary,
                  borderRadius: borderRadius.lg,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                {/* Image */}
                {result.imageUrl && 
                 result.imageUrl.trim() !== "" && 
                 !imageErrors.has(result.id) ? (
                  <Image
                    source={{ uri: result.imageUrl }}
                    style={{ width: "100%", height: 150 }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    {...(Platform.OS !== 'web' && {
                      accessible: false,
                    })}
                    onError={() => {
                      setImageErrors((prev) => new Set(prev).add(result.id));
                    }}
                  />
                ) : result.type === "business" ? (
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
                        backgroundColor: colors.background,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MaterialIcons
                        name={getTypeIcon(result.type) as any}
                        size={20}
                        color={colors.accent}
                      />
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.bold as any,
                          color: colors.text.primary,
                          marginBottom: spacing.xs,
                        }}
                      >
                        {result.title}
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.text.secondary,
                          marginBottom: spacing.sm,
                        }}
                      >
                        {result.description}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: spacing.xs,
                        }}
                      >
                        {result.metadata.category && (
                          <View
                            style={{
                              backgroundColor: colors.accent + "25",
                              paddingHorizontal: spacing.xs,
                              paddingVertical: 2,
                              borderRadius: borderRadius.sm,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: typography.fontSize.xs,
                                color: colors.accent,
                                fontWeight: typography.fontWeight.semibold as any,
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
                              fontSize: typography.fontSize.sm,
                              fontWeight: typography.fontWeight.semibold as any,
                              color: colors.accent,
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
          <EmptyState
            variant="no-results"
            title="No results found"
            description={
              searchQuery
                ? `No results found for "${searchQuery}". Try adjusting your search terms or filters.`
                : "Try adjusting your filters or search terms."
            }
            action={
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  setFilters({});
                  setSelectedCategory("All");
                }}
                style={{
                  backgroundColor: colors.accent,
                  paddingHorizontal: spacing.xl,
                  paddingVertical: spacing.md,
                  borderRadius: borderRadius.md,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold as any,
                    color: colors.textColors.onAccent,
                  }}
                >
                  Clear Filters
                </Text>
              </TouchableOpacity>
            }
          />
        )}

        {/* Filter Panel Modal */}
        <SearchFiltersPanel
          filters={filters}
          onFiltersChange={(newFilters) => {
            setFilters(newFilters);
            if (newFilters.category) {
              setSelectedCategory(newFilters.category);
            } else {
              setSelectedCategory("All");
            }
          }}
          visible={showFilters}
          onClose={() => setShowFilters(false)}
          onApply={() => setShowFilters(false)}
          onReset={() => {
            setSelectedCategory("All");
            setShowFilters(false);
          }}
        />

        {/* Sort Selector Modal */}
        <SortSelector
          sortBy={sortBy}
          onSortChange={setSortBy}
          visible={showSortSelector}
          onClose={() => setShowSortSelector(false)}
        />
      </OptimizedScrollView>
    </View>
  );
}
