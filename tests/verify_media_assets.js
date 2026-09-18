import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const content = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'content.json'), 'utf-8'));

console.log('=== Verifying Complete Media Assets (Alphabet, Numbers, Vocabulary) ===\n');

let failed = false;
function assert(cond, msg) {
  if (!cond) {
    console.error(`❌ FAIL: ${msg}`);
    failed = true;
  } else {
    console.log(`✅ PASS: ${msg}`);
  }
}

// 1. Alphabet (31 items)
assert(content.alphabet && content.alphabet.length === 31, 'Alphabet has exactly 31 items');
content.alphabet.forEach(item => {
  const p = path.join(rootDir, item.media_local_path);
  assert(fs.existsSync(p) && fs.statSync(p).size > 100, `Alphabet ${item.name_ar} (${item.letter}) asset exists: ${item.media_local_path}`);
});

// 2. Numbers (14 items: 1-10, 20, 50, 100, 1000)
assert(content.numbers && content.numbers.samples && content.numbers.samples.length === 14, 'Numbers has exactly 14 samples');
content.numbers.samples.forEach(s => {
  const p = path.join(rootDir, s.media_local_path);
  assert(fs.existsSync(p) && fs.statSync(p).size > 100, `Number ${s.name_ar} (${s.value}) asset exists: ${s.media_local_path}`);
});

// 3. Vocabulary (87 items)
assert(content.vocabulary && content.vocabulary.length === 87, `Vocabulary has exactly 87 items (found: ${content.vocabulary?.length})`);
content.vocabulary.forEach(v => {
  const p = path.join(rootDir, v.media_local_path);
  assert(fs.existsSync(p) && fs.statSync(p).size > 100, `Vocab ${v.word_ar_eg} (${v.id}) asset exists: ${v.media_local_path}`);
});

console.log('\n=== Summary ===');
if (failed) {
  console.error('FAILED: Missing media assets.');
  process.exit(1);
} else {
  console.log(`SUCCESS: All ${content.alphabet.length + content.numbers.samples.length + content.vocabulary.length} media assets verified (${content.alphabet.length} letters + ${content.numbers.samples.length} numbers + ${content.vocabulary.length} words)!`);
}
