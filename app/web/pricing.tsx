import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { navigateToAuthenticatedRoute, requiresAuthentication } from '@/lib/navigation-utils';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from '@/types/subscription';
import { PublicHeroSection } from '@/components/layouts/PublicHeroSection';
import { ScrollAnimatedView } from '@/components/ScrollAnimatedView';
import { useResponsive } from '@/hooks/useResponsive';

export default function Pricing() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isMobile, paddingHorizontal } = useResponsive();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const handleSubscribe = (plan: SubscriptionPlan) => {
    if (plan.tier === "free") {
      router.push("/(auth)/signup");
    } else {
      // TODO: When actual authentication is implemented, check if user is authenticated
      // before navigating to authenticated routes. For now, redirect to login.
      navigateToAuthenticatedRoute(router, "/pages/bdn-plus");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <Navigation />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: isMobile ? insets.bottom : 0,
        }}
      >
        <PublicHeroSection
          title="BDN+ Premium"
          subtitle="Unlock enhanced features and exclusive benefits. Choose the plan that's right for you."
        />

        {/* Billing Cycle Toggle */}
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
                maxWidth: 1200,
                alignSelf: "center",
                width: "100%",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#474747",
                  borderRadius: 12,
                  padding: 4,
                  alignSelf: "center",
                  minWidth: isMobile ? 280 : 320,
                  maxWidth: 400,
                }}
              >
          <TouchableOpacity
            onPress={() => setBillingCycle("monthly")}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Select monthly billing"
            accessibilityHint="Double tap to select monthly billing cycle"
            accessibilityState={{ selected: billingCycle === "monthly" }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              flex: 1,
              backgroundColor: billingCycle === "monthly" ? "#ba9988" : "transparent",
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 16,
              alignItems: "center",
              minHeight: 44,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: billingCycle === "monthly" ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
              }}
            >
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setBillingCycle("yearly")}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Select yearly billing, save 17 percent"
            accessibilityHint="Double tap to select yearly billing cycle and save 17 percent"
            accessibilityState={{ selected: billingCycle === "yearly" }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              flex: 1,
              backgroundColor: billingCycle === "yearly" ? "#ba9988" : "transparent",
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 16,
              alignItems: "center",
              minHeight: 44,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: billingCycle === "yearly" ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
              }}
            >
              Yearly
            </Text>
            <Text style={{ fontSize: 11, color: "#4caf50", marginTop: 2 }}>
              Save 17%
            </Text>
          </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Subscription Plans - All Three Tiers */}
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
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  gap: 20,
                }}
              >
          {SUBSCRIPTION_PLANS.map((plan) => {
            const price = plan.price[billingCycle];
            const isPopular = plan.popular;

            return (
              <View
                key={plan.id}
                style={{
                  flex: 1,
                  backgroundColor: "rgba(71, 71, 71, 0.4)",
                  borderRadius: 20,
                  padding: 24,
                  borderWidth: 2,
                  borderColor: isPopular ? "#ba9988" : "rgba(186, 153, 136, 0.3)",
                  position: "relative",
                }}
              >
                {isPopular && (
                  <View
                    style={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: [{ translateX: -50 }],
                      backgroundColor: "#ba9988",
                      paddingHorizontal: 16,
                      paddingVertical: 6,
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "700",
                        color: "#ffffff",
                        textTransform: "uppercase",
                      }}
                    >
                      Most Popular
                    </Text>
                  </View>
                )}

                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "800",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  {plan.name}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: 20,
                  }}
                >
                  {plan.description}
                </Text>

                <View style={{ marginBottom: 24 }}>
                  <View style={{ flexDirection: "row", alignItems: "baseline", marginBottom: 4 }}>
                    <Text
                      style={{
                        fontSize: 40,
                        fontWeight: "800",
                        color: "#ba9988",
                      }}
                    >
                      {price === 0 ? "Free" : `$${price.toFixed(2)}`}
                    </Text>
                    {price > 0 && (
                      <Text
                        style={{
                          fontSize: 16,
                          color: "rgba(255, 255, 255, 0.6)",
                          marginLeft: 4,
                        }}
                      >
                        /{billingCycle === "monthly" ? "month" : "year"}
                      </Text>
                    )}
                  </View>
                  {billingCycle === "yearly" && price > 0 && (
                    <Text style={{ fontSize: 12, color: "#4caf50" }}>
                      ${((plan.price.monthly * 12 - plan.price.yearly) / 12).toFixed(2)}/month savings
                    </Text>
                  )}
                </View>

                <View style={{ marginBottom: 24, gap: 12 }}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
                      <MaterialIcons name="check-circle" size={20} color="#4caf50" />
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#ffffff",
                          flex: 1,
                        }}
                      >
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={() => handleSubscribe(plan)}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={plan.tier === "free" ? `Get started with ${plan.name} plan` : `Subscribe to ${plan.name} plan`}
                  accessibilityHint={plan.tier === "free" ? "Double tap to sign up for free" : "Double tap to subscribe"}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{
                    backgroundColor: isPopular ? "#ba9988" : "#232323",
                    borderRadius: 12,
                    paddingVertical: 16,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: isPopular ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                    minHeight: 44,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#ffffff",
                    }}
                  >
                    {plan.tier === "free" ? "Get Started Free" : "Subscribe"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
              </View>
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
              <View
                style={{
                  backgroundColor: "rgba(71, 71, 71, 0.4)",
                  borderRadius: 16,
                  padding: 24,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Why Upgrade to BDN+?
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.6)",
                    marginBottom: 20,
                  }}
                >
                  BDN+ is designed for consumers. If you're a business or nonprofit owner, check out{" "}
                  <Text style={{ fontWeight: "600", color: "#ba9988" }}>BDN+ Business</Text> for additional tools and resources.
                </Text>
                <View style={{ gap: 16 }}>
            {[
              {
                icon: "analytics",
                title: "Advanced Analytics",
                description: "Get detailed insights into your spending, impact, and rewards",
              },
              {
                icon: "attach-money",
                title: "Enhanced Cashback",
                description: "Earn higher cashback rates on all your purchases",
              },
              {
                icon: "event",
                title: "Exclusive Events",
                description: "Early access and discounts on premium events",
              },
              {
                icon: "support-agent",
                title: "Priority Support",
                description: "Get faster response times and dedicated support",
              },
              {
                icon: "block",
                title: "Ad-Free Experience",
                description: "Enjoy BDN without interruptions",
              },
            ].map((benefit, index) => (
              <View key={index} style={{ flexDirection: "row", gap: 16 }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: "rgba(186, 153, 136, 0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons name={benefit.icon as any} size={24} color="#ba9988" />
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
                    {benefit.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {benefit.description}
                  </Text>
                </View>
              </View>
            ))}
                </View>
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* FAQ Section */}
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
                Frequently Asked Questions
              </Text>
              <View style={{ gap: 20 }}>
                {[
                  {
                    question: "What's included in the free plan?",
                    answer: "The free plan includes access to the business directory, basic rewards, and core platform features. You can discover and support Black businesses, earn points, and track your basic impact.",
                  },
                  {
                    question: "Can I cancel my subscription anytime?",
                    answer: "Yes, you can cancel your BDN+ subscription at any time. Your subscription will remain active until the end of your current billing period, and you'll continue to have access to premium features until then.",
                  },
                  {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit cards, debit cards, and digital wallets. All payments are processed securely through our encrypted payment system.",
                  },
                  {
                    question: "Is there a difference between BDN+ and BDN+ Business?",
                    answer: "Yes. BDN+ is designed for consumers and includes enhanced cashback, analytics, and exclusive events. BDN+ Business is for business owners and includes advanced marketing tools, analytics dashboards, and priority support.",
                  },
                  {
                    question: "Do you offer refunds?",
                    answer: "We offer a 30-day money-back guarantee for all BDN+ subscriptions. If you're not satisfied, contact our support team for a full refund.",
                  },
                ].map((faq, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: "rgba(71, 71, 71, 0.4)",
                      borderRadius: 16,
                      padding: 24,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.3)",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 12,
                      }}
                    >
                      {faq.question}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: 24,
                      }}
                    >
                      {faq.answer}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Testimonials Section */}
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
                What Our Members Say
              </Text>
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  gap: 24,
                }}
              >
                {[
                  {
                    quote: "BDN+ has been worth every penny. The enhanced cashback and analytics help me track my impact and save money at the same time.",
                    author: "Sarah Johnson",
                    role: "BDN+ Member",
                    rating: 5,
                  },
                  {
                    quote: "As a business owner, BDN+ Business gave me the tools I needed to grow. The analytics dashboard alone is worth the subscription.",
                    author: "Marcus Williams",
                    role: "Business Owner",
                    rating: 5,
                  },
                  {
                    quote: "The free plan is great, but upgrading to BDN+ unlocked features that really help me maximize my economic impact.",
                    author: "Aisha Davis",
                    role: "BDN+ Member",
                    rating: 5,
                  },
                ].map((testimonial, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      backgroundColor: "rgba(71, 71, 71, 0.4)",
                      borderRadius: 20,
                      padding: 24,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.3)",
                    }}
                  >
                    <View style={{ flexDirection: "row", marginBottom: 16 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <MaterialIcons key={i} name="star" size={20} color="#ba9988" />
                      ))}
                    </View>
                    <Text
                      style={{
                        fontSize: 20,
                        color: "#ba9988",
                        marginBottom: 12,
                      }}
                    >
                      "
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "rgba(255, 255, 255, 0.9)",
                        lineHeight: 24,
                        marginBottom: 20,
                      }}
                    >
                      {testimonial.quote}
                    </Text>
                    <View style={{ borderTopWidth: 1, borderTopColor: "rgba(186, 153, 136, 0.2)", paddingTop: 16 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#ffffff",
                          marginBottom: 4,
                        }}
                      >
                        {testimonial.author}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#ba9988",
                        }}
                      >
                        {testimonial.role}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        <Footer />
      </ScrollView>
    </View>
  );
}

