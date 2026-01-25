import React from "react";
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

// Mock designer stats
const mockStats = {
  designTokens: 45,
  componentsDocumented: 28,
  colorPalettes: 8,
  typographyStyles: 12,
};

const designerSections = [
  {
    id: "brand-identity",
    name: "Brand Identity",
    description: "Logo, mission, values, etc",
    icon: "badge",
    color: "#ba9988",
    route: "/designer/brand-identity",
  },
  {
    id: "logo",
    name: "Logo",
    description: "Logo variations, usage guidelines",
    icon: "auto-awesome",
    color: "#9c27b0",
    route: "/designer/logo",
  },
  {
    id: "ui-design",
    name: "UI Design",
    description: "Design principles and interaction patterns",
    icon: "design-services",
    color: "#e91e63",
    route: "/designer/ui-design",
  },
  {
    id: "color-palette",
    name: "Color Palette",
    description: "Color system with swatches and usage",
    icon: "palette",
    color: "#2196f3",
    route: "/designer/color-palette",
  },
  {
    id: "typography",
    name: "Typography",
    description: "Font families, weights, and styles",
    icon: "text-fields",
    color: "#4caf50",
    route: "/designer/typography",
  },
  {
    id: "components",
    name: "Components",
    description: "Reusable component library and patterns",
    icon: "widgets",
    color: "#ff9800",
    route: "/designer/components",
  },
  {
    id: "spacing",
    name: "Spacing",
    description: "Spacing scale and layout grid system",
    icon: "view-column",
    color: "#00bcd4",
    route: "/designer/spacing",
  },
  {
    id: "icons",
    name: "Icons",
    description: "Icon library and usage guidelines",
    icon: "image",
    color: "#ff4444",
    route: "/designer/icons",
  },
  {
    id: "imagery",
    name: "Imagery",
    description: "Photography, illustrations, and visual assets",
    icon: "photo-library",
    color: "#9c27b0",
    route: "/designer/imagery",
  },
];

function DesignerDashboardContent() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;

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
        {/* Description */}
        <View style={{ marginBottom: 32, paddingTop: 20 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "rgba(255, 255, 255, 0.9)",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Designer Portal
          </Text>
        </View>

        {/* Quick Stats */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: isMobile ? "wrap" : "nowrap",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <View
            style={{
              flex: isMobile ? 1 : 1,
              minWidth: isMobile ? "47%" : undefined,
              maxWidth: isMobile ? "47%" : undefined,
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 8,
              }}
            >
              Design Tokens
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#ba9988",
              }}
            >
              {mockStats.designTokens}
            </Text>
          </View>
          <View
            style={{
              flex: isMobile ? 1 : 1,
              minWidth: isMobile ? "47%" : undefined,
              maxWidth: isMobile ? "47%" : undefined,
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 8,
              }}
            >
              Components
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#e91e63",
              }}
            >
              {mockStats.componentsDocumented}
            </Text>
          </View>
          <View
            style={{
              flex: isMobile ? 1 : 1,
              minWidth: isMobile ? "47%" : undefined,
              maxWidth: isMobile ? "47%" : undefined,
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 8,
              }}
            >
              Color Palettes
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#2196f3",
              }}
            >
              {mockStats.colorPalettes}
            </Text>
          </View>
          <View
            style={{
              flex: isMobile ? 1 : 1,
              minWidth: isMobile ? "47%" : undefined,
              maxWidth: isMobile ? "47%" : undefined,
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 8,
              }}
            >
              Typography Styles
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#4caf50",
              }}
            >
              {mockStats.typographyStyles}
            </Text>
          </View>
        </View>

        {/* Design Guidelines */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 24,
            }}
          >
            Design Guidelines
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginHorizontal: -6,
              alignItems: "stretch",
            }}
          >
            {designerSections.map((section) => (
              <View
                key={section.id}
                style={{
                  flex: 1,
                  minWidth: isMobile ? "48%" : "32%",
                  maxWidth: isMobile ? "48%" : "32%",
                  paddingHorizontal: 6,
                  marginBottom: 12,
                }}
              >
                <TouchableOpacity
                  onPress={() => router.push(section.route as any)}
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    minHeight: 140,
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: `${section.color}20`,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    <MaterialIcons
                      name={section.icon as any}
                      size={24}
                      color={section.color}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 4,
                    }}
                  >
                    {section.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {section.description}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Links */}
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 24,
            }}
          >
            Quick Links
          </Text>
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <View style={{ gap: 16 }}>
              {[
                {
                  title: "Brand Guidelines",
                  description: "Learn about our brand identity and voice",
                  icon: "badge",
                  link: "/designer/brand-identity",
                },
                {
                  title: "Color Palette",
                  description: "Explore our complete design system",
                  icon: "palette",
                  link: "/designer/color-palette",
                },
                {
                  title: "Component Library",
                  description: "Browse reusable components and patterns",
                  icon: "widgets",
                  link: "/designer/components",
                },
              ].map((link, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => router.push(link.link as any)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 16,
                    borderBottomWidth: index < 2 ? 1 : 0,
                    borderBottomColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <MaterialIcons
                    name={link.icon as any}
                    size={20}
                    color="#ba9988"
                    style={{ marginRight: 16 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      {link.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      {link.description}
                    </Text>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    color="rgba(255, 255, 255, 0.5)"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default function DesignerDashboard() {
  return <DesignerDashboardContent />;
}
