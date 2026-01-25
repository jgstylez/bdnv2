import React from "react";
import { View, Text, ScrollView, useWindowDimensions, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { typography } from '@/constants/theme';

function TypographyPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const typeScale = [
    {
      name: "H1",
      size: typography.h1.fontSize,
      lineHeight: typography.h1.lineHeight,
      weight: "900",
      usage: "Main page titles, hero headings",
    },
    {
      name: "H2",
      size: typography.h2.fontSize,
      lineHeight: typography.h2.lineHeight,
      weight: "800",
      usage: "Section headings, major titles",
    },
    {
      name: "H3",
      size: typography.h3.fontSize,
      lineHeight: typography.h3.lineHeight,
      weight: "700",
      usage: "Subsection headings, card titles",
    },
    {
      name: "H4",
      size: typography.h4.fontSize,
      lineHeight: typography.h4.lineHeight,
      weight: "600",
      usage: "Small headings, labels",
    },
    {
      name: "Body",
      size: typography.body.fontSize,
      lineHeight: typography.body.lineHeight,
      weight: "400",
      usage: "Main content, paragraphs",
    },
    {
      name: "Caption",
      size: typography.caption.fontSize,
      lineHeight: typography.caption.lineHeight,
      weight: "400",
      usage: "Small text, captions, metadata",
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
            Typography
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 24,
            }}
          >
            Our typography system uses Inter font family with a consistent type scale for clear hierarchy and readability.
          </Text>
        </View>

        {/* Font Family */}
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
              <MaterialIcons name="text-fields" size={24} color="#ba9988" style={{ marginRight: 12 }} />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#ffffff",
                }}
              >
                Font Family
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 24,
                marginBottom: 12,
              }}
            >
              Inter
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: 20,
              }}
            >
              Inter is a versatile sans-serif typeface designed for digital screens. It provides excellent readability at all sizes and supports multiple weights from thin to black.
            </Text>
          </View>
        </View>

        {/* Type Scale */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Type Scale
          </Text>
          <View style={{ gap: 12 }}>
            {typeScale.map((style, index) => (
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
                <View style={{ marginBottom: 12 }}>
                  <Text
                    style={{
                      fontSize: style.size,
                      fontWeight: style.weight as any,
                      color: "#ffffff",
                      lineHeight: style.lineHeight,
                      marginBottom: 8,
                    }}
                  >
                    {style.name} - The quick brown fox jumps over the lazy dog
                  </Text>
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.5)",
                        marginBottom: 2,
                      }}
                    >
                      Size
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ba9988",
                        fontFamily: "monospace",
                      }}
                    >
                      {style.size}px
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.5)",
                        marginBottom: 2,
                      }}
                    >
                      Line Height
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ba9988",
                        fontFamily: "monospace",
                      }}
                    >
                      {style.lineHeight}px
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.5)",
                        marginBottom: 2,
                      }}
                    >
                      Weight
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ba9988",
                        fontFamily: "monospace",
                      }}
                    >
                      {style.weight}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  {style.usage}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Font Weights */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Font Weights
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
            <View style={{ gap: 12 }}>
              {[
                { weight: "400", name: "Regular", usage: "Body text, default weight" },
                { weight: "500", name: "Medium", usage: "Emphasized text" },
                { weight: "600", name: "Semi Bold", usage: "Labels, small headings" },
                { weight: "700", name: "Bold", usage: "Headings, important text" },
                { weight: "800", name: "Extra Bold", usage: "Large headings" },
                { weight: "900", name: "Black", usage: "Hero text, display headings" },
              ].map((item, index) => (
                <View key={index} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: item.weight as any,
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      {item.name} ({item.weight})
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      {item.usage}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
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
                  Hierarchy
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Use larger, bolder text for more important information. Maintain clear visual hierarchy with consistent type scale usage.
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
                  Readability
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Ensure sufficient line height for comfortable reading. Use appropriate font sizes for different screen sizes and contexts.
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
                  Consistency
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Stick to the defined type scale. Avoid arbitrary font sizes. Use semantic HTML elements and consistent styling patterns.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default TypographyPage;
