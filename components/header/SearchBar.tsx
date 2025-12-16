import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";

interface SearchSuggestion {
  id: string;
  text: string;
  type: "category" | "business" | "query";
  category?: string;
}

interface RecentSearch {
  id: string;
  query: string;
  timestamp: string;
}

interface SearchBarProps {
  isDesktop: boolean;
  suggestions?: SearchSuggestion[];
  recentSearches?: RecentSearch[];
}

/**
 * SearchBar Component
 * Extracts the search bar functionality from AppHeader
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  isDesktop,
  suggestions = [],
  recentSearches = [],
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState(suggestions);
  const searchInputRef = useRef<TextInput>(null);

  if (!isDesktop) {
    return null; // Search bar only shown on desktop
  }

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0) {
      setShowSearchDropdown(true);
      // Filter suggestions based on query
      const filtered = suggestions.filter((s) =>
        s.text.toLowerCase().includes(text.toLowerCase())
      );
      setSearchSuggestions(filtered.length > 0 ? filtered : suggestions);
    } else {
      setShowSearchDropdown(true);
      setSearchSuggestions(suggestions);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      router.push({
        pathname: "/pages/search/results",
        params: { q: searchQuery },
      });
    }
  };

  const handleSuggestionPress = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.text);
    setShowSearchDropdown(false);
    if (suggestion.type === "query" || suggestion.type === "category") {
      router.push({
        pathname: "/pages/search/results",
        params: suggestion.type === "category" ? { category: suggestion.category } : { q: suggestion.text },
      });
    } else if (suggestion.type === "business") {
      router.push(`/pages/businesses/${suggestion.id}`);
    }
  };

  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query);
    setShowSearchDropdown(false);
    router.push({
      pathname: "/pages/search/results",
      params: { q: query },
    });
  };

  return (
    <View style={{ flex: 1, maxWidth: 600, position: "relative", zIndex: 1002 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "rgba(71, 71, 71, 0.6)",
          borderRadius: borderRadius["2xl"],
          borderWidth: 1,
          borderColor: showSearchDropdown ? colors.accent : colors.border.light,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.sm,
          gap: spacing.sm,
        }}
      >
        <MaterialIcons name="search" size={20} color={colors.text.tertiary} />
        <TextInput
          ref={searchInputRef}
          value={searchQuery}
          onChangeText={handleSearchChange}
          onSubmitEditing={handleSearchSubmit}
          onFocus={() => setShowSearchDropdown(true)}
          placeholder="Search businesses, products, services..."
          placeholderTextColor={colors.text.placeholder}
          style={{
            flex: 1,
            fontSize: typography.fontSize.base,
            color: colors.text.primary,
            padding: 0,
          }}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery("");
              setShowSearchDropdown(false);
            }}
            style={{ padding: spacing.xs }}
          >
            <MaterialIcons name="close" size={18} color={colors.text.tertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Dropdown */}
      {showSearchDropdown && (
        <View
          style={{
            position: "absolute",
            top: 48,
            left: 0,
            right: 0,
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.md,
            borderWidth: 1,
            borderColor: colors.border.light,
            marginTop: spacing.sm,
            maxHeight: 400,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            overflow: "hidden",
            zIndex: 1003,
            elevation: 1003,
          }}
        >
          {/* Suggestions */}
          {searchQuery.length > 0 && searchSuggestions.length > 0 && (
            <View style={{ paddingVertical: spacing.sm }}>
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.tertiary,
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.sm,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Suggestions
              </Text>
              {searchSuggestions.slice(0, 5).map((suggestion) => (
                <TouchableOpacity
                  key={suggestion.id}
                  onPress={() => handleSuggestionPress(suggestion)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: spacing.lg,
                    paddingVertical: spacing.md,
                    gap: spacing.md,
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name={
                      suggestion.type === "category"
                        ? "category"
                        : suggestion.type === "business"
                        ? "store"
                        : "search"
                    }
                    size={18}
                    color={colors.text.tertiary}
                  />
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      color: colors.text.primary,
                      flex: 1,
                    }}
                  >
                    {suggestion.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Recent Searches */}
          {searchQuery.length === 0 && recentSearches.length > 0 && (
            <View style={{ paddingVertical: spacing.sm }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.sm,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text.tertiary,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Recent Searches
                </Text>
                <TouchableOpacity>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.accent,
                    }}
                  >
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>
              {recentSearches.map((recent) => (
                <TouchableOpacity
                  key={recent.id}
                  onPress={() => handleRecentSearchPress(recent.query)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: spacing.lg,
                    paddingVertical: spacing.md,
                    gap: spacing.md,
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="history" size={18} color={colors.text.tertiary} />
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      color: colors.text.primary,
                      flex: 1,
                    }}
                  >
                    {recent.query}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Quick Filters */}
          {searchQuery.length === 0 && (
            <View style={{ paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border.light }}>
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.tertiary,
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.sm,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Quick Filters
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm }}>
                {["Restaurants", "Beauty", "Shopping", "Services"].map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    onPress={() => {
                      router.push({
                        pathname: "/pages/search/results",
                        params: { category: filter },
                      });
                      setShowSearchDropdown(false);
                    }}
                    style={{
                      backgroundColor: colors.accentLight,
                      paddingHorizontal: spacing.md,
                      paddingVertical: 6,
                      borderRadius: borderRadius.lg,
                      borderWidth: 1,
                      borderColor: colors.accentBorder,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.accent,
                        fontWeight: typography.fontWeight.semibold,
                      }}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};


