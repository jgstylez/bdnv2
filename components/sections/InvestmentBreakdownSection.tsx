import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions, Linking, Image } from "react-native";
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

          {/* Investment Grid */}
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              flexWrap: isMobile ? "wrap" : "nowrap",
              gap: 20,
            }}
          >
            {INVESTMENTS.map((investment, index) => (
              <View
                key={index}
                style={{
                  flex: isMobile ? 1 : 1,
                  minWidth: isMobile ? "100%" : 0,
                  backgroundColor: "#474747",
                  borderRadius: 20,
                  padding: isMobile ? 24 : 28,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                {/* Percentage */}
                <Text
                  style={{
                    fontSize: isMobile ? 48 : 64,
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
                    fontSize: isMobile ? 22 : 26,
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
        </View>

        {/* CTA Section - Full Width */}
        <View
          style={{
            position: "relative",
            minHeight: isMobile ? 400 : 500,
            backgroundColor: "#1a1a1a",
            borderRadius: 0,
            overflow: "hidden",
            marginTop: isMobile ? 60 : 80,
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
            }}
          >
            <Image
              source={require("@/assets/images/public/cta-community-family.png")}
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

          {/* Content */}
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingTop: isMobile ? 60 : 80,
              paddingBottom: isMobile ? 40 : 50,
              position: "relative",
              zIndex: 1,
              maxWidth: 1200,
              alignSelf: "center",
              width: "100%",
            }}
          >
            <View style={{ alignItems: "center" }}>
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
                  maxWidth: 700,
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
                501(c)(3) nonprofit organization. Your donation is fully
                tax-deductible.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};
