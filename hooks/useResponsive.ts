import { useWindowDimensions } from "react-native";
import { getScrollViewBottomPadding } from "../constants/layout";

export interface ResponsiveValues {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  paddingHorizontal: number;
  width: number;
  height: number;
  scrollViewBottomPadding: number;
}

/**
 * Custom hook for responsive design values
 * Replaces repeated responsive logic throughout the codebase
 * 
 * @returns Responsive values based on screen width
 * 
 * @example
 * ```tsx
 * const { isMobile, paddingHorizontal } = useResponsive();
 * 
 * <View style={{ paddingHorizontal }}>
 *   {isMobile ? <MobileView /> : <DesktopView />}
 * </View>
 * ```
 */
export const useResponsive = (): ResponsiveValues => {
  const { width, height } = useWindowDimensions();
  
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  const paddingHorizontal = isMobile ? 20 : 40;
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    paddingHorizontal,
    width,
    height,
    scrollViewBottomPadding: getScrollViewBottomPadding(isMobile),
  };
};

