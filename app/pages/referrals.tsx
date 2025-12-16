import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Platform } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import QRCode from "react-native-qrcode-svg";

// Mock referral data
const mockReferrals = [
  { name: "Sarah Johnson", joined: "2024-01-15", status: "active", points: 250 },
  { name: "Marcus Williams", joined: "2024-02-03", status: "active", points: 500 },
  { name: "Aisha Davis", joined: "2024-02-20", status: "pending", points: 0 },
];

export default function Referrals() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const referralCode = "BDN-JOHN-2024";
  const referralLink = `https://bdn.app/invite/${referralCode}`;
  const totalEarned = mockReferrals.reduce((sum, ref) => sum + ref.points, 0);

  const handleShare = () => {
    // TODO: Implement share functionality
    alert(`Share your referral code: ${referralCode}`);
  };

  const handleCopy = () => {
    // TODO: Implement copy to clipboard
    alert("Referral code copied to clipboard!");
  };

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
        <View
          style={{
            maxWidth: 800,
            width: "100%",
            alignSelf: "center",
          }}
        >
          {/* Stats Card */}
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 20,
              padding: 24,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <View
              style={{
                flexDirection: isMobile ? "column" : "row",
                gap: 24,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: 8,
                  }}
                >
                  Total Referrals
                </Text>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: "700",
                    color: "#ba9988",
                  }}
                >
                  {mockReferrals.length}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: 8,
                  }}
                >
                  Points Earned
                </Text>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: "700",
                    color: "#ba9988",
                  }}
                >
                  {totalEarned.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Referral Code Card */}
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 20,
              padding: 24,
              marginBottom: 32,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: 16,
              }}
            >
              Your Referral Code
            </Text>
            <View
              style={{
                flexDirection: isMobile ? "column" : "row",
                gap: 20,
                marginBottom: 20,
              }}
            >
              {/* QR Code */}
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: "#232323",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <QRCode
                  value={referralLink}
                  size={isMobile ? 180 : 200}
                  color="#ffffff"
                  backgroundColor="transparent"
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.6)",
                    marginTop: 12,
                    textAlign: "center",
                  }}
                >
                  Scan to invite
                </Text>
              </View>

              {/* Referral Code & Actions */}
              <View style={{ flex: 1, gap: 16 }}>
                <View
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: 8,
                    }}
                  >
                    Referral Code
                  </Text>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "700",
                      color: "#ba9988",
                      textAlign: "center",
                      letterSpacing: 2,
                    }}
                  >
                    {referralCode}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: 8,
                    }}
                  >
                    Referral Link
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#ffffff",
                      textAlign: "center",
                    }}
                    numberOfLines={2}
                  >
                    {referralLink}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                  }}
                >
                  <TouchableOpacity
                    onPress={handleCopy}
                    style={{
                      flex: 1,
                      backgroundColor: "#ba9988",
                      borderRadius: 12,
                      paddingVertical: 14,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#ffffff",
                      }}
                    >
                      Copy Code
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleShare}
                    style={{
                      flex: 1,
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      paddingVertical: 14,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#ba9988",
                      }}
                    >
                      Share Link
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* How It Works */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 20,
              }}
            >
              How It Works
            </Text>
            <View style={{ gap: 16 }}>
              {[
                { step: "1", title: "Share Your Code", description: "Share your unique referral code with friends and family" },
                { step: "2", title: "They Join BDN", description: "Your referrals sign up using your code" },
                { step: "3", title: "Earn Rewards", description: "You both earn points when they make their first transaction" },
              ].map((item) => (
                <View
                  key={item.step}
                  style={{
                    flexDirection: "row",
                    gap: 16,
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: "#ba9988",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: "#ffffff",
                      }}
                    >
                      {item.step}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      {item.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Referrals List */}
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 20,
              }}
            >
              Your Referrals
            </Text>
            {mockReferrals.length > 0 ? (
              <View style={{ gap: 12 }}>
                {mockReferrals.map((referral, index) => (
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
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#ffffff",
                            marginBottom: 4,
                          }}
                        >
                          {referral.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          Joined {new Date(referral.joined).toLocaleDateString()}
                        </Text>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <View
                          style={{
                            backgroundColor: referral.status === "active" ? "rgba(186, 153, 136, 0.2)" : "rgba(255, 255, 255, 0.1)",
                            borderRadius: 12,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            marginBottom: 8,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 11,
                              fontWeight: "600",
                              color: referral.status === "active" ? "#ba9988" : "rgba(255, 255, 255, 0.6)",
                              textTransform: "uppercase",
                            }}
                          >
                            {referral.status}
                          </Text>
                        </View>
                        {referral.points > 0 && (
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "600",
                              color: "#ba9988",
                            }}
                          >
                            +{referral.points} pts
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 40,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <MaterialIcons name="people" size={48} color="#ba9988" style={{ marginBottom: 16 }} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  No Referrals Yet
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    textAlign: "center",
                  }}
                >
                  Start sharing your referral code to earn rewards!
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

