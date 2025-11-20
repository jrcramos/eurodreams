#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const png2icons = require('png2icons');

const inputFile = path.join(__dirname, '..', 'icon-512.png');
const outputDir = path.join(__dirname, '..', 'build');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read the PNG file
const input = fs.readFileSync(inputFile);

console.log('Generating icons from icon-512.png...');

// Generate ICO file for Windows
try {
  const icoOutput = png2icons.createICO(input, png2icons.BILINEAR, 0, false, true);
  const icoPath = path.join(outputDir, 'icon.ico');
  fs.writeFileSync(icoPath, icoOutput);
  console.log(`✓ Generated ${icoPath}`);
} catch (error) {
  console.error('Error generating ICO:', error);
}

// Generate ICNS file for macOS
try {
  const icnsOutput = png2icons.createICNS(input, png2icons.BILINEAR, 0);
  const icnsPath = path.join(outputDir, 'icon.icns');
  fs.writeFileSync(icnsPath, icnsOutput);
  console.log(`✓ Generated ${icnsPath}`);
} catch (error) {
  console.error('Error generating ICNS:', error);
}

// Copy PNG files to build directory for Linux
try {
  const png512Source = path.join(__dirname, '..', 'icon-512.png');
  const png512Dest = path.join(outputDir, 'icon.png');
  fs.copyFileSync(png512Source, png512Dest);
  console.log(`✓ Copied icon.png to build directory`);
} catch (error) {
  console.error('Error copying PNG:', error);
}

console.log('\nIcon generation complete!');
