import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

const RESOURCES = [
  {
    title: "Black Spending Power Guide",
    type: "Guide",
    description: "Comprehensive guide to understanding and maximizing Black spending power.",
    href: "/web/learn/black-spending-power",
    icon: "trending-up",
  },
  {
    title: "Group Economics 101",
    type: "Article",
    description: "Learn the fundamentals of group economics and how to practice it.",
    href: "/web/learn/group-economics",
    icon: "diamond",
  },
  {
    title: "Community Impact Stories",
    type: "Case Study",
    description: "Real-world examples of economic impact in Black communities.",
    href: "/web/learn/community-impact",
    icon: "public",
  },
  {
    title: "BDN University",
    type: "Education",
    description: "Access courses, guides, and resources for financial literacy and business growth.",
    href: "/pages/university",
    icon: "school",
  },
];

export const EducationalResourcesSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;

  return (
    <ScrollAnimatedView delay={500}>
      <View
        style={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingVertical: isMobile ? 60 : 80,
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
          <View style={{ alignItems: "center", marginBottom: 48 }}>
            <MaterialIcons name="menu-book" size={48} color="#ba9988" style={{ marginBottom: 16 }} />
            <Text
              style={{
                fontSize: isMobile ? 32 : 44,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 16,
                textAlign: "center",
                letterSpacing: -0.5,
              }}
            >
              Educational Resources
            </Text>
            <Text
              style={{
                fontSize: isMobile ? 16 : 18,
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
                maxWidth: 700,
                lineHeight: 26,
              }}
            >
              Explore our comprehensive educational content on Black spending power, group economics, and community impact.
            </Text>
          </View>

          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            {RESOURCES.map((resource, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(resource.href as any)}
                style={{
                  flex: 1,
                  minWidth: isMobile ? "100%" : "45%",
                  backgroundColor: "rgba(71, 71, 71, 0.4)",
                  borderRadius: 20,
                  padding: isMobile ? 24 : 32,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      backgroundColor: "rgba(186, 153, 136, 0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons name={resource.icon as any} size={24} color="#ba9988" />
                  </View>
                  <View
                    style={{
                      backgroundColor: "rgba(186, 153, 136, 0.15)",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: "#ba9988",
                        textTransform: "uppercase",
                      }}
                    >
                      {resource.type}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: isMobile ? 20 : 24,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 12,
                  }}
                >
                  {resource.title}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 24,
                    marginBottom: 20,
                  }}
                >
                  {resource.description}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ba9988",
                    }}
                  >
                    Learn More
                  </Text>
                  <MaterialIcons name="arrow-forward" size={18} color="#ba9988" />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => router.push("/web/learn")}
            style={{
              backgroundColor: "#ba9988",
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
              alignSelf: "center",
              marginTop: 40,
              minWidth: 200,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#ffffff",
              }}
            >
              Browse All Resources →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};
