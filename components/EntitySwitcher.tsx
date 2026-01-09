/**
 * Unified Entity Switcher Component
 * 
 * Wraps BusinessSwitcher and NonprofitSwitcher based on entityType
 * Provides consistent interface for entity selection
 */

import React from "react";
import { BusinessSwitcher } from "./BusinessSwitcher";
import { NonprofitSwitcher } from "./NonprofitSwitcher";

interface EntitySwitcherProps {
  entityType: "business" | "nonprofit";
}

export function EntitySwitcher({ entityType }: EntitySwitcherProps) {
  if (entityType === "business") {
    return <BusinessSwitcher />;
  }
  
  return <NonprofitSwitcher />;
}
