import React from "react";
import { View, Text, ScrollView, useWindowDimensions, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from '@/constants/theme';

function ColorPalettePage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const colorSwatches = [
    {
      name: "Primary",
      color: colors.primary,
      hex: colors.primary,
      usage: "Main brand color, primary actions",
    },
    {
      name: "Accent",
      color: colors.accent,
      hex: colors.accent,
      usage: "Secondary actions, highlights",
    },
    {
      name: "Success",
      color: colors.success,
      hex: colors.success,
      usage: "Success states, confirmations",
    },
    {
      name: "Error",
      color: colors.error,
      hex: colors.error,
      usage: "Error states, warnings",
    },
    {
      name: "Warning",
      color: colors.warning,
      hex: colors.warning,
      usage: "Warning messages, alerts",
    },
    {
      name: "Info",
      color: colors.info,
      hex: colors.info,
      usage: "Informational messages",
    },
    {
      name: "Background",
      color: colors.background,
      hex: colors.background,
      usage: "Main background color",
    },
    {
      name: "Secondary",
      color: colors.secondary,
      hex: colors.secondary,
      usage: "Card backgrounds, borders",
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
            Color Palette
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 24,
            }}
          >
            Our color system provides a consistent visual language across the platform.
          </Text>
        </View>

        {/* Color Swatches */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Primary Colors
          </Text>
          <View style={{ gap: 12 }}>
            {colorSwatches.map((swatch, index) => (
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
                      width: 60,
                      height: 60,
                      borderRadius: 12,
                      backgroundColor: swatch.color,
                      borderWidth: swatch.color === colors.background ? 1 : 0,
                      borderColor: "#474747",
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
                      {swatch.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                        fontFamily: "monospace",
                      }}
                    >
                      {swatch.hex.toUpperCase()}
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
                  {swatch.usage}
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
                  Contrast Ratios
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Maintain WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text). Test all color combinations for accessibility.
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
                  Dark Mode
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Our platform uses a dark theme (#232323 background). Ensure all text maintains proper contrast on dark backgrounds.
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
                  Color Combinations
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Use primary colors for main actions, accent for secondary actions. Status colors (success, error, warning, info) should be used sparingly and only for their intended purposes.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Text Colors */}
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Text Colors
          </Text>
          <View style={{ gap: 12 }}>
            {[
              {
                name: "Primary Text",
                color: colors.text.primary,
                hex: colors.text.primary,
                usage: "Main body text, headings",
              },
              {
                name: "Secondary Text",
                color: colors.text.secondary,
                hex: colors.text.secondary,
                usage: "Supporting text, captions",
              },
              {
                name: "Tertiary Text",
                color: colors.text.tertiary,
                hex: colors.text.tertiary,
                usage: "Muted text, placeholders",
              },
            ].map((textColor, index) => (
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
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      backgroundColor: textColor.color,
                      marginRight: 12,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      {textColor.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.7)",
                        fontFamily: "monospace",
                      }}
                    >
                      {textColor.hex.toUpperCase()}
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
                  {textColor.usage}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default ColorPalettePage;
