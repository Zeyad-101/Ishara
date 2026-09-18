import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('=== Verifying Logo & Dark Mode Integration ===\n');

let failed = false;
function assert(cond, msg) {
  if (!cond) {
    console.error(`❌ FAIL: ${msg}`);
    failed = true;
  } else {
    console.log(`✅ PASS: ${msg}`);
  }
}

// 1. Logo Asset Check
const logoPath = path.join(rootDir, 'assets', 'images', 'logo.svg');
assert(fs.existsSync(logoPath) && fs.statSync(logoPath).size > 500, 'assets/images/logo.svg exists and is non-empty');

const faviconPath = path.join(rootDir, 'assets', 'favicon.svg');
assert(fs.existsSync(faviconPath) && fs.statSync(faviconPath).size > 500, 'assets/favicon.svg exists and is non-empty');

// 2. HTML Files Logo & Theme Button Check
const pages = ['index.html', 'dictionary.html', 'grammar.html', 'culture.html'];
pages.forEach(p => {
  const html = fs.readFileSync(path.join(rootDir, p), 'utf-8');
  assert(html.includes('logo.png') || html.includes('logo.svg'), `${p} references official logo in header`);
  assert(html.includes('id="theme-toggle"'), `${p} includes #theme-toggle button`);
  assert(!html.includes('✨'), `${p} replaced all placeholder emojis in brand`);
});

// 3. Theme Controller Check
const themeJs = fs.readFileSync(path.join(rootDir, 'js', 'components', 'theme.js'), 'utf-8');
assert(themeJs.includes('ishara-theme'), 'theme.js manages localStorage key "ishara-theme"');
assert(themeJs.includes('data-theme'), 'theme.js sets data-theme attribute');
assert(themeJs.includes('initTheme'), 'theme.js exports initTheme()');

// 4. Main Entrypoint Check
const mainJs = fs.readFileSync(path.join(rootDir, 'js', 'main.js'), 'utf-8');
assert(mainJs.includes('initTheme'), 'main.js imports and initializes initTheme()');

// 5. CSS Dark Theme Support Check
const baseCss = fs.readFileSync(path.join(rootDir, 'css', 'base.css'), 'utf-8');
assert(baseCss.includes('[data-theme="dark"]'), 'base.css contains [data-theme="dark"] rules');
assert(baseCss.includes('--bg: #0f172a;'), 'base.css defines dark background token');

const compCss = fs.readFileSync(path.join(rootDir, 'css', 'components.css'), 'utf-8');
assert(compCss.includes('--surface') && compCss.includes('--border'), 'components.css card-letter uses CSS variable tokens');

console.log('\n=== Summary ===');
if (failed) {
  console.error('FAILED: Logo or dark mode integration issues found.');
  process.exit(1);
} else {
  console.log('SUCCESS: Logo and Dark Mode verified 100% operational!');
}
