/**
 * Ishara — Content Service
 * Async, source-agnostic data access layer. Never touches the DOM.
 */

let cachedContent = null;

export async function getContent() {
  if (cachedContent) {
    return cachedContent;
  }

  // Support both root paths and relative path resolution
  const dataUrl = new URL('../../data/content.json', import.meta.url).href;
  const response = await fetch(dataUrl);

  if (!response.ok) {
    throw new Error(`Failed to load ESL content database: ${response.status}`);
  }

  cachedContent = await response.json();
  return cachedContent;
}

export async function getCategories() {
  const data = await getContent();
  return data.categories || [];
}

export async function getAlphabet() {
  const data = await getContent();
  return data.alphabet || [];
}

export async function getNumbers() {
  const data = await getContent();
  return data.numbers || { rules: [], samples: [] };
}

export async function getVocabulary(categoryId = null) {
  const data = await getContent();
  const allVocab = data.vocabulary || [];
  if (!categoryId || categoryId === 'all') {
    return allVocab;
  }
  return allVocab.filter(item => item.category_id === categoryId);
}

export async function getGrammar() {
  const data = await getContent();
  return data.grammar || [];
}

export async function getCulture() {
  const data = await getContent();
  return data.culture || [];
}

export async function searchDictionary(query) {
  if (!query || !query.trim()) {
    return { letters: [], words: [] };
  }

  const clean = query.trim().toLowerCase();
  const data = await getContent();

  const letters = (data.alphabet || []).filter(item =>
    item.letter.includes(clean) ||
    item.name_ar.includes(clean) ||
    item.rule.toLowerCase().includes(clean) ||
    item.description.includes(clean)
  );

  const words = (data.vocabulary || []).filter(item =>
    item.word_ar_eg.includes(clean) ||
    item.phonological_description.includes(clean) ||
    (item.tags && item.tags.some(t => t.includes(clean)))
  );

  return { letters, words };
}
