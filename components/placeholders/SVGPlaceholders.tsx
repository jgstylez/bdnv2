import React from "react";
import Svg, { Rect, Circle, Path, Defs, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg";

// Article/Post Placeholder
export const ArticlePlaceholder = ({ width = 200, height = 120 }: { width?: number; height?: number }) => (
  <Svg width={width} height={height} viewBox="0 0 200 120">
    <Defs>
      <SvgLinearGradient id="articleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#ba9988" stopOpacity="0.2" />
        <Stop offset="100%" stopColor="#ba9988" stopOpacity="0.05" />
      </SvgLinearGradient>
    </Defs>
    <Rect width="200" height="120" fill="url(#articleGrad)" rx="8" />
    <Path
      d="M40 35 L160 35 M40 50 L160 50 M40 65 L120 65 M40 80 L140 80"
      stroke="#ba9988"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.4"
    />
    <Circle cx="170" cy="35" r="8" fill="#ba9988" opacity="0.3" />
  </Svg>
);

// Guide Placeholder
export const GuidePlaceholder = ({ width = 200, height = 120 }: { width?: number; height?: number }) => (
  <Svg width={width} height={height} viewBox="0 0 200 120">
    <Defs>
      <SvgLinearGradient id="guideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#ba9988" stopOpacity="0.2" />
        <Stop offset="100%" stopColor="#ba9988" stopOpacity="0.05" />
      </SvgLinearGradient>
    </Defs>
    <Rect width="200" height="120" fill="url(#guideGrad)" rx="8" />
    <Path
      d="M50 30 L150 30 L150 90 L50 90 Z"
      fill="none"
      stroke="#ba9988"
      strokeWidth="2"
      opacity="0.4"
    />
    <Path
      d="M60 45 L140 45 M60 60 L130 60 M60 75 L120 75"
      stroke="#ba9988"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.3"
    />
    <Circle cx="70" cy="30" r="4" fill="#ba9988" opacity="0.3" />
  </Svg>
);

// Report Placeholder
export const ReportPlaceholder = ({ width = 200, height = 120 }: { width?: number; height?: number }) => (
  <Svg width={width} height={height} viewBox="0 0 200 120">
    <Defs>
      <SvgLinearGradient id="reportGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#ba9988" stopOpacity="0.2" />
        <Stop offset="100%" stopColor="#ba9988" stopOpacity="0.05" />
      </SvgLinearGradient>
    </Defs>
    <Rect width="200" height="120" fill="url(#reportGrad)" rx="8" />
    <Rect x="50" y="30" width="100" height="60" fill="none" stroke="#ba9988" strokeWidth="2" opacity="0.4" />
    <Path
      d="M60 50 L140 50 M60 65 L130 65 M60 80 L120 80"
      stroke="#ba9988"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.3"
    />
    <Circle cx="55" cy="45" r="3" fill="#ba9988" opacity="0.3" />
    <Circle cx="55" cy="60" r="3" fill="#ba9988" opacity="0.3" />
    <Circle cx="55" cy="75" r="3" fill="#ba9988" opacity="0.3" />
  </Svg>
);

// Image Placeholder (generic)
export const ImagePlaceholder = ({ width = 200, height = 120 }: { width?: number; height?: number }) => (
  <Svg width={width} height={height} viewBox="0 0 200 120">
    <Defs>
      <SvgLinearGradient id="imageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#ba9988" stopOpacity="0.15" />
        <Stop offset="100%" stopColor="#ba9988" stopOpacity="0.05" />
      </SvgLinearGradient>
    </Defs>
    <Rect width="200" height="120" fill="url(#imageGrad)" rx="8" />
    <Circle cx="100" cy="50" r="20" fill="#ba9988" opacity="0.2" />
    <Path
      d="M70 80 L100 60 L130 80 L130 100 L70 100 Z"
      fill="#ba9988"
      opacity="0.15"
    />
    <Path
      d="M80 90 L100 75 L120 90"
      stroke="#ba9988"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.3"
    />
  </Svg>
);

// Mission/About Placeholder
export const MissionPlaceholder = ({ width = 400, height = 300 }: { width?: number; height?: number }) => (
  <Svg width={width} height={height} viewBox="0 0 400 300">
    <Defs>
      <SvgLinearGradient id="missionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#ba9988" stopOpacity="0.1" />
        <Stop offset="100%" stopColor="#ba9988" stopOpacity="0.03" />
      </SvgLinearGradient>
    </Defs>
    <Rect width="400" height="300" fill="url(#missionGrad)" rx="12" />
    <Circle cx="200" cy="100" r="40" fill="#ba9988" opacity="0.15" />
    <Path
      d="M150 180 L200 150 L250 180 L250 240 L150 240 Z"
      fill="#ba9988"
      opacity="0.1"
    />
    <Path
      d="M170 200 L200 180 L230 200"
      stroke="#ba9988"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.2"
    />
    <Circle cx="120" cy="80" r="15" fill="#ba9988" opacity="0.1" />
    <Circle cx="280" cy="80" r="15" fill="#ba9988" opacity="0.1" />
  </Svg>
);

// Decorative Background Pattern
export const DecorativePattern = ({ size = 120, opacity = 0.05 }: { size?: number; opacity?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 120 120">
    <Circle cx="60" cy="60" r="50" fill="#ba9988" opacity={opacity} />
    <Circle cx="60" cy="60" r="30" fill="none" stroke="#ba9988" strokeWidth="2" opacity={opacity * 2} />
  </Svg>
);

// Decorative Diamond Pattern
export const DiamondPattern = ({ size = 150, opacity = 0.08 }: { size?: number; opacity?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 150 150">
    <Path
      d="M75 20 L130 75 L75 130 L20 75 Z"
      fill="#ba9988"
      opacity={opacity}
    />
  </Svg>
);
