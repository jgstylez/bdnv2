/**
 * Invoice System Types
 * Supports one-time and recurring billing for businesses and nonprofits
 */

import { InternationalAddress, Currency } from "./international";

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled" | "refunded";
export type BillingType = "one-time" | "recurring";
export type RecurringFrequency = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
export type PaymentMethod = "card" | "bank_transfer" | "wallet" | "crypto" | "other";

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax?: number;
  discount?: number;
  total: number;
}

export interface InvoiceRecurringSettings {
  frequency: RecurringFrequency;
  startDate: string;
  endDate?: string; // Optional end date for recurring invoices
  nextBillingDate: string;
  billingCycleCount?: number; // Number of cycles, undefined = infinite
  currentCycle: number;
}

export interface InvoicePayment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  paidAt: string;
  status: "pending" | "completed" | "failed" | "refunded";
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // Unique invoice number (e.g., INV-2024-001)
  issuerId: string; // Business or Nonprofit ID
  issuerType: "business" | "nonprofit";
  issuerName: string;
  recipientId: string; // User ID
  recipientName: string;
  recipientEmail: string;
  // International address support
  recipientAddress?: InternationalAddress;

  // Billing Details
  billingType: BillingType;
  status: InvoiceStatus;
  currency: Currency;
  
  // Amounts
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountPaid: number;
  amountDue: number;

  // Line Items
  lineItems: InvoiceLineItem[];

  // Recurring Settings (if applicable)
  recurringSettings?: InvoiceRecurringSettings;

  // Dates
  issueDate: string;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;

  // Additional Info
  notes?: string;
  terms?: string;
  paymentTerms?: string; // e.g., "Net 30", "Due on receipt"
  
  // Payment Tracking
  payments?: InvoicePayment[];
  
  // Attachments
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  issuerId: string;
  issuerType: "business" | "nonprofit";
  description?: string;
  defaultLineItems?: Omit<InvoiceLineItem, "id">[];
  defaultNotes?: string;
  defaultTerms?: string;
  defaultPaymentTerms?: string;
  isDefault: boolean;
  createdAt: string;
}

