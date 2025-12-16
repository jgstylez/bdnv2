/**
 * BLKD Purchase Types
 * 
 * Types for purchasing BLKD (non-redeemable credits) in bulk amounts
 */

export interface BLKDPurchaseTier {
  blkdAmount: number; // Amount of BLKD credits purchased
  usdPrice: number; // Price in USD
  discountPercent?: number; // Discount percentage (e.g., 5 for 5% off)
  savings?: number; // Amount saved in USD
  popular?: boolean; // Mark as popular tier
}

export interface BLKDPurchase {
  id: string;
  userId: string;
  blkdAmount: number; // Amount of BLKD credits purchased
  usdPrice: number; // Price paid in USD
  discountPercent?: number;
  savings?: number;
  paymentMethodId: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
  transactionId?: string;
}

export interface BLKDPurchaseFormData {
  blkdAmount: number;
  usdPrice: number;
  discountPercent?: number;
  savings?: number;
}

