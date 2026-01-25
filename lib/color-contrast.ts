/**
 * Color Contrast Utilities
 * 
 * Utilities for verifying WCAG AA (4.5:1) and AAA (7:1) contrast ratios
 * for text accessibility compliance.
 */

/**
 * Converts hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Converts rgba string to RGB with alpha
 */
function rgbaToRgb(
  rgba: string,
  backgroundColor: { r: number; g: number; b: number }
): { r: number; g: number; b: number } {
  const match = rgba.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
  );
  if (!match) {
    throw new Error(`Invalid rgba format: ${rgba}`);
  }

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  const alpha = match[4] ? parseFloat(match[4]) : 1;

  // Blend with background color
  return {
    r: Math.round(r * alpha + backgroundColor.r * (1 - alpha)),
    g: Math.round(g * alpha + backgroundColor.g * (1 - alpha)),
    b: Math.round(b * alpha + backgroundColor.b * (1 - alpha)),
  };
}

/**
 * Calculates relative luminance according to WCAG 2.1
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculates contrast ratio between two colors
 */
function getContrastRatio(
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number }
): number {
  const lum1 = getLuminance(color1.r, color1.g, color1.b);
  const lum2 = getLuminance(color2.r, color2.g, color2.b);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Verifies contrast ratio for a text color against a background
 */
export function verifyContrast(
  textColor: string,
  backgroundColor: string,
  level: "AA" | "AAA" = "AA"
): {
  ratio: number;
  passes: boolean;
  level: "AA" | "AAA";
  requiredRatio: number;
} {
  const bgRgb = hexToRgb(backgroundColor);
  if (!bgRgb) {
    throw new Error(`Invalid background color: ${backgroundColor}`);
  }

  let textRgb: { r: number; g: number; b: number };

  if (textColor.startsWith("rgba") || textColor.startsWith("rgb")) {
    textRgb = rgbaToRgb(textColor, bgRgb);
  } else {
    const rgb = hexToRgb(textColor);
    if (!rgb) {
      throw new Error(`Invalid text color: ${textColor}`);
    }
    textRgb = rgb;
  }

  const ratio = getContrastRatio(textRgb, bgRgb);
  const requiredRatio = level === "AA" ? 4.5 : 7;

  return {
    ratio: Math.round(ratio * 100) / 100,
    passes: ratio >= requiredRatio,
    level,
    requiredRatio,
  };
}

/**
 * Common color combinations used in the app
 */
export const colorContrastChecks = [
  // Primary text on dark background
  { text: "#ffffff", background: "#232323", label: "White text on dark background" },
  { text: "#ffffff", background: "#474747", label: "White text on secondary background" },
  
  // Secondary text (with opacity)
  { text: "rgba(255, 255, 255, 0.7)", background: "#232323", label: "70% white text on dark" },
  { text: "rgba(255, 255, 255, 0.6)", background: "#232323", label: "60% white text on dark" },
  { text: "rgba(255, 255, 255, 0.5)", background: "#232323", label: "50% white text on dark" },
  
  // Accent colors
  { text: "#ba9988", background: "#232323", label: "Accent text on dark" },
  { text: "#ffffff", background: "#ba9988", label: "White text on accent" },
  
  // Status colors
  { text: "#9ce0a4", background: "#232323", label: "Success text on dark" },
  { text: "#ff9b9b", background: "#232323", label: "Error text on dark" },
  { text: "#ffbf82", background: "#232323", label: "Warning text on dark" },
  { text: "#92d0ff", background: "#232323", label: "Info text on dark" },
];

/**
 * Runs all color contrast checks and returns results
 */
export function runContrastChecks(): Array<{
  label: string;
  text: string;
  background: string;
  result: ReturnType<typeof verifyContrast>;
}> {
  return colorContrastChecks.map((check) => ({
    ...check,
    result: verifyContrast(check.text, check.background),
  }));
}

/**
 * Prints contrast check results to console (for development)
 */
export function logContrastResults(): void {
  const results = runContrastChecks();
  console.log("\n=== Color Contrast Verification ===\n");
  
  results.forEach(({ label, text, background, result }) => {
    const status = result.passes ? "✅ PASS" : "❌ FAIL";
    console.log(`${status} ${label}`);
    console.log(`   Text: ${text}, Background: ${background}`);
    console.log(`   Ratio: ${result.ratio}:1 (Required: ${result.requiredRatio}:1 for WCAG ${result.level})\n`);
  });
  
  const passed = results.filter((r) => r.result.passes).length;
  const total = results.length;
  console.log(`\nSummary: ${passed}/${total} checks passed\n`);
}
