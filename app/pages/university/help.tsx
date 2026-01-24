import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { HelpArticle } from '@/types/education';

// Mock help articles
const mockArticles: HelpArticle[] = [
  {
    id: "1",
    title: "How do I reset my password?",
    content: "To reset your password, go to the login page and click 'Forgot Password'. Enter your email address and follow the instructions sent to your email.",
    category: "account",
    tags: ["password", "security", "account"],
    helpful: 45,
    notHelpful: 2,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "2",
    title: "How do I earn cashback?",
    content: "Cashback is automatically earned when you make purchases at Black-owned businesses. The percentage varies by merchant and is credited to your account after the transaction is processed.",
    category: "rewards",
    tags: ["cashback", "rewards", "purchases"],
    helpful: 89,
    notHelpful: 5,
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-02-05T00:00:00Z",
  },
  {
    id: "3",
    title: "How do I add a payment method?",
    content: "Go to the Pay section, tap 'Add Wallet', and select your payment method type. Follow the prompts to securely add your card or bank account.",
    category: "payments",
    tags: ["payments", "wallet", "cards"],
    helpful: 67,
    notHelpful: 3,
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-10T00:00:00Z",
  },
  {
    id: "4",
    title: "How do I enroll my business?",
    content: "Navigate to your profile, select 'Enroll Business', and complete the multi-step onboarding process. You'll need business information, tax ID, and verification documents.",
    category: "merchant",
    tags: ["merchant", "business", "onboarding"],
    helpful: 34,
    notHelpful: 1,
    createdAt: "2024-02-05T00:00:00Z",
    updatedAt: "2024-02-12T00:00:00Z",
  },
];

const categories = [
  { key: "all", label: "All Topics" },
  { key: "account", label: "Account" },
  { key: "payments", label: "Payments" },
  { key: "merchant", label: "Merchant" },
  { key: "rewards", label: "Rewards" },
  { key: "troubleshooting", label: "Troubleshooting" },
  { key: "faq", label: "FAQ" },
];

export default function Help() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredArticles = mockArticles.filter((article) => {
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        {/* Search */}
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
              placeholder="Search help articles..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              style={{
                flex: 1,
                paddingVertical: 14,
                paddingHorizontal: 12,
                fontSize: 16,
                color: "#ffffff",
              }}
            />
          </View>
        </View>

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
                backgroundColor: selectedCategory === category.key ? "#2196f3" : "#474747",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: selectedCategory === category.key ? "#2196f3" : "rgba(186, 153, 136, 0.2)",
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
          <View style={{ gap: 12 }}>
            {filteredArticles.map((article) => (
              <TouchableOpacity
                key={article.id}
                onPress={() => router.push(`/pages/university/help/${article.id}`)}
                activeOpacity={0.8}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
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
                      numberOfLines={2}
                    >
                      {article.content}
                    </Text>
                    {article.tags.length > 0 && (
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                        {article.tags.slice(0, 3).map((tag, index) => (
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
                              {tag}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                    <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <MaterialIcons name="thumb-up" size={16} color="#4caf50" />
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        {article.helpful} helpful
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#2196f3",
                      }}
                    >
                      Read More →
                    </Text>
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
            <MaterialIcons name="help-outline" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              {searchQuery ? "No articles found matching your search" : "No articles found for this category"}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

