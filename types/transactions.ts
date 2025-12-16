export type TransactionType = 
  | "payment" 
  | "transfer" 
  | "refund" 
  | "token-purchase" 
  | "event-ticket" 
  | "donation" 
  | "cashback" 
  | "withdrawal" 
  | "deposit"
  | "fee";

export type TransactionStatus = "pending" | "completed" | "failed" | "cancelled" | "refunded";

import { Currency } from "./international";

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: Currency;
  description: string;
  category?: string;
  relatedEntityId?: string; // Event ID, Business ID, etc.
  relatedEntityType?: "event" | "business" | "nonprofit" | "user";
  paymentMethod?: string;
  transactionId?: string;
  // Fee breakdown
  fee?: number; // Service fee or platform fee amount
  feeType?: "service" | "platform" | "processing"; // Type of fee
  feePercentage?: number; // Fee percentage applied
  netAmount?: number; // amount after fees
  // For business/nonprofit transactions
  grossAmount?: number; // Original amount before platform fee deduction
  platformFee?: number; // Post-advertising platform fee
  createdAt: string;
  completedAt?: string;
  metadata?: {
    [key: string]: any;
    hasBDNPlus?: boolean; // Whether user had BDN+ at time of transaction
    hasBDNPlusBusiness?: boolean; // Whether business had BDN+ Business at time of transaction
    hasReview?: boolean; // Whether user has left a review for this transaction
    reviewId?: string; // ID of the review if one exists
  };
}

