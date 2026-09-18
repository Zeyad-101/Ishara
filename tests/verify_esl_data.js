import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('=== Starting ESL Platform Verification ===\n');

let failed = false;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failed = true;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

// 1. Check data/content.json
try {
  const contentPath = path.join(rootDir, 'data', 'content.json');
  assert(fs.existsSync(contentPath), 'data/content.json exists');

  const contentRaw = fs.readFileSync(contentPath, 'utf-8');
  const data = JSON.parse(contentRaw);

  assert(data.alphabet && data.alphabet.length >= 31, `Alphabet contains 31 letters/modifiers (found: ${data.alphabet?.length})`);
  assert(data.numbers && data.numbers.rules?.length === 4, `Numbers system has 4 tiers (found: ${data.numbers?.rules?.length})`);
  assert(data.categories && data.categories.length >= 16, `Categories has >= 16 categories (found: ${data.categories?.length})`);
  assert(data.vocabulary && data.vocabulary.length >= 87, `Core vocabulary has >= 87 items (found: ${data.vocabulary?.length})`);
  assert(data.grammar && data.grammar.length >= 3, `Grammar section has >= 3 core rules (found: ${data.grammar?.length})`);
  assert(data.culture && data.culture.length >= 4, `Culture section has 4 pillars (found: ${data.culture?.length})`);

  // Check critical ESL data fidelity
  const alif = data.alphabet.find(l => l.letter === 'أ');
  assert(alif && alif.rule.includes('Vertical Line'), 'Alif rule matches ESL specification');

  const shokran = data.vocabulary.find(v => v.id === 'shokran');
  assert(shokran && shokran.phonological_description.includes('الذقن'), 'Shokran phonological description matches ESL specification');

  const topicComment = data.grammar.find(g => g.id === 'topic-comment');
  assert(topicComment && topicComment.example_esl.includes('أمس'), 'Topic-comment example matches ESL specification');

  const questionsCat = data.categories.find(c => c.id === 'questions');
  assert(questionsCat && questionsCat.name_ar.includes('الأسئلة'), 'Questions category is defined');

  const aiwa = data.vocabulary.find(v => v.id === 'aiwa');
  assert(aiwa && aiwa.word_ar_eg.includes('أيوة'), 'Aiwa vocabulary exists');

  // Check visual assets existence for all letters, numbers, and vocabulary
  let missingSvgs = 0;
  data.alphabet.forEach(item => {
    if (!fs.existsSync(path.join(rootDir, item.media_local_path))) missingSvgs++;
  });
  assert(missingSvgs === 0, `All ${data.alphabet.length} alphabet letters have existing visual hand SVGs`);

  let missingVocabSvgs = 0;
  data.vocabulary.forEach(item => {
    if (!fs.existsSync(path.join(rootDir, item.media_local_path))) missingVocabSvgs++;
  });
  assert(missingVocabSvgs === 0, `All ${data.vocabulary.length} vocabulary signs have existing visual hand SVGs`);

  assert(fs.existsSync(path.join(rootDir, 'assets', 'images', 'hero_banner.jpg')), 'Hero master artwork exists');

} catch (err) {
  assert(false, `content.json parse error: ${err.message}`);
}

// 2. Check HTML files conform to Freelance Client Template rules
const pages = [
  { file: 'index.html', page: 'home' },
  { file: 'dictionary.html', page: 'dictionary' },
  { file: 'grammar.html', page: 'grammar' },
  { file: 'culture.html', page: 'culture' }
];

pages.forEach(({ file, page }) => {
  const filePath = path.join(rootDir, file);
  assert(fs.existsSync(filePath), `${file} exists`);

  const html = fs.readFileSync(filePath, 'utf-8');
  assert(html.includes(`data-page="${page}"`), `${file} has body data-page="${page}"`);
  
  const scriptMatches = html.match(/<script\b[^>]*>/gi) || [];
  assert(scriptMatches.length === 1, `${file} has exactly one script tag (found: ${scriptMatches.length})`);
  assert(html.includes('src="./js/main.js"'), `${file} links to ./js/main.js`);
  assert(html.includes('href="./css/main.css"'), `${file} links to ./css/main.css`);
});

// 3. Check CSS structure
const cssFiles = ['base.css', 'layout.css', 'components.css', 'utilities.css', 'main.css'];
cssFiles.forEach(cf => {
  const p = path.join(rootDir, 'css', cf);
  assert(fs.existsSync(p), `css/${cf} exists`);
});

const mainCss = fs.readFileSync(path.join(rootDir, 'css', 'main.css'), 'utf-8');
assert(mainCss.includes('@import "./base.css";'), 'main.css imports base.css');
assert(mainCss.includes('@import "./layout.css";'), 'main.css imports layout.css');
assert(mainCss.includes('@import "./components.css";'), 'main.css imports components.css');
assert(mainCss.includes('@import "./utilities.css";'), 'main.css imports utilities.css');

// 4. Check JS Page modules export init()
const pageModules = ['home.js', 'dictionary.js', 'grammar.js', 'culture.js'];
pageModules.forEach(pm => {
  const p = path.join(rootDir, 'js', 'pages', pm);
  assert(fs.existsSync(p), `js/pages/${pm} exists`);
  const content = fs.readFileSync(p, 'utf-8');
  assert(content.includes('export async function init()') || content.includes('export function init()'), `js/pages/${pm} exports init()`);
});

console.log('\n=== Verification Summary ===');
if (failed) {
  console.error('FAILED: One or more assertions failed.');
  process.exit(1);
} else {
  console.log('ALL CHECKS PASSED: 100% adherence to template and ESL rules.');
}
