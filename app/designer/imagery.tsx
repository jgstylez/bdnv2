import React from "react";
import { View, Text, ScrollView, useWindowDimensions, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";

function ImageryPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const imageTypes = [
    {
      type: "Photography",
      description: "High-quality photographs that represent our brand values and community",
      guidelines: [
        "Use authentic, diverse imagery that reflects our community",
        "Maintain consistent lighting and color grading",
        "Ensure subjects are well-composed and engaging",
        "Avoid overly staged or stock-photo aesthetics",
      ],
    },
    {
      type: "Illustrations",
      description: "Custom illustrations that complement our visual identity",
      guidelines: [
        "Match the style and tone of our brand",
        "Use consistent line weights and color palettes",
        "Ensure illustrations are scalable and clear",
        "Maintain visual harmony with photography",
      ],
    },
    {
      type: "Graphics",
      description: "Graphic elements, patterns, and visual assets",
      guidelines: [
        "Use brand colors consistently",
        "Maintain appropriate contrast for accessibility",
        "Ensure graphics work at various sizes",
        "Follow spacing and alignment guidelines",
      ],
    },
  ];

  const imageSpecs = [
    {
      usage: "Hero Images",
      dimensions: "1920x1080px",
      format: "JPG/PNG",
      aspectRatio: "16:9",
      description: "Full-width hero sections and banners",
    },
    {
      usage: "Card Images",
      dimensions: "800x600px",
      format: "JPG/PNG",
      aspectRatio: "4:3",
      description: "Images for cards and content blocks",
    },
    {
      usage: "Thumbnails",
      dimensions: "400x400px",
      format: "JPG/PNG",
      aspectRatio: "1:1",
      description: "Square thumbnails and avatars",
    },
    {
      usage: "Icons & Logos",
      dimensions: "512x512px",
      format: "SVG/PNG",
      aspectRatio: "1:1",
      description: "Scalable vector graphics and logos",
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
            Imagery
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 24,
            }}
          >
            Guidelines for photography, illustrations, and visual assets that represent our brand.
          </Text>
        </View>

        {/* Image Types */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Image Types
          </Text>
          <View style={{ gap: 12 }}>
            {imageTypes.map((item, index) => (
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
                  <MaterialIcons name="photo-library" size={24} color="#ba9988" style={{ marginRight: 12 }} />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#ffffff",
                    }}
                  >
                    {item.type}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                    marginBottom: 16,
                  }}
                >
                  {item.description}
                </Text>
                <View style={{ gap: 8 }}>
                  {item.guidelines.map((guideline, gIndex) => (
                    <View
                      key={gIndex}
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                      }}
                    >
                      <MaterialIcons
                        name="check-circle"
                        size={16}
                        color="#ba9988"
                        style={{ marginRight: 8, marginTop: 2 }}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          color: "rgba(255, 255, 255, 0.7)",
                          lineHeight: 20,
                          flex: 1,
                        }}
                      >
                        {guideline}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Image Specifications */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Image Specifications
          </Text>
          <View style={{ gap: 12 }}>
            {imageSpecs.map((spec, index) => (
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
                  {spec.usage}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                    marginBottom: 12,
                  }}
                >
                  {spec.description}
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                  <View
                    style={{
                      backgroundColor: "rgba(186, 153, 136, 0.15)",
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: "#ba9988",
                        marginBottom: 2,
                      }}
                    >
                      Dimensions
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ffffff",
                      }}
                    >
                      {spec.dimensions}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "rgba(186, 153, 136, 0.15)",
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: "#ba9988",
                        marginBottom: 2,
                      }}
                    >
                      Format
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ffffff",
                      }}
                    >
                      {spec.format}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "rgba(186, 153, 136, 0.15)",
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: "#ba9988",
                        marginBottom: 2,
                      }}
                    >
                      Aspect Ratio
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ffffff",
                      }}
                    >
                      {spec.aspectRatio}
                    </Text>
                  </View>
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
                  Quality Standards
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  All images must be high-resolution and optimized for web. Use compression tools to reduce file size while maintaining visual quality. Ensure images are sharp and properly exposed.
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
                  Brand Consistency
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Maintain consistent visual style across all imagery. Use brand colors and filters consistently. Ensure all images align with our brand values and messaging.
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
                  Accessibility
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Always include descriptive alt text for images. Ensure sufficient contrast between text overlays and images. Consider colorblind users when selecting imagery.
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
                  Performance
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Optimize images for fast loading. Use appropriate formats (WebP when possible, fallback to JPG/PNG). Implement lazy loading for images below the fold. Consider responsive image sizes for different devices.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default ImageryPage;
