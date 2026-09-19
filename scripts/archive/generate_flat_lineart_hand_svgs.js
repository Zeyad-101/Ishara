import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '../assets/signs');

/**
 * Minimalist, High-Contrast Flat Line-Art SVG Generator
 * Single illustrator style across all letters:
 * - 2.5px consistent charcoal stroke (#1E293B)
 * - Clean white/transparent surfaces (#FFFFFF)
 * - Zero colored badges, zero cartoon skin gradients
 */
function buildLineArtHandSvg({ graphic }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">
  <g fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    ${graphic}
  </g>
</svg>`;
}

// Reusable clean line-art primitives
function lineArtWristAndPalm() {
  return `
    <!-- Wrist -->
    <path d="M 58 115 L 58 152 L 102 152 L 102 115 Z" fill="#FFFFFF" />
    <!-- Palm outline -->
    <path d="M 45 78 C 45 68, 56 64, 75 64 C 98 64, 115 68, 115 88 C 115 112, 105 125, 80 125 C 55 125, 45 110, 45 78 Z" fill="#FFFFFF" />
    <!-- Palm crease -->
    <path d="M 58 92 Q 80 106 102 90" fill="none" stroke-width="1.8" />
  `;
}

function lineArtFinger(x, y, w, h, nail = true, crease1 = true, crease2 = true) {
  const r = w / 2;
  return `
    <path d="M ${x} ${y + h} L ${x} ${y + r} A ${r} ${r} 0 0 1 ${x + w} ${y + r} L ${x + w} ${y + h}" fill="#FFFFFF" />
    ${nail ? `<path d="M ${x + 3} ${y + r * 1.5} Q ${x + r} ${y + r * 0.8} ${x + w - 3} ${y + r * 1.5}" fill="none" stroke-width="1.6" />` : ''}
    ${crease1 ? `<line x1="${x + 3}" y1="${y + h * 0.45}" x2="${x + w - 3}" y2="${y + h * 0.45}" stroke-width="1.4" />` : ''}
    ${crease2 ? `<line x1="${x + 3}" y1="${y + h * 0.72}" x2="${x + w - 3}" y2="${y + h * 0.72}" stroke-width="1.4" />` : ''}
  `;
}

function lineArtCurled(x, y, w, h) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w / 2.2}" fill="#FFFFFF" />
    <path d="M ${x + 3} ${y + h * 0.65} Q ${x + w / 2} ${y + h * 0.45} ${x + w - 3} ${y + h * 0.65}" fill="none" stroke-width="1.4" />
  `;
}

const letterGraphics = [
  {
    id: 'letter-alif',
    graphic: `
      ${lineArtWristAndPalm()}
      ${lineArtCurled(72, 70, 16, 26)}
      ${lineArtCurled(88, 73, 15, 24)}
      ${lineArtCurled(103, 78, 14, 22)}
      ${lineArtFinger(54, 18, 18, 68)}
      <path d="M 42 88 C 42 78, 58 74, 74 84 C 77 94, 65 106, 50 106 Z" fill="#FFFFFF" />
    `
  },
  {
    id: 'letter-baa',
    graphic: `
      <path d="M 58 115 L 58 152 L 102 152 L 102 115 Z" fill="#FFFFFF" />
      <path d="M 40 85 C 40 50, 120 50, 120 85 C 120 115, 40 115, 40 85 Z" fill="#FFFFFF" />
      <line x1="50" y1="85" x2="110" y2="85" stroke-width="2" />
      <circle cx="80" cy="132" r="5" fill="#0F172A" />
    `
  },
  {
    id: 'letter-taa',
    graphic: `
      ${lineArtWristAndPalm()}
      ${lineArtCurled(88, 74, 15, 24)}
      ${lineArtCurled(103, 78, 14, 22)}
      ${lineArtFinger(52, 20, 17, 68)}
      ${lineArtFinger(71, 16, 17, 72)}
      <path d="M 42 90 C 42 78, 58 75, 78 86 C 80 96, 65 108, 50 108 Z" fill="#FFFFFF" />
    `
  },
  {
    id: 'letter-thaa',
    graphic: `
      ${lineArtWristAndPalm()}
      ${lineArtCurled(103, 78, 14, 22)}
      ${lineArtFinger(48, 25, 16, 64)}
      ${lineArtFinger(66, 18, 16, 71)}
      ${lineArtFinger(84, 23, 16, 66)}
      <path d="M 40 92 C 40 80, 56 78, 82 88 C 84 98, 65 110, 50 110 Z" fill="#FFFFFF" />
    `
  },
  {
    id: 'letter-jeem',
    graphic: `
      ${lineArtWristAndPalm()}
      <path d="M 48 70 C 48 44, 114 44, 114 76 C 114 102, 85 110, 70 110" fill="none" stroke-width="20" />
      <circle cx="82" cy="76" r="6" fill="#0F172A" />
    `
  },
  {
    id: 'letter-haa',
    graphic: `
      ${lineArtWristAndPalm()}
      <path d="M 48 70 C 48 44, 114 44, 114 76 C 114 102, 85 110, 70 110" fill="none" stroke-width="20" />
    `
  },
  {
    id: 'letter-khaa',
    graphic: `
      ${lineArtWristAndPalm()}
      <path d="M 48 76 C 48 52, 114 52, 114 82 C 114 108, 85 114, 70 114" fill="none" stroke-width="18" />
      ${lineArtFinger(72, 18, 16, 44)}
    `
  },
  {
    id: 'letter-daal',
    graphic: `
      ${lineArtWristAndPalm()}
      <path d="M 112 50 L 64 50 L 64 102" fill="none" stroke-width="18" stroke-linejoin="round" />
    `
  },
  {
    id: 'letter-thaal',
    graphic: `
      ${lineArtWristAndPalm()}
      <path d="M 112 58 L 64 58 L 64 108" fill="none" stroke-width="16" stroke-linejoin="round" />
      ${lineArtFinger(68, 20, 15, 40)}
    `
  },
  {
    id: 'letter-raa',
    graphic: `
      ${lineArtWristAndPalm()}
      <path d="M 60 48 Q 88 72 98 108" fill="none" stroke-width="18" />
      <path d="M 106 78 L 114 94 L 98 92" fill="#0F172A" stroke-width="1.5" />
    `
  },
  {
    id: 'letter-zayn',
    graphic: `
      ${lineArtWristAndPalm()}
      <path d="M 60 48 Q 88 72 98 108" fill="none" stroke-width="18" />
      <circle cx="62" cy="34" r="5" fill="#0F172A" />
    `
  },
  {
    id: 'letter-seen',
    graphic: `
      ${lineArtWristAndPalm()}
      ${lineArtCurled(102, 76, 14, 22)}
      ${lineArtFinger(50, 26, 16, 62)}
      ${lineArtFinger(68, 20, 16, 68)}
      ${lineArtFinger(86, 26, 16, 62)}
    `
  },
  {
    id: 'letter-sheen',
    graphic: `
      ${lineArtWristAndPalm()}
      ${lineArtCurled(102, 76, 14, 22)}
      ${lineArtFinger(50, 30, 16, 58)}
      ${lineArtFinger(68, 24, 16, 64)}
      ${lineArtFinger(86, 30, 16, 58)}
      <circle cx="58" cy="18" r="3" fill="#0F172A" />
      <circle cx="76" cy="12" r="3" fill="#0F172A" />
      <circle cx="94" cy="18" r="3" fill="#0F172A" />
    `
  },
  {
    id: 'letter-saad',
    graphic: `
      ${lineArtWristAndPalm()}
      <ellipse cx="80" cy="65" rx="24" ry="18" fill="#FFFFFF" stroke-width="16" />
      ${lineArtCurled(96, 76, 14, 22)}
    `
  },
  {
    id: 'letter-daad',
    graphic: `
      ${lineArtWristAndPalm()}
      <ellipse cx="78" cy="68" rx="22" ry="17" fill="#FFFFFF" stroke-width="15" />
      ${lineArtFinger(84, 22, 15, 42)}
    `
  },
  {
    id: 'letter-taa-makhsoos',
    graphic: `
      ${lineArtWristAndPalm()}
      <line x1="42" y1="95" x2="118" y2="95" stroke-width="18" />
      ${lineArtFinger(72, 22, 17, 72)}
    `
  },
  {
    id: 'letter-zaa',
    graphic: `
      ${lineArtWristAndPalm()}
      <line x1="42" y1="95" x2="118" y2="95" stroke-width="18" />
      ${lineArtFinger(68, 25, 16, 70)}
      <circle cx="98" cy="32" r="5" fill="#0F172A" />
    `
  },
  {
    id: 'letter-ayn',
    graphic: `
      ${lineArtWristAndPalm()}
      <path d="M 108 50 C 60 42, 56 98, 108 98" fill="none" stroke-width="18" />
    `
  },
  {
    id: 'letter-ghayn',
    graphic: `
      ${lineArtWristAndPalm()}
      <path d="M 108 58 C 60 50, 56 102, 108 102" fill="none" stroke-width="17" />
      <circle cx="88" cy="28" r="5" fill="#0F172A" />
    `
  },
  {
    id: 'letter-faa',
    graphic: `
      ${lineArtWristAndPalm()}
      <circle cx="74" cy="85" r="19" fill="#FFFFFF" stroke-width="15" />
      ${lineArtFinger(70, 24, 16, 46)}
    `
  },
  {
    id: 'letter-qaaf',
    graphic: `
      ${lineArtWristAndPalm()}
      <circle cx="80" cy="88" r="19" fill="#FFFFFF" stroke-width="15" />
      ${lineArtFinger(62, 26, 15, 46)}
      ${lineArtFinger(82, 26, 15, 46)}
    `
  },
  {
    id: 'letter-kaaf',
    graphic: `
      ${lineArtWristAndPalm()}
      <path d="M 58 45 L 58 95 L 112 95" fill="none" stroke-width="18" stroke-linejoin="round" />
    `
  },
  {
    id: 'letter-laam',
    graphic: `
      ${lineArtWristAndPalm()}
      <path d="M 65 24 L 65 98 L 115 98" fill="none" stroke-width="18" stroke-linejoin="round" />
    `
  },
  {
    id: 'letter-meem',
    graphic: `
      ${lineArtWristAndPalm()}
      <circle cx="80" cy="70" r="20" fill="#FFFFFF" stroke-width="16" />
      <line x1="98" y1="78" x2="98" y2="114" stroke-width="16" />
    `
  },
  {
    id: 'letter-noon',
    graphic: `
      ${lineArtWristAndPalm()}
      <path d="M 48 65 C 48 108, 112 108, 112 65" fill="none" stroke-width="18" />
      ${lineArtFinger(72, 34, 16, 46)}
    `
  },
  {
    id: 'letter-haa-isolated',
    graphic: `
      ${lineArtWristAndPalm()}
      <circle cx="66" cy="74" r="17" fill="#FFFFFF" stroke-width="14" />
      <circle cx="96" cy="74" r="17" fill="#FFFFFF" stroke-width="14" />
    `
  },
  {
    id: 'letter-waaw',
    graphic: `
      ${lineArtWristAndPalm()}
      <circle cx="72" cy="62" r="18" fill="#FFFFFF" stroke-width="16" />
      <path d="M 78 76 Q 102 88 94 115" fill="none" stroke-width="16" />
    `
  },
  {
    id: 'letter-yaa',
    graphic: `
      ${lineArtWristAndPalm()}
      <path d="M 52 64 Q 80 80 108 64" stroke-width="18" fill="none" />
      <rect x="62" y="82" width="14" height="38" rx="7" fill="#FFFFFF" />
      <rect x="82" y="82" width="14" height="38" rx="7" fill="#FFFFFF" />
    `
  },
  {
    id: 'letter-hamza',
    graphic: `
      ${lineArtWristAndPalm()}
      <circle cx="82" cy="70" r="17" fill="#FFFFFF" stroke-width="15" />
      <path d="M 82 82 L 70 100" stroke-width="12" />
      <path d="M 104 60 A 16 16 0 1 1 92 50" fill="none" stroke-width="3" />
    `
  },
  {
    id: 'letter-taa-marbuta',
    graphic: `
      ${lineArtWristAndPalm()}
      <circle cx="80" cy="85" r="20" fill="#FFFFFF" stroke-width="16" />
      ${lineArtFinger(66, 28, 14, 38)}
      ${lineArtFinger(84, 28, 14, 38)}
    `
  },
  {
    id: 'letter-laam-alif',
    graphic: `
      ${lineArtWristAndPalm()}
      <line x1="58" y1="32" x2="104" y2="108" stroke-width="18" />
      <line x1="104" y1="32" x2="58" y2="108" stroke-width="18" />
    `
  }
];

letterGraphics.forEach(item => {
  const svg = buildLineArtHandSvg({ graphic: item.graphic });
  fs.writeFileSync(path.join(outputDir, `${item.id}.svg`), svg, 'utf-8');
});

console.log(`Generated ${letterGraphics.length} clean flat line-art SVGs.`);
