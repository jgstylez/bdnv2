import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PublicHeroSection } from '@/components/layouts/PublicHeroSection';
import { ScrollAnimatedView } from '@/components/ScrollAnimatedView';

const updates = [
  {
    date: "2024-02-15",
    version: "2.1.0",
    title: "Enhanced Merchant Analytics",
    description: "New analytics dashboard with real-time insights, customer demographics, and revenue tracking.",
    features: ["Real-time analytics", "Customer insights", "Revenue tracking", "Export reports"],
    type: "feature",
  },
  {
    date: "2024-02-01",
    version: "2.0.5",
    title: "Mobile App Improvements",
    description: "Performance optimizations and UI enhancements for a smoother mobile experience.",
    features: ["Faster load times", "Improved navigation", "Better offline support"],
    type: "improvement",
  },
  {
    date: "2024-01-20",
    version: "2.0.0",
    title: "Major Platform Update",
    description: "Complete redesign with new features including subscription boxes, gift cards, and enhanced payment processing.",
    features: ["Subscription boxes", "Gift cards", "Enhanced payments", "New UI"],
    type: "major",
  },
  {
    date: "2024-01-10",
    version: "1.9.2",
    title: "Security Enhancements",
    description: "Enhanced security features including two-factor authentication and improved encryption.",
    features: ["2FA support", "Enhanced encryption", "Security audit"],
    type: "security",
  },
];

export default function Updates() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width < 768;
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredUpdates = selectedType === "all"
    ? updates
    : updates.filter((update) => update.type === selectedType);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "major":
        return "#ba9988";
      case "feature":
        return "#4caf50";
      case "security":
        return "#ff9800";
      case "improvement":
        return "#2196f3";
      default:
        return "#ba9988";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "major":
        return "Major Update";
      case "feature":
        return "New Feature";
      case "security":
        return "Security";
      case "improvement":
        return "Improvement";
      default:
        return "Update";
    }
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
          title="Platform Updates"
          subtitle="Stay informed about the latest features, improvements, and changes to the BDN platform."
        />

        {/* Filter Tabs */}
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
              {[
                { key: "all", label: "All Updates" },
                { key: "major", label: "Major" },
                { key: "feature", label: "Features" },
                { key: "security", label: "Security" },
                { key: "improvement", label: "Improvements" },
              ].map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  onPress={() => setSelectedType(filter.key)}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Filter updates by ${filter.label.toLowerCase()}`}
                  accessibilityHint={`Double tap to ${selectedType === filter.key ? "deselect" : "select"} ${filter.label.toLowerCase()} filter`}
                  accessibilityState={{ selected: selectedType === filter.key }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{
                    backgroundColor: selectedType === filter.key ? "#ba9988" : "#474747",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: selectedType === filter.key ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                    minHeight: 44,
                    minWidth: 44,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: selectedType === filter.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollAnimatedView>

        {/* Updates List */}
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
                maxWidth: 1000,
                alignSelf: "center",
                width: "100%",
              }}
            >
              {filteredUpdates.length > 0 ? (
                <View style={{ gap: 32 }}>
                  {filteredUpdates.map((update, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: "rgba(71, 71, 71, 0.4)",
                        borderRadius: 20,
                        padding: isMobile ? 24 : 32,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.3)",
                      }}
                    >
                      {/* Header */}
                      <View style={{ flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", marginBottom: 20, gap: 12 }}>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 }}>
                            <View
                              style={{
                                backgroundColor: `${getTypeColor(update.type)}26`,
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: `${getTypeColor(update.type)}40`,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontWeight: "700",
                                  color: getTypeColor(update.type),
                                  textTransform: "uppercase",
                                }}
                              >
                                {getTypeLabel(update.type)}
                              </Text>
                            </View>
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: "600",
                                color: "#ba9988",
                              }}
                            >
                              v{update.version}
                            </Text>
                          </View>
                          <Text
                            style={{
                              fontSize: isMobile ? 24 : 28,
                              fontWeight: "700",
                              color: "#ffffff",
                              marginBottom: 8,
                              letterSpacing: -0.5,
                            }}
                          >
                            {update.title}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: "rgba(255, 255, 255, 0.5)",
                            }}
                          >
                            {formatDate(update.date)}
                          </Text>
                        </View>
                      </View>

                      {/* Description */}
                      <Text
                        style={{
                          fontSize: 16,
                          color: "rgba(255, 255, 255, 0.8)",
                          lineHeight: 24,
                          marginBottom: 24,
                        }}
                      >
                        {update.description}
                      </Text>

                      {/* Features */}
                      <View style={{ gap: 12 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#ffffff",
                            marginBottom: 8,
                          }}
                        >
                          What's New:
                        </Text>
                        {update.features.map((feature, idx) => (
                          <View
                            key={idx}
                            style={{
                              flexDirection: "row",
                              alignItems: "flex-start",
                              gap: 12,
                            }}
                          >
                            <MaterialIcons name="check-circle" size={20} color="#4caf50" />
                            <Text
                              style={{
                                fontSize: 14,
                                color: "rgba(255, 255, 255, 0.8)",
                                lineHeight: 22,
                                flex: 1,
                              }}
                            >
                              {feature}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
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
                  <MaterialIcons name="update" size={48} color="rgba(186, 153, 136, 0.5)" />
                  <Text
                    style={{
                      fontSize: 16,
                      color: "rgba(255, 255, 255, 0.6)",
                      textAlign: "center",
                      marginTop: 16,
                    }}
                  >
                    No updates found for this category
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

