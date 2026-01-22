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

export default function GroupEconomics() {
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
          title="Group Economics"
          subtitle="Understanding how circulating Black dollars creates lasting economic impact"
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
                Group economics is a time-honored practice of keeping money circulating within our community. When Black dollars stay in Black hands, they create jobs, build wealth, and strengthen neighborhoods. This principle has been central to Black economic empowerment throughout history.
              </Text>

              {/* Main Content */}
              <View style={{ gap: 40 }}>
                <View>
                  <Text
                    style={{
                      fontSize: isMobile ? 28 : 36,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 16,
                    }}
                  >
                    What is Group Economics?
                  </Text>
                  <Text
                    style={{
                      fontSize: isMobile ? 16 : 18,
                      color: "rgba(255, 255, 255, 0.8)",
                      lineHeight: isMobile ? 26 : 30,
                    }}
                  >
                    Group economics, also known as cooperative economics or collective economics, is the practice of circulating money within a community to maximize its economic impact. Instead of dollars leaving the community after a single transaction, group economics ensures that money continues to flow between community members, businesses, and institutions, creating a multiplier effect.
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
                    Historical Examples
                  </Text>
                  <Text
                    style={{
                      fontSize: isMobile ? 16 : 18,
                      color: "rgba(255, 255, 255, 0.8)",
                      lineHeight: isMobile ? 26 : 30,
                      marginBottom: 16,
                    }}
                  >
                    One of the most famous examples of group economics in action was Black Wall Street in Tulsa, Oklahoma. In the early 1900s, the Greenwood District was one of the wealthiest Black communities in America, with dollars circulating multiple times within the community before leaving.
                  </Text>
                  <Text
                    style={{
                      fontSize: isMobile ? 16 : 18,
                      color: "rgba(255, 255, 255, 0.8)",
                      lineHeight: isMobile ? 26 : 30,
                    }}
                  >
                    Today, we see successful examples of group economics in various forms: credit unions, cooperative businesses, and platforms like BDN that facilitate community economic circulation.
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
                    The Multiplier Effect
                  </Text>
                  <Text
                    style={{
                      fontSize: isMobile ? 16 : 18,
                      color: "rgba(255, 255, 255, 0.8)",
                      lineHeight: isMobile ? 26 : 30,
                      marginBottom: 24,
                    }}
                  >
                    When dollars circulate within a community, each dollar can create 2-3 times its original value:
                  </Text>
                  <View style={{ gap: 16 }}>
                    {[
                      {
                        step: "1",
                        title: "Consumer spends $100 at Black business",
                        description: "The business receives $100 in revenue",
                      },
                      {
                        step: "2",
                        title: "Business pays employee or supplier",
                        description: "That $100 circulates to another community member",
                      },
                      {
                        step: "3",
                        title: "Employee spends at another Black business",
                        description: "The cycle continues, multiplying the economic impact",
                      },
                    ].map((item, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          gap: 16,
                          backgroundColor: "rgba(71, 71, 71, 0.4)",
                          borderRadius: 16,
                          padding: 20,
                          borderWidth: 1,
                          borderColor: "rgba(186, 153, 136, 0.3)",
                        }}
                      >
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: "#ba9988",
                            alignItems: "center",
                            justifyContent: "center",
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
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: "600",
                              color: "#ffffff",
                              marginBottom: 4,
                            }}
                          >
                            {item.title}
                          </Text>
                          <Text
                            style={{
                              fontSize: 15,
                              color: "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            {item.description}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
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
                    How BDN Facilitates Group Economics
                  </Text>
                  <Text
                    style={{
                      fontSize: isMobile ? 16 : 18,
                      color: "rgba(255, 255, 255, 0.8)",
                      lineHeight: isMobile ? 26 : 30,
                      marginBottom: 24,
                    }}
                  >
                    BDN makes it easy to practice group economics:
                  </Text>
                  <View style={{ gap: 16 }}>
                    {[
                      "Discover Black-owned businesses easily",
                      "Track how your dollars circulate in the community",
                      "See the multiplier effect of your spending",
                      "Connect with businesses that reinvest in the community",
                      "Build lasting economic relationships",
                    ].map((item, index) => (
                      <View key={index} style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                        <MaterialIcons name="check-circle" size={24} color="#ba9988" />
                        <Text
                          style={{
                            fontSize: 16,
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

                <View>
                  <Text
                    style={{
                      fontSize: isMobile ? 28 : 36,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 16,
                    }}
                  >
                    Real-World Impact
                  </Text>
                  <Text
                    style={{
                      fontSize: isMobile ? 16 : 18,
                      color: "rgba(255, 255, 255, 0.8)",
                      lineHeight: isMobile ? 26 : 30,
                    }}
                  >
                    When communities practice group economics effectively, we see:
                  </Text>
                  <View
                    style={{
                      flexDirection: isMobile ? "column" : "row",
                      gap: 24,
                      marginTop: 24,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: "rgba(71, 71, 71, 0.4)",
                        borderRadius: 16,
                        padding: 24,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.3)",
                      }}
                    >
                      <MaterialIcons name="work" size={32} color="#ba9988" style={{ marginBottom: 12 }} />
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "600",
                          color: "#ffffff",
                          marginBottom: 8,
                        }}
                      >
                        Job Creation
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        More dollars in the community means more jobs and opportunities
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: "rgba(71, 71, 71, 0.4)",
                        borderRadius: 16,
                        padding: 24,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.3)",
                      }}
                    >
                      <MaterialIcons name="trending-up" size={32} color="#ba9988" style={{ marginBottom: 12 }} />
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "600",
                          color: "#ffffff",
                          marginBottom: 8,
                        }}
                      >
                        Wealth Building
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        Businesses grow, property values increase, and wealth accumulates
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: "rgba(71, 71, 71, 0.4)",
                        borderRadius: 16,
                        padding: 24,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.3)",
                      }}
                    >
                      <MaterialIcons name="home" size={32} color="#ba9988" style={{ marginBottom: 12 }} />
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "600",
                          color: "#ffffff",
                          marginBottom: 8,
                        }}
                      >
                        Stronger Communities
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        Thriving businesses create vibrant, self-sufficient neighborhoods
                      </Text>
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
                Start Practicing Group Economics Today
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
                Join BDN and be part of the movement building economic power through group economics.
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
