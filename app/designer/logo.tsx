import React from "react";
import { View, Text, ScrollView, useWindowDimensions, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";

function LogoPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const logoVariations = [
    {
      name: "Primary Logo",
      description: "Full-color logo for light backgrounds",
      usage: "Primary brand representation on light backgrounds",
      color: "#ba9988",
    },
    {
      name: "Logo Mark",
      description: "Icon-only version for small spaces",
      usage: "Favicons, app icons, social media profile images",
      color: "#ba9988",
    },
    {
      name: "Wordmark",
      description: "Text-only version",
      usage: "When logo mark is not suitable, horizontal layouts",
      color: "#ba9988",
    },
    {
      name: "Monochrome",
      description: "Single-color version",
      usage: "Single-color printing, embossing, engraving",
      color: "#ffffff",
    },
    {
      name: "Reversed",
      description: "White logo for dark backgrounds",
      usage: "Dark backgrounds, overlays on images",
      color: "#ffffff",
    },
  ];

  const logoSizes = [
    { size: "16px", usage: "Favicon, smallest applications" },
    { size: "24px", usage: "Mobile app icons, small UI elements" },
    { size: "32px", usage: "Standard UI elements, navigation" },
    { size: "48px", usage: "Headers, medium displays" },
    { size: "64px", usage: "Large displays, hero sections" },
    { size: "128px+", usage: "Print materials, large format displays" },
  ];

  const dosAndDonts = {
    dos: [
      "Maintain minimum clear space around the logo (equal to the height of the 'B' in the wordmark)",
      "Use the full-color version on light backgrounds",
      "Use the reversed version on dark backgrounds",
      "Maintain proper aspect ratio when scaling",
      "Ensure sufficient contrast for accessibility",
    ],
    donts: [
      "Don't stretch or distort the logo",
      "Don't rotate the logo",
      "Don't add effects like shadows, gradients, or outlines",
      "Don't place the logo on busy backgrounds",
      "Don't use colors other than the approved palette",
      "Don't recreate or modify the logo",
    ],
  };

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
            Logo Guidelines
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 24,
            }}
          >
            Our logo is the visual cornerstone of our brand identity. These guidelines ensure consistent and proper usage across all applications.
          </Text>
        </View>

        {/* Logo Variations */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Logo Variations
          </Text>
          
          {logoVariations.map((variation, index) => (
            <View key={index} style={{ marginBottom: 16 }}>
              <View
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 24,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                  <MaterialIcons name="auto-awesome" size={24} color={variation.color} style={{ marginRight: 12 }} />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#ffffff",
                    }}
                  >
                    {variation.name}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: 8,
                  }}
                >
                  {variation.description}
                </Text>
                <View
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 8,
                    padding: 16,
                    marginTop: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 80,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.5)",
                      fontStyle: "italic",
                    }}
                  >
                    [Logo Preview Placeholder]
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: "#ba9988",
                      marginBottom: 4,
                    }}
                  >
                    Usage:
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    {variation.usage}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Minimum Size */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Minimum Size
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
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 24,
                marginBottom: 16,
              }}
            >
              The logo should never be displayed smaller than the minimum size to ensure readability and brand recognition.
            </Text>
            <View
              style={{
                backgroundColor: "#232323",
                borderRadius: 8,
                padding: 16,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: "#ba9988",
                  marginBottom: 8,
                }}
              >
                Minimum Size: 24px height
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.5)",
                  fontStyle: "italic",
                }}
              >
                [Minimum size preview]
              </Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              For digital applications, the minimum height is 24px. For print materials, the minimum height is 0.5 inches.
            </Text>
          </View>
        </View>

        {/* Clear Space */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Clear Space
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
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 24,
                marginBottom: 16,
              }}
            >
              Maintain clear space around the logo equal to the height of the 'B' in the wordmark. This ensures the logo stands out and maintains visual impact.
            </Text>
            <View
              style={{
                backgroundColor: "#232323",
                borderRadius: 8,
                padding: 16,
                alignItems: "center",
                justifyContent: "center",
                minHeight: 120,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.5)",
                  fontStyle: "italic",
                }}
              >
                [Clear space diagram]
              </Text>
            </View>
          </View>
        </View>

        {/* Logo Sizes */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Recommended Sizes
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
            {logoSizes.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  paddingVertical: 12,
                  borderBottomWidth: index < logoSizes.length - 1 ? 1 : 0,
                  borderBottomColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#ffffff",
                      marginBottom: 4,
                    }}
                  >
                    {item.size}
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

        {/* Do's and Don'ts */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Do's and Don'ts
          </Text>
          
          {/* Do's */}
          <View style={{ marginBottom: 16 }}>
            <View
              style={{
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: 24,
                borderWidth: 1,
                borderColor: "rgba(75, 184, 88, 0.3)",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                <MaterialIcons name="check-circle" size={24} color="#4caf50" style={{ marginRight: 12 }} />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  Do's
                </Text>
              </View>
              {dosAndDonts.dos.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    marginBottom: 12,
                    paddingLeft: 8,
                  }}
                >
                  <MaterialIcons name="check" size={16} color="#4caf50" style={{ marginRight: 8, marginTop: 2 }} />
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.9)",
                      flex: 1,
                      lineHeight: 20,
                    }}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Don'ts */}
          <View>
            <View
              style={{
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: 24,
                borderWidth: 1,
                borderColor: "rgba(255, 68, 68, 0.3)",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                <MaterialIcons name="cancel" size={24} color="#ff4444" style={{ marginRight: 12 }} />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  Don'ts
                </Text>
              </View>
              {dosAndDonts.donts.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    marginBottom: 12,
                    paddingLeft: 8,
                  }}
                >
                  <MaterialIcons name="close" size={16} color="#ff4444" style={{ marginRight: 8, marginTop: 2 }} />
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.9)",
                      flex: 1,
                      lineHeight: 20,
                    }}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* File Formats */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            File Formats
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
                  SVG
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: 4,
                  }}
                >
                  Vector format for web and scalable applications. Use for responsive designs and high-resolution displays.
                </Text>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: "rgba(186, 153, 136, 0.2)",
                }}
              />
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  PNG
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: 4,
                  }}
                >
                  Raster format with transparency. Available in @1x, @2x, and @3x for different screen densities.
                </Text>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: "rgba(186, 153, 136, 0.2)",
                }}
              />
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  PDF
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: 4,
                  }}
                >
                  Vector format for print materials. Use for business cards, letterheads, and marketing materials.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Usage Examples */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Usage Examples
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
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 24,
                marginBottom: 16,
              }}
            >
              The logo should be used consistently across all brand touchpoints. Here are some common applications:
            </Text>
            <View style={{ gap: 12 }}>
              {[
                "Website headers and footers",
                "Mobile app splash screens and icons",
                "Social media profile images and covers",
                "Email signatures and templates",
                "Business cards and letterheads",
                "Presentation slides and documents",
                "Marketing materials and advertisements",
                "Merchandise and promotional items",
              ].map((example, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: 8,
                  }}
                >
                  <MaterialIcons name="circle" size={6} color="#ba9988" style={{ marginRight: 12 }} />
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    {example}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Download Assets */}
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Download Assets
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
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 24,
                marginBottom: 16,
              }}
            >
              All logo assets are available in the brand asset library. Contact the design team for access or download the latest versions from the brand portal.
            </Text>
            <View
              style={{
                backgroundColor: "#232323",
                borderRadius: 8,
                padding: 16,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                  fontStyle: "italic",
                }}
              >
                Logo assets package includes:
              </Text>
              <View style={{ marginTop: 8, gap: 4 }}>
                {[
                  "All logo variations (SVG, PNG, PDF)",
                  "Multiple sizes and resolutions",
                  "Color and monochrome versions",
                  "Usage guidelines document",
                ].map((item, index) => (
                  <Text
                    key={index}
                    style={{
                      fontSize: 13,
                      color: "rgba(255, 255, 255, 0.6)",
                      paddingLeft: 12,
                    }}
                  >
                    • {item}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default LogoPage;
