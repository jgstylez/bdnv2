import { MaterialIcons } from "@expo/vector-icons";

export interface UserMenuItem {
  label: string;
  href: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  divider?: boolean;
}

/**
 * User Menu Configuration
 * Single source of truth for user menu items displayed in:
 * - Avatar dropdown menu (header)
 * - Account page menu
 */
export const userMenuItems: UserMenuItem[] = [
  { label: "Edit Profile", href: "/pages/profile", icon: "edit" },
  { label: "Wallet", href: "/(tabs)/pay", icon: "account-balance-wallet" },
  { label: "Inbox", href: "/pages/messages", icon: "inbox" },
  { label: "Invoices", href: "/pages/invoices", icon: "receipt" },
  { label: "Bookings", href: "/pages/my-bookings", icon: "event-note" },
  { label: "Notifications", href: "/pages/notifications", icon: "notifications" },
  { label: "Transaction History", href: "/pages/transactions", icon: "receipt" },
  { label: "Invite", href: "/pages/referrals", icon: "people", divider: true },
  { label: "Manage Account", href: "/pages/account/manage", icon: "settings" },
  { label: "About & Legal", href: "/pages/account/about-legal", icon: "info", divider: true },
  { label: "Support", href: "/pages/support", icon: "support-agent" },
  { label: "Sign Out", href: "/(auth)/login", icon: "logout", divider: true },
];

