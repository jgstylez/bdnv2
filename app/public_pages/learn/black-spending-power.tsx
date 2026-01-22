import React from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PublicHeroSection } from '@/components/layouts/PublicHeroSection';
import { ScrollAnimatedView } from '@/components/ScrollAnimatedView';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

export default function BlackSpendingPower() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isMobile = width < 768;

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <Navigation />
      <OptimizedScrollView
        showBackToTop={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: isMobile ? insets.bottom : 0,
        }}
      >
        <PublicHeroSection
          title="Black Spending Power"
          subtitle="Understanding the $1.6+ trillion in annual Black spending power and its impact"
        />

        {/* Introduction */}
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
                maxWidth: 1000,
                alignSelf: "center",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: isMobile ? 16 : 18,
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: isMobile ? 26 : 30,
                  marginBottom: 40,
                }}
              >
                Black spending power represents one of the largest economic forces in the United States. With over $1.6 trillion in annual purchasing power, Black consumers have the ability to drive significant economic change when spending decisions are made intentionally.
              </Text>

              {/* Key Statistics */}
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  gap: 24,
                  marginBottom: 60,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(71, 71, 71, 0.4)",
                    borderRadius: 20,
                    padding: isMobile ? 24 : 32,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.3)",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: isMobile ? 48 : 64,
                      fontWeight: "800",
                      color: "#ba9988",
                      marginBottom: 8,
                    }}
                  >
                    $1.6T+
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "rgba(255, 255, 255, 0.7)",
                      textAlign: "center",
                    }}
                  >
                    Annual Black Spending Power
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(71, 71, 71, 0.4)",
                    borderRadius: 20,
                    padding: isMobile ? 24 : 32,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.3)",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: isMobile ? 48 : 64,
                      fontWeight: "800",
                      color: "#ba9988",
                      marginBottom: 8,
                    }}
                  >
                    5.4%
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "rgba(255, 255, 255, 0.7)",
                      textAlign: "center",
                    }}
                  >
                    Annual Growth Rate
                  </Text>
                </View>
              </View>

              {/* Main Content */}
              <View style={{ gap: 32 }}>
                <View>
                  <Text
                    style={{
                      fontSize: isMobile ? 28 : 36,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 16,
                    }}
                  >
                    What is Black Spending Power?
                  </Text>
                  <Text
                    style={{
                      fontSize: isMobile ? 16 : 18,
                      color: "rgba(255, 255, 255, 0.8)",
                      lineHeight: isMobile ? 26 : 30,
                    }}
                  >
                    Black spending power refers to the total purchasing power of Black consumers in the United States. This includes spending on goods, services, housing, education, and more. Despite representing approximately 13% of the U.S. population, Black consumers control over $1.6 trillion in annual spending power—a figure that continues to grow year over year.
                  </Text>
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: isMobile ? 28 : 36,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 16,
                    }}
                  >
                    Historical Context
                  </Text>
                  <Text
                    style={{
                      fontSize: isMobile ? 16 : 18,
                      color: "rgba(255, 255, 255, 0.8)",
                      lineHeight: isMobile ? 26 : 30,
                    }}
                  >
                    Black spending power has grown significantly over the past decades, driven by population growth, increased educational attainment, and rising incomes. However, the impact of this spending power has often been limited by systemic barriers and the lack of infrastructure to circulate dollars within Black communities.
                  </Text>
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: isMobile ? 28 : 36,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 16,
                    }}
                  >
                    The Impact of Spending Decisions
                  </Text>
                  <Text
                    style={{
                      fontSize: isMobile ? 16 : 18,
                      color: "rgba(255, 255, 255, 0.8)",
                      lineHeight: isMobile ? 26 : 30,
                    }}
                  >
                    Every spending decision matters. When Black dollars are intentionally directed toward Black-owned businesses, they create a multiplier effect. Each dollar can circulate 2-3 times within the community, creating jobs, supporting other businesses, and building wealth. This is the foundation of group economics.
                  </Text>
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: isMobile ? 28 : 36,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 16,
                    }}
                  >
                    How to Maximize Your Impact
                  </Text>
                  <View style={{ gap: 16 }}>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <MaterialIcons name="check-circle" size={24} color="#ba9988" />
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "600",
                            color: "#ffffff",
                            marginBottom: 4,
                          }}
                        >
                          Use BDN to Discover Black Businesses
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,
                            color: "rgba(255, 255, 255, 0.7)",
                            lineHeight: 22,
                          }}
                        >
                          Our platform makes it easy to find Black-owned businesses in your area and online.
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <MaterialIcons name="check-circle" size={24} color="#ba9988" />
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "600",
                            color: "#ffffff",
                            marginBottom: 4,
                          }}
                        >
                          Track Your Spending Impact
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,
                            color: "rgba(255, 255, 255, 0.7)",
                            lineHeight: 22,
                          }}
                        >
                          Monitor how your spending circulates in the community and see your economic impact grow.
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <MaterialIcons name="check-circle" size={24} color="#ba9988" />
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "600",
                            color: "#ffffff",
                            marginBottom: 4,
                          }}
                        >
                          Share with Your Network
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,
                            color: "rgba(255, 255, 255, 0.7)",
                            lineHeight: 22,
                          }}
                        >
                          Encourage friends and family to support Black businesses and amplify the impact.
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* CTA Section */}
        <ScrollAnimatedView delay={400}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingVertical: isMobile ? 60 : 80,
              backgroundColor: "#1a1a1a",
            }}
          >
            <View
              style={{
                maxWidth: 800,
                alignSelf: "center",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: isMobile ? 32 : 44,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 24,
                  textAlign: "center",
                  letterSpacing: -0.5,
                }}
              >
                Ready to Make an Impact?
              </Text>
              <Text
                style={{
                  fontSize: isMobile ? 16 : 18,
                  color: "rgba(255, 255, 255, 0.7)",
                  textAlign: "center",
                  marginBottom: 40,
                  maxWidth: 600,
                }}
              >
                Join BDN and start tracking your economic impact while supporting Black businesses.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/signup")}
                style={{
                  backgroundColor: "#ba9988",
                  paddingHorizontal: 48,
                  paddingVertical: 18,
                  borderRadius: 14,
                  minWidth: 200,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  Get Started Free
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollAnimatedView>

        <Footer />
      </OptimizedScrollView>
    </View>
  );
}
