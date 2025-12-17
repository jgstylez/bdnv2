export interface Business {
  id: string;
  name: string;
  category: string;
  logoUrl?: string; // Optional: URL to the business logo
}

// Mock data for businesses
export const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'Quantum Coffee Roasters',
    category: 'Café & Bakery',
  },
  {
    id: '2',
    name: 'Nebula Tech Store',
    category: 'Electronics',
  },
  {
    id: '3',
    name: 'CyberMart',
    category: 'Groceries & Supermarket',
  },
  {
    id: '4',
    name: 'The Gilded Spoon',
    category: 'Fine Dining Restaurant',
  },
  {
    id: '5',
    name: 'Pixel Perfect Prints',
    category: 'Printing Services',
  },
  {
    id: '6',
    name: 'Velocity Fitness Center',
    category: 'Gym & Fitness',
  },
  {
    id: '7',
    name: 'Zen Garden Spa',
    category: 'Health & Wellness',
  },
  {
    id: '8',
    name: 'Code & Quill',
    category: 'Books & Stationery',
  },
];
