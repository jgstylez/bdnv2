import { InternationalAddress, CountryCode, TaxIdentification } from "./international";
import { Currency } from "./international";

export type OrganizationStatus = "pending" | "approved" | "rejected" | "suspended" | "active";

export type OrganizationType = "nonprofit" | "charity" | "foundation" | "community-organization";

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  status: OrganizationStatus;
  // International tax identification support
  taxIdentification?: TaxIdentification;
  /** @deprecated Use taxIdentification instead */
  ein?: string; // US-specific Employer Identification Number, kept for backward compatibility
  description: string;
  mission: string;
  website?: string;
  email: string;
  phone?: string;
  phoneCountryCode?: CountryCode; // Country code for phone number
  // International address support
  address: InternationalAddress;
  logoUrl?: string;
  images?: string[];
  verified: boolean;
  createdAt: string;
  approvedAt?: string;
  userId: string; // Organization admin/owner
}

export interface OrganizationApplication {
  id: string;
  organizationId?: string;
  userId: string;
  organizationName: string;
  organizationType: OrganizationType;
  taxIdentification?: TaxIdentification;
  /** @deprecated Use taxIdentification instead */
  ein?: string;
  description: string;
  mission: string;
  website?: string;
  email: string;
  phone?: string;
  phoneCountryCode?: CountryCode;
  address: InternationalAddress;
  documents?: {
    type: string;
    url: string;
    uploadedAt: string;
  }[];
  status: OrganizationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface PayItForward {
  id: string;
  userId: string;
  organizationId?: string;
  type: "donation" | "sponsorship" | "volunteer" | "fundraiser";
  title: string;
  description: string;
  amount?: number;
  currency: Currency;
  targetAmount?: number;
  currentAmount: number;
  contributors: number;
  status: "active" | "completed" | "cancelled";
  startDate: string;
  endDate?: string;
  imageUrl?: string;
  tags: string[];
  createdAt: string;
}

export interface OrganizationAccount {
  organizationId: string;
  balance: {
    usd: number;
    blkd: number;
  };
  totalRaised: {
    usd: number;
    blkd: number;
  };
  totalDonations: number;
  activeCampaigns: number;
  contributors: number;
  transactions: OrganizationTransaction[];
}

export interface OrganizationTransaction {
  id: string;
  organizationId: string;
  type: "donation" | "withdrawal" | "transfer" | "fee";
  amount: number; // Net amount after platform fee
  currency: Currency;
  description: string;
  donorId?: string;
  donorName?: string;
  campaignId?: string;
  status: "pending" | "completed" | "failed";
  // Fee breakdown
  grossAmount?: number; // Original amount before platform fee
  platformFee?: number; // Post-advertising platform fee (10% or 5% with BDN+ Business)
  netAmount?: number; // Amount after platform fee deduction (same as amount)
  hasBDNPlusBusiness?: boolean; // Whether organization had BDN+ Business at time of transaction
  createdAt: string;
  processedAt?: string;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  organizationId: string;
  organizationName: string;
  campaignId?: string;
  campaignTitle?: string;
  amount: number;
  currency: Currency;
  anonymous: boolean;
  message?: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
  processedAt?: string;
}

