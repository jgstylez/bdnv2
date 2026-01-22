import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Modal, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PublicHeroSection } from '@/components/layouts/PublicHeroSection';
import { ScrollAnimatedView } from '@/components/ScrollAnimatedView';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  category: "consumer" | "business" | "nonprofit" | "platform";
  status: "planned" | "in-progress" | "completed";
  upvotes: number;
  createdAt: number;
  userVoted?: boolean;
}

const INITIAL_FEATURES: FeatureRequest[] = [
  {
    id: "1",
    title: "Digital Wallet Integration",
    description: "Seamless payment processing with digital wallet support for easy transactions.",
    category: "platform",
    status: "completed",
    upvotes: 245,
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: "2",
    title: "Business Directory",
    description: "Comprehensive directory of Black-owned businesses with search and filtering.",
    category: "platform",
    status: "completed",
    upvotes: 189,
    createdAt: Date.now() - 86400000 * 25,
  },
  {
    id: "3",
    title: "Rewards Program",
    description: "Earn points and unlock exclusive benefits through our tiered rewards system.",
    category: "consumer",
    status: "completed",
    upvotes: 312,
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: "4",
    title: "Analytics Dashboard",
    description: "Real-time analytics and insights for businesses to track performance.",
    category: "business",
    status: "in-progress",
    upvotes: 156,
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: "5",
    title: "Mobile App",
    description: "Native mobile applications for iOS and Android with full platform features.",
    category: "platform",
    status: "in-progress",
    upvotes: 423,
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: "6",
    title: "Social Media Integration",
    description: "Connect and share your impact on social media platforms.",
    category: "consumer",
    status: "planned",
    upvotes: 98,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: "7",
    title: "Subscription Management",
    description: "Manage BDN+ subscriptions and billing directly from the app.",
    category: "consumer",
    status: "planned",
    upvotes: 134,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: "8",
    title: "Inventory Management",
    description: "Advanced inventory tracking and management tools for businesses.",
    category: "business",
    status: "planned",
    upvotes: 87,
    createdAt: Date.now() - 86400000 * 2,
  },
];

export default function Roadmap() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width < 768;
  const [features, setFeatures] = useState<FeatureRequest[]>(INITIAL_FEATURES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFeature, setNewFeature] = useState({ title: "", description: "", category: "platform" as const });
  const [filter, setFilter] = useState<"all" | "consumer" | "business" | "nonprofit" | "platform">("all");
  const [sortBy, setSortBy] = useState<"upvotes" | "recent">("upvotes");

  const handleUpvote = (id: string) => {
    setFeatures((prev) =>
      prev.map((feature) => {
        if (feature.id === id) {
          const alreadyVoted = feature.userVoted;
          return {
            ...feature,
            upvotes: alreadyVoted ? feature.upvotes - 1 : feature.upvotes + 1,
            userVoted: !alreadyVoted,
          };
        }
        return feature;
      })
    );
  };

  const handleAddFeature = () => {
    if (!newFeature.title.trim() || !newFeature.description.trim()) {
      Alert.alert("Error", "Please fill in both title and description");
      return;
    }

    const feature: FeatureRequest = {
      id: Date.now().toString(),
      title: newFeature.title,
      description: newFeature.description,
      category: newFeature.category,
      status: "planned",
      upvotes: 0,
      createdAt: Date.now(),
      userVoted: false,
    };

    setFeatures((prev) => [...prev, feature]);
    setNewFeature({ title: "", description: "", category: "platform" });
    setShowAddModal(false);
    Alert.alert("Success", "Feature request added! Other users can now upvote it.");
  };

  const filteredFeatures = features.filter((feature) => filter === "all" || feature.category === filter);

  const sortedFeatures = [...filteredFeatures].sort((a, b) => {
    if (sortBy === "upvotes") {
      return b.upvotes - a.upvotes;
    }
    return b.createdAt - a.createdAt;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#4caf50";
      case "in-progress":
        return "#ba9988";
      case "planned":
        return "#757575";
      default:
        return "#757575";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "planned":
        return "Planned";
      default:
        return status;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "consumer":
        return "Consumer";
      case "business":
        return "Business";
      case "nonprofit":
        return "Nonprofit";
      case "platform":
        return "Platform";
      default:
        return category;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <Navigation />
      <OptimizedScrollView
        showBackToTop={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: isMobile ? insets.bottom : 0,
        }}
      >
        <PublicHeroSection
          title="Product Roadmap"
          subtitle="See what we're building and share your ideas. Upvote features you want most."
        />

        {/* Add Feature CTA */}
        <ScrollAnimatedView delay={100}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingVertical: isMobile ? 40 : 60,
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
              <View
                style={{
                  backgroundColor: "rgba(71, 71, 71, 0.4)",
                  borderRadius: 24,
                  padding: isMobile ? 24 : 32,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="lightbulb" size={48} color="#ba9988" style={{ marginBottom: 16 }} />
                <Text
                  style={{
                    fontSize: isMobile ? 24 : 32,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 12,
                    textAlign: "center",
                  }}
                >
                  Have an Idea?
                </Text>
                <Text
                  style={{
                    fontSize: isMobile ? 15 : 16,
                    color: "rgba(255, 255, 255, 0.7)",
                    textAlign: "center",
                    marginBottom: 24,
                    maxWidth: 600,
                  }}
                >
                  Share your feature request with the community. Other users can upvote it to help us prioritize what to build next.
                </Text>
                <TouchableOpacity
                  onPress={() => setShowAddModal(true)}
                  style={{
                    backgroundColor: "#ba9988",
                    paddingHorizontal: 32,
                    paddingVertical: 14,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <MaterialIcons name="add" size={20} color="#ffffff" />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    Suggest a Feature
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Filters and Sort */}
        <ScrollAnimatedView delay={200}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingBottom: isMobile ? 24 : 32,
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
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: isMobile ? "stretch" : "center",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                {/* Category Filter */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: 12,
                    }}
                  >
                    Filter by Category
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    {[
                      { key: "all", label: "All" },
                      { key: "platform", label: "Platform" },
                      { key: "consumer", label: "Consumer" },
                      { key: "business", label: "Business" },
                      { key: "nonprofit", label: "Nonprofit" },
                    ].map((item) => (
                      <TouchableOpacity
                        key={item.key}
                        onPress={() => setFilter(item.key as any)}
                        style={{
                          backgroundColor: filter === item.key ? "#ba9988" : "#474747",
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderRadius: 8,
                          borderWidth: filter === item.key ? 0 : 1,
                          borderColor: "rgba(186, 153, 136, 0.2)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: "600",
                            color: filter === item.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Sort */}
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: 12,
                    }}
                  >
                    Sort By
                  </Text>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {[
                      { key: "upvotes", label: "Most Upvoted" },
                      { key: "recent", label: "Recent" },
                    ].map((item) => (
                      <TouchableOpacity
                        key={item.key}
                        onPress={() => setSortBy(item.key as any)}
                        style={{
                          backgroundColor: sortBy === item.key ? "#ba9988" : "#474747",
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderRadius: 8,
                          borderWidth: sortBy === item.key ? 0 : 1,
                          borderColor: "rgba(186, 153, 136, 0.2)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: "600",
                            color: sortBy === item.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Features List */}
        <ScrollAnimatedView delay={300}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingBottom: isMobile ? 60 : 80,
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
              <View style={{ gap: 16 }}>
                {sortedFeatures.map((feature) => (
                  <View
                    key={feature.id}
                    style={{
                      backgroundColor: "rgba(71, 71, 71, 0.4)",
                      borderRadius: 16,
                      padding: isMobile ? 20 : 24,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.3)",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: isMobile ? "column" : "row",
                        gap: 16,
                      }}
                    >
                      {/* Upvote Section */}
                      <TouchableOpacity
                        onPress={() => handleUpvote(feature.id)}
                        style={{
                          alignItems: "center",
                          justifyContent: "flex-start",
                          paddingTop: 4,
                          minWidth: 60,
                        }}
                      >
                        <MaterialIcons
                          name={feature.userVoted ? "keyboard-arrow-up" : "keyboard-arrow-up"}
                          size={32}
                          color={feature.userVoted ? "#ba9988" : "rgba(255, 255, 255, 0.5)"}
                        />
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "700",
                            color: feature.userVoted ? "#ba9988" : "rgba(255, 255, 255, 0.7)",
                            marginTop: 4,
                          }}
                        >
                          {feature.upvotes}
                        </Text>
                        <Text
                          style={{
                            fontSize: 11,
                            color: "rgba(255, 255, 255, 0.5)",
                            marginTop: 2,
                          }}
                        >
                          {feature.upvotes === 1 ? "vote" : "votes"}
                        </Text>
                      </TouchableOpacity>

                      {/* Content Section */}
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flexDirection: isMobile ? "column" : "row",
                            alignItems: isMobile ? "flex-start" : "center",
                            justifyContent: "space-between",
                            gap: 12,
                            marginBottom: 8,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: isMobile ? 18 : 20,
                              fontWeight: "700",
                              color: "#ffffff",
                              flex: 1,
                            }}
                          >
                            {feature.title}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              gap: 8,
                              flexWrap: "wrap",
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: "rgba(186, 153, 136, 0.15)",
                                paddingHorizontal: 10,
                                paddingVertical: 4,
                                borderRadius: 6,
                                borderWidth: 1,
                                borderColor: "rgba(186, 153, 136, 0.3)",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 11,
                                  fontWeight: "600",
                                  color: "#ba9988",
                                }}
                              >
                                {getCategoryLabel(feature.category)}
                              </Text>
                            </View>
                            <View
                              style={{
                                backgroundColor: `${getStatusColor(feature.status)}20`,
                                paddingHorizontal: 10,
                                paddingVertical: 4,
                                borderRadius: 6,
                                borderWidth: 1,
                                borderColor: getStatusColor(feature.status),
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 11,
                                  fontWeight: "600",
                                  color: getStatusColor(feature.status),
                                }}
                              >
                                {getStatusLabel(feature.status)}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "rgba(255, 255, 255, 0.7)",
                            lineHeight: 20,
                            marginBottom: 12,
                          }}
                        >
                          {feature.description}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {sortedFeatures.length === 0 && (
                <View
                  style={{
                    alignItems: "center",
                    paddingVertical: 60,
                  }}
                >
                  <MaterialIcons name="inbox" size={64} color="rgba(255, 255, 255, 0.3)" />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.7)",
                      marginTop: 16,
                    }}
                  >
                    No features found
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.5)",
                      marginTop: 8,
                    }}
                  >
                    Try adjusting your filters
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollAnimatedView>

        <Footer />
      </OptimizedScrollView>

      {/* Add Feature Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#232323",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              maxHeight: "90%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                  color: "#ffffff",
                }}
              >
                Suggest a Feature
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <MaterialIcons name="close" size={24} color="rgba(255, 255, 255, 0.7)" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ gap: 20 }}>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: 8,
                    }}
                  >
                    Feature Title *
                  </Text>
                  <TextInput
                    value={newFeature.title}
                    onChangeText={(text) => setNewFeature({ ...newFeature, title: text })}
                    placeholder="e.g., Dark Mode Support"
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    style={{
                      backgroundColor: "#474747",
                      borderRadius: 12,
                      padding: 16,
                      fontSize: 16,
                      color: "#ffffff",
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  />
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: 8,
                    }}
                  >
                    Description *
                  </Text>
                  <TextInput
                    value={newFeature.description}
                    onChangeText={(text) => setNewFeature({ ...newFeature, description: text })}
                    placeholder="Describe your feature idea in detail..."
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    multiline
                    numberOfLines={6}
                    style={{
                      backgroundColor: "#474747",
                      borderRadius: 12,
                      padding: 16,
                      fontSize: 16,
                      color: "#ffffff",
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                      textAlignVertical: "top",
                      minHeight: 120,
                    }}
                  />
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: 8,
                    }}
                  >
                    Category
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    {[
                      { key: "platform", label: "Platform" },
                      { key: "consumer", label: "Consumer" },
                      { key: "business", label: "Business" },
                      { key: "nonprofit", label: "Nonprofit" },
                    ].map((item) => (
                      <TouchableOpacity
                        key={item.key}
                        onPress={() => setNewFeature({ ...newFeature, category: item.key as any })}
                        style={{
                          backgroundColor: newFeature.category === item.key ? "#ba9988" : "#474747",
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 8,
                          borderWidth: newFeature.category === item.key ? 0 : 1,
                          borderColor: "rgba(186, 153, 136, 0.2)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: newFeature.category === item.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    marginTop: 8,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setShowAddModal(false)}
                    style={{
                      flex: 1,
                      backgroundColor: "#474747",
                      paddingVertical: 14,
                      borderRadius: 12,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleAddFeature}
                    style={{
                      flex: 1,
                      backgroundColor: "#ba9988",
                      paddingVertical: 14,
                      borderRadius: 12,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#ffffff",
                      }}
                    >
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
