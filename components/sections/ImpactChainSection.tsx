import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";
import { LinearGradient } from "expo-linear-gradient";

const CHAIN_STEPS = [
  {
    step: 1,
    icon: "business",
    description: "Stronger businesses lead to more jobs in the community",
  },
  {
    step: 2,
    icon: "account-balance-wallet",
    description: "More jobs create higher community income",
  },
  {
    step: 3,
    icon: "home",
    description: "Higher income leads to more stable households",
  },
  {
    step: 4,
    icon: "people",
    description: "Stable households lead to healthier families",
  },
  {
    step: 5,
    icon: "star",
    description: "Healthier families lead to stronger communities",
  },
];

export const ImpactChainSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <ScrollAnimatedView delay={500}>
      <View
        style={{
          position: "relative",
          minHeight: isMobile ? 600 : 700,
          backgroundColor: "#232323",
        }}
      >
        {/* Background Image */}
        <View
          style={{
            position: "absolute",
            top: isMobile ? 0 : -100,
            left: 0,
            right: 0,
            bottom: isMobile ? 0 : -100,
            opacity: 0.2,
          }}
        >
          <Image
            source={require("@/assets/images/public/cta-community-family.png")}
            style={{
              width: "100%",
              height: "100%",
            }}
            contentFit="cover"
            contentPosition="center"
            cachePolicy="memory-disk"
          />
          <LinearGradient
            colors={["rgba(35, 35, 35, 1)", "rgba(35, 35, 35, 0.96)", "rgba(35, 35, 35, 0.8)", "rgba(35, 35, 35, 0.5)", "rgba(35, 35, 35, 0.5)", "rgba(35, 35, 35, 0.8)", "rgba(35, 35, 35, 0.96)", "rgba(35, 35, 35, 1)"]}
            locations={[0, 0.1, 0.2, 0.35, 0.65, 0.8, 0.9, 1]}
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
            paddingTop: isMobile ? 60 : 180,
            paddingBottom: isMobile ? 60 : 80,
            position: "relative",
            zIndex: 1,
          }}
        >
          <View
            style={{
              maxWidth: 1200,
              alignSelf: "center",
              width: "100%",
            }}
          >
            {/* Header */}
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
                  CORRECTIVE ECONOMICS
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
                Transform Black Economic Power
              </Text>
              <Text
                style={{
                  fontSize: isMobile ? 16 : 18,
                  color: "rgba(255, 255, 255, 0.8)",
                  textAlign: "center",
                  maxWidth: 800,
                  lineHeight: isMobile ? 26 : 30,
                }}
              >
                Create the most comprehensive ecosystem for Black-owned businesses
                and consumers, fostering generational wealth through technology,
                community, and collective economic action.
              </Text>
            </View>

            {/* Chain Steps */}
            <View
              style={{
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "stretch" : "center",
                justifyContent: "space-between",
                gap: isMobile ? 24 : 16,
                flexWrap: "wrap",
              }}
            >
              {CHAIN_STEPS.map((item, index) => (
                <React.Fragment key={index}>
                  {/* Chain Item */}
                  <View
                    style={{
                      flex: isMobile ? 1 : 0,
                      minWidth: isMobile ? "100%" : 150,
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    {/* Step Number */}
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: "#ba9988",
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 3,
                        borderColor: "#ffffff",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "800",
                          color: "#ffffff",
                        }}
                      >
                        {item.step}
                      </Text>
                    </View>

                    {/* Description */}
                    <Text
                      style={{
                        fontSize: isMobile ? 14 : 15,
                        color: "rgba(255, 255, 255, 0.9)",
                        textAlign: "center",
                        lineHeight: 22,
                        fontWeight: "500",
                      }}
                    >
                      {item.description}
                    </Text>

                    {/* Icon */}
                    <View
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 16,
                        backgroundColor: "rgba(186, 153, 136, 0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MaterialIcons
                        name={item.icon as any}
                        size={32}
                        color="#ba9988"
                      />
                    </View>
                  </View>

                  {/* Arrow Connector */}
                  {index < CHAIN_STEPS.length - 1 && (
                    <View
                      style={{
                        width: isMobile ? "100%" : 40,
                        height: isMobile ? 40 : 2,
                        alignItems: "center",
                        justifyContent: "center",
                        marginVertical: isMobile ? 0 : 24,
                      }}
                    >
                      {isMobile ? (
                        <MaterialIcons
                          name="arrow-downward"
                          size={32}
                          color="rgba(186, 153, 136, 0.5)"
                        />
                      ) : (
                        <MaterialIcons
                          name="arrow-forward"
                          size={32}
                          color="rgba(186, 153, 136, 0.5)"
                        />
                      )}
                    </View>
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};
