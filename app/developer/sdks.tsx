import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { DeveloperPageHeader } from '@/components/developer/DeveloperPageHeader';

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
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        <DeveloperPageHeader
          title="SDKs & Examples"
          description="Download SDKs and view code examples"
        />

        {/* SDKs List */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Official SDKs
          </Text>
          <View style={{ gap: 16 }}>
            {sdks.map((sdk, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      backgroundColor: `${sdk.color}20`,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 16,
                    }}
                  >
                    <MaterialIcons name={sdk.icon as any} size={24} color={sdk.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "700",
                          color: "#ffffff",
                        }}
                      >
                        {sdk.name}
                      </Text>
                      <View
                        style={{
                          paddingHorizontal: 4,
                          paddingVertical: 2,
                          borderRadius: 4,
                          backgroundColor: "#ba998820",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "600",
                            color: "#ba9988",
                          }}
                        >
                          v{sdk.version}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                        marginBottom: 8,
                      }}
                    >
                      {sdk.description}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#232323",
                        borderRadius: 8,
                        padding: 8,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 14,
                          fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                          color: "#ffffff",
                        }}
                      >
                        {sdk.install}
                      </Text>
                      <TouchableOpacity
                        onPress={() => copyToClipboard(sdk.install)}
                        style={{
                          marginLeft: 8,
                          padding: 4,
                          borderRadius: 4,
                          backgroundColor: "#ba998820",
                        }}
                      >
                        <MaterialIcons name="content-copy" size={16} color="#ba9988" />
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
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Quick Start Examples
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              marginBottom: 16,
            }}
          >
            {Object.keys(codeExamples).map((lang) => (
              <TouchableOpacity
                key={lang}
                onPress={() => setSelectedLanguage(lang as keyof typeof codeExamples)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: selectedLanguage === lang ? "#ba9988" : "#474747",
                  borderWidth: 1,
                  borderColor: selectedLanguage === lang ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: selectedLanguage === lang ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
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
              backgroundColor: "#232323",
              borderRadius: 8,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 8 }}>
              <TouchableOpacity
                onPress={() => copyToClipboard(codeExamples[selectedLanguage])}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                  backgroundColor: "#474747",
                }}
              >
                <MaterialIcons name="content-copy" size={16} color="#ba9988" />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                color: "#ffffff",
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
            marginTop: 32,
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <MaterialIcons name="book" size={24} color="#ba9988" />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#ffffff",
                marginLeft: 8,
              }}
            >
              Additional Resources
            </Text>
          </View>
          <View style={{ gap: 16 }}>
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
                  paddingVertical: 16,
                  borderBottomWidth: index < 2 ? 1 : 0,
                  borderBottomColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <MaterialIcons name={resource.icon as any} size={20} color="#ba9988" style={{ marginRight: 16 }} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#ffffff",
                      marginBottom: 4,
                    }}
                  >
                    {resource.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {resource.description}
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="rgba(255, 255, 255, 0.5)" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

