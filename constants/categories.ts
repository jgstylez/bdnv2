/**
 * Centralized categories list for the BDN platform
 * Used throughout the app for businesses, products, and search
 */

export const BUSINESS_CATEGORIES = [
  "Arts, Crafts & Party Supplies",
  "Auto, Tires & Industrial",
  "Baby",
  "Beauty & Cosmetics",
  "Beauty & Wellness",
  "Clothing, Shoes & Accessories",
  "Electronics & Audio",
  "Exercise & Fitness",
  "Food & Beverage",
  "Furniture & Appliances",
  "Grocery",
  "Home Improvements & Decor",
  "Household Essentials",
  "Jewelry & Watches",
  "Miscellaneous",
  "Music, Movies & Books",
  "Patio & Garden",
  "Personal Care",
  "Pets",
  "Pharmacy",
  "Health & Wellness",
  "Sports & Outdoors",
  "Stationery & Office Supplies",
  "Toys & Games",
  "Travel & Transportation",
  "Wine, Spirits & Liquor",
  "Cell Phones & Accessories",
  "Tools & Hardware",
  "Digital Products",
  "Luggage & Bags",
  "Outdoor & Camping Equipment",
  "Home Security & Smart Devices",
  "Subscription Boxes",
  "Event Tickets & Experiences",
  "Seasonal & Holiday Items",
  "Vintage & Collectibles",
  "Craft Kits & DIY Projects",
  "Religious & Spiritual",
  "Office Furniture",
  "Cleaning Supplies",
  "Bedding & Linens",
  "Kitchenware & Cookware",
  "Mobile Apps & Software Licenses",
  "Education",
  "Gardening Tools & Supplies",
  "Directory",
  "Content Creation",
  "Professional Services",
  "Real Estate",
  "Child Care & Day Care",
  "Technology",
  "Finance & Payments",
  "Gifts & Greeting Cards",
  "Restaurants",
  "Bars & Lounge",
  "Medical & Healthcare",
  "Film & Production",
  "Financial Institution",
  "Merchant Services",
  "Office Supplies",
  "Nonprofit",
  "Trade Association",
  "Chamber",
  "Influencer",
  "Insurance",
  "Construction",
  "Retail",
  "Services",
  "Entertainment",
  "Other",
] as const;

/**
 * Popular categories displayed in search and marketplace
 * These are shown as featured categories with icons and gradients
 */
export const POPULAR_CATEGORIES = [
  { name: "Restaurants", icon: "restaurant" as const, gradient: ["#ba9988", "#9d7f6f"] },
  { name: "Beauty & Wellness", icon: "spa" as const, gradient: ["#e91e63", "#c2185b"] },
  { name: "Retail", icon: "store" as const, gradient: ["#ffd700", "#ffb300"] },
  { name: "Services", icon: "build" as const, gradient: ["#2196f3", "#1976d2"] },
  { name: "Technology", icon: "computer" as const, gradient: ["#9c27b0", "#7b1fa2"] },
  { name: "Education", icon: "school" as const, gradient: ["#4caf50", "#388e3c"] },
] as const;

/**
 * Product categories for merchants
 */
export const MERCHANT_PRODUCT_CATEGORIES = [
  "Arts, Crafts & Party Supplies",
  "Auto, Tires & Industrial",
  "Baby",
  "Beauty & Cosmetics",
  "Clothing, Shoes & Accessories",
  "Electronics & Audio",
  "Exercise & Fitness",
  "Food & Beverage",
  "Furniture & Appliances",
  "Grocery",
  "Home Improvements & Decor",
  "Household Essentials",
  "Jewelry & Watches",
  "Miscellaneous",
  "Music, Movies & Books",
  "Patio & Garden",
  "Personal Care",
  "Pets",
  "Pharmacy",
  "Health & Wellness",
  "Sports & Outdoors",
  "Stationery & Office Supplies",
  "Toys & Games",
  "Travel & Transportation",
  "Wine, Spirits & Liquor",
  "Cell Phones & Accessories",
  "Tools & Hardware",
  "Digital Products",
  "Luggage & Bags",
  "Outdoor & Camping Equipment",
  "Home Security & Smart Devices",
  "Subscription Boxes",
  "Event Tickets & Experiences",
  "Seasonal & Holiday Items",
  "Vintage & Collectibles",
  "Craft Kits & DIY Projects",
  "Religious & Spiritual",
  "Office Furniture",
  "Cleaning Supplies",
  "Bedding & Linens",
  "Kitchenware & Cookware",
  "Mobile Apps & Software Licenses",
  "Education",
  "Gardening Tools & Supplies",
  "Professional Services",
  "Gifts & Greeting Cards",
  "Other",
] as const;

/**
 * Nonprofit-specific categories
 */
export const NONPROFIT_CATEGORIES = [
  "Donation",
  "Merchandise",
  "Event Ticket",
  "Fundraising Item",
  "Digital Download",
  "Other",
] as const;

/**
 * Legacy category names for backward compatibility
 * Maps old category names to new standardized names
 */
export const CATEGORY_ALIASES: Record<string, string> = {
  "Restaurant": "Restaurants",
  "Beauty & Wellness": "Beauty & Wellness",
  "Beauty & Personal Care": "Beauty & Cosmetics",
  "Health & Fitness": "Exercise & Fitness",
  "Books & Media": "Music, Movies & Books",
  "Clothing & Apparel": "Clothing, Shoes & Accessories",
  "Home & Living": "Home Improvements & Decor",
  "Jewelry & Accessories": "Jewelry & Watches",
  "Electronics": "Electronics & Audio",
  "Art & Collectibles": "Arts, Crafts & Party Supplies",
  "Business Tools": "Professional Services",
  "Design Services": "Professional Services",
  "Accessories": "Clothing, Shoes & Accessories",
} as const;

/**
 * Get standardized category name, handling aliases
 */
export function getStandardizedCategory(category: string): string {
  return CATEGORY_ALIASES[category] || category;
}

/**
 * Check if a category exists in the business categories
 */
export function isValidCategory(category: string): boolean {
  return BUSINESS_CATEGORIES.includes(category as any) || 
         Object.keys(CATEGORY_ALIASES).includes(category);
}
