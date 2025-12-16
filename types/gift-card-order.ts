/**
 * Gift Card Ordering Types
 * 
 * Types for purchasing and sending gift cards to other users
 */

export type GiftCardType = "universal" | "merchant";

export interface GiftCardOrder {
  id: string;
  type: GiftCardType;
  amount: number; // Amount in BLKD
  merchantId?: string; // Required if type is "merchant"
  merchantName?: string;
  recipientUserId: string;
  recipientName?: string;
  recipientEmail?: string;
  senderUserId: string;
  senderName?: string;
  note?: string;
  scheduledSendDate?: string; // ISO date string, if null, send immediately
  sentAt?: string; // ISO date string, when gift card was actually sent
  status: "pending" | "scheduled" | "sent" | "redeemed" | "expired";
  createdAt: string;
  giftCardId?: string; // ID of the created gift card wallet
}

export interface GiftCardOrderFormData {
  type: GiftCardType;
  amount: number;
  merchantId?: string;
  recipientUserId?: string;
  recipientEmail?: string;
  recipientSearchQuery?: string;
  note?: string;
  sendImmediately: boolean;
  scheduledDate?: string;
}

