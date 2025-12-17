import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

const copyToClipboard = async (text: string): Promise<boolean> => {
  if (Platform.OS === "web") {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      return false;
    }
  }
  return false;
};

const sdks = [
  {
    name: "JavaScript/TypeScript",
    version: "2.1.0",
    description: "Official SDK for Node.js and browser environments",
    install: "npm install @bdn/sdk",
    icon: "code",
    color: "#f7df1e",
  },
  {
    name: "Python",
    version: "1.8.0",
    description: "Python SDK for server-side integrations",
    install: "pip install bdn-sdk",
    icon: "code",
    color: "#3776ab",
  },
  {
    name: "PHP",
    version: "1.5.0",
    description: "PHP SDK for web applications",
    install: "composer require bdn/sdk",
    icon: "code",
    color: "#777bb4",
  },
  {
    name: "Ruby",
    version: "1.3.0",
    description: "Ruby gem for Ruby applications",
    install: "gem install bdn-sdk",
    icon: "code",
    color: "#cc342d",
  },
];

const codeExamples = {
  javascript: `import { BDN } from '@bdn/sdk';

const bdn = new BDN({
  apiKey: 'your_api_key',
  environment: 'sandbox' // or 'live'
});

// List businesses
const businesses = await bdn.businesses.list();

// Create a payment
const payment = await bdn.payments.create({
  amount: 1000,
  currency: 'USD',
  businessId: 'bus_123'
});`,
  python: `from bdn import BDN

bdn = BDN(
    api_key='your_api_key',
    environment='sandbox'  # or 'live'
)

# List businesses
businesses = bdn.businesses.list()

# Create a payment
payment = bdn.payments.create(
    amount=1000,
    currency='USD',
    business_id='bus_123'
)`,
  php: `<?php
require_once 'vendor/autoload.php';

use BDN\\BDN;

$bdn = new BDN([
    'api_key' => 'your_api_key',
    'environment' => 'sandbox' // or 'live'
]);

// List businesses
$businesses = $bdn->businesses->list();

// Create a payment
$payment = $bdn->payments->create([
    'amount' => 1000,
    'currency' => 'USD',
    'business_id' => 'bus_123'
]);`,
};

export default function SDKs() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof codeExamples>("javascript");

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? spacing.mobile : spacing.desktop,
          paddingTop: spacing.lg,
          paddingBottom: spacing["4xl"],
        }}
      >

        {/* SDKs List */}
        <View style={{ marginBottom: spacing["2xl"] }}>
          <Text
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Official SDKs
          </Text>
          <View style={{ gap: spacing.md }}>
            {sdks.map((sdk, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: colors.secondary.bg,
                  borderRadius: borderRadius.lg,
                  padding: spacing.lg,
                  borderWidth: 1,
                  borderColor: colors.border.light,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: borderRadius.md,
                      backgroundColor: `${sdk.color}20`,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: spacing.md,
                    }}
                  >
                    <MaterialIcons name={sdk.icon as any} size={24} color={sdk.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs }}>
                      <Text
                        style={{
                          fontSize: typography.fontSize.lg,
                          fontWeight: typography.fontWeight.bold,
                          color: colors.text.primary,
                        }}
                      >
                        {sdk.name}
                      </Text>
                      <View
                        style={{
                          paddingHorizontal: spacing.xs,
                          paddingVertical: 2,
                          borderRadius: borderRadius.sm,
                          backgroundColor: colors.accent + "20",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            fontWeight: typography.fontWeight.semibold,
                            color: colors.accent,
                          }}
                        >
                          v{sdk.version}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        marginBottom: spacing.sm,
                      }}
                    >
                      {sdk.description}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: colors.background.primary,
                        borderRadius: borderRadius.md,
                        padding: spacing.sm,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          fontSize: typography.fontSize.sm,
                          fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                          color: colors.text.primary,
                        }}
                      >
                        {sdk.install}
                      </Text>
                      <TouchableOpacity
                        onPress={() => copyToClipboard(sdk.install)}
                        style={{
                          marginLeft: spacing.sm,
                          padding: spacing.xs,
                          borderRadius: borderRadius.sm,
                          backgroundColor: colors.accent + "20",
                        }}
                      >
                        <MaterialIcons name="content-copy" size={16} color={colors.accent} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Code Examples */}
        <View>
          <Text
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Quick Start Examples
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: spacing.sm,
              marginBottom: spacing.md,
            }}
          >
            {Object.keys(codeExamples).map((lang) => (
              <TouchableOpacity
                key={lang}
                onPress={() => setSelectedLanguage(lang as keyof typeof codeExamples)}
                style={{
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  borderRadius: borderRadius.md,
                  backgroundColor: selectedLanguage === lang ? colors.accent : colors.secondary.bg,
                  borderWidth: 1,
                  borderColor: selectedLanguage === lang ? colors.accent : colors.border.light,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: selectedLanguage === lang ? colors.text.primary : colors.text.secondary,
                    textTransform: "capitalize",
                  }}
                >
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View
            style={{
              backgroundColor: colors.background.primary,
              borderRadius: borderRadius.md,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: spacing.sm }}>
              <TouchableOpacity
                onPress={() => copyToClipboard(codeExamples[selectedLanguage])}
                style={{
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                  borderRadius: borderRadius.sm,
                  backgroundColor: colors.secondary.bg,
                }}
              >
                <MaterialIcons name="content-copy" size={16} color={colors.accent} />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                color: colors.text.primary,
                lineHeight: 20,
              }}
            >
              {codeExamples[selectedLanguage]}
            </Text>
          </View>
        </View>

        {/* Additional Resources */}
        <View
          style={{
            marginTop: spacing["2xl"],
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
            <MaterialIcons name="book" size={24} color={colors.accent} />
            <Text
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginLeft: spacing.sm,
              }}
            >
              Additional Resources
            </Text>
          </View>
          <View style={{ gap: spacing.md }}>
            {[
              {
                title: "GitHub Repository",
                description: "View source code and contribute",
                icon: "code",
                link: "https://github.com/bdn/sdk",
              },
              {
                title: "API Reference",
                description: "Complete API documentation",
                icon: "menu-book",
                link: "/developer/api-docs",
              },
              {
                title: "Changelog",
                description: "View SDK version history",
                icon: "history",
                link: "#",
              },
            ].map((resource, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: spacing.md,
                  borderBottomWidth: index < 2 ? 1 : 0,
                  borderBottomColor: colors.border.light,
                }}
              >
                <MaterialIcons name={resource.icon as any} size={20} color={colors.accent} style={{ marginRight: spacing.md }} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.text.primary,
                      marginBottom: spacing.xs,
                    }}
                  >
                    {resource.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.secondary,
                    }}
                  >
                    {resource.description}
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

