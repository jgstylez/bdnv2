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

export default function ForBusinesses() {
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
          title="Grow Your Black-Owned Business with BDN"
          subtitle="Join 500+ businesses reaching engaged consumers and growing revenue"
          showVideo={true}
          videoUrl=""
          videoTitle="See How BDN Works for Businesses"
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
                onPress={() => router.push("/pages/merchant/onboarding")}
                style={{
                  backgroundColor: "#ba9988",
                  paddingHorizontal: isMobile ? 40 : 48,
                  paddingVertical: isMobile ? 16 : 18,
                  borderRadius: 14,
                  minWidth: isMobile ? "100%" : 200,
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
                  List Your Business
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/public_pages/features")}
                style={{
                  borderWidth: 2,
                  borderColor: "#ba9988",
                  paddingHorizontal: isMobile ? 40 : 48,
                  paddingVertical: isMobile ? 16 : 18,
                  borderRadius: 14,
                  minWidth: isMobile ? "100%" : 200,
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
                  See Features
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Black Consumer Market Opportunity */}
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
                  Tap Into $1.6 Trillion in Black Spending Power
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
                  Black consumers are actively seeking Black-owned businesses. Join the platform where engaged consumers discover and support businesses like yours.
                </Text>
              </View>

              {/* Market Stats */}
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
                    backgroundColor: "#474747",
                    borderRadius: 20,
                    padding: isMobile ? 24 : 32,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: isMobile ? 40 : 56,
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
                      marginBottom: 16,
                    }}
                  >
                    Annual Black Consumer Spending
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.6)",
                      lineHeight: 20,
                    }}
                  >
                    Growing at 5.4% annually, outpacing the general market
                  </Text>
                </View>
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
                  <Text
                    style={{
                      fontSize: isMobile ? 40 : 56,
                      fontWeight: "800",
                      color: "#ba9988",
                      marginBottom: 8,
                    }}
                  >
                    73%
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: 16,
                    }}
                  >
                    Prefer Supporting Black Businesses
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.6)",
                      lineHeight: 20,
                    }}
                  >
                    Black consumers actively seek out Black-owned businesses when making purchasing decisions
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => router.push("/public_pages/learn/black-spending-power")}
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
                  Learn More About Market Opportunity →
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Group Economics for Business */}
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
                  Group Economics Benefits Your Business
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
                  When Black dollars circulate within the community, businesses benefit from loyal customers, sustainable growth, and lasting relationships.
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 24,
                  padding: isMobile ? 24 : 40,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  marginBottom: 32,
                }}
              >
                <View style={{ gap: 24 }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 12,
                      }}
                    >
                      The Multiplier Effect
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: "rgba(255, 255, 255, 0.8)",
                        lineHeight: 26,
                      }}
                    >
                      When dollars stay in the community, they create a multiplier effect. Each dollar spent with a Black business can circulate 2-3 times, creating jobs, supporting other businesses, and building wealth.
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
                      Community Loyalty vs Transactional Customers
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: "rgba(255, 255, 255, 0.8)",
                        lineHeight: 26,
                      }}
                    >
                      BDN connects you with customers who value community impact. These aren't just transactions—they're relationships built on shared values and mutual support.
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => router.push("/public_pages/learn/group-economics")}
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

        {/* Business Benefits */}
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
                Everything You Need to Grow
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
                    icon: "people",
                    title: "Reach Engaged Consumers",
                    description: "Connect with thousands of consumers actively seeking Black-owned businesses. Get discovered by your ideal customers.",
                  },
                  {
                    icon: "analytics",
                    title: "Marketing & Analytics",
                    description: "Powerful tools to understand your customers, track performance, and optimize your business strategy.",
                  },
                  {
                    icon: "payment",
                    title: "Payment Processing",
                    description: "Seamless payment processing with competitive rates. Accept payments online and in-person.",
                  },
                  {
                    icon: "manage-accounts",
                    title: "Customer Management",
                    description: "Build lasting relationships with customer profiles, purchase history, and engagement tools.",
                  },
                  {
                    icon: "subscriptions",
                    title: "Subscription Boxes",
                    description: "Offer recurring product subscriptions. Automated billing and shipping management.",
                  },
                  {
                    icon: "event",
                    title: "Event Ticketing",
                    description: "Create and sell tickets for events, workshops, and experiences. Manage attendees with ease.",
                  },
                ].map((benefit, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      minWidth: isMobile ? "100%" : "30%",
                      backgroundColor: "#474747",
                      borderRadius: 20,
                      padding: isMobile ? 24 : 32,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
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
                Get Started in 3 Simple Steps
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
                    title: "Create Business Profile",
                    description: "Sign up and create your business profile. Add photos, description, and business information.",
                  },
                  {
                    step: "2",
                    title: "List Products & Services",
                    description: "Add your products or services. Set up inventory, pricing, and availability.",
                  },
                  {
                    step: "3",
                    title: "Start Receiving Customers",
                    description: "Get discovered by consumers. Start processing orders and growing your business.",
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

        {/* BDN+ Business Upsell */}
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
                Unlock Premium Features with BDN+ Business
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
                Advanced analytics, priority support, enhanced marketing tools, and more to accelerate your growth.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/public_pages/pricing")}
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

        {/* Business Education Resources */}
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
                backgroundColor: "#474747",
                borderRadius: 24,
                padding: isMobile ? 32 : 48,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="school" size={48} color="#ba9988" style={{ marginBottom: 24 }} />
              <Text
                style={{
                  fontSize: isMobile ? 28 : 36,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                Grow Your Business with Group Economics
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
                Access business guides, marketing resources, and educational content designed to help you succeed.
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
                  onPress={() => router.push("/public_pages/learn")}
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
                Get Started Today
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
                Join 500+ Black-owned businesses growing on BDN. List your business for free and start reaching customers today.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/pages/merchant/onboarding")}
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
                  List Your Business
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
