/**
 * Centralized Mock Organization Data
 * Used across nonprofit and campaign pages
 */
export const mockOrganizations = {
  org1: {
    id: "org1",
    name: "Community Empowerment Foundation",
    logoUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop",
  },
};

/**
 * Get mock organization by ID
 */
export const getMockOrganization = (id: string) => {
  return mockOrganizations[id as keyof typeof mockOrganizations];
};

