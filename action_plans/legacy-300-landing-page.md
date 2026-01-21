---
name: ""
overview: ""
todos: []
---

---

name: Legacy 300 Landing Page

overview: Create a modern, responsive landing page for Legacy 300 using vanilla HTML/CSS/JavaScript with Tailwind CSS, featuring the Food Is Medicine campaign, Legacy 300 movement details, app download links, and donation/sponsorship CTAs.

todos:

- id: setup_html_structure

content: Create index.html with semantic structure, Tailwind CDN, and all page sections (header, hero, problem, economic system statement, LRAC benefits, founding members CTA, donations, app, enrollment form, footer). Include form.js for form handling

status: pending

- id: implement_hero_section

content: Build hero section with "Join the Legacy 300" headline, tagline "Build Ownership. Secure Markets. Feed Our People. Create Generational Wealth.", Legacy 300 logo, and primary CTA using dark green background and gold/green accents. Apply PAULVANTE-inspired clean design with proper spacing and beautiful typography

status: pending

- id: implement_problem_section

content: Create problem section explaining how Black farmers have carried the burden without fair markets, and billions leave communities through food systems we don't own, with transition to LRAC solution

status: pending

- id: implement_economic_system_section

content: Build prominent "This Is Not a Program. This Is an Economic System." section with bold typography emphasizing systemic change

status: pending

- id: implement_lrac_benefits

content: Create "What It Means to Join LRAC" section with 4 benefit cards: membership, access to contracts/partnerships, participation in conferences/training, voice in 300-year system

status: pending

- id: implement_founding_members_cta

content: Build call-to-action section inviting 300 founding producers/businesses/organizations to build the 1 Million Food Box Campaign, with closing statement "This is our moment to move from survival to sovereignty"

status: pending

- id: implement_donation_section

content: Create donation/sponsorship section with suggested donation tiers ($35-$5,000) and CTAs linking to saveblackfarmers.com

status: pending

- id: implement_app_section

content: Add Legacy Taste of the Garden app showcase with features, Google Play download link, and stakeholder use cases

status: pending

- id: implement_supporting_ctas

content: "Add supporting CTA section with donation/sponsorship options and app download, linking to saveblackfarmers.com and Google Play"

status: pending

- id: add_responsive_styling

content: Ensure all sections are fully responsive using Tailwind utilities with proper spacing (py-12 md:py-16 lg:py-24), clean layouts inspired by PAULVANTE design, test mobile/tablet/desktop layouts

status: pending

- id: implement_enrollment_form

content: Build comprehensive enrollment form with 7 sections: Organization/Farm Info, Role in Food System, Capacity & Participation, Program Engagement, Challenges & Support, Additional Information, and Signature. Include all checkboxes, text inputs, textareas, and radio buttons. Add form validation and submission handling

status: pending

- id: add_interactivity

content: Add JavaScript for smooth scrolling, mobile menu toggle, form validation, form data collection/preparation for submission, and conditional form fields based on user selections

status: pending

- id: optimize_and_finalize

content: Add meta tags, optimize images, ensure accessibility, and finalize all links and content

status: pending

---

# Legacy 300 Landing Page

## Overview

Build a single-page landing site for Legacy 300 that communicates the Food Is Medicine campaign, Legacy 300 movement, and provides clear calls-to-action for donations, sponsorships, and app downloads.

## Design Approach (Inspired by PAULVANTE)

**Design Philosophy**: Clean, beautiful, intuitive, properly spaced, mobile-friendly - not overcomplicated

**Visual Elements from PAULVANTE Inspiration**:

- **Color Scheme**: Dark green (#1a4d3a or #0f5132) backgrounds with white text, lime green (#84cc16 or #a3e635) accent buttons
- **Accent Colors**: Gold (#d4af37) and vibrant green (#22c55e) from the Legacy 300 logo for highlights
- **Typography**: Large, bold headlines with clear hierarchy; readable body text with proper line-height
- **Spacing**: Generous padding and margins between sections (py-16 to py-24 on desktop, py-12 to py-16 on mobile)
- **Section Layout**: Full-width sections with max-width containers (max-w-7xl) for content, centered
- **Card Design**: Clean white or light backgrounds for content cards on dark green sections, subtle shadows
- **Buttons**: Rounded corners (rounded-lg or rounded-xl), lime green accent color, clear hover states
- **Navigation**: Clean header with logo on left, nav items centered/right, mobile hamburger menu

**Key Design Principles**:

- **Simplicity**: Avoid clutter - let content breathe with ample whitespace
- **Contrast**: Dark green backgrounds with white text for readability
- **Focus**: One primary CTA per section, clear visual hierarchy
- **Mobile-First**: Stack content vertically on mobile, use Tailwind responsive utilities (sm:, md:, lg:)
- **Consistency**: Uniform spacing scale, consistent button styles, cohesive color usage throughout

## File Structure

```
legacy300/
├── index.html          # Main landing page (includes enrollment form section)
├── assets/
│   ├── css/
│   │   └── styles.css  # Custom CSS (if needed beyond Tailwind)
│   ├── js/
│   │   └── form.js     # Form validation and submission handling
│   └── images/
│       ├── logo-legacy300.png  # Legacy 300 logo (from provided images)
│       └── [other images]
└── README.md           # Setup instructions
```

## Page Sections

### 1. Header/Navigation

- Logo: Legacy 300 (use provided logo image)
- Navigation: Home, About, Campaign, Join, Contact
- CTA button: "Join the Movement" (lime green accent)

### 2. Hero Section

- **Main Headline**: "Join the Legacy 300"
- **Tagline**: "Build Ownership. Secure Markets. Feed Our People. Create Generational Wealth."
- Background: Dark green with subtle pattern or gradient
- Legacy 300 logo prominently displayed
- Primary CTA: "Join Legacy 300" button
- App download badges (Google Play link provided)

### 3. The Problem Section

- **Core Message**: "For generations, Black farmers, businesses, and community organizations have carried the burden of feeding our communities—often without fair markets, stable contracts, or long-term protection. At the same time, billions of dollars leave our communities every year through food systems we do not own."
- Visual representation: Could use statistics or imagery showing economic drain
- Transition: "Legacy Regional Agricultural Cooperative (LRAC) and the Legacy 300 Project were created to change that reality—permanently."

### 4. This Is Not a Program Section

- **Bold Statement**: "This Is Not a Program. This Is an Economic System."
- Large, impactful typography
- Emphasizes the systemic, permanent nature of the solution

### 5. What It Means to Join LRAC

- Four key benefits displayed as cards/icons:

  1. Membership in a regional-to-national cooperative
  2. Access to contracts, partnerships, and infrastructure
  3. Participation in Legacy 300 conferences, training, and planning
  4. A voice in shaping a system designed to last 300 years

- Visual: Clean card layout with icons

### 6. Call to Action - Join the 300

- **Headline**: "We are inviting:"
- **Invitation**: "300 founding producers, businesses, and organizations"
- **Purpose**: "To help build, supply, distribute, and scale the 1 Million Food Box Campaign"
- **Vision**: "And to stand as architects of a new economic future"
- **Closing Statement**: "This is our moment to move from survival to sovereignty."
- Prominent CTA buttons

### 7. Donation/Sponsorship Section

- Suggested donation amounts:
  - $35/couple, $50/family
  - Bulk: $875 (25 couples), $1,250 (25 families), $3,500 (100 couples), $5,000 (100 families)
- Clear CTA buttons linking to saveblackfarmers.com

### 8. Legacy Taste of the Garden App

- App showcase section
- Features: Farmers, Consumers, Brands, Community Organizations, Educators
- Google Play download button/link
- QR code option (if available)

### 9. Call-to-Action Section

- Three primary CTAs:
  - "Join the Movement"
  - "Sponsor Food Boxes"
  - "Become a Legacy 300 Member"
- Links to appropriate forms/pages

### 10. Enrollment & Interest Form Section

- **Access**: Form can be embedded as a section on the landing page (accessible via "Join Legacy 300" CTA) or linked to as a separate page/modal
- **Form Title**: "Enrollment & Interest Form - 1 Million Fresh Food Box Supply System"
- **Introduction**: Thank you message explaining the movement and purpose: "Thank you for your interest in joining the national movement to strengthen food access, protect underserved farmers, and deliver 1 million fresh food boxes to rural and urban communities across the country. Please complete the form below to help us understand your capacity, interests, and how you can participate in the supply system."
- **Form Structure**: Multi-section form with 7 sections, clean design matching PAULVANTE inspiration:

**Section 1: Organization / Farm Information**

- Name (Individual or Organization) - text input
- Contact Person & Title - text input
- Phone Number - tel input
- Email Address - email input
- Website (if applicable) - url input
- Address - textarea
- County / Region - text input
- Type of Entity (checkboxes):
  - Black Farmer
  - BIPOC Farmer
  - Socially Disadvantaged Farmer
  - Food Bank / Pantry
  - Food Hub / Aggregator
  - Cold Storage / Warehousing
  - Transportation / Logistics
  - Cooperative
  - Nonprofit Organization
  - Other (with text input)

**Section 2: Your Role in the Food System**

- Operations checkboxes:
  - Fresh Produce Farming
  - Livestock / Poultry
  - Specialty Crops
  - Value-Added Products
  - Storage / Cold Chain
  - Processing / Packing
  - Distribution / Delivery
  - Community Food Distribution
  - Retail / CSA
  - Other (with text input)
- Years of Experience (radio buttons):
  - 0–3 years
  - 4–9 years
  - 10+ years
  - Multi-generational farm / operation

**Section 3: Capacity & Participation**

- Conditional text areas based on role:
  - If farmer: "What products can you supply?" (textarea)
  - If storage/warehouse: "What capacity do you have?" (textarea)
  - If distributor/logistics: "Describe your fleet, routes, or capabilities" (textarea)
  - If food bank/pantry: "What is your community reach?" (textarea)

**Section 4: Program Engagement**

- Participation checkboxes:
  - Become a product supplier
  - Provide storage or warehouse space
  - Support aggregation and packing
  - Assist with transportation or logistics
  - Host community distribution sites
  - Participate in Save Black Farmers campaigns
  - Join LRAC / Legacy 300
  - Volunteer or contribute resources
  - Receive boxes for community distribution
  - Other (with text input)

**Section 5: Challenges & Support Needed**

- Barriers checkboxes:
  - Lack of stable markets
  - Loss of LFPA or previous purchasing programs
  - SNAP/WIC policy cuts impacting community demand
  - High operational costs (fuel, fertilizer, feed)
  - Tariffs affecting crop pricing
  - Land access or ownership
  - Equipment or storage limitations
  - Need for cooperative support
  - Need for funding/working capital
  - Other (with text input)
- "What assistance would help you participate more fully?" (textarea)

**Section 6: Additional Information**

- "Why do you want to join this movement?" (textarea)
- "How did you hear about this initiative?" (radio buttons):
  - Save Black Farmers Campaign
  - LRAC / Legacy 300
  - Social Media
  - Community Organization
  - Word of Mouth
  - Other (with text input)

**Section 7: Signature**

- Printed Name - text input
- Signature - text input (or canvas signature pad)
- Date - date input

- **Submit Button**: Prominent lime green button
- **Submission Info**: Display email and website upload link (www.saveblackfarmers.com)
- **Form Validation**: Client-side validation for required fields (name, email, phone, at least one entity type checkbox)
- **Form Handling**: JavaScript to collect form data and prepare for email submission or API endpoint
- **Note**: A simplified version can also be created with just: name, email, state, city, phone, website, and entity type checkboxes (Black Farmers & Producer Groups, Farmer Organizations & Cooperatives, Food Chain Businesses, Community Organizations & Institutions) - this can be used as a quick interest form with link to full enrollment form

### 11. Footer

- LRAC information
- Links: Website, Email, App Download
- Social media icons (if applicable)
- Copyright information

## Technical Implementation

### HTML Structure

- Semantic HTML5 elements (`<header>`, `<section>`, `<footer>`)
- Tailwind CSS via CDN for rapid development
- Accessible markup (ARIA labels, proper heading hierarchy)

### JavaScript

- Smooth scroll for anchor links
- Mobile menu toggle (hamburger menu)
- **Form Handling**:
  - Form validation (required fields, email format, phone format)
  - Conditional field display based on selections (e.g., show farmer-specific fields if "Black Farmer" selected)
  - Form data collection and formatting
  - Submit button handler to prepare data for email submission or API endpoint
  - Success/error message display
  - Option to generate PDF or formatted email body from form data

### Tailwind Configuration

- Use Tailwind via CDN: `https://cdn.tailwindcss.com`
- Custom colors matching brand (green, gold)
- Responsive breakpoints for mobile/tablet/desktop

### Spacing & Layout Guidelines

**Section Spacing**:

- Vertical padding: `py-12 md:py-16 lg:py-24` (48px mobile, 64px tablet, 96px desktop)
- Horizontal padding: `px-4 sm:px-6 lg:px-8` for content containers
- Max-width containers: `max-w-7xl mx-auto` for centered content

**Content Spacing**:

- Headings: `mb-4 md:mb-6` for h1, `mb-3 md:mb-4` for h2
- Paragraphs: `mb-6 md:mb-8` between paragraphs
- Cards: `gap-6 md:gap-8` in grid layouts, `mb-6 md:mb-8` when stacked

**Mobile Considerations**:

- Text sizes: `text-3xl md:text-4xl lg:text-5xl` for hero headlines
- Button sizes: `px-6 py-3 md:px-8 md:py-4` for primary CTAs
- Stack all columns on mobile, use `md:grid-cols-2` or `lg:grid-cols-4` for larger screens

**Form Design**:

- Form container: White or light background on dark green section, `max-w-4xl mx-auto`
- Section headers: `text-xl md:text-2xl font-bold mb-6` with divider lines
- Input fields: `w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20`
- Checkboxes/Radio: Custom styled with Tailwind, proper spacing between options
- Textareas: `min-h-[100px]` for longer responses
- Submit button: Lime green accent, `w-full md:w-auto px-8 py-4 text-lg font-semibold`
- Form sections: `mb-8 md:mb-12` spacing between sections
- Progress indicator: Optional step indicator for multi-section form
- Conditional fields: Smooth show/hide with Tailwind transitions

## Content Integration

- **Primary Copy**: Use the provided main copy as the core narrative:
  - Hero: "Join the Legacy 300" with tagline "Build Ownership. Secure Markets. Feed Our People. Create Generational Wealth."
  - Problem statement about Black farmers and economic drain
  - "This Is Not a Program. This Is an Economic System."
  - What It Means to Join LRAC (4 benefits)
  - Call to Action for 300 founding members
  - Closing: "This is our moment to move from survival to sovereignty."
- **Supporting Content**: Integrate as secondary sections:
  - 1 Million Food Box Campaign details (mentioned in CTA)
  - Donation/sponsorship tiers ($35-$5,000) - link to saveblackfarmers.com
  - Legacy Taste of the Garden app showcase with Google Play link
  - Food Is Medicine messaging (can be woven into campaign section)
- **Links**: saveblackfarmers.com, Google Play app, and any provided email/contact info

## Assets Needed

- Legacy 300 logo (from provided images - the golden/green 3D logo)
- App screenshots (from App Store image)
- Optional: Additional hero images, farmer/community photos

## Responsive Breakpoints

- Mobile: < 640px (stacked layout, full-width sections)
- Tablet: 640px - 1024px (2-column layouts where appropriate)
- Desktop: > 1024px (multi-column, wider spacing)

## Design Quality Checklist

**Before finalizing, ensure**:

- ✅ Clean, uncluttered layouts with generous whitespace
- ✅ Proper spacing between sections (py-12 to py-24)
- ✅ Beautiful typography hierarchy (large headlines, readable body text)
- ✅ Consistent color usage (dark green backgrounds, white text, lime green accents)
- ✅ Mobile-friendly responsive design (test on actual devices)
- ✅ Intuitive navigation and clear CTAs
- ✅ Smooth, polished interactions (hover states, transitions)
- ✅ Not overcomplicated - simplicity over complexity

## Next Steps After Implementation

1. Test on multiple devices/browsers
2. Add analytics tracking (if needed)
3. Set up form handling for donations/membership
4. Optimize images for web
5. Add meta tags for SEO and social sharing