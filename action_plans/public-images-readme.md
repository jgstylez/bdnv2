# Public Website Images

This directory contains images used for the public-facing website pages (located in `app/web/`).

## Image Files

### Hero & Main Content Images
- `hero-professional.png` - Professional hero image for main pages
- `impact-business-owner.png` - Business owner impact imagery
- `mission-collaboration.png` - Collaboration/mission imagery
- `cta-community-family.png` - Community/family call-to-action image

### Industry Showcase Images
- `empowering_industries_1.png` - Industry showcase image 1
- `empowering_industries_2.png` - Industry showcase image 2
- `empowering_industries_3.png` - Industry showcase image 3

### Brand Assets
- `blkownd.png` - Black Owned branding image
- `trademark-thumb-emblem.jpg` - Trademark emblem thumbnail
- `trademark-thumb-name.jpg` - Trademark name thumbnail
- `trademark-thumb-tagline.jpg` - Trademark tagline thumbnail

## Usage

When referencing these images in your code, use the path:
```typescript
import heroImage from '@/assets/images/public/hero-professional.png';
// or
const imagePath = require('@/assets/images/public/hero-professional.png');
```

## Notes

- All images in this directory are optimized for web/public display
- Images should be optimized before adding new ones
- Maintain consistent naming conventions (kebab-case)
