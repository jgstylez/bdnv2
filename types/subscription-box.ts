import { Currency } from "./international";
import { Product } from "./merchant";

/**
 * Subscription Box Types
 * 
 * This feature allows businesses with BDN+ Business subscriptions
 * to offer recurring shipments with automated billing for physical products.
 */

export type SubscriptionFrequency = "weekly" | "bi-weekly" | "monthly" | "bi-monthly" | "quarterly";

export type SubscriptionStatus = "active" | "paused" | "cancelled" | "expired" | "pending";

export type SubscriptionDuration = number; // Number of shipments (e.g., 4, 12, 24) or -1 for indefinite

export interface SubscriptionBoxPlan {
  id: string;
  productId: string;
  merchantId: string;
  name: string;
  description?: string;
  frequency: SubscriptionFrequency;
  duration: SubscriptionDuration; // -1 for indefinite/ongoing
  pricePerShipment: number;
  currency: Currency;
  shippingCostPerShipment: number;
  discountPercentage?: number; // Discount for subscribing vs one-time purchase
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface SubscriptionBox {
  id: string;
  userId: string;
  productId: string;
  merchantId: string;
  planId: string;
  quantity: number;
  frequency: SubscriptionFrequency;
  duration: SubscriptionDuration;
  status: SubscriptionStatus;
  // Pricing
  pricePerShipment: number;
  shippingCostPerShipment: number;
  currency: Currency;
  discountPercentage?: number;
  // Billing
  paymentMethodId: string;
  nextBillingDate: string;
  nextShipmentDate: string;
  // Tracking
  shipmentsCompleted: number;
  shipmentsRemaining: number; // -1 for indefinite
  // Dates
  startDate: string;
  endDate?: string; // Only set if duration is finite
  pausedUntil?: string; // If paused, when to resume
  cancelledAt?: string;
  // Metadata
  createdAt: string;
  updatedAt?: string;
}

export interface SubscriptionBoxShipment {
  id: string;
  subscriptionBoxId: string;
  shipmentNumber: number; // 1, 2, 3, etc.
  status: "pending" | "processing" | "shipped" | "delivered" | "failed" | "cancelled";
  // Order details
  orderId?: string; // Link to order/transaction
  transactionId?: string;
  // Shipping
  trackingNumber?: string;
  carrier?: string;
  estimatedDeliveryDate?: string;
  deliveredAt?: string;
  // Dates
  scheduledShipDate: string;
  shippedAt?: string;
  createdAt: string;
}

export interface SubscriptionBoxOrder {
  id: string;
  subscriptionBoxId: string;
  shipmentId: string;
  userId: string;
  productId: string;
  merchantId: string;
  quantity: number;
  // Pricing
  subtotal: number;
  shippingCost: number;
  serviceFee: number;
  total: number;
  currency: Currency;
  // Payment
  paymentMethodId: string;
  transactionId?: string;
  // Status
  status: "pending" | "processing" | "completed" | "failed" | "refunded";
  // Dates
  orderDate: string;
  completedAt?: string;
}

/**
 * Helper function to calculate next billing/shipment dates
 */
export function calculateNextDate(
  frequency: SubscriptionFrequency,
  fromDate: Date = new Date()
): Date {
  const next = new Date(fromDate);
  
  switch (frequency) {
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "bi-weekly":
      next.setDate(next.getDate() + 14);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    case "bi-monthly":
      next.setMonth(next.getMonth() + 2);
      break;
    case "quarterly":
      next.setMonth(next.getMonth() + 3);
      break;
  }
  
  return next;
}

/**
 * Get human-readable frequency label
 */
export function getFrequencyLabel(frequency: SubscriptionFrequency): string {
  const labels: Record<SubscriptionFrequency, string> = {
    "weekly": "Every Week",
    "bi-weekly": "Every 2 Weeks",
    "monthly": "Every Month",
    "bi-monthly": "Every 2 Months",
    "quarterly": "Every 3 Months",
  };
  return labels[frequency];
}

/**
 * Get human-readable duration label
 */
export function getDurationLabel(duration: SubscriptionDuration): string {
  if (duration === -1) {
    return "Ongoing";
  }
  if (duration === 1) {
    return "1 shipment";
  }
  return `${duration} shipments`;
}

