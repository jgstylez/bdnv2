import { Notification, NotificationPreferences, PushNotificationToken, NotificationBadge } from "../types/notifications";
import * as Notifications from "expo-notifications";
import { logError, logInfo } from "./logger";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request push notification permissions
 */
export async function requestPushPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch (error) {
    logError("Error requesting push permissions", error);
    return false;
  }
}

/**
 * Get push notification token
 */
export async function getPushToken(): Promise<string | null> {
  try {
    const hasPermission = await requestPushPermissions();
    if (!hasPermission) {
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch (error) {
    logError("Error getting push token", error);
    return null;
  }
}

/**
 * Register push notification token with backend
 */
export async function registerPushToken(userId: string, token: string, platform: "ios" | "android" | "web"): Promise<void> {
  try {
    // TODO: Send token to backend API
    // await fetch("/api/notifications/tokens", {
    //   method: "POST",
    //   body: JSON.stringify({ userId, token, platform }),
    // });
    logInfo("Registering push token", { userId, token, platform });
  } catch (error) {
    logError("Error registering push token", error, { userId, platform });
  }
}

/**
 * Fetch user notifications
 */
export async function fetchNotifications(userId: string, channel?: string): Promise<Notification[]> {
  try {
    // TODO: Fetch from backend API
    // const response = await fetch(`/api/notifications?userId=${userId}&channel=${channel || ""}`);
    // return await response.json();
    return [];
  } catch (error) {
    logError("Error fetching notifications", error, { userId, channel });
    return [];
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(notificationId: string): Promise<void> {
  try {
    // TODO: Update on backend
    // await fetch(`/api/notifications/${notificationId}/read`, { method: "POST" });
    logInfo("Marking notification as read", { notificationId });
  } catch (error) {
    logError("Error marking notification as read", error, { notificationId });
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead(userId: string): Promise<void> {
  try {
    // TODO: Update on backend
    // await fetch(`/api/notifications/read-all?userId=${userId}`, { method: "POST" });
    logInfo("Marking all notifications as read for user", { userId });
  } catch (error) {
    logError("Error marking all notifications as read", error, { userId });
  }
}

/**
 * Get notification badge counts
 */
export async function getBadgeCounts(userId: string): Promise<NotificationBadge> {
  try {
    // TODO: Fetch from backend
    // const response = await fetch(`/api/notifications/badge?userId=${userId}`);
    // return await response.json();
    return {
      total: 0,
      byChannel: {
        wallet: 0,
        promotions: 0,
        events: 0,
        system: 0,
        social: 0,
        merchant: 0,
      },
    };
  } catch (error) {
    logError("Error getting badge counts", error, { userId });
    return {
      total: 0,
      byChannel: {
        wallet: 0,
        promotions: 0,
        events: 0,
        system: 0,
        social: 0,
        merchant: 0,
      },
    };
  }
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  userId: string,
  preferences: NotificationPreferences
): Promise<void> {
  try {
    // TODO: Update on backend
    // await fetch(`/api/notifications/preferences?userId=${userId}`, {
    //   method: "PUT",
    //   body: JSON.stringify(preferences),
    // });
    logInfo("Updating notification preferences", { userId, preferences });
  } catch (error) {
    logError("Error updating notification preferences", error, { userId });
  }
}

/**
 * Send email notification (backend only)
 */
export async function sendEmailNotification(
  userId: string,
  type: string,
  subject: string,
  body: string
): Promise<void> {
  try {
    // TODO: Send via backend API
    // await fetch("/api/notifications/email", {
    //   method: "POST",
    //   body: JSON.stringify({ userId, type, subject, body }),
    // });
    logInfo("Sending email notification", { userId, type, subject });
  } catch (error) {
    logError("Error sending email notification", error, { userId, type });
  }
}

/**
 * Setup notification listeners
 */
export function setupNotificationListeners(
  onNotificationReceived: (notification: Notification) => void,
  onNotificationTapped: (notification: Notification) => void
) {
  // Foreground notification handler
  Notifications.addNotificationReceivedListener((notification) => {
    // Convert Expo notification to our Notification type
    const customNotification: Notification = {
      id: notification.request.identifier,
      userId: "", // Will be set by backend
      type: notification.request.content.data?.type || "system",
      channel: notification.request.content.data?.channel || "system",
      priority: notification.request.content.data?.priority || "normal",
      title: notification.request.content.title || "",
      message: notification.request.content.body || "",
      data: notification.request.content.data,
      read: false,
      createdAt: new Date().toISOString(),
    };
    onNotificationReceived(customNotification);
  });

  // Background/quit notification tap handler
  Notifications.addNotificationResponseReceivedListener((response) => {
    const customNotification: Notification = {
      id: response.notification.request.identifier,
      userId: "",
      type: response.notification.request.content.data?.type || "system",
      channel: response.notification.request.content.data?.channel || "system",
      priority: response.notification.request.content.data?.priority || "normal",
      title: response.notification.request.content.title || "",
      message: response.notification.request.content.body || "",
      data: response.notification.request.content.data,
      read: false,
      createdAt: new Date().toISOString(),
    };
    onNotificationTapped(customNotification);
  });
}

