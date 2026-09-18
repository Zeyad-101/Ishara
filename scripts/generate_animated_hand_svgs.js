import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '../assets/signs');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * High-Quality Animation & Cartoon Style Hand SVG Renderer
 * Replicates the warm flesh tones, shaded volumes, fingernails, and joint creases
 * matching the user's reference images.
 */
function buildAnimationHandSvg({
  title,
  orientationText = 'للمستقبل',
  dots = 0,
  handGraphic,
  motionArrows = '',
  badgeColor = '#0d9488'
}) {
  const dotElements = Array.from({ length: dots }, (_, i) => {
    const cx = 100 - (dots - 1) * 14 + i * 28;
    return `
      <g>
        <circle cx="${cx}" cy="24" r="8" fill="#F59E0B" stroke="#92400E" stroke-width="2" />
        <circle cx="${cx - 2}" cy="22" r="3" fill="#FEF3C7" />
      </g>
    `;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 240" width="100%" height="100%">
  <defs>
    <!-- Skin Gradients (Warm peach / natural cartoon flesh tones) -->
    <linearGradient id="skinBase" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFDFC7" />
      <stop offset="40%" stop-color="#F7BA95" />
      <stop offset="100%" stop-color="#EAA079" />
    </linearGradient>

    <linearGradient id="skinShadow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EAA079" />
      <stop offset="100%" stop-color="#D57D54" />
    </linearGradient>

    <linearGradient id="nailGloss" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
      <stop offset="60%" stop-color="#FFF0E6" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#FCDAD0" stop-opacity="0.2" />
    </linearGradient>

    <!-- Card Background Gradient -->
    <radialGradient id="bgRadial" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="70%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#EDF2F7" />
    </radialGradient>

    <filter id="handDrop" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#7C2D12" flood-opacity="0.12" />
    </filter>
  </defs>

  <!-- Background Card -->
  <rect width="220" height="240" rx="20" fill="url(#bgRadial)" stroke="#E2E8F0" stroke-width="1.5" />

  <!-- Direction / Orientation Tag -->
  <rect x="12" y="12" width="76" height="24" rx="12" fill="#E6FFFA" stroke="#99F6E4" stroke-width="1" />
  <text x="50" y="28" font-family="'Cairo', sans-serif" font-size="11" font-weight="700" fill="#0D9488" text-anchor="middle">
    ${orientationText}
  </text>

  <!-- Floating Dots (Nuqat) -->
  ${dotElements ? `<g id="dots">${dotElements}</g>` : ''}

  <!-- Hand Illustration Graphic -->
  <g filter="url(#handDrop)" stroke="#8C3E1B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    ${handGraphic}
  </g>

  <!-- Motion Overlay -->
  ${motionArrows}

  <!-- Title Pill at Bottom -->
  <rect x="20" y="202" width="180" height="28" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.2" opacity="0.98" />
  <text x="110" y="221" font-family="'Cairo', sans-serif" font-size="12" font-weight="800" fill="#0F172A" text-anchor="middle">
    ${title}
  </text>
</svg>`;
}

// Helpers for drawing cartoon fingers, nails, and creases
function renderFingerExtended(x, y, width, height, nailY, creasesY1, creasesY2, isIndex = false) {
  const r = width / 2;
  return `
    <!-- Finger Body -->
    <path d="M ${x} ${y + height} L ${x} ${y + r} A ${r} ${r} 0 0 1 ${x + width} ${y + r} L ${x + width} ${y + height}" fill="url(#skinBase)" />
    <!-- Fingernail -->
    <rect x="${x + 2.5}" y="${nailY}" width="${width - 5}" height="${width * 0.9}" rx="${(width - 5) / 2}" fill="url(#nailGloss)" stroke="#9A4520" stroke-width="1.2" />
    <path d="M ${x + 4.5} ${nailY + 3} Q ${x + width / 2} ${nailY + 1} ${x + width - 4.5} ${nailY + 3}" stroke="#FFFFFF" stroke-width="1.8" fill="none" />
    <!-- Joint Creases -->
    <path d="M ${x + 3} ${creasesY1} Q ${x + width / 2} ${creasesY1 - 2} ${x + width - 3} ${creasesY1}" stroke="#C86A41" stroke-width="1.8" fill="none" />
    <path d="M ${x + 4} ${creasesY1 + 4} Q ${x + width / 2} ${creasesY1 + 2} ${x + width - 4} ${creasesY1 + 4}" stroke="#C86A41" stroke-width="1.4" fill="none" />
    <path d="M ${x + 3} ${creasesY2} Q ${x + width / 2} ${creasesY2 - 2} ${x + width - 3} ${creasesY2}" stroke="#C86A41" stroke-width="1.8" fill="none" />
  `;
}

function renderCurledKnuckle(x, y, w, h) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w / 2.2}" fill="url(#skinBase)" />
    <!-- Nail of tucked finger -->
    <ellipse cx="${x + w / 2}" cy="${y + h * 0.7}" rx="${w * 0.3}" ry="${h * 0.22}" fill="url(#nailGloss)" stroke="#9A4520" stroke-width="1" />
  `;
}

function renderWristAndPalm(wristY = 150) {
  return `
    <!-- Arm / Wrist -->
    <path d="M 75 ${wristY} L 75 200 L 145 200 L 145 ${wristY} Z" fill="url(#skinShadow)" />
    <!-- Palm Body -->
    <path d="M 55 105 C 55 90, 70 85, 95 85 C 130 85, 160 90, 160 120 C 160 155, 145 170, 110 170 C 75 170, 55 145, 55 105 Z" fill="url(#skinBase)" />
    <!-- Palm Crease / Heart line -->
    <path d="M 75 125 Q 105 145 135 120" stroke="#C86A41" stroke-width="2" fill="none" />
  `;
}

// 1. Generate 31 Alphabet SVGs in Animation Hand Style
const alphabetData = [
  {
    id: 'letter-alif',
    letter: 'أ',
    name: 'الألف',
    dots: 0,
    graphic: `
      ${renderWristAndPalm(145)}
      <!-- Curled Fingers (Middle, Ring, Pinky) -->
      ${renderCurledKnuckle(96, 92, 22, 34)}
      ${renderCurledKnuckle(118, 96, 20, 32)}
      ${renderCurledKnuckle(138, 102, 18, 28)}
      <!-- Index Finger Extended Straight Up -->
      ${renderFingerExtended(72, 30, 24, 85, 34, 65, 88, true)}
      <!-- Curled Thumb across palm -->
      <path d="M 52 115 C 52 100, 75 95, 98 108 C 102 120, 85 138, 65 138 Z" fill="url(#skinBase)" />
      <ellipse cx="86" cy="112" rx="7" ry="5" fill="url(#nailGloss)" stroke="#9A4520" stroke-width="1" />
    `
  },
  {
    id: 'letter-baa',
    letter: 'ب',
    name: 'الباء',
    dots: 1,
    graphic: `
      <!-- Horizontal Hand Curve like reference image -->
      <path d="M 75 160 L 75 200 L 140 200 L 140 160 Z" fill="url(#skinShadow)" />
      <!-- Horizontal Palm Curve -->
      <path d="M 55 120 C 55 75, 165 75, 165 120 C 165 160, 55 160, 55 120 Z" fill="url(#skinBase)" />
      <!-- Curled horizontal fingers -->
      <rect x="65" y="90" width="85" height="24" rx="12" fill="url(#skinBase)" />
      <path d="M 75 110 Q 110 120 145 110" stroke="#C86A41" stroke-width="2" fill="none" />
      <!-- Dot indicator below -->
      <circle cx="110" cy="175" r="10" fill="#F59E0B" stroke="#92400E" stroke-width="2.2" />
      <circle cx="107" cy="172" r="3.5" fill="#FEF3C7" />
    `
  },
  {
    id: 'letter-taa',
    letter: 'ت',
    name: 'التاء',
    dots: 2,
    graphic: `
      <!-- Two fingers up (Peace sign / V-shape gesture like user image!) -->
      ${renderWristAndPalm(145)}
      <!-- Curled ring, pinky -->
      ${renderCurledKnuckle(118, 98, 20, 32)}
      ${renderCurledKnuckle(138, 104, 18, 28)}
      <!-- Index Finger Extended -->
      ${renderFingerExtended(68, 32, 23, 85, 36, 68, 90)}
      <!-- Middle Finger Extended -->
      ${renderFingerExtended(94, 28, 23, 90, 32, 64, 88)}
      <!-- Thumb folded over ring finger -->
      <path d="M 52 118 C 52 102, 75 98, 105 112 C 108 124, 85 142, 65 142 Z" fill="url(#skinBase)" />
      <ellipse cx="94" cy="116" rx="7" ry="5" fill="url(#nailGloss)" stroke="#9A4520" stroke-width="1" />
    `
  },
  {
    id: 'letter-thaa',
    letter: 'ث',
    name: 'الثاء',
    dots: 3,
    graphic: `
      <!-- Three fingers up -->
      ${renderWristAndPalm(145)}
      <!-- Pinky curled -->
      ${renderCurledKnuckle(138, 104, 18, 28)}
      <!-- Index, Middle, Ring extended -->
      ${renderFingerExtended(62, 38, 22, 80, 42, 70, 92)}
      ${renderFingerExtended(87, 30, 22, 88, 34, 65, 88)}
      ${renderFingerExtended(112, 36, 22, 82, 40, 68, 90)}
      <!-- Thumb over pinky -->
      <path d="M 50 120 C 50 105, 75 102, 115 116 C 118 128, 85 145, 65 145 Z" fill="url(#skinBase)" />
    `
  },
  {
    id: 'letter-jeem',
    letter: 'ج',
    name: 'الجيم',
    dots: 1,
    graphic: `
      <!-- Curvature swoop with inner dot -->
      ${renderWristAndPalm(150)}
      <path d="M 65 95 C 65 60, 155 60, 155 105 C 155 140, 115 150, 95 150" fill="none" stroke="url(#skinBase)" stroke-width="26" stroke-linecap="round" />
      <circle cx="108" cy="105" r="9" fill="#F59E0B" stroke="#92400E" stroke-width="2" />
      <circle cx="106" cy="103" r="3" fill="#FEF3C7" />
    `
  },
  {
    id: 'letter-haa',
    letter: 'ح',
    name: 'الحاء',
    dots: 0,
    graphic: `
      <!-- Curvature swoop without dots -->
      ${renderWristAndPalm(150)}
      <path d="M 65 95 C 65 60, 155 60, 155 105 C 155 140, 115 150, 95 150" fill="none" stroke="url(#skinBase)" stroke-width="26" stroke-linecap="round" />
    `
  },
  {
    id: 'letter-khaa',
    letter: 'خ',
    name: 'الخاء',
    dots: 1,
    graphic: `
      ${renderWristAndPalm(150)}
      <path d="M 65 105 C 65 75, 155 75, 155 115 C 155 150, 115 155, 95 155" fill="none" stroke="url(#skinBase)" stroke-width="24" stroke-linecap="round" />
      <!-- Upper extended dot finger -->
      ${renderFingerExtended(98, 30, 22, 60, 34, 55, 75)}
    `
  },
  {
    id: 'letter-daal',
    letter: 'د',
    name: 'الدال',
    dots: 0,
    orientation: 'جانبي',
    graphic: `
      <!-- L-shape facing left -->
      ${renderWristAndPalm(150)}
      <path d="M 145 68 L 85 68 L 85 135" fill="none" stroke="url(#skinBase)" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Fingernail on index tip -->
      <ellipse cx="140" cy="68" rx="5" ry="7" fill="url(#nailGloss)" stroke="#9A4520" stroke-width="1.2" />
    `
  },
  {
    id: 'letter-thaal',
    letter: 'ذ',
    name: 'الذال',
    dots: 1,
    orientation: 'جانبي',
    graphic: `
      ${renderWristAndPalm(150)}
      <path d="M 145 78 L 85 78 L 85 140" fill="none" stroke="url(#skinBase)" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Middle finger up representing top dot -->
      ${renderFingerExtended(92, 28, 20, 52, 32, 52, 70)}
    `
  },
  {
    id: 'letter-raa',
    letter: 'ر',
    name: 'الراء',
    dots: 0,
    orientation: 'للداخل',
    graphic: `
      ${renderWristAndPalm(150)}
      <!-- Downward slope curved index finger -->
      <path d="M 80 65 Q 115 95 128 140" fill="none" stroke="url(#skinBase)" stroke-width="24" stroke-linecap="round" />
      <ellipse cx="126" cy="136" rx="6" ry="8" fill="url(#nailGloss)" stroke="#9A4520" stroke-width="1.2" />
    `,
    motion: `<path d="M 140 100 L 148 118 L 132 116" fill="#0D9488" stroke="#0D9488" stroke-width="2" />`
  },
  {
    id: 'letter-zayn',
    letter: 'ز',
    name: 'الزاي',
    dots: 1,
    orientation: 'للداخل',
    graphic: `
      ${renderWristAndPalm(150)}
      <path d="M 80 65 Q 115 95 128 140" fill="none" stroke="url(#skinBase)" stroke-width="24" stroke-linecap="round" />
      <circle cx="82" cy="45" r="9" fill="#F59E0B" stroke="#92400E" stroke-width="2" />
      <circle cx="80" cy="43" r="3" fill="#FEF3C7" />
    `
  },
  {
    id: 'letter-seen',
    letter: 'س',
    name: 'السين',
    dots: 0,
    orientation: 'للأمام',
    graphic: `
      <!-- Three teeth fingers -->
      ${renderWristAndPalm(145)}
      ${renderCurledKnuckle(138, 102, 18, 28)}
      ${renderFingerExtended(66, 38, 22, 78, 42, 68, 88)}
      ${renderFingerExtended(90, 32, 22, 84, 36, 64, 85)}
      ${renderFingerExtended(114, 38, 22, 78, 42, 68, 88)}
      <path d="M 55 122 Q 85 140 65 142" stroke="#C86A41" stroke-width="2" fill="none" />
    `
  },
  {
    id: 'letter-sheen',
    letter: 'ش',
    name: 'الشين',
    dots: 3,
    orientation: 'للأمام',
    graphic: `
      ${renderWristAndPalm(145)}
      ${renderCurledKnuckle(138, 102, 18, 28)}
      ${renderFingerExtended(66, 42, 22, 74, 46, 70, 90)}
      ${renderFingerExtended(90, 36, 22, 80, 40, 66, 88)}
      ${renderFingerExtended(114, 42, 22, 74, 46, 70, 90)}
    `,
    motion: `
      <path d="M 60 30 Q 70 20 80 30" stroke="#F59E0B" stroke-width="3" fill="none" />
      <path d="M 95 24 Q 105 14 115 24" stroke="#F59E0B" stroke-width="3" fill="none" />
      <path d="M 130 30 Q 140 20 150 30" stroke="#F59E0B" stroke-width="3" fill="none" />
    `
  },
  {
    id: 'letter-saad',
    letter: 'ص',
    name: 'الصاد',
    dots: 0,
    graphic: `
      <!-- Closed Loop Oval with thumb & index -->
      ${renderWristAndPalm(145)}
      <ellipse cx="108" cy="85" rx="32" ry="24" fill="none" stroke="url(#skinBase)" stroke-width="22" />
      ${renderCurledKnuckle(128, 102, 18, 28)}
    `
  },
  {
    id: 'letter-daad',
    letter: 'ض',
    name: 'الضاد',
    dots: 1,
    graphic: `
      ${renderWristAndPalm(145)}
      <ellipse cx="105" cy="88" rx="30" ry="22" fill="none" stroke="url(#skinBase)" stroke-width="20" />
      <!-- Middle finger up for dot -->
      ${renderFingerExtended(112, 32, 20, 55, 36, 56, 76)}
    `
  },
  {
    id: 'letter-taa-makhsoos',
    letter: 'ط',
    name: 'الطاء',
    dots: 0,
    orientation: 'جانبي',
    graphic: `
      ${renderWristAndPalm(150)}
      <!-- Flat base horizontal -->
      <line x1="55" y1="125" x2="155" y2="125" stroke="url(#skinBase)" stroke-width="22" stroke-linecap="round" />
      <!-- Vertical stroke -->
      ${renderFingerExtended(95, 35, 23, 90, 39, 70, 95)}
    `
  },
  {
    id: 'letter-zaa',
    letter: 'ظ',
    name: 'الظاء',
    dots: 1,
    orientation: 'جانبي',
    graphic: `
      ${renderWristAndPalm(150)}
      <line x1="55" y1="125" x2="155" y2="125" stroke="url(#skinBase)" stroke-width="22" stroke-linecap="round" />
      ${renderFingerExtended(90, 38, 22, 88, 42, 72, 95)}
      <circle cx="128" cy="45" r="9" fill="#F59E0B" stroke="#92400E" stroke-width="2" />
    `
  },
  {
    id: 'letter-ayn',
    letter: 'ع',
    name: 'العين',
    dots: 0,
    orientation: 'جانبي',
    graphic: `
      <!-- Open C-shape curve -->
      ${renderWristAndPalm(150)}
      <path d="M 140 65 C 80 55, 75 125, 140 125" fill="none" stroke="url(#skinBase)" stroke-width="24" stroke-linecap="round" />
      <ellipse cx="138" cy="65" rx="6" ry="8" fill="url(#nailGloss)" stroke="#9A4520" stroke-width="1.2" />
    `
  },
  {
    id: 'letter-ghayn',
    letter: 'غ',
    name: 'الغين',
    dots: 1,
    orientation: 'جانبي',
    graphic: `
      ${renderWristAndPalm(150)}
      <path d="M 140 75 C 80 65, 75 130, 140 130" fill="none" stroke="url(#skinBase)" stroke-width="22" stroke-linecap="round" />
      <circle cx="115" cy="38" r="9" fill="#F59E0B" stroke="#92400E" stroke-width="2" />
    `
  },
  {
    id: 'letter-faa',
    letter: 'ف',
    name: 'الفاء',
    dots: 1,
    orientation: 'للأمام',
    graphic: `
      <!-- Circle + 1 dot finger up -->
      ${renderWristAndPalm(150)}
      <circle cx="95" cy="110" r="25" fill="none" stroke="url(#skinBase)" stroke-width="20" />
      ${renderFingerExtended(90, 32, 22, 60, 36, 58, 78)}
    `
  },
  {
    id: 'letter-qaaf',
    letter: 'ق',
    name: 'القاف',
    dots: 2,
    orientation: 'للأمام',
    graphic: `
      ${renderWristAndPalm(150)}
      <circle cx="105" cy="115" r="25" fill="none" stroke="url(#skinBase)" stroke-width="20" />
      ${renderFingerExtended(80, 35, 20, 58, 39, 60, 78)}
      ${renderFingerExtended(106, 35, 20, 58, 39, 60, 78)}
    `
  },
  {
    id: 'letter-kaaf',
    letter: 'ك',
    name: 'الكاف',
    dots: 0,
    graphic: `
      <!-- Chair Hook L-shape facing up -->
      ${renderWristAndPalm(150)}
      <path d="M 75 60 L 75 125 L 145 125" fill="none" stroke="url(#skinBase)" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" />
    `
  },
  {
    id: 'letter-laam',
    letter: 'ل',
    name: 'اللام',
    dots: 0,
    graphic: `
      <!-- Vertical L (like English L) -->
      ${renderWristAndPalm(150)}
      <path d="M 85 35 L 85 125 L 148 125" fill="none" stroke="url(#skinBase)" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Fingernail on index tip -->
      <ellipse cx="85" cy="39" rx="8" ry="6" fill="url(#nailGloss)" stroke="#9A4520" stroke-width="1.2" />
    `
  },
  {
    id: 'letter-meem',
    letter: 'م',
    name: 'الميم',
    dots: 0,
    orientation: 'للأسفل',
    graphic: `
      ${renderWristAndPalm(150)}
      <!-- Downward O circle -->
      <circle cx="105" cy="90" r="26" fill="none" stroke="url(#skinBase)" stroke-width="22" />
      <line x1="128" y1="100" x2="128" y2="148" stroke="url(#skinBase)" stroke-width="20" stroke-linecap="round" />
    `
  },
  {
    id: 'letter-noon',
    letter: 'ن',
    name: 'النون',
    dots: 1,
    orientation: 'للأعلى',
    graphic: `
      ${renderWristAndPalm(150)}
      <!-- Upward cup shape -->
      <path d="M 65 85 C 65 140, 145 140, 145 85" fill="none" stroke="url(#skinBase)" stroke-width="22" stroke-linecap="round" />
      <!-- Central index finger dot -->
      ${renderFingerExtended(94, 45, 22, 60, 49, 68, 88)}
    `
  },
  {
    id: 'letter-haa-isolated',
    letter: 'هـ',
    name: 'الهاء',
    dots: 0,
    orientation: 'للأمام',
    graphic: `
      ${renderWristAndPalm(150)}
      <!-- Double loop infinity -->
      <circle cx="85" cy="95" r="22" fill="none" stroke="url(#skinBase)" stroke-width="18" />
      <circle cx="125" cy="95" r="22" fill="none" stroke="url(#skinBase)" stroke-width="18" />
    `
  },
  {
    id: 'letter-waaw',
    letter: 'و',
    name: 'الواو',
    dots: 0,
    orientation: 'للداخل',
    graphic: `
      ${renderWristAndPalm(150)}
      <!-- Circle with tail -->
      <circle cx="92" cy="80" r="24" fill="none" stroke="url(#skinBase)" stroke-width="20" />
      <path d="M 100 98 Q 130 115 118 148" fill="none" stroke="url(#skinBase)" stroke-width="20" stroke-linecap="round" />
    `
  },
  {
    id: 'letter-yaa',
    letter: 'ي',
    name: 'الياء',
    dots: 2,
    orientation: 'للأسفل',
    graphic: `
      ${renderWristAndPalm(150)}
      <path d="M 68 80 Q 105 100 142 80" stroke="url(#skinBase)" stroke-width="22" fill="none" stroke-linecap="round" />
      <!-- Two fingers pointing downward for dots -->
      <rect x="80" y="105" width="18" height="48" rx="9" fill="url(#skinBase)" />
      <rect x="106" y="105" width="18" height="48" rx="9" fill="url(#skinBase)" />
    `
  },
  {
    id: 'letter-hamza',
    letter: 'ء',
    name: 'الهمزة',
    dots: 0,
    orientation: 'أمام الصدر',
    graphic: `
      ${renderWristAndPalm(150)}
      <!-- Pinch grip -->
      <circle cx="108" cy="92" r="22" fill="url(#skinBase)" />
      <path d="M 108 105 L 92 128" stroke="url(#skinBase)" stroke-width="16" stroke-linecap="round" />
    `,
    motion: `
      <path d="M 135 80 A 22 22 0 1 1 120 68" stroke="#F59E0B" stroke-width="4.5" fill="none" stroke-linecap="round" />
      <polygon points="120,60 132,68 120,76" fill="#F59E0B" />
    `
  },
  {
    id: 'letter-taa-marbuta',
    letter: 'ة',
    name: 'التاء المربوطة',
    dots: 2,
    graphic: `
      ${renderWristAndPalm(150)}
      <circle cx="108" cy="110" r="26" fill="none" stroke="url(#skinBase)" stroke-width="20" />
      ${renderFingerExtended(88, 38, 18, 48, 42, 60, 75)}
      ${renderFingerExtended(112, 38, 18, 48, 42, 60, 75)}
    `
  },
  {
    id: 'letter-laam-alif',
    letter: 'لا',
    name: 'لام ألف',
    dots: 0,
    graphic: `
      ${renderWristAndPalm(150)}
      <!-- Crossed index and middle fingers -->
      <line x1="75" y1="42" x2="135" y2="138" stroke="url(#skinBase)" stroke-width="22" stroke-linecap="round" />
      <line x1="135" y1="42" x2="75" y2="138" stroke="url(#skinBase)" stroke-width="22" stroke-linecap="round" />
    `
  }
];

alphabetData.forEach(item => {
  const svg = buildAnimationHandSvg({
    title: `${item.name} (${item.letter})`,
    orientationText: item.orientation || 'للمستقبل',
    dots: item.dots || 0,
    handGraphic: item.graphic,
    motionArrows: item.motion || ''
  });
  fs.writeFileSync(path.join(outputDir, `${item.id}.svg`), svg, 'utf-8');
});

console.log(`Updated ${alphabetData.length} Alphabet Hand SVGs to Animation Style.`);

// 2. Numbers SVGs in Animation Hand Style
const numbersData = [
  {
    id: 'num-1',
    title: 'رقم (1) — واحد',
    orientation: 'للصدر',
    graphic: `
      ${renderWristAndPalm(145)}
      ${renderCurledKnuckle(96, 92, 22, 34)}
      ${renderCurledKnuckle(118, 96, 20, 32)}
      ${renderCurledKnuckle(138, 102, 18, 28)}
      ${renderFingerExtended(72, 32, 24, 85, 36, 68, 90)}
      <path d="M 52 115 C 52 100, 75 95, 98 108 C 102 120, 85 138, 65 138 Z" fill="url(#skinBase)" />
    `
  },
  {
    id: 'num-2',
    title: 'رقم (2) — اثنان',
    orientation: 'للصدر',
    graphic: `
      ${renderWristAndPalm(145)}
      ${renderCurledKnuckle(118, 98, 20, 32)}
      ${renderCurledKnuckle(138, 104, 18, 28)}
      ${renderFingerExtended(68, 32, 23, 85, 36, 68, 90)}
      ${renderFingerExtended(94, 28, 23, 90, 32, 64, 88)}
      <path d="M 52 118 C 52 102, 75 98, 105 112 C 108 124, 85 142, 65 142 Z" fill="url(#skinBase)" />
    `
  },
  {
    id: 'num-3',
    title: 'رقم (3) — ثلاثة',
    orientation: 'للصدر',
    graphic: `
      ${renderWristAndPalm(145)}
      ${renderCurledKnuckle(138, 104, 18, 28)}
      ${renderFingerExtended(62, 38, 22, 80, 42, 70, 92)}
      ${renderFingerExtended(87, 30, 22, 88, 34, 65, 88)}
      ${renderFingerExtended(112, 36, 22, 82, 40, 68, 90)}
      <path d="M 50 120 C 50 105, 75 102, 115 116 C 118 128, 85 145, 65 145 Z" fill="url(#skinBase)" />
    `
  },
  {
    id: 'num-5',
    title: 'رقم (5) — خمسة',
    orientation: 'للصدر',
    graphic: `
      ${renderWristAndPalm(145)}
      ${renderFingerExtended(50, 52, 20, 70, 56, 80, 100)}
      ${renderFingerExtended(72, 38, 21, 80, 42, 70, 92)}
      ${renderFingerExtended(95, 30, 21, 88, 34, 65, 88)}
      ${renderFingerExtended(118, 36, 21, 82, 40, 68, 90)}
      ${renderFingerExtended(140, 50, 19, 72, 54, 78, 98)}
    `
  },
  {
    id: 'num-10',
    title: 'رقم (10) — انزلاق لليسار',
    orientation: 'للصدر',
    graphic: `
      ${renderWristAndPalm(145)}
      ${renderFingerExtended(85, 38, 23, 85, 42, 72, 95)}
    `,
    motion: `
      <path d="M 155 110 L 60 110" stroke="#F59E0B" stroke-width="6" stroke-linecap="round" stroke-dasharray="6,4" />
      <polygon points="48,110 65,100 65,120" fill="#F59E0B" />
    `
  },
  {
    id: 'num-20',
    title: 'رقم (20) — انزلاق لليسار',
    orientation: 'للصدر',
    graphic: `
      ${renderWristAndPalm(145)}
      ${renderFingerExtended(75, 36, 22, 85, 40, 70, 92)}
      ${renderFingerExtended(100, 32, 22, 90, 36, 66, 88)}
    `,
    motion: `
      <path d="M 155 110 L 60 110" stroke="#F59E0B" stroke-width="6" stroke-linecap="round" stroke-dasharray="6,4" />
      <polygon points="48,110 65,100 65,120" fill="#F59E0B" />
    `
  },
  {
    id: 'num-100',
    title: 'رقم (100) — ارتداد رأسي',
    orientation: 'للصدر',
    graphic: `
      ${renderWristAndPalm(145)}
      ${renderFingerExtended(85, 42, 23, 82, 46, 75, 96)}
    `,
    motion: `
      <path d="M 45 75 L 45 135" stroke="#F59E0B" stroke-width="5" stroke-linecap="round" />
      <polygon points="45,65 37,78 53,78" fill="#F59E0B" />
      <polygon points="45,145 37,132 53,132" fill="#F59E0B" />
    `
  },
  {
    id: 'num-1000',
    title: 'رقم (1000) — دوائر أصفار',
    orientation: 'للصدر',
    graphic: `
      ${renderWristAndPalm(145)}
      ${renderFingerExtended(85, 42, 23, 82, 46, 75, 96)}
    `,
    motion: `
      <circle cx="155" cy="85" r="18" stroke="#F59E0B" stroke-width="4.5" fill="none" stroke-dasharray="5,4" />
      <circle cx="168" cy="120" r="14" stroke="#F59E0B" stroke-width="4" fill="none" stroke-dasharray="4,3" />
    `
  }
];

numbersData.forEach(item => {
  const svg = buildAnimationHandSvg({
    title: item.title,
    orientationText: item.orientation || 'للصدر',
    dots: 0,
    handGraphic: item.graphic,
    motionArrows: item.motion || ''
  });
  fs.writeFileSync(path.join(outputDir, `${item.id}.svg`), svg, 'utf-8');
});

console.log(`Updated ${numbersData.length} Numbers Hand SVGs to Animation Style.`);

// 3. Vocabulary SVGs in Animation Hand Style
const content = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/content.json'), 'utf-8'));

content.vocabulary.forEach(item => {
  let graphic = `${renderWristAndPalm(145)}${renderFingerExtended(85, 35, 24, 85, 39, 70, 92)}`;
  let motion = '';
  let orientation = 'للأمام';

  if (item.id === 'ana') {
    orientation = 'نحو الصدر';
    graphic = `
      ${renderWristAndPalm(145)}
      ${renderFingerExtended(88, 48, 24, 80, 52, 78, 98)}
    `;
    motion = `<circle cx="100" cy="125" r="16" fill="#F59E0B" opacity="0.35" /><polygon points="100,112 90,132 110,132" fill="#F59E0B" />`;
  } else if (item.id === 'enta') {
    orientation = 'نحو المخاطب';
    graphic = `
      ${renderWristAndPalm(145)}
      ${renderFingerExtended(88, 30, 24, 90, 34, 68, 92)}
    `;
    motion = `<path d="M 100 22 L 100 5" stroke="#F59E0B" stroke-width="5" /><polygon points="100,-2 92,10 108,10" fill="#F59E0B" />`;
  } else if (item.id === 'eh') {
    orientation = 'كف لأعلى';
    graphic = `
      ${renderWristAndPalm(150)}
      <ellipse cx="110" cy="110" rx="45" ry="26" fill="url(#skinBase)" />
      <path d="M 75 110 Q 110 130 145 110" stroke="#C86A41" stroke-width="2" fill="none" />
    `;
    motion = `<text x="110" y="60" font-size="38" fill="#F59E0B" text-anchor="middle" font-weight="900">؟</text>`;
  } else if (item.id === 'shokran') {
    orientation = 'للأمام';
    graphic = `
      ${renderWristAndPalm(145)}
      ${renderFingerExtended(68, 40, 18, 75, 44, 70, 90)}
      ${renderFingerExtended(88, 32, 19, 85, 36, 65, 88)}
      ${renderFingerExtended(109, 36, 19, 80, 40, 68, 90)}
      ${renderFingerExtended(130, 45, 18, 70, 49, 74, 92)}
    `;
    motion = `<path d="M 105 135 L 105 168" stroke="#F59E0B" stroke-width="5" /><polygon points="105,178 96,162 114,162" fill="#F59E0B" />`;
  } else if (item.id === 'aasef') {
    orientation = 'فوق القلب';
    graphic = `
      ${renderWristAndPalm(150)}
      <!-- Gentle fist -->
      <ellipse cx="110" cy="105" rx="34" ry="28" fill="url(#skinBase)" />
      <path d="M 85 105 Q 110 120 135 105" stroke="#C86A41" stroke-width="2" fill="none" />
    `;
    motion = `<path d="M 110 65 A 40 40 0 1 1 75 102" stroke="#F59E0B" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-dasharray="6,4" />`;
  } else if (item.id === 'beit') {
    orientation = 'سقف مثلث';
    graphic = `
      <path d="M 55 135 L 110 65 L 165 135" fill="none" stroke="url(#skinBase)" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" />
      <ellipse cx="110" cy="65" rx="8" ry="6" fill="url(#nailGloss)" stroke="#9A4520" stroke-width="1.2" />
    `;
  } else if (item.category_id === 'food') {
    orientation = 'نحو الفم';
    graphic = `
      ${renderWristAndPalm(150)}
      <circle cx="108" cy="90" r="28" fill="url(#skinBase)" />
      <ellipse cx="108" cy="85" rx="10" ry="8" fill="url(#nailGloss)" stroke="#9A4520" stroke-width="1" />
    `;
    motion = `<polygon points="108,48 98,64 118,64" fill="#F59E0B" />`;
  } else if (item.category_id === 'family') {
    orientation = 'الرأس / الذقن';
    graphic = `
      ${renderWristAndPalm(150)}
      ${renderFingerExtended(88, 38, 22, 80, 42, 70, 92)}
    `;
    motion = `<circle cx="110" cy="80" r="32" stroke="#F59E0B" stroke-width="3.5" fill="none" stroke-dasharray="5,4" />`;
  } else if (item.category_id === 'time') {
    orientation = item.id.includes('embareh') ? 'للخلف (الماضي)' : 'للأمام (المستقبل)';
    graphic = `
      ${renderWristAndPalm(145)}
      ${renderFingerExtended(88, 40, 22, 80, 44, 72, 92)}
    `;
    motion = item.id.includes('embareh')
      ? `<path d="M 90 70 L 45 70 M 55 60 L 45 70 L 55 80" stroke="#F59E0B" stroke-width="5" fill="none" stroke-linecap="round" />`
      : `<path d="M 115 70 L 160 70 M 150 60 L 160 70 L 150 80" stroke="#F59E0B" stroke-width="5" fill="none" stroke-linecap="round" />`;
  }

  const svg = buildAnimationHandSvg({
    title: `${item.word_ar_eg} (${item.sign_type})`,
    orientationText: orientation,
    dots: 0,
    handGraphic: graphic,
    motionArrows: motion
  });

  fs.writeFileSync(path.join(outputDir, `sign-${item.id}.svg`), svg, 'utf-8');
});

console.log(`Updated all ${content.vocabulary.length} Vocabulary Hand SVGs to Animation Style.`);
