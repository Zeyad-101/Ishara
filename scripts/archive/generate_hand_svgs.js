import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '../assets/signs');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Master SVG Template generator with consistent high-contrast, authentic styling
function createHandSvg({ title, letterOrSymbol, glyphIcon, fingersDescription, motion = '', dots = 0, orientation = 'المستقبل' }) {
  const dotElements = Array.from({ length: dots }, (_, i) => {
    const cx = 100 - (dots - 1) * 12 + i * 24;
    return `<circle cx="${cx}" cy="30" r="5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5" />`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="handGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d9488" />
      <stop offset="100%" stop-color="#115e59" />
    </linearGradient>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#f1f5f9" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.15" />
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="200" height="200" rx="20" fill="url(#bgGrad)" stroke="#e2e8f0" stroke-width="2" />

  <!-- Direction / Orientation Badge -->
  <rect x="12" y="12" width="70" height="22" rx="11" fill="#ccfbf1" />
  <text x="47" y="27" font-family="'Cairo', sans-serif" font-size="10" font-weight="700" fill="#0f766e" text-anchor="middle">
    ${orientation}
  </text>

  <!-- Dots Visualizer -->
  ${dotElements ? `<g id="dots">${dotElements}</g>` : ''}

  <!-- Hand Graphic Container -->
  <g filter="url(#shadow)">
    <!-- Palm base -->
    <rect x="65" y="90" width="70" height="75" rx="24" fill="url(#handGrad)" />
    <!-- Wrist -->
    <path d="M78 160 L78 190 L122 190 L122 160 Z" fill="#0f766e" />

    <!-- Fingers Visualization Dynamic Content -->
    ${glyphIcon}
  </g>

  <!-- Motion arrow / annotation if present -->
  ${motion}

  <!-- Bottom Title Tag -->
  <rect x="25" y="165" width="150" height="26" rx="6" fill="#ffffff" opacity="0.95" stroke="#cbd5e1" stroke-width="1" />
  <text x="100" y="182" font-family="'Cairo', sans-serif" font-size="12" font-weight="800" fill="#0f172a" text-anchor="middle">
    ${title}
  </text>
</svg>`;
}

// 1. Letters definitions
const alphabetDefinitions = [
  {
    id: 'letter-alif',
    letter: 'أ',
    name: 'الألف',
    dots: 0,
    orientation: 'للمستقبل',
    glyph: `
      <!-- Single Index Finger Straight Up -->
      <rect x="91" y="32" width="18" height="65" rx="9" fill="url(#handGrad)" stroke="#0d9488" stroke-width="1" />
      <!-- Thumb curled -->
      <circle cx="68" cy="115" r="13" fill="#0f766e" />
    `
  },
  {
    id: 'letter-baa',
    letter: 'ب',
    name: 'الباء',
    dots: 1,
    orientation: 'للمستقبل',
    glyph: `
      <!-- Horizontal Hand Curve -->
      <path d="M60 110 C 60 75, 140 75, 140 110" fill="none" stroke="#0d9488" stroke-width="18" stroke-linecap="round" />
      <!-- Dot indicator below -->
      <circle cx="100" cy="140" r="8" fill="#f59e0b" stroke="#ffffff" stroke-width="2" />
    `
  },
  {
    id: 'letter-taa',
    letter: 'ت',
    name: 'التاء',
    dots: 2,
    orientation: 'للمستقبل',
    glyph: `
      <!-- Two fingers up for 2 dots -->
      <rect x="80" y="42" width="16" height="55" rx="8" fill="url(#handGrad)" />
      <rect x="104" y="42" width="16" height="55" rx="8" fill="url(#handGrad)" />
      <!-- Horizontal curve base -->
      <path d="M65 110 Q 100 130 135 110" fill="none" stroke="#0f766e" stroke-width="14" stroke-linecap="round" />
    `
  },
  {
    id: 'letter-thaa',
    letter: 'ث',
    name: 'الثاء',
    dots: 3,
    orientation: 'للمستقبل',
    glyph: `
      <!-- Three fingers up for 3 dots -->
      <rect x="68" y="45" width="16" height="52" rx="8" fill="url(#handGrad)" />
      <rect x="92" y="38" width="16" height="59" rx="8" fill="url(#handGrad)" />
      <rect x="116" y="45" width="16" height="52" rx="8" fill="url(#handGrad)" />
    `
  },
  {
    id: 'letter-jeem',
    letter: 'ج',
    name: 'الجيم',
    dots: 1,
    orientation: 'للمستقبل',
    glyph: `
      <!-- Curvature swoop with inner dot -->
      <path d="M125 70 C 130 120, 70 110, 75 145" fill="none" stroke="url(#handGrad)" stroke-width="18" stroke-linecap="round" />
      <circle cx="98" cy="108" r="8" fill="#f59e0b" stroke="#ffffff" stroke-width="2" />
    `
  },
  {
    id: 'letter-haa',
    letter: 'ح',
    name: 'الحاء',
    dots: 0,
    orientation: 'للمستقبل',
    glyph: `
      <!-- Curvature swoop without dots -->
      <path d="M125 70 C 130 120, 70 110, 75 145" fill="none" stroke="url(#handGrad)" stroke-width="18" stroke-linecap="round" />
      <circle cx="98" cy="108" r="7" fill="#cbd5e1" stroke="#94a3b8" stroke-dasharray="2,2" stroke-width="1.5" />
    `
  },
  {
    id: 'letter-khaa',
    letter: 'خ',
    name: 'الخاء',
    dots: 1,
    orientation: 'للمستقبل',
    glyph: `
      <!-- Curvature swoop with upper dot -->
      <path d="M125 80 C 130 125, 70 115, 75 145" fill="none" stroke="url(#handGrad)" stroke-width="18" stroke-linecap="round" />
      <rect x="92" y="35" width="16" height="42" rx="8" fill="#f59e0b" />
    `
  },
  {
    id: 'letter-daal',
    letter: 'د',
    name: 'الدال',
    dots: 0,
    orientation: 'جانبي',
    glyph: `
      <!-- L-shape facing left -->
      <path d="M125 55 L 85 55 L 85 115" fill="none" stroke="url(#handGrad)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" />
    `
  },
  {
    id: 'letter-thaal',
    letter: 'ذ',
    name: 'الذال',
    dots: 1,
    orientation: 'جانبي',
    glyph: `
      <!-- L-shape + dot finger -->
      <path d="M125 65 L 85 65 L 85 115" fill="none" stroke="url(#handGrad)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" />
      <rect x="100" y="30" width="14" height="32" rx="7" fill="#f59e0b" />
    `
  },
  {
    id: 'letter-raa',
    letter: 'ر',
    name: 'الراء',
    dots: 0,
    orientation: 'للداخل',
    glyph: `
      <!-- Downward slope curve -->
      <path d="M85 50 Q 115 85 125 130" fill="none" stroke="url(#handGrad)" stroke-width="18" stroke-linecap="round" />
    `,
    motion: `<path d="M130 95 L 138 115 L 120 112" fill="#0d9488" />`
  },
  {
    id: 'letter-zayn',
    letter: 'ز',
    name: 'الزاي',
    dots: 1,
    orientation: 'للداخل',
    glyph: `
      <path d="M85 50 Q 115 85 125 130" fill="none" stroke="url(#handGrad)" stroke-width="18" stroke-linecap="round" />
      <circle cx="85" cy="38" r="8" fill="#f59e0b" stroke="#ffffff" stroke-width="2" />
    `
  },
  {
    id: 'letter-seen',
    letter: 'س',
    name: 'السين',
    dots: 0,
    orientation: 'للأمام',
    glyph: `
      <!-- Three teeth fingers -->
      <rect x="70" y="42" width="15" height="52" rx="7" fill="url(#handGrad)" />
      <rect x="92" y="40" width="15" height="54" rx="7" fill="url(#handGrad)" />
      <rect x="114" y="42" width="15" height="52" rx="7" fill="url(#handGrad)" />
    `
  },
  {
    id: 'letter-sheen',
    letter: 'ش',
    name: 'الشين',
    dots: 3,
    orientation: 'للأمام',
    glyph: `
      <!-- Three teeth + dots vibration -->
      <rect x="70" y="48" width="15" height="48" rx="7" fill="url(#handGrad)" />
      <rect x="92" y="46" width="15" height="50" rx="7" fill="url(#handGrad)" />
      <rect x="114" y="48" width="15" height="48" rx="7" fill="url(#handGrad)" />
    `,
    motion: `
      <path d="M60 40 Q 65 30 75 40" stroke="#f59e0b" stroke-width="3" fill="none" />
      <path d="M90 35 Q 100 25 110 35" stroke="#f59e0b" stroke-width="3" fill="none" />
      <path d="M125 40 Q 135 30 140 40" stroke="#f59e0b" stroke-width="3" fill="none" />
    `
  },
  {
    id: 'letter-saad',
    letter: 'ص',
    name: 'الصاد',
    dots: 0,
    orientation: 'للمستقبل',
    glyph: `
      <!-- Closed Loop Oval -->
      <ellipse cx="100" cy="85" rx="30" ry="22" fill="none" stroke="url(#handGrad)" stroke-width="16" />
    `
  },
  {
    id: 'letter-daad',
    letter: 'ض',
    name: 'الضاد',
    dots: 1,
    orientation: 'للمستقبل',
    glyph: `
      <ellipse cx="100" cy="88" rx="28" ry="20" fill="none" stroke="url(#handGrad)" stroke-width="16" />
      <rect x="108" y="35" width="15" height="35" rx="7" fill="#f59e0b" />
    `
  },
  {
    id: 'letter-taa-makhsoos',
    letter: 'ط',
    name: 'الطاء',
    dots: 0,
    orientation: 'جانبي',
    glyph: `
      <!-- Vertical on Flat -->
      <line x1="60" y1="120" x2="140" y2="120" stroke="#0f766e" stroke-width="16" stroke-linecap="round" />
      <line x1="90" y1="40" x2="90" y2="120" stroke="url(#handGrad)" stroke-width="16" stroke-linecap="round" />
    `
  },
  {
    id: 'letter-zaa',
    letter: 'ظ',
    name: 'الظاء',
    dots: 1,
    orientation: 'جانبي',
    glyph: `
      <line x1="60" y1="120" x2="140" y2="120" stroke="#0f766e" stroke-width="16" stroke-linecap="round" />
      <line x1="85" y1="45" x2="85" y2="120" stroke="url(#handGrad)" stroke-width="16" stroke-linecap="round" />
      <circle cx="115" cy="50" r="9" fill="#f59e0b" stroke="#ffffff" stroke-width="2" />
    `
  },
  {
    id: 'letter-ayn',
    letter: 'ع',
    name: 'العين',
    dots: 0,
    orientation: 'جانبي',
    glyph: `
      <!-- Open C shape -->
      <path d="M125 55 C 80 50, 75 110, 125 110" fill="none" stroke="url(#handGrad)" stroke-width="18" stroke-linecap="round" />
    `
  },
  {
    id: 'letter-ghayn',
    letter: 'غ',
    name: 'الغين',
    dots: 1,
    orientation: 'جانبي',
    glyph: `
      <path d="M125 65 C 80 60, 75 115, 125 115" fill="none" stroke="url(#handGrad)" stroke-width="18" stroke-linecap="round" />
      <circle cx="105" cy="40" r="9" fill="#f59e0b" stroke="#ffffff" stroke-width="2" />
    `
  },
  {
    id: 'letter-faa',
    letter: 'ف',
    name: 'الفاء',
    dots: 1,
    orientation: 'للأمام',
    glyph: `
      <!-- Circle + 1 dot finger up -->
      <circle cx="95" cy="100" r="22" fill="none" stroke="url(#handGrad)" stroke-width="14" />
      <rect x="88" y="35" width="14" height="42" rx="7" fill="#f59e0b" />
    `
  },
  {
    id: 'letter-qaaf',
    letter: 'ق',
    name: 'القاف',
    dots: 2,
    orientation: 'للأمام',
    glyph: `
      <!-- Circle + 2 dot fingers up -->
      <circle cx="100" cy="105" r="22" fill="none" stroke="url(#handGrad)" stroke-width="14" />
      <rect x="80" y="38" width="14" height="42" rx="7" fill="#f59e0b" />
      <rect x="105" y="38" width="14" height="42" rx="7" fill="#f59e0b" />
    `
  },
  {
    id: 'letter-kaaf',
    letter: 'ك',
    name: 'الكاف',
    dots: 0,
    orientation: 'للمستقبل',
    glyph: `
      <!-- Chair Hook L-shape facing up -->
      <path d="M75 55 L 75 110 L 130 110" fill="none" stroke="url(#handGrad)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" />
    `
  },
  {
    id: 'letter-laam',
    letter: 'ل',
    name: 'اللام',
    dots: 0,
    orientation: 'للمستقبل',
    glyph: `
      <!-- Vertical L -->
      <path d="M85 35 L 85 115 L 135 115" fill="none" stroke="url(#handGrad)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" />
    `
  },
  {
    id: 'letter-meem',
    letter: 'م',
    name: 'الميم',
    dots: 0,
    orientation: 'للأسفل',
    glyph: `
      <!-- Downward circle -->
      <circle cx="100" cy="85" r="24" fill="none" stroke="url(#handGrad)" stroke-width="16" />
      <line x1="120" y1="95" x2="120" y2="135" stroke="url(#handGrad)" stroke-width="14" stroke-linecap="round" />
    `
  },
  {
    id: 'letter-noon',
    letter: 'ن',
    name: 'النون',
    dots: 1,
    orientation: 'للأعلى',
    glyph: `
      <!-- Upward cup + central dot finger -->
      <path d="M65 80 C 65 130, 135 130, 135 80" fill="none" stroke="url(#handGrad)" stroke-width="16" stroke-linecap="round" />
      <rect x="93" y="48" width="14" height="42" rx="7" fill="#f59e0b" />
    `
  },
  {
    id: 'letter-haa-isolated',
    letter: 'هـ',
    name: 'الهاء',
    dots: 0,
    orientation: 'للأمام',
    glyph: `
      <!-- Double loop infinity -->
      <circle cx="82" cy="90" r="18" fill="none" stroke="url(#handGrad)" stroke-width="12" />
      <circle cx="118" cy="90" r="18" fill="none" stroke="url(#handGrad)" stroke-width="12" />
    `
  },
  {
    id: 'letter-waaw',
    letter: 'و',
    name: 'الواو',
    dots: 0,
    orientation: 'للداخل',
    glyph: `
      <!-- Circle with tail -->
      <circle cx="88" cy="75" r="20" fill="none" stroke="url(#handGrad)" stroke-width="14" />
      <path d="M95 90 Q 120 105 110 135" fill="none" stroke="url(#handGrad)" stroke-width="14" stroke-linecap="round" />
    `
  },
  {
    id: 'letter-yaa',
    letter: 'ي',
    name: 'الياء',
    dots: 2,
    orientation: 'للأسفل',
    glyph: `
      <!-- Hand sweeps back with 2 fingers pointing down -->
      <rect x="82" y="105" width="14" height="42" rx="7" fill="#f59e0b" />
      <rect x="104" y="105" width="14" height="42" rx="7" fill="#f59e0b" />
      <path d="M70 70 Q 100 85 130 70" stroke="url(#handGrad)" stroke-width="16" fill="none" stroke-linecap="round" />
    `
  },
  {
    id: 'letter-hamza',
    letter: 'ء',
    name: 'الهمزة',
    dots: 0,
    orientation: 'أمام الصدر',
    glyph: `
      <!-- Pinch with sharp twisting arrow -->
      <circle cx="100" cy="85" r="16" fill="url(#handGrad)" />
      <path d="M100 95 L 85 115" stroke="url(#handGrad)" stroke-width="10" stroke-linecap="round" />
    `,
    motion: `<path d="M125 75 A 18 18 0 1 1 115 65" stroke="#f59e0b" stroke-width="4" fill="none" stroke-linecap="round" />`
  },
  {
    id: 'letter-taa-marbuta',
    letter: 'ة',
    name: 'التاء المربوطة',
    dots: 2,
    orientation: 'للمستقبل',
    glyph: `
      <circle cx="100" cy="98" r="22" fill="none" stroke="url(#handGrad)" stroke-width="14" />
      <rect x="85" y="42" width="13" height="32" rx="6" fill="#f59e0b" />
      <rect x="104" y="42" width="13" height="32" rx="6" fill="#f59e0b" />
    `
  },
  {
    id: 'letter-laam-alif',
    letter: 'لا',
    name: 'لام ألف',
    dots: 0,
    orientation: 'للمستقبل',
    glyph: `
      <!-- Crossed fingers -->
      <line x1="75" y1="45" x2="125" y2="125" stroke="url(#handGrad)" stroke-width="16" stroke-linecap="round" />
      <line x1="125" y1="45" x2="75" y2="125" stroke="url(#handGrad)" stroke-width="16" stroke-linecap="round" />
    `
  }
];

alphabetDefinitions.forEach(item => {
  const svg = createHandSvg({
    title: `${item.name} (${item.letter})`,
    letterOrSymbol: item.letter,
    glyphIcon: item.glyph,
    motion: item.motion || '',
    dots: item.dots,
    orientation: item.orientation
  });
  fs.writeFileSync(path.join(outputDir, `${item.id}.svg`), svg, 'utf-8');
});

console.log(`Generated ${alphabetDefinitions.length} Alphabet Hand SVGs.`);

// 2. Numbers definitions
const numberDefinitions = [
  {
    id: 'num-1',
    title: 'رقم (1) — واحد',
    orientation: 'للصدر',
    glyph: `<rect x="92" y="35" width="16" height="65" rx="8" fill="url(#handGrad)" />`
  },
  {
    id: 'num-2',
    title: 'رقم (2) — اثنان',
    orientation: 'للصدر',
    glyph: `
      <rect x="80" y="38" width="16" height="62" rx="8" fill="url(#handGrad)" />
      <rect x="104" y="38" width="16" height="62" rx="8" fill="url(#handGrad)" />
    `
  },
  {
    id: 'num-3',
    title: 'رقم (3) — ثلاثة',
    orientation: 'للصدر',
    glyph: `
      <rect x="68" y="40" width="15" height="60" rx="7" fill="url(#handGrad)" />
      <rect x="92" y="35" width="15" height="65" rx="7" fill="url(#handGrad)" />
      <rect x="116" y="40" width="15" height="60" rx="7" fill="url(#handGrad)" />
    `
  },
  {
    id: 'num-5',
    title: 'رقم (5) — خمسة',
    orientation: 'للصدر',
    glyph: `
      <rect x="58" y="55" width="13" height="48" rx="6" fill="url(#handGrad)" />
      <rect x="76" y="42" width="13" height="60" rx="6" fill="url(#handGrad)" />
      <rect x="94" y="36" width="13" height="66" rx="6" fill="url(#handGrad)" />
      <rect x="112" y="42" width="13" height="60" rx="6" fill="url(#handGrad)" />
      <rect x="130" y="55" width="13" height="48" rx="6" fill="url(#handGrad)" />
    `
  },
  {
    id: 'num-10',
    title: 'رقم (10) — انزلاق لليسار',
    orientation: 'للصدر',
    glyph: `<rect x="92" y="40" width="16" height="60" rx="8" fill="url(#handGrad)" />`,
    motion: `
      <path d="M145 100 L 60 100" stroke="#f59e0b" stroke-width="6" stroke-linecap="round" stroke-dasharray="6,4" />
      <polygon points="50,100 65,92 65,108" fill="#f59e0b" />
    `
  },
  {
    id: 'num-20',
    title: 'رقم (20) — انزلاق لليسار',
    orientation: 'للصدر',
    glyph: `
      <rect x="82" y="40" width="15" height="60" rx="7" fill="url(#handGrad)" />
      <rect x="104" y="40" width="15" height="60" rx="7" fill="url(#handGrad)" />
    `,
    motion: `
      <path d="M145 100 L 60 100" stroke="#f59e0b" stroke-width="6" stroke-linecap="round" stroke-dasharray="6,4" />
      <polygon points="50,100 65,92 65,108" fill="#f59e0b" />
    `
  },
  {
    id: 'num-100',
    title: 'رقم (100) — ارتداد رأسي',
    orientation: 'للصدر',
    glyph: `<rect x="92" y="45" width="16" height="55" rx="8" fill="url(#handGrad)" />`,
    motion: `
      <path d="M45 70 L 45 125" stroke="#f59e0b" stroke-width="5" stroke-linecap="round" />
      <polygon points="45,60 38,72 52,72" fill="#f59e0b" />
      <polygon points="45,135 38,123 52,123" fill="#f59e0b" />
    `
  },
  {
    id: 'num-1000',
    title: 'رقم (1000) — دوائر أصفار',
    orientation: 'للصدر',
    glyph: `<rect x="92" y="45" width="16" height="55" rx="8" fill="url(#handGrad)" />`,
    motion: `
      <circle cx="145" cy="85" r="16" stroke="#f59e0b" stroke-width="4" fill="none" stroke-dasharray="4,3" />
      <circle cx="155" cy="115" r="12" stroke="#f59e0b" stroke-width="3" fill="none" stroke-dasharray="3,2" />
    `
  }
];

numberDefinitions.forEach(item => {
  const svg = createHandSvg({
    title: item.title,
    letterOrSymbol: '#',
    glyphIcon: item.glyph,
    motion: item.motion || '',
    dots: 0,
    orientation: item.orientation
  });
  fs.writeFileSync(path.join(outputDir, `${item.id}.svg`), svg, 'utf-8');
});

console.log(`Generated ${numberDefinitions.length} Numbers Hand SVGs.`);

// 3. Core Vocabulary Hand Signs (Sample of key words)
const vocabDefinitions = [
  {
    id: 'sign-ana',
    title: 'أنا — لمس الصدر',
    orientation: 'نحو الصدر',
    glyph: `<rect x="92" y="45" width="16" height="55" rx="8" fill="url(#handGrad)" />`,
    motion: `<circle cx="100" cy="115" r="12" fill="#f59e0b" opacity="0.4" /><polygon points="100,105 92,120 108,120" fill="#f59e0b" />`
  },
  {
    id: 'sign-enta',
    title: 'أنت — إشارة للأمام',
    orientation: 'نحو المخاطب',
    glyph: `<rect x="92" y="32" width="18" height="68" rx="9" fill="url(#handGrad)" />`,
    motion: `<path d="M100 25 L 100 8" stroke="#f59e0b" stroke-width="4" /><polygon points="100,0 93,12 107,12" fill="#f59e0b" />`
  },
  {
    id: 'sign-eh',
    title: 'إيه؟ — كف مفتوح واهتزاز',
    orientation: 'كف لأعلى',
    glyph: `<ellipse cx="100" cy="100" rx="45" ry="25" fill="none" stroke="url(#handGrad)" stroke-width="16" />`,
    motion: `<text x="100" y="55" font-size="32" fill="#f59e0b" text-anchor="middle" font-weight="900">؟</text>`
  },
  {
    id: 'sign-ahlan',
    title: 'أهلاً — تحية الجبين',
    orientation: 'من الجبين للخارج',
    glyph: `<rect x="65" y="70" width="70" height="25" rx="10" fill="url(#handGrad)" />`,
    motion: `<path d="M135 60 Q 160 50 170 70" stroke="#f59e0b" stroke-width="4" fill="none" stroke-linecap="round" />`
  },
  {
    id: 'sign-shokran',
    title: 'شكراً — من الذقن للمتلقي',
    orientation: 'للأمام',
    glyph: `
      <rect x="75" y="45" width="12" height="55" rx="6" fill="url(#handGrad)" />
      <rect x="90" y="38" width="12" height="62" rx="6" fill="url(#handGrad)" />
      <rect x="105" y="42" width="12" height="58" rx="6" fill="url(#handGrad)" />
      <rect x="120" y="50" width="12" height="50" rx="6" fill="url(#handGrad)" />
    `,
    motion: `<path d="M100 130 L 100 155" stroke="#f59e0b" stroke-width="5" /><polygon points="100,165 92,150 108,150" fill="#f59e0b" />`
  },
  {
    id: 'sign-aasef',
    title: 'آسف — حركة دائرية للقلب',
    orientation: 'فوق القلب',
    glyph: `<circle cx="100" cy="100" r="28" fill="url(#handGrad)" />`,
    motion: `<path d="M100 65 A 35 35 0 1 1 70 95" stroke="#f59e0b" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="5,3" />`
  },
  {
    id: 'sign-beit',
    title: 'بيت — سقف مثلث',
    orientation: 'الأصابع متلاقية',
    glyph: `
      <line x1="50" y1="120" x2="100" y2="55" stroke="url(#handGrad)" stroke-width="16" stroke-linecap="round" />
      <line x1="150" y1="120" x2="100" y2="55" stroke="url(#handGrad)" stroke-width="16" stroke-linecap="round" />
    `
  },
  {
    id: 'sign-madrasa',
    title: 'مدرسة — تصفيق أفقي',
    orientation: 'كفان متواجهان',
    glyph: `
      <rect x="65" y="60" width="30" height="50" rx="12" fill="url(#handGrad)" />
      <rect x="105" y="60" width="30" height="50" rx="12" fill="url(#handGrad)" />
    `,
    motion: `
      <line x1="50" y1="85" x2="62" y2="85" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" />
      <line x1="150" y1="85" x2="138" y2="85" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" />
    `
  },
  {
    id: 'sign-mabsoot',
    title: 'مبسوط — مسح تصاعدي للصدر',
    orientation: 'نحو الصدر',
    glyph: `<rect x="65" y="80" width="70" height="40" rx="16" fill="url(#handGrad)" />`,
    motion: `
      <path d="M100 135 L 100 60" stroke="#f59e0b" stroke-width="5" stroke-linecap="round" />
      <polygon points="100,50 92,65 108,65" fill="#f59e0b" />
    `
  },
  {
    id: 'sign-qotta',
    title: 'قطة — شوارب بالوجنتين',
    orientation: 'للخارج',
    glyph: `
      <circle cx="85" cy="85" r="16" fill="url(#handGrad)" />
      <circle cx="115" cy="85" r="16" fill="url(#handGrad)" />
    `,
    motion: `
      <path d="M60 80 L 30 75 M 60 90 L 30 95" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" />
      <path d="M140 80 L 170 75 M 140 90 L 170 95" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" />
    `
  }
];

vocabDefinitions.forEach(item => {
  const svg = createHandSvg({
    title: item.title,
    letterOrSymbol: '🤟',
    glyphIcon: item.glyph,
    motion: item.motion || '',
    dots: 0,
    orientation: item.orientation
  });
  fs.writeFileSync(path.join(outputDir, `${item.id}.svg`), svg, 'utf-8');
});

console.log(`Generated ${vocabDefinitions.length} Vocabulary Hand SVGs.`);
console.log('All ESL hand sign SVGs generated successfully!');
