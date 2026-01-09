import React from "react";
import Svg, {
  Rect,
  Path,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Pattern,
} from "react-native-svg";

interface TokenCertificateProps {
  totalTokens: number;
  width?: number;
  height?: number;
  isLarge?: boolean;
}

export function TokenCertificate({ totalTokens, width = 200, height = 140, isLarge = false }: TokenCertificateProps) {
  const fontSize = isLarge ? 12 : 9;
  const titleSize = isLarge ? 16 : 11;
  const tokenNumberSize = isLarge ? 44 : 22;
  const tokenLabelSize = isLarge ? 14 : 10;
  const headerSize = isLarge ? 10 : 8;

  return (
    <Svg width={width} height={height} viewBox="0 0 200 140" accessible={true} accessibilityLabel={`Certificate showing ${totalTokens} tokens`}>
      <Defs>
        {/* Background + accents */}
        <LinearGradient id="certBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#2A2A2A" stopOpacity="1" />
          <Stop offset="55%" stopColor="#232323" stopOpacity="1" />
          <Stop offset="100%" stopColor="#1E1E1E" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="certGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#ba9988" stopOpacity="0.28" />
          <Stop offset="50%" stopColor="#ba9988" stopOpacity="0.08" />
          <Stop offset="100%" stopColor="#ba9988" stopOpacity="0.18" />
        </LinearGradient>
        <LinearGradient id="sealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#ba9988" stopOpacity="1" />
          <Stop offset="100%" stopColor="#8d6f62" stopOpacity="1" />
        </LinearGradient>

        {/* Subtle dot pattern overlay */}
        <Pattern id="dotPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <Circle cx="2" cy="2" r="0.7" fill="rgba(186, 153, 136, 0.14)" />
          <Circle cx="7" cy="6" r="0.6" fill="rgba(186, 153, 136, 0.10)" />
        </Pattern>
      </Defs>

      {/* Background */}
      <Rect width="200" height="140" rx="12" fill="url(#certBg)" />
      <Rect width="200" height="140" rx="12" fill="url(#certGlow)" opacity={0.55} />
      <Rect x="1.25" y="1.25" width="197.5" height="137.5" rx="11" fill="none" stroke="rgba(186, 153, 136, 0.85)" strokeWidth="1.5" />

      {/* Pattern overlay */}
      <Rect x="12" y="12" width="176" height="116" rx="10" fill="url(#dotPattern)" />

      {/* Inner frame */}
      <Rect x="10" y="10" width="180" height="120" rx="10" fill="none" stroke="rgba(255, 255, 255, 0.10)" strokeWidth="1" />
      <Rect x="12" y="12" width="176" height="116" rx="9" fill="none" stroke="rgba(186, 153, 136, 0.20)" strokeWidth="1" />

      {/* Corner accents */}
      <Path d="M18 26 L18 18 L26 18" stroke="rgba(186, 153, 136, 0.7)" strokeWidth="2" strokeLinecap="round" />
      <Path d="M182 26 L182 18 L174 18" stroke="rgba(186, 153, 136, 0.7)" strokeWidth="2" strokeLinecap="round" />
      <Path d="M18 114 L18 122 L26 122" stroke="rgba(186, 153, 136, 0.35)" strokeWidth="2" strokeLinecap="round" />
      <Path d="M182 114 L182 122 L174 122" stroke="rgba(186, 153, 136, 0.35)" strokeWidth="2" strokeLinecap="round" />

      {/* Header */}
      <SvgText
        x="18"
        y={isLarge ? 28 : 26}
        fontSize={headerSize}
        fontWeight="700"
        fill="rgba(255, 255, 255, 0.75)"
        letterSpacing={1.2}
      >
        BDN
      </SvgText>
      <SvgText
        x="182"
        y={isLarge ? 28 : 26}
        fontSize={headerSize}
        fontWeight="700"
        fill="rgba(255, 255, 255, 0.55)"
        letterSpacing={1.1}
        textAnchor="end"
      >
        TOKEN CERTIFICATE
      </SvgText>

      {/* Title */}
      <SvgText x="100" y={isLarge ? 56 : 50} fontSize={titleSize} fontWeight="800" fill="#ba9988" textAnchor="middle">
        Certificate of Holdings
      </SvgText>

      {/* Token amount (split to avoid overflow on small screens) */}
      <SvgText
        x="100"
        y={isLarge ? 92 : 78}
        fontSize={tokenNumberSize}
        fontWeight="900"
        fill="#ffffff"
        textAnchor="middle"
      >
        {totalTokens}
      </SvgText>
      <SvgText
        x="100"
        y={isLarge ? 112 : 96}
        fontSize={tokenLabelSize}
        fontWeight="800"
        fill="rgba(255, 255, 255, 0.78)"
        textAnchor="middle"
        letterSpacing={2}
      >
        TOKENS
      </SvgText>

      {/* Footer */}
      <Path d="M 24 104 L 176 104" stroke="rgba(255, 255, 255, 0.10)" strokeWidth="1" />
      <SvgText
        x="100"
        y={isLarge ? 118 : 118}
        fontSize={fontSize - 2}
        fill="rgba(255, 255, 255, 0.7)"
        textAnchor="middle"
      >
        {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </SvgText>

      {/* Watermark */}
      <SvgText x="100" y={isLarge ? 104 : 96} fontSize={isLarge ? 30 : 24} fontWeight="900" fill="rgba(186, 153, 136, 0.07)" textAnchor="middle" letterSpacing={2}>
        BDN
      </SvgText>

      {/* Seal */}
      <Circle cx="170" cy={isLarge ? 46 : 44} r={isLarge ? 13 : 12} fill="url(#sealGradient)" opacity={0.95} />
      <Circle cx="170" cy={isLarge ? 46 : 44} r={isLarge ? 10 : 9} fill="none" stroke="rgba(255, 255, 255, 0.55)" strokeWidth="1" />
      <SvgText x="170" y={isLarge ? 50 : 48} fontSize={isLarge ? 12 : 10} fill="#ffffff" textAnchor="middle" fontWeight="900">
        ✓
      </SvgText>
    </Svg>
  );
}

