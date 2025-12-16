import { InternationalAddress, Currency } from "./international";

export interface SearchResult {
  id: string;
  type: "business" | "product" | "service" | "media" | "user" | "article";
  title: string;
  description: string;
  imageUrl?: string;
  metadata: {
    category?: string;
    location?: InternationalAddress & {
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    distance?: number; // in miles/km
    rating?: number;
    price?: number;
    currency?: Currency;
    [key: string]: any;
  };
  relevanceScore?: number;
}

export interface SearchFilters {
  category?: string;
  location?: {
    lat: number;
    lng: number;
    radius: number; // in miles
  };
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  type?: SearchResult["type"][];
  tags?: string[];
}

export interface RecentActivity {
  id: string;
  userId: string;
  type: "search" | "view" | "click" | "purchase" | "share";
  targetId: string;
  targetType: SearchResult["type"];
  query?: string;
  timestamp: string;
  metadata?: {
    [key: string]: any;
  };
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: "query" | "business" | "category";
  category?: string;
  count?: number; // popularity/usage count
}

export interface ElasticsearchConfig {
  endpoint: string;
  index: string;
  apiKey?: string;
}

