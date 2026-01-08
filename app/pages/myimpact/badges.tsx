import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { Badge, BadgeCategory, UserBadge, BADGE_DEFINITIONS } from '@/types/badges';
import { BadgeIcon } from '@/components/BadgeIcon';
import { HeroSection } from '@/components/layouts/HeroSection';

// Mock user badges - in production, this would come from an API
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
    badgeId: "referral-5",
    userId: "user1",
    earnedAt: "",
    progress: 60, // 3 out of 5 referrals
    isEarned: false,
  },
  {
    badgeId: "purchaser-25",
    userId: "user1",
    earnedAt: "",
    progress: 20, // 5 out of 25 purchases
    isEarned: false,
  },
];

const categoryLabels: Record<BadgeCategory, string> = {
  purchases: "Purchases",
  social: "Social",
  community: "Community",
  achievement: "Achievements",
  education: "Education",
  milestone: "Milestones",
};

const rarityColors: Record<string, string> = {
  common: "rgba(255, 255, 255, 0.4)",
  rare: "rgba(33, 150, 243, 0.6)",
  epic: "rgba(156, 39, 176, 0.6)",
  legendary: "rgba(255, 215, 0, 0.6)",
};

export default function Badges() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | "all">("all");

  // Get user badge status for each badge definition
  const getBadgeStatus = (badgeId: string): UserBadge | null => {
    return mockUserBadges.find((ub) => ub.badgeId === badgeId) || null;
  };

  // Filter badges by category
  const filteredBadges = selectedCategory === "all"
    ? BADGE_DEFINITIONS
    : BADGE_DEFINITIONS.filter((badge) => badge.category === selectedCategory);

  // Group badges by category
  const badgesByCategory = filteredBadges.reduce((acc, badge) => {
    if (!acc[badge.category]) {
      acc[badge.category] = [];
    }
    acc[badge.category].push(badge);
    return acc;
  }, {} as Record<BadgeCategory, Badge[]>);

  const earnedCount = mockUserBadges.filter((ub) => ub.isEarned).length;
  const totalCount = BADGE_DEFINITIONS.length;

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
          title="Badges"
          subtitle="Unlock badges by engaging and participating on the platform"
        />

        {/* Two Column Layout (Desktop) or Stacked (Mobile) */}
        {isMobile ? (
          <>
            {/* Progress Card - Mobile */}
        <View style={{ marginBottom: 32 }}>
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 20,
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: 4,
                  }}
                >
                  Badge Progress
                </Text>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: "800",
                    color: "#ba9988",
                  }}
                >
                  {earnedCount} / {totalCount}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "rgba(186, 153, 136, 0.15)",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#ba9988",
                  }}
                >
                  {Math.round((earnedCount / totalCount) * 100)}% Complete
                </Text>
              </View>
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
                  width: `${(earnedCount / totalCount) * 100}%`,
                  backgroundColor: "#ba9988",
                  borderRadius: 4,
                }}
              />
            </View>
          </View>
        </View>

            {/* Category Filters - Mobile */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 24 }}
          contentContainerStyle={{ gap: 8, paddingRight: isMobile ? 0 : 20 }}
        >
          {[
            { key: "all" as const, label: "All" },
            ...Object.entries(categoryLabels).map(([key, label]) => ({
              key: key as BadgeCategory,
              label,
            })),
          ].map((category) => (
            <TouchableOpacity
              key={category.key}
              onPress={() => setSelectedCategory(category.key)}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 20,
                backgroundColor: selectedCategory === category.key ? "#ba9988" : "#474747",
                borderWidth: 1,
                borderColor:
                  selectedCategory === category.key
                    ? "#ba9988"
                    : "rgba(186, 153, 136, 0.2)",
              }}
            >
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

            {/* Badges Grid - Mobile */}
        {selectedCategory === "all" ? (
          // Show badges grouped by category
          Object.entries(badgesByCategory).map(([category, badges]) => (
            <View key={category} style={{ marginBottom: 32 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 16,
                }}
              >
                {categoryLabels[category as BadgeCategory]}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                {badges.map((badge) => {
                  const userBadge = getBadgeStatus(badge.id);
                  const isEarned = userBadge?.isEarned || false;
                  const progress = userBadge?.progress || 0;

                  return (
                    <TouchableOpacity
                      key={badge.id}
                      style={{
                            width: "47%",
                        backgroundColor: "#474747",
                        borderRadius: 20,
                        padding: 20,
                        borderWidth: 1,
                        borderColor: isEarned
                          ? badge.color
                          : "rgba(186, 153, 136, 0.2)",
                        alignItems: "center",
                        opacity: isEarned ? 1 : 0.6,
                      }}
                    >
                      <BadgeIcon
                        icon={badge.icon}
                        size={80}
                        color={badge.color}
                        isEarned={isEarned}
                        gradient={badge.gradient}
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "700",
                          color: "#ffffff",
                          marginTop: 12,
                          marginBottom: 4,
                          textAlign: "center",
                        }}
                      >
                        {badge.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                          textAlign: "center",
                          marginBottom: 8,
                          lineHeight: 16,
                        }}
                      >
                        {badge.description}
                      </Text>
                      {!isEarned && progress > 0 && (
                        <View style={{ width: "100%", marginTop: 8 }}>
                          <View
                            style={{
                              height: 4,
                              backgroundColor: "#232323",
                              borderRadius: 2,
                              overflow: "hidden",
                            }}
                          >
                            <View
                              style={{
                                height: "100%",
                                width: `${progress}%`,
                                backgroundColor: badge.color,
                                borderRadius: 2,
                              }}
                            />
                          </View>
                          <Text
                            style={{
                              fontSize: 10,
                              color: "rgba(255, 255, 255, 0.5)",
                              marginTop: 4,
                              textAlign: "center",
                            }}
                          >
                            {progress}% complete
                          </Text>
                        </View>
                      )}
                      {isEarned && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 8,
                            gap: 4,
                          }}
                        >
                          <MaterialIcons name="check-circle" size={16} color={badge.color} />
                          <Text
                            style={{
                              fontSize: 11,
                              fontWeight: "600",
                              color: badge.color,
                              textTransform: "uppercase",
                            }}
                          >
                            Earned
                          </Text>
                        </View>
                      )}
                      <View
                        style={{
                          marginTop: 8,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          backgroundColor: rarityColors[badge.rarity],
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: "600",
                            color: "#ffffff",
                            textTransform: "uppercase",
                          }}
                        >
                          {badge.rarity}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 11,
                          color: "rgba(255, 255, 255, 0.5)",
                          marginTop: 8,
                          textAlign: "center",
                        }}
                      >
                        {badge.requirement.description}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))
        ) : (
          // Show filtered badges
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            {filteredBadges.map((badge) => {
              const userBadge = getBadgeStatus(badge.id);
              const isEarned = userBadge?.isEarned || false;
              const progress = userBadge?.progress || 0;

              return (
                <TouchableOpacity
                  key={badge.id}
                  style={{
                        width: "47%",
                    backgroundColor: "#474747",
                    borderRadius: 20,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: isEarned
                      ? badge.color
                      : "rgba(186, 153, 136, 0.2)",
                    alignItems: "center",
                    opacity: isEarned ? 1 : 0.6,
                  }}
                >
                  <BadgeIcon
                    icon={badge.icon}
                    size={80}
                    color={badge.color}
                    isEarned={isEarned}
                    gradient={badge.gradient}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginTop: 12,
                      marginBottom: 4,
                      textAlign: "center",
                    }}
                  >
                    {badge.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.6)",
                      textAlign: "center",
                      marginBottom: 8,
                      lineHeight: 16,
                    }}
                  >
                    {badge.description}
                  </Text>
                  {!isEarned && progress > 0 && (
                    <View style={{ width: "100%", marginTop: 8 }}>
                      <View
                        style={{
                          height: 4,
                          backgroundColor: "#232323",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <View
                          style={{
                            height: "100%",
                            width: `${progress}%`,
                            backgroundColor: badge.color,
                            borderRadius: 2,
                          }}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 10,
                          color: "rgba(255, 255, 255, 0.5)",
                          marginTop: 4,
                          textAlign: "center",
                        }}
                      >
                        {progress}% complete
                      </Text>
                    </View>
                  )}
                  {isEarned && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 8,
                        gap: 4,
                      }}
                    >
                      <MaterialIcons name="check-circle" size={16} color={badge.color} />
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "600",
                          color: badge.color,
                          textTransform: "uppercase",
                        }}
                      >
                        Earned
                      </Text>
                    </View>
                  )}
                  <View
                    style={{
                      marginTop: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      backgroundColor: rarityColors[badge.rarity],
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "600",
                        color: "#ffffff",
                        textTransform: "uppercase",
                      }}
                    >
                      {badge.rarity}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 11,
                      color: "rgba(255, 255, 255, 0.5)",
                      marginTop: 8,
                      textAlign: "center",
                    }}
                  >
                    {badge.requirement.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
            )}
          </>
        ) : (
          <>
            {/* Desktop Two Column Layout */}
            <View
              style={{
                flexDirection: "row",
                gap: 24,
                alignItems: "flex-start",
              }}
            >
              {/* First Column - Badge Progress (Sticky) */}
              <View
                style={{
                  width: "50%",
                  ...(Platform.OS === "web" && {
                    position: "sticky",
                    top: 20,
                    alignSelf: "flex-start",
                    maxHeight: "calc(100vh - 40px)",
                  }),
                }}
              >
                <View
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 20,
                    padding: 24,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    width: "100%",
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "rgba(255, 255, 255, 0.7)",
                          marginBottom: 4,
                        }}
                      >
                        Badge Progress
                      </Text>
                      <Text
                        style={{
                          fontSize: 32,
                          fontWeight: "800",
                          color: "#ba9988",
                        }}
                      >
                        {earnedCount} / {totalCount}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "rgba(186, 153, 136, 0.15)",
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 12,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          color: "#ba9988",
                        }}
                      >
                        {Math.round((earnedCount / totalCount) * 100)}% Complete
                      </Text>
                    </View>
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
                        width: `${(earnedCount / totalCount) * 100}%`,
                        backgroundColor: "#ba9988",
                        borderRadius: 4,
                      }}
                    />
                  </View>
                </View>
              </View>

              {/* Second Column - Category Filters and Badges Grid */}
              <View style={{ width: "50%" }}>
                {/* Category Filters - Desktop */}
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginBottom: 24 }}
                    contentContainerStyle={{ gap: 8, paddingRight: 20 }}
                  >
                    {[
                      { key: "all" as const, label: "All" },
                      ...Object.entries(categoryLabels).map(([key, label]) => ({
                        key: key as BadgeCategory,
                        label,
                      })),
                    ].map((category) => (
                      <TouchableOpacity
                        key={category.key}
                        onPress={() => setSelectedCategory(category.key)}
                        style={{
                          paddingHorizontal: 20,
                          paddingVertical: 10,
                          borderRadius: 20,
                          backgroundColor: selectedCategory === category.key ? "#ba9988" : "#474747",
                          borderWidth: 1,
                          borderColor:
                            selectedCategory === category.key
                              ? "#ba9988"
                              : "rgba(186, 153, 136, 0.2)",
                        }}
                      >
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

                  {/* Badges Grid - Desktop */}
                  {selectedCategory === "all" ? (
                    // Show badges grouped by category
                    Object.entries(badgesByCategory).map(([category, badges]) => (
                      <View key={category} style={{ marginBottom: 32 }}>
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: "700",
                            color: "#ffffff",
                            marginBottom: 16,
                          }}
                        >
                          {categoryLabels[category as BadgeCategory]}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 16,
                          }}
                        >
                          {badges.map((badge) => {
                            const userBadge = getBadgeStatus(badge.id);
                            const isEarned = userBadge?.isEarned || false;
                            const progress = userBadge?.progress || 0;

                            return (
                              <TouchableOpacity
                                key={badge.id}
                                style={{
                                  width: "47%",
                                  minWidth: 200,
                                  backgroundColor: "#474747",
                                  borderRadius: 20,
                                  padding: 20,
                                  borderWidth: 1,
                                  borderColor: isEarned
                                    ? badge.color
                                    : "rgba(186, 153, 136, 0.2)",
                                  alignItems: "center",
                                  opacity: isEarned ? 1 : 0.6,
                                }}
                              >
                                <BadgeIcon
                                  icon={badge.icon}
                                  size={80}
                                  color={badge.color}
                                  isEarned={isEarned}
                                  gradient={badge.gradient}
                                />
                                <Text
                                  style={{
                                    fontSize: 16,
                                    fontWeight: "700",
                                    color: "#ffffff",
                                    marginTop: 12,
                                    marginBottom: 4,
                                    textAlign: "center",
                                  }}
                                >
                                  {badge.name}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: "rgba(255, 255, 255, 0.6)",
                                    textAlign: "center",
                                    marginBottom: 8,
                                    lineHeight: 16,
                                  }}
                                >
                                  {badge.description}
                                </Text>
                                {!isEarned && progress > 0 && (
                                  <View style={{ width: "100%", marginTop: 8 }}>
                                    <View
                                      style={{
                                        height: 4,
                                        backgroundColor: "#232323",
                                        borderRadius: 2,
                                        overflow: "hidden",
                                      }}
                                    >
                                      <View
                                        style={{
                                          height: "100%",
                                          width: `${progress}%`,
                                          backgroundColor: badge.color,
                                          borderRadius: 2,
                                        }}
                                      />
                                    </View>
                                    <Text
                                      style={{
                                        fontSize: 10,
                                        color: "rgba(255, 255, 255, 0.5)",
                                        marginTop: 4,
                                        textAlign: "center",
                                      }}
                                    >
                                      {progress}% complete
                                    </Text>
                                  </View>
                                )}
                                {isEarned && (
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      marginTop: 8,
                                      gap: 4,
                                    }}
                                  >
                                    <MaterialIcons name="check-circle" size={16} color={badge.color} />
                                    <Text
                                      style={{
                                        fontSize: 11,
                                        fontWeight: "600",
                                        color: badge.color,
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      Earned
                                    </Text>
                                  </View>
                                )}
                                <View
                                  style={{
                                    marginTop: 8,
                                    paddingHorizontal: 8,
                                    paddingVertical: 4,
                                    backgroundColor: rarityColors[badge.rarity],
                                    borderRadius: 8,
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 10,
                                      fontWeight: "600",
                                      color: "#ffffff",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {badge.rarity}
                                  </Text>
                                </View>
                                <Text
                                  style={{
                                    fontSize: 11,
                                    color: "rgba(255, 255, 255, 0.5)",
                                    marginTop: 8,
                                    textAlign: "center",
                                  }}
                                >
                                  {badge.requirement.description}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                    ))
                  ) : (
                    // Show filtered badges
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 16,
                      }}
                    >
                      {filteredBadges.map((badge) => {
                        const userBadge = getBadgeStatus(badge.id);
                        const isEarned = userBadge?.isEarned || false;
                        const progress = userBadge?.progress || 0;

                        return (
                          <TouchableOpacity
                            key={badge.id}
                            style={{
                              width: "47%",
                              minWidth: 200,
                              backgroundColor: "#474747",
                              borderRadius: 20,
                              padding: 20,
                              borderWidth: 1,
                              borderColor: isEarned
                                ? badge.color
                                : "rgba(186, 153, 136, 0.2)",
                              alignItems: "center",
                              opacity: isEarned ? 1 : 0.6,
                            }}
                          >
                            <BadgeIcon
                              icon={badge.icon}
                              size={80}
                              color={badge.color}
                              isEarned={isEarned}
                              gradient={badge.gradient}
                            />
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "700",
                                color: "#ffffff",
                                marginTop: 12,
                                marginBottom: 4,
                                textAlign: "center",
                              }}
                            >
                              {badge.name}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                color: "rgba(255, 255, 255, 0.6)",
                                textAlign: "center",
                                marginBottom: 8,
                                lineHeight: 16,
                              }}
                            >
                              {badge.description}
                            </Text>
                            {!isEarned && progress > 0 && (
                              <View style={{ width: "100%", marginTop: 8 }}>
                                <View
                                  style={{
                                    height: 4,
                                    backgroundColor: "#232323",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                  }}
                                >
                                  <View
                                    style={{
                                      height: "100%",
                                      width: `${progress}%`,
                                      backgroundColor: badge.color,
                                      borderRadius: 2,
                                    }}
                                  />
                                </View>
                                <Text
                                  style={{
                                    fontSize: 10,
                                    color: "rgba(255, 255, 255, 0.5)",
                                    marginTop: 4,
                                    textAlign: "center",
                                  }}
                                >
                                  {progress}% complete
                                </Text>
                              </View>
                            )}
                            {isEarned && (
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  marginTop: 8,
                                  gap: 4,
                                }}
                              >
                                <MaterialIcons name="check-circle" size={16} color={badge.color} />
                                <Text
                                  style={{
                                    fontSize: 11,
                                    fontWeight: "600",
                                    color: badge.color,
                                    textTransform: "uppercase",
                                  }}
                                >
                                  Earned
                                </Text>
                              </View>
                            )}
                            <View
                              style={{
                                marginTop: 8,
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                backgroundColor: rarityColors[badge.rarity],
                                borderRadius: 8,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 10,
                                  fontWeight: "600",
                                  color: "#ffffff",
                                  textTransform: "uppercase",
                                }}
                              >
                                {badge.rarity}
                              </Text>
                            </View>
                            <Text
                              style={{
                                fontSize: 11,
                                color: "rgba(255, 255, 255, 0.5)",
                                marginTop: 8,
                                textAlign: "center",
                              }}
                            >
                              {badge.requirement.description}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

