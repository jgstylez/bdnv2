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
import { useAuth } from '@/hooks/useAuth';
import { navigateToAuthenticatedRoute, requiresAuthentication } from '@/lib/navigation-utils';

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
  const { isAuthenticated } = useAuth();
  const isMobile = width < 768;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredPosts = selectedCategory === "all"
    ? mockBlogPosts
    : mockBlogPosts.filter((post) => post.category === selectedCategory);

  // Define which posts are free to read (first 2)
  const FREE_POSTS_COUNT = 2;
  const isPostFree = (index: number) => index < FREE_POSTS_COUNT;

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
          subtitle="Stay updated with the latest news, tips, and stories from our community. Read our featured articles free, or sign up to unlock all content."
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
            <View
              style={{
                maxWidth: 1200,
                alignSelf: "center",
                width: "100%",
              }}
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ 
                  gap: 12,
                  justifyContent: isMobile ? "flex-start" : "center",
                }}
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.key}
                    onPress={() => setSelectedCategory(category.key)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Filter blog posts by ${category.label.toLowerCase()}`}
                    accessibilityHint={`Double tap to ${selectedCategory === category.key ? "deselect" : "select"} ${category.label.toLowerCase()} filter`}
                    accessibilityState={{ selected: selectedCategory === category.key }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{
                      backgroundColor: selectedCategory === category.key ? "#ba9988" : "#474747",
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: selectedCategory === category.key ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                      minHeight: 44,
                      minWidth: 44,
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
                <View style={{ gap: isMobile ? 24 : 32 }}>
                  {filteredPosts.map((post, index) => {
                    const isFree = isPostFree(index);
                    const isGated = !isFree && !isAuthenticated;
                    
                    return (
                    <View
                      key={post.id}
                      style={{
                        backgroundColor: "rgba(71, 71, 71, 0.4)",
                        borderRadius: 20,
                        overflow: "hidden",
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.3)",
                        flexDirection: "row",
                        position: "relative",
                        alignItems: "stretch",
                      }}
                    >
                      {isGated && (
                        <View
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(35, 35, 35, 0.95)",
                            zIndex: 10,
                            borderRadius: 20,
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 24,
                            gap: 16,
                          }}
                        >
                          <MaterialIcons name="lock" size={48} color="#ba9988" />
                          <Text
                            style={{
                              fontSize: isMobile ? 20 : 24,
                              fontWeight: "700",
                              color: "#ffffff",
                              textAlign: "center",
                            }}
                          >
                            Sign up to read this article
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              color: "rgba(255, 255, 255, 0.7)",
                              textAlign: "center",
                              maxWidth: 400,
                            }}
                          >
                            Join BDN to access exclusive content and unlock all articles.
                          </Text>
                          <TouchableOpacity
                            onPress={() => router.push("/(auth)/signup")}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="Sign up for free to read this article"
                            accessibilityHint="Double tap to create a free account"
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            style={{
                              backgroundColor: "#ba9988",
                              paddingHorizontal: 32,
                              paddingVertical: 14,
                              borderRadius: 12,
                              marginTop: 8,
                              minHeight: 44,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: "600",
                                color: "#ffffff",
                              }}
                            >
                              Sign Up Free
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      <TouchableOpacity
                        onPress={() => {
                          if (isGated) {
                            router.push("/(auth)/signup");
                          } else {
                            // TODO: When actual authentication is implemented, check if user is authenticated
                            // before navigating to authenticated routes. For now, redirect to login.
                            navigateToAuthenticatedRoute(router, `/pages/university/blog/${post.id}`);
                          }
                        }}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel={isGated ? `Sign up to read: ${post.title}` : `Read article: ${post.title}`}
                        accessibilityHint={isGated ? "Double tap to sign up and unlock this article" : "Double tap to read the full article"}
                        activeOpacity={0.9}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        style={{
                          flexDirection: isMobile ? "column" : "row",
                          flex: 1,
                          alignItems: "stretch",
                          minHeight: 44,
                        }}
                      >
                      {/* Featured Image */}
                      <View
                        style={{
                          width: isMobile ? "100%" : 300,
                          height: isMobile ? 200 : undefined,
                          minHeight: isMobile ? 200 : "100%",
                          backgroundColor: "rgba(186, 153, 136, 0.05)",
                          overflow: "hidden",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          alignSelf: "stretch",
                        }}
                      >
                        {post.featuredImage ? (
                          <Image
                            source={{ uri: post.featuredImage }}
                            accessible={true}
                            accessibilityRole="image"
                            accessibilityLabel={`Featured image for article: ${post.title}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              minHeight: "100%",
                            }}
                            contentFit="cover"
                          />
                        ) : (
                          <ArticlePlaceholder width={isMobile ? "100%" : 300} height={isMobile ? 200 : 300} />
                        )}
                      </View>
                      
                      {/* Content */}
                      <View style={{ flex: 1, padding: isMobile ? 20 : 32, alignSelf: "stretch" }}>
                        {/* Category and Date */}
                        <View style={{ flexDirection: "row", alignItems: "center", gap: isMobile ? 8 : 12, marginBottom: isMobile ? 10 : 12, flexWrap: "wrap" }}>
                          <View
                            style={{
                              backgroundColor: "rgba(186, 153, 136, 0.15)",
                              paddingHorizontal: isMobile ? 8 : 10,
                              paddingVertical: isMobile ? 3 : 4,
                              borderRadius: 6,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: isMobile ? 10 : 11,
                                fontWeight: "600",
                                color: "#ba9988",
                                textTransform: "capitalize",
                              }}
                            >
                              {post.category}
                            </Text>
                          </View>
                          {isFree && (
                            <View
                              style={{
                                backgroundColor: "rgba(76, 175, 80, 0.2)",
                                paddingHorizontal: isMobile ? 6 : 8,
                                paddingVertical: isMobile ? 3 : 4,
                                borderRadius: 6,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <MaterialIcons name="check-circle" size={isMobile ? 11 : 12} color="#4caf50" />
                              <Text
                                style={{
                                  fontSize: isMobile ? 9 : 10,
                                  fontWeight: "600",
                                  color: "#4caf50",
                                }}
                              >
                                Free
                              </Text>
                            </View>
                          )}
                          {isGated && (
                            <View
                              style={{
                                backgroundColor: "rgba(186, 153, 136, 0.2)",
                                paddingHorizontal: isMobile ? 6 : 8,
                                paddingVertical: isMobile ? 3 : 4,
                                borderRadius: 6,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <MaterialIcons name="lock" size={isMobile ? 11 : 12} color="#ba9988" />
                              <Text
                                style={{
                                  fontSize: isMobile ? 9 : 10,
                                  fontWeight: "600",
                                  color: "#ba9988",
                                }}
                              >
                                Members Only
                              </Text>
                            </View>
                          )}
                          <Text
                            style={{
                              fontSize: isMobile ? 11 : 12,
                              color: "rgba(255, 255, 255, 0.5)",
                            }}
                          >
                            {formatDate(post.publishedAt)}
                          </Text>
                        </View>

                        {/* Title */}
                        <Text
                          style={{
                            fontSize: isMobile ? 20 : 26,
                            fontWeight: "700",
                            color: "#ffffff",
                            marginBottom: isMobile ? 10 : 12,
                            lineHeight: isMobile ? 28 : 34,
                          }}
                        >
                          {post.title}
                        </Text>

                        {/* Excerpt */}
                        <Text
                          style={{
                            fontSize: isMobile ? 14 : 15,
                            color: "rgba(255, 255, 255, 0.7)",
                            marginBottom: isMobile ? 16 : 20,
                            lineHeight: isMobile ? 22 : 24,
                          }}
                          numberOfLines={isMobile ? 2 : 3}
                        >
                          {post.excerpt}
                        </Text>

                        {/* Footer */}
                        <View style={{ 
                          flexDirection: isMobile ? "column" : "row", 
                          alignItems: isMobile ? "flex-start" : "center", 
                          justifyContent: "space-between", 
                          marginTop: isMobile ? 16 : "auto",
                          gap: isMobile ? 12 : 0,
                        }}>
                          <View style={{ 
                            flexDirection: "row", 
                            alignItems: "center", 
                            gap: isMobile ? 12 : 16, 
                            flexWrap: "wrap",
                            flex: 1,
                          }}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                              <MaterialIcons name="person" size={isMobile ? 14 : 16} color="rgba(255, 255, 255, 0.5)" />
                              <Text
                                style={{
                                  fontSize: isMobile ? 12 : 13,
                                  color: "rgba(255, 255, 255, 0.6)",
                                }}
                              >
                                {post.author.name}
                              </Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                              <MaterialIcons name="schedule" size={isMobile ? 14 : 16} color="rgba(255, 255, 255, 0.5)" />
                              <Text
                                style={{
                                  fontSize: isMobile ? 12 : 13,
                                  color: "rgba(255, 255, 255, 0.6)",
                                }}
                              >
                                {post.readTime} min read
                              </Text>
                            </View>
                            {!isMobile && (
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
                            )}
                          </View>
                          <MaterialIcons name="arrow-forward" size={isMobile ? 18 : 20} color="#ba9988" />
                        </View>
                      </View>
                    </TouchableOpacity>
                    </View>
                  );
                  })}
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

