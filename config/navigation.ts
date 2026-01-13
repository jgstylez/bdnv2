import { MaterialIcons } from "@expo/vector-icons";

export interface NavItem {
  label: string;
  href: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

export interface NavGroup {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  items: NavItem[];
}

export const navigationMenu: NavGroup[] = [
  {
    label: "Main",
    icon: "dashboard",
    items: [
      { label: "Home", href: "/(tabs)/dashboard", icon: "dashboard" },
      {
        label: "Directory",
        href: "/pages/businesses/businesses",
        icon: "store",
      },
      {
        label: "Marketplace",
        href: "/(tabs)/marketplace",
        icon: "shopping-bag",
      },
      { label: "Search", href: "/pages/search", icon: "search" },
    ],
  },
  {
    label: "MyImpact",
    icon: "stars",
    items: [
      { label: "Overview", href: "/pages/myimpact", icon: "dashboard" },
      {
        label: "Leaderboard",
        href: "/pages/myimpact/leaderboard",
        icon: "emoji-events",
      },
      { label: "Impact Points", href: "/pages/myimpact/points", icon: "star" },
      {
        label: "Cashback",
        href: "/pages/myimpact/cashback",
        icon: "attach-money",
      },
      {
        label: "Sponsorship",
        href: "/pages/myimpact/sponsorship",
        icon: "people",
      },
      {
        label: "Donations",
        href: "/pages/myimpact/donations",
        icon: "favorite",
      },
      {
        label: "BDN Tokens",
        href: "/pages/tokens?tab=manage",
        icon: "account-balance-wallet",
      },
      {
        label: "Badges",
        href: "/pages/myimpact/badges",
        icon: "workspace-premium",
      },
    ],
  },
  {
    label: "Business",
    icon: "store",
    items: [
      {
        label: "Dashboard",
        href: "/pages/merchant/dashboard",
        icon: "dashboard",
      },
      {
        label: "Products",
        href: "/pages/merchant/products",
        icon: "inventory",
      },
      {
        label: "Orders",
        href: "/pages/merchant/orders",
        icon: "shopping-cart",
      },
      {
        label: "Bookings",
        href: "/pages/merchant/bookings",
        icon: "event-note",
      },
      {
        label: "Subscriptions",
        href: "/pages/merchant/subscriptions",
        icon: "subscriptions",
      },
      {
        label: "Menu",
        href: "/pages/merchant/menu",
        icon: "restaurant-menu",
      },
      {
        label: "Analytics",
        href: "/pages/merchant/analytics",
        icon: "analytics",
      },
      {
        label: "Invoices",
        href: "/pages/merchant/invoices",
        icon: "receipt",
      },
      { label: "QR Code", href: "/pages/merchant/qrcode", icon: "qr-code" },
      {
        label: "Account",
        href: "/pages/merchant/account",
        icon: "account-balance",
      },
      {
        label: "Settings",
        href: "/pages/merchant/settings",
        icon: "settings",
      },
      {
        label: "Enroll New Business",
        href: "/pages/merchant/verify-black-owned",
        icon: "add-business",
      },
    ],
  },
  {
    label: "Nonprofit",
    icon: "handshake",
    items: [
      {
        label: "Dashboard",
        href: "/pages/nonprofit/dashboard",
        icon: "dashboard",
      },
      {
        label: "Campaigns",
        href: "/pages/nonprofit/campaigns",
        icon: "campaign",
      },
      {
        label: "Account",
        href: "/pages/nonprofit/account",
        icon: "account-balance",
      },
      {
        label: "Donations",
        href: "/pages/nonprofit/donations",
        icon: "favorite",
      },
      {
        label: "Products",
        href: "/pages/nonprofit/products",
        icon: "inventory",
      },
      {
        label: "Orders",
        href: "/pages/nonprofit/orders",
        icon: "shopping-cart",
      },
      {
        label: "Bookings",
        href: "/pages/nonprofit/bookings",
        icon: "event-note",
      },
      {
        label: "Invoices",
        href: "/pages/nonprofit/invoices",
        icon: "receipt",
      },
      {
        label: "QR Code",
        href: "/pages/nonprofit/qrcode",
        icon: "qr-code",
      },
      {
        label: "Pay It Forward",
        href: "/pages/pay-it-forward",
        icon: "favorite",
      },
      {
        label: "Settings",
        href: "/pages/nonprofit/settings",
        icon: "settings",
      },
      {
        label: "Enroll New Nonprofit",
        href: "/pages/nonprofit/onboarding",
        icon: "add-business",
      },
    ],
  },
  {
    label: "Events",
    icon: "event",
    items: [
      { label: "Browse Events", href: "/pages/events", icon: "event" },
      { label: "My Tickets", href: "/pages/events/tickets", icon: "confirmation-number" },
      { label: "My Events", href: "/pages/events/my-events", icon: "event-available" },
      { label: "Create New Event", href: "/pages/events/create", icon: "add-circle" },
    ],
  },
  {
    label: "Media",
    icon: "video-library",
    items: [
      { label: "Overview", href: "/pages/media", icon: "dashboard" },
      { label: "BDN TV", href: "/pages/media/bdn-tv", icon: "tv" },
      { label: "Blog", href: "/pages/university/blog", icon: "article" },
      {
        label: "Channels",
        href: "/pages/media/channels",
        icon: "subscriptions",
      },
    ],
  },
  {
    label: "BDN University",
    icon: "school",
    items: [
      { label: "Overview", href: "/pages/university", icon: "dashboard" },
      { label: "Guides", href: "/pages/university/guides", icon: "menu-book" },
      {
        label: "Videos",
        href: "/pages/university/videos",
        icon: "play-circle",
      },
      { label: "Help Center", href: "/pages/university/help", icon: "help" },
      { label: "Support", href: "/pages/support", icon: "support-agent" },
    ],
  },
  {
    label: "Premium",
    icon: "workspace-premium",
    items: [
      { label: "BDN+", href: "/pages/bdn-plus", icon: "workspace-premium" },
      // BDN+ Business will be conditionally shown in the page itself
    ],
  },
];

