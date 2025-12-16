import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Circle, Rect } from "react-native-svg";

const FINtech_FEATURES = [
  {
    title: "Digital Wallet",
    description: "Multi-currency wallet supporting USD, BLKD tokens, and more. Secure, instant transfers with bank-level encryption.",
    icon: "account-balance-wallet",
    gradient: ["#ba9988", "#9d7f6f"],
    features: ["Multi-currency support", "Instant transfers", "Bank-level security", "FDIC insured"],
  },
  {
    title: "Token System",
    description: "Purchase, earn, and manage tokens. Track your balance, view certificates, and unlock exclusive benefits.",
    icon: "monetization-on",
    gradient: ["#6b8e9f", "#5a7a8a"],
    features: ["Purchase tokens", "Earn rewards", "Digital certificates", "Recurring purchases"],
  },
  {
    title: "Secure Payments",
    description: "Process payments with confidence. Consumer-to-business payments, checkout flows, and subscription management.",
    icon: "payment",
    gradient: ["#8b6f9d", "#745a83"],
    features: ["C2B payments", "Secure checkout", "Multiple payment methods", "Transaction history"],
  },
  {
    title: "Rewards & Tiers",
    description: "Level up from Basic to Black Diamond. Unlock exclusive benefits, discounts, and community recognition.",
    icon: "workspace-premium",
    gradient: ["#9d8b6f", "#837a5a"],
    features: ["6 tier levels", "Exclusive benefits", "Community recognition", "Progress tracking"],
  },
];

// SVG Wallet Illustration
const WalletIllustration = ({ size = 200 }: { size?: number }) => (
  <Svg width={size} height={size * 0.6} viewBox="0 0 200 120">
    <Defs>
      <SvgLinearGradient id="walletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#ba9988" stopOpacity="0.3" />
        <Stop offset="100%" stopColor="#ba9988" stopOpacity="0.1" />
      </SvgLinearGradient>
    </Defs>
    {/* Wallet Card */}
    <Rect x="20" y="30" width="160" height="80" rx="8" fill="url(#walletGrad)" stroke="#ba9988" strokeWidth="2" />
    {/* Card Chip */}
    <Rect x="30" y="50" width="20" height="15" rx="2" fill="#ba9988" opacity="0.5" />
    {/* Card Lines */}
    <Rect x="30" y="75" width="100" height="3" rx="1" fill="#ba9988" opacity="0.3" />
    <Rect x="30" y="85" width="60" height="3" rx="1" fill="#ba9988" opacity="0.3" />
    {/* Currency Symbol */}
    <Circle cx="150" cy="60" r="15" fill="#ba9988" opacity="0.2" />
    <Circle cx="150" cy="60" r="8" fill="#ba9988" opacity="0.4" />
  </Svg>
);

// SVG Token Illustration
const TokenIllustration = ({ size = 200 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 200 200">
    <Defs>
      <SvgLinearGradient id="tokenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#6b8e9f" stopOpacity="0.4" />
        <Stop offset="100%" stopColor="#6b8e9f" stopOpacity="0.1" />
      </SvgLinearGradient>
    </Defs>
    {/* Token Circle */}
    <Circle cx="100" cy="100" r="60" fill="url(#tokenGrad)" stroke="#6b8e9f" strokeWidth="3" />
    <Circle cx="100" cy="100" r="45" fill="none" stroke="#6b8e9f" strokeWidth="2" opacity="0.5" />
    {/* Token Symbol */}
    <Path
      d="M 100 70 L 100 130 M 70 100 L 130 100"
      stroke="#6b8e9f"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <Circle cx="100" cy="100" r="8" fill="#6b8e9f" />
  </Svg>
);

// SVG Payment Illustration
const PaymentIllustration = ({ size = 200 }: { size?: number }) => (
  <Svg width={size} height={size * 0.7} viewBox="0 0 200 140">
    <Defs>
      <SvgLinearGradient id="paymentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#8b6f9d" stopOpacity="0.3" />
        <Stop offset="100%" stopColor="#8b6f9d" stopOpacity="0.1" />
      </SvgLinearGradient>
    </Defs>
    {/* Payment Arrow */}
    <Path
      d="M 40 70 L 160 70 M 150 60 L 160 70 L 150 80"
      stroke="#8b6f9d"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Payment Cards */}
    <Rect x="20" y="40" width="30" height="20" rx="3" fill="url(#paymentGrad)" stroke="#8b6f9d" strokeWidth="1.5" />
    <Rect x="150" y="90" width="30" height="20" rx="3" fill="url(#paymentGrad)" stroke="#8b6f9d" strokeWidth="1.5" />
    {/* Lock Icon */}
    <Rect x="85" y="55" width="30" height="30" rx="4" fill="#8b6f9d" opacity="0.2" />
    <Path
      d="M 95 65 L 95 75 L 105 75 L 105 65 M 100 75 L 100 85"
      stroke="#8b6f9d"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// SVG Rewards Illustration
const RewardsIllustration = ({ size = 200 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 200 200">
    <Defs>
      <SvgLinearGradient id="rewardsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#9d8b6f" stopOpacity="0.4" />
        <Stop offset="100%" stopColor="#9d8b6f" stopOpacity="0.1" />
      </SvgLinearGradient>
    </Defs>
    {/* Star/Trophy */}
    <Path
      d="M 100 50 L 110 80 L 140 80 L 115 100 L 125 130 L 100 110 L 75 130 L 85 100 L 60 80 L 90 80 Z"
      fill="url(#rewardsGrad)"
      stroke="#9d8b6f"
      strokeWidth="2"
    />
    {/* Tier Levels */}
    <Circle cx="50" cy="160" r="8" fill="#9d8b6f" opacity="0.3" />
    <Circle cx="80" cy="160" r="8" fill="#9d8b6f" opacity="0.5" />
    <Circle cx="110" cy="160" r="8" fill="#9d8b6f" opacity="0.7" />
    <Circle cx="140" cy="160" r="8" fill="#9d8b6f" opacity="0.9" />
    <Circle cx="170" cy="160" r="8" fill="#9d8b6f" />
  </Svg>
);

const illustrations = [WalletIllustration, TokenIllustration, PaymentIllustration, RewardsIllustration];

export const FintechFeaturesSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  return (
    <ScrollAnimatedView delay={500}>
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
              marginBottom: isMobile ? 40 : 60,
              alignItems: "center",
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
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: "rgba(186, 153, 136, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons name="account-balance" size={28} color="#ba9988" />
              </View>
              <Text
                style={{
                  fontSize: isMobile ? 32 : 48,
                  fontWeight: "700",
                  color: "#ffffff",
                  letterSpacing: -0.5,
                }}
              >
                Fintech Features
              </Text>
            </View>
            <Text
              style={{
                fontSize: isMobile ? 16 : 18,
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
                maxWidth: 700,
                lineHeight: 26,
              }}
            >
              Powerful financial tools designed to empower Black economic growth. Secure, fast, and built for the community.
            </Text>
          </View>

          {/* Features Grid */}
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            {FINtech_FEATURES.map((feature, index) => {
              const Illustration = illustrations[index];
              const cardWidth = isMobile ? "100%" : "48%";

              return (
                <View
                  key={feature.title}
                  style={{
                    width: cardWidth,
                    backgroundColor: "#474747",
                    borderRadius: 24,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.1)",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 16,
                    elevation: 8,
                  }}
                >
                  {/* Illustration */}
                  <View
                    style={{
                      height: 180,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      paddingVertical: 20,
                    }}
                  >
                    <Illustration size={isMobile ? 150 : 180} />
                  </View>

                  {/* Content */}
                  <View style={{ padding: isMobile ? 24 : 32 }}>
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
                          borderRadius: 12,
                          backgroundColor: "rgba(186, 153, 136, 0.15)",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MaterialIcons name={feature.icon as any} size={24} color="#ba9988" />
                      </View>
                      <Text
                        style={{
                          fontSize: isMobile ? 24 : 28,
                          fontWeight: "700",
                          color: "#ffffff",
                          letterSpacing: -0.5,
                        }}
                      >
                        {feature.title}
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontSize: isMobile ? 15 : 16,
                        color: "rgba(255, 255, 255, 0.8)",
                        lineHeight: 24,
                        marginBottom: 20,
                      }}
                    >
                      {feature.description}
                    </Text>

                    {/* Feature List */}
                    <View style={{ gap: 10 }}>
                      {feature.features.map((item, idx) => (
                        <View
                          key={idx}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <MaterialIcons name="check-circle" size={18} color="#ba9988" />
                          <Text
                            style={{
                              fontSize: 14,
                              color: "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};

