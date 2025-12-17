import React from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/layouts/HeroSection';
import { ScrollAnimatedView } from '@/components/ScrollAnimatedView';

const openPositions = [
  {
    id: "1",
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Build and scale our fintech platform. Work with React Native, Node.js, and modern cloud infrastructure.",
  },
  {
    id: "2",
    title: "Product Designer",
    department: "Design",
    location: "Remote / Hybrid",
    type: "Full-time",
    description: "Design beautiful, intuitive experiences that empower Black businesses and consumers.",
  },
  {
    id: "3",
    title: "Community Manager",
    department: "Community",
    location: "Remote",
    type: "Full-time",
    description: "Build and nurture our community, create engaging content, and support our members.",
  },
  {
    id: "4",
    title: "Business Development Manager",
    department: "Business",
    location: "Remote / Hybrid",
    type: "Full-time",
    description: "Partner with Black-owned businesses to grow our network and drive economic impact.",
  },
];

const benefits = [
  {
    icon: "health-and-safety",
    title: "Health & Wellness",
    description: "Comprehensive health, dental, and vision insurance",
  },
  {
    icon: "savings",
    title: "401(k) Matching",
    description: "Company-matched retirement savings plan",
  },
  {
    icon: "flight",
    title: "Flexible PTO",
    description: "Unlimited paid time off and flexible work arrangements",
  },
  {
    icon: "school",
    title: "Learning & Development",
    description: "Budget for courses, conferences, and professional growth",
  },
  {
    icon: "home",
    title: "Remote Work",
    description: "Work from anywhere with flexible schedules",
  },
  {
    icon: "diversity-3",
    title: "Inclusive Culture",
    description: "Join a team committed to diversity, equity, and inclusion",
  },
];

export default function Careers() {
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
          paddingBottom: isMobile ? insets.bottom + 40 : 40,
        }}
      >
        <HeroSection
          title="Join Our Team"
          subtitle="Help us build economic power and create lasting change in Black communities."
        />

        {/* Why Work Here */}
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
                maxWidth: 1000,
                alignSelf: "center",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: isMobile ? 32 : 44,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 24,
                  textAlign: "center",
                  letterSpacing: -0.5,
                }}
              >
                Why Work at BDN?
              </Text>
              <Text
                style={{
                  fontSize: isMobile ? 16 : 18,
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: isMobile ? 26 : 30,
                  textAlign: "center",
                  marginBottom: 48,
                }}
              >
                We're building the future of Black economic empowerment. Join a mission-driven team creating real impact in our communities.
              </Text>

              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  flexWrap: "wrap",
                  gap: 24,
                }}
              >
                {benefits.map((benefit, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      minWidth: isMobile ? "100%" : "30%",
                      backgroundColor: "#474747",
                      borderRadius: 16,
                      padding: 24,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  >
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        backgroundColor: "rgba(186, 153, 136, 0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                      }}
                    >
                      <MaterialIcons name={benefit.icon as any} size={24} color="#ba9988" />
                    </View>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      {benefit.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: 22,
                      }}
                    >
                      {benefit.description}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Open Positions */}
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
                maxWidth: 1000,
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
                Open Positions
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.7)",
                  textAlign: "center",
                  marginBottom: 48,
                }}
              >
                Explore opportunities to join our growing team
              </Text>

              <View style={{ gap: 20 }}>
                {openPositions.map((position) => (
                  <View
                    key={position.id}
                    style={{
                      backgroundColor: "#474747",
                      borderRadius: 16,
                      padding: isMobile ? 24 : 32,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: isMobile ? "column" : "row",
                        justifyContent: "space-between",
                        alignItems: isMobile ? "flex-start" : "center",
                        marginBottom: 16,
                        gap: 12,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: isMobile ? 22 : 26,
                            fontWeight: "700",
                            color: "#ffffff",
                            marginBottom: 8,
                            letterSpacing: -0.5,
                          }}
                        >
                          {position.title}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 12,
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: "rgba(186, 153, 136, 0.15)",
                              paddingHorizontal: 10,
                              paddingVertical: 4,
                              borderRadius: 6,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                fontWeight: "600",
                                color: "#ba9988",
                              }}
                            >
                              {position.department}
                            </Text>
                          </View>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                            <MaterialIcons name="location-on" size={16} color="rgba(255, 255, 255, 0.5)" />
                            <Text
                              style={{
                                fontSize: 14,
                                color: "rgba(255, 255, 255, 0.7)",
                              }}
                            >
                              {position.location}
                            </Text>
                          </View>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                            <MaterialIcons name="schedule" size={16} color="rgba(255, 255, 255, 0.5)" />
                            <Text
                              style={{
                                fontSize: 14,
                                color: "rgba(255, 255, 255, 0.7)",
                              }}
                            >
                              {position.type}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#ba9988",
                          paddingHorizontal: 24,
                          paddingVertical: 12,
                          borderRadius: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#ffffff",
                          }}
                        >
                          Apply
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: 24,
                      }}
                    >
                      {position.description}
                    </Text>
                  </View>
                ))}
              </View>

              <View
                style={{
                  marginTop: 48,
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 32,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <MaterialIcons name="email" size={48} color="rgba(186, 153, 136, 0.5)" />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginTop: 16,
                    marginBottom: 8,
                  }}
                >
                  Don't see a role that fits?
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "rgba(255, 255, 255, 0.7)",
                    textAlign: "center",
                    marginBottom: 24,
                  }}
                >
                  We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#ba9988",
                    paddingHorizontal: 32,
                    paddingVertical: 12,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    Send Resume
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        <Footer />
      </ScrollView>
    </View>
  );
}

