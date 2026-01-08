/**
 * Centralized Mock Business Data
 * Used across business discovery, detail pages, and merchant-related features
 * 
 * All businesses include images, menus, reviews, and complete information
 */

export interface MockBusiness {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  images: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  hours: {
    [key: string]: { open: string; close: string } | null;
  };
  rating: number;
  reviewCount: number;
  menu?: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
  }[];
  reviews?: {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  tags: string[];
  verified: boolean;
  createdAt: string;
}

export const mockBusinesses: Record<string, MockBusiness> = {
  "1": {
    id: "1",
    name: "Soul Food Kitchen",
    category: "Restaurant",
    description: "Authentic soul food restaurant serving traditional Southern cuisine with a modern twist. Family-owned for over 20 years.",
    imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    ],
    address: {
      street: "123 Main Street",
      city: "Atlanta",
      state: "GA",
      zipCode: "30309",
      country: "USA",
    },
    contact: {
      phone: "(404) 555-0123",
      email: "info@soulfoodkitchen.com",
      website: "https://soulfoodkitchen.com",
    },
    hours: {
      monday: { open: "11:00", close: "21:00" },
      tuesday: { open: "11:00", close: "21:00" },
      wednesday: { open: "11:00", close: "21:00" },
      thursday: { open: "11:00", close: "21:00" },
      friday: { open: "11:00", close: "22:00" },
      saturday: { open: "10:00", close: "22:00" },
      sunday: { open: "12:00", close: "20:00" },
    },
    rating: 4.7,
    reviewCount: 234,
    menu: [
      {
        id: "menu-1",
        name: "Fried Chicken Plate",
        description: "Crispy fried chicken with two sides and cornbread",
        price: 16.99,
        category: "Main Course",
      },
      {
        id: "menu-2",
        name: "Mac & Cheese",
        description: "Homemade macaroni and cheese, baked to perfection",
        price: 8.99,
        category: "Side",
      },
      {
        id: "menu-3",
        name: "Collard Greens",
        description: "Slow-cooked collard greens with smoked turkey",
        price: 7.99,
        category: "Side",
      },
      {
        id: "menu-4",
        name: "Sweet Potato Pie",
        description: "Traditional sweet potato pie with whipped cream",
        price: 6.99,
        category: "Dessert",
      },
    ],
    reviews: [
      {
        id: "rev-1",
        userId: "user-1",
        userName: "Sarah Johnson",
        rating: 5,
        comment: "Best soul food in Atlanta! The fried chicken is incredible.",
        date: "2024-02-15T10:30:00Z",
      },
      {
        id: "rev-2",
        userId: "user-2",
        userName: "Michael Brown",
        rating: 4,
        comment: "Great food and friendly service. Will definitely be back!",
        date: "2024-02-10T14:20:00Z",
      },
    ],
    tags: ["soul food", "southern", "family-owned", "authentic"],
    verified: true,
    createdAt: "2020-01-15T10:00:00Z",
  },
  "2": {
    id: "2",
    name: "Black Excellence Barbershop",
    category: "Services",
    description: "Premium barbershop offering haircuts, beard trims, and grooming services. Walk-ins welcome.",
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&h=600&fit=crop",
    ],
    address: {
      street: "456 Oak Avenue",
      city: "Chicago",
      state: "IL",
      zipCode: "60614",
      country: "USA",
    },
    contact: {
      phone: "(312) 555-0456",
      email: "info@blackexcellencebarbershop.com",
      website: "https://blackexcellencebarbershop.com",
    },
    hours: {
      monday: { open: "09:00", close: "19:00" },
      tuesday: { open: "09:00", close: "19:00" },
      wednesday: { open: "09:00", close: "19:00" },
      thursday: { open: "09:00", close: "19:00" },
      friday: { open: "09:00", close: "20:00" },
      saturday: { open: "08:00", close: "20:00" },
      sunday: null,
    },
    rating: 4.8,
    reviewCount: 189,
    menu: [
      {
        id: "menu-5",
        name: "Haircut",
        description: "Professional haircut with styling",
        price: 35.00,
        category: "Service",
      },
      {
        id: "menu-6",
        name: "Beard Trim",
        description: "Precision beard trimming and shaping",
        price: 20.00,
        category: "Service",
      },
      {
        id: "menu-7",
        name: "Haircut & Beard",
        description: "Complete grooming package",
        price: 50.00,
        category: "Service",
      },
    ],
    reviews: [
      {
        id: "rev-3",
        userId: "user-3",
        userName: "James Wilson",
        rating: 5,
        comment: "Best barbershop in the city. Always leave looking fresh!",
        date: "2024-02-18T11:15:00Z",
      },
    ],
    tags: ["barbershop", "grooming", "men's services"],
    verified: true,
    createdAt: "2019-06-20T10:00:00Z",
  },
  "3": {
    id: "3",
    name: "African Heritage Books",
    category: "Retail",
    description: "Independent bookstore specializing in African and African-American literature, history, and culture.",
    imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&h=600&fit=crop",
    ],
    address: {
      street: "789 Cultural Drive",
      city: "Washington",
      state: "DC",
      zipCode: "20001",
      country: "USA",
    },
    contact: {
      phone: "(202) 555-0789",
      email: "info@africanheritagebooks.com",
      website: "https://africanheritagebooks.com",
    },
    hours: {
      monday: { open: "10:00", close: "19:00" },
      tuesday: { open: "10:00", close: "19:00" },
      wednesday: { open: "10:00", close: "19:00" },
      thursday: { open: "10:00", close: "19:00" },
      friday: { open: "10:00", close: "20:00" },
      saturday: { open: "10:00", close: "20:00" },
      sunday: { open: "12:00", close: "18:00" },
    },
    rating: 4.6,
    reviewCount: 156,
    tags: ["books", "literature", "culture", "education"],
    verified: true,
    createdAt: "2018-03-10T10:00:00Z",
  },
  "4": {
    id: "4",
    name: "Black History E-Books",
    category: "Digital",
    description: "Digital publishing platform specializing in Black history, culture, and educational content.",
    imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&h=600&fit=crop",
    ],
    address: {
      street: "Online",
      city: "Remote",
      state: "N/A",
      zipCode: "00000",
      country: "USA",
    },
    contact: {
      phone: "(800) 555-0000",
      email: "info@blackhistoryebooks.com",
      website: "https://blackhistoryebooks.com",
    },
    hours: {
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    },
    rating: 4.9,
    reviewCount: 342,
    tags: ["digital", "ebooks", "education", "history"],
    verified: true,
    createdAt: "2021-01-05T10:00:00Z",
  },
  "5": {
    id: "5",
    name: "Crown Beauty Salon",
    category: "Beauty & Wellness",
    description: "Full-service beauty salon offering hair styling, coloring, treatments, and nail services.",
    imageUrl: "https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?w=800&h=600&fit=crop",
    ],
    address: {
      street: "321 Beauty Boulevard",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90028",
      country: "USA",
    },
    contact: {
      phone: "(323) 555-0321",
      email: "info@crownbeautysalon.com",
      website: "https://crownbeautysalon.com",
    },
    hours: {
      monday: { open: "10:00", close: "18:00" },
      tuesday: { open: "10:00", close: "18:00" },
      wednesday: { open: "10:00", close: "18:00" },
      thursday: { open: "10:00", close: "19:00" },
      friday: { open: "09:00", close: "19:00" },
      saturday: { open: "09:00", close: "18:00" },
      sunday: null,
    },
    rating: 4.7,
    reviewCount: 278,
    menu: [
      {
        id: "menu-8",
        name: "Haircut & Style",
        description: "Professional haircut with styling",
        price: 65.00,
        category: "Hair Service",
      },
      {
        id: "menu-9",
        name: "Hair Color",
        description: "Full hair coloring service",
        price: 120.00,
        category: "Hair Service",
      },
      {
        id: "menu-10",
        name: "Manicure & Pedicure",
        description: "Complete nail care service",
        price: 55.00,
        category: "Nail Service",
      },
    ],
    reviews: [
      {
        id: "rev-4",
        userId: "user-4",
        userName: "Lisa Thompson",
        rating: 5,
        comment: "Amazing stylists and beautiful salon. Highly recommend!",
        date: "2024-02-20T15:30:00Z",
      },
    ],
    tags: ["beauty", "salon", "hair", "wellness"],
    verified: true,
    createdAt: "2017-09-12T10:00:00Z",
  },
  "6": {
    id: "6",
    name: "Urban Tech Solutions",
    category: "Technology",
    description: "IT consulting and technology services for small businesses. Specializing in web development and digital transformation.",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
    ],
    address: {
      street: "555 Tech Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    contact: {
      phone: "(212) 555-0555",
      email: "info@urbantechsolutions.com",
      website: "https://urbantechsolutions.com",
    },
    hours: {
      monday: { open: "09:00", close: "17:00" },
      tuesday: { open: "09:00", close: "17:00" },
      wednesday: { open: "09:00", close: "17:00" },
      thursday: { open: "09:00", close: "17:00" },
      friday: { open: "09:00", close: "17:00" },
      saturday: null,
      sunday: null,
    },
    rating: 4.8,
    reviewCount: 92,
    menu: [
      {
        id: "menu-11",
        name: "Website Development",
        description: "Custom website design and development",
        price: 2500.00,
        category: "Service",
      },
      {
        id: "menu-12",
        name: "IT Consultation",
        description: "One-hour IT consultation session",
        price: 150.00,
        category: "Service",
      },
    ],
    tags: ["technology", "IT", "consulting", "web development"],
    verified: true,
    createdAt: "2020-11-08T10:00:00Z",
  },
};

/**
 * Get mock business by ID
 */
export const getMockBusiness = (id: string): MockBusiness | undefined => {
  return mockBusinesses[id];
};

/**
 * Get all businesses as array
 */
export const getAllMockBusinesses = (): MockBusiness[] => {
  return Object.values(mockBusinesses);
};

/**
 * Get businesses by category
 */
export const getBusinessesByCategory = (category: string): MockBusiness[] => {
  return Object.values(mockBusinesses).filter((b) => b.category === category);
};

/**
 * Get verified businesses only
 */
export const getVerifiedBusinesses = (): MockBusiness[] => {
  return Object.values(mockBusinesses).filter((b) => b.verified);
};
