import React from "react";
import { View, Text, ScrollView, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PublicHeroSection } from '@/components/layouts/PublicHeroSection';
import { ScrollAnimatedView } from '@/components/ScrollAnimatedView';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

const sections = [
  {
    title: "Information We Collect",
    content: [
      "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.",
      "This includes your name, email address, phone number, payment information, and any other information you choose to provide.",
      "We also automatically collect certain information about your device and how you interact with our platform, including IP address, browser type, and usage data.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "We use the information we collect to provide, maintain, and improve our services.",
      "This includes processing transactions, sending you updates about your account, and responding to your inquiries.",
      "We may also use your information to send you marketing communications, but you can opt out at any time.",
      "We use aggregated, anonymized data to analyze trends and improve our platform.",
    ],
  },
  {
    title: "Information Sharing",
    content: [
      "We do not sell your personal information to third parties.",
      "We may share your information with service providers who help us operate our platform, such as payment processors and cloud hosting providers.",
      "We may also share information if required by law or to protect our rights and the safety of our users.",
      "With your consent, we may share information with business partners to provide you with relevant offers and services.",
    ],
  },
  {
    title: "Data Security",
    content: [
      "We implement industry-standard security measures to protect your personal information.",
      "This includes encryption, secure servers, and regular security audits.",
      "However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    title: "Your Rights",
    content: [
      "You have the right to access, update, or delete your personal information at any time.",
      "You can opt out of marketing communications by updating your preferences in your account settings.",
      "You may request a copy of your data or request that we delete your account and associated data.",
      "If you have questions or concerns about your privacy, please contact us at support@blackdollarnetwork.com.",
    ],
  },
  {
    title: "Cookies and Tracking",
    content: [
      "We use cookies and similar tracking technologies to enhance your experience on our platform.",
      "These technologies help us remember your preferences, analyze usage patterns, and improve our services.",
      "You can control cookies through your browser settings, but some features may not function properly if cookies are disabled.",
    ],
  },
  {
    title: "Children's Privacy",
    content: [
      "Our platform is not intended for children under the age of 13.",
      "We do not knowingly collect personal information from children under 13.",
      "If we become aware that we have collected information from a child under 13, we will take steps to delete that information.",
    ],
  },
  {
    title: "Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.",
      "We will notify you of any material changes by posting the new policy on this page and updating the 'Last Updated' date.",
      "We encourage you to review this policy periodically to stay informed about how we protect your information.",
    ],
  },
];

export default function Privacy() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
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
          title="Privacy Policy"
          subtitle="Your privacy is important to us. Learn how we collect, use, and protect your information."
        />

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
                maxWidth: 900,
                alignSelf: "center",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.6)",
                  marginBottom: 32,
                  textAlign: "center",
                }}
              >
                Last Updated: February 15, 2024
              </Text>

              <View style={{ gap: 40 }}>
                {sections.map((section, index) => (
                  <View key={index}>
                    <Text
                      style={{
                        fontSize: isMobile ? 24 : 28,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 16,
                        letterSpacing: -0.5,
                      }}
                    >
                      {section.title}
                    </Text>
                    <View style={{ gap: 12 }}>
                      {section.content.map((paragraph, pIndex) => (
                        <Text
                          key={pIndex}
                          style={{
                            fontSize: 15,
                            color: "rgba(255, 255, 255, 0.8)",
                            lineHeight: 24,
                          }}
                        >
                          {paragraph}
                        </Text>
                      ))}
                    </View>
                  </View>
                ))}
              </View>

              <View
                style={{
                  marginTop: 48,
                  padding: 24,
                  backgroundColor: "rgba(71, 71, 71, 0.4)",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Questions About Privacy?
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 22,
                  }}
                >
                  If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at{" "}
                  <Text style={{ color: "#ba9988" }}>support@blackdollarnetwork.com</Text>.
                </Text>
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        <Footer />
      </OptimizedScrollView>
    </View>
  );
}

