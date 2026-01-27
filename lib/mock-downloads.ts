/**
 * Mock Download Service
 * 
 * Provides realistic download URLs for development and testing
 * Uses publicly available sample files for different file types
 */

import { Product } from "@/types/merchant";

/**
 * Get mock download URL based on product type and ID
 * Returns realistic URLs that can be previewed/downloaded
 */
export function getMockDownloadUrl(product: Product): string {
  const productId = product.id;
  const productName = product.name.toLowerCase();

  // Determine file type based on product name/category
  if (
    productName.includes("ebook") ||
    productName.includes("book") ||
    productName.includes("guide") ||
    productName.includes("history")
  ) {
    // PDF files - use sample PDFs
    return getMockPdfUrl(productId);
  } else if (
    productName.includes("template") ||
    productName.includes("spreadsheet") ||
    productName.includes("plan")
  ) {
    // Document files - use sample documents
    return getMockDocumentUrl(productId);
  } else if (
    productName.includes("course") ||
    productName.includes("masterclass") ||
    productName.includes("video")
  ) {
    // Video files - use sample videos
    return getMockVideoUrl(productId);
  } else if (
    productName.includes("image") ||
    productName.includes("photo") ||
    productName.includes("art")
  ) {
    // Image files - use sample images
    return getMockImageUrl(productId);
  } else {
    // Default to PDF
    return getMockPdfUrl(productId);
  }
}

/**
 * Get mock PDF URL
 * Uses publicly available sample PDFs
 */
function getMockPdfUrl(productId: string): string {
  // Use Mozilla's sample PDF
  // Alternative: https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf
  const pdfs = [
    "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    "https://www.africau.edu/images/default/sample.pdf",
  ];
  
  // Use product ID to deterministically select a PDF
  const index = parseInt(productId.replace(/\D/g, "")) || 0;
  return pdfs[index % pdfs.length];
}

/**
 * Get mock image URL
 * Uses Unsplash or other public image services
 */
function getMockImageUrl(productId: string): string {
  // Use product's existing image if available, otherwise use Unsplash
  const images = [
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&h=1600&fit=crop", // Book
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=1600&fit=crop", // Business
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=1600&fit=crop", // Education
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=1600&fit=crop", // Finance
  ];
  
  const index = parseInt(productId.replace(/\D/g, "")) || 0;
  return images[index % images.length];
}

/**
 * Get mock video URL
 * Uses publicly available sample videos
 */
function getMockVideoUrl(productId: string): string {
  // Use sample videos from public sources
  const videos = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  ];
  
  const index = parseInt(productId.replace(/\D/g, "")) || 0;
  return videos[index % videos.length];
}

/**
 * Get mock document URL
 * Uses sample document files
 */
function getMockDocumentUrl(productId: string): string {
  // For documents, we'll use a PDF as fallback since we can't easily host .docx files
  // In production, these would be actual document files
  return getMockPdfUrl(productId);
}

/**
 * Generate mock download token
 * Creates a deterministic token based on product ID for testing
 */
export function generateMockDownloadToken(productId: string): string {
  // Generate a deterministic "token" for testing
  // In production, this would come from the API
  return `mock-token-${productId}-${Date.now()}`;
}

/**
 * Simulate download API response
 * Returns mock download data as if from the API
 */
export function simulateDownloadApiResponse(
  product: Product,
  orderId?: string,
): {
  downloadToken: string;
  downloadUrl: string;
  downloadCount: number;
  downloadLimit: number;
  expiresAt: string | null;
} {
  const downloadUrl = getMockDownloadUrl(product);
  const downloadToken = generateMockDownloadToken(product.id);

  return {
    downloadToken,
    downloadUrl,
    downloadCount: 0,
    downloadLimit: product.downloadLimit ?? -1,
    expiresAt: product.expirationDate || null,
  };
}

/**
 * Check if URL is a mock URL
 */
export function isMockUrl(url: string): boolean {
  return (
    url.includes("mozilla.github.io") ||
    url.includes("w3.org") ||
    url.includes("africau.edu") ||
    url.includes("unsplash.com") ||
    url.includes("commondatastorage.googleapis.com") ||
    url.includes("example.com") ||
    url.startsWith("mock-token-")
  );
}
