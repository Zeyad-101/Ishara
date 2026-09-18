import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const htmlFiles = ['index.html', 'dictionary.html', 'grammar.html', 'culture.html'];
let issues = 0;

for (const file of htmlFiles) {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');
  const srcRegex = /(?:src|href)=["']([^"']+)["']/g;
  let match;

  while ((match = srcRegex.exec(content)) !== null) {
    const url = match[1];
    if (url.startsWith('http') || url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('data:')) {
      continue;
    }
    const cleanUrl = url.split('?')[0].replace(/^\.\//, '');
    const resolvedPath = path.join(rootDir, cleanUrl);

    if (!fs.existsSync(resolvedPath)) {
      console.error(`❌ FAIL: [${file}] references missing target: ${url} (resolved to: ${resolvedPath})`);
      issues++;
    }
  }
}

if (issues === 0) {
  console.log('✅ PASS: All internal links, stylesheets, scripts, and media in all HTML files exist!');
} else {
  console.error(`FAILED: ${issues} broken references found.`);
  process.exit(1);
}
