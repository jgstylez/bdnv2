import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from '@/types/subscription';
import { HeroSection } from '@/components/layouts/HeroSection';
import { useResponsive } from '@/hooks/useResponsive';

// Mock current subscription
const mockCurrentSubscription = {
  tier: "free" as const,
  status: "active" as const,
  endDate: null,
};

export default function BDNPlus() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { isMobile, paddingHorizontal } = useResponsive();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // Show all plans (including BDN+ Business) during development
  // In production, filter based on user's business/nonprofit enrollment
  const availablePlans = SUBSCRIPTION_PLANS.filter((plan) => plan.tier !== "free");

  const handleSubscribe = (plan: SubscriptionPlan) => {
    if (plan.tier === "free") {
      alert("You're already on the free plan!");
      return;
    }
    // Navigate to checkout
    alert(`Subscribe to ${plan.name} - $${plan.price[billingCycle].toFixed(2)}/${billingCycle === "monthly" ? "month" : "year"}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        <HeroSection
          title="BDN+ Premium"
          subtitle="Unlock enhanced features and exclusive benefits. Choose the plan that's right for you."
        />

        {/* Current Plan */}
        {mockCurrentSubscription.tier !== "free" && (
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 24,
              marginBottom: 32,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 12,
              }}
            >
              Current Plan
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "700",
                    color: "#ba9988",
                    marginBottom: 4,
                  }}
                >
                  {SUBSCRIPTION_PLANS.find((p) => p.tier === mockCurrentSubscription.tier)?.name}
                </Text>
                {mockCurrentSubscription.endDate && (
                  <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.6)" }}>
                    Renews {new Date(mockCurrentSubscription.endDate).toLocaleDateString()}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => alert("Manage subscription")}
                style={{
                  backgroundColor: "#232323",
                  borderRadius: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#ba9988" }}>
                  Manage
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Billing Cycle Toggle */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#474747",
            borderRadius: 12,
            padding: 4,
            marginBottom: 32,
            alignSelf: "center",
            minWidth: isMobile ? 280 : 320,
            maxWidth: 400,
          }}
        >
          <TouchableOpacity
            onPress={() => setBillingCycle("monthly")}
            style={{
              flex: 1,
              backgroundColor: billingCycle === "monthly" ? "#ba9988" : "transparent",
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 16,
              alignItems: "center",
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
            style={{
              flex: 1,
              backgroundColor: billingCycle === "yearly" ? "#ba9988" : "transparent",
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 16,
              alignItems: "center",
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

        {/* Subscription Plans */}
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            gap: 20,
            marginBottom: 32,
          }}
        >
          {availablePlans.map((plan) => {
            const price = plan.price[billingCycle];
            const isCurrentPlan = plan.tier === mockCurrentSubscription.tier;
            const isPopular = plan.popular;

            return (
              <View
                key={plan.id}
                style={{
                  flex: 1,
                  backgroundColor: "#474747",
                  borderRadius: 20,
                  padding: 24,
                  borderWidth: 2,
                  borderColor: isPopular ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
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
                      ${price.toFixed(2)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: "rgba(255, 255, 255, 0.6)",
                        marginLeft: 4,
                      }}
                    >
                      /{billingCycle === "monthly" ? "month" : "year"}
                    </Text>
                  </View>
                  {billingCycle === "yearly" && (
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
                  disabled={isCurrentPlan}
                  style={{
                    backgroundColor: isCurrentPlan ? "#232323" : isPopular ? "#ba9988" : "#232323",
                    borderRadius: 12,
                    paddingVertical: 16,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: isCurrentPlan ? "rgba(186, 153, 136, 0.2)" : isPopular ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: isCurrentPlan ? "rgba(255, 255, 255, 0.5)" : "#ffffff",
                    }}
                  >
                    {isCurrentPlan ? "Current Plan" : "Subscribe"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Benefits Section */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 24,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
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
      </ScrollView>
    </View>
  );
}

