export interface MenuItem {
  id: string;
  merchantId: string;
  name: string;
  description?: string;
  price: number;
  currency: "USD" | "BLKD";
  category: string; // e.g., "Appetizers", "Entrees", "Desserts", "Drinks"
  imageUrl?: string;
  isAvailable: boolean;
  dietaryInfo?: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    dairyFree?: boolean;
    nutFree?: boolean;
    spicy?: boolean;
  };
  allergens?: string[];
  calories?: number;
  prepTime?: number; // in minutes
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface MenuCategory {
  id: string;
  merchantId: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  items: MenuItem[];
}

export interface Menu {
  id: string;
  merchantId: string;
  name: string; // e.g., "Dinner Menu", "Brunch Menu", "Happy Hour Menu"
  description?: string;
  type: "full" | "breakfast" | "lunch" | "dinner" | "brunch" | "happy-hour" | "dessert" | "drinks" | "custom";
  categories: MenuCategory[];
  isActive: boolean;
  validFrom?: string; // For seasonal menus
  validUntil?: string;
  createdAt: string;
  updatedAt?: string;
}

// Food-related categories that should have menus
export const FOOD_CATEGORIES = [
  "Restaurant",
  "Bar",
  "Cafe",
  "Bakery",
  "Food Truck",
  "Catering",
  "Fast Food",
  "Fine Dining",
  "Food & Beverage",
];

export function isFoodBusiness(category: string, merchantType?: string | string[]): boolean {
  // Check if merchant type includes "restaurant"
  if (merchantType) {
    const types = Array.isArray(merchantType) ? merchantType : [merchantType];
    if (types.includes("restaurant")) {
      return true;
    }
  }
  // Fallback to category check
  return FOOD_CATEGORIES.some((foodCat) => category.toLowerCase().includes(foodCat.toLowerCase()));
}

