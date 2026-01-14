import React, { useState } from "react";
import { View, Text, useWindowDimensions, TouchableOpacity, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BUSINESS_CATEGORIES, POPULAR_CATEGORIES } from '@/constants/categories';
import { useResponsive } from '@/hooks/useResponsive';
import { platformValues } from "../../../utils/platform";
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';
import { BackButton } from '@/components/navigation/BackButton';

// Map categories to icons
const getCategoryIcon = (categoryName: string): keyof typeof MaterialIcons.glyphMap => {
  const iconMap: Record<string, keyof typeof MaterialIcons.glyphMap> = {
    // Food & Dining
    "Restaurants": "restaurant",
    "Food & Beverage": "restaurant-menu",
    "Bars & Lounge": "local-bar",
    "Grocery": "shopping-cart",
    "Wine, Spirits & Liquor": "local-bar",
    
    // Beauty & Wellness
    "Beauty & Wellness": "spa",
    "Beauty & Cosmetics": "face",
    "Health & Wellness": "local-hospital",
    "Medical & Healthcare": "medical-services",
    "Pharmacy": "local-pharmacy",
    "Personal Care": "spa",
    "Exercise & Fitness": "fitness-center",
    
    // Retail & Shopping
    "Retail": "store",
    "Clothing, Shoes & Accessories": "checkroom",
    "Jewelry & Watches": "watch",
    "Luggage & Bags": "work",
    "Vintage & Collectibles": "collections",
    
    // Home & Living
    "Home Improvements & Decor": "home",
    "Furniture & Appliances": "chair",
    "Household Essentials": "home-repair-service",
    "Kitchenware & Cookware": "restaurant",
    "Bedding & Linens": "hotel",
    "Patio & Garden": "park",
    "Gardening Tools & Supplies": "park",
    "Home Security & Smart Devices": "security",
    "Cleaning Supplies": "cleaning-services",
    
    // Technology & Electronics
    "Technology": "computer",
    "Electronics & Audio": "headphones",
    "Cell Phones & Accessories": "smartphone",
    "Digital Products": "cloud",
    "Mobile Apps & Software Licenses": "apps",
    
    // Services & Business
    "Services": "build",
    "Professional Services": "business-center",
    "Real Estate": "home-work",
    "Finance & Payments": "account-balance",
    "Financial Institution": "account-balance-wallet",
    "Merchant Services": "storefront",
    "Insurance": "shield",
    "Construction": "construction",
    "Child Care & Day Care": "child-care",
    
    // Education & Media
    "Education": "school",
    "Music, Movies & Books": "library-music",
    "Content Creation": "videocam",
    "Film & Production": "videocam",
    "Entertainment": "movie",
    "Event Tickets & Experiences": "event",
    
    // Arts & Crafts
    "Arts, Crafts & Party Supplies": "palette",
    "Craft Kits & DIY Projects": "build",
    "Stationery & Office Supplies": "description",
    "Office Furniture": "business",
    "Office Supplies": "description",
    
    // Lifestyle & Recreation
    "Sports & Outdoors": "sports-soccer",
    "Outdoor & Camping Equipment": "camping",
    "Travel & Transportation": "flight",
    "Toys & Games": "toys",
    "Seasonal & Holiday Items": "celebration",
    "Gifts & Greeting Cards": "card-giftcard",
    
    // Specialized
    "Baby": "child-care",
    "Pets": "pets",
    "Auto, Tires & Industrial": "directions-car",
    "Tools & Hardware": "handyman",
    "Subscription Boxes": "inventory-2",
    "Religious & Spiritual": "place",
    
    // Organizations
    "Nonprofit": "volunteer-activism",
    "Trade Association": "groups",
    "Chamber": "business-center",
    "Influencer": "person",
    "Directory": "list",
    
    // Other
    "Miscellaneous": "category",
    "Other": "more-horiz",
  };
  
  return iconMap[categoryName] || "category";
};

// Get gradient colors for categories
const getCategoryGradient = (categoryName: string): string[] => {
  // Check if it's a popular category first
  const popularCategory = POPULAR_CATEGORIES.find(cat => cat.name === categoryName);
  if (popularCategory) {
    return popularCategory.gradient;
  }
  
  // Comprehensive gradient map for all categories
  const gradientMap: Record<string, string[]> = {
    // Food & Dining - Warm earth tones
    "Food & Beverage": ["#ba9988", "#9d7f6f"],
    "Bars & Lounge": ["#8b4513", "#654321"],
    "Grocery": ["#ff9800", "#f57c00"],
    "Wine, Spirits & Liquor": ["#7b1fa2", "#6a1b9a"],
    
    // Beauty & Wellness - Pink/Purple tones
    "Beauty & Cosmetics": ["#e91e63", "#c2185b"],
    "Health & Wellness": ["#4caf50", "#388e3c"],
    "Medical & Healthcare": ["#00bcd4", "#0097a7"],
    "Pharmacy": ["#2196f3", "#1976d2"],
    "Personal Care": ["#e91e63", "#c2185b"],
    "Exercise & Fitness": ["#ff5722", "#e64a19"],
    
    // Retail & Shopping - Gold/Yellow tones
    "Clothing, Shoes & Accessories": ["#ffd700", "#ffb300"],
    "Jewelry & Watches": ["#ffc107", "#ffa000"],
    "Luggage & Bags": ["#795548", "#5d4037"],
    "Vintage & Collectibles": ["#8d6e63", "#6d4c41"],
    
    // Home & Living - Orange/Green tones
    "Home Improvements & Decor": ["#ff9800", "#f57c00"],
    "Furniture & Appliances": ["#8d6e63", "#6d4c41"],
    "Household Essentials": ["#607d8b", "#455a64"],
    "Kitchenware & Cookware": ["#ff6f00", "#e65100"],
    "Bedding & Linens": ["#9c27b0", "#7b1fa2"],
    "Patio & Garden": ["#4caf50", "#388e3c"],
    "Gardening Tools & Supplies": ["#66bb6a", "#43a047"],
    "Home Security & Smart Devices": ["#2196f3", "#1976d2"],
    "Cleaning Supplies": ["#00acc1", "#00838f"],
    
    // Technology & Electronics - Blue/Purple tones
    "Electronics & Audio": ["#2196f3", "#1976d2"],
    "Cell Phones & Accessories": ["#3f51b5", "#303f9f"],
    "Digital Products": ["#9c27b0", "#7b1fa2"],
    "Mobile Apps & Software Licenses": ["#673ab7", "#512da8"],
    
    // Services & Business - Blue/Teal tones
    "Professional Services": ["#00bcd4", "#0097a7"],
    "Real Estate": ["#607d8b", "#455a64"],
    "Finance & Payments": ["#4caf50", "#388e3c"],
    "Financial Institution": ["#009688", "#00796b"],
    "Merchant Services": ["#2196f3", "#1976d2"],
    "Insurance": ["#00acc1", "#00838f"],
    "Construction": ["#ff9800", "#f57c00"],
    "Child Care & Day Care": ["#ffc107", "#ffa000"],
    
    // Education & Media - Purple/Blue tones
    "Music, Movies & Books": ["#9c27b0", "#7b1fa2"],
    "Content Creation": ["#e91e63", "#c2185b"],
    "Film & Production": ["#673ab7", "#512da8"],
    "Entertainment": ["#f44336", "#d32f2f"],
    "Event Tickets & Experiences": ["#ff5722", "#e64a19"],
    
    // Arts & Crafts - Purple/Pink tones
    "Arts, Crafts & Party Supplies": ["#9c27b0", "#7b1fa2"],
    "Craft Kits & DIY Projects": ["#e91e63", "#c2185b"],
    "Stationery & Office Supplies": ["#607d8b", "#455a64"],
    "Office Furniture": ["#795548", "#5d4037"],
    "Office Supplies": ["#607d8b", "#455a64"],
    
    // Lifestyle & Recreation - Green/Orange/Red tones
    "Sports & Outdoors": ["#ff5722", "#e64a19"],
    "Outdoor & Camping Equipment": ["#4caf50", "#388e3c"],
    "Travel & Transportation": ["#00bcd4", "#0097a7"],
    "Toys & Games": ["#ff9800", "#f57c00"],
    "Seasonal & Holiday Items": ["#f44336", "#d32f2f"],
    "Gifts & Greeting Cards": ["#e91e63", "#c2185b"],
    
    // Specialized - Various colors
    "Baby": ["#ffc107", "#ffa000"],
    "Pets": ["#ff9800", "#f57c00"],
    "Auto, Tires & Industrial": ["#607d8b", "#455a64"],
    "Tools & Hardware": ["#795548", "#5d4037"],
    "Subscription Boxes": ["#9c27b0", "#7b1fa2"],
    "Religious & Spiritual": ["#673ab7", "#512da8"],
    
    // Organizations - Teal/Blue tones
    "Nonprofit": ["#00acc1", "#00838f"],
    "Trade Association": ["#009688", "#00796b"],
    "Chamber": ["#00bcd4", "#0097a7"],
    "Influencer": ["#e91e63", "#c2185b"],
    "Directory": ["#607d8b", "#455a64"],
    
    // Other
    "Miscellaneous": ["#9e9e9e", "#757575"],
    "Other": ["#757575", "#616161"],
  };
  
  return gradientMap[categoryName] || ["#474747", "#232323"];
};

export default function Categories() {
  const router = useRouter();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState("");
  const isDesktop = width >= 1024;

  const filteredCategories = BUSINESS_CATEGORIES.filter((category) =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryPress = (category: string) => {
    router.push({
      pathname: "/pages/search/results",
      params: { category },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <OptimizedScrollView
        showBackToTop={true}
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: platformValues.scrollViewPaddingTop,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        {/* Back Button */}
        <BackButton label="Back to Search" marginBottom={24} />

        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: isMobile ? 28 : 32,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            All Categories
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Browse all available categories to discover Black-owned businesses
          </Text>
        </View>

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
              onChangeText={setSearchQuery}
              placeholder="Search categories..."
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
                onPress={() => setSearchQuery("")}
                style={{ padding: 4 }}
              >
                <MaterialIcons name="close" size={20} color="rgba(255, 255, 255, 0.5)" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories Grid */}
        {filteredCategories.length > 0 ? (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 24,
            }}
          >
            {filteredCategories.map((category) => {
              const icon = getCategoryIcon(category);
              const gradient = getCategoryGradient(category);
              const isPopular = POPULAR_CATEGORIES.some(cat => cat.name === category);
              
              return (
                <TouchableOpacity
                  key={category}
                  onPress={() => handleCategoryPress(category)}
                  activeOpacity={0.8}
                  style={{
                    width: isMobile 
                      ? "48%" 
                      : isDesktop 
                        ? "31%" 
                        : "48%",
                    borderRadius: 20,
                    padding: isMobile ? 16 : 20,
                    minHeight: isMobile ? 120 : 140,
                    borderWidth: 1,
                    borderColor: isPopular 
                      ? "rgba(186, 153, 136, 0.4)" 
                      : "rgba(186, 153, 136, 0.2)",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 4,
                    overflow: "hidden",
                    position: "relative",
                    backgroundColor: "#474747",
                  }}
                >
                  <LinearGradient
                    colors={gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      opacity: isPopular ? 0.15 : 0.1,
                    }}
                  />
                  <View style={{ flex: 1, justifyContent: "space-between" }}>
                    <View>
                      <MaterialIcons
                        name={icon}
                        size={isMobile ? 24 : 28}
                        color={gradient[0]}
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
                        {category}
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
            <MaterialIcons name="search-off" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              No categories found matching "{searchQuery}"
            </Text>
          </View>
        )}
      </OptimizedScrollView>
    </View>
  );
}
