import { existsSync, readFileSync, writeFileSync } from 'node:fs';

// The Dex Freight logo is white + red. On a white tab/header the white parts
// disappear, so the favicon places it on a dark rounded app-icon background
// with a subtle inner border so it is also visible on dark surfaces.
const faviconPath = 'public/favicon.svg';
const logoPath = 'public/logo.svg';

const rawSource = existsSync(logoPath) ? readFileSync(logoPath, 'utf8') : readFileSync(faviconPath, 'utf8');
const defsMatch = rawSource.match(/<defs>[\s\S]*?<\/svg>/);
if (!defsMatch) {
  throw new Error('Could not find the logo paths.');
}
const inner = defsMatch[0]
  .replace(/<\/g>\s*<\/svg>\s*$/, '')
  .replace(/<\/svg>\s*$/, '')
  .trim();

const originalLogo = `<svg id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 931.97 789.11">${inner}</svg>`;
writeFileSync(logoPath, originalLogo);

const size = 64;
const logoWidth = 48;
const scale = logoWidth / 931.97;
const logoHeight = 789.11 * scale;
const offsetX = (size - logoWidth) / 2;
const offsetY = (size - logoHeight) / 2;

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="14" fill="#18181B"/>
  <rect x="0.75" y="0.75" width="${size - 1.5}" height="${size - 1.5}" rx="13.25" fill="none" stroke="#ffffff" stroke-opacity="0.16" stroke-width="1.5"/>
  <g transform="translate(${offsetX.toFixed(2)} ${offsetY.toFixed(2)}) scale(${scale.toFixed(5)})">
    ${inner}
  </g>
</svg>
`;

writeFileSync(faviconPath, favicon);
console.log(`Wrote public/favicon.svg and public/logo.svg`);
