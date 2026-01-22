import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BlogPost } from '@/types/education';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PublicHeroSection } from '@/components/layouts/PublicHeroSection';
import { ScrollAnimatedView } from '@/components/ScrollAnimatedView';
import { ArticlePlaceholder } from '@/components/placeholders/SVGPlaceholders';

// Mock blog posts - sourced from university/blog
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
  {
    id: "5",
    title: "The Power of Group Economics",
    excerpt: "Exploring how circulating Black dollars creates lasting economic impact in our communities.",
    content: "",
    author: {
      name: "Dr. Angela Brown",
    },
    category: "business",
    tags: ["economics", "community", "impact"],
    featuredImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop",
    publishedAt: "2024-01-28T10:00:00Z",
    readTime: 8,
    views: 1100,
  },
  {
    id: "6",
    title: "Building Your Business on BDN: A Complete Guide",
    excerpt: "Step-by-step guide for Black business owners to maximize their presence and sales on the platform.",
    content: "",
    author: {
      name: "BDN Team",
    },
    category: "business",
    tags: ["business", "guide", "merchant"],
    featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    publishedAt: "2024-01-20T14:00:00Z",
    readTime: 12,
    views: 950,
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
  const insets = useSafeAreaInsets();
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
      <Navigation />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: isMobile ? insets.bottom : 0,
        }}
      >
        <PublicHeroSection
          title="BDN Blog"
          subtitle="Stay updated with the latest news, tips, and stories from our community."
        />

        {/* Category Filters */}
        <ScrollAnimatedView delay={200}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingVertical: 20,
              backgroundColor: "#232323",
            }}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.key}
                  onPress={() => setSelectedCategory(category.key)}
                  style={{
                    backgroundColor: selectedCategory === category.key ? "#ba9988" : "#474747",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: selectedCategory === category.key ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: selectedCategory === category.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollAnimatedView>

        {/* Blog Posts */}
        <ScrollAnimatedView delay={300}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingBottom: 80,
              backgroundColor: "#232323",
            }}
          >
            <View
              style={{
                maxWidth: 1200,
                alignSelf: "center",
                width: "100%",
              }}
            >
              {filteredPosts.length > 0 ? (
                <View style={{ gap: 32 }}>
                  {filteredPosts.map((post) => (
                    <TouchableOpacity
                      key={post.id}
                      onPress={() => router.push(`/pages/university/blog/${post.id}`)}
                      activeOpacity={0.9}
                      style={{
                        backgroundColor: "rgba(71, 71, 71, 0.4)",
                        borderRadius: 20,
                        overflow: "hidden",
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.3)",
                        flexDirection: "row",
                      }}
                    >
                      {/* Featured Image */}
                      <View
                        style={{
                          width: 120,
                          height: 180,
                          backgroundColor: "rgba(186, 153, 136, 0.05)",
                          overflow: "hidden",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {post.featuredImage ? (
                          <Image
                            source={{ uri: post.featuredImage }}
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                            contentFit="cover"
                          />
                        ) : (
                          <ArticlePlaceholder width={120} height={180} />
                        )}
                      </View>
                      
                      {/* Content */}
                      <View style={{ flex: 1, padding: isMobile ? 24 : 32 }}>
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
                            fontSize: isMobile ? 22 : 26,
                            fontWeight: "700",
                            color: "#ffffff",
                            marginBottom: 12,
                            lineHeight: isMobile ? 30 : 34,
                          }}
                        >
                          {post.title}
                        </Text>

                        {/* Excerpt */}
                        <Text
                          style={{
                            fontSize: 15,
                            color: "rgba(255, 255, 255, 0.7)",
                            marginBottom: 20,
                            lineHeight: 24,
                          }}
                          numberOfLines={3}
                        >
                          {post.excerpt}
                        </Text>

                        {/* Footer */}
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
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
                                {post.readTime} min read
                              </Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                              <MaterialIcons name="visibility" size={16} color="rgba(255, 255, 255, 0.5)" />
                              <Text
                                style={{
                                  fontSize: 13,
                                  color: "rgba(255, 255, 255, 0.6)",
                                }}
                              >
                                {post.views} views
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
                    backgroundColor: "rgba(71, 71, 71, 0.4)",
                    borderRadius: 16,
                    padding: 40,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.3)",
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
            </View>
          </View>
        </ScrollAnimatedView>

        <Footer />
      </ScrollView>
    </View>
  );
}

