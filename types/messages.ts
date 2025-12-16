export interface MessageAttachment {
  id: string;
  type: "image" | "video" | "document" | "audio";
  url: string;
  thumbnailUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  duration?: number; // For audio/video in seconds
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId: string;
  recipientName: string;
  text: string;
  attachments?: MessageAttachment[];
  read: boolean;
  createdAt: string;
  readAt?: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: string[];
  participantAvatars?: string[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
  type: "direct" | "group" | "support";
}

export interface MessageBadge {
  total: number;
  unreadConversations: number;
}
