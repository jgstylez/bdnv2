import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { HeroSection } from '@/components/layouts/HeroSection';

type TabType = "about" | "legal";

export default function AboutLegal() {
  const router = useRouter();
  const { isMobile, paddingHorizontal } = useResponsive();
  const [activeTab, setActiveTab] = useState<TabType>("about");

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: spacing.lg,
          paddingBottom: spacing["4xl"],
        }}
      >
        {/* Header */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: spacing.lg,
          }}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.primary,
              marginLeft: spacing.sm,
            }}
          >
            Back to Account
          </Text>
        </TouchableOpacity>

        {/* Hero Section */}
        <HeroSection
          title="About & Legal"
          subtitle="Learn more about BDN and our legal information"
        />

        {/* Tabs */}
        <View
          style={{
            flexDirection: "row",
            gap: spacing.sm,
            marginBottom: spacing.xl,
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.md,
            padding: spacing.xs,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab("about")}
            style={{
              flex: 1,
              paddingVertical: spacing.md,
              borderRadius: borderRadius.sm,
              backgroundColor: activeTab === "about" ? colors.accent : "transparent",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: activeTab === "about" ? colors.text.primary : colors.text.secondary,
              }}
            >
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("legal")}
            style={{
              flex: 1,
              paddingVertical: spacing.md,
              borderRadius: borderRadius.sm,
              backgroundColor: activeTab === "legal" ? colors.accent : "transparent",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: activeTab === "legal" ? colors.text.primary : colors.text.secondary,
              }}
            >
              Legal
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === "about" ? (
          <View
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: spacing.xl,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            {/* App Version */}
            <View style={{ marginBottom: spacing.xl }}>
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}
              >
                App Version
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.secondary,
                }}
              >
                Version 2.0.0
              </Text>
            </View>

            {/* Company Description */}
            <View style={{ marginBottom: spacing.xl }}>
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}
              >
                About BDN
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.secondary,
                  lineHeight: typography.lineHeight.relaxed,
                }}
              >
                BDN (Black Dollar Network) is a comprehensive platform dedicated to empowering and supporting Black-owned businesses and the Black community. Our mission is to create economic opportunities, foster community growth, and celebrate Black excellence through innovative technology and meaningful connections.
              </Text>
            </View>

            {/* Company Details */}
            <View style={{ marginBottom: spacing.xl }}>
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.md,
                }}
              >
                Company Details
              </Text>
              <View style={{ gap: spacing.sm }}>
                <View>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Company Name
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      color: colors.text.primary,
                    }}
                  >
                    Black Dollar Network, LLC
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Founded
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      color: colors.text.primary,
                    }}
                  >
                    2016
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Headquarters
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      color: colors.text.primary,
                    }}
                  >
                    United States
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Contact Email
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      color: colors.accent,
                    }}
                  >
                    support@blackdollarnetwork.com
                  </Text>
                </View>
              </View>
            </View>

            {/* Copyright */}
            <View
              style={{
                paddingTop: spacing.xl,
                borderTopWidth: 1,
                borderTopColor: colors.border.light,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.tertiary,
                  textAlign: "center",
                }}
              >
                © 2016 - {new Date().getFullYear()} Black Dollar Network, LLC. All rights reserved.
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: spacing.xl,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            {/* Terms of Service */}
            <View style={{ marginBottom: spacing.xl }}>
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}
              >
                Terms of Service
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.secondary,
                  lineHeight: typography.lineHeight.relaxed,
                  marginBottom: spacing.md,
                }}
              >
                By using BDN, you agree to our Terms of Service. These terms govern your use of our platform and services.
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.sm,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.accent,
                    fontWeight: typography.fontWeight.semibold,
                  }}
                >
                  View Full Terms of Service
                </Text>
                <MaterialIcons name="open-in-new" size={18} color={colors.accent} />
              </TouchableOpacity>
            </View>

            {/* Privacy Policy */}
            <View style={{ marginBottom: spacing.xl }}>
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}
              >
                Privacy Policy
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.secondary,
                  lineHeight: typography.lineHeight.relaxed,
                  marginBottom: spacing.md,
                }}
              >
                We are committed to protecting your privacy. Our Privacy Policy explains how we collect, use, and safeguard your personal information.
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.sm,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.accent,
                    fontWeight: typography.fontWeight.semibold,
                  }}
                >
                  View Full Privacy Policy
                </Text>
                <MaterialIcons name="open-in-new" size={18} color={colors.accent} />
              </TouchableOpacity>
            </View>

            {/* Compliance */}
            <View style={{ marginBottom: spacing.xl }}>
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}
              >
                Compliance
              </Text>
              <View style={{ gap: spacing.md }}>
                <View>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.text.primary,
                      marginBottom: spacing.xs,
                    }}
                  >
                    GDPR Compliance
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      color: colors.text.secondary,
                      lineHeight: typography.lineHeight.relaxed,
                    }}
                  >
                    BDN complies with the General Data Protection Regulation (GDPR) and respects your data privacy rights.
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.text.primary,
                      marginBottom: spacing.xs,
                    }}
                  >
                    CCPA Compliance
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      color: colors.text.secondary,
                      lineHeight: typography.lineHeight.relaxed,
                    }}
                  >
                    We comply with the California Consumer Privacy Act (CCPA) and provide California residents with specific privacy rights.
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.text.primary,
                      marginBottom: spacing.xs,
                    }}
                  >
                    PCI DSS Compliance
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      color: colors.text.secondary,
                      lineHeight: typography.lineHeight.relaxed,
                    }}
                  >
                    All payment processing is PCI DSS compliant to ensure secure transactions.
                  </Text>
                </View>
              </View>
            </View>

            {/* Data Protection */}
            <View
              style={{
                paddingTop: spacing.xl,
                borderTopWidth: 1,
                borderTopColor: colors.border.light,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}
              >
                Data Protection
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.secondary,
                  lineHeight: typography.lineHeight.relaxed,
                }}
              >
                We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

