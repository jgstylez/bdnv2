import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Organization } from "../types/nonprofit";

// AsyncStorage import with fallback for web
let AsyncStorage: any;
try {
  AsyncStorage = require("@react-native-async-storage/async-storage").default;
} catch {
  // Fallback for web or if AsyncStorage is not installed
  AsyncStorage = {
    getItem: async (key: string) => {
      if (typeof window !== "undefined") {
        return window.localStorage.getItem(key);
      }
      return null;
    },
    setItem: async (key: string, value: string) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, value);
      }
    },
    removeItem: async (key: string) => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    },
  };
}

interface NonprofitContextType {
  nonprofits: Organization[];
  selectedNonprofit: Organization | null;
  selectNonprofit: (nonprofitId: string) => void;
  refreshNonprofits: () => Promise<void>;
  isLoading: boolean;
}

const NonprofitContext = createContext<NonprofitContextType | undefined>(undefined);

const SELECTED_NONPROFIT_KEY = "@bdn_selected_nonprofit_id";
const NONPROFITS_KEY = "@bdn_user_nonprofits";

// Mock nonprofits - in production, fetch from API
const mockNonprofits: Organization[] = [
  {
    id: "org1",
    userId: "user1",
    name: "Community Empowerment Foundation",
    type: "nonprofit",
    status: "approved",
    description: "Empowering communities through education and resources",
    mission: "To create lasting positive change in underserved communities",
    website: "www.communityempowerment.org",
    email: "info@communityempowerment.org",
    phone: "(404) 555-0789",
    address: {
      street: "789 Community Drive",
      city: "Atlanta",
      state: "GA",
      postalCode: "30311",
      country: "US",
    },
    verified: true,
    createdAt: "2024-01-10T00:00:00Z",
    approvedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "org2",
    userId: "user1",
    name: "Youth Development Initiative",
    type: "charity",
    status: "approved",
    description: "Supporting youth development and mentorship programs",
    mission: "To provide opportunities and mentorship for young people",
    website: "www.youthdevelopment.org",
    email: "info@youthdevelopment.org",
    phone: "(404) 555-0321",
    address: {
      street: "321 Youth Avenue",
      city: "Atlanta",
      state: "GA",
      postalCode: "30312",
      country: "US",
    },
    verified: true,
    createdAt: "2024-02-01T00:00:00Z",
    approvedAt: "2024-02-05T00:00:00Z",
  },
];

// Mock organization account data per nonprofit - in production, fetch from API based on nonprofitId
export const mockNonprofitAccounts: Record<string, {
  balance: { usd: number; blkd: number };
  totalRaised: { usd: number; blkd: number };
  totalDonations: number;
  activeCampaigns: number;
  contributors: number;
}> = {
  "org1": {
    balance: {
      usd: 12500.50,
      blkd: 850.25,
    },
    totalRaised: {
      usd: 45000.00,
      blkd: 3200.00,
    },
    totalDonations: 234,
    activeCampaigns: 3,
    contributors: 156,
  },
  "org2": {
    balance: {
      usd: 8750.25,
      blkd: 520.75,
    },
    totalRaised: {
      usd: 28500.00,
      blkd: 1850.00,
    },
    totalDonations: 142,
    activeCampaigns: 2,
    contributors: 98,
  },
};

export function NonprofitProvider({ children }: { children: React.ReactNode }) {
  const [nonprofits, setNonprofits] = useState<Organization[]>([]);
  const [selectedNonprofit, setSelectedNonprofit] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshNonprofits = useCallback(async () => {
    try {
      setIsLoading(true);
      // TODO: Fetch from API
      // const response = await fetch("/api/user/nonprofits");
      // const data = await response.json();
      // setNonprofits(data.nonprofits);
      
      // Mock data for now
      setNonprofits(mockNonprofits);
      
      // Load selected nonprofit from storage
      const selectedId = await AsyncStorage.getItem(SELECTED_NONPROFIT_KEY);
      if (selectedId) {
        const nonprofit = mockNonprofits.find(n => n.id === selectedId);
        if (nonprofit) {
          setSelectedNonprofit(nonprofit);
        } else if (mockNonprofits.length > 0) {
          // If stored ID doesn't exist, select first nonprofit
          setSelectedNonprofit(mockNonprofits[0]);
          await AsyncStorage.setItem(SELECTED_NONPROFIT_KEY, mockNonprofits[0].id);
        }
      } else if (mockNonprofits.length > 0) {
        // No stored selection, use first nonprofit
        setSelectedNonprofit(mockNonprofits[0]);
        await AsyncStorage.setItem(SELECTED_NONPROFIT_KEY, mockNonprofits[0].id);
      }
    } catch (error) {
      console.error("Error loading nonprofits:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectNonprofit = useCallback(async (nonprofitId: string) => {
    const nonprofit = nonprofits.find(n => n.id === nonprofitId);
    if (nonprofit) {
      setSelectedNonprofit(nonprofit);
      await AsyncStorage.setItem(SELECTED_NONPROFIT_KEY, nonprofitId);
    }
  }, [nonprofits]);

  useEffect(() => {
    refreshNonprofits();
  }, [refreshNonprofits]);

  const value: NonprofitContextType = {
    nonprofits,
    selectedNonprofit,
    selectNonprofit,
    refreshNonprofits,
    isLoading,
  };

  return <NonprofitContext.Provider value={value}>{children}</NonprofitContext.Provider>;
}

export function useNonprofit() {
  const context = useContext(NonprofitContext);
  if (context === undefined) {
    throw new Error("useNonprofit must be used within a NonprofitProvider");
  }
  return context;
}

