/**
 * Order Types
 * 
 * Comprehensive order types for businesses and nonprofits
 * Supports product orders, donations, subscriptions, and event tickets
 */

import { Currency, InternationalAddress } from "./international";
import { Product, ProductVariant } from "./merchant";

export type OrderType = "product" | "donation" | "subscription-box" | "event-ticket" | "c2b-payment" | "service";

export type OrderStatus = 
  | "pending" 
  | "confirmed" 
  | "processing" 
  | "ready-to-ship" 
  | "shipped" 
  | "delivered" 
  | "completed" 
  | "cancelled" 
  | "refunded" 
  | "failed";

export type FulfillmentStatus = 
  | "unfulfilled" 
  | "partial" 
  | "fulfilled" 
  | "shipped" 
  | "delivered";

export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productType: "physical" | "digital" | "service";
  variantId?: string;
  variantName?: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: Currency;
  imageUrl?: string;
  // For digital products
  downloadUrl?: string;
  downloadLimit?: number;
  // For service products
  serviceDate?: string;
  serviceLocation?: string;
}

export interface ShippingAddress extends InternationalAddress {
  fullName: string;
  phone?: string;
  phoneCountryCode?: string;
  isDefault?: boolean;
}

export interface ShippingInfo {
  method?: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // Human-readable order number (e.g., "ORD-2024-001234")
  entityId: string; // Business or nonprofit ID
  entityType: "business" | "nonprofit";
  entityName: string;
  orderType: OrderType;
  
  // Customer information
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  
  // Order items
  items: OrderItem[];
  
  // Pricing
  subtotal: number;
  tax: number;
  shippingCost: number;
  serviceFee: number;
  discount: number;
  total: number;
  currency: Currency;
  
  // Payment
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentMethodId?: string;
  transactionId?: string;
  paidAt?: string;
  
  // Fulfillment
  status: OrderStatus;
  fulfillmentStatus: FulfillmentStatus;
  shippingAddress?: ShippingAddress;
  shippingInfo?: ShippingInfo;
  
  // Notes
  customerNotes?: string;
  internalNotes?: string;
  
  // Dates
  createdAt: string;
  updatedAt?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  completedAt?: string;
  
  // Refunds
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: string;
  
  // Related entities
  subscriptionBoxId?: string; // For subscription box orders
  eventId?: string; // For event ticket orders
  campaignId?: string; // For donation orders
}

export interface OrderFilter {
  status?: OrderStatus[];
  fulfillmentStatus?: FulfillmentStatus[];
  paymentStatus?: PaymentStatus[];
  orderType?: OrderType[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchQuery?: string;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  period: "today" | "week" | "month" | "year" | "all";
}

