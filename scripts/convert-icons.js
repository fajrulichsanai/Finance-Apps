/**
 * Convert SVG icons to PNG
 * Requires: npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../public/icons');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function convertToPNG() {
  console.log('🔄 Converting SVG to PNG...\n');
  
  for (const size of sizes) {
    const svgPath = path.join(iconsDir, `icon-${size}.svg`);
    const pngPath = path.join(iconsDir, `icon-${size}.png`);
    
    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(pngPath);
      
      console.log(`✅ Converted: icon-${size}.png`);
      
      // Remove SVG file after conversion
      fs.unlinkSync(svgPath);
    } catch (error) {
      console.error(`❌ Error converting icon-${size}.svg:`, error.message);
    }
  }
  
  console.log('\n✨ All icons converted to PNG!');
}

convertToPNG();
