import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('=== Verifying Complete Publishing Readiness ===\n');

let failed = false;
function assert(cond, msg) {
  if (!cond) {
    console.error(`❌ FAIL: ${msg}`);
    failed = true;
  } else {
    console.log(`✅ PASS: ${msg}`);
  }
}

// 1. Hosting files
assert(fs.existsSync(path.join(rootDir, 'robots.txt')), 'robots.txt exists for SEO');
assert(fs.existsSync(path.join(rootDir, 'sitemap.xml')), 'sitemap.xml exists for search indexing');
assert(fs.existsSync(path.join(rootDir, '.nojekyll')), '.nojekyll exists for GitHub Pages');

const sitemapContent = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf-8');
assert(sitemapContent.includes('dictionary.html') && sitemapContent.includes('grammar.html') && sitemapContent.includes('culture.html'), 'sitemap.xml covers all main application routes');

// 2. HTML Meta & Open Graph verification
const pages = ['index.html', 'dictionary.html', 'grammar.html', 'culture.html'];
pages.forEach(p => {
  const content = fs.readFileSync(path.join(rootDir, p), 'utf-8');
  assert(content.includes('<!DOCTYPE html>'), `${p} has standard doctype`);
  assert(content.includes('<html lang="ar" dir="rtl">'), `${p} is configured for Arabic RTL`);
  assert(content.includes('<meta charset="UTF-8">'), `${p} specifies UTF-8 charset`);
  assert(content.includes('<meta name="viewport"'), `${p} specifies responsive viewport`);
  assert(content.includes('<meta name="description"'), `${p} has SEO meta description`);
  assert(content.includes('<meta property="og:title"'), `${p} has Open Graph title`);
  assert(content.includes('<meta property="og:description"'), `${p} has Open Graph description`);
  assert(content.includes('<meta property="og:image"'), `${p} has Open Graph image`);
  assert(content.includes('<meta name="twitter:card"'), `${p} has Twitter card meta`);
  assert(content.includes('favicon.svg'), `${p} links to SVG favicon`);
  assert(content.includes('apple-touch-icon.png'), `${p} links to apple touch icon`);
});

// 3. Confirm NO video remnants or dead folders exist
assert(!fs.existsSync(path.join(rootDir, 'assets', 'signs_video')), 'assets/signs_video/ is completely eliminated');
assert(!fs.existsSync(path.join(rootDir, 'assets', 'raw_photos')), 'assets/raw_photos/ is completely eliminated');
assert(!fs.existsSync(path.join(rootDir, 'assets', 'signs_processed')), 'assets/signs_processed/ is completely eliminated');
assert(!fs.existsSync(path.join(rootDir, 'logo.png')), 'Root duplicate logo.png is eliminated');
assert(!fs.existsSync(path.join(rootDir, 'split_and_compress_words.py')), 'Root split_and_compress_words.py is eliminated');

// 4. Confirm total dataset size
const contentJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'content.json'), 'utf-8'));
assert(contentJson.categories.length === 16, `Exactly 16 categorized themes present (found: ${contentJson.categories.length})`);
assert(contentJson.alphabet.length === 31, `Exactly 31 alphabet letters present (found: ${contentJson.alphabet.length})`);
assert(contentJson.numbers.samples.length === 14, `Exactly 14 numbers samples present (found: ${contentJson.numbers.samples.length})`);
assert(contentJson.vocabulary.length === 87, `Exactly 87 vocabulary words present (found: ${contentJson.vocabulary.length})`);

const totalMedia = contentJson.alphabet.length + contentJson.numbers.samples.length + contentJson.vocabulary.length;
assert(totalMedia === 132, `Total verified visual sign items equals 132 (found: ${totalMedia})`);

console.log('\n=== Publishing Readiness Summary ===');
if (failed) {
  console.error('FAILED: Project has unresolved publishing items.');
  process.exit(1);
} else {
  console.log('SUCCESS: Project is 100% verified and production-ready for immediate publishing!');
}
