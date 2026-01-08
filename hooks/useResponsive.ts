import { useWindowDimensions } from 'react-native';
import { getScrollViewBottomPadding } from '../constants/layout';

export const useResponsive = () => {
  const { width } = useWindowDimensions();
  
  // Breakpoints
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  
  // Layout values
  const paddingHorizontal = isMobile ? 20 : isTablet ? 32 : 40;
  const maxContentWidth = 1200;
  const scrollViewBottomPadding = getScrollViewBottomPadding(isMobile);
  
  return {
    width,
    isMobile,
    isTablet,
    isDesktop,
    paddingHorizontal,
    maxContentWidth,
    scrollViewBottomPadding,
    contentContainerStyle: {
      paddingHorizontal,
      maxWidth: maxContentWidth,
      width: '100%',
      alignSelf: 'center' as const,
    }
  };
};
