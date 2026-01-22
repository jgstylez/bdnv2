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
import { FintechFeaturesSection } from '@/components/sections/FintechFeaturesSection';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

export default function ForConsumers() {
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
          title="Support Black Businesses, Earn Rewards, Build Economic Power"
          subtitle="Join 10K+ members circulating Black dollars and unlocking exclusive benefits"
          showVideo={true}
          videoUrl=""
          videoTitle="See How BDN Works for Consumers"
        />

        {/* CTA Section */}
        <ScrollAnimatedView delay={100}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingVertical: isMobile ? 40 : 60,
              backgroundColor: "#232323",
            }}
          >
            <View
              style={{
                maxWidth: 1000,
                alignSelf: "center",
                width: "100%",
                flexDirection: isMobile ? "column" : "row",
                gap: 16,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => router.push("/(auth)/signup")}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Get started for free"
                accessibilityHint="Double tap to sign up for a free account"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{
                  backgroundColor: "#ba9988",
                  paddingHorizontal: isMobile ? 40 : 48,
                  paddingVertical: isMobile ? 16 : 18,
                  borderRadius: 14,
                  minWidth: isMobile ? "100%" : 200,
                  minHeight: 44,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: isMobile ? 16 : 18,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  Get Started Free
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/web/features")}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="View platform features"
                accessibilityHint="Double tap to view all platform features"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{
                  borderWidth: 2,
                  borderColor: "#ba9988",
                  paddingHorizontal: isMobile ? 40 : 48,
                  paddingVertical: isMobile ? 16 : 18,
                  borderRadius: 14,
                  minWidth: isMobile ? "100%" : 200,
                  minHeight: 44,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: isMobile ? 16 : 18,
                    fontWeight: "600",
                    color: "#ba9988",
                  }}
                >
                  View Features
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Black Spending Power Education Section */}
        <ScrollAnimatedView delay={200}>
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
              <View style={{ alignItems: "center", marginBottom: isMobile ? 40 : 60 }}>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    backgroundColor: "rgba(186, 153, 136, 0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                  }}
                >
                  <MaterialIcons name="trending-up" size={32} color="#ba9988" />
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
                  Your Spending Power Matters
                </Text>
                <Text
                  style={{
                    fontSize: isMobile ? 16 : 18,
                    color: "rgba(255, 255, 255, 0.7)",
                    textAlign: "center",
                    maxWidth: 700,
                    lineHeight: 26,
                  }}
                >
                  Black spending power exceeds $1.6 trillion annually. When we circulate dollars within our community, each dollar multiplies, creating lasting economic impact.
                </Text>
              </View>

              {/* Statistics */}
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  gap: 24,
                  marginBottom: 40,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(71, 71, 71, 0.6)",
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
                    backgroundColor: "rgba(71, 71, 71, 0.6)",
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
                    2-3x
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "rgba(255, 255, 255, 0.7)",
                      textAlign: "center",
                    }}
                  >
                    Multiplier Effect When Dollars Stay in Community
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => router.push("/web/learn/black-spending-power")}
                style={{
                  backgroundColor: "#ba9988",
                  paddingVertical: 16,
                  borderRadius: 12,
                  alignItems: "center",
                  alignSelf: "center",
                  minWidth: 200,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  Learn More About Black Spending Power →
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Benefits Section */}
        <ScrollAnimatedView delay={400}>
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
                Why Join BDN?
              </Text>
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  flexWrap: "wrap",
                  gap: 24,
                }}
              >
                {[
                  {
                    icon: "star",
                    title: "Earn Points & Cashback",
                    description: "Get rewarded for every purchase. Earn points and cashback on all your transactions with Black businesses.",
                  },
                  {
                    icon: "workspace-premium",
                    title: "Level Up Through Tiers",
                    description: "Progress from Basic to Black Diamond. Unlock exclusive benefits, discounts, and community recognition.",
                  },
                  {
                    icon: "analytics",
                    title: "Track Your Impact",
                    description: "See how your spending circulates in the community. Monitor your economic impact in real-time.",
                  },
                  {
                    icon: "event",
                    title: "Access Exclusive Events",
                    description: "Get early access to community events, workshops, and exclusive deals from Black businesses.",
                  },
                ].map((benefit, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      minWidth: isMobile ? "100%" : "45%",
                      backgroundColor: "rgba(71, 71, 71, 0.6)",
                      borderRadius: 20,
                      padding: isMobile ? 24 : 32,
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
                        marginBottom: 20,
                      }}
                    >
                      <MaterialIcons name={benefit.icon as any} size={28} color="#ba9988" />
                    </View>
                    <Text
                      style={{
                        fontSize: isMobile ? 24 : 28,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 12,
                        letterSpacing: -0.5,
                      }}
                    >
                      {benefit.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: 24,
                      }}
                    >
                      {benefit.description}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* How It Works */}
        <ScrollAnimatedView delay={600}>
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
                How It Works
              </Text>
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  gap: 24,
                }}
              >
                {[
                  {
                    step: "1",
                    title: "Sign Up & Create Profile",
                    description: "Join BDN in minutes. Create your profile and start your journey to economic empowerment.",
                  },
                  {
                    step: "2",
                    title: "Discover & Support",
                    description: "Find Black-owned businesses in your area. Shop, dine, and support with ease.",
                  },
                  {
                    step: "3",
                    title: "Earn & Track Impact",
                    description: "Earn rewards on every purchase. Watch your impact grow as dollars circulate in the community.",
                  },
                ].map((step, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        backgroundColor: "#ba9988",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 24,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 32,
                          fontWeight: "800",
                          color: "#ffffff",
                        }}
                      >
                        {step.step}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: isMobile ? 20 : 24,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 12,
                        textAlign: "center",
                      }}
                    >
                      {step.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "rgba(255, 255, 255, 0.7)",
                        textAlign: "center",
                        lineHeight: 24,
                      }}
                    >
                      {step.description}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Group Economics Deep Dive */}
        <ScrollAnimatedView delay={800}>
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
              <View style={{ alignItems: "center", marginBottom: isMobile ? 40 : 60 }}>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    backgroundColor: "rgba(186, 153, 136, 0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                  }}
                >
                  <MaterialIcons name="diamond" size={32} color="#ba9988" />
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
                  The Power of Group Economics
                </Text>
                <Text
                  style={{
                    fontSize: isMobile ? 16 : 18,
                    color: "rgba(255, 255, 255, 0.7)",
                    textAlign: "center",
                    maxWidth: 700,
                    lineHeight: 26,
                    marginBottom: 40,
                  }}
                >
                  Group economics is the practice of circulating dollars within our community, creating a multiplier effect that strengthens Black economic power.
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: "rgba(71, 71, 71, 0.6)",
                  borderRadius: 24,
                  padding: isMobile ? 24 : 40,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                  marginBottom: 32,
                }}
              >
                <View style={{ gap: 20 }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 12,
                      }}
                    >
                      What is Group Economics?
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: "rgba(255, 255, 255, 0.8)",
                        lineHeight: 26,
                      }}
                    >
                      Group economics is a time-honored practice of keeping money circulating within our community. When Black dollars stay in Black hands, they create jobs, build wealth, and strengthen neighborhoods.
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 12,
                      }}
                    >
                      How BDN Facilitates Group Economics
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: "rgba(255, 255, 255, 0.8)",
                        lineHeight: 26,
                      }}
                    >
                      BDN makes it easy to discover and support Black businesses. Every transaction on our platform circulates dollars within the community, creating measurable economic impact.
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => router.push("/web/learn/group-economics")}
                style={{
                  backgroundColor: "#ba9988",
                  paddingVertical: 16,
                  borderRadius: 12,
                  alignItems: "center",
                  alignSelf: "center",
                  minWidth: 200,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  Learn More About Group Economics →
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Fintech Features */}
        <FintechFeaturesSection />

        {/* BDN+ Subscription Upsell */}
        <ScrollAnimatedView delay={1000}>
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
                  marginBottom: 16,
                  textAlign: "center",
                  letterSpacing: -0.5,
                }}
              >
                Unlock Premium Benefits with BDN+
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
                Get enhanced cashback, advanced analytics, exclusive events, and priority support.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/web/pricing")}
                style={{
                  backgroundColor: "#ba9988",
                  paddingVertical: 16,
                  borderRadius: 12,
                  alignItems: "center",
                  alignSelf: "center",
                  minWidth: 200,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  View Pricing →
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Educational Resources CTA */}
        <ScrollAnimatedView delay={1200}>
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
                backgroundColor: "rgba(71, 71, 71, 0.6)",
                borderRadius: 24,
                padding: isMobile ? 32 : 48,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.3)",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="menu-book" size={48} color="#ba9988" style={{ marginBottom: 24 }} />
              <Text
                style={{
                  fontSize: isMobile ? 28 : 36,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                Learn More About Black Economic Power
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.7)",
                  textAlign: "center",
                  marginBottom: 32,
                  maxWidth: 600,
                }}
              >
                Explore our educational resources on Black spending power, group economics, and community impact.
              </Text>
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  gap: 16,
                  width: "100%",
                  maxWidth: 600,
                }}
              >
                <TouchableOpacity
                  onPress={() => router.push("/web/learn")}
                  style={{
                    flex: 1,
                    backgroundColor: "#ba9988",
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    Browse Resources
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/pages/university")}
                  style={{
                    flex: 1,
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
                    BDN University
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Final CTA */}
        <ScrollAnimatedView delay={1400}>
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
                Start Your Journey Today
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
                Join thousands of members building economic power and creating lasting change in Black communities.
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
