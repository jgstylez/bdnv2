import { InternationalAddress, Currency } from "./international";

export type EventStatus = "draft" | "published" | "cancelled" | "completed";
export type EventCategory = "music" | "sports" | "business" | "community" | "education" | "arts" | "food" | "other";
export type TicketStatus = "available" | "purchased" | "used" | "cancelled" | "refunded";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface Event {
  id: string;
  organizerId: string;
  organizerName: string;
  organizerType: "business" | "nonprofit" | "individual";
  title: string;
  description: string;
  category: EventCategory;
  imageUrl?: string;
  venue: InternationalAddress & {
    name: string;
    latitude?: number;
    longitude?: number;
  };
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  timezone: string;
  status: EventStatus;
  isPublic: boolean;
  maxAttendees?: number;
  currentAttendees: number;
  ticketTypes: TicketType[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  price: number;
  currency: Currency;
  quantity: number;
  availableQuantity: number;
  salesStartDate?: string;
  salesEndDate?: string;
  isTransferable: boolean;
  maxPerOrder: number;
  minPerOrder: number;
  createdAt: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  ticketTypeId: string;
  ticketTypeName: string;
  userId: string;
  userName: string;
  userEmail: string;
  purchasePrice: number;
  currency: Currency;
  status: TicketStatus;
  qrCode: string;
  purchaseDate: string;
  orderId: string;
  transferToUserId?: string;
  usedAt?: string;
  refundedAt?: string;
}

export interface TicketOrder {
  id: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  tickets: Ticket[];
  totalAmount: number;
  currency: Currency;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
  completedAt?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  ticketIds: string[];
  status: "registered" | "cancelled" | "attended";
  registeredAt: string;
  cancelledAt?: string;
  attendedAt?: string;
}

export interface EventAnalytics {
  eventId: string;
  totalTicketsSold: number;
  totalRevenue: number;
  revenueByTicketType: {
    ticketTypeId: string;
    ticketTypeName: string;
    quantitySold: number;
    revenue: number;
  }[];
  attendeeCount: number;
  checkInCount: number;
  views: number;
  shares: number;
}

