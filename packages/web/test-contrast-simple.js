// Simple color contrast testing

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16), 
    b: parseInt(result[3], 16)
  } : null;
}

function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  const l1 = relativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = relativeLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

console.log('🎨 SSS Color Contrast Testing\n');

const colors = {
  bg: '#0a0a0c',
  text: '#d4d0c8', 
  muted: '#9a8f7f',
  red: '#c9362c',
  textInverse: '#ffffff'
};

console.log('Testing key color combinations:\n');

const textBgRatio = getContrastRatio(colors.text, colors.bg);
console.log(`Text on Background: ${textBgRatio.toFixed(2)}:1 - ${textBgRatio >= 4.5 ? 'PASS' : 'FAIL'} WCAG AA`);

const mutedBgRatio = getContrastRatio(colors.muted, colors.bg);
console.log(`Muted on Background: ${mutedBgRatio.toFixed(2)}:1 - ${mutedBgRatio >= 4.5 ? 'PASS' : 'FAIL'} WCAG AA`);

const redButtonRatio = getContrastRatio(colors.textInverse, colors.red);
console.log(`Red Button Text: ${redButtonRatio.toFixed(2)}:1 - ${redButtonRatio >= 4.5 ? 'PASS' : 'FAIL'} WCAG AA`);

const whiteOnRedRatio = getContrastRatio('#ffffff', colors.red);
console.log(`White on Red: ${whiteOnRedRatio.toFixed(2)}:1 - ${whiteOnRedRatio >= 4.5 ? 'PASS' : 'FAIL'} WCAG AA`);

console.log('\nRecommendations:');
if (mutedBgRatio < 4.5) {
  console.log('⚠️  Muted text contrast is low - consider making muted color lighter');
}
if (redButtonRatio < 4.5) {
  console.log('⚠️  Red button text contrast may be low');
}

console.log(`\nFor Large Text (18pt+ or 14pt+ bold), minimum ratio is 3:1`);
console.log(`Muted text for large: ${mutedBgRatio >= 3.0 ? 'PASS' : 'FAIL'}`);