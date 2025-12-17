/**
 * Subscription Box Management Utilities
 * 
 * Handles subscription box creation, billing, and shipment scheduling
 */

import {
  SubscriptionBox,
  SubscriptionBoxPlan,
  SubscriptionBoxOrder,
  SubscriptionBoxShipment,
  SubscriptionFrequency,
  SubscriptionDuration,
  calculateNextDate,
} from "../types/subscription-box";
import { Product } from "../types/merchant";
import { Currency } from "../types/international";
import { calculateConsumerServiceFee, calculateConsumerTotalWithFee, checkBDNPlusSubscription } from "./fees";

/**
 * Check if merchant has BDN+ Business subscription (required for subscription boxes)
 */
export function checkMerchantHasBDNPlusBusiness(merchantId: string): boolean {
  // TODO: Replace with actual subscription check from backend/context
  // Mock implementation - in production, check merchant's subscription status
  // const merchant = await getMerchant(merchantId);
  // const subscription = await getMerchantSubscription(merchantId);
  // return subscription?.tier === "premium" && subscription?.status === "active";
  
  // Mock: Return true for merchant-1 (Soul Food Kitchen) to enable testing
  // In production, this would check the merchant's actual subscription status
  const merchantsWithBDNPlusBusiness = ["merchant-1"];
  return merchantsWithBDNPlusBusiness.includes(merchantId);
}

/**
 * Create a subscription box plan for a product
 */
export function createSubscriptionBoxPlan(
  product: Product,
  frequency: SubscriptionFrequency,
  duration: SubscriptionDuration,
  discountPercentage?: number
): SubscriptionBoxPlan {
  if (product.productType !== "physical") {
    throw new Error("Subscription boxes are only available for physical products");
  }

  if (!product.shippingRequired) {
    throw new Error("Subscription boxes require shipping");
  }

  return {
    id: `plan-${product.id}-${frequency}-${Date.now()}`,
    productId: product.id,
    merchantId: product.merchantId,
    name: `${product.name} - ${getFrequencyLabel(frequency)}`,
    description: `Recurring delivery of ${product.name}`,
    frequency,
    duration,
    pricePerShipment: product.price,
    currency: product.currency,
    shippingCostPerShipment: product.shippingCost || 0,
    discountPercentage,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Calculate subscription box pricing
 */
export function calculateSubscriptionBoxPricing(
  plan: SubscriptionBoxPlan,
  quantity: number,
  userId: string
): {
  pricePerShipment: number;
  shippingPerShipment: number;
  subtotalPerShipment: number;
  serviceFeePerShipment: number;
  totalPerShipment: number;
  currency: Currency;
  discountAmount?: number;
  hasBDNPlus: boolean;
} {
  const hasBDNPlus = checkBDNPlusSubscription(userId);
  
  // Calculate base pricing
  const pricePerShipment = plan.pricePerShipment * quantity;
  const shippingPerShipment = plan.shippingCostPerShipment * quantity;
  const subtotalPerShipment = pricePerShipment + shippingPerShipment;
  
  // Apply discount if available
  let discountAmount: number | undefined;
  if (plan.discountPercentage && plan.discountPercentage > 0) {
    discountAmount = (pricePerShipment * plan.discountPercentage) / 100;
  }
  
  const discountedSubtotal = discountAmount 
    ? subtotalPerShipment - discountAmount 
    : subtotalPerShipment;
  
  // Calculate service fee
  const feeCalculation = calculateConsumerTotalWithFee(
    discountedSubtotal,
    plan.currency,
    hasBDNPlus
  );
  
  return {
    pricePerShipment: plan.pricePerShipment * quantity,
    shippingPerShipment: plan.shippingCostPerShipment * quantity,
    subtotalPerShipment: discountedSubtotal,
    serviceFeePerShipment: feeCalculation.serviceFee,
    totalPerShipment: feeCalculation.total,
    currency: plan.currency,
    discountAmount,
    hasBDNPlus,
  };
}

/**
 * Create a new subscription box
 */
export function createSubscriptionBox(
  plan: SubscriptionBoxPlan,
  userId: string,
  quantity: number,
  paymentMethodId: string,
  startDate?: Date
): SubscriptionBox {
  const start = startDate || new Date();
  const nextBillingDate = calculateNextDate(plan.frequency, start);
  const nextShipmentDate = calculateNextDate(plan.frequency, start);
  
  const shipmentsRemaining = plan.duration === -1 ? -1 : plan.duration;
  const endDate = plan.duration === -1 
    ? undefined 
    : new Date(start.getTime() + (plan.duration * getDaysForFrequency(plan.frequency) * 24 * 60 * 60 * 1000)).toISOString();
  
  return {
    id: `sub-box-${Date.now()}`,
    userId,
    productId: plan.productId,
    merchantId: plan.merchantId,
    planId: plan.id,
    quantity,
    frequency: plan.frequency,
    duration: plan.duration,
    status: "active",
    pricePerShipment: plan.pricePerShipment,
    shippingCostPerShipment: plan.shippingCostPerShipment,
    currency: plan.currency,
    discountPercentage: plan.discountPercentage,
    paymentMethodId,
    nextBillingDate: nextBillingDate.toISOString(),
    nextShipmentDate: nextShipmentDate.toISOString(),
    shipmentsCompleted: 0,
    shipmentsRemaining,
    startDate: start.toISOString(),
    endDate,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Process next subscription box shipment and billing
 */
export function processNextShipment(
  subscriptionBox: SubscriptionBox,
  pricing: ReturnType<typeof calculateSubscriptionBoxPricing>
): {
  order: SubscriptionBoxOrder;
  shipment: SubscriptionBoxShipment;
  updatedSubscription: SubscriptionBox;
} {
  const now = new Date();
  
  // Create order
  const order: SubscriptionBoxOrder = {
    id: `order-${subscriptionBox.id}-${subscriptionBox.shipmentsCompleted + 1}`,
    subscriptionBoxId: subscriptionBox.id,
    shipmentId: `shipment-${subscriptionBox.id}-${subscriptionBox.shipmentsCompleted + 1}`,
    userId: subscriptionBox.userId,
    productId: subscriptionBox.productId,
    merchantId: subscriptionBox.merchantId,
    quantity: subscriptionBox.quantity,
    subtotal: pricing.subtotalPerShipment,
    shippingCost: pricing.shippingPerShipment,
    serviceFee: pricing.serviceFeePerShipment,
    total: pricing.totalPerShipment,
    currency: pricing.currency,
    paymentMethodId: subscriptionBox.paymentMethodId,
    status: "pending",
    orderDate: now.toISOString(),
  };
  
  // Create shipment
  const shipment: SubscriptionBoxShipment = {
    id: order.shipmentId,
    subscriptionBoxId: subscriptionBox.id,
    shipmentNumber: subscriptionBox.shipmentsCompleted + 1,
    status: "pending",
    orderId: order.id,
    scheduledShipDate: subscriptionBox.nextShipmentDate,
    createdAt: now.toISOString(),
  };
  
  // Update subscription box
  const nextBillingDate = calculateNextDate(subscriptionBox.frequency, new Date(subscriptionBox.nextBillingDate));
  const nextShipmentDate = calculateNextDate(subscriptionBox.frequency, new Date(subscriptionBox.nextShipmentDate));
  
  const updatedSubscription: SubscriptionBox = {
    ...subscriptionBox,
    nextBillingDate: nextBillingDate.toISOString(),
    nextShipmentDate: nextShipmentDate.toISOString(),
    shipmentsCompleted: subscriptionBox.shipmentsCompleted + 1,
    shipmentsRemaining: subscriptionBox.shipmentsRemaining === -1 
      ? -1 
      : Math.max(0, subscriptionBox.shipmentsRemaining - 1),
    status: subscriptionBox.shipmentsRemaining === 1 ? "expired" : subscriptionBox.status,
    updatedAt: now.toISOString(),
  };
  
  return {
    order,
    shipment,
    updatedSubscription,
  };
}

/**
 * Helper function to get days for frequency
 */
function getDaysForFrequency(frequency: SubscriptionFrequency): number {
  switch (frequency) {
    case "weekly":
      return 7;
    case "bi-weekly":
      return 14;
    case "monthly":
      return 30;
    case "bi-monthly":
      return 60;
    case "quarterly":
      return 90;
  }
}

/**
 * Helper function to get frequency label
 */
function getFrequencyLabel(frequency: SubscriptionFrequency): string {
  const labels: Record<SubscriptionFrequency, string> = {
    "weekly": "Every Week",
    "bi-weekly": "Every 2 Weeks",
    "monthly": "Every Month",
    "bi-monthly": "Every 2 Months",
    "quarterly": "Every 3 Months",
  };
  return labels[frequency];
}

