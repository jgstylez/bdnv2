import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { NonprofitSwitcher } from '@/components/NonprofitSwitcher';
import { useResponsive } from '@/hooks/useResponsive';
import { useCampaigns } from '@/hooks/useCampaigns';
import { logger } from '@/lib/logger';
import { BackButton } from '@/components/navigation/BackButton';

export default function NonprofitCampaigns() {
  const router = useRouter();
  const { paddingHorizontal } = useResponsive();
  const { filter, setFilter, filteredCampaigns, getProgress } = useCampaigns();

  const deleteCampaign = (id: string) => {
    Alert.alert(
      "Delete Campaign",
      "Are you sure you want to delete this campaign?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => logger.info("Campaign deleted", { campaignId: id }) }
      ]
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        <BackButton 
          textColor="#ffffff"
          iconColor="#ffffff"
          onPress={() => {
            router.push("/pages/nonprofit/dashboard");
          }}
        />
        {/* Nonprofit Switcher */}
        <NonprofitSwitcher />

        {/* Create Campaign Button */}
        <View style={{ marginBottom: 24, alignItems: "flex-end" }}>
          <TouchableOpacity
            onPress={() => {
              router.push("/pages/nonprofit/campaigns/create");
            }}
            style={{
              backgroundColor: "#ba9988",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <MaterialIcons name="add" size={20} color="#ffffff" />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#ffffff",
              }}
            >
              Create New Campaign
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#474747",
              borderRadius: 12,
              padding: 4,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            {(["all", "active", "completed"] as const).map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setFilter(status)}
                style={{
                  flex: 1,
                  backgroundColor: filter === status ? "#ba9988" : "transparent",
                  paddingVertical: 10,
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: filter === status ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                    textTransform: "capitalize",
                  }}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Campaigns List */}
        {filteredCampaigns.length > 0 ? (
          <View style={{ gap: 16 }}>
            {filteredCampaigns.map((campaign) => {
              const progress = campaign.targetAmount ? getProgress(campaign.currentAmount, campaign.targetAmount) : 0;
              return (
                <View
                  key={campaign.id}
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      router.push(`/pages/nonprofit/campaigns/${campaign.id}`);
                    }}
                  >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: "700",
                              color: "#ffffff",
                            }}
                          >
                            {campaign.title}
                          </Text>
                          <View
                            style={{
                              backgroundColor: campaign.status === "active" ? "rgba(76, 175, 80, 0.15)" : "rgba(186, 153, 136, 0.15)",
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 6,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 10,
                                color: campaign.status === "active" ? "#4caf50" : "#ba9988",
                                fontWeight: "600",
                                textTransform: "capitalize",
                              }}
                            >
                              {campaign.status}
                            </Text>
                          </View>
                        </View>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "rgba(255, 255, 255, 0.7)",
                            marginBottom: 12,
                            lineHeight: 20,
                          }}
                        >
                          {campaign.description}
                        </Text>
                      </View>
                    </View>

                    {campaign.targetAmount && (
                      <>
                        <View style={{ marginBottom: 8 }}>
                          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: "600",
                                color: "#ffffff",
                              }}
                            >
                              ${campaign.currentAmount.toLocaleString()} raised
                            </Text>
                            <Text
                              style={{
                                fontSize: 14,
                                color: "rgba(255, 255, 255, 0.7)",
                              }}
                            >
                              ${campaign.targetAmount.toLocaleString()} goal
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
                                width: `${progress}%`,
                                backgroundColor: "#ba9988",
                              }}
                            />
                          </View>
                        </View>
                      </>
                    )}

                    <View style={{ flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <MaterialIcons name="people" size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Text
                          style={{
                            fontSize: 12,
                            color: "rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          {campaign.contributors} contributors
                        </Text>
                      </View>
                      {campaign.tags.length > 0 && (
                        <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
                          {campaign.tags.slice(0, 3).map((tag) => (
                            <View
                              key={tag}
                              style={{
                                backgroundColor: "rgba(186, 153, 136, 0.15)",
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderRadius: 6,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 10,
                                  color: "#ba9988",
                                  fontWeight: "500",
                                }}
                              >
                                {tag}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => router.push(`/pages/nonprofit/campaigns/edit/${campaign.id}`)}
                      style={{
                        backgroundColor: "#474747",
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 12,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.5)"
                      }}
                    >
                      <MaterialIcons name="edit" size={20} color="#ba9988" />
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: "#ba9988",
                        }}
                      >
                        Edit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteCampaign(campaign.id)}
                      style={{
                        backgroundColor: "#474747",
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 12,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        borderWidth: 1,
                        borderColor: "rgba(255, 82, 82, 0.5)"
                      }}
                    >
                      <MaterialIcons name="delete" size={20} color="#ff5252" />
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: "#ff5252",
                        }}
                      >
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
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
            <MaterialIcons name="campaign" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              No {filter === "all" ? "" : filter} campaigns found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
