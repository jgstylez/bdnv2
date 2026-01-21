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
    title: "Acceptance of Terms",
    content: [
      "By accessing or using Black Dollar Network (BDN), you agree to be bound by these Terms of Service and all applicable laws and regulations.",
      "If you do not agree with any of these terms, you are prohibited from using or accessing this platform.",
      "We reserve the right to update these terms at any time, and your continued use constitutes acceptance of any changes.",
    ],
  },
  {
    title: "Use of the Platform",
    content: [
      "You must be at least 18 years old to use BDN, or have parental consent if you are between 13 and 17 years old.",
      "You agree to use the platform only for lawful purposes and in accordance with these Terms of Service.",
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
      "You agree not to use the platform to transmit any harmful, offensive, or illegal content.",
    ],
  },
  {
    title: "User Accounts",
    content: [
      "You are responsible for providing accurate and complete information when creating your account.",
      "You must maintain and promptly update your account information to keep it current and accurate.",
      "You are responsible for all activities that occur under your account, whether authorized by you or not.",
      "We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.",
    ],
  },
  {
    title: "Transactions and Payments",
    content: [
      "All transactions on BDN are subject to our payment terms and processing policies.",
      "You agree to pay all fees and charges associated with your use of the platform.",
      "We reserve the right to refuse or cancel any transaction at our sole discretion.",
      "Refunds are subject to our refund policy and applicable laws.",
    ],
  },
  {
    title: "Intellectual Property",
    content: [
      "All content on BDN, including text, graphics, logos, and software, is the property of Black Dollar Network or its licensors.",
      "You may not reproduce, distribute, or create derivative works from our content without express written permission.",
      "User-generated content remains the property of the user, but you grant us a license to use, display, and distribute it on the platform.",
    ],
  },
  {
    title: "Prohibited Activities",
    content: [
      "You agree not to engage in any activity that could harm, disable, or impair the platform or interfere with other users' access.",
      "Prohibited activities include, but are not limited to: fraud, harassment, spamming, and unauthorized access to our systems.",
      "We reserve the right to investigate and take legal action against any violations of these terms.",
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      "BDN is provided 'as is' without warranties of any kind, either express or implied.",
      "We do not guarantee that the platform will be uninterrupted, secure, or error-free.",
      "To the fullest extent permitted by law, we disclaim all warranties and limit our liability for any damages arising from your use of the platform.",
    ],
  },
  {
    title: "Termination",
    content: [
      "We reserve the right to terminate or suspend your account and access to the platform at any time, with or without cause or notice.",
      "You may terminate your account at any time by contacting us or using the account deletion feature.",
      "Upon termination, your right to use the platform will immediately cease, and we may delete your account and associated data.",
    ],
  },
  {
    title: "Governing Law",
    content: [
      "These Terms of Service are governed by and construed in accordance with the laws of the United States.",
      "Any disputes arising from these terms or your use of the platform will be resolved through binding arbitration.",
      "You agree to submit to the exclusive jurisdiction of the courts in the jurisdiction where BDN operates.",
    ],
  },
];

export default function Terms() {
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
          title="Terms of Service"
          subtitle="Please read these terms carefully before using Black Dollar Network."
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
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
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
                  Questions About Terms?
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 22,
                  }}
                >
                  If you have any questions about these Terms of Service, please contact us at{" "}
                  <Text style={{ color: "#ba9988" }}>legal@blackdollarnetwork.com</Text>.
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

