/**
 * Fee Calculation Utilities
 * 
 * Handles service fees for consumer orders and post-advertising fees
 * for businesses/nonprofits, with BDN+ subscription discounts
 */

import { Currency } from "../types/international";
import { SubscriptionTier } from "../types/subscription";
import { convertCurrencySync } from "./currency";

/**
 * Service fee configuration for consumer orders
 */
export const CONSUMER_SERVICE_FEE_CONFIG = {
  percentage: 0.10, // 10%
  minAmount: 1.00, // Minimum $1
  maxAmount: 14.99, // Maximum $14.99
  bdnPlusReduction: 1.0, // 100% reduction (0% fee) with BDN+
};

/**
 * Post-advertising fee configuration for businesses/nonprofits
 */
export const BUSINESS_FEE_CONFIG = {
  standardPercentage: 0.10, // 10%
  bdnPlusBusinessPercentage: 0.05, // 5% with BDN+ Business
};

/**
 * Calculate service fee for consumer orders
 * 
 * @param amount - Order amount
 * @param currency - Currency of the order
 * @param hasBDNPlus - Whether user has active BDN+ subscription
 * @returns Service fee amount
 */
export function calculateConsumerServiceFee(
  amount: number,
  currency: Currency = "USD",
  hasBDNPlus: boolean = false
): number {
  // If user has BDN+, service fee is 0%
  if (hasBDNPlus) {
    return 0;
  }

  // Calculate 10% fee
  let fee = amount * CONSUMER_SERVICE_FEE_CONFIG.percentage;

  // Apply min/max constraints (convert to USD for comparison if needed)
  if (currency !== "USD") {
    const feeInUSD = convertCurrencySync(fee, currency, "USD");
    if (feeInUSD !== null) {
      if (feeInUSD < CONSUMER_SERVICE_FEE_CONFIG.minAmount) {
        // Convert minimum back to original currency
        const minFee = convertCurrencySync(CONSUMER_SERVICE_FEE_CONFIG.minAmount, "USD", currency);
        fee = minFee || CONSUMER_SERVICE_FEE_CONFIG.minAmount;
      } else if (feeInUSD > CONSUMER_SERVICE_FEE_CONFIG.maxAmount) {
        // Convert maximum back to original currency
        const maxFee = convertCurrencySync(CONSUMER_SERVICE_FEE_CONFIG.maxAmount, "USD", currency);
        fee = maxFee || CONSUMER_SERVICE_FEE_CONFIG.maxAmount;
      }
    }
  } else {
    // USD currency - apply min/max directly
    if (fee < CONSUMER_SERVICE_FEE_CONFIG.minAmount) {
      fee = CONSUMER_SERVICE_FEE_CONFIG.minAmount;
    } else if (fee > CONSUMER_SERVICE_FEE_CONFIG.maxAmount) {
      fee = CONSUMER_SERVICE_FEE_CONFIG.maxAmount;
    }
  }

  // Round to 2 decimal places
  return Math.round(fee * 100) / 100;
}

/**
 * Calculate post-advertising fee for businesses/nonprofits
 * 
 * @param amount - Payment amount received
 * @param currency - Currency of the payment
 * @param hasBDNPlusBusiness - Whether business has active BDN+ Business subscription
 * @returns Post-advertising fee amount
 */
export function calculateBusinessFee(
  amount: number,
  currency: Currency = "USD",
  hasBDNPlusBusiness: boolean = false
): number {
  // Determine fee percentage based on subscription
  const feePercentage = hasBDNPlusBusiness
    ? BUSINESS_FEE_CONFIG.bdnPlusBusinessPercentage
    : BUSINESS_FEE_CONFIG.standardPercentage;

  // Calculate fee
  const fee = amount * feePercentage;

  // Round to 2 decimal places
  return Math.round(fee * 100) / 100;
}

/**
 * Calculate total amount including service fee for consumer orders
 */
export function calculateConsumerTotalWithFee(
  amount: number,
  currency: Currency = "USD",
  hasBDNPlus: boolean = false
): {
  amount: number;
  serviceFee: number;
  total: number;
} {
  const serviceFee = calculateConsumerServiceFee(amount, currency, hasBDNPlus);
  return {
    amount,
    serviceFee,
    total: amount + serviceFee,
  };
}

/**
 * Calculate net amount after post-advertising fee for businesses/nonprofits
 */
export function calculateBusinessNetAmount(
  amount: number,
  currency: Currency = "USD",
  hasBDNPlusBusiness: boolean = false
): {
  grossAmount: number;
  fee: number;
  netAmount: number;
} {
  const fee = calculateBusinessFee(amount, currency, hasBDNPlusBusiness);
  return {
    grossAmount: amount,
    fee,
    netAmount: amount - fee,
  };
}

/**
 * Check if user has active BDN+ subscription
 * TODO: Replace with actual subscription check from backend/context
 */
export function checkBDNPlusSubscription(userId: string): boolean {
  // Mock implementation - in production, check user's subscription status
  // const subscription = await getUserSubscription(userId);
  // return subscription?.tier === "plus" && subscription?.status === "active";
  return false; // Default to false for now
}

/**
 * Check if business/nonprofit has active BDN+ Business subscription
 * TODO: Replace with actual subscription check from backend/context
 */
export function checkBDNPlusBusinessSubscription(entityId: string, entityType: "business" | "nonprofit"): boolean {
  // Mock implementation - in production, check entity's subscription status
  // const subscription = await getEntitySubscription(entityId, entityType);
  // return subscription?.tier === "premium" && subscription?.status === "active";
  return false; // Default to false for now
}

/**
 * Format fee breakdown for display
 */
export function formatFeeBreakdown(
  amount: number,
  fee: number,
  currency: Currency,
  feeType: "service" | "post-advertising" = "service"
): {
  label: string;
  amount: string;
  fee: string;
  total: string;
} {
  // Import formatCurrency dynamically to avoid circular dependencies
  const { formatCurrency } = require("./international");
  
  return {
    label: feeType === "service" ? "Service Fee" : "Platform Fee",
    amount: formatCurrency(amount, currency),
    fee: formatCurrency(fee, currency),
    total: formatCurrency(amount + (feeType === "service" ? fee : -fee), currency),
  };
}

