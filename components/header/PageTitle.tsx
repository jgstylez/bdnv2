import React from "react";
import { View, Text } from "react-native";
import { usePathname } from "expo-router";
import { typography, colors } from "../../constants/theme";

/**
 * PageTitle Component
 * Extracts the page title logic from AppHeader
 */
export const PageTitle: React.FC = () => {
  const pathname = usePathname();

  const getPageTitle = () => {
    // Tab pages
    if (pathname?.includes("dashboard")) return "Dashboard";
    if (pathname?.includes("pay")) return "Pay";
    if (pathname?.includes("account")) {
      if (pathname?.includes("referrals")) return "Invite";
      return "Profile";
    }
    
    // Business pages
    if (pathname?.includes("businesses")) {
      const businessIdMatch = pathname?.match(/\/businesses\/([^\/]+)/);
      if (businessIdMatch) return "Business Details";
      return "Business Directory";
    }
    
    // Pages directory routes
    if (pathname?.includes("/pages/referrals")) return "Invite";
    if (pathname?.includes("/pages/tokens")) return "BDN Tokens";
    if (pathname?.includes("/pages/search")) {
      if (pathname?.includes("/search/results")) return "Search Results";
      if (pathname?.includes("/search/location")) return "Find Nearby Merchants";
      return "Search";
    }
    if (pathname?.includes("/pages/myimpact")) {
      if (pathname?.includes("/myimpact/points")) return "Impact Points";
      if (pathname?.includes("/myimpact/cashback")) return "Cashback";
      if (pathname?.includes("/myimpact/sponsorship")) return "Sponsorship Rewards";
      if (pathname?.includes("/myimpact/donations")) return "Donations";
      if (pathname?.includes("/myimpact/leaderboard")) return "Leaderboard";
      if (pathname?.includes("/myimpact/badges")) return "Badges";
      return "MyImpact";
    }
    if (pathname?.includes("/pages/university")) {
      if (pathname?.includes("/university/guides")) return "Step-by-Step Guides";
      if (pathname?.includes("/university/videos")) return "Video Tutorials";
      if (pathname?.includes("/university/help")) return "Help Center";
      if (pathname?.includes("/university/blog")) return "Blog & Updates";
      return "BDN University";
    }
    if (pathname?.includes("/pages/media")) {
      if (pathname?.includes("/media/bdn-tv")) return "BDN TV";
      if (pathname?.includes("/media/channels")) return "Media Channels";
      if (pathname?.includes("/media/blog")) return "Blog";
      return "Media & Content";
    }
    if (pathname?.includes("/pages/merchant")) {
      if (pathname?.includes("/merchant/dashboard")) return "Merchant Dashboard";
      if (pathname?.includes("/merchant/onboarding")) return "Business Onboarding";
      if (pathname?.includes("/merchant/products")) return "Product Management";
      if (pathname?.includes("/merchant/analytics")) return "Merchant Analytics";
      if (pathname?.includes("/merchant/qrcode")) return "QR Code";
      if (pathname?.includes("/merchant/menu")) return "Menu Management";
      return "Merchant Platform";
    }
    if (pathname?.includes("/pages/notifications")) {
      if (pathname?.includes("/notifications/settings")) return "Notification Settings";
      return "Notifications";
    }
    if (pathname?.includes("/pages/nonprofit")) {
      if (pathname?.includes("/nonprofit/dashboard")) return "Organization Dashboard";
      if (pathname?.includes("/nonprofit/campaigns")) return "Campaigns";
      if (pathname?.includes("/nonprofit/account")) return "Organization Account";
      if (pathname?.includes("/nonprofit/donations")) return "Donations";
      if (pathname?.includes("/nonprofit/settings")) return "Organization Settings";
      if (pathname?.includes("/nonprofit/onboarding")) return "Organization Onboarding";
      return "Nonprofit";
    }
    if (pathname?.includes("/pages/pay-it-forward")) {
      return "Pay It Forward";
    }
    if (pathname?.includes("/pages/events")) {
      if (pathname?.includes("/events/tickets")) return "My Tickets";
      if (pathname?.includes("/events/create")) return "Create Event";
      if (pathname?.includes("/events/my-events")) return "My Events";
      if (pathname?.match(/\/events\/[^\/]+$/)) return "Event Details";
      return "Events";
    }
    if (pathname?.includes("/pages/transactions")) {
      return "Transaction History";
    }
    if (pathname?.includes("/pages/bdn-plus")) {
      return "BDN+";
    }
    if (pathname?.includes("/pages/profile")) {
      return "Profile Details";
    }
    if (pathname?.includes("/pages/support")) {
      return "Support";
    }
    if (pathname?.includes("/pages/messages")) {
      const messageIdMatch = pathname?.match(/\/messages\/([^\/]+)/);
      if (messageIdMatch) return "Conversation";
      return "Messages";
    }
    
    return "BDN";
  };

  return (
    <View style={{ flexShrink: 0 }}>
      <Text
        style={{
          fontSize: typography.fontSize["2xl"],
          fontWeight: typography.fontWeight.bold,
          color: colors.text.primary,
        }}
      >
        {getPageTitle()}
      </Text>
    </View>
  );
};


