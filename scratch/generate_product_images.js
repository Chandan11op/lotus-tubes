import fs from 'fs';
import path from 'path';

// Load PRODUCTS
import { PRODUCTS } from '../client/src/data/siteData.js';

const publicDir = path.resolve('client/public');

function generateBoreDetailSVG(product) {
  const safeName = product.name.replace(/"/g, '&quot;');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450" role="img" aria-label="${safeName} - Bore Detail">
  <defs>
    <linearGradient id="boreBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#EEF2F6"/>
    </linearGradient>
    <linearGradient id="boreMetal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#475569"/>
      <stop offset="30%" stop-color="#94A3B8"/>
      <stop offset="60%" stop-color="#FFFFFF"/>
      <stop offset="85%" stop-color="#CBD5E1"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
  </defs>
  <rect width="600" height="450" fill="url(#boreBg)"/>
  
  <!-- Magnified Bore Inspection Ring -->
  <circle cx="300" cy="190" r="130" fill="url(#boreMetal)" stroke="#10263D" stroke-width="4"/>
  <circle cx="300" cy="190" r="95" fill="#0F172A" stroke="#0284C7" stroke-width="2"/>
  
  <!-- Optical Bore Specular Reflection -->
  <ellipse cx="300" cy="190" rx="90" ry="20" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.8"/>
  <line x1="210" y1="190" x2="390" y2="190" stroke="#38BDF8" stroke-dasharray="4 4" stroke-width="1.5"/>

  <!-- Inspection Target Overlay -->
  <circle cx="300" cy="190" r="4" fill="#F00078"/>
  <circle cx="300" cy="190" r="40" fill="none" stroke="#F00078" stroke-width="1" stroke-dasharray="3 3"/>

  <!-- Info Box -->
  <rect x="50" y="350" width="500" height="75" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
  <text x="70" y="378" font-family="sans-serif" font-size="14" font-weight="bold" fill="#10263D">${safeName} - Internal Bore Finish</text>
  <text x="70" y="402" font-family="sans-serif" font-size="12" fill="#0284C7" font-weight="600">Roughness: ${product.roughness || 'Ra ≤ 0.38 µm (EP Finish)'}</text>
  <text x="360" y="402" font-family="sans-serif" font-size="12" fill="#64748B">Standard: ${product.standard}</text>
</svg>`;
}

function generatePackDetailSVG(product) {
  const safeName = product.name.replace(/"/g, '&quot;');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450" role="img" aria-label="${safeName} - Cleanroom Packaging">
  <defs>
    <linearGradient id="packBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F0F9FF"/>
      <stop offset="100%" stop-color="#E0F2FE"/>
    </linearGradient>
    <linearGradient id="polyGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#E2E8F0" stop-opacity="0.6"/>
    </linearGradient>
  </defs>
  <rect width="600" height="450" fill="url(#packBg)"/>

  <!-- Cleanroom Poly Bag Sleeve -->
  <rect x="100" y="90" width="400" height="220" rx="14" fill="url(#polyGrad)" stroke="#0284C7" stroke-width="2"/>
  
  <!-- Component inside sleeve (silhouette) -->
  <rect x="130" y="145" width="340" height="110" rx="8" fill="#94A3B8" opacity="0.65"/>
  
  <!-- Heat-Sealed Edge Pattern -->
  <line x1="100" y1="110" x2="500" y2="110" stroke="#0284C7" stroke-width="3" stroke-dasharray="2 3"/>
  <line x1="100" y1="290" x2="500" y2="290" stroke="#0284C7" stroke-width="3" stroke-dasharray="2 3"/>

  <!-- Official Lotus Tubes Quality Pass Tag -->
  <rect x="220" y="130" width="160" height="140" rx="6" fill="#FFFFFF" stroke="#10263D" stroke-width="1.5"/>
  <rect x="220" y="130" width="160" height="28" fill="#10263D"/>
  <text x="300" y="149" font-family="sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">LOTUS TUBES QC PASS</text>
  <text x="235" y="178" font-family="sans-serif" font-size="9" font-weight="bold" fill="#334155">HEAT NO: LT-HT-${Math.floor(10000 + Math.random()*90000)}</text>
  <text x="235" y="196" font-family="sans-serif" font-size="9" fill="#334155">GRADE: ${product.material}</text>
  <text x="235" y="214" font-family="sans-serif" font-size="9" fill="#334155">MTC: EN 10204 3.1</text>
  <text x="235" y="232" font-family="sans-serif" font-size="9" fill="#0284C7" font-weight="bold">INSPECTED: 100%</text>
  <text x="235" y="250" font-family="sans-serif" font-size="8" fill="#64748B">PACKED IN CLEANROOM</text>

  <!-- Info Box -->
  <rect x="50" y="350" width="500" height="75" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
  <text x="70" y="378" font-family="sans-serif" font-size="14" font-weight="bold" fill="#10263D">${safeName} - Sealed Cleanroom Packaging</text>
  <text x="70" y="402" font-family="sans-serif" font-size="12" fill="#10B981" font-weight="600">✓ Capped Ends &amp; Nitrogen Purge Compatible</text>
  <text x="370" y="402" font-family="sans-serif" font-size="12" fill="#64748B">MTC Included in Box</text>
</svg>`;
}

const targetDir = path.join(publicDir, 'assets/images/products/details');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

let count = 0;
for (const prod of PRODUCTS) {
  const boreSvg = generateBoreDetailSVG(prod);
  const packSvg = generatePackDetailSVG(prod);
  
  const borePath = path.join(targetDir, `${prod.slug}-bore.svg`);
  const packPath = path.join(targetDir, `${prod.slug}-pack.svg`);

  fs.writeFileSync(borePath, boreSvg);
  fs.writeFileSync(packPath, packSvg);
  count += 2;
}

console.log(`Successfully generated ${count} product detail inspection SVGs in ${targetDir}`);
