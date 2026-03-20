const { getContrastRatio, meetsWCAG } = require('./lib/color-contrast.ts');

console.log('🎨 SSS Color Contrast Testing\n');

const colors = {
  bg: '#0a0a0c',
  text: '#d4d0c8', 
  muted: '#5a5550',
  red: '#c9362c',
  textInverse: '#050505'
};

console.log('Testing key color combinations:\n');

// Main text on background
const textBgRatio = getContrastRatio(colors.text, colors.bg);
console.log(`Text on Background: ${textBgRatio.toFixed(2)}:1 - ${textBgRatio >= 4.5 ? 'PASS' : 'FAIL'} WCAG AA`);

// Muted text on background  
const mutedBgRatio = getContrastRatio(colors.muted, colors.bg);
console.log(`Muted on Background: ${mutedBgRatio.toFixed(2)}:1 - ${mutedBgRatio >= 4.5 ? 'PASS' : 'FAIL'} WCAG AA`);

// Red button text
const redButtonRatio = getContrastRatio(colors.textInverse, colors.red);
console.log(`Red Button Text: ${redButtonRatio.toFixed(2)}:1 - ${redButtonRatio >= 4.5 ? 'PASS' : 'FAIL'} WCAG AA`);

// White text on red (alternative)
const whiteOnRedRatio = getContrastRatio('#ffffff', colors.red);
console.log(`White on Red: ${whiteOnRedRatio.toFixed(2)}:1 - ${whiteOnRedRatio >= 4.5 ? 'PASS' : 'FAIL'} WCAG AA`);

console.log('\nRecommendations:');
if (mutedBgRatio < 4.5) {
  console.log('⚠️  Muted text contrast is low - consider making muted color lighter');
}
if (redButtonRatio < 4.5) {
  console.log('⚠️  Red button text contrast may be low - verify with exact colors');
}