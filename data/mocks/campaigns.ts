import { PayItForward } from "../../types/nonprofit";

/**
 * Centralized Mock Campaign Data
 * Used across campaign-related pages
 */
export const mockCampaigns: Record<string, PayItForward> = {
  "1": {
    id: "1",
    userId: "user1",
    organizationId: "org1",
    type: "fundraiser",
    title: "Community Food Drive 2024",
    description:
      "Help us provide meals for families in need this holiday season. Your donation will help us purchase fresh ingredients and prepare nutritious meals for over 500 families in our community. We partner with local food banks and community centers to ensure your contributions reach those who need it most.",
    amount: 0,
    currency: "USD",
    targetAmount: 10000,
    currentAmount: 7500,
    contributors: 45,
    status: "active",
    startDate: "2024-02-01T00:00:00Z",
    endDate: "2024-03-01T00:00:00Z",
    tags: ["food", "community", "holiday"],
    imageUrl: null,
    createdAt: "2024-02-01T00:00:00Z",
  },
};

/**
 * Mock campaign list (for listing pages)
 */
export const mockCampaignsList: PayItForward[] = [
  {
    id: "1",
    userId: "user1",
    organizationId: "org1",
    type: "fundraiser",
    title: "Community Food Drive 2024",
    description: "Help us provide meals for families in need this holiday season.",
    amount: 0,
    currency: "USD",
    targetAmount: 10000,
    currentAmount: 7500,
    contributors: 45,
    status: "active",
    startDate: "2024-02-01T00:00:00Z",
    endDate: "2024-03-01T00:00:00Z",
    tags: ["food", "community", "holiday"],
    imageUrl: null,
    createdAt: "2024-02-01T00:00:00Z",
  },
];

/**
 * Mock donors list
 */
export const mockDonors = [
  { id: "1", name: "John Doe", amount: 500, currency: "USD", anonymous: false, date: "2024-02-15T10:30:00Z" },
  { id: "2", name: "Jane Smith", amount: 250, currency: "USD", anonymous: false, date: "2024-02-14T15:20:00Z" },
  { id: "3", name: null, amount: 1000, currency: "USD", anonymous: true, date: "2024-02-13T09:15:00Z" },
  { id: "4", name: "Michael Johnson", amount: 100, currency: "USD", anonymous: false, date: "2024-02-12T14:45:00Z" },
  { id: "5", name: null, amount: 50, currency: "USD", anonymous: true, date: "2024-02-11T11:20:00Z" },
];

/**
 * Get mock campaign by ID
 */
export const getMockCampaign = (id: string): PayItForward | undefined => {
  return mockCampaigns[id];
};

