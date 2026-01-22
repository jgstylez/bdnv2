import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TextInput, TouchableOpacity, Alert, Linking } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PublicHeroSection } from '@/components/layouts/PublicHeroSection';
import { ScrollAnimatedView } from '@/components/ScrollAnimatedView';
import { DecorativePattern } from '@/components/placeholders/SVGPlaceholders';

type UserType = "consumer" | "business" | "nonprofit" | "general";

export default function Contact() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width < 768;
  const [userType, setUserType] = useState<UserType>("general");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      Alert.alert("Required Fields", "Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    // TODO: Integrate with contact form API
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert("Thank You", "We've received your message and will get back to you soon!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  const contactMethods = [
    {
      icon: "email",
      title: "Email",
      value: "support@blackdollarnetwork.com",
      action: "mailto:support@blackdollarnetwork.com",
    },
    {
      icon: "phone",
      title: "Phone",
      value: "+1 (555) 123-4567",
      action: "tel:+15551234567",
    },
    {
      icon: "schedule",
      title: "Hours",
      value: "Monday - Friday, 9AM - 6PM EST",
      action: null,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <Navigation />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: isMobile ? insets.bottom : 0,
        }}
      >
        <PublicHeroSection
          title="Get in Touch"
          subtitle="Have questions? We're here to help. Reach out and let's connect."
        />

        {/* User Type Selector */}
        <ScrollAnimatedView delay={100}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingVertical: isMobile ? 40 : 60,
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
                  fontSize: isMobile ? 16 : 18,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                I'm contacting as:
              </Text>
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { key: "consumer", label: "Consumer" },
                  { key: "business", label: "Business" },
                  { key: "nonprofit", label: "Nonprofit" },
                  { key: "general", label: "General Inquiry" },
                ].map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    onPress={() => setUserType(type.key as UserType)}
                    style={{
                      backgroundColor: userType === type.key ? "#ba9988" : "#474747",
                      paddingHorizontal: 24,
                      paddingVertical: 12,
                      borderRadius: 12,
                      borderWidth: userType === type.key ? 0 : 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: userType === type.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {userType === "business" && (
                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    backgroundColor: "#ba9988",
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    Schedule a Demo →
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Contact Methods */}
        <ScrollAnimatedView delay={200}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingVertical: isMobile ? 40 : 60,
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
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  gap: 24,
                  marginBottom: 60,
                }}
              >
                {contactMethods.map((method, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      backgroundColor: "rgba(71, 71, 71, 0.4)",
                      borderRadius: 16,
                      padding: 24,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.3)",
                      alignItems: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Decorative Pattern */}
                    <View
                      style={{
                        position: "absolute",
                        top: -20,
                        right: -20,
                        opacity: 0.05,
                      }}
                    >
                      <DecorativePattern size={80} opacity={0.05} />
                    </View>
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        backgroundColor: "rgba(186, 153, 136, 0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <MaterialIcons name={method.icon as any} size={28} color="#ba9988" />
                    </View>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      {method.title}
                    </Text>
                    {method.action ? (
                      <TouchableOpacity onPress={() => Linking.openURL(method.action!)}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#ba9988",
                            textAlign: "center",
                          }}
                        >
                          {method.value}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text
                        style={{
                          fontSize: 14,
                          color: "rgba(255, 255, 255, 0.7)",
                          textAlign: "center",
                        }}
                      >
                        {method.value}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Contact Form */}
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
                maxWidth: 800,
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
                Send Us a Message
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.7)",
                  textAlign: "center",
                  marginBottom: 40,
                }}
              >
                Fill out the form below and we'll get back to you as soon as possible.
              </Text>

              <View style={{ gap: 20 }}>
                <View style={{ flexDirection: isMobile ? "column" : "row", gap: 20 }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      Name *
                    </Text>
                    <TextInput
                      value={formData.name}
                      onChangeText={(text) => setFormData({ ...formData, name: text })}
                      placeholder="Your name"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      style={{
                        backgroundColor: "#474747",
                        borderRadius: 12,
                        padding: 16,
                        fontSize: 16,
                        color: "#ffffff",
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      Email *
                    </Text>
                    <TextInput
                      value={formData.email}
                      onChangeText={(text) => setFormData({ ...formData, email: text })}
                      placeholder="your@email.com"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={{
                        backgroundColor: "#474747",
                        borderRadius: 12,
                        padding: 16,
                        fontSize: 16,
                        color: "#ffffff",
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                      }}
                    />
                  </View>
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ffffff",
                      marginBottom: 8,
                    }}
                  >
                    Subject
                  </Text>
                  <TextInput
                    value={formData.subject}
                    onChangeText={(text) => setFormData({ ...formData, subject: text })}
                    placeholder="What's this about?"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    style={{
                      backgroundColor: "#474747",
                      borderRadius: 12,
                      padding: 16,
                      fontSize: 16,
                      color: "#ffffff",
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  />
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ffffff",
                      marginBottom: 8,
                    }}
                  >
                    Message *
                  </Text>
                  <TextInput
                    value={formData.message}
                    onChangeText={(text) => setFormData({ ...formData, message: text })}
                    placeholder="Tell us how we can help..."
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    style={{
                      backgroundColor: "#474747",
                      borderRadius: 12,
                      padding: 16,
                      fontSize: 16,
                      color: "#ffffff",
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                      minHeight: 150,
                    }}
                  />
                </View>

                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: "#ba9988",
                    paddingVertical: 16,
                    borderRadius: 12,
                    alignItems: "center",
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
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

