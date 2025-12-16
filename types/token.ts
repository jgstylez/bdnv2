export interface TokenPurchase {
  id: string;
  userId: string;
  tokens: number;
  costPerToken: number;
  totalCost: number;
  currency: "USD" | "BLKD";
  purchaseDate: string;
  status: "pending" | "completed" | "failed";
  transactionId?: string;
  certificateUrl?: string;
}

export interface TokenLedgerEntry {
  id: string;
  userId: string;
  transactionType: "purchase" | "transfer" | "reward" | "redemption";
  tokens: number;
  balance: number;
  date: string;
  description: string;
  relatedPurchaseId?: string;
}

export interface RecurringPurchase {
  id: string;
  userId: string;
  tokensPerPurchase: number;
  frequency: "weekly" | "bi-weekly" | "monthly" | "bi-monthly" | "quarterly" | "annually";
  nextPurchaseDate: string;
  isActive: boolean;
  paymentMethodId: string;
  startDate: string;
}

export interface TokenCertificate {
  id: string;
  purchaseId: string;
  certificateNumber: string;
  tokens: number;
  purchaseDate: string;
  issuedDate: string;
  pdfUrl: string;
}

export const TOKEN_PRICE = 15.0; // $15.00 per token

