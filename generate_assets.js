const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const assetsDir = path.join(rootDir, 'assets', 'images');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Common SVG template generator for technical industrial aesthetics
function generateSvg({
  width = 600,
  height = 450,
  title,
  subtext,
  specBadge,
  primaryColor = '#F00078',
  secondaryColor = '#10263D',
  graphicContent = ''
}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="50%" stop-color="#EEF2F6"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>

    <!-- Stainless Steel Polished Metallic Gradient -->
    <linearGradient id="ssGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#808E9B"/>
      <stop offset="18%" stop-color="#CBD5E1"/>
      <stop offset="45%" stop-color="#FFFFFF"/>
      <stop offset="68%" stop-color="#94A3B8"/>
      <stop offset="90%" stop-color="#CBD5E1"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>

    <!-- High Mirror Electro-Polished Sheen -->
    <linearGradient id="epGrad" x1="0%" y1="30%" x2="100%" y2="70%">
      <stop offset="0%" stop-color="#64748B"/>
      <stop offset="25%" stop-color="#E2E8F0"/>
      <stop offset="48%" stop-color="#FFFFFF"/>
      <stop offset="52%" stop-color="#FFFFFF"/>
      <stop offset="75%" stop-color="#94A3B8"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>

    <!-- Stainless Steel Dark Inner Shadow -->
    <linearGradient id="innerBore" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="70%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>

    <!-- Gold/Brass or Seal Gradient -->
    <linearGradient id="sealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCE7F1"/>
      <stop offset="50%" stop-color="#F472B6"/>
      <stop offset="100%" stop-color="#DB2777"/>
    </linearGradient>

    <!-- Drop Shadow Filter -->
    <filter id="softShadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#10263D" flood-opacity="0.14"/>
    </filter>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="${width}" height="${height}" fill="url(#cardBg)" rx="12"/>

  <!-- Subtle Engineering Grid Lines -->
  <g opacity="0.08" stroke="#10263D" stroke-width="1">
    <line x1="0" y1="75" x2="${width}" y2="75"/>
    <line x1="0" y1="150" x2="${width}" y2="150"/>
    <line x1="0" y1="225" x2="${width}" y2="225"/>
    <line x1="0" y1="300" x2="${width}" y2="300"/>
    <line x1="0" y1="375" x2="${width}" y2="375"/>
    <line x1="100" y1="0" x2="100" y2="${height}"/>
    <line x1="200" y1="0" x2="200" y2="${height}"/>
    <line x1="300" y1="0" x2="300" y2="${height}"/>
    <line x1="400" y1="0" x2="400" y2="${height}"/>
    <line x1="500" y1="0" x2="500" y2="${height}"/>
  </g>

  <!-- Background Ambient Brand Flare -->
  <circle cx="${width - 70}" cy="70" r="120" fill="${primaryColor}" opacity="0.04"/>

  <!-- Technical Spec Top Badge -->
  ${specBadge ? `
  <g transform="translate(24, 24)">
    <rect width="${specBadge.length * 8.5 + 24}" height="26" rx="13" fill="#10263D" opacity="0.9"/>
    <circle cx="12" cy="13" r="4" fill="${primaryColor}"/>
    <text x="24" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#FFFFFF" letter-spacing="0.5">${specBadge}</text>
  </g>` : ''}

  <!-- Graphic Centerpiece with soft shadow -->
  <g filter="url(#softShadow)">
    ${graphicContent}
  </g>

  <!-- Bottom Details Bar -->
  <g transform="translate(0, ${height - 68})">
    <rect width="${width}" height="68" fill="#FFFFFF" opacity="0.88"/>
    <line x1="0" y1="0" x2="${width}" y2="0" stroke="#E3E8EF" stroke-width="1"/>
    
    <!-- Brand Mark Indicator -->
    <rect x="24" y="24" width="4" height="20" rx="2" fill="${primaryColor}"/>
    
    <text x="36" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#10263D">
      ${title}
    </text>
    <text x="36" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="#667085">
      ${subtext || 'LOTUS TUBES • SANITARY STAINLESS STEEL SOLUTIONS'}
    </text>

    <!-- Verified Stamp Tag -->
    <g transform="translate(${width - 110}, 20)">
      <rect width="86" height="24" rx="4" fill="#F4F6F8" stroke="#E3E8EF"/>
      <text x="43" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" font-weight="700" fill="#F00078" text-anchor="middle">
        VERIFIED MTC
      </text>
    </g>
  </g>
</svg>`;
}

const imagesToCreate = [
  // 1. HERO IMAGE
  {
    filePath: path.join(assetsDir, 'hero', 'sanitary-hero-pipes.svg'),
    content: generateSvg({
      width: 720,
      height: 520,
      title: 'Hygienic Process Piping & Components',
      subtext: 'SS 316L Electro Polished Tubes, Bends, Tees, Clamps & Valves',
      specBadge: 'ASTM A270 • Ra ≤ 0.38 µm • SS 316L',
      graphicContent: `
        <!-- Main Polished Tube Bundle -->
        <g transform="translate(60, 90)">
          <!-- Tube 1 (Large back) -->
          <rect x="80" y="30" width="440" height="90" rx="12" fill="url(#epGrad)" stroke="#475569" stroke-width="1.5"/>
          <ellipse cx="80" cy="75" rx="24" ry="45" fill="url(#innerBore)"/>
          <ellipse cx="520" cy="75" rx="24" ry="45" fill="url(#ssGrad)"/>
          <line x1="90" y1="52" x2="510" y2="52" stroke="#FFFFFF" stroke-width="4" opacity="0.9"/>
          
          <!-- Tube 2 (Medium middle) -->
          <rect x="50" y="100" width="460" height="74" rx="10" fill="url(#ssGrad)" stroke="#475569" stroke-width="1.5"/>
          <ellipse cx="50" cy="137" rx="20" ry="37" fill="url(#innerBore)"/>
          <ellipse cx="510" cy="137" rx="20" ry="37" fill="url(#epGrad)"/>
          <line x1="60" y1="118" x2="500" y2="118" stroke="#FFFFFF" stroke-width="3" opacity="0.85"/>

          <!-- 90 Degree Polished Bend connected -->
          <g transform="translate(380, 160)">
            <path d="M 0,0 C 70,0 110,40 110,110 L 60,110 C 60,65 35,40 0,40 Z" fill="url(#epGrad)" stroke="#334155" stroke-width="1.5"/>
            <ellipse cx="0" cy="20" rx="10" ry="20" fill="url(#epGrad)"/>
            <ellipse cx="85" cy="110" rx="25" ry="10" fill="url(#innerBore)"/>
            <line x1="5" y1="8" x2="80" y2="80" stroke="#FFFFFF" stroke-width="3" opacity="0.9"/>
          </g>

          <!-- Tri-Clamp Ferrule & Clamp Assembly -->
          <g transform="translate(140, 170)">
            <!-- Ferrule left -->
            <rect x="0" y="10" width="30" height="70" rx="4" fill="url(#ssGrad)" stroke="#334155"/>
            <!-- Clamp body -->
            <rect x="25" y="0" width="22" height="90" rx="8" fill="url(#epGrad)" stroke="#1E293B" stroke-width="2"/>
            <!-- Wingnut -->
            <rect x="28" y="-22" width="16" height="22" rx="4" fill="#F00078"/>
            <circle cx="36" cy="-11" r="5" fill="#FFFFFF"/>
            <!-- Ferrule right -->
            <rect x="42" y="10" width="30" height="70" rx="4" fill="url(#ssGrad)" stroke="#334155"/>
          </g>

          <!-- Sanitary Butterfly Valve -->
          <g transform="translate(260, 160)">
            <rect x="0" y="15" width="40" height="60" rx="6" fill="url(#ssGrad)" stroke="#334155"/>
            <ellipse cx="20" cy="45" rx="14" ry="24" fill="#38BDF8" opacity="0.8"/>
            <!-- Stem and Handle -->
            <rect x="16" y="-30" width="8" height="45" rx="2" fill="#475569"/>
            <path d="M 20,-30 L 95,-45 L 95,-25 Z" fill="#F00078"/>
          </g>
        </g>
      `
    })
  },

  // 2. PRODUCT: SS 316L EP PIPE
  {
    filePath: path.join(assetsDir, 'products', 'pipes', 'ss-316l-ep-pipe.svg'),
    content: generateSvg({
      title: 'SS 316L Electro Polished Sanitary Pipe',
      subtext: 'High Purity ASME BPE / ASTM A270 • Ra ≤ 0.38 µm',
      specBadge: 'GRADE SS 316L • EP FINISH',
      graphicContent: `
        <g transform="translate(60, 130)">
          <!-- Precision EP Pipe Cylinder -->
          <rect x="60" y="40" width="360" height="85" rx="12" fill="url(#epGrad)" stroke="#475569" stroke-width="1.5"/>
          <!-- Internal Mirror Bore -->
          <ellipse cx="60" cy="82" rx="26" ry="42" fill="url(#innerBore)"/>
          <ellipse cx="420" cy="82" rx="26" ry="42" fill="url(#ssGrad)"/>
          <!-- Specular Polish Beam -->
          <line x1="75" y1="58" x2="405" y2="58" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
          <line x1="85" y1="70" x2="395" y2="70" stroke="#FFFFFF" stroke-width="1.8" opacity="0.6"/>
          <!-- Welded/Seamless Etch Laser Mark -->
          <text x="240" y="90" font-family="monospace" font-size="10" fill="#334155" opacity="0.7" text-anchor="middle">
            LOTUS TUBES SS 316L ASTM A270 HT#68412 1.5" OD X 1.65MM EP
          </text>
          <!-- Blue Sanitary Protective End Caps -->
          <ellipse cx="60" cy="82" rx="6" ry="12" fill="#0284C7" opacity="0.4"/>
        </g>
      `
    })
  },

  // 3. PRODUCT: SS 304 EP PIPE
  {
    filePath: path.join(assetsDir, 'products', 'pipes', 'ss-304-ep-pipe.svg'),
    content: generateSvg({
      title: 'SS 304 Electro Polished Sanitary Pipe',
      subtext: 'Hygienic Process Grade ASTM A270 • Dairy & Food Blending',
      specBadge: 'GRADE SS 304 • EP FINISH',
      graphicContent: `
        <g transform="translate(60, 130)">
          <rect x="60" y="40" width="360" height="85" rx="12" fill="url(#ssGrad)" stroke="#475569" stroke-width="1.5"/>
          <ellipse cx="60" cy="82" rx="26" ry="42" fill="url(#innerBore)"/>
          <ellipse cx="420" cy="82" rx="26" ry="42" fill="url(#epGrad)"/>
          <line x1="75" y1="58" x2="405" y2="58" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
          <text x="240" y="90" font-family="monospace" font-size="10" fill="#334155" opacity="0.7" text-anchor="middle">
            LOTUS TUBES SS 304 ASTM A270 2.0" OD X 1.65MM EP
          </text>
        </g>
      `
    })
  },

  // 4. PRODUCT: SS 316L MP PIPE
  {
    filePath: path.join(assetsDir, 'products', 'pipes', 'ss-316l-mp-pipe.svg'),
    content: generateSvg({
      title: 'SS 316L Mechanical Polished (MP) Sanitary Pipe',
      subtext: 'Internal/External Ra ≤ 0.8 µm (320-400 Grit Mirror Finish)',
      specBadge: 'GRADE SS 316L • MP FINISH',
      graphicContent: `
        <g transform="translate(60, 130)">
          <rect x="60" y="40" width="360" height="85" rx="12" fill="url(#ssGrad)" stroke="#475569" stroke-width="1.5"/>
          <ellipse cx="60" cy="82" rx="26" ry="42" fill="url(#innerBore)"/>
          <ellipse cx="420" cy="82" rx="26" ry="42" fill="url(#ssGrad)"/>
          <line x1="75" y1="62" x2="405" y2="62" stroke="#FFFFFF" stroke-width="3" opacity="0.8"/>
          <text x="240" y="90" font-family="monospace" font-size="10" fill="#334155" opacity="0.7" text-anchor="middle">
            LOTUS TUBES SS 316L ASTM A270 MP 320 GRIT
          </text>
        </g>
      `
    })
  },

  // 5. PRODUCT: SS 304 MP PIPE
  {
    filePath: path.join(assetsDir, 'products', 'pipes', 'ss-304-mp-pipe.svg'),
    content: generateSvg({
      title: 'SS 304 Mechanical Polished (MP) Sanitary Pipe',
      subtext: 'Smooth Cleanable Finish for Milk & Beverage Conveyance',
      specBadge: 'GRADE SS 304 • MP FINISH',
      graphicContent: `
        <g transform="translate(60, 130)">
          <rect x="60" y="40" width="360" height="85" rx="12" fill="url(#ssGrad)" stroke="#475569" stroke-width="1.5"/>
          <ellipse cx="60" cy="82" rx="26" ry="42" fill="url(#innerBore)"/>
          <ellipse cx="420" cy="82" rx="26" ry="42" fill="url(#ssGrad)"/>
          <line x1="75" y1="62" x2="405" y2="62" stroke="#FFFFFF" stroke-width="3" opacity="0.8"/>
          <text x="240" y="90" font-family="monospace" font-size="10" fill="#334155" opacity="0.7" text-anchor="middle">
            LOTUS TUBES SS 304 DAIRY TUBE MP 180-320 GRIT
          </text>
        </g>
      `
    })
  },

  // 6. PRODUCT: SS 304 SEAMLESS SANITARY TUBE
  {
    filePath: path.join(assetsDir, 'products', 'pipes', 'ss-304-seamless-tube.svg'),
    content: generateSvg({
      title: 'SS 304 Seamless Sanitary Tube',
      subtext: 'Cold Drawn Seamless Construction • High Pressure Clean Utilities',
      specBadge: 'SEAMLESS CONSTRUCTION',
      graphicContent: `
        <g transform="translate(60, 130)">
          <rect x="60" y="40" width="360" height="85" rx="12" fill="url(#epGrad)" stroke="#334155" stroke-width="1.8"/>
          <ellipse cx="60" cy="82" rx="26" ry="42" fill="url(#innerBore)"/>
          <ellipse cx="420" cy="82" rx="26" ry="42" fill="url(#ssGrad)"/>
          <line x1="75" y1="58" x2="405" y2="58" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
          <text x="240" y="90" font-family="monospace" font-size="10" fill="#334155" opacity="0.7" text-anchor="middle">
            LOTUS TUBES SS 304 SEAMLESS ASTM A269/A270
          </text>
        </g>
      `
    })
  },

  // 7. PRODUCT: SS SANITARY 90 DEGREE BEND
  {
    filePath: path.join(assetsDir, 'products', 'fittings', 'ss-sanitary-90-bend.svg'),
    content: generateSvg({
      title: 'SS Sanitary 90° Bend (Long & Short Radius)',
      subtext: 'Seamless Extruded Radius • 100% Self-Draining Laminar Flow',
      specBadge: 'SS 304 / SS 316L • 1.5D RADIUS',
      graphicContent: `
        <g transform="translate(160, 80)">
          <!-- 90 Degree Torus Arc Segment -->
          <path d="M 40,30 C 180,30 240,90 240,230 L 160,230 C 160,130 130,110 40,110 Z" fill="url(#epGrad)" stroke="#334155" stroke-width="1.8"/>
          <!-- Inlet Port face -->
          <ellipse cx="40" cy="70" rx="18" ry="40" fill="url(#epGrad)"/>
          <ellipse cx="40" cy="70" rx="12" ry="32" fill="url(#innerBore)"/>
          <!-- Outlet Port face -->
          <ellipse cx="200" cy="230" rx="40" ry="18" fill="url(#ssGrad)"/>
          <ellipse cx="200" cy="230" rx="32" ry="12" fill="url(#innerBore)"/>
          <!-- High Mirror Highlight -->
          <path d="M 50,45 C 160,45 225,95 225,220" stroke="#FFFFFF" stroke-width="4.5" fill="none" stroke-linecap="round" opacity="0.95"/>
        </g>
      `
    })
  },

  // 8. PRODUCT: SS SANITARY EQUAL TEE
  {
    filePath: path.join(assetsDir, 'products', 'fittings', 'ss-sanitary-equal-tee.svg'),
    content: generateSvg({
      title: 'SS Sanitary Equal Tee',
      subtext: 'Zero Dead-Leg Pulled Branch Connection • BS 4825 / 3-A',
      specBadge: 'EQUAL PORTS • HYGIENIC TEE',
      graphicContent: `
        <g transform="translate(120, 90)">
          <!-- Main Run Body -->
          <rect x="40" y="100" width="280" height="74" rx="8" fill="url(#epGrad)" stroke="#334155" stroke-width="1.5"/>
          <ellipse cx="40" cy="137" rx="18" ry="37" fill="url(#innerBore)"/>
          <ellipse cx="320" cy="137" rx="18" ry="37" fill="url(#ssGrad)"/>
          <!-- Branch Run (Vertical) -->
          <path d="M 143,100 L 143,20 C 143,10 217,10 217,20 L 217,100 Z" fill="url(#epGrad)" stroke="#334155" stroke-width="1.5"/>
          <ellipse cx="180" cy="20" rx="37" ry="16" fill="url(#innerBore)"/>
          <!-- Highlights -->
          <line x1="55" y1="115" x2="305" y2="115" stroke="#FFFFFF" stroke-width="3" opacity="0.85"/>
          <line x1="160" y1="30" x2="160" y2="95" stroke="#FFFFFF" stroke-width="2.5" opacity="0.85"/>
        </g>
      `
    })
  },

  // 9. PRODUCT: SS SANITARY REDUCING TEE
  {
    filePath: path.join(assetsDir, 'products', 'fittings', 'ss-sanitary-reducing-tee.svg'),
    content: generateSvg({
      title: 'SS Sanitary Reducing Tee',
      subtext: 'Reduced Branch for Sensor Instrumentation & Sub-Headers',
      specBadge: 'REDUCED BRANCH PORT',
      graphicContent: `
        <g transform="translate(120, 90)">
          <!-- Main Run Body -->
          <rect x="40" y="100" width="280" height="80" rx="8" fill="url(#ssGrad)" stroke="#334155" stroke-width="1.5"/>
          <ellipse cx="40" cy="140" rx="20" ry="40" fill="url(#innerBore)"/>
          <ellipse cx="320" cy="140" rx="20" ry="40" fill="url(#ssGrad)"/>
          <!-- Smaller Reduced Branch (Vertical) -->
          <path d="M 155,100 L 155,30 C 155,22 205,22 205,30 L 205,100 Z" fill="url(#epGrad)" stroke="#334155" stroke-width="1.5"/>
          <ellipse cx="180" cy="30" rx="25" ry="12" fill="url(#innerBore)"/>
          <line x1="55" y1="115" x2="305" y2="115" stroke="#FFFFFF" stroke-width="3" opacity="0.85"/>
        </g>
      `
    })
  },

  // 10. PRODUCT: SS CONCENTRIC REDUCER
  {
    filePath: path.join(assetsDir, 'products', 'fittings', 'ss-sanitary-concentric-reducer.svg'),
    content: generateSvg({
      title: 'SS Sanitary Concentric Reducer',
      subtext: 'Symmetrical In-Line Diameter Transition • Vertical Lines',
      specBadge: 'CONCENTRIC CONE',
      graphicContent: `
        <g transform="translate(130, 110)">
          <!-- Symmetrical Trapezoid Reducer Body -->
          <path d="M 40,30 L 260,65 L 260,115 L 40,150 Z" fill="url(#epGrad)" stroke="#334155" stroke-width="1.8"/>
          <!-- Large End (Left) -->
          <ellipse cx="40" cy="90" rx="24" ry="60" fill="url(#innerBore)"/>
          <!-- Small End (Right) -->
          <ellipse cx="260" cy="90" rx="14" ry="25" fill="url(#ssGrad)"/>
          <!-- Specular Conical Highlight -->
          <line x1="55" y1="52" x2="250" y2="72" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
        </g>
      `
    })
  },

  // 11. PRODUCT: SS ECCENTRIC REDUCER
  {
    filePath: path.join(assetsDir, 'products', 'fittings', 'ss-sanitary-eccentric-reducer.svg'),
    content: generateSvg({
      title: 'SS Sanitary Eccentric Reducer (Flat Bottom)',
      subtext: 'Zero-Pooling Horizontal Drainage Line Reducer',
      specBadge: 'FLAT BOTTOM • SELF-DRAINING',
      graphicContent: `
        <g transform="translate(130, 110)">
          <!-- Flat Bottom Line, Tapered Top -->
          <path d="M 40,30 L 260,80 L 260,150 L 40,150 Z" fill="url(#epGrad)" stroke="#334155" stroke-width="1.8"/>
          <!-- Large End (Left) -->
          <ellipse cx="40" cy="90" rx="24" ry="60" fill="url(#innerBore)"/>
          <!-- Small End (Right) -->
          <ellipse cx="260" cy="115" rx="14" ry="35" fill="url(#ssGrad)"/>
          <!-- Flat bottom indicator guide -->
          <line x1="40" y1="150" x2="260" y2="150" stroke="#F00078" stroke-width="2.5" stroke-dasharray="4,4"/>
          <!-- Specular Highlight -->
          <line x1="55" y1="52" x2="250" y2="88" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
        </g>
      `
    })
  },

  // 12. PRODUCT: SS TRI-CLAMP FERRULE
  {
    filePath: path.join(assetsDir, 'products', 'accessories', 'ss-tri-clamp-ferrule.svg'),
    content: generateSvg({
      title: 'SS Tri-Clamp Ferrule (Long & Short Weld)',
      subtext: 'Precision CNC Machined from Forged Bar • BS 4825 Part 3',
      specBadge: 'SS 316L • CNC MACHINED',
      graphicContent: `
        <g transform="translate(160, 90)">
          <!-- Ferrule Neck Tube -->
          <rect x="40" y="60" width="120" height="90" fill="url(#epGrad)" stroke="#334155" stroke-width="1.5"/>
          <!-- Ferrule Flange Face (Larger diameter lip) -->
          <path d="M 160,35 L 200,35 L 200,175 L 160,175 Z" fill="url(#ssGrad)" stroke="#1E293B" stroke-width="2"/>
          <!-- Flange Gasket Recess Ring -->
          <ellipse cx="200" cy="105" rx="14" ry="70" fill="url(#epGrad)"/>
          <ellipse cx="200" cy="105" rx="9" ry="54" fill="#64748B" stroke="#334155"/>
          <ellipse cx="200" cy="105" rx="6" ry="42" fill="url(#innerBore)"/>
          <!-- Weld Neck End (Left) -->
          <ellipse cx="40" cy="105" rx="16" ry="45" fill="url(#innerBore)"/>
          <line x1="45" y1="75" x2="155" y2="75" stroke="#FFFFFF" stroke-width="3.5" opacity="0.9"/>
        </g>
      `
    })
  },

  // 13. PRODUCT: SS TRI-CLAMP CLAMP
  {
    filePath: path.join(assetsDir, 'products', 'accessories', 'ss-tri-clamp-clamp.svg'),
    content: generateSvg({
      title: 'SS Tri-Clamp Clamp (Heavy Duty Single/Double Pin)',
      subtext: 'High Pressure Forged 304 Hinged Ring with Solid Brass Wingnut',
      specBadge: 'HEAVY DUTY FORGED SS 304',
      graphicContent: `
        <g transform="translate(180, 80)">
          <!-- Outer Circular Clamp Ring -->
          <circle cx="120" cy="130" r="95" fill="none" stroke="url(#ssGrad)" stroke-width="32" stroke-linecap="round"/>
          <circle cx="120" cy="130" r="95" fill="none" stroke="#334155" stroke-width="1.5"/>
          <!-- Inner Ferrule Clamping Channel -->
          <circle cx="120" cy="130" r="70" fill="#1E293B" opacity="0.8"/>
          <!-- Hinge Pin Left -->
          <circle cx="25" cy="130" r="14" fill="#64748B" stroke="#1E293B" stroke-width="2"/>
          <circle cx="25" cy="130" r="6" fill="#CBD5E1"/>
          <!-- Tightening Lug & Solid Wingnut Right -->
          <g transform="translate(205, 120)">
            <rect x="0" y="-15" width="25" height="30" rx="4" fill="#334155"/>
            <!-- Threaded bolt -->
            <rect x="25" y="-6" width="30" height="12" fill="#94A3B8"/>
            <!-- Wingnut Pink/Silver Brand Accented -->
            <ellipse cx="65" cy="0" rx="20" ry="10" fill="#F00078"/>
            <circle cx="65" cy="0" r="6" fill="#FFFFFF"/>
          </g>
        </g>
      `
    })
  },

  // 14. PRODUCT: SILICONE TRI-CLAMP GASKET
  {
    filePath: path.join(assetsDir, 'products', 'gaskets', 'silicone-tri-clamp-gasket.svg'),
    content: generateSvg({
      title: 'Silicone Tri-Clamp Gasket (FDA Compliant)',
      subtext: 'Medical & Food Grade Platinum-Cured Translucent Elastomer',
      specBadge: 'FDA 21 CFR 177.2600 • USP CLASS VI',
      graphicContent: `
        <g transform="translate(180, 80)">
          <!-- Translucent Silicone Torus Ring -->
          <circle cx="120" cy="130" r="90" fill="none" stroke="#FFFFFF" stroke-width="32" opacity="0.9" filter="url(#glow)"/>
          <circle cx="120" cy="130" r="90" fill="none" stroke="#CBD5E1" stroke-width="32" opacity="0.5"/>
          <!-- Alignment Flange Lip -->
          <circle cx="120" cy="130" r="108" fill="none" stroke="#E2E8F0" stroke-width="6" opacity="0.7"/>
          <circle cx="120" cy="130" r="72" fill="none" stroke="#CBD5E1" stroke-width="2"/>
          <!-- Highlight curve -->
          <path d="M 60,70 A 90 90 0 0 1 180,70" fill="none" stroke="#FFFFFF" stroke-width="6" opacity="0.95"/>
        </g>
      `
    })
  },

  // 15. PRODUCT: SS SMS UNION
  {
    filePath: path.join(assetsDir, 'products', 'accessories', 'ss-sms-union.svg'),
    content: generateSvg({
      title: 'SS SMS 1145 Dairy Union Complete Set',
      subtext: 'Threaded Slotted Nut, Weld Liner, Male Part & EPDM Seal',
      specBadge: 'SMS 1145 SWEDISH DAIRY STANDARD',
      graphicContent: `
        <g transform="translate(130, 90)">
          <!-- Left Weld Liner -->
          <rect x="40" y="70" width="60" height="80" fill="url(#ssGrad)" stroke="#334155"/>
          <ellipse cx="40" cy="110" rx="16" ry="40" fill="url(#innerBore)"/>
          <!-- Octagonal / Slotted Dairy Union Nut -->
          <rect x="95" y="45" width="75" height="130" rx="8" fill="url(#epGrad)" stroke="#1E293B" stroke-width="2"/>
          <!-- Nut Slots -->
          <rect x="105" y="55" width="8" height="25" fill="#334155"/>
          <rect x="105" y="95" width="8" height="30" fill="#334155"/>
          <rect x="105" y="140" width="8" height="25" fill="#334155"/>
          <rect x="150" y="55" width="8" height="25" fill="#334155"/>
          <rect x="150" y="95" width="8" height="30" fill="#334155"/>
          <rect x="150" y="140" width="8" height="25" fill="#334155"/>
          <!-- Right Male Thread Part -->
          <rect x="170" y="65" width="90" height="90" fill="url(#ssGrad)" stroke="#334155"/>
          <ellipse cx="260" cy="110" rx="18" ry="45" fill="url(#epGrad)"/>
          <ellipse cx="260" cy="110" rx="12" ry="35" fill="url(#innerBore)"/>
        </g>
      `
    })
  },

  // 16. PRODUCT: SS SANITARY BUTTERFLY VALVE
  {
    filePath: path.join(assetsDir, 'products', 'valves', 'ss-sanitary-butterfly-valve.svg'),
    content: generateSvg({
      title: 'SS Sanitary Butterfly Valve (Manual Pull Handle)',
      subtext: 'Multi-Position Stainless Pull Handle • Food Grade EPDM Seat',
      specBadge: 'PN10 • MANUAL PULL HANDLE',
      graphicContent: `
        <g transform="translate(160, 70)">
          <!-- Valve Circular Body with Tri-Clamp Ends -->
          <rect x="50" y="90" width="80" height="110" rx="8" fill="url(#ssGrad)" stroke="#1E293B" stroke-width="2"/>
          <ellipse cx="50" cy="145" rx="16" ry="55" fill="url(#innerBore)"/>
          <ellipse cx="130" cy="145" rx="16" ry="55" fill="url(#epGrad)"/>
          <!-- Internal Polished Disc in partial rotation -->
          <ellipse cx="90" cy="145" rx="8" ry="46" fill="#38BDF8" opacity="0.85" stroke="#0284C7"/>
          <!-- Vertical Bonnet & Stem -->
          <rect x="78" y="20" width="24" height="75" rx="4" fill="url(#epGrad)" stroke="#334155"/>
          <!-- Pink Manual Pull Gripper Handle -->
          <g transform="translate(90, 25)">
            <path d="M 0,0 L 140,-25 L 140,-5 L 0,15 Z" fill="#F00078" stroke="#9D174D" stroke-width="1.5"/>
            <circle cx="130" cy="-15" r="9" fill="#FFFFFF"/>
            <!-- Notched Position Plate -->
            <path d="M -30,-5 C -10,-25 10,-25 30,-5 Z" fill="#64748B"/>
          </g>
        </g>
      `
    })
  },

  // 17. PRODUCT: SS 316L DIAPHRAGM VALVE
  {
    filePath: path.join(assetsDir, 'products', 'valves', 'ss-316l-diaphragm-valve.svg'),
    content: generateSvg({
      title: 'SS 316L Sanitary Diaphragm Valve (Manual Wheel)',
      subtext: 'Hermetic Zero Dead-Leg Weir Design • Pharma WFI Point of Use',
      specBadge: 'ASME BPE • SS 316L BODY',
      graphicContent: `
        <g transform="translate(150, 70)">
          <!-- Forged Valve Bottom Body -->
          <path d="M 30,150 L 80,180 L 160,180 L 210,150 L 210,120 L 30,120 Z" fill="url(#epGrad)" stroke="#334155" stroke-width="2"/>
          <ellipse cx="30" cy="135" rx="14" ry="25" fill="url(#innerBore)"/>
          <ellipse cx="210" cy="135" rx="14" ry="25" fill="url(#epGrad)"/>
          <!-- Actuator Bonnet -->
          <rect x="90" y="55" width="60" height="70" rx="8" fill="url(#ssGrad)" stroke="#1E293B" stroke-width="2"/>
          <line x1="90" y1="90" x2="150" y2="90" stroke="#475569" stroke-width="2"/>
          <!-- Ergonomic Handwheel (Top) -->
          <ellipse cx="120" cy="35" rx="65" ry="18" fill="#10263D" stroke="#F00078" stroke-width="3"/>
          <circle cx="120" cy="35" r="14" fill="#CBD5E1"/>
        </g>
      `
    })
  },

  // 18. PRODUCT: SS 3-PIECE BALL VALVE
  {
    filePath: path.join(assetsDir, 'products', 'valves', 'ss-3-piece-ball-valve-tc-end.svg'),
    content: generateSvg({
      title: 'SS 3-Piece Sanitary Ball Valve with TC End',
      subtext: 'Full Bore Cavity-Filled PTFE Seats • Swing-Out Center Maintenance',
      specBadge: 'FULL BORE • CAVITY FILLED',
      graphicContent: `
        <g transform="translate(130, 70)">
          <!-- Left Clamp End Cap -->
          <rect x="30" y="80" width="50" height="90" rx="6" fill="url(#ssGrad)" stroke="#334155"/>
          <ellipse cx="30" cy="125" rx="14" ry="45" fill="url(#innerBore)"/>
          <!-- Center Valve Body Block with Assembly Bolts -->
          <rect x="80" y="65" width="100" height="120" rx="10" fill="url(#epGrad)" stroke="#1E293B" stroke-width="2"/>
          <!-- 4 Through-Bolts -->
          <circle cx="95" cy="80" r="6" fill="#334155"/>
          <circle cx="95" cy="170" r="6" fill="#334155"/>
          <circle cx="165" cy="80" r="6" fill="#334155"/>
          <circle cx="165" cy="170" r="6" fill="#334155"/>
          <!-- Right Clamp End Cap -->
          <rect x="180" y="80" width="50" height="90" rx="6" fill="url(#ssGrad)" stroke="#334155"/>
          <ellipse cx="230" cy="125" rx="14" ry="45" fill="url(#epGrad)"/>
          <!-- Lever Handle -->
          <g transform="translate(130, 45)">
            <rect x="-8" y="-15" width="16" height="35" fill="#475569"/>
            <path d="M -8,-15 L 120,-35 L 120,-15 L -8,0 Z" fill="#F00078"/>
          </g>
        </g>
      `
    })
  },

  // 19. PRODUCT: PNEUMATIC SANITARY BALL VALVE
  {
    filePath: path.join(assetsDir, 'products', 'valves', 'pneumatic-sanitary-ball-valve.svg'),
    content: generateSvg({
      title: 'Pneumatic Actuated Sanitary Ball Valve with Switchbox',
      subtext: 'Double Acting / Spring Return Rack & Pinion Pneumatic Actuator',
      specBadge: 'AUTOMATED ACTUATOR • PLC READY',
      graphicContent: `
        <g transform="translate(150, 40)">
          <!-- Top Limit Switch Indicator Box -->
          <rect x="80" y="10" width="60" height="40" rx="6" fill="#10263D" stroke="#0284C7" stroke-width="2"/>
          <circle cx="110" cy="30" r="12" fill="#E2E8F0"/>
          <path d="M 110,18 L 110,42" stroke="#EF4444" stroke-width="4"/>
          <!-- Pneumatic Cylinder Actuator Body -->
          <rect x="40" y="55" width="140" height="85" rx="12" fill="url(#ssGrad)" stroke="#1E293B" stroke-width="2"/>
          <rect x="45" y="75" width="130" height="4" fill="#F00078"/>
          <!-- NAMUR Solenoid Port -->
          <circle cx="60" cy="110" r="6" fill="#334155"/>
          <circle cx="80" cy="110" r="6" fill="#334155"/>
          <!-- Mounting Bracket to Sanitary Valve -->
          <rect x="90" y="140" width="40" height="30" fill="#64748B"/>
          <!-- Lower Sanitary Valve Body -->
          <rect x="60" y="170" width="100" height="70" rx="6" fill="url(#epGrad)" stroke="#334155"/>
          <ellipse cx="60" cy="205" rx="14" ry="35" fill="url(#innerBore)"/>
          <ellipse cx="160" cy="205" rx="14" ry="35" fill="url(#ssGrad)"/>
        </g>
      `
    })
  },

  // 20. PRODUCT: SS SANITARY SPRAY BALL
  {
    filePath: path.join(assetsDir, 'products', 'accessories', 'ss-sanitary-spray-ball.svg'),
    content: generateSvg({
      title: 'SS Sanitary Rotary & Static Spray Ball',
      subtext: 'Self-Lubricating Fluid-Driven 360° CIP Tank Cleaning Jet Head',
      specBadge: '360° CIP COVERAGE • SS 316L',
      graphicContent: `
        <g transform="translate(170, 70)">
          <!-- Inlet Tri-Clamp Connection Neck -->
          <rect x="70" y="10" width="40" height="60" rx="4" fill="url(#epGrad)" stroke="#334155" stroke-width="1.5"/>
          <ellipse cx="90" cy="10" rx="20" ry="8" fill="url(#innerBore)"/>
          <!-- Rotary Bearing Collar -->
          <rect x="60" y="70" width="60" height="25" rx="4" fill="#F00078"/>
          <!-- Spherical Spray Head with Fluid Orifices -->
          <circle cx="90" cy="155" r="60" fill="url(#epGrad)" stroke="#1E293B" stroke-width="2"/>
          <!-- Perforated Jet Orifices (Array of holes) -->
          <g fill="#1E293B">
            <circle cx="90" cy="120" r="3.5"/>
            <circle cx="70" cy="130" r="3.5"/>
            <circle cx="110" cy="130" r="3.5"/>
            <circle cx="55" cy="155" r="3.5"/>
            <circle cx="75" cy="155" r="3.5"/>
            <circle cx="90" cy="155" r="3.5"/>
            <circle cx="105" cy="155" r="3.5"/>
            <circle cx="125" cy="155" r="3.5"/>
            <circle cx="70" cy="180" r="3.5"/>
            <circle cx="110" cy="180" r="3.5"/>
            <circle cx="90" cy="195" r="3.5"/>
          </g>
          <!-- Simulated High Pressure Water Spray Rays -->
          <g stroke="#38BDF8" stroke-width="1.8" opacity="0.75" stroke-dasharray="3,3">
            <line x1="30" y1="120" x2="-10" y2="100"/>
            <line x1="30" y1="180" x2="-10" y2="200"/>
            <line x1="150" y1="120" x2="190" y2="100"/>
            <line x1="150" y1="180" x2="190" y2="200"/>
            <line x1="90" y1="215" x2="90" y2="250"/>
          </g>
        </g>
      `
    })
  },

  // 21. INDUSTRY: PHARMACEUTICAL
  {
    filePath: path.join(assetsDir, 'industries', 'pharmaceutical.svg'),
    content: generateSvg({
      title: 'Pharmaceutical & Bio-Cleanroom Piping',
      subtext: 'High Purity WFI Loops • Ra ≤ 0.38 µm • ASME BPE Standards',
      specBadge: 'PHARMA PROCESS GRADE',
      graphicContent: `
        <g transform="translate(100, 80)">
          <!-- Pure Water / Compounding Vessel Skid -->
          <rect x="50" y="40" width="110" height="170" rx="20" fill="url(#epGrad)" stroke="#334155" stroke-width="2"/>
          <ellipse cx="105" cy="40" rx="55" ry="16" fill="url(#ssGrad)"/>
          <!-- Boroscopic Inspection Sight Glass -->
          <circle cx="105" cy="100" r="22" fill="#38BDF8" opacity="0.8" stroke="#10263D" stroke-width="3"/>
          <line x1="90" y1="100" x2="120" y2="100" stroke="#FFFFFF" stroke-width="2"/>
          <!-- Interconnecting WFI Loop Pipes -->
          <path d="M 160,80 L 260,80 L 260,180 L 340,180" fill="none" stroke="url(#epGrad)" stroke-width="24" stroke-linecap="round"/>
          <path d="M 160,80 L 260,80 L 260,180 L 340,180" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
          <!-- Diaphragm Valve Point of Use -->
          <circle cx="260" cy="130" r="16" fill="#F00078"/>
        </g>
      `
    })
  },

  // 22. INDUSTRY: DAIRY
  {
    filePath: path.join(assetsDir, 'industries', 'dairy.svg'),
    content: generateSvg({
      title: 'Dairy & Milk Processing Plants',
      subtext: 'Sanitary Pasteurization Lines • SMS Unions • Butterfly Valves',
      specBadge: 'DAIRY HYGIENE CERTIFIED',
      graphicContent: `
        <g transform="translate(100, 80)">
          <!-- Milk Silo Vessel -->
          <rect x="60" y="20" width="100" height="190" rx="14" fill="url(#ssGrad)" stroke="#334155" stroke-width="2"/>
          <path d="M 60,20 C 60,0 160,0 160,20 Z" fill="url(#epGrad)"/>
          <!-- Dairy Pipeline Manifold with Butterfly Valves -->
          <path d="M 160,140 L 340,140" stroke="url(#epGrad)" stroke-width="28"/>
          <!-- Multi-position Valve Handles -->
          <circle cx="210" cy="140" r="14" fill="#F00078"/>
          <line x1="210" y1="126" x2="210" y2="80" stroke="#F00078" stroke-width="6"/>
          <circle cx="280" cy="140" r="14" fill="#F00078"/>
          <line x1="280" y1="126" x2="280" y2="80" stroke="#F00078" stroke-width="6"/>
        </g>
      `
    })
  },

  // 23. COMPANY / ABOUT HEADQUARTERS
  {
    filePath: path.join(assetsDir, 'company', 'lotus-tubes-facility.svg'),
    content: generateSvg({
      width: 640,
      height: 460,
      title: 'Lotus Tubes Trade Facility & Yard',
      subtext: 'Mumbai Distribution Hub • Dr. Bhajekar Lane, Charni Road East',
      specBadge: 'MUMBAI DISTRIBUTION HUB',
      graphicContent: `
        <g transform="translate(80, 70)">
          <!-- Modern Architectural Industrial Building -->
          <rect x="40" y="60" width="400" height="170" rx="8" fill="#10263D" stroke="#071C30" stroke-width="3"/>
          <!-- Windows Matrix -->
          <g fill="#38BDF8" opacity="0.75">
            <rect x="60" y="80" width="45" height="40" rx="3"/>
            <rect x="120" y="80" width="45" height="40" rx="3"/>
            <rect x="180" y="80" width="45" height="40" rx="3"/>
            <rect x="240" y="80" width="45" height="40" rx="3"/>
            <rect x="300" y="80" width="45" height="40" rx="3"/>
            <rect x="360" y="80" width="45" height="40" rx="3"/>
            
            <rect x="60" y="140" width="45" height="50" rx="3"/>
            <rect x="120" y="140" width="45" height="50" rx="3"/>
            <rect x="300" y="140" width="45" height="50" rx="3"/>
            <rect x="360" y="140" width="45" height="50" rx="3"/>
          </g>
          <!-- Entrance Canopy & Lotus Tubes Logo Emblem -->
          <rect x="185" y="130" width="110" height="100" fill="#071C30"/>
          <rect x="195" y="70" width="90" height="26" rx="4" fill="#F00078"/>
          <text x="240" y="87" font-family="-apple-system, sans-serif" font-size="11" font-weight="900" fill="#FFFFFF" text-anchor="middle">
            LOTUS TUBES
          </text>
        </g>
      `
    })
  },

  // 24. INDUSTRY: BIOTECHNOLOGY
  {
    filePath: path.join(assetsDir, 'industries', 'biotechnology.svg'),
    content: generateSvg({
      title: 'Biotechnology & Sterile Fermentation',
      subtext: 'Aseptic Bioreactors • Ultra-Pure Transfer Lines • USP Class VI',
      specBadge: 'BIOTECH STERILE GRADE',
      graphicContent: `
        <g transform="translate(100, 80)">
          <rect x="70" y="30" width="100" height="180" rx="18" fill="url(#epGrad)" stroke="#334155" stroke-width="2"/>
          <ellipse cx="120" cy="30" rx="50" ry="16" fill="url(#ssGrad)"/>
          <line x1="120" y1="30" x2="120" y2="160" stroke="#10263D" stroke-width="6"/>
          <rect x="90" y="150" width="60" height="12" rx="4" fill="#F00078"/>
          <path d="M 170,140 L 330,140" stroke="url(#epGrad)" stroke-width="24"/>
          <circle cx="250" cy="140" r="14" fill="#F00078"/>
        </g>
      `
    })
  },

  // 25. INDUSTRY: FOOD & BEVERAGE
  {
    filePath: path.join(assetsDir, 'industries', 'food-beverage.svg'),
    content: generateSvg({
      title: 'Food & Beverage Processing Lines',
      subtext: 'Viscous Fluid Handling • Cavity-Filled Valves • CIP Cleanable',
      specBadge: 'FOOD GRADE SANITARY',
      graphicContent: `
        <g transform="translate(100, 80)">
          <rect x="60" y="40" width="120" height="160" rx="12" fill="url(#ssGrad)" stroke="#334155" stroke-width="2"/>
          <path d="M 60,200 L 120,240 L 180,200 Z" fill="url(#epGrad)"/>
          <path d="M 120,240 L 120,260 L 340,260" fill="none" stroke="url(#epGrad)" stroke-width="22"/>
          <circle cx="230" cy="260" r="14" fill="#F00078"/>
        </g>
      `
    })
  },

  // 26. INDUSTRY: BREWERIES
  {
    filePath: path.join(assetsDir, 'industries', 'breweries.svg'),
    content: generateSvg({
      title: 'Breweries & Fermentation Cellars',
      subtext: 'Stainless Fermenters • Tri-Clamp Manifolds • Rotary Spray Balls',
      specBadge: 'BREWERY CELLAR GRADE',
      graphicContent: `
        <g transform="translate(100, 80)">
          <rect x="60" y="30" width="110" height="140" rx="8" fill="url(#ssGrad)" stroke="#334155" stroke-width="2"/>
          <path d="M 60,170 L 115,230 L 170,170 Z" fill="url(#epGrad)"/>
          <rect x="105" y="10" width="20" height="20" fill="url(#epGrad)"/>
          <circle cx="115" cy="28" r="10" fill="#F00078"/>
          <path d="M 115,230 L 115,250 L 300,250" fill="none" stroke="url(#epGrad)" stroke-width="20"/>
          <circle cx="210" cy="250" r="12" fill="#38BDF8"/>
        </g>
      `
    })
  },

  // 27. INDUSTRY: WATER TREATMENT & WFI
  {
    filePath: path.join(assetsDir, 'industries', 'water-treatment.svg'),
    content: generateSvg({
      title: 'High-Purity Water & WFI Generation',
      subtext: 'Reverse Osmosis (RO) • Electro-Deionization (EDI) • Passivated Loops',
      specBadge: 'WFI & ULTRA-PURE WATER',
      graphicContent: `
        <g transform="translate(100, 80)">
          <rect x="40" y="40" width="260" height="38" rx="8" fill="url(#ssGrad)" stroke="#334155" stroke-width="1.5"/>
          <rect x="40" y="95" width="260" height="38" rx="8" fill="url(#ssGrad)" stroke="#334155" stroke-width="1.5"/>
          <rect x="40" y="150" width="260" height="38" rx="8" fill="url(#epGrad)" stroke="#334155" stroke-width="1.5"/>
          <path d="M 300,59 L 340,59 L 340,169 L 300,169" fill="none" stroke="url(#epGrad)" stroke-width="16"/>
          <circle cx="340" cy="114" r="12" fill="#F00078"/>
        </g>
      `
    })
  },

  // 28. INDUSTRY: SPECIALTY CHEMICAL & COSMETICS
  {
    filePath: path.join(assetsDir, 'industries', 'chemical.svg'),
    content: generateSvg({
      title: 'Fine Chemical & Personal Care Processing',
      subtext: 'Corrosion Resistant SS 316L • PTFE Lined • Solvent Resistant',
      specBadge: 'CORROSION RESISTANT SS 316L',
      graphicContent: `
        <g transform="translate(100, 80)">
          <rect x="60" y="40" width="130" height="160" rx="16" fill="url(#epGrad)" stroke="#334155" stroke-width="2"/>
          <circle cx="125" cy="110" r="28" fill="#F59E0B" opacity="0.6"/>
          <path d="M 190,140 L 330,140" stroke="url(#ssGrad)" stroke-width="24"/>
          <rect x="250" y="125" width="24" height="30" rx="4" fill="#F00078"/>
        </g>
      `
    })
  },

  // 29. RESOURCE: CATALOGUE COVER
  {
    filePath: path.join(assetsDir, 'resources', 'catalogue-cover.svg'),
    content: generateSvg({
      title: 'Lotus Tubes Master Technical Catalogue 2026',
      subtext: 'Complete Engineering Specifications, Dimensions & Standards PDF',
      specBadge: 'OFFICIAL DATASHEET 2026',
      graphicContent: `
        <g transform="translate(160, 60)">
          <rect x="40" y="20" width="180" height="230" rx="8" fill="#10263D" stroke="#334155" stroke-width="2"/>
          <rect x="55" y="40" width="150" height="6" fill="#F00078"/>
          <rect x="55" y="60" width="80" height="24" rx="4" fill="#FFFFFF"/>
          <text x="95" y="76" font-family="sans-serif" font-size="10" font-weight="900" fill="#10263D" text-anchor="middle">LOTUS TUBES</text>
          <text x="55" y="115" font-family="sans-serif" font-size="12" font-weight="700" fill="#FFFFFF">TECHNICAL</text>
          <text x="55" y="132" font-family="sans-serif" font-size="12" font-weight="700" fill="#F00078">CATALOGUE</text>
          <text x="55" y="155" font-family="sans-serif" font-size="9" fill="#CBD5E1">SS 304 &bull; SS 316L</text>
          <text x="55" y="170" font-family="sans-serif" font-size="9" fill="#CBD5E1">EP &bull; MP FINISHES</text>
          <rect x="55" y="200" width="150" height="20" rx="4" fill="#1E293B"/>
          <text x="130" y="214" font-family="sans-serif" font-size="8" fill="#38BDF8" text-anchor="middle">ASTM A270 &bull; BS 4825 &bull; 3-A</text>
        </g>
      `
    })
  },

  // 30. RESOURCE: DIMENSIONS CHART
  {
    filePath: path.join(assetsDir, 'resources', 'dimensions-chart.svg'),
    content: generateSvg({
      title: 'Sanitary Tube Outside Diameter (OD) & Wall Gauge Chart',
      subtext: 'Standard Metric & Imperial Sizing Specifications from 1/2" to 4"',
      specBadge: 'DIMENSIONAL REFERENCE',
      graphicContent: `
        <g transform="translate(110, 70)">
          <rect x="30" y="20" width="320" height="190" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
          <rect x="30" y="20" width="320" height="34" rx="8" fill="#10263D"/>
          <text x="80" y="42" font-family="sans-serif" font-size="11" font-weight="700" fill="#FFFFFF">Size (OD)</text>
          <text x="170" y="42" font-family="sans-serif" font-size="11" font-weight="700" fill="#FFFFFF">Metric (mm)</text>
          <text x="270" y="42" font-family="sans-serif" font-size="11" font-weight="700" fill="#FFFFFF">Wall Gauge</text>
          <text x="80" y="78" font-family="sans-serif" font-size="10" fill="#1E293B">1/2" OD</text><text x="170" y="78" font-family="sans-serif" font-size="10" fill="#1E293B">12.7 mm</text><text x="270" y="78" font-family="sans-serif" font-size="10" fill="#F00078" font-weight="bold">1.2 - 1.65 mm</text>
          <line x1="30" y1="92" x2="350" y2="92" stroke="#E2E8F0"/>
          <text x="80" y="112" font-family="sans-serif" font-size="10" fill="#1E293B">1" OD</text><text x="170" y="112" font-family="sans-serif" font-size="10" fill="#1E293B">25.4 mm</text><text x="270" y="112" font-family="sans-serif" font-size="10" fill="#F00078" font-weight="bold">1.5 - 1.65 mm</text>
          <line x1="30" y1="126" x2="350" y2="126" stroke="#E2E8F0"/>
          <text x="80" y="146" font-family="sans-serif" font-size="10" fill="#1E293B">1.5" OD</text><text x="170" y="146" font-family="sans-serif" font-size="10" fill="#1E293B">38.1 mm</text><text x="270" y="146" font-family="sans-serif" font-size="10" fill="#F00078" font-weight="bold">1.65 mm (16G)</text>
          <line x1="30" y1="160" x2="350" y2="160" stroke="#E2E8F0"/>
          <text x="80" y="180" font-family="sans-serif" font-size="10" fill="#1E293B">2" OD</text><text x="170" y="180" font-family="sans-serif" font-size="10" fill="#1E293B">50.8 mm</text><text x="270" y="180" font-family="sans-serif" font-size="10" fill="#F00078" font-weight="bold">1.65 mm (16G)</text>
        </g>
      `
    })
  },

  // 31. RESOURCE: ROUGHNESS GUIDE
  {
    filePath: path.join(assetsDir, 'resources', 'roughness-guide.svg'),
    content: generateSvg({
      title: 'Surface Roughness (Ra) Comparison Guide',
      subtext: 'Electro-Polished (EP) vs Mechanical Polished (MP) Microscopic Profile',
      specBadge: 'ROUGHNESS BENCHMARK',
      graphicContent: `
        <g transform="translate(100, 60)">
          <text x="30" y="45" font-family="sans-serif" font-size="11" font-weight="700" fill="#10263D">Standard Mill: Ra ≈ 1.6 - 3.2 µm</text>
          <path d="M 30,80 L 60,65 L 90,95 L 120,60 L 150,90 L 180,55 L 210,85 L 240,60 L 270,90 L 300,75 L 340,80" fill="none" stroke="#EF4444" stroke-width="3"/>
          <text x="30" y="125" font-family="sans-serif" font-size="11" font-weight="700" fill="#10263D">Mechanical Polish (MP): Ra ≤ 0.8 µm</text>
          <path d="M 30,150 L 80,145 L 130,153 L 180,146 L 230,152 L 280,147 L 340,150" fill="none" stroke="#F59E0B" stroke-width="3"/>
          <text x="30" y="195" font-family="sans-serif" font-size="11" font-weight="700" fill="#F00078">Electro-Polished (EP): Ra ≤ 0.38 µm (Hygienic Biofilm Barrier)</text>
          <line x1="30" y1="215" x2="340" y2="215" stroke="#F00078" stroke-width="4" stroke-linecap="round"/>
        </g>
      `
    })
  },

  // 32. PRODUCT: EPDM GASKET
  {
    filePath: path.join(assetsDir, 'products', 'gaskets', 'epdm-tri-clamp-gasket.svg'),
    content: generateSvg({
      title: 'EPDM Tri-Clamp Sanitary Gasket',
      subtext: 'Black Food-Grade Elastomer • Steam & Hot Water Resistant',
      specBadge: 'FOOD GRADE EPDM',
      graphicContent: `
        <g transform="translate(180, 80)">
          <circle cx="120" cy="130" r="90" fill="none" stroke="#1E293B" stroke-width="32"/>
          <circle cx="120" cy="130" r="108" fill="none" stroke="#334155" stroke-width="4"/>
          <circle cx="120" cy="130" r="72" fill="none" stroke="#334155" stroke-width="2"/>
          <path d="M 60,70 A 90 90 0 0 1 180,70" fill="none" stroke="#475569" stroke-width="6" opacity="0.8"/>
        </g>
      `
    })
  },

  // 33. PRODUCT: PTFE GASKET
  {
    filePath: path.join(assetsDir, 'products', 'gaskets', 'ptfe-tri-clamp-gasket.svg'),
    content: generateSvg({
      title: 'PTFE (Teflon) Tri-Clamp Sanitary Gasket',
      subtext: 'Solid Virgin White Fluoropolymer • Universal Chemical Resistance',
      specBadge: 'VIRGIN PTFE • FDA 21 CFR',
      graphicContent: `
        <g transform="translate(180, 80)">
          <circle cx="120" cy="130" r="90" fill="none" stroke="#FFFFFF" stroke-width="32" stroke-linecap="round"/>
          <circle cx="120" cy="130" r="108" fill="none" stroke="#CBD5E1" stroke-width="4"/>
          <circle cx="120" cy="130" r="72" fill="none" stroke="#CBD5E1" stroke-width="2"/>
          <circle cx="120" cy="130" r="90" fill="none" stroke="#E2E8F0" stroke-width="8"/>
        </g>
      `
    })
  },

  // 34. PRODUCT: SS SANITARY SAMPLING VALVE
  {
    filePath: path.join(assetsDir, 'products', 'valves', 'ss-sanitary-sampling-valve.svg'),
    content: generateSvg({
      title: 'SS Sanitary Aseptic Sampling Valve',
      subtext: 'Aseptic Fluid Extraction from Sterile Vessels • Mini-Clamp & Hose Barb',
      specBadge: 'ASEPTIC SAMPLING • SS 316L',
      graphicContent: `
        <g transform="translate(160, 80)">
          <rect x="40" y="80" width="50" height="60" rx="4" fill="url(#epGrad)" stroke="#334155"/>
          <ellipse cx="40" cy="110" rx="12" ry="30" fill="url(#innerBore)"/>
          <rect x="90" y="60" width="70" height="90" rx="8" fill="url(#ssGrad)" stroke="#1E293B" stroke-width="2"/>
          <rect x="160" y="75" width="40" height="60" rx="6" fill="#F00078"/>
          <path d="M 120,150 L 120,210 L 95,230" fill="none" stroke="url(#epGrad)" stroke-width="16" stroke-linecap="round"/>
        </g>
      `
    })
  },

  // 35. PRODUCT: CUSTOM FABRICATED SPOOLS & MANIFOLDS
  {
    filePath: path.join(assetsDir, 'products', 'accessories', 'custom-assemblies.svg'),
    content: generateSvg({
      title: 'Custom Fabricated Sanitary Spools & Manifolds',
      subtext: 'Drawing-Based High Purity Skid Spools with Orbitally Welded End Ferrules',
      specBadge: 'CUSTOM SPOOLS & MANIFOLDS',
      graphicContent: `
        <g transform="translate(110, 80)">
          <rect x="30" y="100" width="340" height="60" rx="6" fill="url(#epGrad)" stroke="#334155" stroke-width="2"/>
          <rect x="10" y="90" width="20" height="80" rx="4" fill="url(#ssGrad)" stroke="#1E293B"/>
          <rect x="370" y="90" width="20" height="80" rx="4" fill="url(#ssGrad)" stroke="#1E293B"/>
          <rect x="100" y="40" width="30" height="60" fill="url(#epGrad)" stroke="#334155"/>
          <rect x="95" y="30" width="40" height="15" rx="3" fill="url(#ssGrad)"/>
          <rect x="250" y="40" width="30" height="60" fill="url(#epGrad)" stroke="#334155"/>
          <rect x="245" y="30" width="40" height="15" rx="3" fill="url(#ssGrad)"/>
          <line x1="35" y1="115" x2="365" y2="115" stroke="#FFFFFF" stroke-width="3" opacity="0.9"/>
        </g>
      `
    })
  },

  // 36. PRODUCT: ASSORTED SANITARY FITTINGS
  {
    filePath: path.join(assetsDir, 'products', 'fittings', 'ss-316l-sanitary-fittings.svg'),
    content: generateSvg({
      title: 'SS 316L Sanitary Pipe Fittings (Full Assortment)',
      subtext: 'Bends, Equal Tees, Reducers, Ferrules & Clamps Set',
      specBadge: 'ASSORTED FITTINGS SET',
      graphicContent: `
        <g transform="translate(90, 70)">
          <path d="M 40,40 C 110,40 140,70 140,140 L 95,140 C 95,90 75,75 40,75 Z" fill="url(#epGrad)" stroke="#334155" stroke-width="1.5"/>
          <g transform="translate(160, 40)">
            <rect x="0" y="40" width="130" height="40" fill="url(#ssGrad)" stroke="#334155"/>
            <rect x="45" y="0" width="40" height="40" fill="url(#epGrad)" stroke="#334155"/>
          </g>
          <g transform="translate(300, 100)">
            <path d="M 10,10 L 90,25 L 90,65 L 10,80 Z" fill="url(#epGrad)" stroke="#334155"/>
          </g>
          <rect x="60" y="170" width="16" height="50" fill="url(#ssGrad)"/>
          <rect x="76" y="160" width="16" height="70" rx="4" fill="#F00078"/>
          <rect x="92" y="170" width="16" height="50" fill="url(#ssGrad)"/>
        </g>
      `
    })
  }
];

let createdCount = 0;
imagesToCreate.forEach(img => {
  ensureDir(path.dirname(img.filePath));
  fs.writeFileSync(img.filePath, img.content, 'utf8');
  createdCount++;
});

console.log(`Successfully generated ${createdCount} dedicated industrial SVG assets in assets/images/`);
