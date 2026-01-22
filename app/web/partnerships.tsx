import React from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Linking } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PublicHeroSection } from '@/components/layouts/PublicHeroSection';
import { ScrollAnimatedView } from '@/components/ScrollAnimatedView';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

interface Partner {
  id: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  category: "technology" | "financial" | "education" | "community" | "media";
}

const partners: Partner[] = [
  {
    id: "1",
    name: "TechCorp Solutions",
    description: "Leading provider of payment processing infrastructure and financial technology solutions.",
    category: "technology",
    website: "https://example.com",
  },
  {
    id: "2",
    name: "Black Business Network",
    description: "National organization supporting Black-owned businesses through networking and resources.",
    category: "community",
    website: "https://example.com",
  },
  {
    id: "3",
    name: "Financial Empowerment Institute",
    description: "Nonprofit focused on financial literacy and economic empowerment in Black communities.",
    category: "education",
    website: "https://example.com",
  },
  {
    id: "4",
    name: "Community Credit Union",
    description: "Financial institution dedicated to serving underserved communities with fair banking services.",
    category: "financial",
    website: "https://example.com",
  },
  {
    id: "5",
    name: "Black Media Collective",
    description: "Media platform amplifying Black voices and stories across digital channels.",
    category: "media",
    website: "https://example.com",
  },
  {
    id: "6",
    name: "Innovation Labs",
    description: "Technology incubator supporting Black entrepreneurs and startups.",
    category: "technology",
    website: "https://example.com",
  },
];

const partnerCategories = [
  { key: "all", label: "All Partners", icon: "business" },
  { key: "technology", label: "Technology", icon: "computer" },
  { key: "financial", label: "Financial", icon: "account-balance" },
  { key: "education", label: "Education", icon: "school" },
  { key: "community", label: "Community", icon: "groups" },
  { key: "media", label: "Media", icon: "campaign" },
];

export default function Partnerships() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width < 768;
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  const filteredPartners = selectedCategory === "all"
    ? partners
    : partners.filter((partner) => partner.category === selectedCategory);

  const handlePartnerClick = (partner: Partner) => {
    if (partner.website) {
      Linking.openURL(partner.website);
    }
  };

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
          title="Our Partners"
          subtitle="We're proud to collaborate with organizations and companies that share our mission of empowering Black communities through economic growth and opportunity."
        />

        {/* Category Filters */}
        <ScrollAnimatedView delay={200}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingVertical: 20,
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
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ 
                  gap: 12,
                  justifyContent: isMobile ? "flex-start" : "center",
                }}
              >
                {partnerCategories.map((category) => (
                  <TouchableOpacity
                    key={category.key}
                    onPress={() => setSelectedCategory(category.key)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Filter partners by ${category.label.toLowerCase()}`}
                    accessibilityHint={`Double tap to ${selectedCategory === category.key ? "deselect" : "select"} ${category.label.toLowerCase()} filter`}
                    accessibilityState={{ selected: selectedCategory === category.key }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{
                      backgroundColor: selectedCategory === category.key ? "#ba9988" : "#474747",
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: selectedCategory === category.key ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      minHeight: 44,
                      minWidth: 44,
                    }}
                  >
                    <MaterialIcons 
                      name={category.icon as any} 
                      size={16} 
                      color={selectedCategory === category.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)"} 
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: selectedCategory === category.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Partners Grid */}
        <ScrollAnimatedView delay={300}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingBottom: 80,
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
              {filteredPartners.length > 0 ? (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: isMobile ? 20 : 24,
                  }}
                >
                  {filteredPartners.map((partner) => (
                    <TouchableOpacity
                      key={partner.id}
                      onPress={() => handlePartnerClick(partner)}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={`View partner: ${partner.name}`}
                      accessibilityHint={partner.website ? "Double tap to visit partner website" : "Double tap to view partner details"}
                      activeOpacity={0.8}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={{
                        flex: 1,
                        minWidth: isMobile ? "100%" : "45%",
                        maxWidth: isMobile ? "100%" : "48%",
                        backgroundColor: "rgba(71, 71, 71, 0.4)",
                        borderRadius: 20,
                        padding: isMobile ? 24 : 32,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.3)",
                        alignItems: "center",
                        gap: 16,
                        minHeight: 44,
                      }}
                    >
                      {/* Logo Placeholder */}
                      <View
                        style={{
                          width: isMobile ? 80 : 100,
                          height: isMobile ? 80 : 100,
                          borderRadius: 16,
                          backgroundColor: "rgba(186, 153, 136, 0.15)",
                          alignItems: "center",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: "rgba(186, 153, 136, 0.2)",
                        }}
                      >
                        {partner.logo ? (
                          <Image
                            source={{ uri: partner.logo }}
                            accessible={true}
                            accessibilityRole="image"
                            accessibilityLabel={`Logo for ${partner.name}`}
                            style={{ width: "100%", height: "100%" }}
                            contentFit="contain"
                          />
                        ) : (
                          <MaterialIcons name="business" size={isMobile ? 40 : 50} color="#ba9988" />
                        )}
                      </View>

                      {/* Partner Name */}
                      <Text
                        style={{
                          fontSize: isMobile ? 20 : 24,
                          fontWeight: "700",
                          color: "#ffffff",
                          textAlign: "center",
                        }}
                      >
                        {partner.name}
                      </Text>

                      {/* Category Badge */}
                      <View
                        style={{
                          backgroundColor: "rgba(186, 153, 136, 0.15)",
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "600",
                            color: "#ba9988",
                            textTransform: "capitalize",
                          }}
                        >
                          {partner.category}
                        </Text>
                      </View>

                      {/* Description */}
                      <Text
                        style={{
                          fontSize: 14,
                          color: "rgba(255, 255, 255, 0.7)",
                          textAlign: "center",
                          lineHeight: 22,
                        }}
                      >
                        {partner.description}
                      </Text>

                      {/* Visit Website Link */}
                      {partner.website && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                            marginTop: 8,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "600",
                              color: "#ba9988",
                            }}
                          >
                            Visit Website
                          </Text>
                          <MaterialIcons name="arrow-forward" size={16} color="#ba9988" />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: "rgba(71, 71, 71, 0.4)",
                    borderRadius: 16,
                    padding: 40,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.3)",
                  }}
                >
                  <MaterialIcons name="business" size={48} color="rgba(186, 153, 136, 0.5)" />
                  <Text
                    style={{
                      fontSize: 16,
                      color: "rgba(255, 255, 255, 0.6)",
                      textAlign: "center",
                      marginTop: 16,
                    }}
                  >
                    No partners found for this category
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Become a Partner CTA */}
        <ScrollAnimatedView delay={400}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingBottom: 40,
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
              <View
                style={{
                  backgroundColor: "rgba(71, 71, 71, 0.4)",
                  borderRadius: 20,
                  padding: isMobile ? 32 : 48,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="handshake" size={48} color="#ba9988" style={{ marginBottom: 16 }} />
                <Text
                  style={{
                    fontSize: isMobile ? 24 : 28,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 12,
                    textAlign: "center",
                  }}
                >
                  Interested in Partnering?
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "rgba(255, 255, 255, 0.7)",
                    textAlign: "center",
                    marginBottom: 24,
                    maxWidth: 600,
                  }}
                >
                  Join us in building economic power and creating lasting impact in Black communities. Let's work together to empower businesses and strengthen our economy.
                </Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL("mailto:partnerships@bdn.com")}
                  accessible={true}
                  accessibilityRole="link"
                  accessibilityLabel="Contact partnerships team via email"
                  accessibilityHint="Double tap to open email client"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{
                    backgroundColor: "#ba9988",
                    paddingHorizontal: 32,
                    paddingVertical: 14,
                    borderRadius: 12,
                    minHeight: 44,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    Contact Partnerships
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        <Footer />
      </OptimizedScrollView>
    </View>
  );
}
