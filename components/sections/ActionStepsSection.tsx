import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions, Linking } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

const BUSINESS_ACTIONS = [
  "Visit blackowndemand.com",
  "List your business TODAY",
  "Access exclusive VIP merchant benefits",
  "Prepare for BDN 2.0 app launch",
  "Legacy BDN Business: Claim your business",
];

const COMMUNITY_ACTIONS = [
  "Explore BlackOWNDemand platform",
  "Patronize Black-owned businesses",
  "Share with your network",
  "Join our social media communities",
  "Support Project Unity",
];

export const ActionStepsSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const handleBusinessCTA = () => {
    Linking.openURL("https://blackowndemand.com");
  };

  const handleCommunityCTA = () => {
    Linking.openURL("https://www.zeffy.com/en-US/peer-to-peer/donate-to-project-unity");
  };

  return (
    <ScrollAnimatedView delay={700}>
      <View
        style={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingVertical: isMobile ? 60 : 80,
          backgroundColor: "#1a1a1a",
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
                textAlign: "center",
                letterSpacing: -0.5,
              }}
            >
              Take Action
            </Text>
          </View>

          {/* Action Cards Grid */}
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              gap: 24,
            }}
          >
            {/* For Businesses Card */}
            <View
              style={{
                flex: 1,
                backgroundColor: "#474747",
                borderRadius: 20,
                padding: isMobile ? 24 : 32,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: "rgba(186, 153, 136, 0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons name="store" size={24} color="#ba9988" />
                </View>
                <Text
                  style={{
                    fontSize: isMobile ? 24 : 28,
                    fontWeight: "700",
                    color: "#ffffff",
                    letterSpacing: -0.5,
                  }}
                >
                  For Black-Owned Businesses
                </Text>
              </View>

              <View style={{ gap: 16, marginBottom: 32 }}>
                {BUSINESS_ACTIONS.map((action, index) => (
                  <View
                    key={index}
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
                      {action}
                    </Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                onPress={handleBusinessCTA}
                activeOpacity={0.8}
                style={{
                  backgroundColor: "rgba(186, 153, 136, 0.2)",
                  borderWidth: 2,
                  borderColor: "#ba9988",
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: "#ba9988",
                  }}
                >
                  Get Started
                </Text>
              </TouchableOpacity>
            </View>

            {/* For Community Card */}
            <View
              style={{
                flex: 1,
                backgroundColor: "#474747",
                borderRadius: 20,
                padding: isMobile ? 24 : 32,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: "rgba(186, 153, 136, 0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons name="people" size={24} color="#ba9988" />
                </View>
                <Text
                  style={{
                    fontSize: isMobile ? 24 : 28,
                    fontWeight: "700",
                    color: "#ffffff",
                    letterSpacing: -0.5,
                  }}
                >
                  For Community Members
                </Text>
              </View>

              <View style={{ gap: 16, marginBottom: 32 }}>
                {COMMUNITY_ACTIONS.map((action, index) => (
                  <View
                    key={index}
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
                      {action}
                    </Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                onPress={handleCommunityCTA}
                activeOpacity={0.8}
                style={{
                  backgroundColor: "#ba9988",
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  shadowColor: "#ba9988",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 12,
                  elevation: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  Support Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};
