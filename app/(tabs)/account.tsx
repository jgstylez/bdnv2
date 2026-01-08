import React from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { userMenuItems } from "../../config/userMenu";
import { UserBadge, BADGE_DEFINITIONS } from '@/types/badges';
import { BadgeIcon } from '@/components/BadgeIcon';

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  level: "Bronze",
  userType: "Consumer",
  points: 1250,
  memberSince: "2024",
};

// Mock impact summary for mini display
const mockImpactSummary = {
  totalPoints: 1250,
  lifetimeCashback: 342.50,
  totalDonations: 1250.00,
  referralCount: 12,
  sponsorshipEarnings: 89.25,
  currentLevel: "Bronze",
  pointsToNextLevel: 3750,
};

const USER_LEVELS: Record<string, { color: string }> = {
  Basic: { color: "#8d8d8d" },
  Bronze: { color: "#cd7f32" },
  Silver: { color: "#c0c0c0" },
  Gold: { color: "#ffd700" },
  Diamond: { color: "#b9f2ff" },
  "Black Diamond": { color: "#000000" },
};

// Mock user badges - only earned badges (matching badges page)
const mockUserBadges: UserBadge[] = [
  {
    badgeId: "first-purchase",
    userId: "user1",
    earnedAt: "2024-01-15T10:30:00Z",
    progress: 100,
    isEarned: true,
  },
  {
    badgeId: "first-review",
    userId: "user1",
    earnedAt: "2024-01-20T14:20:00Z",
    progress: 100,
    isEarned: true,
  },
  {
    badgeId: "purchaser-5",
    userId: "user1",
    earnedAt: "2024-02-10T09:15:00Z",
    progress: 100,
    isEarned: true,
  },
  {
    badgeId: "level-bronze",
    userId: "user1",
    earnedAt: "2024-02-01T12:00:00Z",
    progress: 100,
    isEarned: true,
  },
  {
    badgeId: "first-referral",
    userId: "user1",
    earnedAt: "2024-01-25T11:00:00Z",
    progress: 100,
    isEarned: true,
  },
  {
    badgeId: "first-donation",
    userId: "user1",
    earnedAt: "2024-02-05T15:30:00Z",
    progress: 100,
    isEarned: true,
  },
  {
    badgeId: "first-event",
    userId: "user1",
    earnedAt: "2024-02-12T18:00:00Z",
    progress: 100,
    isEarned: true,
  },
];

export default function Account() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isMobile = width < 768;
  const isDesktop = width >= 1024 && Platform.OS === "web";
  
  // Tab bar height is 56px on mobile, 0 on desktop
  const tabBarHeight = isDesktop ? 0 : 56;
  const bottomPadding = 40 + tabBarHeight + (isMobile ? insets.bottom : 0);

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: 20,
          paddingBottom: bottomPadding,
        }}
      >
        {/* Profile Header */}
        <View
          style={{
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "#ba9988",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 48, fontWeight: "700", color: "#ffffff" }}>
              {mockUser.name.charAt(0)}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 4,
            }}
          >
            {mockUser.name}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: 8,
            }}
          >
            {mockUser.email}
          </Text>
          <View
            style={{
              backgroundColor: "rgba(186, 153, 136, 0.15)",
              paddingHorizontal: 16,
              paddingVertical: 6,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: "#ba9988",
                textTransform: "uppercase",
              }}
            >
              {mockUser.level} Member
            </Text>
          </View>
        </View>

        {/* Mini MyImpact Section */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 20,
            marginBottom: 32,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/pages/myimpact")}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "rgba(186, 153, 136, 0.2)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons name="stars" size={20} color="#ba9988" />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 2,
                    }}
                  >
                    MyImpact
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    View your impact & rewards
                  </Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="rgba(255, 255, 255, 0.6)" />
            </View>
          </TouchableOpacity>
          
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: USER_LEVELS[mockImpactSummary.currentLevel]?.color || "#8d8d8d",
                  marginBottom: 4,
                }}
              >
                {mockImpactSummary.currentLevel}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: "rgba(255, 255, 255, 0.6)",
                  textTransform: "uppercase",
                }}
              >
                Level
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#4caf50",
                  marginBottom: 4,
                }}
              >
                ${mockImpactSummary.lifetimeCashback.toFixed(2)}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: "rgba(255, 255, 255, 0.6)",
                  textTransform: "uppercase",
                }}
              >
                Savings
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#ba9988",
                  marginBottom: 4,
                }}
              >
                {mockImpactSummary.totalPoints.toLocaleString()}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: "rgba(255, 255, 255, 0.6)",
                  textTransform: "uppercase",
                }}
              >
                Points
              </Text>
            </View>
          </View>

          {/* Badges Row - Show up to 5 on mobile, 10 on desktop */}
          {(() => {
            const maxBadges = isMobile ? 5 : 10;
            const earnedBadges = mockUserBadges
              .filter((ub) => ub.isEarned)
              .slice(0, maxBadges)
              .map((ub) => {
                const badgeDef = BADGE_DEFINITIONS.find((b) => b.id === ub.badgeId);
                return badgeDef ? { ...ub, badgeDef } : null;
              })
              .filter((b): b is NonNullable<typeof b> => b !== null);

            const totalEarned = mockUserBadges.filter((ub) => ub.isEarned).length;

            if (earnedBadges.length > 0) {
              return (
                <TouchableOpacity
                  onPress={() => router.push("/pages/myimpact/badges")}
                  activeOpacity={0.7}
                  style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: "rgba(186, 153, 136, 0.2)" }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: "rgba(255, 255, 255, 0.7)",
                        textTransform: "uppercase",
                      }}
                    >
                      Recent Badges
                    </Text>
                    {totalEarned > maxBadges && (
                      <Text
                        style={{
                          fontSize: 11,
                          color: "#ba9988",
                          fontWeight: "600",
                        }}
                      >
                        +{totalEarned - maxBadges} more
                      </Text>
                    )}
                  </View>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
                    {earnedBadges.map((userBadge) => (
                      <View
                        key={userBadge.badgeId}
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <BadgeIcon
                          icon={userBadge.badgeDef.icon}
                          size={isMobile ? 48 : 56}
                          color={userBadge.badgeDef.color}
                          isEarned={true}
                          gradient={userBadge.badgeDef.gradient}
                        />
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            }
            return null;
          })()}
        </View>

        {/* Menu Items */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Account
          </Text>
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            {userMenuItems.map((item, index) => (
              <React.Fragment key={index}>
                {item.divider && (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "rgba(186, 153, 136, 0.2)",
                      marginHorizontal: 20,
                    }}
                  />
                )}
                <TouchableOpacity
                  onPress={() => {
                    if (item.href === "/(auth)/login") {
                      // Handle sign out
                      router.push(item.href as any);
                    } else {
                      router.push(item.href as any);
                    }
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    gap: 16,
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name={item.icon}
                    size={24}
                    color={
                      item.label === "Sign Out"
                        ? "#ba9988"
                        : "rgba(255, 255, 255, 0.7)"
                    }
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color:
                        item.label === "Sign Out"
                          ? "#ba9988"
                          : "#ffffff",
                      flex: 1,
                    }}
                  >
                    {item.label}
                  </Text>
                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    color="rgba(255, 255, 255, 0.5)"
                  />
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

