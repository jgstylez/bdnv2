import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { BlogArticle } from '@/types/media';

// Mock blog articles
const mockArticles: BlogArticle[] = [
  {
    id: "1",
    title: "BDN Launches New Merchant Features",
    excerpt: "We're excited to announce new features for merchants, including enhanced analytics and QR code generation.",
    content: "",
    author: {
      id: "1",
      name: "BDN Team",
    },
    category: "updates",
    tags: ["merchant", "features", "announcement"],
    publishedAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-02-15T10:00:00Z",
    readTime: 5,
    views: 1250,
    isPublished: true,
  },
  {
    id: "2",
    title: "5 Ways to Maximize Your Impact Points",
    excerpt: "Learn how to earn more points and unlock higher membership levels with these proven strategies.",
    content: "",
    author: {
      id: "2",
      name: "Sarah Johnson",
    },
    category: "features",
    tags: ["points", "rewards", "tips"],
    publishedAt: "2024-02-10T14:00:00Z",
    updatedAt: "2024-02-10T14:00:00Z",
    readTime: 7,
    views: 890,
    isPublished: true,
  },
  {
    id: "3",
    title: "Community Spotlight: Black-Owned Businesses Making a Difference",
    excerpt: "Meet the entrepreneurs building stronger communities through their businesses.",
    content: "",
    author: {
      id: "3",
      name: "Marcus Williams",
    },
    category: "community",
    tags: ["community", "businesses", "spotlight"],
    publishedAt: "2024-02-05T09:00:00Z",
    updatedAt: "2024-02-05T09:00:00Z",
    readTime: 10,
    views: 650,
    isPublished: true,
  },
];

const categories = [
  { key: "all", label: "All Posts" },
  { key: "news", label: "News" },
  { key: "features", label: "Features" },
  { key: "community", label: "Community" },
  { key: "business", label: "Business" },
  { key: "updates", label: "Updates" },
];

export default function MediaBlog() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredArticles = selectedCategory === "all"
    ? mockArticles
    : mockArticles.filter((article) => article.category === selectedCategory);

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
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 24 }}
          contentContainerStyle={{ gap: 8 }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              onPress={() => setSelectedCategory(category.key)}
              style={{
                backgroundColor: selectedCategory === category.key ? "#4caf50" : "#474747",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: selectedCategory === category.key ? "#4caf50" : "rgba(186, 153, 136, 0.2)",
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

        {/* Articles List */}
        {filteredArticles.length > 0 ? (
          <View style={{ gap: 16 }}>
            {filteredArticles.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                {article.featuredImage && (
                  <View
                    style={{
                      height: 200,
                      backgroundColor: "#232323",
                    }}
                  />
                )}
                <View style={{ padding: 20 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <View
                      style={{
                        backgroundColor: "rgba(186, 153, 136, 0.15)",
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 8,
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
                        {article.category}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.6)",
                      }}
                    >
                      {formatDate(article.publishedAt)}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 8,
                    }}
                  >
                    {article.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: 12,
                    }}
                  >
                    {article.excerpt}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <MaterialIcons name="person" size={14} color="rgba(255, 255, 255, 0.5)" />
                        <Text
                          style={{
                            fontSize: 12,
                            color: "rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          {article.author.name}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <MaterialIcons name="schedule" size={14} color="rgba(255, 255, 255, 0.5)" />
                        <Text
                          style={{
                            fontSize: 12,
                            color: "rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          {article.readTime} min read
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <MaterialIcons name="visibility" size={14} color="rgba(255, 255, 255, 0.5)" />
                        <Text
                          style={{
                            fontSize: 12,
                            color: "rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          {article.views} views
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#4caf50",
                      }}
                    >
                      Read More →
                    </Text>
                  </View>
                  {article.tags.length > 0 && (
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "rgba(186, 153, 136, 0.2)" }}>
                      {article.tags.map((tag, index) => (
                        <View
                          key={index}
                          style={{
                            backgroundColor: "rgba(186, 153, 136, 0.15)",
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 6,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              color: "#ba9988",
                              fontWeight: "600",
                            }}
                          >
                            #{tag}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
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
              No articles found for this category
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

