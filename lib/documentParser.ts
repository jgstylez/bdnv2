/**
 * Document Parser Utility
 * Extracts business information from uploaded documents using OCR/text extraction
 * 
 * This is a placeholder implementation. In production, integrate with:
 * - Google Cloud Vision API
 * - AWS Textract
 * - Azure Form Recognizer
 * - Or a custom OCR service
 */

import { InternationalAddress, CountryCode, TaxIdType, InternationalIncorporation } from "../types/international";

export interface ParsedBusinessInfo {
  businessName?: string;
  ownerName?: string;
  // International tax ID support
  taxId?: string; // Tax ID number (EIN, VAT, etc.)
  taxIdType?: TaxIdType; // Type of tax ID
  taxIdCountry?: CountryCode; // Country of tax ID
  // International incorporation support
  incorporation?: InternationalIncorporation;
  // Legacy fields (for backward compatibility)
  /** @deprecated Use incorporation instead */
  incorporationType?: "llc" | "corporation" | "partnership" | "sole-proprietorship" | "nonprofit";
  /** @deprecated Use incorporation.incorporationState instead */
  incorporationState?: string;
  /** @deprecated Use incorporation.incorporationDate instead */
  incorporationDate?: string;
  ownershipPercentage?: number;
  // International address support
  address?: InternationalAddress;
  // Legacy address fields (for backward compatibility)
  /** @deprecated Use address instead */
  city?: string;
  /** @deprecated Use address instead */
  state?: string;
  /** @deprecated Use address.postalCode instead */
  zipCode?: string;
  phone?: string;
  phoneCountryCode?: CountryCode;
  email?: string;
  confidence: number; // 0-1, how confident we are in the extraction
}

/**
 * Recommended document types for verification, ordered by information completeness
 * Updated to support international documents
 */
export const RECOMMENDED_DOCUMENTS = [
  {
    type: "Articles of Incorporation",
    description: "Contains business name, incorporation type, state/province, date, and registered agent info",
    fields: ["businessName", "incorporationType", "incorporationState", "incorporationDate", "ownerName"],
    priority: 1,
    international: true,
  },
  {
    type: "Business Registration Certificate",
    description: "Contains business name, registration number, owner information, and address",
    fields: ["businessName", "ownerName", "address", "taxId"],
    priority: 2,
    international: true,
  },
  {
    type: "Operating Agreement (LLC)",
    description: "Contains ownership percentages, member names, and business structure",
    fields: ["businessName", "ownerName", "ownershipPercentage", "incorporationType"],
    priority: 3,
    international: true,
  },
  {
    type: "Tax ID Document",
    description: "Contains business name and tax identification number (EIN, VAT, GST, etc.)",
    fields: ["businessName", "taxId", "taxIdType"],
    priority: 4,
    international: true,
  },
  {
    type: "VAT Certificate",
    description: "EU/UK VAT registration document",
    fields: ["businessName", "taxId", "taxIdType"],
    priority: 4,
    international: true,
  },
  {
    type: "Company Registration Document",
    description: "International company registration (varies by country)",
    fields: ["businessName", "registrationNumber", "address"],
    priority: 2,
    international: true,
  },
];

/**
 * Parse document and extract business information
 * 
 * @param documentUri - URI of the uploaded document
 * @param documentType - Type of document (optional, helps with parsing)
 * @returns Parsed business information
 */
export async function parseDocument(
  documentUri: string,
  documentType?: string
): Promise<ParsedBusinessInfo> {
  // TODO: Implement actual OCR/document parsing
  // This is a placeholder that simulates document parsing
  
  // In production, this would:
  // 1. Convert document to image(s) if PDF
  // 2. Use OCR service to extract text
  // 3. Use NLP/pattern matching to extract structured data
  // 4. Return parsed information with confidence scores
  
  // For now, return empty object with low confidence
  // This allows the UI to work while you integrate a real OCR service
  
  return {
    confidence: 0,
  };
}

/**
 * Extract business name from text
 */
function extractBusinessName(text: string): string | undefined {
  // Pattern: Look for "Business Name:", "Company Name:", "Entity Name:", etc.
  const patterns = [
    /(?:business|company|entity|organization)\s+name[:\s]+([A-Z][A-Za-z0-9\s&,.-]+)/i,
    /name[:\s]+of[:\s]+(?:business|company|entity)[:\s]+([A-Z][A-Za-z0-9\s&,.-]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return undefined;
}

/**
 * Extract EIN/Tax ID from text
 */
function extractTaxId(text: string): string | undefined {
  // Pattern: XX-XXXXXXX (EIN format)
  const einPattern = /\b\d{2}-?\d{7}\b/;
  const match = text.match(einPattern);
  return match ? match[0].replace(/-/g, "") : undefined;
}

/**
 * Extract incorporation type from text
 */
function extractIncorporationType(text: string): ParsedBusinessInfo["incorporationType"] | undefined {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes("limited liability company") || lowerText.includes("llc")) {
    return "llc";
  }
  if (lowerText.includes("corporation") || lowerText.includes("inc.") || lowerText.includes("corp")) {
    return "corporation";
  }
  if (lowerText.includes("partnership")) {
    return "partnership";
  }
  if (lowerText.includes("nonprofit") || lowerText.includes("non-profit")) {
    return "nonprofit";
  }
  if (lowerText.includes("sole proprietorship") || lowerText.includes("sole proprietor")) {
    return "sole-proprietorship";
  }
  
  return undefined;
}

/**
 * Extract state from text (for incorporation state)
 */
function extractState(text: string): string | undefined {
  // US state abbreviations
  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  ];
  
  // Look for "State of [STATE]" or "Incorporated in [STATE]"
  const statePattern = /(?:state|incorporated|formed)\s+(?:of|in)\s+([A-Z]{2})\b/i;
  const match = text.match(statePattern);
  
  if (match && match[1] && states.includes(match[1])) {
    return match[1];
  }
  
  return undefined;
}

/**
 * Extract date from text (for incorporation date)
 */
function extractDate(text: string): string | undefined {
  // Pattern: MM/DD/YYYY, MM-DD-YYYY, or Month DD, YYYY
  const datePatterns = [
    /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})\b/,
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/i,
  ];
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }
  
  return undefined;
}

/**
 * Extract ownership percentage from text
 */
function extractOwnershipPercentage(text: string): number | undefined {
  // Pattern: "X%", "X percent", "X percent ownership"
  const percentagePattern = /(\d+(?:\.\d+)?)\s*%?\s*(?:percent|ownership|interest)/i;
  const match = text.match(percentagePattern);
  
  if (match && match[1]) {
    const percentage = parseFloat(match[1]);
    if (percentage >= 0 && percentage <= 100) {
      return percentage;
    }
  }
  
  return undefined;
}

/**
 * Extract address information from text
 */
function extractAddress(text: string): { address?: string; city?: string; state?: string; zipCode?: string } {
  // Pattern: Street address, City, State ZIP
  const addressPattern = /(\d+\s+[A-Za-z0-9\s,.-]+),\s*([A-Za-z\s]+),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)/i;
  const match = text.match(addressPattern);
  
  if (match) {
    return {
      address: match[1].trim(),
      city: match[2].trim(),
      state: match[3],
      zipCode: match[4],
    };
  }
  
  return {};
}

