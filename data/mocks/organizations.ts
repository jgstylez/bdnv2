/**
 * Centralized Mock Organization Data
 * Used across nonprofit and campaign pages
 */
export const mockOrganizations = {
  org1: {
    id: "org1",
    name: "Community Empowerment Foundation",
    logoUrl: null,
  },
};

/**
 * Get mock organization by ID
 */
export const getMockOrganization = (id: string) => {
  return mockOrganizations[id as keyof typeof mockOrganizations];
};

