import React from "react";
import { View, Text, ScrollView, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PublicHeroSection } from '@/components/layouts/PublicHeroSection';
import { ScrollAnimatedView } from '@/components/ScrollAnimatedView';

const securityFeatures = [
  {
    icon: "lock",
    title: "Encryption",
    description: "All data is encrypted in transit and at rest using industry-standard AES-256 encryption.",
  },
  {
    icon: "verified-user",
    title: "Authentication",
    description: "Multi-factor authentication and secure login protocols protect your account.",
  },
  {
    icon: "security",
    title: "Secure Payments",
    description: "Payment processing is handled by PCI DSS compliant partners with tokenization.",
  },
  {
    icon: "shield",
    title: "Regular Audits",
    description: "We conduct regular security audits and penetration testing to identify and fix vulnerabilities.",
  },
  {
    icon: "privacy-tip",
    title: "Privacy Protection",
    description: "We follow strict data privacy standards and never sell your personal information.",
  },
  {
    icon: "update",
    title: "Continuous Monitoring",
    description: "24/7 monitoring and automated threat detection keep your data safe.",
  },
];

const bestPractices = [
  "Use a strong, unique password for your BDN account",
  "Enable two-factor authentication for added security",
  "Never share your account credentials with anyone",
  "Log out of your account when using shared devices",
  "Keep your device's operating system and apps updated",
  "Be cautious of phishing attempts and suspicious emails",
  "Report any suspicious activity immediately to our security team",
];

export default function Security() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width < 768;

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <Navigation />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: isMobile ? insets.bottom : 0,
        }}
      >
        <PublicHeroSection
          title="Security"
          subtitle="Your security is our top priority. Learn how we protect your data and how you can stay safe."
        />

        {/* Security Features */}
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
                  marginBottom: 16,
                  textAlign: "center",
                  letterSpacing: -0.5,
                }}
              >
                How We Protect You
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.7)",
                  textAlign: "center",
                  marginBottom: 48,
                  maxWidth: 700,
                  alignSelf: "center",
                }}
              >
                We employ multiple layers of security to keep your data and transactions safe.
              </Text>

              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  flexWrap: "wrap",
                  gap: 24,
                }}
              >
                {securityFeatures.map((feature, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      minWidth: isMobile ? "100%" : "30%",
                      backgroundColor: "rgba(35, 35, 35, 0.4)",
                      borderRadius: 16,
                      padding: 24,
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
                        marginBottom: 16,
                      }}
                    >
                      <MaterialIcons name={feature.icon as any} size={28} color="#ba9988" />
                    </View>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      {feature.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: 22,
                      }}
                    >
                      {feature.description}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Best Practices */}
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
                maxWidth: 900,
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
                Security Best Practices
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.7)",
                  textAlign: "center",
                  marginBottom: 40,
                }}
              >
                Follow these tips to keep your account secure
              </Text>

              <View
                style={{
                  backgroundColor: "rgba(35, 35, 35, 0.4)",
                  borderRadius: 16,
                  padding: 32,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                }}
              >
                <View style={{ gap: 16 }}>
                  {bestPractices.map((practice, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <MaterialIcons name="check-circle" size={20} color="#4caf50" style={{ marginTop: 2 }} />
                      <Text
                        style={{
                          fontSize: 15,
                          color: "rgba(255, 255, 255, 0.8)",
                          lineHeight: 24,
                          flex: 1,
                        }}
                      >
                        {practice}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Report Security Issues */}
        <ScrollAnimatedView delay={600}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingBottom: 80,
              backgroundColor: "#1a1a1a",
            }}
          >
            <View
              style={{
                maxWidth: 900,
                alignSelf: "center",
                width: "100%",
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(35, 35, 35, 0.4)",
                  borderRadius: 16,
                  padding: 32,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="bug-report" size={48} color="#ba9988" />
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginTop: 16,
                    marginBottom: 12,
                    textAlign: "center",
                  }}
                >
                  Found a Security Issue?
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "rgba(255, 255, 255, 0.7)",
                    textAlign: "center",
                    lineHeight: 24,
                    marginBottom: 24,
                  }}
                >
                  We take security seriously. If you discover a security vulnerability, please report it responsibly to our security team.
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ba9988",
                  }}
                >
                  security@blackdollarnetwork.com
                </Text>
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        <Footer />
      </ScrollView>
    </View>
  );
}

