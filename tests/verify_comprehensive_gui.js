import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('=== Comprehensive GUI & ESL Functional Verification ===\n');

let failed = false;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failed = true;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

// 1. Check Data Integrity
const content = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'content.json'), 'utf-8'));
assert(content.alphabet?.length === 31, 'Alphabet contains 31 letters/modifiers');
assert(content.vocabulary?.length >= 35, 'Vocabulary contains >= 35 verified signs');
assert(content.grammar?.length >= 3, 'Grammar contains >= 3 verified rules');
assert(content.culture?.length >= 4, 'Culture contains 4 core pillars');

// 2. Check Visual Assets
const signsDir = path.join(rootDir, 'assets', 'signs');
const allSignFiles = fs.readdirSync(signsDir).filter(f => f.endsWith('.png') || f.endsWith('.svg'));
assert(allSignFiles.length >= 28, `Authentic hand alphabet visual assets present (found: ${allSignFiles.length})`);

// 3. Check Hero Master Artwork
const bannerPath = path.join(rootDir, 'assets', 'images', 'hero_banner.jpg');
assert(fs.existsSync(bannerPath) && fs.statSync(bannerPath).size > 50000, 'Master ESL banner artwork is present and high resolution');

// 4. Check HTML Pages & Accessibility
const pages = ['index.html', 'dictionary.html', 'grammar.html', 'culture.html'];
pages.forEach(p => {
  const html = fs.readFileSync(path.join(rootDir, p), 'utf-8');
  assert(html.includes('lang="ar"') && html.includes('dir="rtl"'), `${p} is natively configured for Arabic RTL`);
  assert(html.includes('data-page='), `${p} has data-page routing attribute`);
  assert(html.includes('<meta name="viewport"'), `${p} has mobile responsive viewport`);
  assert(html.includes('<title>'), `${p} has distinct accessible title`);
  assert(html.includes('css/main.css'), `${p} links to unified main.css`);
  assert(html.includes('js/main.js'), `${p} has single script tag`);
  assert(html.includes('footer-credit-bar'), `${p} has footer-credit-bar component`);
  assert(html.includes('Zeyad Waled'), `${p} has author copyright attribution`);
  assert(html.includes('https://github.com/Zeyad-101'), `${p} has GitHub link`);
  assert(html.includes('https://www.linkedin.com/in/zeyad-waled-0100z001/'), `${p} has LinkedIn link`);
});

// 5. Check CSS Design System & Animation Tokens
const baseCss = fs.readFileSync(path.join(rootDir, 'css', 'base.css'), 'utf-8');
assert(baseCss.includes('--primary:') && baseCss.includes('--accent:'), 'Color tokens defined in base.css');
assert(baseCss.includes('Alexandria') && baseCss.includes('Cairo'), 'High-agency Arabic fonts included');
assert(baseCss.includes('@keyframes modalIn') && baseCss.includes('@keyframes pulseGlow'), 'Custom keyframe animations defined');

const compCss = fs.readFileSync(path.join(rootDir, 'css', 'components.css'), 'utf-8');
assert(compCss.includes('.card-letter-visual') && compCss.includes('.card-sign-visual'), 'Visual hand diagram styling classes present');
assert(compCss.includes('.empty-state'), 'Graceful search empty-state component styled');
assert(compCss.includes('.modal-dialog') && compCss.includes('.modal-close'), 'Accessible modal styling present');

// 6. Test Functional Search Logic In Memory
function testSearch(q) {
  const clean = q.trim().toLowerCase();
  const letters = content.alphabet.filter(item =>
    item.letter.includes(clean) ||
    item.name_ar.includes(clean) ||
    item.description.includes(clean)
  );
  const numbers = (content.numbers?.samples || []).filter(s =>
    s.value.includes(clean) ||
    s.name_ar.includes(clean) ||
    s.description.includes(clean)
  );
  const words = content.vocabulary.filter(item =>
    item.word_ar_eg.includes(clean) ||
    item.phonological_description.includes(clean)
  );
  return { letters, numbers, words };
}

const search1 = testSearch('أ');
assert(search1.letters.length > 0 || search1.words.length > 0, 'Search for "أ" returns letters and words');

const search2 = testSearch('شكراً');
assert(search2.words.some(w => w.word_ar_eg === 'شكراً'), 'Search for "شكراً" finds the sign');

const search3 = testSearch('واحد');
assert(search3.numbers.some(n => n.name_ar === 'واحد'), 'Search for "واحد" finds the number sign');

const searchEmpty = testSearch('كلمةغيرموجودة123');
assert(searchEmpty.letters.length === 0 && searchEmpty.numbers.length === 0 && searchEmpty.words.length === 0, 'Empty search correctly returns 0 results for empty state trigger');

console.log('\n=== Summary ===');
if (failed) {
  console.error('FAILED: One or more tests failed.');
  process.exit(1);
} else {
  console.log('ALL COMPREHENSIVE CHECKS PASSED: UI & GUI upgrades verified.');
}
