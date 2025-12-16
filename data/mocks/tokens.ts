import { TokenPurchase, TokenLedgerEntry, RecurringPurchase, TOKEN_PRICE } from '../../types/token';

export const mockPurchases: TokenPurchase[] = [
  {
    id: "1",
    userId: "user1",
    tokens: 10,
    costPerToken: TOKEN_PRICE,
    totalCost: 150.0,
    currency: "USD",
    purchaseDate: "2024-01-15T10:30:00Z",
    status: "completed",
    transactionId: "TXN-001",
    certificateUrl: "/certificates/cert-001.pdf",
  },
  {
    id: "2",
    userId: "user1",
    tokens: 5,
    costPerToken: TOKEN_PRICE,
    totalCost: 75.0,
    currency: "USD",
    purchaseDate: "2024-02-01T14:20:00Z",
    status: "completed",
    transactionId: "TXN-002",
    certificateUrl: "/certificates/cert-002.pdf",
  },
  {
    id: "3",
    userId: "user1",
    tokens: 20,
    costPerToken: TOKEN_PRICE,
    totalCost: 300.0,
    currency: "USD",
    purchaseDate: "2024-02-10T09:15:00Z",
    status: "pending",
    transactionId: "TXN-003",
  },
];

export const mockLedgerEntries: TokenLedgerEntry[] = [
  {
    id: "1",
    userId: "user1",
    transactionType: "purchase",
    tokens: 10,
    balance: 10,
    date: "2024-01-15T10:30:00Z",
    description: "Token Purchase",
    relatedPurchaseId: "1",
  },
  {
    id: "2",
    userId: "user1",
    transactionType: "purchase",
    tokens: 5,
    balance: 15,
    date: "2024-02-01T14:20:00Z",
    description: "Token Purchase",
    relatedPurchaseId: "2",
  },
  {
    id: "3",
    userId: "user1",
    transactionType: "reward",
    tokens: 2,
    balance: 17,
    date: "2024-02-05T12:00:00Z",
    description: "Reward for referral",
  },
];

export const mockPaymentMethods: Record<string, { name: string; type: "creditcard" | "bankaccount"; last4: string; brand?: string }> = {
  "pm-001": {
    name: "Visa Card",
    type: "creditcard",
    last4: "4321",
    brand: "Visa",
  },
};

export const mockRecurringPurchase: RecurringPurchase | null = {
  id: "1",
  userId: "user1",
  tokensPerPurchase: 10,
  frequency: "monthly",
  nextPurchaseDate: "2024-03-01T00:00:00Z",
  isActive: true,
  paymentMethodId: "pm-001",
  startDate: "2024-01-01T00:00:00Z",
};
