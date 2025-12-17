import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Merchant } from "../types/merchant";
import { logger } from "../lib/logger";

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

interface BusinessContextType {
  businesses: Merchant[];
  selectedBusiness: Merchant | null;
  selectBusiness: (businessId: string) => void;
  refreshBusinesses: () => Promise<void>;
  isLoading: boolean;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

const SELECTED_BUSINESS_KEY = "@bdn_selected_business_id";
const BUSINESSES_KEY = "@bdn_user_businesses";

// Mock metrics per business - in production, fetch from API based on businessId
export const mockBusinessMetrics: Record<string, {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  inventory: number;
}> = {
  "1": {
    totalSales: 45230.50,
    totalOrders: 342,
    averageOrderValue: 132.25,
    totalCustomers: 189,
    newCustomers: 23,
    returningCustomers: 166,
    inventory: 127,
  },
  "2": {
    totalSales: 12850.75,
    totalOrders: 89,
    averageOrderValue: 144.39,
    totalCustomers: 67,
    newCustomers: 12,
    returningCustomers: 55,
    inventory: 45,
  },
};

// Mock businesses - in production, fetch from API
const mockBusinesses: Merchant[] = [
  {
    id: "1",
    userId: "user1",
    name: "Soul Food Kitchen",
    type: "restaurant",
    level: "premier",
    description: "Authentic Southern cuisine",
    address: {
      street: "123 Main Street",
      city: "Atlanta",
      state: "GA",
      postalCode: "30309",
      country: "US",
    },
    city: "Atlanta",
    state: "GA",
    zipCode: "30309",
    phone: "(404) 555-0123",
    email: "info@soulfoodkitchen.com",
    website: "www.soulfoodkitchen.com",
    category: "Restaurant",
    isVerified: true,
    isActive: true,
    blackOwnedVerificationStatus: "verified",
    createdAt: "2024-01-01T00:00:00Z",
  } as Merchant,
  {
    id: "2",
    userId: "user1",
    name: "Black Excellence Barbershop",
    type: "local-service",
    level: "basic",
    description: "Professional barber services",
    address: {
      street: "456 Oak Avenue",
      city: "Atlanta",
      state: "GA",
      postalCode: "30310",
      country: "US",
    },
    city: "Atlanta",
    state: "GA",
    zipCode: "30310",
    phone: "(404) 555-0456",
    email: "info@blackexcellencebarbershop.com",
    website: "www.blackexcellencebarbershop.com",
    category: "Personal Services",
    isVerified: true,
    isActive: true,
    blackOwnedVerificationStatus: "verified",
    createdAt: "2024-02-15T00:00:00Z",
  } as Merchant,
];

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [businesses, setBusinesses] = useState<Merchant[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Merchant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshBusinesses = useCallback(async () => {
    try {
      setIsLoading(true);
      // TODO: Fetch from API
      // const response = await fetch("/api/user/businesses");
      // const data = await response.json();
      // setBusinesses(data.businesses);
      
      // Mock data for now
      setBusinesses(mockBusinesses);
      
      // Load selected business from storage
      const selectedId = await AsyncStorage.getItem(SELECTED_BUSINESS_KEY);
      if (selectedId) {
        const business = mockBusinesses.find(b => b.id === selectedId);
        if (business) {
          setSelectedBusiness(business);
        } else if (mockBusinesses.length > 0) {
          // If stored ID doesn't exist, select first business
          setSelectedBusiness(mockBusinesses[0]);
          await AsyncStorage.setItem(SELECTED_BUSINESS_KEY, mockBusinesses[0].id);
        }
      } else if (mockBusinesses.length > 0) {
        // No stored selection, use first business
        setSelectedBusiness(mockBusinesses[0]);
        await AsyncStorage.setItem(SELECTED_BUSINESS_KEY, mockBusinesses[0].id);
      }
    } catch (error) {
      logger.error("Error loading businesses", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectBusiness = useCallback(async (businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (business) {
      setSelectedBusiness(business);
      await AsyncStorage.setItem(SELECTED_BUSINESS_KEY, businessId);
    }
  }, [businesses]);

  useEffect(() => {
    refreshBusinesses();
  }, [refreshBusinesses]);

  const value: BusinessContextType = {
    businesses,
    selectedBusiness,
    selectBusiness,
    refreshBusinesses,
    isLoading,
  };

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return context;
}

