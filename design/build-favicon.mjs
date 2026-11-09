import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';

// The Dex Freight logo is white + red. On a white tab/header the white parts
// disappear, so the favicon places it on a dark rounded app-icon background.
const sourcePath = 'public/favicon.svg';
const logoPath = 'public/logo.svg';

const source = readFileSync(sourcePath, 'utf8');
const inner = source.match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[1]?.trim();

if (!inner) {
  throw new Error('Could not extract the logo markup.');
}

copyFileSync(sourcePath, logoPath);

const size = 64;
const logoWidth = 48;
const scale = logoWidth / 931.97;
const logoHeight = 789.11 * scale;
const offsetX = (size - logoWidth) / 2;
const offsetY = (size - logoHeight) / 2;

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="14" fill="#18181B"/>
  <g transform="translate(${offsetX.toFixed(2)} ${offsetY.toFixed(2)}) scale(${scale.toFixed(5)})">
    ${inner}
  </g>
</svg>
`;

writeFileSync(sourcePath, favicon);
console.log(`Wrote public/favicon.svg (${logoWidth}x${logoHeight.toFixed(1)} logo on a ${size}x${size} dark tile)`);
console.log(`Original logo preserved at public/logo.svg`);
