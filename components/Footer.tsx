import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions, Linking } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export const Footer: React.FC = () => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/public_pages/features" },
        { label: "BDN+", href: "/public_pages/pricing" },
        { label: "Updates", href: "/public_pages/updates" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/public_pages/about" },
        { label: "Blog", href: "/public_pages/blog" },
        { label: "Careers", href: "/public_pages/careers" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/public_pages/docs" },
        { label: "Support", href: "/pages/support" },
        { label: "Community", href: "/public_pages/community" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/public_pages/privacy" },
        { label: "Terms", href: "/public_pages/terms" },
        { label: "Security", href: "/public_pages/security" },
      ],
    },
  ];

  const socialLinks = [
    { label: "Facebook", icon: "facebook", url: "https://facebook.com" },
    { label: "Twitter", icon: "twitter", url: "https://twitter.com" },
    { label: "Instagram", icon: "instagram", url: "https://instagram.com" },
    { label: "TikTok", icon: "music", url: "https://tiktok.com" },
    { label: "LinkedIn", icon: "linkedin", url: "https://linkedin.com" },
    { label: "Fanbase", icon: "account-heart", url: "https://fanbase.app" },
    { label: "The Blacktube", icon: "youtube", url: "https://youtube.com" },
  ];

  return (
    <View
      style={{
        backgroundColor: "#000000",
        borderTopWidth: 1,
        borderTopColor: "#474747",
        paddingTop: isMobile ? 40 : 60,
        paddingBottom: isMobile ? 32 : 40,
        paddingHorizontal: isMobile ? 20 : 40,
      }}
    >
      <View
        style={{
          maxWidth: 1200,
          alignSelf: "center",
          width: "100%",
        }}
      >
        {/* Main Footer Content */}
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            marginBottom: isMobile ? 40 : 48,
            gap: isMobile ? 40 : 60,
          }}
        >
          {/* Brand Section */}
          <View 
            style={{ 
              width: isMobile ? "100%" : isTablet ? "35%" : "40%",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: "#ba9988",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "800", color: "#ffffff" }}>B</Text>
              </View>
            <Text
              style={{
                fontSize: isMobile ? 24 : 28,
                fontWeight: "800",
                color: "#ffffff",
                letterSpacing: -0.5,
              }}
            >
              BDN
            </Text>
            </View>
            <Text
              style={{
                fontSize: isMobile ? 14 : 15,
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: 22,
                marginBottom: 24,
              }}
            >
              Empowering Black Excellence through innovation, collaboration, and opportunity.
            </Text>
            {/* Social Links */}
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {socialLinks.map((social) => (
                <TouchableOpacity
                  key={social.label}
                  onPress={() => Linking.openURL(social.url)}
                  activeOpacity={0.7}
                    style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: "rgba(186, 153, 136, 0.1)",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    alignItems: "center",
                    justifyContent: "center",
                    }}
                  >
                  <MaterialCommunityIcons 
                    name={social.icon as any} 
                    size={20} 
                    color="#ba9988" 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Footer Links Grid */}
          {isMobile ? (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                gap: 24,
              }}
            >
              {/* Column 1: Product & Company */}
              <View style={{ flex: 1 }}>
                {footerSections.slice(0, 2).map((section) => (
                  <View key={section.title} style={{ marginBottom: 32 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 16,
                        letterSpacing: 0.3,
                      }}
                    >
                      {section.title}
                    </Text>
                    <View style={{ gap: 12 }}>
                      {section.links.map((link) => (
                        <TouchableOpacity 
                          key={link.label}
                          activeOpacity={0.7}
                          onPress={() => {
                            if (link.href) {
                              router.push(link.href as any);
                            }
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              color: "rgba(255, 255, 255, 0.7)",
                              lineHeight: 20,
                            }}
                          >
                            {link.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </View>

              {/* Column 2: Resources & Legal */}
              <View style={{ flex: 1 }}>
                {footerSections.slice(2, 4).map((section) => (
                  <View key={section.title} style={{ marginBottom: 32 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 16,
                        letterSpacing: 0.3,
                      }}
                    >
                      {section.title}
                    </Text>
                    <View style={{ gap: 12 }}>
                      {section.links.map((link) => (
                        <TouchableOpacity 
                          key={link.label}
                          activeOpacity={0.7}
                          onPress={() => {
                            if (link.href) {
                              router.push(link.href as any);
                            }
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              color: "rgba(255, 255, 255, 0.7)",
                              lineHeight: 20,
                            }}
                          >
                            {link.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 40,
              }}
            >
              {footerSections.map((section) => (
                <View 
                  key={section.title} 
                  style={{ 
                    flex: 1,
                    minWidth: 120,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 16,
                      letterSpacing: 0.3,
                    }}
                  >
                    {section.title}
                  </Text>
                  <View style={{ gap: 12 }}>
                    {section.links.map((link) => (
                      <TouchableOpacity 
                        key={link.label}
                        activeOpacity={0.7}
                        onPress={() => {
                          if (link.href) {
                            router.push(link.href as any);
                          }
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            color: "rgba(255, 255, 255, 0.7)",
                            lineHeight: 20,
                          }}
                        >
                          {link.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Bottom Bar */}
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#474747",
            paddingTop: isMobile ? 24 : 32,
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? 16 : 0,
          }}
        >
          <Text
            style={{
              fontSize: isMobile ? 12 : 14,
              color: "rgba(255, 255, 255, 0.5)",
              lineHeight: 20,
            }}
          >
            © 2024 Black Dollar Network. All rights reserved.
          </Text>
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 12 : 24,
              alignItems: isMobile ? "flex-start" : "center",
            }}
          >
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => router.push("/public_pages/privacy")}
            >
              <Text
                style={{
                  fontSize: isMobile ? 12 : 14,
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                Privacy Policy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => router.push("/public_pages/terms")}
            >
              <Text
                style={{
                  fontSize: isMobile ? 12 : 14,
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                Terms of Service
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

