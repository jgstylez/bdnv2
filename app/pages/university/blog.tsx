import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BlogPost } from '@/types/education';
import { platformValues, isAndroid } from "../../../utils/platform";
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

// Mock blog posts
const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "BDN Launches New Merchant Features",
    excerpt: "We're excited to announce new features for merchants, including enhanced analytics and QR code generation.",
    content: "",
    author: {
      name: "BDN Team",
    },
    category: "updates",
    tags: ["merchant", "features", "announcement"],
    featuredImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop",
    publishedAt: "2024-02-15T10:00:00Z",
    readTime: 5,
    views: 1250,
  },
  {
    id: "2",
    title: "5 Ways to Maximize Your Impact Points",
    excerpt: "Learn how to earn more points and unlock higher membership levels with these proven strategies.",
    content: "",
    author: {
      name: "Sarah Johnson",
    },
    category: "tips",
    tags: ["points", "rewards", "tips"],
    featuredImage: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=450&fit=crop",
    publishedAt: "2024-02-10T14:00:00Z",
    readTime: 7,
    views: 890,
  },
  {
    id: "3",
    title: "Community Spotlight: Black-Owned Businesses Making a Difference",
    excerpt: "Meet the entrepreneurs building stronger communities through their businesses.",
    content: "",
    author: {
      name: "Marcus Williams",
    },
    category: "community",
    tags: ["community", "businesses", "spotlight"],
    featuredImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=450&fit=crop",
    publishedAt: "2024-02-05T09:00:00Z",
    readTime: 10,
    views: 650,
  },
  {
    id: "4",
    title: "Understanding Cashback: How It Works",
    excerpt: "A comprehensive guide to earning and using cashback on the BDN platform.",
    content: "",
    author: {
      name: "BDN Team",
    },
    category: "tips",
    tags: ["cashback", "rewards", "guide"],
    featuredImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=450&fit=crop",
    publishedAt: "2024-02-01T12:00:00Z",
    readTime: 6,
    views: 420,
  },
];

const categories = [
  { key: "all", label: "All Posts" },
  { key: "news", label: "News" },
  { key: "tips", label: "Tips" },
  { key: "community", label: "Community" },
  { key: "business", label: "Business" },
  { key: "updates", label: "Updates" },
];

export default function Blog() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredPosts = selectedCategory === "all"
    ? mockBlogPosts
    : mockBlogPosts.filter((post) => post.category === selectedCategory);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <OptimizedScrollView
        showBackToTop={true}
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: platformValues.scrollViewPaddingTop,
          paddingBottom: 40,
        }}
      >
        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          nestedScrollEnabled={isAndroid}
          style={{ marginBottom: 24 }}
          contentContainerStyle={{ gap: 8 }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              onPress={() => setSelectedCategory(category.key)}
              activeOpacity={platformValues.touchOpacity}
              hitSlop={platformValues.hitSlop}
              style={{
                backgroundColor: selectedCategory === category.key ? "#ffd700" : "#474747",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: selectedCategory === category.key ? "#ffd700" : "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: selectedCategory === category.key ? "#232323" : "rgba(255, 255, 255, 0.7)",
                }}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Blog Posts */}
        {filteredPosts.length > 0 ? (
          <View style={{ gap: 24 }}>
            {filteredPosts.map((post) => (
              <TouchableOpacity
                key={post.id}
                onPress={() => router.push(`/pages/university/blog/${post.id}`)}
                activeOpacity={platformValues.touchOpacity}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                {/* Featured Image */}
                {post.featuredImage && (
                  <View
                    style={{
                      width: isMobile ? "100%" : 280,
                      height: isMobile ? 200 : "auto",
                      backgroundColor: "#232323",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      source={{ uri: post.featuredImage }}
                      style={{
                        width: "100%",
                        height: "100%",
                    }}
                      contentFit="cover"
cachePolicy="memory-disk"
                  />
                  </View>
                )}
                
                {/* Content */}
                <View style={{ flex: 1, padding: isMobile ? 20 : 24 }}>
                  {/* Category and Date */}
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <View
                      style={{
                        backgroundColor: "rgba(186, 153, 136, 0.15)",
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "600",
                          color: "#ba9988",
                          textTransform: "capitalize",
                        }}
                      >
                        {post.category}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      {formatDate(post.publishedAt)}
                    </Text>
                  </View>

                  {/* Title */}
                  <Text
                    style={{
                      fontSize: isMobile ? 20 : 24,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 8,
                      lineHeight: isMobile ? 28 : 32,
                    }}
                  >
                    {post.title}
                  </Text>

                  {/* Excerpt */}
                  <Text
                    style={{
                      fontSize: 15,
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: 16,
                      lineHeight: 22,
                    }}
                    numberOfLines={2}
                  >
                    {post.excerpt}
                  </Text>

                  {/* Footer */}
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <MaterialIcons name="person" size={16} color="rgba(255, 255, 255, 0.5)" />
                        <Text
                          style={{
                            fontSize: 13,
                            color: "rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          {post.author.name}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <MaterialIcons name="schedule" size={16} color="rgba(255, 255, 255, 0.5)" />
                        <Text
                          style={{
                            fontSize: 13,
                            color: "rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          {post.readTime} min
                        </Text>
                      </View>
                    </View>
                    <MaterialIcons name="arrow-forward" size={20} color="#ba9988" />
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
            <MaterialIcons name="article" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              No blog posts found for this category
            </Text>
          </View>
        )}
      </OptimizedScrollView>
    </View>
  );
}

