import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PublicHeroSection } from "@/components/layouts/PublicHeroSection";
import { ScrollAnimatedView } from "@/components/ScrollAnimatedView";
import { OptimizedScrollView } from "@/components/optimized/OptimizedScrollView";

const sections = [
  {
    title: "What Are Cookies?",
    content: [
      "Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website.",
      "They help websites remember your preferences, login information, and other settings to provide a better user experience.",
      "Cookies are widely used across the internet and are essential for many website features to function properly.",
    ],
  },
  {
    title: "How We Use Cookies",
    content: [
      "We use cookies to provide, protect, and improve our services on Black Dollar Network.",
      "Cookies help us understand how you interact with our platform, remember your preferences, and personalize your experience.",
      "We also use cookies to analyze traffic patterns, measure the effectiveness of our marketing campaigns, and detect fraudulent activity.",
    ],
  },
  {
    title: "Essential Cookies",
    content: [
      "These cookies are strictly necessary for the operation of our platform and cannot be disabled.",
      "They enable core functionality such as security, network management, and account authentication.",
      "Without these cookies, services you have requested, such as logging into your account or completing a transaction, cannot be provided.",
    ],
  },
  {
    title: "Functional Cookies",
    content: [
      "Functional cookies allow our platform to remember choices you make and provide enhanced, personalized features.",
      "These may include remembering your language preference, region, or display settings.",
      "They may also be used to provide services you have requested, such as watching a video or using social sharing features.",
    ],
  },
  {
    title: "Analytics Cookies",
    content: [
      "We use analytics cookies to collect information about how visitors use our platform.",
      "This data helps us understand which pages are most popular, how users navigate between pages, and where users may encounter issues.",
      "All information collected by analytics cookies is aggregated and anonymous, and is used solely to improve our services.",
    ],
  },
  {
    title: "Marketing Cookies",
    content: [
      "Marketing cookies are used to track visitors across websites to display relevant advertisements.",
      "These cookies help us measure the effectiveness of our advertising campaigns and limit the number of times you see an ad.",
      "We may share this information with third-party advertising partners to deliver personalized ads based on your interests.",
      "You can opt out of personalized advertising at any time through your account settings or browser preferences.",
    ],
  },
  {
    title: "Third-Party Cookies",
    content: [
      "Some cookies on our platform are set by third-party services that appear on our pages.",
      "These include social media plugins, payment processors, and analytics providers such as Google Analytics.",
      "We do not control these third-party cookies. Please refer to their respective privacy policies for more information.",
    ],
  },
  {
    title: "Managing Your Cookie Preferences",
    content: [
      "Most web browsers allow you to control cookies through their settings. You can choose to block or delete cookies at any time.",
      "Please note that disabling certain cookies may affect the functionality of our platform and limit your access to some features.",
      "To manage cookies, access your browser's settings menu and look for privacy or cookie-related options.",
      "You can also use your account settings on Black Dollar Network to manage your cookie preferences where available.",
    ],
  },
  {
    title: "Cookie Retention",
    content: [
      "Session cookies are temporary and are deleted when you close your browser.",
      "Persistent cookies remain on your device for a set period of time or until you delete them manually.",
      "The retention period for each cookie varies depending on its purpose, ranging from a few hours to up to 2 years.",
    ],
  },
  {
    title: "Updates to This Policy",
    content: [
      "We may update this Cookie Policy from time to time to reflect changes in our practices or legal requirements.",
      "Any changes will be posted on this page with an updated 'Last Updated' date.",
      "We encourage you to review this policy periodically to stay informed about how we use cookies.",
    ],
  },
];

export default function Cookies() {
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
          title="Cookie Policy"
          subtitle="Learn how Black Dollar Network uses cookies to enhance your experience."
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
                Last Updated: January 23, 2026
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
                  Questions About Cookies?
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 22,
                  }}
                >
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us at{" "}
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
