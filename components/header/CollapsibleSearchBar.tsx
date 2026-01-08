import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Platform,
  Pressable,
  Modal,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";

// Mock recent/common searches
const mockRecentSearches = [
  { id: "1", query: "soul food", type: "recent" },
  { id: "2", query: "hair products", type: "recent" },
  { id: "3", query: "restaurants", type: "common" },
  { id: "4", query: "beauty salons", type: "common" },
  { id: "5", query: "coffee shops", type: "common" },
];

// Rotating placeholder examples
const placeholderExamples = [
  "Search for businesses...",
  "Find restaurants...",
  "Discover products...",
  "Explore services...",
  "Search hair products...",
  "Find beauty salons...",
  "Discover coffee shops...",
];

interface CollapsibleSearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  onSearch?: () => void;
  style?: any;
  isMobile?: boolean; // Explicitly control mobile behavior
  isExpanded?: boolean; // External control for expansion
  onExpand?: () => void; // Callback when expanding
  onCollapse?: () => void; // Callback when collapsing
  hideIconButton?: boolean; // Hide the icon button (for external button)
}

/**
 * CollapsibleSearchBar Component
 * On mobile: Shows as an icon button that expands to full search bar when tapped
 * On desktop: Always shows as full search bar
 */
export function CollapsibleSearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
  onSearch,
  style,
  isMobile = Platform.OS !== "web", // Default to native platforms, but can be overridden
  isExpanded: externalIsExpanded,
  onExpand,
  onCollapse,
  hideIconButton = false,
}: CollapsibleSearchBarProps) {
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);
  const isExpanded = externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;
  const [searchValue, setSearchValue] = useState(value || "");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const expandAnimation = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Sync with external value prop
  useEffect(() => {
    if (value !== undefined) {
      setSearchValue(value);
    }
  }, [value]);

  // Handle expand/collapse animation
  useEffect(() => {
    Animated.spring(expandAnimation, {
      toValue: isExpanded ? 1 : 0,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();

    if (isExpanded && inputRef.current) {
      // Focus input when expanded
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isExpanded, expandAnimation]);

  // Rotate placeholder text when search is expanded and empty (mobile) or always empty (web)
  useEffect(() => {
    if (searchValue.length > 0) {
      return;
    }

    // For mobile, only rotate when expanded
    if (isMobile && !isExpanded) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholderExamples.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [isExpanded, searchValue, isMobile]);

  const handleExpand = () => {
    if (externalIsExpanded === undefined) {
      setInternalIsExpanded(true);
    }
    onExpand?.();
  };

  const handleCollapse = () => {
    if (externalIsExpanded === undefined) {
      setInternalIsExpanded(false);
    }
    setSearchValue("");
    onChangeText?.("");
    if (inputRef.current) {
      inputRef.current.blur();
    }
    onCollapse?.();
  };

  const handleChangeText = (text: string) => {
    setSearchValue(text);
    onChangeText?.(text);
  };

  const handleSubmit = () => {
    if (searchValue.trim()) {
      // Navigate to search results
      router.push({
        pathname: "/pages/search/results",
        params: { q: searchValue.trim() },
      });
      
      // Call the onSearch callback if provided
      onSearch?.();
      
      // Collapse the modal after search on mobile
      if (isMobile) {
        handleCollapse();
      }
    }
  };

  // On mobile, show collapsible search
  if (isMobile) {
    return (
      <>
        {/* Icon Button - Always visible (unless hidden) */}
        {!hideIconButton && (
          <TouchableOpacity
            onPress={handleExpand}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.input || "#28282d",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Search"
            accessibilityHint="Double tap to open search"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="search" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        )}

        {/* Full Search Modal - Opens when icon is tapped */}
        <Modal
          visible={isExpanded}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCollapse}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleCollapse}
            accessible={false}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.95)",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: spacing.lg,
              }}
            >
              <Pressable 
                onPress={(e) => e.stopPropagation()} 
                accessible={false}
                style={{
                  width: "100%",
                  maxWidth: 600,
                  backgroundColor: "#474747",
                  borderRadius: borderRadius.xl,
                  padding: spacing.lg,
                  borderWidth: 2,
                  borderColor: "#5a5a68",
                }}
              >
                {/* Header with close button */}
                <View style={{ 
                  marginBottom: spacing.lg,
                  position: "relative",
                }}>
                  <View style={{ 
                    flex: 1,
                    paddingRight: 48, // Space for close button
                  }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize["2xl"],
                        fontWeight: typography.fontWeight.bold,
                        color: colors.text.primary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      Search
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        width: "100%",
                      }}
                    >
                      Find businesses, products, and services
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleCollapse}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: "rgba(71, 71, 71, 0.6)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Close search"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <MaterialIcons name="close" size={24} color={colors.text.primary} />
                  </TouchableOpacity>
                </View>

                {/* Search Input */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#28282d",
                    borderRadius: borderRadius.full,
                    paddingHorizontal: spacing.md,
                    height: 56,
                    borderWidth: 1,
                    borderColor: colors.border || "#3e3e46",
                    marginBottom: spacing.lg,
                    ...style,
                  }}
                >
                  <TextInput
                    ref={inputRef}
                    value={searchValue}
                    onChangeText={handleChangeText}
                    placeholder={searchValue.length === 0 ? placeholderExamples[currentPlaceholderIndex] : placeholder}
                    placeholderTextColor={colors.text.placeholder}
                    onSubmitEditing={handleSubmit}
                    autoFocus={true}
                    style={{
                      flex: 1,
                      fontSize: typography.fontSize.base,
                      color: colors.text.primary,
                      height: "100%",
                      minWidth: 0, // Allow text to shrink and display more
                      paddingHorizontal: spacing.sm,
                    }}
                  />
                  {searchValue ? (
                    <TouchableOpacity
                      onPress={() => {
                        handleChangeText("");
                      }}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel="Clear search"
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={{ marginRight: spacing.xs }}
                    >
                      <MaterialIcons name="close" size={20} color={colors.text.tertiary} />
                    </TouchableOpacity>
                  ) : null}
                  <TouchableOpacity
                    onPress={handleSubmit}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Search"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{
                      backgroundColor: colors.accent,
                      borderRadius: borderRadius.full,
                      width: 32,
                      height: 32,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons 
                      name="arrow-forward" 
                      size={18} 
                      color={colors.textColors.onAccent} 
                    />
                  </TouchableOpacity>
                </View>

                {/* Search Pills - Recent/Common searches */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    gap: spacing.sm,
                    paddingVertical: spacing.xs,
                  }}
                >
                  {mockRecentSearches.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        // Navigate directly to search results
                        router.push({
                          pathname: "/pages/search/results",
                          params: { q: item.query },
                        });
                        // Collapse the modal after search on mobile
                        if (isMobile) {
                          handleCollapse();
                        }
                      }}
                      style={{
                        backgroundColor: "#474747",
                        borderRadius: borderRadius.full,
                        paddingHorizontal: spacing.sm,
                        paddingVertical: spacing.xs,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.xs,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <MaterialIcons 
                        name={item.type === "recent" ? "history" : "trending-up"} 
                        size={14} 
                        color="rgba(255, 255, 255, 0.6)" 
                      />
                      <Text
                        style={{
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.text.primary,
                        }}
                      >
                        {item.query}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      </>
    );
  }

  // On web, always show full search bar
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.secondary.bg,
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.md,
        height: 48,
        borderWidth: 1,
        borderColor: colors.border.light,
        ...style,
      }}
    >
      <TextInput
        value={searchValue}
        onChangeText={handleChangeText}
        placeholder={searchValue.length === 0 ? placeholderExamples[currentPlaceholderIndex] : placeholder}
        placeholderTextColor={colors.text.placeholder}
        onSubmitEditing={handleSubmit}
        style={{
          flex: 1,
          fontSize: typography.fontSize.base,
          color: colors.text.primary,
          height: "100%",
        }}
      />
      {searchValue ? (
        <TouchableOpacity
          onPress={() => {
            handleChangeText("");
          }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ marginRight: spacing.xs }}
        >
          <MaterialIcons name="close" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity
        onPress={handleSubmit}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Search"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={{
          backgroundColor: colors.accent,
          borderRadius: borderRadius.full,
          width: 32,
          height: 32,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialIcons 
          name="arrow-forward" 
          size={18} 
          color={colors.textColors.onAccent} 
        />
      </TouchableOpacity>
    </View>
  );
}
