import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Linking, Platform, Modal } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useResponsive } from '@/hooks/useResponsive';
import { MaterialIcons } from "@expo/vector-icons";
import { ReviewForm } from '@/components/ReviewForm';
import { ReviewCard } from '@/components/ReviewCard';
import { MenuDisplay } from '@/components/MenuDisplay';
import { BusinessReview, ReviewReason } from '@/types/review';
import { Menu, isFoodBusiness } from '@/types/menu';
import { BackButton } from '@/components/navigation/BackButton';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';
import { BusinessSEO } from '@/components/seo/BusinessSEO';

// Mock business data - in production, this would come from an API
const mockBusinessData: Record<string, any> = {
  "1": {
    id: "1",
    name: "Soul Food Kitchen",
    category: "Restaurant",
    description: "Authentic Southern cuisine in the heart of Atlanta. We serve traditional soul food with a modern twist, using fresh ingredients and family recipes passed down through generations.",
    location: {
      address: "123 Main Street",
      city: "Atlanta",
      state: "GA",
      zipCode: "30309",
      coordinates: { lat: 33.749, lng: -84.388 },
    },
    rating: 4.8,
    reviewCount: 127,
    phone: "(404) 555-0123",
    email: "info@soulfoodkitchen.com",
    website: "https://soulfoodkitchen.com",
    hours: {
      monday: "11:00 AM - 9:00 PM",
      tuesday: "11:00 AM - 9:00 PM",
      wednesday: "11:00 AM - 9:00 PM",
      thursday: "11:00 AM - 9:00 PM",
      friday: "11:00 AM - 10:00 PM",
      saturday: "11:00 AM - 10:00 PM",
      sunday: "12:00 PM - 8:00 PM",
    },
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=450&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
    ],
    amenities: ["WiFi", "Parking", "Outdoor Seating", "Takeout", "Delivery"],
    priceRange: "$$",
    tags: ["Soul Food", "Southern", "Family Friendly", "Vegetarian Options"],
    menu: {
      id: "menu1",
      merchantId: "1",
      name: "Main Menu",
      type: "full",
      isActive: true,
      categories: [
        {
          id: "cat1",
          merchantId: "1",
          name: "Appetizers",
          displayOrder: 1,
          isActive: true,
          items: [
            {
              id: "item1",
              merchantId: "1",
              name: "Fried Green Tomatoes",
              description: "Crispy fried green tomatoes with remoulade sauce",
              price: 8.99,
              currency: "USD",
              category: "Appetizers",
              isAvailable: true,
              dietaryInfo: { vegetarian: true },
              tags: ["popular"],
              createdAt: "2024-01-15T00:00:00Z",
            },
            {
              id: "item2",
              merchantId: "1",
              name: "Wings",
              description: "10 piece wings with your choice of sauce",
              price: 12.99,
              currency: "USD",
              category: "Appetizers",
              isAvailable: true,
              dietaryInfo: { spicy: true },
              tags: ["popular"],
              createdAt: "2024-01-15T00:00:00Z",
            },
          ],
        },
        {
          id: "cat2",
          merchantId: "1",
          name: "Entrees",
          displayOrder: 2,
          isActive: true,
          items: [
            {
              id: "item3",
              merchantId: "1",
              name: "Soul Food Platter",
              description: "Fried chicken, mac & cheese, collard greens, cornbread",
              price: 24.99,
              currency: "USD",
              category: "Entrees",
              isAvailable: true,
              tags: ["signature"],
              createdAt: "2024-01-15T00:00:00Z",
            },
            {
              id: "item4",
              merchantId: "1",
              name: "BBQ Ribs",
              description: "Slow-cooked ribs with signature sauce",
              price: 32.99,
              currency: "USD",
              category: "Entrees",
              isAvailable: true,
              tags: ["signature"],
              createdAt: "2024-01-15T00:00:00Z",
            },
            {
              id: "item5",
              merchantId: "1",
              name: "Fried Catfish",
              description: "Fresh catfish, fried golden brown, served with hush puppies",
              price: 18.99,
              currency: "USD",
              category: "Entrees",
              isAvailable: true,
              allergens: ["Fish"],
              createdAt: "2024-01-15T00:00:00Z",
            },
          ],
        },
        {
          id: "cat3",
          merchantId: "1",
          name: "Desserts",
          displayOrder: 3,
          isActive: true,
          items: [
            {
              id: "item6",
              merchantId: "1",
              name: "Sweet Potato Pie",
              description: "Homemade sweet potato pie with whipped cream",
              price: 6.99,
              currency: "USD",
              category: "Desserts",
              isAvailable: true,
              dietaryInfo: { vegetarian: true },
              calories: 320,
              createdAt: "2024-01-15T00:00:00Z",
            },
            {
              id: "item7",
              merchantId: "1",
              name: "Peach Cobbler",
              description: "Warm peach cobbler with vanilla ice cream",
              price: 7.99,
              currency: "USD",
              category: "Desserts",
              isAvailable: true,
              dietaryInfo: { vegetarian: true },
              calories: 380,
              createdAt: "2024-01-15T00:00:00Z",
            },
          ],
        },
      ],
      createdAt: "2024-01-15T00:00:00Z",
    },
  },
  "2": {
    id: "2",
    name: "Black Excellence Barbershop",
    category: "Services",
    description: "Premium grooming services for the modern professional. We specialize in fades, lineups, and classic cuts with attention to detail and style.",
    location: {
      address: "456 Oak Avenue",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      coordinates: { lat: 41.8781, lng: -87.6298 },
    },
    rating: 4.9,
    reviewCount: 89,
    phone: "(312) 555-0456",
    email: "contact@blackexcellence.com",
    website: "https://blackexcellencebarbershop.com",
    hours: {
      monday: "9:00 AM - 7:00 PM",
      tuesday: "9:00 AM - 7:00 PM",
      wednesday: "9:00 AM - 7:00 PM",
      thursday: "9:00 AM - 7:00 PM",
      friday: "9:00 AM - 8:00 PM",
      saturday: "8:00 AM - 6:00 PM",
      sunday: "Closed",
    },
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=450&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1622296244390-6e0c5b5b0b8a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=600&fit=crop",
    ],
    amenities: ["Appointments", "Walk-ins Welcome", "Parking"],
    priceRange: "$$",
    tags: ["Barbershop", "Grooming", "Professional"],
  },
  "3": {
    id: "3",
    name: "Tech Solutions LLC",
    category: "Technology",
    description: "Custom software development and IT consulting. We help businesses leverage technology to grow and succeed.",
    location: {
      address: "789 Pine Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      coordinates: { lat: 40.7128, lng: -74.0060 },
    },
    rating: 4.7,
    reviewCount: 45,
    phone: "(212) 555-0789",
    email: "hello@techsolutionsllc.com",
    website: "https://techsolutionsllc.com",
    hours: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 5:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=450&fit=crop",
    images: [],
    amenities: ["Consultation", "Remote Services"],
    priceRange: "$$$",
    tags: ["Software Development", "IT Consulting", "Technology"],
  },
  "4": {
    id: "4",
    name: "Heritage Boutique",
    category: "Retail",
    description: "Curated fashion and accessories celebrating Black culture. We offer unique pieces from Black designers and artisans.",
    location: {
      address: "321 Fashion Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      coordinates: { lat: 34.0522, lng: -118.2437 },
    },
    rating: 4.6,
    reviewCount: 92,
    phone: "(323) 555-0124",
    email: "info@heritageboutique.com",
    website: "https://heritageboutique.com",
    hours: {
      monday: "10:00 AM - 7:00 PM",
      tuesday: "10:00 AM - 7:00 PM",
      wednesday: "10:00 AM - 7:00 PM",
      thursday: "10:00 AM - 7:00 PM",
      friday: "10:00 AM - 8:00 PM",
      saturday: "10:00 AM - 8:00 PM",
      sunday: "12:00 PM - 6:00 PM",
    },
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=450&fit=crop",
    images: [],
    amenities: ["Parking", "Fitting Rooms", "Online Shopping"],
    priceRange: "$$",
    tags: ["Fashion", "Accessories", "Black Designers"],
  },
  "5": {
    id: "5",
    name: "Glow Beauty Studio",
    category: "Beauty",
    description: "Full-service beauty salon specializing in natural hair care. We provide expert styling, treatments, and consultations.",
    location: {
      address: "789 Beauty Lane",
      city: "Houston",
      state: "TX",
      zipCode: "77001",
      coordinates: { lat: 29.7604, lng: -95.3698 },
    },
    rating: 4.9,
    reviewCount: 156,
    phone: "(713) 555-0457",
    email: "hello@glowbeauty.com",
    website: "https://glowbeauty.com",
    hours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 7:00 PM",
      friday: "9:00 AM - 7:00 PM",
      saturday: "8:00 AM - 5:00 PM",
      sunday: "Closed",
    },
    imageUrl: "https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?w=800&h=450&fit=crop",
    images: [],
    amenities: ["Appointments", "Walk-ins Welcome", "Parking"],
    priceRange: "$$",
    tags: ["Hair Care", "Natural Hair", "Styling"],
  },
  "6": {
    id: "6",
    name: "Wellness Center",
    category: "Health",
    description: "Holistic health services and wellness programs for the community. We offer massage therapy, acupuncture, and wellness coaching.",
    location: {
      address: "456 Wellness Way",
      city: "Washington",
      state: "DC",
      zipCode: "20001",
      coordinates: { lat: 38.9072, lng: -77.0369 },
    },
    rating: 4.8,
    reviewCount: 78,
    phone: "(202) 555-0789",
    email: "info@wellnesscenter.com",
    website: "https://wellnesscenter.com",
    hours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 7:00 PM",
      friday: "9:00 AM - 7:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed",
    },
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop",
    images: [],
    amenities: ["Appointments", "Parking", "Wellness Programs"],
    priceRange: "$$$",
    tags: ["Wellness", "Massage", "Holistic Health"],
  },
  "7": {
    id: "7",
    name: "Jazz & Soul Café",
    category: "Restaurant",
    description: "Live music venue and restaurant featuring local jazz artists. Enjoy great food and music in an intimate setting.",
    location: {
      address: "234 Music Street",
      city: "New Orleans",
      state: "LA",
      zipCode: "70112",
      coordinates: { lat: 29.9511, lng: -90.0715 },
    },
    rating: 4.9,
    reviewCount: 203,
    phone: "(504) 555-0125",
    email: "info@jazzsoulcafe.com",
    website: "https://jazzsoulcafe.com",
    hours: {
      monday: "5:00 PM - 11:00 PM",
      tuesday: "5:00 PM - 11:00 PM",
      wednesday: "5:00 PM - 11:00 PM",
      thursday: "5:00 PM - 12:00 AM",
      friday: "5:00 PM - 12:00 AM",
      saturday: "5:00 PM - 12:00 AM",
      sunday: "4:00 PM - 10:00 PM",
    },
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=450&fit=crop",
    images: [],
    amenities: ["Live Music", "Full Bar", "Reservations"],
    priceRange: "$$",
    tags: ["Jazz", "Live Music", "Southern Cuisine"],
  },
  "8": {
    id: "8",
    name: "Creative Design Agency",
    category: "Services",
    description: "Graphic design and branding services for businesses. We help create compelling visual identities and marketing materials.",
    location: {
      address: "567 Design Blvd",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      coordinates: { lat: 25.7617, lng: -80.1918 },
    },
    rating: 4.7,
    reviewCount: 64,
    phone: "(305) 555-0458",
    email: "hello@creativedesign.com",
    website: "https://creativedesign.com",
    hours: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 5:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    imageUrl: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&h=450&fit=crop",
    images: [],
    amenities: ["Consultation", "Remote Services"],
    priceRange: "$$$",
    tags: ["Graphic Design", "Branding", "Marketing"],
  },
  "9": {
    id: "9",
    name: "Community Bookstore",
    category: "Retail",
    description: "Books by Black authors and community event space. We host author readings, book clubs, and community discussions.",
    location: {
      address: "890 Literary Lane",
      city: "Philadelphia",
      state: "PA",
      zipCode: "19101",
      coordinates: { lat: 39.9526, lng: -75.1652 },
    },
    rating: 4.8,
    reviewCount: 112,
    phone: "(215) 555-0789",
    email: "info@communitybookstore.com",
    website: "https://communitybookstore.com",
    hours: {
      monday: "10:00 AM - 7:00 PM",
      tuesday: "10:00 AM - 7:00 PM",
      wednesday: "10:00 AM - 7:00 PM",
      thursday: "10:00 AM - 8:00 PM",
      friday: "10:00 AM - 8:00 PM",
      saturday: "10:00 AM - 8:00 PM",
      sunday: "12:00 PM - 6:00 PM",
    },
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=450&fit=crop",
    images: [],
    amenities: ["Events", "Coffee", "Reading Area"],
    priceRange: "$",
    tags: ["Books", "Community", "Black Authors"],
  },
  "10": {
    id: "10",
    name: "Fit & Strong Gym",
    category: "Health",
    description: "Fitness center focused on community health and wellness. We offer personal training, group classes, and modern equipment.",
    location: {
      address: "123 Fitness Drive",
      city: "Detroit",
      state: "MI",
      zipCode: "48201",
      coordinates: { lat: 42.3314, lng: -83.0458 },
    },
    rating: 4.6,
    reviewCount: 145,
    phone: "(313) 555-0126",
    email: "info@fitstronggym.com",
    website: "https://fitstronggym.com",
    hours: {
      monday: "5:00 AM - 10:00 PM",
      tuesday: "5:00 AM - 10:00 PM",
      wednesday: "5:00 AM - 10:00 PM",
      thursday: "5:00 AM - 10:00 PM",
      friday: "5:00 AM - 10:00 PM",
      saturday: "7:00 AM - 8:00 PM",
      sunday: "8:00 AM - 6:00 PM",
    },
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop",
    images: [],
    amenities: ["Parking", "Locker Rooms", "Personal Training"],
    priceRange: "$$",
    tags: ["Fitness", "Gym", "Personal Training"],
  },
  "11": {
    id: "11",
    name: "Artisan Coffee Roasters",
    category: "Restaurant",
    description: "Specialty coffee roasted from Black-owned farms worldwide. We serve expertly crafted coffee drinks and pastries.",
    location: {
      address: "456 Coffee Street",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      coordinates: { lat: 47.6062, lng: -122.3321 },
    },
    rating: 4.7,
    reviewCount: 98,
    phone: "(206) 555-0459",
    email: "hello@artisancoffee.com",
    website: "https://artisancoffee.com",
    hours: {
      monday: "6:00 AM - 6:00 PM",
      tuesday: "6:00 AM - 6:00 PM",
      wednesday: "6:00 AM - 6:00 PM",
      thursday: "6:00 AM - 7:00 PM",
      friday: "6:00 AM - 7:00 PM",
      saturday: "7:00 AM - 7:00 PM",
      sunday: "7:00 AM - 5:00 PM",
    },
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=450&fit=crop",
    images: [],
    amenities: ["WiFi", "Outdoor Seating", "Takeout"],
    priceRange: "$",
    tags: ["Coffee", "Specialty", "Black-Owned"],
  },
  "12": {
    id: "12",
    name: "Digital Marketing Pro",
    category: "Technology",
    description: "Social media and digital marketing services for small businesses. We help you grow your online presence and reach more customers.",
    location: {
      address: "789 Tech Avenue",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      coordinates: { lat: 30.2672, lng: -97.7431 },
    },
    rating: 4.8,
    reviewCount: 87,
    phone: "(512) 555-0790",
    email: "info@digitalmarketingpro.com",
    website: "https://digitalmarketingpro.com",
    hours: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 5:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    images: [],
    amenities: ["Consultation", "Remote Services"],
    priceRange: "$$",
    tags: ["Digital Marketing", "Social Media", "SEO"],
  },
  "13": {
    id: "13",
    name: "Natural Hair Care Products",
    category: "Beauty",
    description: "Premium natural hair care products and styling tools. We offer products specifically formulated for curly and coily hair textures.",
    location: {
      address: "234 Beauty Road",
      city: "Charlotte",
      state: "NC",
      zipCode: "28201",
      coordinates: { lat: 35.2271, lng: -80.8431 },
    },
    rating: 4.9,
    reviewCount: 234,
    phone: "(704) 555-0127",
    email: "info@naturalhaircare.com",
    website: "https://naturalhaircare.com",
    hours: {
      monday: "10:00 AM - 7:00 PM",
      tuesday: "10:00 AM - 7:00 PM",
      wednesday: "10:00 AM - 7:00 PM",
      thursday: "10:00 AM - 7:00 PM",
      friday: "10:00 AM - 8:00 PM",
      saturday: "10:00 AM - 6:00 PM",
      sunday: "12:00 PM - 5:00 PM",
    },
    imageUrl: "https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?w=800&h=450&fit=crop",
    images: [],
    amenities: ["Online Shopping", "Consultation", "Parking"],
    priceRange: "$$",
    tags: ["Hair Care", "Natural Products", "Beauty"],
  },
  "14": {
    id: "14",
    name: "Home Repair Services",
    category: "Services",
    description: "Professional home repair and renovation services. We handle everything from plumbing to electrical work with quality craftsmanship.",
    location: {
      address: "567 Repair Way",
      city: "Baltimore",
      state: "MD",
      zipCode: "21201",
      coordinates: { lat: 39.2904, lng: -76.6122 },
    },
    rating: 4.7,
    reviewCount: 156,
    phone: "(410) 555-0459",
    email: "contact@homerepair.com",
    website: "https://homerepair.com",
    hours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "9:00 AM - 4:00 PM",
      sunday: "Closed",
    },
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=450&fit=crop",
    images: [],
    amenities: ["Emergency Service", "Free Estimates", "Licensed"],
    priceRange: "$$",
    tags: ["Home Repair", "Renovation", "Contractor"],
  },
  "15": {
    id: "15",
    name: "Urban Fashion House",
    category: "Retail",
    description: "Contemporary streetwear and urban fashion for all ages. We curate the latest trends and timeless classics.",
    location: {
      address: "890 Style Street",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11201",
      coordinates: { lat: 40.6782, lng: -73.9442 },
    },
    rating: 4.8,
    reviewCount: 178,
    phone: "(718) 555-0791",
    email: "info@urbanfashion.com",
    website: "https://urbanfashion.com",
    hours: {
      monday: "11:00 AM - 8:00 PM",
      tuesday: "11:00 AM - 8:00 PM",
      wednesday: "11:00 AM - 8:00 PM",
      thursday: "11:00 AM - 8:00 PM",
      friday: "11:00 AM - 9:00 PM",
      saturday: "11:00 AM - 9:00 PM",
      sunday: "12:00 PM - 7:00 PM",
    },
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=450&fit=crop",
    images: [],
    amenities: ["Fitting Rooms", "Online Shopping", "Parking"],
    priceRange: "$$",
    tags: ["Streetwear", "Urban Fashion", "Contemporary"],
  },
};

// Mock reviews data
const mockReviews: BusinessReview[] = [
  {
    id: "1",
    businessId: "1",
    userId: "user1",
    userName: "Sarah Johnson",
    rating: 5,
    npsScore: 10,
    selectedReasons: ["excellent-service", "great-quality", "friendly-staff", "good-value"],
    comment: "Amazing food and service! The staff was incredibly welcoming and the food was delicious. Will definitely be back!",
    verifiedPurchase: true,
    visitDate: "2024-02-10",
    createdAt: "2024-02-11T10:30:00Z",
    helpfulCount: 12,
    reported: false,
  },
  {
    id: "2",
    businessId: "1",
    userId: "user2",
    userName: "Michael Brown",
    rating: 4,
    npsScore: 8,
    selectedReasons: ["great-quality", "convenient-location"],
    comment: "Good food, convenient location. Service was a bit slow but overall a positive experience.",
    verifiedPurchase: true,
    visitDate: "2024-02-08",
    createdAt: "2024-02-09T14:20:00Z",
    helpfulCount: 5,
    reported: false,
  },
  {
    id: "3",
    businessId: "1",
    userId: "user3",
    userName: "Jessica Williams",
    rating: 5,
    npsScore: 9,
    selectedReasons: ["excellent-service", "great-quality", "good-atmosphere", "recommend-to-friends"],
    verifiedPurchase: true,
    visitDate: "2024-02-05",
    createdAt: "2024-02-06T09:15:00Z",
    helpfulCount: 8,
    reported: false,
    businessResponse: {
      id: "resp1",
      reviewId: "3",
      businessId: "1",
      message: "Thank you so much for your kind words! We're thrilled you enjoyed your visit. We hope to see you again soon!",
      createdAt: "2024-02-06T15:30:00Z",
    },
  },
];

export default function BusinessDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isMobile, scrollViewBottomPadding } = useResponsive();
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "photos" | "videos" | "menu">("overview");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState<BusinessReview[]>(mockReviews);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const business = mockBusinessData[id || "1"] || mockBusinessData["1"];
  const hasMenu = business.menu && isFoodBusiness(business.category, business.type);

  const handleSubmitReview = (data: {
    rating: number;
    npsScore?: number;
    selectedReasons: ReviewReason[];
    comment?: string;
    verifiedPurchase: boolean;
  }) => {
    // In production, this would submit to an API
    const newReview: BusinessReview = {
      id: `review-${Date.now()}`,
      businessId: business.id,
      userId: "current-user", // Would come from auth context
      userName: "You", // Would come from user profile
      rating: data.rating,
      npsScore: data.npsScore,
      selectedReasons: data.selectedReasons,
      comment: data.comment,
      verifiedPurchase: data.verifiedPurchase,
      createdAt: new Date().toISOString(),
      helpfulCount: 0,
      reported: false,
    };
    setReviews([newReview, ...reviews]);
    setShowReviewForm(false);
    // Show success message
  };

  const handleHelpful = (reviewId: string) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId ? { ...review, helpfulCount: review.helpfulCount + 1 } : review
      )
    );
  };

  const handleCall = () => {
    Linking.openURL(`tel:${business.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${business.email}`);
  };

  const handleWebsite = () => {
    if (business.website) {
      Linking.openURL(business.website);
    }
  };

  const handleDirections = () => {
    const { lat, lng } = business.location.coordinates;
    Linking.openURL(`https://maps.google.com/?q=${lat},${lng}`);
  };

  const handleMessage = () => {
    // Navigate to messages with the business
    // In production, this would create or find the conversation ID for this business
    const conversationId = `business-${business.id}`;
    router.push(`/pages/messages/${conversationId}`);
  };

  const formatAddress = () => {
    return `${business.location.address}, ${business.location.city}, ${business.location.state} ${business.location.zipCode}`;
  };

  // Convert mock business data to Merchant format for SEO
  const businessForSEO = {
    id: business.id,
    userId: business.userId || 'unknown',
    name: business.name,
    type: (business.type || 'local-shop') as 'local-shop' | 'local-service' | 'national-service' | 'online-shopping' | 'restaurant',
    level: 'basic' as const,
    description: business.description || '',
    address: business.location ? {
      streetAddress: business.location.address,
      city: business.location.city,
      state: business.location.state,
      postalCode: business.location.zipCode,
      countryCode: 'US' as const,
    } : undefined,
    phone: business.phone,
    email: business.email,
    website: business.website,
    category: business.category || '',
    isVerified: true,
    isActive: true,
    blackOwnedVerificationStatus: 'verified' as const,
    createdAt: business.createdAt || new Date().toISOString(),
    rating: business.rating,
    reviewCount: business.reviewCount,
    imageUrl: business.imageUrl,
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <BusinessSEO business={businessForSEO} />
      <StatusBar style="light" />
      <OptimizedScrollView
        showBackToTop={true}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        {/* Hero Image */}
        {business.imageUrl ? (
          <Image
            source={{ uri: business.imageUrl }}
            style={{
              width: "100%",
              height: isMobile ? 250 : 400,
            }}
            contentFit="cover"
cachePolicy="memory-disk"
          />
        ) : (
          <View
            style={{
              width: "100%",
              height: isMobile ? 250 : 400,
              backgroundColor: "#474747",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="business" size={64} color="rgba(186, 153, 136, 0.5)" />
          </View>
        )}

        {/* Main Content */}
        <View style={{ paddingHorizontal: isMobile ? 20 : 40, paddingTop: Platform.OS === "web" ? 24 : 40 }}>
          {/* Back Button */}
          <BackButton />

          {/* Header Info */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: isMobile ? 28 : 36,
                    fontWeight: "800",
                    color: "#ffffff",
                    marginBottom: 8,
                    letterSpacing: -1,
                  }}
                >
                  {business.name}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <View
                    style={{
                      backgroundColor: "rgba(186, 153, 136, 0.15)",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#ba9988",
                      }}
                    >
                      {business.category}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <MaterialIcons name="star" size={18} color="#ffd700" />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "#ffffff",
                      }}
                    >
                      {business.rating}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.6)",
                      }}
                    >
                      ({business.reviewCount})
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: 24,
                marginBottom: 16,
              }}
            >
              {business.description}
            </Text>

            {/* Quick Actions */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingRight: isMobile ? 0 : 20 }}
            >
              <TouchableOpacity
                onPress={() => router.push(`/pages/payments/c2b-payment?businessId=${business.id}`)}
                style={{
                  backgroundColor: "#ba9988",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <MaterialIcons name="payment" size={18} color="#ffffff" />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  Pay
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCall}
                style={{
                  backgroundColor: "#474747",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <MaterialIcons name="phone" size={18} color="#ba9988" />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  Call
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleMessage}
                style={{
                  backgroundColor: "#474747",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <MaterialIcons name="message" size={18} color="#ba9988" />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  Message
                </Text>
              </TouchableOpacity>
              {business.website && (
                <TouchableOpacity
                  onPress={handleWebsite}
                  style={{
                    backgroundColor: "#474747",
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <MaterialIcons name="language" size={18} color="#ba9988" />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    Website
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          {/* Tabs */}
          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 1,
              borderBottomColor: "#474747",
              marginBottom: 24,
            }}
          >
            {[
              { key: "overview", label: "Overview" },
              ...(hasMenu ? [{ key: "menu", label: "Menu" }] : []),
              { key: "reviews", label: "Reviews" },
              { key: "photos", label: "Photos" },
              { key: "videos", label: "Videos" },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key as any)}
                style={{
                  paddingBottom: 12,
                  marginRight: 24,
                  borderBottomWidth: activeTab === tab.key ? 2 : 0,
                  borderBottomColor: "#ba9988",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: activeTab === tab.key ? "700" : "500",
                    color: activeTab === tab.key ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <View style={{ gap: 24 }}>
              {/* Location */}
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 12,
                  }}
                >
                  Location
                </Text>
                <TouchableOpacity
                  onPress={handleDirections}
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                    <MaterialIcons name="location-on" size={24} color="#ba9988" />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#ffffff",
                          marginBottom: 4,
                        }}
                      >
                        {formatAddress()}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        Tap for directions
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Hours */}
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 12,
                  }}
                >
                  Hours
                </Text>
                <View
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  {Object.entries(business.hours).map(([day, hours]) => {
                    const hoursStr = typeof hours === "string" ? hours : String(hours);
                    return (
                      <View
                        key={day}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingVertical: 8,
                          borderBottomWidth: day !== "sunday" ? 1 : 0,
                          borderBottomColor: "rgba(71, 71, 71, 0.5)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#ffffff",
                            textTransform: "capitalize",
                          }}
                        >
                          {day}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: hoursStr === "Closed" ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          {hoursStr}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Contact */}
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 12,
                  }}
                >
                  Contact
                </Text>
                <View
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    gap: 12,
                  }}
                >
                  <TouchableOpacity
                    onPress={handleCall}
                    style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
                  >
                    <MaterialIcons name="phone" size={20} color="#ba9988" />
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ffffff",
                      }}
                    >
                      {business.phone}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleEmail}
                    style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
                  >
                    <MaterialIcons name="email" size={20} color="#ba9988" />
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ffffff",
                      }}
                    >
                      {business.email}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Amenities */}
              {business.amenities && business.amenities.length > 0 && (
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 12,
                    }}
                  >
                    Amenities
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {business.amenities.map((amenity: string) => (
                      <View
                        key={amenity}
                        style={{
                          backgroundColor: "rgba(186, 153, 136, 0.15)",
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#ba9988",
                            fontWeight: "500",
                          }}
                        >
                          {amenity}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Tags */}
              {business.tags && business.tags.length > 0 && (
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 12,
                    }}
                  >
                    Tags
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {business.tags.map((tag: string) => (
                      <View
                        key={tag}
                        style={{
                          backgroundColor: "#474747",
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: "rgba(186, 153, 136, 0.2)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            color: "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {activeTab === "menu" && hasMenu && (
            <View>
              <MenuDisplay menu={business.menu as Menu} />
            </View>
          )}

          {activeTab === "reviews" && (
            <View style={{ gap: 24 }}>
              {/* Review Summary */}
              <View
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Text
                        style={{
                          fontSize: 36,
                          fontWeight: "800",
                          color: "#ffffff",
                        }}
                      >
                        {business.rating}
                      </Text>
                      <View style={{ flexDirection: "row", gap: 2 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <MaterialIcons
                            key={star}
                            name={star <= Math.round(business.rating) ? "star" : "star-border"}
                            size={20}
                            color={star <= Math.round(business.rating) ? "#ffd700" : "rgba(255, 255, 255, 0.3)"}
                          />
                        ))}
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.6)",
                      }}
                    >
                      Based on {business.reviewCount} reviews
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setShowReviewForm(!showReviewForm)}
                    style={{
                      backgroundColor: "#ba9988",
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 12,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <MaterialIcons name="edit" size={16} color="#ffffff" />
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "600",
                        color: "#ffffff",
                      }}
                    >
                      {showReviewForm ? "Cancel" : "Write Review"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Review Form */}
              {showReviewForm && (
                <ReviewForm
                  businessId={business.id}
                  onSubmit={handleSubmitReview}
                  onCancel={() => setShowReviewForm(false)}
                />
              )}

              {/* Reviews List */}
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 16,
                  }}
                >
                  All Reviews ({reviews.length})
                </Text>
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} onHelpful={handleHelpful} />
                  ))
                ) : (
                  <View
                    style={{
                      backgroundColor: "#474747",
                      borderRadius: 16,
                      padding: 40,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  >
                    <MaterialIcons name="rate-review" size={48} color="rgba(186, 153, 136, 0.5)" />
                    <Text
                      style={{
                        fontSize: 16,
                        color: "rgba(255, 255, 255, 0.6)",
                        textAlign: "center",
                        marginTop: 16,
                      }}
                    >
                      No reviews yet. Be the first to review!
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {activeTab === "photos" && (
            <View>
              {business.images && business.images.length > 0 ? (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: isMobile ? 8 : 12,
                      marginBottom: 24,
                    }}
                  >
                    {business.images.map((imageUrl: string, index: number) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedPhotoIndex(index)}
                        style={{
                          width: isMobile ? "48%" : "31%",
                          aspectRatio: 1,
                          borderRadius: 12,
                          overflow: "hidden",
                          backgroundColor: "#474747",
                        }}
                      >
                        <Image
                          source={{ uri: imageUrl }}
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                          contentFit="cover"
cachePolicy="memory-disk"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  {/* Photo View Modal */}
                  <Modal
                    visible={selectedPhotoIndex !== null}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setSelectedPhotoIndex(null)}
                  >
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: "rgba(0, 0, 0, 0.95)",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          position: "absolute",
                          top: Platform.OS === "web" ? 20 : 60,
                          right: 20,
                          zIndex: 10,
                          padding: 12,
                        }}
                        onPress={() => setSelectedPhotoIndex(null)}
                      >
                        <MaterialIcons name="close" size={28} color="#ffffff" />
                      </TouchableOpacity>
                      
                      {selectedPhotoIndex !== null && (
                        <>
                          <Image
                            source={{ uri: business.images[selectedPhotoIndex] }}
                            style={{
                              width: isMobile ? "100%" : "90%",
                              height: isMobile ? "70%" : "80%",
                              maxWidth: 1200,
                              maxHeight: 800,
                            }}
                            contentFit="contain"
cachePolicy="memory-disk"
                          />
                          
                          {/* Navigation Arrows */}
                          {business.images.length > 1 && (
                            <>
                              {selectedPhotoIndex > 0 && (
                                <TouchableOpacity
                                  style={{
                                    position: "absolute",
                                    left: 20,
                                    top: "50%",
                                    transform: [{ translateY: -20 }],
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    borderRadius: 25,
                                    padding: 12,
                                  }}
                                  onPress={() => setSelectedPhotoIndex(selectedPhotoIndex - 1)}
                                >
                                  <MaterialIcons name="chevron-left" size={32} color="#ffffff" />
                                </TouchableOpacity>
                              )}
                              {selectedPhotoIndex < business.images.length - 1 && (
                                <TouchableOpacity
                                  style={{
                                    position: "absolute",
                                    right: 20,
                                    top: "50%",
                                    transform: [{ translateY: -20 }],
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    borderRadius: 25,
                                    padding: 12,
                                  }}
                                  onPress={() => setSelectedPhotoIndex(selectedPhotoIndex + 1)}
                                >
                                  <MaterialIcons name="chevron-right" size={32} color="#ffffff" />
                                </TouchableOpacity>
                              )}
                            </>
                          )}
                          
                          {/* Photo Counter */}
                          <View
                            style={{
                              position: "absolute",
                              bottom: Platform.OS === "web" ? 40 : 80,
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              paddingHorizontal: 16,
                              paddingVertical: 8,
                              borderRadius: 20,
                            }}
                          >
                            <Text
                              style={{
                                color: "#ffffff",
                                fontSize: 14,
                                fontWeight: "600",
                              }}
                            >
                              {selectedPhotoIndex + 1} / {business.images.length}
                            </Text>
                          </View>
                        </>
                      )}
                    </View>
                  </Modal>
                </>
              ) : (
                <View
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 40,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <MaterialIcons name="photo-library" size={48} color="rgba(186, 153, 136, 0.5)" />
                  <Text
                    style={{
                      fontSize: 16,
                      color: "rgba(255, 255, 255, 0.7)",
                      textAlign: "center",
                      marginTop: 16,
                    }}
                  >
                    No photos available yet
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.5)",
                      textAlign: "center",
                      marginTop: 8,
                    }}
                  >
                    Check back soon for photos from this business
                  </Text>
                </View>
              )}
            </View>
          )}

          {activeTab === "videos" && (
            <View>
              {business.videos && business.videos.length > 0 ? (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: isMobile ? 8 : 12,
                  }}
                >
                  {business.videos.map((videoUrl: string, index: number) => (
                    <View
                      key={index}
                      style={{
                        width: isMobile ? "100%" : "48%",
                        aspectRatio: 16 / 9,
                        borderRadius: 12,
                        overflow: "hidden",
                        backgroundColor: "#474747",
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <View
                        style={{
                          width: "100%",
                          height: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MaterialIcons name="play-circle-filled" size={64} color="rgba(186, 153, 136, 0.8)" />
                        <Text
                          style={{
                            fontSize: 14,
                            color: "rgba(255, 255, 255, 0.7)",
                            marginTop: 8,
                          }}
                        >
                          Video {index + 1}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 40,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <MaterialIcons name="video-library" size={48} color="rgba(186, 153, 136, 0.5)" />
                  <Text
                    style={{
                      fontSize: 16,
                      color: "rgba(255, 255, 255, 0.7)",
                      textAlign: "center",
                      marginTop: 16,
                    }}
                  >
                    No videos available yet
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.5)",
                      textAlign: "center",
                      marginTop: 8,
                    }}
                  >
                    Check back soon for videos from this business
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </OptimizedScrollView>
    </View>
  );
}

