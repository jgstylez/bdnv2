import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform, Switch } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LeaderboardEntry } from '@/types/impact';
import { HeroSection } from '@/components/layouts/HeroSection';
import { useResponsive } from '@/hooks/useResponsive';
import { BackButton } from '@/components/navigation/BackButton';

// Mock leaderboard data - Top 20
const mockLeaderboard: LeaderboardEntry[] = [
  {
    userId: "user1",
    userName: "John Smith",
    userLevel: "Bronze",
    totalPoints: 12500,
    rank: 1,
    change: 0,
    achievements: ["Top Contributor", "Community Builder"],
  },
  {
    userId: "user2",
    userName: "Sarah Johnson",
    userLevel: "Silver",
    totalPoints: 11800,
    rank: 2,
    change: 1,
    achievements: ["Referral Master"],
  },
  {
    userId: "user3",
    userName: "Marcus Williams",
    userLevel: "Gold",
    totalPoints: 11200,
    rank: 3,
    change: -1,
    achievements: ["Donation Champion"],
  },
  {
    userId: "user4",
    userName: "Aisha Davis",
    userLevel: "Bronze",
    totalPoints: 9800,
    rank: 4,
    change: 2,
    achievements: [],
  },
  {
    userId: "user5",
    userName: "James Brown",
    userLevel: "Silver",
    totalPoints: 9200,
    rank: 5,
    change: -1,
    achievements: ["Early Adopter"],
  },
  {
    userId: "user6",
    userName: "Michelle Obama",
    userLevel: "Gold",
    totalPoints: 8900,
    rank: 6,
    change: 0,
    achievements: ["Community Builder"],
  },
  {
    userId: "user7",
    userName: "Tyler Perry",
    userLevel: "Diamond",
    totalPoints: 8500,
    rank: 7,
    change: 1,
    achievements: ["Top Contributor"],
  },
  {
    userId: "user8",
    userName: "Oprah Winfrey",
    userLevel: "Gold",
    totalPoints: 8200,
    rank: 8,
    change: -1,
    achievements: ["Donation Champion"],
  },
  {
    userId: "user9",
    userName: "Chadwick Boseman",
    userLevel: "Silver",
    totalPoints: 7800,
    rank: 9,
    change: 2,
    achievements: [],
  },
  {
    userId: "user10",
    userName: "Angela Bassett",
    userLevel: "Bronze",
    totalPoints: 7500,
    rank: 10,
    change: 0,
    achievements: ["Referral Master"],
  },
  {
    userId: "user11",
    userName: "Michael B. Jordan",
    userLevel: "Silver",
    totalPoints: 7200,
    rank: 11,
    change: -1,
    achievements: [],
  },
  {
    userId: "user12",
    userName: "Viola Davis",
    userLevel: "Gold",
    totalPoints: 6900,
    rank: 12,
    change: 1,
    achievements: ["Community Builder"],
  },
  {
    userId: "user13",
    userName: "Idris Elba",
    userLevel: "Bronze",
    totalPoints: 6600,
    rank: 13,
    change: 0,
    achievements: [],
  },
  {
    userId: "user14",
    userName: "Lupita Nyong'o",
    userLevel: "Silver",
    totalPoints: 6300,
    rank: 14,
    change: -1,
    achievements: ["Early Adopter"],
  },
  {
    userId: "user15",
    userName: "Denzel Washington",
    userLevel: "Gold",
    totalPoints: 6000,
    rank: 15,
    change: 2,
    achievements: ["Top Contributor"],
  },
  {
    userId: "user16",
    userName: "Kerry Washington",
    userLevel: "Bronze",
    totalPoints: 5700,
    rank: 16,
    change: 0,
    achievements: [],
  },
  {
    userId: "user17",
    userName: "Will Smith",
    userLevel: "Silver",
    totalPoints: 5400,
    rank: 17,
    change: -1,
    achievements: ["Donation Champion"],
  },
  {
    userId: "user18",
    userName: "Taraji P. Henson",
    userLevel: "Bronze",
    totalPoints: 5100,
    rank: 18,
    change: 1,
    achievements: [],
  },
  {
    userId: "user19",
    userName: "Samuel L. Jackson",
    userLevel: "Silver",
    totalPoints: 4800,
    rank: 19,
    change: 0,
    achievements: ["Referral Master"],
  },
  {
    userId: "user20",
    userName: "Regina King",
    userLevel: "Bronze",
    totalPoints: 4500,
    rank: 20,
    change: -1,
    achievements: [],
  },
];

const USER_LEVELS = {
  Basic: { color: "#8d8d8d" },
  Bronze: { color: "#cd7f32" },
  Silver: { color: "#c0c0c0" },
  Gold: { color: "#ffd700" },
  Diamond: { color: "#b9f2ff" },
  "Black Diamond": { color: "#000000" },
};

export default function Leaderboard() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { isMobile, scrollViewBottomPadding } = useResponsive();
  const [selectedPeriod, setSelectedPeriod] = useState<"all-time" | "monthly" | "weekly">("all-time");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const getLevelColor = (level: string) => {
    return USER_LEVELS[level as keyof typeof USER_LEVELS]?.color || "#8d8d8d";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return "trending-up";
    if (change < 0) return "trending-down";
    return "remove";
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "#4caf50";
    if (change < 0) return "#ff4444";
    return "rgba(255, 255, 255, 0.5)";
  };

  const renderAvatar = (entry: LeaderboardEntry, size: number = 40) => {
    if (entry.avatarUrl) {
      return (
        <Image
          source={{ uri: entry.avatarUrl }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
        />
      );
    }
    
    // Fallback to initials
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "#ba9988",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: size * 0.4,
            fontWeight: "700",
            color: "#ffffff",
          }}
        >
          {entry.userName.charAt(0).toUpperCase()}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        {/* Back Button */}
        <BackButton 
          textColor="#ffffff"
          iconColor="#ffffff"
          onPress={() => {
            router.back();
          }}
        />

        {/* Hero Section */}
        <HeroSection
          title="Leaderboard"
          subtitle="See how you rank among the community's top contributors"
        />

        {/* Two Column Layout for Desktop */}
        {isMobile ? (
          <>
            {/* Your Ranking - Mobile */}
            <View
              style={{
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: 20,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 12,
                }}
              >
                Your Ranking
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View>
                  <Text
                    style={{
                      fontSize: 32,
                      fontWeight: "800",
                      color: "#ba9988",
                    }}
                  >
                    #{mockLeaderboard[0].rank}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    out of {mockLeaderboard.length} members
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "700",
                      color: "#ffffff",
                    }}
                  >
                    {mockLeaderboard[0].totalPoints.toLocaleString()}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    Total Points
                  </Text>
                </View>
              </View>

              {/* Anonymous Toggle */}
              <View
                style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTopWidth: 1,
                  borderTopColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      Anonymous Recognition
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.6)",
                      }}
                    >
                      Display as "Private Community Builder"
                    </Text>
                  </View>
                  <Switch
                    value={isAnonymous}
                    onValueChange={setIsAnonymous}
                    trackColor={{ false: "#474747", true: "#ba9988" }}
                    thumbColor="#ffffff"
                  />
                </View>
              </View>
            </View>

        {/* Period Selector */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#474747",
            borderRadius: 12,
            padding: 4,
            marginBottom: 24,
          }}
        >
          {[
            { key: "all-time", label: "All Time" },
            { key: "monthly", label: "Monthly" },
            { key: "weekly", label: "Weekly" },
          ].map((period) => (
            <TouchableOpacity
              key={period.key}
              onPress={() => setSelectedPeriod(period.key as any)}
              style={{
                flex: 1,
                backgroundColor: selectedPeriod === period.key ? "#ba9988" : "transparent",
                borderRadius: 8,
                paddingVertical: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: selectedPeriod === period.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                }}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

            {/* Leaderboard List - Mobile */}
        <View style={{ gap: 12 }}>
          {mockLeaderboard.map((entry, index) => {
            const isCurrentUser = entry.userId === "user1";

            return (
              <View
                key={entry.userId}
                style={{
                  backgroundColor: isCurrentUser ? "#474747" : "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: isCurrentUser ? 2 : 1,
                  borderColor: isCurrentUser ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                    {/* Rank */}
                    <View style={{ width: 40, alignItems: "center" }}>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "700",
                            color: isCurrentUser ? "#ba9988" : "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          #{entry.rank}
                        </Text>
                    </View>

                    {/* Avatar */}
                    {renderAvatar(entry, 40)}

                    {/* User Info */}
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: isCurrentUser ? "700" : "600",
                            color: isCurrentUser ? "#ba9988" : "#ffffff",
                          }}
                        >
                              {isCurrentUser && isAnonymous ? "Private Community Builder" : entry.userName}
                        </Text>
                            {isCurrentUser && !isAnonymous && (
                          <View
                            style={{
                              backgroundColor: "#ba9988",
                              paddingHorizontal: 6,
                              paddingVertical: 2,
                              borderRadius: 4,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 10,
                                fontWeight: "600",
                                color: "#ffffff",
                              }}
                            >
                              YOU
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Points */}
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: isCurrentUser ? "#ba9988" : "#ffffff",
                      }}
                    >
                      {entry.totalPoints.toLocaleString()}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      points
                    </Text>
                  </View>
                </View>

                {/* Achievements */}
                {entry.achievements.length > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 6,
                      marginTop: 12,
                      paddingTop: 12,
                      borderTopWidth: 1,
                      borderTopColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  >
                    {entry.achievements.map((achievement, idx) => (
                      <View
                        key={idx}
                        style={{
                          backgroundColor: "rgba(186, 153, 136, 0.15)",
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 6,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <MaterialIcons name="emoji-events" size={12} color="#ba9988" />
                        <Text
                          style={{
                            fontSize: 10,
                            color: "#ba9988",
                            fontWeight: "600",
                          }}
                        >
                          {achievement}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
          </>
        ) : (
          <View
            style={{
              flexDirection: "row",
              gap: 16,
              alignItems: "flex-start",
            }}
          >
            {/* Column 1: Your Ranking - Sticky */}
            <View
              style={{
                flex: 1,
                ...(isMobile ? {} : { position: "sticky" as any, top: 20, maxHeight: "calc(100vh - 40px)", alignSelf: "flex-start" }),
              }}
            >
              <View
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  width: "100%",
                }}
              >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 12,
            }}
          >
            Your Ranking
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "800",
                  color: "#ba9988",
                }}
              >
                #{mockLeaderboard[0].rank}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                out of {mockLeaderboard.length} members
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#ffffff",
                }}
              >
                {mockLeaderboard[0].totalPoints.toLocaleString()}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.6)",
                }}
              >
                Total Points
              </Text>
                  </View>
                </View>

                {/* Anonymous Toggle */}
                <View
                  style={{
                    marginTop: 16,
                    paddingTop: 16,
                    borderTopWidth: 1,
                    borderTopColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: "#ffffff",
                          marginBottom: 4,
                        }}
                      >
                        Anonymous Recognition
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        Display as "Private Community Builder"
                      </Text>
                    </View>
                    <Switch
                      value={isAnonymous}
                      onValueChange={setIsAnonymous}
                      trackColor={{ false: "#474747", true: "#ba9988" }}
                      thumbColor="#ffffff"
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Column 2: Period Selector + Leaderboard List */}
            <View style={{ flex: 1 }}>
              {/* Period Selector */}
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#474747",
                  borderRadius: 12,
                  padding: 4,
                  marginBottom: 24,
                }}
              >
                {[
                  { key: "all-time", label: "All Time" },
                  { key: "monthly", label: "Monthly" },
                  { key: "weekly", label: "Weekly" },
                ].map((period) => (
                  <TouchableOpacity
                    key={period.key}
                    onPress={() => setSelectedPeriod(period.key as any)}
                    style={{
                      flex: 1,
                      backgroundColor: selectedPeriod === period.key ? "#ba9988" : "transparent",
                      borderRadius: 8,
                      paddingVertical: 10,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: selectedPeriod === period.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      {period.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Leaderboard List - Desktop */}
              <View style={{ gap: 12 }}>
                {mockLeaderboard.map((entry, index) => {
                  const isCurrentUser = entry.userId === "user1";

                  return (
                    <View
                      key={entry.userId}
                      style={{
                        backgroundColor: isCurrentUser ? "#474747" : "#474747",
                        borderRadius: 16,
                        padding: 20,
                        borderWidth: isCurrentUser ? 2 : 1,
                        borderColor: isCurrentUser ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                          {/* Rank */}
                          <View style={{ width: 40, alignItems: "center" }}>
                            <Text
                              style={{
                                fontSize: 18,
                                fontWeight: "700",
                                color: isCurrentUser ? "#ba9988" : "rgba(255, 255, 255, 0.7)",
                              }}
                            >
                              #{entry.rank}
                            </Text>
                          </View>

                          {/* Avatar */}
                          {renderAvatar(entry, 40)}

                          {/* User Info */}
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                              <Text
                                style={{
                                  fontSize: 16,
                                  fontWeight: isCurrentUser ? "700" : "600",
                                  color: isCurrentUser ? "#ba9988" : "#ffffff",
                                }}
                              >
                                {isCurrentUser && isAnonymous ? "Private Community Builder" : entry.userName}
                              </Text>
                              {isCurrentUser && !isAnonymous && (
                                <View
                                  style={{
                                    backgroundColor: "#ba9988",
                                    paddingHorizontal: 6,
                                    paddingVertical: 2,
                                    borderRadius: 4,
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 10,
                                      fontWeight: "600",
                                      color: "#ffffff",
                                    }}
                                  >
                                    YOU
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>

                        {/* Points */}
                        <View style={{ alignItems: "flex-end" }}>
                          <Text
                            style={{
                              fontSize: 20,
                              fontWeight: "700",
                              color: isCurrentUser ? "#ba9988" : "#ffffff",
                            }}
                          >
                            {entry.totalPoints.toLocaleString()}
                          </Text>
                          <Text
                            style={{
                              fontSize: 11,
                              color: "rgba(255, 255, 255, 0.5)",
                            }}
                          >
                            points
                          </Text>
                        </View>
                      </View>

                      {/* Achievements */}
                      {entry.achievements.length > 0 && (
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 6,
                            marginTop: 12,
                            paddingTop: 12,
                            borderTopWidth: 1,
                            borderTopColor: "rgba(186, 153, 136, 0.2)",
                          }}
                        >
                          {entry.achievements.map((achievement, idx) => (
                            <View
                              key={idx}
                              style={{
                                backgroundColor: "rgba(186, 153, 136, 0.15)",
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderRadius: 6,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <MaterialIcons name="emoji-events" size={12} color="#ba9988" />
                              <Text
                                style={{
                                  fontSize: 10,
                                  color: "#ba9988",
                                  fontWeight: "600",
                                }}
                              >
                                {achievement}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}
            </View>
          </View>
        </View>
        )}

      </ScrollView>
    </View>
  );
}

