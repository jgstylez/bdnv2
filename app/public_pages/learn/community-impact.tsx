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

export default function CommunityImpact() {
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
          title="Community Impact"
          subtitle="Real-world examples of how supporting Black businesses creates lasting economic impact"
        />

        {/* Impact Stats */}
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
              <Text
                style={{
                  fontSize: isMobile ? 32 : 44,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 48,
                  textAlign: "center",
                  letterSpacing: -0.5,
                }}
              >
                BDN Platform Impact
              </Text>
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  flexWrap: "wrap",
                  gap: 24,
                  marginBottom: 60,
                }}
              >
                {[
                  { value: "$2M+", label: "Dollars Circulated", icon: "attach-money" },
                  { value: "10K+", label: "Active Members", icon: "people" },
                  { value: "500+", label: "Black Businesses", icon: "store" },
                  { value: "50+", label: "Cities Nationwide", icon: "location-city" },
                ].map((stat, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      minWidth: isMobile ? "100%" : "45%",
                      backgroundColor: "rgba(35, 35, 35, 0.4)",
                      borderRadius: 20,
                      padding: isMobile ? 24 : 32,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.3)",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 16,
                        backgroundColor: "rgba(186, 153, 136, 0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                      }}
                    >
                      <MaterialIcons name={stat.icon as any} size={32} color="#ba9988" />
                    </View>
                    <Text
                      style={{
                        fontSize: isMobile ? 40 : 56,
                        fontWeight: "800",
                        color: "#ba9988",
                        marginBottom: 8,
                      }}
                    >
                      {stat.value}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: "rgba(255, 255, 255, 0.7)",
                        textAlign: "center",
                      }}
                    >
                      {stat.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Success Stories */}
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
                maxWidth: 1000,
                alignSelf: "center",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: isMobile ? 32 : 44,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 48,
                  textAlign: "center",
                  letterSpacing: -0.5,
                }}
              >
                Success Stories
              </Text>
              <View style={{ gap: 32 }}>
                {[
                  {
                    title: "Restaurant Owner Sees 40% Growth",
                    description: "A Black-owned restaurant in Atlanta joined BDN and saw a 40% increase in customers within the first three months. The owner credits the platform's ability to connect them with engaged consumers who value supporting Black businesses.",
                    impact: "40% customer growth",
                  },
                  {
                    title: "Tech Startup Raises $500K",
                    description: "A Black tech startup used BDN to build community support and validate their product. The platform helped them connect with early adopters and eventually raise $500K in seed funding.",
                    impact: "$500K raised",
                  },
                  {
                    title: "Community Revitalization Project",
                    description: "In Detroit, a group of BDN businesses collaborated on a community revitalization project. Together, they created jobs, improved the neighborhood, and demonstrated the power of group economics.",
                    impact: "50+ jobs created",
                  },
                ].map((story, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: "rgba(35, 35, 35, 0.4)",
                      borderRadius: 24,
                      padding: isMobile ? 24 : 32,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.3)",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 16,
                      }}
                    >
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                          backgroundColor: "#ba9988",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MaterialIcons name="star" size={24} color="#ffffff" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: isMobile ? 20 : 24,
                            fontWeight: "700",
                            color: "#ffffff",
                            marginBottom: 4,
                          }}
                        >
                          {story.title}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#ba9988",
                            fontWeight: "600",
                          }}
                        >
                          Impact: {story.impact}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 16,
                        color: "rgba(255, 255, 255, 0.8)",
                        lineHeight: 26,
                      }}
                    >
                      {story.description}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* How to Measure Impact */}
        <ScrollAnimatedView delay={600}>
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
                  fontSize: isMobile ? 32 : 44,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 24,
                  textAlign: "center",
                  letterSpacing: -0.5,
                }}
              >
                How to Measure Your Impact
              </Text>
              <Text
                style={{
                  fontSize: isMobile ? 16 : 18,
                  color: "rgba(255, 255, 255, 0.7)",
                  textAlign: "center",
                  marginBottom: 40,
                  maxWidth: 700,
                  alignSelf: "center",
                }}
              >
                BDN provides tools to track and measure your economic impact in real-time.
              </Text>
              <View style={{ gap: 20 }}>
                {[
                  {
                    icon: "analytics",
                    title: "Track Your Spending",
                    description: "See exactly how much you've spent with Black businesses and where your dollars are going.",
                  },
                  {
                    icon: "trending-up",
                    title: "Monitor Circulation",
                    description: "Watch how your dollars circulate in the community and create multiplier effects.",
                  },
                  {
                    icon: "public",
                    title: "View Community Stats",
                    description: "See aggregate impact metrics for your city, region, and the entire BDN community.",
                  },
                  {
                    icon: "workspace-premium",
                    title: "Earn Impact Badges",
                    description: "Unlock badges and achievements as you reach impact milestones.",
                  },
                ].map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      gap: 16,
                      backgroundColor: "rgba(35, 35, 35, 0.4)",
                      borderRadius: 16,
                      padding: 20,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.3)",
                    }}
                  >
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        backgroundColor: "rgba(186, 153, 136, 0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MaterialIcons name={item.icon as any} size={28} color="#ba9988" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "600",
                          color: "#ffffff",
                          marginBottom: 8,
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          color: "rgba(255, 255, 255, 0.7)",
                          lineHeight: 22,
                        }}
                      >
                        {item.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* CTA Section */}
        <ScrollAnimatedView delay={800}>
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
                backgroundColor: "rgba(35, 35, 35, 0.4)",
                borderRadius: 24,
                padding: isMobile ? 32 : 48,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.3)",
                alignItems: "center",
                marginBottom: 40,
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
                Join the Movement
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
                Be part of building economic power and creating lasting change in Black communities.
              </Text>
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  gap: 16,
                }}
              >
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
                <TouchableOpacity
                  onPress={() => router.push("/pages/merchant/onboarding")}
                  style={{
                    borderWidth: 2,
                    borderColor: "#ba9988",
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
                      color: "#ba9988",
                    }}
                  >
                    List Your Business
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        <Footer />
      </OptimizedScrollView>
    </View>
  );
}
