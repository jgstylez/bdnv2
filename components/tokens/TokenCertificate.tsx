import React from "react";
import Svg, { Rect, Path, Text as SvgText, G, Defs, LinearGradient, Stop, Circle } from "react-native-svg";

interface TokenCertificateProps {
  totalTokens: number;
  width?: number;
  height?: number;
  isLarge?: boolean;
}

export function TokenCertificate({ totalTokens, width = 200, height = 140, isLarge = false }: TokenCertificateProps) {
  const fontSize = isLarge ? 16 : 10;
  const titleSize = isLarge ? 24 : 14;
  const tokenSize = isLarge ? 36 : 20;

  return (
    <Svg width={width} height={height} viewBox="0 0 200 140" accessible={true} accessibilityLabel={`Certificate showing ${totalTokens} tokens`}>
      <Defs>
        <LinearGradient id="certGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#ba9988" stopOpacity="0.2" />
          <Stop offset="100%" stopColor="#ba9988" stopOpacity="0.05" />
        </LinearGradient>
      </Defs>
      {/* Background */}
      <Rect width="200" height="140" rx="8" fill="url(#certGradient)" stroke="#ba9988" strokeWidth="2" />

      {/* Decorative border */}
      <Rect x="8" y="8" width="184" height="124" rx="4" fill="none" stroke="#ba9988" strokeWidth="1" strokeDasharray="4,4" />

      {/* Top decorative line */}
      <Path d="M 20 30 L 180 30" stroke="#ba9988" strokeWidth="2" />

      {/* Title */}
      <SvgText
        x="100"
        y={isLarge ? 50 : 35}
        fontSize={titleSize}
        fontWeight="bold"
        fill="#ba9988"
        textAnchor="middle"
      >
        Certificate of Token Holdings
      </SvgText>

      {/* Token amount */}
      <SvgText
        x="100"
        y={isLarge ? 85 : 60}
        fontSize={tokenSize}
        fontWeight="bold"
        fill="#ffffff"
        textAnchor="middle"
      >
        {totalTokens} Tokens
      </SvgText>

      {/* Date */}
      <SvgText
        x="100"
        y={isLarge ? 110 : 80}
        fontSize={fontSize - 2}
        fill="rgba(255, 255, 255, 0.7)"
        textAnchor="middle"
      >
        {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </SvgText>

      {/* Verified badge */}
      <Circle cx="180" cy="25" r="8" fill="#ba9988" />
      <SvgText x="180" y="29" fontSize="10" fill="#ffffff" textAnchor="middle" fontWeight="bold">✓</SvgText>
    </Svg>
  );
}

