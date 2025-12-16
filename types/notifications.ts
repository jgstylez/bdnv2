export type NotificationChannel = "wallet" | "promotions" | "events" | "system" | "social" | "merchant";

export type NotificationType = "transaction" | "promotion" | "event" | "system" | "social" | "achievement" | "reminder";

export type NotificationPriority = "low" | "normal" | "high" | "urgent";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  priority: NotificationPriority;
  title: string;
  message: string;
  data?: {
    [key: string]: any;
    // Common data fields
    transactionId?: string;
    businessId?: string;
    eventId?: string;
    link?: string;
    actionUrl?: string;
  };
  read: boolean;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
  imageUrl?: string;
  icon?: string;
}

export interface NotificationPreferences {
  userId: string;
  channels: {
    [key in NotificationChannel]: {
      enabled: boolean;
      push: boolean;
      email: boolean;
      inApp: boolean;
    };
  };
  quietHours?: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
    timezone: string;
  };
  digest?: {
    enabled: boolean;
    frequency: "daily" | "weekly";
    time: string; // HH:mm format
  };
}

export interface NotificationBadge {
  total: number;
  byChannel: {
    [key in NotificationChannel]: number;
  };
}

export interface PushNotificationToken {
  userId: string;
  token: string;
  platform: "ios" | "android" | "web";
  deviceId?: string;
  createdAt: string;
  lastUsedAt: string;
}

