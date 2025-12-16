import { Wallet, BankAccountWallet, CreditCardWallet } from "../../types/wallet";

/**
 * Centralized Mock Wallet Data
 * Used across payment and checkout flows
 */
export const mockWallets: Wallet[] = [
  {
    id: "1",
    type: "primary",
    name: "Primary Wallet",
    currency: "USD",
    balance: 1250.75,
    isActive: true,
    isDefault: true,
  },
  {
    id: "2",
    type: "myimpact",
    name: "MyImpact Rewards",
    currency: "BLKD",
    balance: 3420,
    isActive: true,
  },
  {
    id: "4",
    type: "bankaccount",
    name: "Chase Checking",
    currency: "USD",
    balance: 5432.18,
    availableBalance: 5432.18,
    isActive: true,
    bankName: "Chase",
    accountType: "checking" as const,
    last4: "4321",
  } as BankAccountWallet,
  {
    id: "5",
    type: "creditcard",
    name: "Visa Card",
    currency: "USD",
    balance: 0,
    availableBalance: 5000,
    isActive: true,
    cardBrand: "Visa",
    last4: "8765",
    expirationDate: "12/25",
    cardholderName: "John Doe",
  } as CreditCardWallet,
];

/**
 * Get default wallet by currency
 */
export const getDefaultWallet = (currency: "USD" | "BLKD" = "USD"): Wallet | undefined => {
  return mockWallets.find((w) => w.isDefault && w.currency === currency);
};

/**
 * Get BLKD wallet
 */
export const getBLKDWallet = (): Wallet | undefined => {
  return mockWallets.find((w) => w.type === "myimpact" && w.currency === "BLKD");
};

