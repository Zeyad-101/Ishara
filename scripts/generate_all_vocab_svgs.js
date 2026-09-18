import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '../assets/signs');
const contentJsonPath = path.resolve(__dirname, '../data/content.json');

const content = JSON.parse(fs.readFileSync(contentJsonPath, 'utf-8'));

function createHandSvg({ title, letterOrSymbol, glyphIcon, motion = '', dots = 0, orientation = 'المستقبل' }) {
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
  <rect x="15" y="165" width="170" height="26" rx="6" fill="#ffffff" opacity="0.95" stroke="#cbd5e1" stroke-width="1" />
  <text x="100" y="182" font-family="'Cairo', sans-serif" font-size="12" font-weight="800" fill="#0f172a" text-anchor="middle">
    ${title}
  </text>
</svg>`;
}

// Ensure every vocab item has an SVG
content.vocabulary.forEach(item => {
  const filePath = path.join(outputDir, `sign-${item.id}.svg`);
  if (!fs.existsSync(filePath)) {
    // Generate specialized glyph based on category
    let glyph = `<rect x="90" y="40" width="20" height="60" rx="10" fill="url(#handGrad)" />`;
    let motion = ``;
    let orientation = 'للأمام';

    if (item.category_id === 'food') {
      glyph = `<ellipse cx="100" cy="85" rx="26" ry="18" fill="none" stroke="url(#handGrad)" stroke-width="14" />`;
      motion = `<polygon points="100,50 90,65 110,65" fill="#f59e0b" />`;
      orientation = 'نحو الفم';
    } else if (item.category_id === 'family') {
      glyph = `<circle cx="100" cy="70" r="22" fill="url(#handGrad)" />`;
      motion = `<circle cx="100" cy="70" r="30" stroke="#f59e0b" stroke-width="3" fill="none" stroke-dasharray="4,4" />`;
      orientation = 'الرأس / الذقن';
    } else if (item.category_id === 'home') {
      glyph = `<polygon points="100,45 60,110 140,110" fill="none" stroke="url(#handGrad)" stroke-width="14" stroke-linejoin="round" />`;
      orientation = 'الكفان متقابلان';
    } else if (item.category_id === 'school') {
      glyph = `<rect x="65" y="60" width="30" height="50" rx="8" fill="url(#handGrad)" /><rect x="105" y="60" width="30" height="50" rx="8" fill="url(#handGrad)" />`;
      motion = `<line x1="55" y1="85" x2="145" y2="85" stroke="#f59e0b" stroke-width="4" stroke-dasharray="5,3" />`;
      orientation = 'أفقي';
    } else if (item.category_id === 'animals') {
      glyph = `<ellipse cx="80" cy="80" rx="14" ry="24" fill="url(#handGrad)" /><ellipse cx="120" cy="80" rx="14" ry="24" fill="url(#handGrad)" />`;
      motion = `<path d="M50 80 Q 20 80 15 90 M 150 80 Q 180 80 185 90" stroke="#f59e0b" stroke-width="3" fill="none" />`;
      orientation = 'الوجه / اليدان';
    } else if (item.category_id === 'time') {
      glyph = `<rect x="92" y="42" width="16" height="58" rx="8" fill="url(#handGrad)" />`;
      motion = item.id.includes('embareh') 
        ? `<path d="M90 70 L 50 70 M 60 60 L 50 70 L 60 80" stroke="#f59e0b" stroke-width="4" fill="none" stroke-linecap="round" />`
        : `<path d="M110 70 L 150 70 M 140 60 L 150 70 L 140 80" stroke="#f59e0b" stroke-width="4" fill="none" stroke-linecap="round" />`;
      orientation = item.id.includes('embareh') ? 'للخلف (الماضي)' : 'للأمام (المستقبل)';
    }

    const svg = createHandSvg({
      title: `${item.word_ar_eg} (${item.sign_type})`,
      letterOrSymbol: '🤟',
      glyphIcon: glyph,
      motion: motion,
      dots: 0,
      orientation: orientation
    });

    fs.writeFileSync(filePath, svg, 'utf-8');
  }
});

console.log('All vocabulary items have dedicated SVGs!');
