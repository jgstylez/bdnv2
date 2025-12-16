import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, RefreshControl, Platform, Alert, Switch } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Notification, NotificationChannel, NotificationBadge } from "../../../types/notifications";
import { markAllNotificationsRead } from "../../../lib/notifications";
import { logError } from "../../../lib/logger";

// Mock notifications - initial data
const initialNotifications: Notification[] = [
  {
    id: "1",
    userId: "user1",
    type: "transaction",
    channel: "wallet",
    priority: "normal",
    title: "Payment Received",
    message: "You received $50.00 from Soul Food Kitchen",
    data: { transactionId: "TXN-001", link: "/(tabs)/pay" },
    read: false,
    createdAt: "2024-02-15T10:30:00Z",
    icon: "payment",
  },
  {
    id: "2",
    userId: "user1",
    type: "promotion",
    channel: "promotions",
    priority: "normal",
    title: "New Deal Available",
    message: "20% off at Black Excellence Barbershop - Limited time!",
    data: { businessId: "2", link: "/pages/businesses/2" },
    read: false,
    createdAt: "2024-02-15T09:15:00Z",
    icon: "local-offer",
  },
  {
    id: "3",
    userId: "user1",
    type: "event",
    channel: "events",
    priority: "normal",
    title: "Community Event",
    message: "Black Business Expo this Saturday at 2 PM",
    data: { eventId: "1", link: "/pages/events/1" },
    read: true,
    createdAt: "2024-02-14T14:20:00Z",
    readAt: "2024-02-14T14:25:00Z",
    icon: "event",
  },
  {
    id: "4",
    userId: "user1",
    type: "achievement",
    channel: "system",
    priority: "low",
    title: "Level Up!",
    message: "Congratulations! You've reached Silver level",
    data: { link: "/pages/myimpact" },
    read: false,
    createdAt: "2024-02-14T08:00:00Z",
    icon: "stars",
  },
  {
    id: "5",
    userId: "user1",
    type: "transaction",
    channel: "wallet",
    priority: "normal",
    title: "Token Purchase Complete",
    message: "Your purchase of 10 BDN Tokens has been processed",
    data: { transactionId: "TXN-002", link: "/pages/tokens" },
    read: true,
    createdAt: "2024-02-13T16:45:00Z",
    readAt: "2024-02-13T16:50:00Z",
    icon: "account-balance-wallet",
  },
];

const channels: NotificationChannel[] = ["wallet", "promotions", "events", "system", "social", "merchant"];

const channelLabels: Record<NotificationChannel, string> = {
  wallet: "Wallet",
  promotions: "Promotions",
  events: "Events",
  system: "System",
  social: "Social",
  merchant: "Merchant",
};

const channelIcons: Record<NotificationChannel, string> = {
  wallet: "account-balance-wallet",
  promotions: "local-offer",
  events: "event",
  system: "settings",
  social: "people",
  merchant: "store",
};

export default function Notifications() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [selectedChannel, setSelectedChannel] = useState<NotificationChannel | "all">("all");
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);

  const filteredNotifications = notifications.filter((notification) => {
    if (selectedChannel === "all") return true;
    return notification.channel === selectedChannel;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const badgeCounts: NotificationBadge = {
    total: unreadCount,
    byChannel: {
      wallet: notifications.filter((n) => n.channel === "wallet" && !n.read).length,
      promotions: notifications.filter((n) => n.channel === "promotions" && !n.read).length,
      events: notifications.filter((n) => n.channel === "events" && !n.read).length,
      system: notifications.filter((n) => n.channel === "system" && !n.read).length,
      social: notifications.filter((n) => n.channel === "social" && !n.read).length,
      merchant: notifications.filter((n) => n.channel === "merchant" && !n.read).length,
    },
  };

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
    return date.toLocaleDateString();
  };

  const handleNotificationPress = (notification: Notification) => {
    if (notification.data?.link) {
      router.push(notification.data.link as any);
    }
    // Mark as read if unread
    if (!notification.read) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id
            ? { ...n, read: true, readAt: new Date().toISOString() }
            : n
        )
      );
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;

    setIsMarkingAllRead(true);
    try {
      // Call API to mark all as read
      await markAllNotificationsRead("user1"); // TODO: Get actual userId from auth context

      // Update local state
      const now = new Date().toISOString();
      setNotifications((prev) =>
        prev.map((notification) =>
          !notification.read
            ? { ...notification, read: true, readAt: now }
            : notification
        )
      );
    } catch (error) {
      logError("Error marking all notifications as read", error, { userId: "current-user" });
      Alert.alert("Error", "Failed to mark all notifications as read. Please try again.");
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedNotifications.size === 0) return;

    Alert.alert(
      "Delete Notifications",
      `Are you sure you want to delete ${selectedNotifications.size} notification${selectedNotifications.size > 1 ? "s" : ""}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: Call API to delete notifications
            setNotifications((prev) => prev.filter((n) => !selectedNotifications.has(n.id)));
            setSelectedNotifications(new Set());
            setIsSelectMode(false);
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    // Recalculate filtered notifications at call time
    const currentFiltered = notifications.filter((notification) => {
      if (selectedChannel === "all") return true;
      return notification.channel === selectedChannel;
    });

    if (currentFiltered.length === 0) return;

    Alert.alert(
      "Clear All Notifications",
      `Are you sure you want to delete all ${currentFiltered.length} notification${currentFiltered.length > 1 ? "s" : ""}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            // TODO: Call API to delete all notifications
            const filteredIds = new Set(currentFiltered.map((n) => n.id));
            setNotifications((prev) => prev.filter((n) => !filteredIds.has(n.id)));
            setSelectedNotifications(new Set());
            setIsSelectMode(false);
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Fetch new notifications
    setTimeout(() => setRefreshing(false), 1000);
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ba9988" />}
      >
        {/* Unread Count */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Actions */}
        <View style={{ marginBottom: 24, flexDirection: "row", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {/* Select All Toggle */}
            {isSelectMode && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginRight: 8 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#ba9988",
                  }}
                >
                  Select All
                </Text>
                <Switch
                  value={selectedNotifications.size === filteredNotifications.length && filteredNotifications.length > 0}
                  onValueChange={(value) => {
                    if (value) {
                      setSelectedNotifications(new Set(filteredNotifications.map((n) => n.id)));
                    } else {
                      setSelectedNotifications(new Set());
                    }
                  }}
                  trackColor={{ false: "#474747", true: "#ba9988" }}
                  thumbColor="#ffffff"
                />
              </View>
            )}
            {/* Select Mode Toggle */}
            <TouchableOpacity
              onPress={() => {
                setIsSelectMode(!isSelectMode);
                if (isSelectMode) {
                  setSelectedNotifications(new Set());
                }
              }}
              style={{
                backgroundColor: isSelectMode ? "#ba9988" : "#474747",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: isSelectMode ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <MaterialIcons name={isSelectMode ? "close" : "check-circle"} size={16} color={isSelectMode ? "#ffffff" : "#ba9988"} />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: isSelectMode ? "#ffffff" : "#ba9988",
                }}
              >
                {isSelectMode ? "Cancel" : "Select"}
              </Text>
            </TouchableOpacity>
            {/* Delete Selected Button */}
            {isSelectMode && selectedNotifications.size > 0 && (
              <TouchableOpacity
                onPress={handleDeleteSelected}
                style={{
                  backgroundColor: "#ff4444",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <MaterialIcons name="delete" size={16} color="#ffffff" />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  Delete ({selectedNotifications.size})
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => router.push("/pages/notifications/settings")}
              style={{
                backgroundColor: "#474747",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <MaterialIcons name="settings" size={16} color="#ba9988" />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: "#ba9988",
                }}
              >
                Settings
              </Text>
            </TouchableOpacity>
            {unreadCount > 0 && (
              <TouchableOpacity
                onPress={handleMarkAllRead}
                disabled={isMarkingAllRead}
                style={{
                  backgroundColor: "#474747",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  opacity: isMarkingAllRead ? 0.6 : 1,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {isMarkingAllRead && (
                  <MaterialIcons name="hourglass-empty" size={14} color="#ba9988" />
                )}
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#ba9988",
                  }}
                >
                  {isMarkingAllRead ? "Marking..." : "Mark all read"}
                </Text>
              </TouchableOpacity>
            )}
        </View>

        {/* Channel Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 24 }}
          contentContainerStyle={{ gap: 8 }}
        >
          <TouchableOpacity
            onPress={() => setSelectedChannel("all")}
            style={{
              backgroundColor: selectedChannel === "all" ? "#ba9988" : "#474747",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: selectedChannel === "all" ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: selectedChannel === "all" ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
              }}
            >
              All
            </Text>
            {badgeCounts.total > 0 && (
              <View
                style={{
                  backgroundColor: selectedChannel === "all" ? "rgba(255, 255, 255, 0.2)" : "#ba9988",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 10,
                  minWidth: 20,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  {badgeCounts.total}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {channels.map((channel) => (
            <TouchableOpacity
              key={channel}
              onPress={() => setSelectedChannel(channel)}
              style={{
                backgroundColor: selectedChannel === channel ? "#ba9988" : "#474747",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: selectedChannel === channel ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <MaterialIcons
                name={channelIcons[channel] as any}
                size={16}
                color={selectedChannel === channel ? "#ffffff" : "rgba(255, 255, 255, 0.7)"}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: selectedChannel === channel ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                }}
              >
                {channelLabels[channel]}
              </Text>
              {badgeCounts.byChannel[channel] > 0 && (
                <View
                  style={{
                    backgroundColor: selectedChannel === channel ? "rgba(255, 255, 255, 0.2)" : "#ba9988",
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 10,
                    minWidth: 20,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "700",
                      color: "#ffffff",
                    }}
                  >
                    {badgeCounts.byChannel[channel]}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <View style={{ gap: 12 }}>
            {filteredNotifications.map((notification) => {
              const isSelected = selectedNotifications.has(notification.id);
              return (
                <TouchableOpacity
                  key={notification.id}
                  onPress={() => {
                    if (isSelectMode) {
                      const newSelected = new Set(selectedNotifications);
                      if (isSelected) {
                        newSelected.delete(notification.id);
                      } else {
                        newSelected.add(notification.id);
                      }
                      setSelectedNotifications(newSelected);
                    } else {
                      handleNotificationPress(notification);
                    }
                  }}
                  onLongPress={() => {
                    if (!isSelectMode) {
                      setIsSelectMode(true);
                      setSelectedNotifications(new Set([notification.id]));
                    }
                  }}
                  style={{
                    backgroundColor: notification.read ? "#474747" : "#474747",
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: isSelected ? 2 : notification.read ? 1 : 2,
                    borderColor: isSelected ? "#ba9988" : notification.read ? "rgba(186, 153, 136, 0.2)" : "#ba9988",
                    opacity: notification.read ? 0.7 : 1,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  {/* Selection Checkbox */}
                  {isSelectMode && (
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: isSelected ? "#ba9988" : "rgba(255, 255, 255, 0.3)",
                        backgroundColor: isSelected ? "#ba9988" : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isSelected && <MaterialIcons name="check" size={16} color="#ffffff" />}
                    </View>
                  )}
                  <View style={{ flexDirection: "row", gap: 12, flex: 1 }}>
                  {/* Icon */}
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: notification.read ? "#232323" : "rgba(186, 153, 136, 0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons
                      name={(notification.icon || "notifications") as any}
                      size={24}
                      color={notification.read ? "rgba(186, 153, 136, 0.5)" : "#ba9988"}
                    />
                  </View>

                  {/* Content */}
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: notification.read ? "500" : "700",
                          color: "#ffffff",
                          flex: 1,
                        }}
                      >
                        {notification.title}
                      </Text>
                      {!notification.read && (
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: "#ba9988",
                            marginLeft: 8,
                          }}
                        />
                      )}
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                        marginBottom: 8,
                        lineHeight: 20,
                      }}
                    >
                      {notification.message}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.5)",
                        }}
                      >
                        {formatTime(notification.createdAt)}
                      </Text>
                      <View
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
                            fontWeight: "600",
                            textTransform: "capitalize",
                          }}
                        >
                          {channelLabels[notification.channel]}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
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
            <MaterialIcons name="notifications-none" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              No notifications in this channel
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

