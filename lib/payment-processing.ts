/**
 * Payment Processing Utilities
 * 
 * Handles payment processing for businesses and nonprofits,
 * including automatic platform fee calculation and deduction
 */

import { Currency } from "../types/international";
import { calculateBusinessFee, checkBDNPlusBusinessSubscription } from "./fees";
import { Transaction } from "../types/transactions";
import { OrganizationTransaction } from "../types/nonprofit";

/**
 * Process payment to business/nonprofit
 * Automatically calculates and deducts platform fee
 * 
 * @param grossAmount - Original payment amount
 * @param currency - Currency of payment
 * @param entityId - Business or nonprofit ID
 * @param entityType - "business" | "nonprofit"
 * @param userId - Payer user ID
 * @param description - Transaction description
 * @returns Transaction details with fee breakdown
 */
export function processBusinessPayment(
  grossAmount: number,
  currency: Currency,
  entityId: string,
  entityType: "business" | "nonprofit",
  userId: string,
  description: string
): {
  transaction: Transaction;
  entityTransaction: OrganizationTransaction | null;
  feeBreakdown: {
    grossAmount: number;
    platformFee: number;
    netAmount: number;
    feePercentage: number;
  };
} {
  // Check if entity has BDN+ Business subscription
  const hasBDNPlusBusiness = checkBDNPlusBusinessSubscription(entityId, entityType);
  
  // Calculate platform fee
  const platformFee = calculateBusinessFee(grossAmount, currency, hasBDNPlusBusiness);
  const netAmount = grossAmount - platformFee;
  const feePercentage = hasBDNPlusBusiness ? 5 : 10;

  // Create consumer transaction (payment out)
  const consumerTransaction: Transaction = {
    id: `txn-${Date.now()}-consumer`,
    userId,
    type: "payment",
    status: "completed",
    amount: grossAmount,
    currency,
    description,
    relatedEntityId: entityId,
    relatedEntityType: entityType,
    fee: 0, // Consumer service fee already applied separately
    netAmount: grossAmount,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    metadata: {
      hasBDNPlusBusiness,
    },
  };

  // Create entity transaction (payment received)
  const entityTransaction: OrganizationTransaction = {
    id: `txn-${Date.now()}-entity`,
    organizationId: entityId,
    type: entityType === "nonprofit" ? "donation" : "transfer",
    amount: netAmount, // Net amount after platform fee
    currency,
    description: `${description} (after ${feePercentage}% platform fee)`,
    donorId: userId,
    status: "completed",
    grossAmount,
    platformFee,
    netAmount,
    hasBDNPlusBusiness,
    createdAt: new Date().toISOString(),
    processedAt: new Date().toISOString(),
  };

  // Create platform fee transaction
  const platformFeeTransaction: Transaction = {
    id: `txn-${Date.now()}-fee`,
    userId: "platform", // Platform account
    type: "fee",
    status: "completed",
    amount: platformFee,
    currency,
    description: `Platform fee from ${entityType} payment`,
    relatedEntityId: entityId,
    relatedEntityType: entityType,
    fee: platformFee,
    feeType: "platform",
    feePercentage,
    netAmount: platformFee,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    metadata: {
      hasBDNPlusBusiness,
      originalTransactionId: consumerTransaction.id,
    },
  };

  return {
    transaction: consumerTransaction,
    entityTransaction: entityType === "nonprofit" ? entityTransaction : null,
    feeBreakdown: {
      grossAmount,
      platformFee,
      netAmount,
      feePercentage,
    },
  };
}

/**
 * Calculate platform fee breakdown for display
 */
export function getPlatformFeeBreakdown(
  amount: number,
  currency: Currency,
  hasBDNPlusBusiness: boolean
): {
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  feePercentage: number;
  feeLabel: string;
} {
  const platformFee = calculateBusinessFee(amount, currency, hasBDNPlusBusiness);
  const feePercentage = hasBDNPlusBusiness ? 5 : 10;
  
  return {
    grossAmount: amount,
    platformFee,
    netAmount: amount - platformFee,
    feePercentage,
    feeLabel: hasBDNPlusBusiness ? "Platform Fee (5% - BDN+ Business)" : "Platform Fee (10%)",
  };
}

