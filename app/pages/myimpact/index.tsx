import React from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ImpactSummary } from '@/types/impact';
import { HeroSection } from '@/components/layouts/HeroSection';

// Mock impact summary
const mockImpactSummary: ImpactSummary = {
  totalPoints: 12500,
  lifetimeCashback: 342.50,
  totalDonations: 1250.00,
  referralCount: 12,
  sponsorshipEarnings: 89.25,
  currentLevel: "Bronze",
  pointsToNextLevel: 3750,
};

// Mock recent activity data
const mockRecentActivity = [
  {
    icon: 'shopping-cart' as const,
    description: 'Purchase at Soul Food Kitchen',
    timestamp: '2h ago',
    amount: '-$45.00',
    color: '#ba9988',
  },
  {
    icon: 'event' as const,
    description: 'Event RSVP: Jazz & Soul Food Night',
    timestamp: 'Yesterday',
    amount: '-$22.00',
    color: '#e91e63',
  },
  {
    icon: 'people' as const,
    description: 'Referral: Sarah M. joined',
    timestamp: '3 days ago',
    amount: '+$5.00',
    color: '#4caf50',
  },
  {
    icon: 'card-giftcard' as const,
    description: 'Sent Gift Card to John D.',
    timestamp: '5 days ago',
    amount: '-$50.00',
    color: '#9c27b0',
  },
  {
    icon: 'favorite' as const,
    description: 'Donation to Black Art Collective',
    timestamp: '1 week ago',
    amount: '-$25.00',
    color: '#f44336',
  },
  {
    icon: 'account-balance-wallet' as const,
    description: 'Tokens Purchased',
    timestamp: '1 week ago',
    amount: '+$100.00',
    color: '#ffd700',
  },
];

const USER_LEVELS = {
  Basic: { color: "#8d8d8d", minPoints: 0 },
  Bronze: { color: "#cd7f32", minPoints: 1000 },
  Silver: { color: "#c0c0c0", minPoints: 5000 },
  Gold: { color: "#ffd700", minPoints: 15000 },
  Diamond: { color: "#b9f2ff", minPoints: 50000 },
  "Black Diamond": { color: "#000000", minPoints: 100000 },
};

export default function MyImpact() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;

  const levelInfo = USER_LEVELS[mockImpactSummary.currentLevel as keyof typeof USER_LEVELS] || USER_LEVELS.Basic;
  const progress = ((mockImpactSummary.totalPoints - levelInfo.minPoints) / (mockImpactSummary.pointsToNextLevel + levelInfo.minPoints - levelInfo.minPoints)) * 100;

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
        {/* Hero Section */}
        <HeroSection
          title="My Impact"
          subtitle="Track your contributions, earnings, and community impact"
        />

        {/* Impact Points Card and Quick Stats */}
        {isMobile ? (
          <>
            {/* Impact Points Card */}
            <View
              style={{
                backgroundColor: "#474747",
                borderRadius: 20,
                padding: 24,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                overflow: "hidden",
              }}
            >
              <LinearGradient
                colors={["rgba(186, 153, 136, 0.15)", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: 4,
                    }}
                  >
                    Impact Points
                  </Text>
                  <Text
                    style={{
                      fontSize: 36,
                      fontWeight: "800",
                      color: "#ba9988",
                      letterSpacing: -1,
                    }}
                  >
                    {mockImpactSummary.totalPoints.toLocaleString()}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: `${levelInfo.color}20`,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: levelInfo.color,
                      textTransform: "uppercase",
                    }}
                  >
                    {mockImpactSummary.currentLevel}
                  </Text>
                </View>
              </View>
              <View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
                    {mockImpactSummary.totalPoints.toLocaleString()} / {(levelInfo.minPoints + mockImpactSummary.pointsToNextLevel).toLocaleString()} points
                  </Text>
                  <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
                    {Math.round(progress)}% to next level
                  </Text>
                </View>
                <View
                  style={{
                    height: 8,
                    backgroundColor: "#232323",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: "#ba9988",
                      borderRadius: 4,
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Quick Stats - Mobile: 2 rows × 2 columns */}
            <View style={{ gap: 12, marginBottom: 24 }}>
            {/* Row 1 */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <MaterialIcons name="account-balance-wallet" size={20} color="#ba9988" />
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Cashback
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "700",
                    color: "#ba9988",
                  }}
                >
                  ${mockImpactSummary.lifetimeCashback.toFixed(2)}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <MaterialIcons name="favorite" size={20} color="#ba9988" />
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Donations
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "700",
                    color: "#ba9988",
                  }}
                >
                  ${mockImpactSummary.totalDonations.toFixed(2)}
                </Text>
              </View>
            </View>
            {/* Row 2 */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <MaterialIcons name="people" size={20} color="#ba9988" />
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Referrals
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "700",
                    color: "#ba9988",
                  }}
                >
                  {mockImpactSummary.referralCount}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <MaterialIcons name="trending-up" size={20} color="#ba9988" />
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                      flex: 1,
                    }}
                  >
                    Sponsorship
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "700",
                    color: "#ba9988",
                  }}
                >
                  ${mockImpactSummary.sponsorshipEarnings.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
          </>
        ) : (
          /* Desktop: Impact Points in first column, 2x2 grid in second column */
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginBottom: 24,
              alignItems: "stretch",
            }}
          >
            {/* Column 1: Impact Points - Full Width, Full Height */}
            <View
              style={{
                flex: 1,
                backgroundColor: "#474747",
                borderRadius: 20,
                padding: 24,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                overflow: "hidden",
              }}
            >
              <LinearGradient
                colors={["rgba(186, 153, 136, 0.15)", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: 4,
                    }}
                  >
                    Impact Points
                  </Text>
                  <Text
                    style={{
                      fontSize: 36,
                      fontWeight: "800",
                      color: "#ba9988",
                      letterSpacing: -1,
                    }}
                  >
                    {mockImpactSummary.totalPoints.toLocaleString()}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: `${levelInfo.color}20`,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: levelInfo.color,
                      textTransform: "uppercase",
                    }}
                  >
                    {mockImpactSummary.currentLevel}
                  </Text>
                </View>
              </View>
              <View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
                    {mockImpactSummary.totalPoints.toLocaleString()} / {(levelInfo.minPoints + mockImpactSummary.pointsToNextLevel).toLocaleString()} points
                  </Text>
                  <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
                    {Math.round(progress)}% to next level
                  </Text>
                </View>
                <View
                  style={{
                    height: 8,
                    backgroundColor: "#232323",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: "#ba9988",
                      borderRadius: 4,
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Column 2: 2x2 Grid with other stats */}
            <View style={{ flex: 1, gap: 12 }}>
              {/* Row 1 */}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <MaterialIcons name="account-balance-wallet" size={20} color="#ba9988" />
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      Cashback
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "700",
                      color: "#ba9988",
                    }}
                  >
                    ${Math.round(mockImpactSummary.lifetimeCashback)}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <MaterialIcons name="favorite" size={20} color="#ba9988" />
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      Donations
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "700",
                      color: "#ba9988",
                    }}
                  >
                    ${mockImpactSummary.totalDonations.toFixed(2)}
                  </Text>
                </View>
              </View>
              {/* Row 2 */}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <MaterialIcons name="people" size={20} color="#ba9988" />
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      Referrals
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "700",
                      color: "#ba9988",
                    }}
                  >
                    {mockImpactSummary.referralCount}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <MaterialIcons name="trending-up" size={20} color="#ba9988" />
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                        flex: 1,
                      }}
                    >
                      Sponsorship
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "700",
                      color: "#ba9988",
                    }}
                  >
                    ${mockImpactSummary.sponsorshipEarnings.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Explore
          </Text>
          {isMobile ? (
            /* Mobile: 2 Columns × 3 Rows */
            <View
              style={{
                flexDirection: "row",
                gap: 12,
              }}
            >
              {/* Column 1 */}
              <View style={{ flex: 1, gap: 12 }}>
                <TouchableOpacity
                  onPress={() => router.push("/pages/myimpact/leaderboard")}
                  style={{
                    flex: 1,
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons name="emoji-events" size={24} color="#ba9988" style={{ marginBottom: 8 }} />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    Leaderboard
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/pages/myimpact/cashback")}
                  style={{
                    flex: 1,
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons name="account-balance-wallet" size={24} color="#ba9988" style={{ marginBottom: 8 }} />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    Cashback
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/pages/myimpact/donations")}
                  style={{
                    flex: 1,
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons name="favorite" size={24} color="#ba9988" style={{ marginBottom: 8 }} />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    Donations
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Column 2 */}
              <View style={{ flex: 1, gap: 12 }}>
                <TouchableOpacity
                  onPress={() => router.push("/pages/myimpact/points")}
                  style={{
                    flex: 1,
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons name="stars" size={24} color="#ba9988" style={{ marginBottom: 8 }} />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    Impact Points
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/pages/myimpact/sponsorship")}
                  style={{
                    flex: 1,
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons name="trending-up" size={24} color="#ba9988" style={{ marginBottom: 8 }} />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    Sponsorship
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/pages/myimpact/badges")}
                  style={{
                    flex: 1,
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons name="workspace-premium" size={24} color="#ba9988" style={{ marginBottom: 8 }} />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    Badges
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Desktop: Single Row */
            <View
              style={{
                flexDirection: "row",
                gap: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => router.push("/pages/myimpact/leaderboard")}
                style={{
                  flex: 1,
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="emoji-events" size={24} color="#ba9988" style={{ marginBottom: 8 }} />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  Leaderboard
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/pages/myimpact/points")}
                style={{
                  flex: 1,
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="stars" size={24} color="#ba9988" style={{ marginBottom: 8 }} />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  Impact Points
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/pages/myimpact/cashback")}
                style={{
                  flex: 1,
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="account-balance-wallet" size={24} color="#ba9988" style={{ marginBottom: 8 }} />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  Cashback
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/pages/myimpact/sponsorship")}
                style={{
                  flex: 1,
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="trending-up" size={24} color="#ba9988" style={{ marginBottom: 8 }} />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  Sponsorship
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/pages/myimpact/donations")}
                style={{
                  flex: 1,
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="favorite" size={24} color="#ba9988" style={{ marginBottom: 8 }} />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  Donations
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/pages/myimpact/badges")}
                style={{
                  flex: 1,
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="workspace-premium" size={24} color="#ba9988" style={{ marginBottom: 8 }} />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  Badges
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Recent Activity */}
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Recent Activity
          </Text>
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            {mockRecentActivity.length === 0 ? (
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.6)",
                  textAlign: "center",
                  paddingVertical: 20,
                }}
              >
                No recent activity. Start making purchases and referrals to see your impact!
              </Text>
            ) : (
              <View style={{ gap: 16 }}>
                {mockRecentActivity.map((activity, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: `${activity.color}20`,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MaterialIcons name={activity.icon} size={20} color={activity.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#ffffff",
                            marginBottom: 4,
                          }}
                        >
                          {activity.description}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "rgba(255, 255, 255, 0.5)",
                          }}
                        >
                          {activity.timestamp}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: activity.amount.startsWith('+') ? '#9ce0a4' : '#ffffff',
                      }}
                    >
                      {activity.amount}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

