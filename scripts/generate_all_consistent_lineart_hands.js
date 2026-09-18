import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const signsDir = path.resolve(__dirname, '../assets/signs');
const previewDir = 'C:/Users/ZIADW/.gemini/antigravity/brain/190dbdc2-a6b4-4b36-b0ed-4aaf76766b97';

/**
 * Standard Anatomical Base Template (Matches User Pattern Exactly)
 * - viewBox: 0 0 160 160
 * - Base stroke: #0F172A, width: 2.8px
 * - Fill: #FFFFFF
 * - Forearm: <path d="M 64 120 L 64 154 L 96 154 L 96 120 Z" />
 * - Palm: <path d="M 48 76 C 48 64, 58 60, 80 60 C 102 60, 112 64, 112 80 C 112 106, 102 120, 80 120 C 58 120, 48 106, 48 76 Z" />
 */
const SVG_HEADER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">
  <g fill="#FFFFFF" stroke="#0F172A" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">`;

const SVG_FOOTER = `  </g>
</svg>`;

const FOREARM = `  <path d="M 64 120 L 64 154 L 96 154 L 96 120 Z" />`;
const PALM = `  <path d="M 48 76 C 48 64, 58 60, 80 60 C 102 60, 112 64, 112 80 C 112 106, 102 120, 80 120 C 58 120, 48 106, 48 76 Z" />`;

// Knuckle stubs
const STUB_INDEX = `  <rect x="56" y="60" width="14" height="18" rx="7" />`;
const STUB_MIDDLE = `  <rect x="71" y="60" width="14" height="18" rx="7" />`;
const STUB_RING = `  <rect x="86" y="63" width="13" height="17" rx="6.5" />`;
const STUB_PINKY = `  <rect x="100" y="67" width="12" height="16" rx="6" />`;

// Straight upright anatomical fingers (pattern-matched)
const FINGER_INDEX_UP = `  <path d="M 52 16 L 52 62 A 7.5 7.5 0 0 0 67 62 L 67 16 A 7.5 7.5 0 0 0 52 16 Z" />`;
const FINGER_MIDDLE_UP = `  <path d="M 68 12 L 68 60 A 7.5 7.5 0 0 0 83 60 L 83 12 A 7.5 7.5 0 0 0 68 12 Z" />`;
const FINGER_RING_UP = `  <path d="M 84 18 L 84 62 A 7 7 0 0 0 98 62 L 98 18 A 7 7 0 0 0 84 18 Z" />`;
const FINGER_PINKY_UP = `  <path d="M 98 26 L 98 64 A 6.5 6.5 0 0 0 111 64 L 111 26 A 6.5 6.5 0 0 0 98 26 Z" />`;

// Folded thumb
const THUMB_FOLDED = `  <path d="M 46 86 C 46 74, 60 72, 76 82 C 78 92, 66 102, 50 102 Z" />`;

const letters = [
  // 1. Alif (أ) — 1 index finger straight up
  {
    id: 'letter-alif',
    letter: 'أ',
    name: 'الألف',
    body: `
${FOREARM}
${PALM}
${STUB_MIDDLE}
${STUB_RING}
${STUB_PINKY}
${FINGER_INDEX_UP}
${THUMB_FOLDED}
    `
  },

  // 2. Baa (ب) — 1 finger pointing down for single dot below
  {
    id: 'letter-baa',
    letter: 'ب',
    name: 'الباء',
    body: `
${FOREARM}
${PALM}
${STUB_INDEX}
${STUB_MIDDLE}
${STUB_RING}
${STUB_PINKY}
  <!-- 1 finger pointing down for single dot below -->
  <path d="M 44 76 L 44 118" fill="none" stroke-width="7" />
  ${THUMB_FOLDED}
    `
  },

  // 3. Taa (ت) — 2 fingers up for two dots
  {
    id: 'letter-taa',
    letter: 'ت',
    name: 'التاء',
    body: `
${FOREARM}
${PALM}
${STUB_RING}
${STUB_PINKY}
${FINGER_INDEX_UP}
${FINGER_MIDDLE_UP}
${THUMB_FOLDED}
    `
  },

  // 4. Thaa (ث) — 3 fingers up for three dots
  {
    id: 'letter-thaa',
    letter: 'ث',
    name: 'الثاء',
    body: `
${FOREARM}
${PALM}
${STUB_PINKY}
${FINGER_INDEX_UP}
${FINGER_MIDDLE_UP}
${FINGER_RING_UP}
${THUMB_FOLDED}
    `
  },

  // 5. Jeem (ج) — Curved swoop + inner dot indicator
  {
    id: 'letter-jeem',
    letter: 'ج',
    name: 'الجيم',
    body: `
${FOREARM}
${PALM}
${STUB_MIDDLE}
${STUB_RING}
${STUB_PINKY}
  <!-- Curved swoop forming head of Jim -->
  <path d="M 52 58 C 48 30, 92 24, 108 46 C 114 58, 106 72, 90 72" fill="none" stroke-width="7" />
  <!-- Inner dot pinch point -->
  <circle cx="74" cy="54" r="3.5" fill="#0F172A" stroke="none" />
  <!-- Thumb pointing inward to inner dot -->
  <path d="M 46 88 C 46 76, 56 68, 70 68" fill="none" stroke-width="6" />
    `
  },

  // 6. Haa (ح) — Curvature, NO dot
  {
    id: 'letter-haa',
    letter: 'ح',
    name: 'الحاء',
    body: `
${FOREARM}
${PALM}
${STUB_MIDDLE}
${STUB_RING}
${STUB_PINKY}
  <!-- Curved swoop forming Haa curve -->
  <path d="M 52 58 C 48 30, 92 24, 108 46 C 114 58, 106 72, 90 72" fill="none" stroke-width="7" />
  ${THUMB_FOLDED}
    `
  },

  // 7. Khaa (خ) — Curvature + upper dot (index finger straight up)
  {
    id: 'letter-khaa',
    letter: 'خ',
    name: 'الخاء',
    body: `
${FOREARM}
${PALM}
${STUB_MIDDLE}
${STUB_RING}
${STUB_PINKY}
  <!-- Curved swoop -->
  <path d="M 70 58 C 68 36, 94 30, 108 48 C 114 58, 106 72, 92 72" fill="none" stroke-width="7" />
  <!-- Index finger straight up representing top dot -->
  ${FINGER_INDEX_UP}
  ${THUMB_FOLDED}
    `
  },

  // 8. Daal (د) — Right Angle (Thumb vertical up + Index horizontal right)
  {
    id: 'letter-daal',
    letter: 'د',
    name: 'الدال',
    body: `
${FOREARM}
${PALM}
${STUB_MIDDLE}
${STUB_RING}
${STUB_PINKY}
  <!-- Thumb extended up (vertical leg) -->
  <path d="M 48 26 L 48 72 A 7.5 7.5 0 0 0 63 72 L 63 26 A 7.5 7.5 0 0 0 48 26 Z" />
  <!-- Index extended right (horizontal leg) -->
  <path d="M 64 48 L 126 48 A 7.5 7.5 0 0 1 126 63 L 64 63 Z" />
    `
  },

  // 9. Thaal (ذ) — Right Angle + Middle finger up for dot
  {
    id: 'letter-thaal',
    letter: 'ذ',
    name: 'الذال',
    body: `
${FOREARM}
${PALM}
${STUB_RING}
${STUB_PINKY}
  <!-- Thumb extended up (vertical leg) -->
  <path d="M 46 26 L 46 72 A 7.5 7.5 0 0 0 61 72 L 61 26 A 7.5 7.5 0 0 0 46 26 Z" />
  <!-- Middle finger UP for dot -->
  ${FINGER_MIDDLE_UP}
  <!-- Index extended right (horizontal leg) -->
  <path d="M 76 50 L 128 50 A 7.5 7.5 0 0 1 128 65 L 76 65 Z" />
    `
  },

  // 10. Raa (ر) — Downward sloping curve
  {
    id: 'letter-raa',
    letter: 'ر',
    name: 'الراء',
    body: `
${FOREARM}
${PALM}
${STUB_MIDDLE}
${STUB_RING}
${STUB_PINKY}
  <!-- Index curved outward and sloping downward -->
  <path d="M 54 58 C 50 40, 64 34, 82 40 C 98 46, 110 66, 112 90" fill="none" stroke-width="7" />
${THUMB_FOLDED}
    `
  },

  // 11. Zayn (ز) — Downward slope + Middle finger up for dot
  {
    id: 'letter-zayn',
    letter: 'ز',
    name: 'الزاي',
    body: `
${FOREARM}
${PALM}
${STUB_RING}
${STUB_PINKY}
  <!-- Middle finger UP for dot -->
  ${FINGER_MIDDLE_UP}
  <!-- Index curved outward and sloping downward -->
  <path d="M 54 58 C 50 40, 64 34, 82 40 C 98 46, 110 66, 112 90" fill="none" stroke-width="7" />
${THUMB_FOLDED}
    `
  },

  // 12. Seen (س) — 3 curved teeth fingers
  {
    id: 'letter-seen',
    letter: 'س',
    name: 'السين',
    body: `
${FOREARM}
${PALM}
${STUB_PINKY}
${FINGER_INDEX_UP}
${FINGER_MIDDLE_UP}
${FINGER_RING_UP}
${THUMB_FOLDED}
    `
  },

  // 13. Sheen (ش) — 3 teeth fingers + 3 dots
  {
    id: 'letter-sheen',
    letter: 'ش',
    name: 'الشين',
    body: `
${FOREARM}
${PALM}
${STUB_PINKY}
${FINGER_INDEX_UP}
${FINGER_MIDDLE_UP}
${FINGER_RING_UP}
  <!-- 3 Dots over Sheen -->
  <circle cx="59" cy="8" r="3" fill="#0F172A" stroke="none" />
  <circle cx="75" cy="4" r="3" fill="#0F172A" stroke="none" />
  <circle cx="91" cy="8" r="3" fill="#0F172A" stroke="none" />
${THUMB_FOLDED}
    `
  },

  // 14. Saad (ص) — Closed Loop (Thumb + Index)
  {
    id: 'letter-saad',
    letter: 'ص',
    name: 'الصاد',
    body: `
${FOREARM}
${PALM}
${STUB_MIDDLE}
${STUB_RING}
${STUB_PINKY}
  <!-- Top arc: Index finger -->
  <path d="M 52 56 C 50 36, 76 34, 94 48 C 102 54, 96 66, 84 66" fill="none" stroke-width="6" />
  <!-- Bottom arc: Thumb meeting index tip-to-tip -->
  <path d="M 46 88 C 44 76, 60 66, 84 66" fill="none" stroke-width="6" />
    `
  },

  // 15. Daad (ض) — Closed Loop + Middle finger up for dot
  {
    id: 'letter-daad',
    letter: 'ض',
    name: 'الضاد',
    body: `
${FOREARM}
${PALM}
${STUB_RING}
${STUB_PINKY}
  <!-- Middle finger UP for dot -->
  ${FINGER_MIDDLE_UP}
  <!-- Closed loop formed by Thumb and Index -->
  <path d="M 52 56 C 50 36, 76 34, 94 48 C 102 54, 96 66, 84 66" fill="none" stroke-width="6" />
  <path d="M 46 88 C 44 76, 60 66, 84 66" fill="none" stroke-width="6" />
    `
  },

  // 16. Taa Makhsoos (ط) — Vertical Index on Flat Horizontal Thumb
  {
    id: 'letter-taa-makhsoos',
    letter: 'ط',
    name: 'الطاء',
    body: `
${FOREARM}
${PALM}
${STUB_MIDDLE}
${STUB_RING}
${STUB_PINKY}
  <!-- Horizontal flat thumb seat -->
  <path d="M 44 86 L 106 86" fill="none" stroke-width="7" />
  <!-- Vertical Index finger UP (mast of Taa) -->
  <path d="M 54 16 L 54 80 A 7.5 7.5 0 0 0 69 80 L 69 16 A 7.5 7.5 0 0 0 54 16 Z" />
    `
  },

  // 17. Zaa (ظ) — Vertical on Flat + Middle finger up for dot
  {
    id: 'letter-zaa',
    letter: 'ظ',
    name: 'الظاء',
    body: `
${FOREARM}
${PALM}
${STUB_RING}
${STUB_PINKY}
  <!-- Horizontal flat thumb seat -->
  <path d="M 44 86 L 106 86" fill="none" stroke-width="7" />
  <!-- Vertical Index finger UP -->
  <path d="M 54 16 L 54 80 A 7.5 7.5 0 0 0 69 80 L 69 16 A 7.5 7.5 0 0 0 54 16 Z" />
  <!-- Middle finger UP for dot -->
  ${FINGER_MIDDLE_UP}
    `
  },

  // 18. Ayn (ع) — Open C curve, index+thumb (EXACT USER PATTERN)
  {
    id: 'letter-ayn',
    letter: 'ع',
    name: 'العين',
    body: `
${FOREARM}
${PALM}
  <!-- Middle, ring, pinky folded -->
${STUB_MIDDLE}
${STUB_RING}
${STUB_PINKY}
  <!-- Index curved outward forming top of C -->
  <path d="M 52 20 C 44 32, 44 50, 54 60" fill="none" stroke-width="7" />
  <!-- Thumb curved forming bottom of C, facing index -->
  <path d="M 44 88 C 36 76, 38 58, 50 50" fill="none" stroke-width="7" />
    `
  },

  // 19. Ghayn (غ) — Open C curve + Middle finger up for dot
  {
    id: 'letter-ghayn',
    letter: 'غ',
    name: 'الغين',
    body: `
${FOREARM}
${PALM}
${STUB_RING}
${STUB_PINKY}
  <!-- Middle finger UP for dot -->
${FINGER_MIDDLE_UP}
  <!-- Index curved outward forming top of C -->
  <path d="M 52 20 C 44 32, 44 50, 54 60" fill="none" stroke-width="7" />
  <!-- Thumb curved forming bottom of C, facing index -->
  <path d="M 44 88 C 36 76, 38 58, 50 50" fill="none" stroke-width="7" />
    `
  },

  // 20. Faa (ف) — Circle + 1 Middle finger up for single dot
  {
    id: 'letter-faa',
    letter: 'ف',
    name: 'الفاء',
    body: `
${FOREARM}
${PALM}
${STUB_RING}
${STUB_PINKY}
  <!-- Middle finger UP for single dot -->
${FINGER_MIDDLE_UP}
  <!-- Thumb and Index meeting in circle -->
  <circle cx="64" cy="66" r="14" fill="none" stroke-width="5" />
    `
  },

  // 21. Qaaf (ق) — Circle + 2 fingers up (Middle + Ring) for 2 dots
  {
    id: 'letter-qaaf',
    letter: 'ق',
    name: 'القاف',
    body: `
${FOREARM}
${PALM}
${STUB_PINKY}
  <!-- Middle and Ring fingers UP for 2 dots -->
${FINGER_MIDDLE_UP}
${FINGER_RING_UP}
  <!-- Thumb and Index meeting in circle -->
  <circle cx="60" cy="68" r="14" fill="none" stroke-width="5" />
    `
  },

  // 22. Kaaf (ك) — Chair/hook, index+thumb right angle pointing up (EXACT USER PATTERN)
  {
    id: 'letter-kaaf',
    letter: 'ك',
    name: 'الكاف',
    body: `
${FOREARM}
${PALM}
${STUB_RING}
${STUB_PINKY}
  <!-- Index straight up -->
  <path d="M 66 16 L 66 62 A 7.5 7.5 0 0 0 81 62 L 81 16 A 7.5 7.5 0 0 0 66 16 Z" />
  <!-- Thumb extended sideways forming right-angle seat -->
  <path d="M 44 86 L 66 78 A 7 7 0 0 1 71 91 L 49 99 Z" />
    `
  },

  // 23. Laam (ل) — Vertical L (Index straight up tall, thumb perpendicular left)
  {
    id: 'letter-laam',
    letter: 'ل',
    name: 'اللام',
    body: `
${FOREARM}
${PALM}
${STUB_MIDDLE}
${STUB_RING}
${STUB_PINKY}
  <!-- Index straight up tall -->
  <path d="M 56 12 L 56 62 A 7.5 7.5 0 0 0 71 62 L 71 12 A 7.5 7.5 0 0 0 56 12 Z" />
  <!-- Thumb extended sideways to left -->
  <path d="M 48 76 L 20 76 A 7.5 7.5 0 0 0 20 91 L 48 91 Z" />
    `
  },

  // 24. Meem (م) — Downward circle/O, whole hand (EXACT USER PATTERN)
  {
    id: 'letter-meem',
    letter: 'م',
    name: 'الميم',
    body: `
  <path d="M 64 20 L 64 54 L 96 54 L 96 20 Z" transform="rotate(180 80 80)" /> <!-- forearm flipped, hand points down -->
  <path d="M 48 84 C 48 96, 58 100, 80 100 C 102 100, 112 96, 112 80 C 112 54, 102 40, 80 40 C 58 40, 48 54, 48 84 Z" /> <!-- palm, oriented downward -->
  <!-- All fingers curled into an O against fingertips-to-thumb -->
  <circle cx="80" cy="66" r="16" fill="none" stroke-width="4" />
    `
  },

  // 25. Noon (ن) — Upward Cup + Index center dot
  {
    id: 'letter-noon',
    letter: 'ن',
    name: 'النون',
    body: `
${FOREARM}
${PALM}
${STUB_RING}
${STUB_PINKY}
  <!-- Thumb cupping up on left -->
  <path d="M 44 88 C 42 74, 46 64, 52 56 A 6 6 0 0 1 64 62 C 58 70, 56 78, 56 88 Z" />
  <!-- Center Index finger UP for single dot in cup -->
  <path d="M 68 16 L 68 64 A 7 7 0 0 0 82 64 L 82 16 A 7 7 0 0 0 68 16 Z" />
    `
  },

  // 26. Haa Isolated (هـ) — Double Loop
  {
    id: 'letter-haa-isolated',
    letter: 'هـ',
    name: 'الهاء',
    body: `
${FOREARM}
${PALM}
${STUB_RING}
${STUB_PINKY}
  <!-- Double loop -->
  <circle cx="62" cy="54" r="11" fill="none" stroke-width="4.5" />
  <circle cx="82" cy="54" r="11" fill="none" stroke-width="4.5" />
${THUMB_FOLDED}
    `
  },

  // 27. Waaw (و) — Circle with Tail
  {
    id: 'letter-waaw',
    letter: 'و',
    name: 'الواو',
    body: `
${FOREARM}
${PALM}
${STUB_MIDDLE}
${STUB_RING}
  <!-- Circular head -->
  <circle cx="66" cy="52" r="13" fill="none" stroke-width="5" />
  <!-- Sweeping tail -->
  <path d="M 76 62 C 92 74, 102 90, 96 108" fill="none" stroke-width="6" />
    `
  },

  // 28. Yaa (ي) — Two fingers pointing downward for two dots below
  {
    id: 'letter-yaa',
    letter: 'ي',
    name: 'الياء',
    body: `
${FOREARM}
${PALM}
${STUB_RING}
${STUB_PINKY}
  <!-- Two fingers pointing downward for two dots below -->
  <path d="M 44 76 L 44 118" fill="none" stroke-width="7" />
  <path d="M 58 78 L 58 122" fill="none" stroke-width="7" />
${THUMB_FOLDED}
    `
  },

  // 29. Hamza (ء) — Pinched twist (EXACT USER PATTERN)
  {
    id: 'letter-hamza',
    letter: 'ء',
    name: 'الهمزة',
    body: `
${FOREARM}
${PALM}
${STUB_MIDDLE}
${STUB_RING}
${STUB_PINKY}
  <!-- Index and thumb pinched at a point above palm -->
  <path d="M 58 30 C 60 44, 64 54, 70 60" fill="none" stroke-width="6" />
  <path d="M 50 90 C 48 74, 54 56, 66 58" fill="none" stroke-width="6" />
  <circle cx="68" cy="59" r="3" fill="#0F172A" stroke="none" /> <!-- pinch point -->
  <path d="M 78 46 A 6 6 0 1 1 78 45.9" fill="none" stroke-width="1.6" stroke="#64748B" /> <!-- twist arc indicator -->
    `
  },

  // 30. Taa Marbuta (ة) — Closed circle + 2 fingers up for two dots
  {
    id: 'letter-taa-marbuta',
    letter: 'ة',
    name: 'التاء المربوطة',
    body: `
${FOREARM}
${PALM}
${STUB_PINKY}
  <!-- Middle and Ring fingers UP for 2 dots -->
${FINGER_MIDDLE_UP}
${FINGER_RING_UP}
  <!-- Closed circle of Taa body -->
  <circle cx="60" cy="68" r="14" fill="none" stroke-width="5" />
    `
  },

  // 31. Laam-Alif (لا) — Crossed strokes (X / Scissors)
  {
    id: 'letter-laam-alif',
    letter: 'لا',
    name: 'لام ألف',
    body: `
${FOREARM}
${PALM}
${STUB_RING}
${STUB_PINKY}
  <!-- Crossed scissor strokes -->
  <path d="M 52 16 L 86 64" fill="none" stroke-width="7" />
  <path d="M 86 16 L 52 64" fill="none" stroke-width="7" />
${THUMB_FOLDED}
    `
  }
];

console.log(`Generating all ${letters.length} consistent line-art hand SVGs with exact user patterns...`);

letters.forEach(item => {
  const fullSvg = `${SVG_HEADER}\n${item.body.trim()}\n${SVG_FOOTER}`;
  const filePath = path.join(signsDir, `${item.id}.svg`);
  fs.writeFileSync(filePath, fullSvg, 'utf-8');
});

console.log(`✅ Successfully generated 31 SVG files in assets/signs/`);

// Update preview gallery HTML
const previewHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>معاينة الأبجدية الإشارية المصرية - مطابقة تامة لنمط المستخدم</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Tajawal:wght@500;700;800&display=swap">
  <style>
    body { font-family: 'Cairo', 'Tajawal', sans-serif; }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 p-6">
  <div class="max-w-6xl mx-auto">
    <div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
      <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
        مطابقة تامة لنمط المستخدم (100% Exact User Pattern Match)
      </span>
      <h1 class="text-2xl font-extrabold text-slate-900 mt-2">الأبجدية الإشارية المصرية الموحدة (31 حرفاً)</h1>
      <p class="text-sm text-slate-600 mt-1">
        نفس أبعاد الساعد والكف تماماً كما في نماذج (ع، ك، م، ء) مع التبديل فقط في مسارات الأصابع والإبهام.
      </p>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
      ${letters.map(item => `
        <div class="bg-white border border-slate-200 hover:border-slate-400 rounded-xl p-2.5 flex flex-col items-center justify-between aspect-[3/4] shadow-xs transition-all hover:shadow-md">
          <div class="flex-1 w-full flex items-center justify-center p-1">
            <svg viewBox="0 0 160 160" class="w-full h-24" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
              ${item.body.trim()}
            </svg>
          </div>
          <div class="text-center mt-1 border-t border-slate-100 w-full pt-1.5">
            <div class="text-2xl font-black text-slate-900 leading-none">${item.letter}</div>
            <div class="text-[11px] font-semibold text-slate-500 mt-0.5">${item.name}</div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(previewDir, 'all_31_hands_preview.html'), previewHtml, 'utf-8');
console.log(`✅ Gallery preview updated at ${path.join(previewDir, 'all_31_hands_preview.html')}`);
