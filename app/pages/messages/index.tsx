import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Conversation } from '@/types/messages';
import { BackButton } from '@/components/navigation/BackButton';

// Mock conversations
const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    participantIds: ["user1", "business-1"],
    participantNames: ["Soul Food Kitchen"],
    participantAvatars: [],
    lastMessage: {
      id: "msg-1",
      conversationId: "conv-1",
      senderId: "business-1",
      senderName: "Soul Food Kitchen",
      recipientId: "user1",
      recipientName: "You",
      text: "Thank you for your order! Your food will be ready in 15 minutes.",
      read: false,
      createdAt: "2024-02-15T10:30:00Z",
    },
    unreadCount: 2,
    updatedAt: "2024-02-15T10:30:00Z",
    type: "direct",
  },
  {
    id: "conv-2",
    participantIds: ["user1", "support"],
    participantNames: ["BDN Support"],
    participantAvatars: [],
    lastMessage: {
      id: "msg-2",
      conversationId: "conv-2",
      senderId: "support",
      senderName: "BDN Support",
      recipientId: "user1",
      recipientName: "You",
      text: "We've resolved your account issue. Is there anything else we can help with?",
      read: true,
      createdAt: "2024-02-14T14:20:00Z",
      readAt: "2024-02-14T14:25:00Z",
    },
    unreadCount: 0,
    updatedAt: "2024-02-14T14:20:00Z",
    type: "support",
  },
  {
    id: "conv-3",
    participantIds: ["user1", "user2"],
    participantNames: ["Sarah Johnson"],
    participantAvatars: [],
    lastMessage: {
      id: "msg-3",
      conversationId: "conv-3",
      senderId: "user1",
      senderName: "You",
      recipientId: "user2",
      recipientName: "Sarah Johnson",
      text: "Thanks for the referral!",
      read: true,
      createdAt: "2024-02-13T09:15:00Z",
      readAt: "2024-02-13T09:16:00Z",
    },
    unreadCount: 0,
    updatedAt: "2024-02-13T09:15:00Z",
    type: "direct",
  },
  {
    id: "group-1",
    participantIds: ["user1", "user2", "user3", "user4", "user5"],
    participantNames: ["Black Business Network", "Sarah Johnson", "Marcus Williams", "Jasmine Brown", "David Lee"],
    participantAvatars: [],
    lastMessage: {
      id: "group-msg-1",
      conversationId: "group-1",
      senderId: "user3",
      senderName: "Marcus Williams",
      recipientId: "group-1",
      recipientName: "Black Business Network",
      text: "Just checked out the new restaurant downtown - amazing food! 🍽️",
      read: false,
      createdAt: "2024-02-15T14:20:00Z",
    },
    unreadCount: 3,
    updatedAt: "2024-02-15T14:20:00Z",
    type: "group",
  },
  {
    id: "group-2",
    participantIds: ["user1", "user6", "user7", "user8"],
    participantNames: ["Community Events", "Alex Thompson", "Maria Garcia", "James Wilson"],
    participantAvatars: [],
    lastMessage: {
      id: "group-msg-2",
      conversationId: "group-2",
      senderId: "user6",
      senderName: "Alex Thompson",
      recipientId: "group-2",
      recipientName: "Community Events",
      text: "Who's going to the networking event this weekend?",
      read: true,
      createdAt: "2024-02-15T11:45:00Z",
      readAt: "2024-02-15T11:50:00Z",
    },
    unreadCount: 0,
    updatedAt: "2024-02-15T11:45:00Z",
    type: "group",
  },
];

export default function Messages() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedType, setSelectedType] = useState<"all" | "direct" | "support" | "group">("all");

  const filteredConversations = conversations.filter((conv) => {
    if (selectedType === "all") return true;
    return conv.type === selectedType;
  });

  const unreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    // Format date explicitly to avoid iOS truncation issues
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
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
        <BackButton 
          textColor="#ffffff"
          iconColor="#ffffff"
          onPress={() => {
            router.back();
          }}
        />
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: isMobile ? 28 : 36,
              fontWeight: "800",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            Messages
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 24,
            }}
          >
            Your conversations and messages
          </Text>
        </View>

        {/* Filters */}
        <View style={{ marginBottom: 24 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {[
              { key: "all", label: "All" },
              { key: "direct", label: "Direct" },
              { key: "support", label: "Support" },
              { key: "group", label: "Groups" },
            ].map((type) => (
              <TouchableOpacity
                key={type.key}
                onPress={() => setSelectedType(type.key as any)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  backgroundColor: selectedType === type.key ? "#ba9988" : "#474747",
                  borderWidth: 1,
                  borderColor:
                    selectedType === type.key
                      ? "#ba9988"
                      : "rgba(186, 153, 136, 0.2)",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: selectedType === type.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Conversations List */}
        {filteredConversations.length > 0 ? (
          <View style={{ gap: 12 }}>
            {filteredConversations
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((conversation) => (
                <TouchableOpacity
                  key={conversation.id}
                  onPress={() => router.push(`/pages/messages/${conversation.id}`)}
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: conversation.unreadCount > 0 ? "rgba(186, 153, 136, 0.3)" : "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    {/* Avatar */}
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: "#ba9988",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {conversation.type === "group" ? (
                        <MaterialIcons name="groups" size={28} color="#ffffff" />
                      ) : (
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: "700",
                            color: "#ffffff",
                          }}
                        >
                          {conversation.participantNames[0]?.charAt(0) || "?"}
                        </Text>
                      )}
                    </View>

                    {/* Content */}
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4, gap: 8 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: conversation.unreadCount > 0 ? "700" : "600",
                            color: "#ffffff",
                            flex: 1,
                            minWidth: 0,
                          }}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {conversation.participantNames.join(", ")}
                        </Text>
                        {conversation.lastMessage && (
                          <Text
                            style={{
                              fontSize: 12,
                              color: "rgba(255, 255, 255, 0.5)",
                              flexShrink: 0,
                            }}
                          >
                            {formatTime(conversation.lastMessage.createdAt)}
                          </Text>
                        )}
                      </View>
                      {conversation.lastMessage && (
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: conversation.unreadCount > 0 ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.6)",
                              flex: 1,
                              minWidth: 0,
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {conversation.lastMessage.senderId === "user1" ? "You: " : ""}
                            {conversation.lastMessage.text}
                          </Text>
                          {conversation.unreadCount > 0 && (
                            <View
                              style={{
                                minWidth: 20,
                                height: 20,
                                borderRadius: 10,
                                backgroundColor: "#ba9988",
                                alignItems: "center",
                                justifyContent: "center",
                                paddingHorizontal: 6,
                                flexShrink: 0,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 11,
                                  fontWeight: "700",
                                  color: "#ffffff",
                                }}
                              >
                                {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
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
            <MaterialIcons name="inbox" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              No messages yet
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

