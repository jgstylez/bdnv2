import { useState } from 'react';
import { mockCampaignsList as mockCampaigns } from '../data/mocks/campaigns';

export const useCampaigns = () => {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    if (filter === "all") return true;
    return campaign.status === filter;
  });

  const getProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return {
    filter,
    setFilter,
    filteredCampaigns,
    getProgress,
  };
};