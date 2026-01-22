import React from "react";
import { View, Text, useWindowDimensions, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

const TESTIMONIALS = [
  {
    quote: "BDN's digital wallet makes it so easy to support Black businesses. I love being able to track my impact and see how my dollars circulate in the community.",
    author: "Sarah Johnson",
    role: "Consumer • Gold Member",
    rating: 5,
    verified: true,
  },
  {
    quote: "As a business owner, BDN has been a game-changer. The payment processing is seamless, and I've seen a 40% increase in customers since joining the platform.",
    author: "Marcus Williams",
    role: "Business Owner • Tech Solutions LLC",
    rating: 5,
    verified: true,
  },
  {
    quote: "The token system and rewards program keep me engaged. I've leveled up to Diamond tier and the exclusive benefits are incredible. This is the future of Black economic empowerment.",
    author: "Aisha Davis",
    role: "Consumer • Diamond Member",
    rating: 5,
    verified: true,
  },
  {
    quote: "Finding Black-owned businesses used to be so difficult. Now with BDN's directory, I can discover amazing businesses in seconds and support them directly through the app.",
    author: "James Thompson",
    role: "Consumer • Silver Member",
    rating: 5,
    verified: true,
  },
  {
    quote: "The security and ease of use are top-notch. I feel confident making payments through BDN, and the customer support is always responsive when I need help.",
    author: "Michelle Brown",
    role: "Consumer • Bronze Member",
    rating: 5,
    verified: true,
  },
  {
    quote: "BDN has helped me connect with customers I never would have reached. The platform's marketing tools and analytics have been invaluable for growing my business.",
    author: "David Wilson",
    role: "Business Owner • Heritage Boutique",
    rating: 5,
    verified: true,
  },
];

export const TestimonialsSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <ScrollAnimatedView delay={800}>
      <View
        style={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingVertical: isMobile ? 60 : 80,
          backgroundColor: "#1a1a1a",
        }}
      >
        <View
          style={{
            maxWidth: 1200,
            alignSelf: "center",
            width: "100%",
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 16 }}>
            {/* Badge */}
            <View
              style={{
                backgroundColor: "rgba(186, 153, 136, 0.15)",
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: "#ba9988",
                  letterSpacing: 1,
                }}
              >
                WORD OF MOUTH
              </Text>
            </View>
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
              What Our Community Says
            </Text>
          </View>
          <Text
            style={{
              fontSize: isMobile ? 16 : 18,
              color: "rgba(255, 255, 255, 0.7)",
              textAlign: "center",
              marginBottom: isMobile ? 40 : 60,
              maxWidth: isMobile ? 600 : 900,
              alignSelf: "center",
              width: "100%",
            }}
          >
            Join thousands of members who are transforming their futures with BDN.
          </Text>

          {/* Testimonials Grid */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingRight: isMobile ? 0 : 20,
              gap: 20,
            }}
          >
            {TESTIMONIALS.map((testimonial, index) => (
              <View
                key={index}
                style={{
                  width: isMobile ? width - 80 : 380,
                  backgroundColor: "rgba(71, 71, 71, 0.4)",
                  borderRadius: 20,
                  padding: isMobile ? 24 : 32,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  elevation: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: isMobile ? 15 : 16,
                    color: "rgba(255, 255, 255, 0.9)",
                    lineHeight: 24,
                    marginBottom: 24,
                  }}
                >
                  {testimonial.quote}
                </Text>
                <View
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: "rgba(186, 153, 136, 0.2)",
                    paddingTop: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#ffffff",
                    }}
                  >
                    {testimonial.author}
                  </Text>
                    {testimonial.verified && (
                      <MaterialIcons name="verified" size={18} color="#ba9988" />
                    )}
                  </View>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#ba9988",
                    }}
                  >
                    {testimonial.role}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};

