import React from "react";
import { View, Text, ScrollView, useWindowDimensions, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from '@/constants/theme';

function BrandIdentityPage() {
  const { width } = useWindowDimensions();
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
            Brand Identity Guide
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 24,
            }}
          >
            The "soul" and "voice" of our company. This guide ensures consistent brand recognition across all marketing materials, social media, and print.
          </Text>
        </View>

        {/* Core Brand Strategy */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Core Brand Strategy
          </Text>
          
          {/* Mission */}
          <View style={{ marginBottom: 16 }}>
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
                <MaterialIcons name="flag" size={24} color="#ba9988" style={{ marginRight: 12 }} />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  Mission
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.9)",
                  lineHeight: 24,
                }}
              >
                To educate, equip, and empower Black entrepreneurs and business owners by providing a comprehensive platform that connects communities, facilitates commerce, and drives economic empowerment.
              </Text>
            </View>
          </View>

          {/* Vision */}
          <View style={{ marginBottom: 16 }}>
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
                <MaterialIcons name="visibility" size={24} color="#ba9988" style={{ marginRight: 12 }} />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  Vision
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.9)",
                  lineHeight: 24,
                }}
              >
                To become the leading platform for Black economic empowerment, creating a thriving ecosystem where Black businesses flourish and communities prosper.
              </Text>
            </View>
          </View>

          {/* Brand Personality */}
          <View style={{ marginBottom: 16 }}>
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
                <MaterialIcons name="person" size={24} color="#ba9988" style={{ marginRight: 12 }} />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  Brand Personality
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
                Professional yet approachable, inspiring yet practical. We are:
              </Text>
              <View style={{ gap: 8 }}>
                {["Empowering", "Supportive", "Innovative", "Authentic", "Community-focused"].map((trait, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingLeft: 8,
                    }}
                  >
                    <MaterialIcons name="check-circle" size={16} color="#ba9988" style={{ marginRight: 8 }} />
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.9)",
                      }}
                    >
                      {trait}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Values */}
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 12,
              }}
            >
              Core Values
            </Text>
            <View style={{ gap: 12 }}>
              {[
                {
                  title: "Empowerment",
                  description: "We believe in empowering Black businesses and communities through education, resources, and opportunities.",
                  icon: "trending-up",
                },
                {
                  title: "Community",
                  description: "Building strong, supportive networks that foster collaboration and mutual growth.",
                  icon: "groups",
                },
                {
                  title: "Excellence",
                  description: "Committed to delivering exceptional quality in everything we do.",
                  icon: "star",
                },
                {
                  title: "Innovation",
                  description: "Embracing new technologies and creative solutions to solve real-world challenges.",
                  icon: "lightbulb",
                },
              ].map((value, index) => (
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
                    <MaterialIcons name={value.icon as any} size={20} color="#ba9988" style={{ marginRight: 12 }} />
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: "#ffffff",
                      }}
                    >
                      {value.title}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                      lineHeight: 20,
                      paddingLeft: 32,
                    }}
                  >
                    {value.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Logo Guidelines */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Logo Guidelines
          </Text>
          
          {/* Primary Logo */}
          <View style={{ marginBottom: 16 }}>
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
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 12,
                }}
              >
                Primary Logo
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                  lineHeight: 20,
                  marginBottom: 12,
                }}
              >
                The primary logo is our main brand mark. Use it as the default in all applications.
              </Text>
              <View style={{ gap: 8 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ba9988",
                    marginBottom: 4,
                  }}
                >
                  Usage
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Use on light backgrounds, marketing materials, and as the main brand identifier.
                </Text>
              </View>
            </View>
          </View>

          {/* Secondary Marks */}
          <View style={{ marginBottom: 16 }}>
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
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 12,
                }}
              >
                Secondary Marks & Submarks
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                  lineHeight: 20,
                  marginBottom: 12,
                }}
              >
                Alternative logo variations for specific use cases, including icon-only versions and horizontal layouts.
              </Text>
              <View style={{ gap: 8 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ba9988",
                    marginBottom: 4,
                  }}
                >
                  When to Use
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Use secondary marks when space is limited or when the primary logo doesn't fit the layout. Use submarks (icons) for favicons, app icons, and social media profiles.
                </Text>
              </View>
            </View>
          </View>

          {/* Clear Space */}
          <View style={{ marginBottom: 16 }}>
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
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 12,
                }}
              >
                Clear Space Requirements
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                  lineHeight: 20,
                  marginBottom: 12,
                }}
              >
                Maintain adequate "breathing room" around the logo. The minimum clear space equals the height of the letter "B" in our logo.
              </Text>
              <View style={{ gap: 8 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ba9988",
                    marginBottom: 4,
                  }}
                >
                  Rule
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Never place text, images, or other elements within the clear space area. This ensures the logo remains legible and maintains its impact.
                </Text>
              </View>
            </View>
          </View>

          {/* Logo Don'ts */}
          <View>
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
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 12,
                }}
              >
                Logo Don'ts
              </Text>
              <View style={{ gap: 12 }}>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ff4444",
                      marginBottom: 4,
                    }}
                  >
                    ✗ Don't Stretch or Distort
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                      lineHeight: 20,
                    }}
                  >
                    Always maintain the logo's aspect ratio. Never stretch, compress, or skew the logo.
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ff4444",
                      marginBottom: 4,
                    }}
                  >
                    ✗ Don't Change Colors
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                      lineHeight: 20,
                    }}
                  >
                    Use only approved color variations. Don't recolor, add gradients, or apply filters to the logo.
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ff4444",
                      marginBottom: 4,
                    }}
                  >
                    ✗ Don't Add Effects
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                      lineHeight: 20,
                    }}
                  >
                    Never add drop shadows, outlines, glows, or other visual effects to the logo.
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ff4444",
                      marginBottom: 4,
                    }}
                  >
                    ✗ Don't Use on Busy Backgrounds
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                      lineHeight: 20,
                    }}
                  >
                    Ensure sufficient contrast. Use the appropriate logo version (light or dark) based on background.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Brand Color Palette */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Brand Color Palette
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
              Our brand colors create emotional connection and recognition. Use these colors consistently across all marketing materials.
            </Text>
            <View style={{ gap: 16 }}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 12,
                  }}
                >
                  Primary Brand Color
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 12,
                      backgroundColor: colors.accent,
                      marginRight: 16,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      Accent Brown
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#ba9988",
                        fontFamily: "monospace",
                        marginBottom: 2,
                      }}
                    >
                      HEX: {colors.accent.toUpperCase()}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.7)",
                        fontFamily: "monospace",
                      }}
                    >
                      RGB: rgb(186, 153, 136)
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 12,
                  }}
                >
                  Secondary Colors
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Use supporting colors from our color palette for backgrounds, text, and accents. Refer to the Color Palette page for complete specifications including CMYK values for print materials.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Brand Typography */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Brand Typography
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
                  Primary Brand Font
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 4,
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
                  Our primary typeface for digital and print. Use Inter for all headings, body text, and UI elements.
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
                  Font Hierarchy
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Use bold weights (700-900) for headlines and important messaging. Regular weight (400) for body text. Maintain consistent sizing relationships across all materials.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Imagery & Photography Style */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Imagery & Photography Style
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
              Our photography style reflects our brand personality: authentic, empowering, and community-focused.
            </Text>
            <View style={{ gap: 12 }}>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ba9988",
                    marginBottom: 4,
                  }}
                >
                  Style Guidelines
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Use candid, authentic moments that showcase real people and real businesses. Avoid overly staged or corporate stock photography.
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ba9988",
                    marginBottom: 4,
                  }}
                >
                  Color Treatment
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Maintain natural, vibrant colors. Avoid heavy filters or desaturation. Images should feel warm and inviting.
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ba9988",
                    marginBottom: 4,
                  }}
                >
                  Composition
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Focus on people, community, and business success. Show diversity, collaboration, and empowerment in action.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Voice and Tone */}
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Voice and Tone
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
              Our brand voice is authentic, supportive, and empowering. We communicate with clarity and warmth, always focusing on the positive impact we can create together.
            </Text>
            <View style={{ gap: 16 }}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ba9988",
                    marginBottom: 8,
                  }}
                >
                  Tone
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Professional yet approachable, inspiring yet practical. We speak with confidence but remain accessible.
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ba9988",
                    marginBottom: 8,
                  }}
                >
                  Style Guidelines
                </Text>
                <View style={{ gap: 8 }}>
                  <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ba9988",
                        marginRight: 8,
                      }}
                    >
                      •
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: 20,
                        flex: 1,
                      }}
                    >
                      Use contractions to sound friendly and approachable
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ba9988",
                        marginRight: 8,
                      }}
                    >
                      •
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: 20,
                        flex: 1,
                      }}
                    >
                      Write in active voice for clarity and impact
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ba9988",
                        marginRight: 8,
                      }}
                    >
                      •
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: 20,
                        flex: 1,
                      }}
                    >
                      Avoid jargon and technical terms when possible
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ba9988",
                        marginRight: 8,
                      }}
                    >
                      •
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: 20,
                        flex: 1,
                      }}
                    >
                      Focus on benefits and positive outcomes
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ba9988",
                        marginRight: 8,
                      }}
                    >
                      •
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: 20,
                        flex: 1,
                      }}
                    >
                      Use emojis sparingly and only in appropriate contexts (social media, informal communications)
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default BrandIdentityPage;
