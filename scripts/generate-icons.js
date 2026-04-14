/**
 * PWA Icon Generator
 * 
 * Generates all required PWA icons from a single source
 * Run: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Create icons directory if not exists
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Generate SVG template for Finance App
const generateSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background with rounded corners -->
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>
  
  <!-- Dollar sign icon -->
  <g transform="translate(${size * 0.25}, ${size * 0.2})">
    <text 
      x="${size * 0.25}" 
      y="${size * 0.55}" 
      font-family="Arial, sans-serif" 
      font-size="${size * 0.6}" 
      font-weight="bold" 
      fill="white" 
      text-anchor="middle"
    >$</text>
  </g>
</svg>
`.trim();

// Generate all icon sizes
console.log('🎨 Generating PWA icons...\n');

sizes.forEach(size => {
  const svg = generateSVG(size);
  const filename = `icon-${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svg);
  console.log(`✅ Generated: ${filename}`);
});

console.log('\n📝 Note: SVG icons created. For production, convert to PNG:');
console.log('   1. Use online converter: https://cloudconvert.com/svg-to-png');
console.log('   2. Or install sharp: npm install sharp');
console.log('   3. Or use ImageMagick: convert icon-192.svg icon-192.png');
console.log('\n✨ PWA icons ready!');
