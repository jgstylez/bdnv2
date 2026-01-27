# Mock Download Simulation System

## Overview

A comprehensive simulation system for testing digital product previews and downloads during development. Uses publicly available sample files to provide realistic preview/download experiences.

## What Was Implemented

### 1. Mock Download Service (`lib/mock-downloads.ts`)

A utility service that provides:

- **Realistic Download URLs**: Uses publicly available sample files
- **File Type Detection**: Automatically selects appropriate file type based on product name/category
- **Token Generation**: Creates mock download tokens for testing
- **API Response Simulation**: Simulates API responses with download data

### 2. Updated Mock Products (`data/mocks/products.ts`)

Updated all digital products with realistic download URLs:

- **PDFs**: Sample PDFs from Mozilla, W3C, and other public sources
- **Videos**: Sample videos from Google Cloud Storage
- **Images**: High-quality images from Unsplash
- **Documents**: PDF fallback for document types

### 3. Enhanced Download Page (`app/pages/download.tsx`)

- **Mock Token Detection**: Automatically detects mock tokens and uses appropriate URLs
- **Fallback Logic**: Falls back to product URL if token is mock
- **Demo Mode Indicator**: Shows "Demo Mode" badge when using mock data
- **Product ID Lookup**: Can fetch mock URLs from product ID

### 4. Updated Checkout Flow (`app/pages/checkout.tsx`)

- Uses `simulateDownloadApiResponse()` to generate realistic download data
- Includes download URLs along with tokens for fallback
- Provides complete download information (count, limit, expiration)

## Mock File Sources

### PDFs
- **Mozilla PDF.js Sample**: `https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf`
- **W3C Sample PDF**: `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`
- **Africa University Sample**: `https://www.africau.edu/images/default/sample.pdf`

### Videos
- **Google Cloud Storage Samples**:
  - Big Buck Bunny: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`
  - Elephants Dream: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4`
  - For Bigger Blazes: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4`
  - For Bigger Escapes: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4`

### Images
- **Unsplash**: High-quality images with proper dimensions
- Uses product's existing image URLs when available

## File Type Mapping

The system automatically maps products to file types:

| Product Contains | File Type | Sample URL |
|-----------------|-----------|------------|
| "ebook", "book", "guide", "history" | PDF | Mozilla/W3C PDFs |
| "template", "spreadsheet", "plan" | Document | PDF fallback |
| "course", "masterclass", "video" | Video | Google Cloud videos |
| "image", "photo", "art" | Image | Unsplash images |

## Usage

### In Checkout (After Purchase)

```typescript
import { simulateDownloadApiResponse } from "@/lib/mock-downloads";

// Generate mock download data
const mockDownload = simulateDownloadApiResponse(product, orderId);

// Use in checkout flow
const productsWithTokens = checkoutItems.map((item) => {
  const mockDownload = simulateDownloadApiResponse(item, newOrderId);
  return {
    ...item,
    downloadToken: mockDownload.downloadToken,
    downloadUrl: mockDownload.downloadUrl,
    downloadCount: mockDownload.downloadCount,
    downloadLimit: mockDownload.downloadLimit,
  };
});
```

### In Download Page

The download page automatically handles mock tokens:

```typescript
// Mock token format: "mock-token-{productId}-{timestamp}"
// Automatically extracts product ID and fetches mock URL
```

### Direct Product Access

```typescript
import { getMockDownloadUrl } from "@/lib/mock-downloads";

const downloadUrl = getMockDownloadUrl(product);
```

## Mock Token Format

Mock tokens follow this format:
```
mock-token-{productId}-{timestamp}
```

Example:
```
mock-token-prod-4-1738022400000
```

The download page automatically:
1. Detects mock token prefix
2. Extracts product ID
3. Fetches product from mock data
4. Gets appropriate mock download URL
5. Uses that URL for preview/download

## Features

### ✅ Realistic Preview
- Actual PDFs that can be viewed
- Real videos that can be played
- High-quality images
- Proper file type detection

### ✅ Seamless Integration
- Works with existing checkout flow
- No code changes needed for production
- Automatic fallback to real API when available

### ✅ Development Friendly
- "Demo Mode" indicator shows when using mocks
- Easy to test different file types
- Deterministic URLs (same product = same file)

### ✅ Production Ready
- Real API tokens work normally
- Mock detection only in development
- Graceful fallback to real URLs

## Testing Different File Types

### PDF Products
- "Black History E-Book Collection" → PDF viewer
- "Business Plan Template Pack" → PDF viewer
- "Entrepreneurship E-Book Series" → PDF viewer

### Video Products
- "Digital Marketing Masterclass" → Video player

### Image Products
- "Social Media Content Templates" → Image viewer

## Demo Mode Indicator

When using mock data, a "Demo Mode" badge appears below the product name in the download page header. This helps developers distinguish between:
- **Mock Data**: Shows "Demo Mode" badge
- **Real Data**: No badge (production mode)

## Production Migration

When moving to production:

1. **Remove Mock Detection**: The download page will automatically use real API endpoints
2. **Update Checkout**: Replace `simulateDownloadApiResponse()` with real API call
3. **Remove Demo Badge**: The `isMockData` check will return false for real tokens

No code changes needed - the system automatically handles both modes!

## Benefits

1. **No External Dependencies**: Uses publicly available files
2. **Realistic Testing**: Actual files that can be previewed/downloaded
3. **Easy Development**: No need to set up file storage during development
4. **Type Safety**: Full TypeScript support
5. **Deterministic**: Same product always gets same file type
6. **Extensible**: Easy to add more file sources

## File Type Support

| Type | Preview | Download | Notes |
|------|---------|----------|-------|
| PDF | ✅ | ✅ | Full viewer with navigation |
| Image | ✅ | ✅ | Zoomable viewer |
| Video | ✅ | ✅ | HTML5 player |
| Document | ❌ | ✅ | Shows download prompt |

## Notes

- Mock URLs are publicly accessible and don't require authentication
- Files are hosted on reliable CDNs (Mozilla, Google Cloud, Unsplash)
- All sample files are safe for testing
- Mock tokens are clearly identifiable (start with "mock-token-")
- Real API tokens work normally when backend is available
