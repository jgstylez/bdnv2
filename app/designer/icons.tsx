import React from "react";
import { View, Text, ScrollView, useWindowDimensions, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";

function IconsPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const iconSizes = [
    { size: 16, usage: "Inline icons, small badges" },
    { size: 20, usage: "Default icon size, navigation items" },
    { size: 24, usage: "Standard icons, buttons" },
    { size: 32, usage: "Large icons, feature highlights" },
    { size: 48, usage: "Extra large icons, hero sections" },
  ];

  const iconCategories = [
    {
      name: "Navigation",
      icons: ["home", "dashboard", "menu", "arrow-back", "arrow-forward"],
      description: "Icons for navigation and wayfinding",
    },
    {
      name: "Actions",
      icons: ["add", "edit", "delete", "save", "close", "check"],
      description: "Icons for user actions and interactions",
    },
    {
      name: "Status",
      icons: ["check-circle", "error", "warning", "info", "notifications"],
      description: "Icons for status indicators and alerts",
    },
    {
      name: "Content",
      icons: ["image", "video", "article", "file", "folder"],
      description: "Icons for content types and media",
    },
  ];

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
        {/* Header */}
        <View style={{ marginBottom: 32, paddingTop: 20 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            Iconography
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 24,
            }}
          >
            Our icon system uses Material Icons for consistency and clarity across the platform.
          </Text>
        </View>

        {/* Icon Library */}
        <View style={{ marginBottom: 32 }}>
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <MaterialIcons name="image" size={24} color="#ba9988" style={{ marginRight: 12 }} />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#ffffff",
                }}
              >
                Icon Library
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 24,
              }}
            >
              We use Material Icons from @expo/vector-icons. This provides a comprehensive set of consistent, well-designed icons that work across all platforms.
            </Text>
          </View>
        </View>

        {/* Icon Sizes */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Icon Sizes
          </Text>
          <View style={{ gap: 12 }}>
            {iconSizes.map((item, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                  <MaterialIcons name="star" size={item.size} color="#ba9988" style={{ marginRight: 16 }} />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      {item.size}px
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: 20,
                      }}
                    >
                      {item.usage}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Icon Categories */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Icon Categories
          </Text>
          <View style={{ gap: 12 }}>
            {iconCategories.map((category, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  {category.name}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                    marginBottom: 12,
                  }}
                >
                  {category.description}
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                  {category.icons.map((iconName, iIndex) => (
                    <View
                      key={iIndex}
                      style={{
                        backgroundColor: "rgba(186, 153, 136, 0.15)",
                        borderRadius: 8,
                        padding: 12,
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 60,
                      }}
                    >
                      <MaterialIcons name={iconName as any} size={24} color="#ba9988" />
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Usage Guidelines */}
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Usage Guidelines
          </Text>
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <View style={{ gap: 16 }}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Consistency
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Use icons consistently. Don't mix icon styles or families. Stick to Material Icons for all UI elements.
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Size Guidelines
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Match icon size to text size. Icons should be slightly smaller than accompanying text. Use 20px for most UI elements, 24px for buttons and prominent features.
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Color
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Icons inherit text color by default. Use accent colors (#ba9988) for interactive icons. Ensure sufficient contrast for accessibility.
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Spacing
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Maintain consistent spacing around icons. Use sm (8px) spacing between icons and text. Group related icons with appropriate gaps.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default IconsPage;
