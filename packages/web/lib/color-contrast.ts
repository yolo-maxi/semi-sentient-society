/**
 * Color contrast utilities for WCAG compliance
 */

// Convert hex to RGB
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

// Calculate relative luminance
function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    throw new Error("Invalid color format. Use hex colors (e.g., #ffffff)");
  }

  const l1 = relativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = relativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Check if contrast meets WCAG standards
export function meetsWCAG(
  foreground: string,
  background: string,
  level: "AA" | "AAA" = "AA",
  isLargeText = false
): boolean {
  const ratio = getContrastRatio(foreground, background);

  if (level === "AAA") {
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }

  // AA level
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

// SSS color palette with contrast checks
export const SSS_COLORS = {
  bg: "#0a0a0c",
  surface: "#0e0e10", 
  text: "#d4d0c8",
  muted: "#5a5550",
  red: "#c9362c",
  textInverse: "#050505",
} as const;

// Verify our color combinations meet WCAG AA
export const COLOR_COMPLIANCE = {
  textOnBg: meetsWCAG(SSS_COLORS.text, SSS_COLORS.bg),
  mutedOnBg: meetsWCAG(SSS_COLORS.muted, SSS_COLORS.bg),
  redButtonText: meetsWCAG(SSS_COLORS.textInverse, SSS_COLORS.red),
  textOnSurface: meetsWCAG(SSS_COLORS.text, SSS_COLORS.surface),
} as const;

// Helper to get safe color combinations
export function getSafeTextColor(background: string): string {
  const textContrast = getContrastRatio(SSS_COLORS.text, background);
  const inverseContrast = getContrastRatio(SSS_COLORS.textInverse, background);
  
  return textContrast >= 4.5 ? SSS_COLORS.text : SSS_COLORS.textInverse;
}

// Generate accessibility report for development
export function generateColorReport(): void {
  if (process.env.NODE_ENV !== "development") return;

  console.group("🎨 SSS Color Accessibility Report");
  
  Object.entries(COLOR_COMPLIANCE).forEach(([combo, passes]) => {
    const icon = passes ? "✅" : "❌";
    console.log(`${icon} ${combo}: ${passes ? "PASSES" : "FAILS"} WCAG AA`);
  });

  // Calculate actual ratios
  console.log("\n📊 Contrast Ratios:");
  console.log(`Text on Background: ${getContrastRatio(SSS_COLORS.text, SSS_COLORS.bg).toFixed(2)}:1`);
  console.log(`Muted on Background: ${getContrastRatio(SSS_COLORS.muted, SSS_COLORS.bg).toFixed(2)}:1`);
  console.log(`Red Button Text: ${getContrastRatio(SSS_COLORS.textInverse, SSS_COLORS.red).toFixed(2)}:1`);
  
  console.groupEnd();
}