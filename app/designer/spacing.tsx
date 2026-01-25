import React from "react";
import { View, Text, ScrollView, useWindowDimensions, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { spacing } from '@/constants/theme';

function SpacingPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const spacingScale = [
    { name: "xs", value: spacing.xs, usage: "Tight spacing, icon padding" },
    { name: "sm", value: spacing.sm, usage: "Small gaps, compact layouts" },
    { name: "md", value: spacing.md, usage: "Default spacing, standard gaps" },
    { name: "lg", value: spacing.lg, usage: "Section spacing, larger gaps" },
    { name: "xl", value: spacing.xl, usage: "Major sections, page margins" },
    { name: "2xl", value: spacing["2xl"], usage: "Large sections, page padding" },
    { name: "3xl", value: spacing["3xl"], usage: "Extra large spacing" },
    { name: "4xl", value: spacing["4xl"], usage: "Maximum spacing, hero sections" },
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
            Spacing System
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 24,
            }}
          >
            A consistent spacing scale based on a 4px base unit for harmonious layouts.
          </Text>
        </View>

        {/* Spacing Scale */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Spacing Scale
          </Text>
          <View style={{ gap: 12 }}>
            {spacingScale.map((item, index) => (
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
                  <View
                    style={{
                      width: item.value,
                      height: 24,
                      backgroundColor: "#ba9988",
                      borderRadius: 4,
                      marginRight: 16,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      {item.name.toUpperCase()}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ba9988",
                        fontFamily: "monospace",
                      }}
                    >
                      {item.value}px
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
                  {item.usage}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Usage Guidelines */}
        <View style={{ marginBottom: 32 }}>
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
                  Base Unit
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Our spacing system uses a 4px base unit. All spacing values are multiples of 4px for consistency and easy calculation.
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
                  Padding vs Margin
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Use padding for internal spacing within components. Use margin for external spacing between components. Maintain consistent spacing relationships.
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
                  Grouping
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Group related elements with smaller spacing (xs, sm). Separate distinct sections with larger spacing (lg, xl, 2xl).
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Grid System */}
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Grid System
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
                  Desktop Grid
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  12-column grid system for desktop layouts (≥1024px). Columns have consistent gutters using md (16px) spacing.
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
                  Mobile Grid
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Single column layout for mobile (less than 768px) with consistent horizontal padding (md or lg spacing).
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
                  Container Widths
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Content containers use max-width constraints with responsive padding. Maintain consistent margins on all sides.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default SpacingPage;
