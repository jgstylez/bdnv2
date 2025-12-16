/**
 * Merchant Lookup Utility
 * 
 * Provides merchant name lookup functionality
 * In production, this would fetch from API
 */

// Mock merchant data - in production, fetch from API
const mockMerchants: Record<string, { id: string; name: string }> = {
  "merchant-1": {
    id: "merchant-1",
    name: "Soul Food Kitchen",
  },
  "merchant-2": {
    id: "merchant-2",
    name: "Black Excellence Barbershop",
  },
  "merchant-3": {
    id: "merchant-3",
    name: "African Heritage Books",
  },
  "merchant-4": {
    id: "merchant-4",
    name: "Black History E-Books",
  },
  "merchant-5": {
    id: "merchant-5",
    name: "Professional Career Services",
  },
  "merchant-6": {
    id: "merchant-6",
    name: "Resume Review Services",
  },
};

/**
 * Get merchant name by ID
 * @param merchantId - The merchant ID
 * @returns Merchant name or merchantId if not found
 */
export function getMerchantName(merchantId: string): string {
  return mockMerchants[merchantId]?.name || merchantId;
}

/**
 * Get merchant info by ID
 * @param merchantId - The merchant ID
 * @returns Merchant info or null if not found
 */
export function getMerchantInfo(merchantId: string): { id: string; name: string } | null {
  return mockMerchants[merchantId] || null;
}

/**
 * Batch get merchant names
 * @param merchantIds - Array of merchant IDs
 * @returns Map of merchantId to merchant name
 */
export function getMerchantNames(merchantIds: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  merchantIds.forEach((id) => {
    result[id] = getMerchantName(id);
  });
  return result;
}

