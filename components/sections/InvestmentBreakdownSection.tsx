import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions, Linking } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";
import { LinearGradient } from "expo-linear-gradient";

const INVESTMENTS = [
  {
    percentage: "40%",
    title: "Infrastructure Development",
    items: [
      "Advanced app rebuild and redesign",
      "BlackOWNDemand platform integration",
      "Enhanced user experience features",
      "Scalable technology architecture",
    ],
  },
  {
    percentage: "25%",
    title: "Community Outreach",
    items: [
      "Legacy merchant VIP programs",
      "Educational resources and training",
      "Community engagement initiatives",
      "Partnership development",
    ],
  },
  {
    percentage: "20%",
    title: "Marketing & Growth",
    items: [
      "Global expansion campaigns",
      "Brand awareness initiatives",
      "Social media engagement",
      "Influencer partnerships",
    ],
  },
  {
    percentage: "15%",
    title: "Operations & Support",
    items: [
      "Customer service enhancement",
      "Quality assurance",
      "Legal and compliance",
      "Administrative costs",
    ],
  },
];

export const InvestmentBreakdownSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <ScrollAnimatedView delay={200}>
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
          {/* Section Header */}
          <View
            style={{
              marginBottom: isMobile ? 40 : 48,
              alignItems: "center",
            }}
          >
            {/* Badge */}
            <View
              style={{
                backgroundColor: "rgba(186, 153, 136, 0.15)",
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: "#ba9988",
                  letterSpacing: 1,
                }}
              >
                PROJECT UNITY
              </Text>
            </View>
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
              Transparent, Strategic Giving
            </Text>
            <Text
              style={{
                fontSize: isMobile ? 16 : 18,
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
                maxWidth: 800,
                lineHeight: isMobile ? 26 : 30,
              }}
            >
              Every donation is an investment in community transformation. Here's
              exactly how your contribution drives meaningful change:
            </Text>
          </View>

          {/* Investment Grid - Percentage-based layout */}
          {isMobile ? (
            // Mobile: Stack vertically
            <View style={{ gap: 20 }}>
              {INVESTMENTS.map((investment, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: "rgba(71, 71, 71, 0.4)",
                    borderRadius: 20,
                    padding: 24,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.3)",
                  }}
                >
                  {/* Percentage */}
                  <Text
                    style={{
                      fontSize: 48,
                      fontWeight: "800",
                      color: "#ba9988",
                      marginBottom: 12,
                    }}
                  >
                    {investment.percentage}
                  </Text>

                  {/* Title */}
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 20,
                      letterSpacing: -0.5,
                    }}
                  >
                    {investment.title}
                  </Text>

                  {/* Items List */}
                  <View style={{ gap: 12 }}>
                    {investment.items.map((item, itemIndex) => (
                      <View
                        key={itemIndex}
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-start",
                          gap: 12,
                        }}
                      >
                        <View
                          style={{
                            marginTop: 6,
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: "#ba9988",
                          }}
                        />
                        <Text
                          style={{
                            flex: 1,
                            fontSize: 15,
                            color: "rgba(255, 255, 255, 0.8)",
                            lineHeight: 24,
                          }}
                        >
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            // Desktop: Grid layout based on percentages - compact version
            <View
              style={{
                flexDirection: "row",
                gap: 16,
                alignItems: "stretch",
              }}
            >
              {/* Left Column: 40% Infrastructure - stretches to match right column height */}
              <View
                style={{
                  flex: 0.4,
                  backgroundColor: "rgba(71, 71, 71, 0.4)",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                }}
              >
                {/* First Row: Text Content */}
                <View>
                  <Text
                    style={{
                      fontSize: 52,
                      fontWeight: "800",
                      color: "#ba9988",
                      marginBottom: 8,
                    }}
                  >
                    {INVESTMENTS[0].percentage}
                  </Text>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 16,
                      letterSpacing: -0.5,
                    }}
                  >
                    {INVESTMENTS[0].title}
                  </Text>
                  <View style={{ gap: 10 }}>
                    {INVESTMENTS[0].items.map((item, itemIndex) => (
                      <View
                        key={itemIndex}
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-start",
                          gap: 10,
                        }}
                      >
                        <View
                          style={{
                            marginTop: 5,
                            width: 5,
                            height: 5,
                            borderRadius: 2.5,
                            backgroundColor: "#ba9988",
                          }}
                        />
                        <Text
                          style={{
                            flex: 1,
                            fontSize: 14,
                            color: "rgba(255, 255, 255, 0.8)",
                            lineHeight: 20,
                          }}
                        >
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
                {/* Second Row: Image - fills remaining space */}
                <View style={{ marginTop: 20, borderRadius: 12, overflow: "hidden", flex: 1, minHeight: 0 }}>
                  <Image
                    source={require("@/assets/images/public/impact-business-owner.png")}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                  />
                </View>
              </View>

              {/* Right Column: Stacked cards (25%, 20%, 15%) */}
              <View style={{ flex: 0.6, gap: 16 }}>
                {/* 25% Community Outreach */}
                <View
                  style={{
                    backgroundColor: "rgba(71, 71, 71, 0.4)",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.3)",
                    flexDirection: "row",
                    gap: 16,
                  }}
                >
                  {/* First Column: Text Content */}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 52,
                        fontWeight: "800",
                        color: "#ba9988",
                        marginBottom: 8,
                      }}
                    >
                      {INVESTMENTS[1].percentage}
                    </Text>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 16,
                        letterSpacing: -0.5,
                      }}
                    >
                      {INVESTMENTS[1].title}
                    </Text>
                    <View style={{ gap: 10 }}>
                      {INVESTMENTS[1].items.map((item, itemIndex) => (
                        <View
                          key={itemIndex}
                          style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            gap: 10,
                          }}
                        >
                          <View
                            style={{
                              marginTop: 5,
                              width: 5,
                              height: 5,
                              borderRadius: 2.5,
                              backgroundColor: "#ba9988",
                            }}
                          />
                          <Text
                            style={{
                              flex: 1,
                              fontSize: 14,
                              color: "rgba(255, 255, 255, 0.8)",
                              lineHeight: 20,
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  {/* Second Column: Image */}
                  <View style={{ flex: 1, borderRadius: 12, overflow: "hidden" }}>
                    <Image
                      source={require("@/assets/images/public/hero-professional.png")}
                      style={{
                        width: "100%",
                        height: "100%",
                        minHeight: 140,
                      }}
                      contentFit="cover"
                      cachePolicy="memory-disk"
                    />
                  </View>
                </View>

                {/* Bottom Row: 20% and 15% side by side */}
                <View style={{ flexDirection: "row", gap: 16 }}>
                  {/* 20% Marketing & Growth */}
                  <View
                    style={{
                      flex: 0.5714, // 20/35 = 0.5714 of remaining 35%
                      backgroundColor: "rgba(71, 71, 71, 0.4)",
                      borderRadius: 16,
                      padding: 20,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.3)",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 52,
                        fontWeight: "800",
                        color: "#ba9988",
                        marginBottom: 8,
                      }}
                    >
                      {INVESTMENTS[2].percentage}
                    </Text>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 16,
                        letterSpacing: -0.5,
                      }}
                    >
                      {INVESTMENTS[2].title}
                    </Text>
                    <View style={{ gap: 10 }}>
                      {INVESTMENTS[2].items.map((item, itemIndex) => (
                        <View
                          key={itemIndex}
                          style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            gap: 10,
                          }}
                        >
                          <View
                            style={{
                              marginTop: 5,
                              width: 5,
                              height: 5,
                              borderRadius: 2.5,
                              backgroundColor: "#ba9988",
                            }}
                          />
                          <Text
                            style={{
                              flex: 1,
                              fontSize: 14,
                              color: "rgba(255, 255, 255, 0.8)",
                              lineHeight: 20,
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* 15% Operations & Support */}
                  <View
                    style={{
                      flex: 0.4286, // 15/35 = 0.4286 of remaining 35%
                      backgroundColor: "rgba(71, 71, 71, 0.4)",
                      borderRadius: 16,
                      padding: 20,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.3)",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 52,
                        fontWeight: "800",
                        color: "#ba9988",
                        marginBottom: 8,
                      }}
                    >
                      {INVESTMENTS[3].percentage}
                    </Text>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 16,
                        letterSpacing: -0.5,
                      }}
                    >
                      {INVESTMENTS[3].title}
                    </Text>
                    <View style={{ gap: 10 }}>
                      {INVESTMENTS[3].items.map((item, itemIndex) => (
                        <View
                          key={itemIndex}
                          style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            gap: 10,
                          }}
                        >
                          <View
                            style={{
                              marginTop: 5,
                              width: 5,
                              height: 5,
                              borderRadius: 2.5,
                              backgroundColor: "#ba9988",
                            }}
                          />
                          <Text
                            style={{
                              flex: 1,
                              fontSize: 14,
                              color: "rgba(255, 255, 255, 0.8)",
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
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollAnimatedView>
  );
};

// Separate CTA Section Component - Full Width Bleed
export const ProjectUnityCTASection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <ScrollAnimatedView delay={400}>
      <View
        style={{
          position: "relative",
          minHeight: isMobile ? 400 : 500,
          backgroundColor: "#1a1a1a",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {/* Background Image */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.3,
            zIndex: 0,
          }}
        >
          <Image
            source={require("@/assets/images/public/impact-business-owner.png")}
            style={{
              width: "100%",
              height: "100%",
            }}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
          <LinearGradient
            colors={["rgba(35, 35, 35, 0.8)", "rgba(35, 35, 35, 0.95)"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        </View>

        {/* Top Gradient Overlay - Blends with section above */}
        <LinearGradient
          colors={["#232323", "rgba(35, 35, 35, 0.8)", "transparent"]}
          locations={[0, 0.3, 1]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: isMobile ? 120 : 150,
            zIndex: 1,
          }}
        />

        {/* Content */}
        <View
          style={{
            paddingHorizontal: isMobile ? 20 : 40,
            paddingTop: isMobile ? 60 : 80,
            paddingBottom: isMobile ? 60 : 100,
            position: "relative",
            zIndex: 2,
            maxWidth: 1200,
            alignSelf: "center",
            width: "100%",
          }}
        >
          <View style={{ alignItems: "center" }}>
            {/* Icon */}
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                backgroundColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <MaterialIcons name="local-florist" size={32} color="#ba9988" />
            </View>
            {/* Heading */}
            <Text
              style={{
                fontSize: isMobile ? 28 : 40,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 16,
                textAlign: "center",
                letterSpacing: -0.5,
              }}
            >
              Your contribution is not just a donation—{"\n"}
              it's sowing a seed into our collective future!
            </Text>

            {/* Description */}
            <Text
              style={{
                fontSize: isMobile ? 16 : 18,
                color: "rgba(255, 255, 255, 0.8)",
                textAlign: "center",
                lineHeight: isMobile ? 24 : 28,
                maxWidth: isMobile ? "100%" : 900,
                marginBottom: 32,
              }}
            >
              Join us in making a difference. Your donation will help create the
              change you wish to see.
            </Text>

            {/* CTA Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => Linking.openURL("https://www.zeffy.com/en-US/peer-to-peer/donate-to-project-unity")}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Support Project Unity"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{
                backgroundColor: "#ba9988",
                paddingHorizontal: isMobile ? 40 : 48,
                paddingVertical: isMobile ? 16 : 18,
                borderRadius: 14,
                minWidth: isMobile ? "100%" : 280,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 8,
                shadowColor: "#ba9988",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
                elevation: 8,
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  fontSize: isMobile ? 16 : 18,
                  fontWeight: "700",
                  color: "#ffffff",
                  letterSpacing: 0.5,
                }}
              >
                Support Project Unity
              </Text>
              <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
            </TouchableOpacity>

            {/* Tax Deductible Note */}
            <Text
              style={{
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                maxWidth: 600,
                lineHeight: 20,
              }}
            >
              All donations are made to Black Dollar Movement, Inc., a registered
              501(c)(3) nonprofit organization.
              
              {"\n"}
              Your donation is fully
              tax-deductible.
            </Text>
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};
