/**
 * Ishara — Dictionary Page Module
 * Driven by <body data-page="dictionary">
 */

import { getCategories, getAlphabet, getNumbers, getVocabulary, searchDictionary } from "../services/content.js";
import { openLetterModal, openVocabModal, openNumberModal } from "../components/modal.js";

export async function init() {
  const alphabetGrid = document.getElementById('alphabet-grid');
  const numbersSection = document.getElementById('numbers-section');
  const vocabGrid = document.getElementById('vocab-grid');
  const filterPillsContainer = document.getElementById('filter-pills');
  const searchInput = document.getElementById('dict-search-input');
  const clearSearchBtn = document.getElementById('dict-search-clear');
  const resultsCounter = document.getElementById('results-count');

  try {
    const [categories, alphabet, numbers, vocabulary] = await Promise.all([
      getCategories(),
      getAlphabet(),
      getNumbers(),
      getVocabulary()
    ]);

    // Parse URL params for initial state
    const urlParams = new URLSearchParams(window.location.search);
    let activeCategory = urlParams.get('cat') || 'all';
    let searchQuery = urlParams.get('q') || '';

    if (searchInput && searchQuery) {
      searchInput.value = searchQuery;
    }

    // Render Filter Pills
    if (filterPillsContainer) {
      const allFilters = [
        { id: 'all', name_ar: 'الكل' },
        { id: 'alphabet', name_ar: 'الأبجدية (31)' },
        { id: 'numbers', name_ar: 'الأرقام' },
        ...categories.filter(c => c.id !== 'alphabet' && c.id !== 'numbers')
      ];

      filterPillsContainer.innerHTML = allFilters.map(filter => `
        <button type="button" class="filter-pill ${filter.id === activeCategory ? 'active' : ''}" data-cat-id="${filter.id}">
          ${filter.name_ar}
        </button>
      `).join('');

      filterPillsContainer.addEventListener('click', (e) => {
        const targetPill = e.target.closest('.filter-pill');
        if (!targetPill) return;

        filterPillsContainer.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        targetPill.classList.add('active');
        activeCategory = targetPill.dataset.catId;
        renderAll();
      });
    }

    // Render Alphabet Cards
    function renderAlphabet(letters) {
      if (!alphabetGrid) return;
      if (!letters.length) {
        alphabetGrid.parentElement.classList.add('hidden');
        return;
      }
      alphabetGrid.parentElement.classList.remove('hidden');

      alphabetGrid.innerHTML = letters.map(item => `
        <div class="card card-letter" data-letter-id="${item.id}" role="button" tabindex="0" title="${item.name_ar}">
          <div class="card-letter-illustration">
            <img src="${item.media_local_path || 'assets/signs/' + item.id + '.svg'}" 
                 onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgMTYwIj48cmVjdCB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgZmlsbD0iI2Y4ZmFmYyIvPjx0ZXh0IHg9IjgwIiB5PSI4NSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5NGEzYjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPti12YjYsdipINi62YrYsSDZhdiq2YjZgdix2Kk8L3RleHQ+PC9zdmc+';" 
                 alt="إشارة لغة الإشارة لحرف ${item.letter}" class="card-letter-visual" loading="lazy">
          </div>
          <div class="card-letter-info">
            <div class="letter-glyph">${item.letter}</div>
            <div class="letter-name">${item.name_ar}</div>
          </div>
        </div>
      `).join('');

      alphabetGrid.querySelectorAll('.card-letter').forEach(card => {
        card.addEventListener('click', () => {
          const item = alphabet.find(a => a.id === card.dataset.letterId);
          if (item) openLetterModal(item);
        });
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const item = alphabet.find(a => a.id === card.dataset.letterId);
            if (item) openLetterModal(item);
          }
        });
      });
    }

    // Render Numbers Section (Identical card layout & typography to Alphabet)
    function renderNumbers(samplesToRender, isSearch = false) {
      if (!numbersSection) return;
      if (!samplesToRender || !samplesToRender.length) {
        numbersSection.classList.add('hidden');
        return;
      }
      numbersSection.classList.remove('hidden');

      const rulesHtml = !isSearch && numbers.rules ? (numbers.rules || []).map(r => `
        <div class="card" style="border-right: 4px solid var(--accent);">
          <h4 class="font-bold text-main mb-2">${r.type}</h4>
          <p class="text-sm text-secondary">${r.mechanism}</p>
        </div>
      `).join('') : '';

      const samplesHtml = samplesToRender.map(s => `
        <div class="card card-letter" data-number-val="${s.value}" role="button" tabindex="0" title="${s.name_ar}">
          <div class="card-letter-illustration">
            <img src="${s.media_local_path || 'assets/signs/num-' + s.value + '.png'}" 
                 onerror="this.onerror=null; this.src='assets/signs/num-' + s.value + '.png';" 
                 alt="إشارة رقم ${s.value}" class="card-letter-visual" loading="lazy">
          </div>
          <div class="card-letter-info">
            <div class="letter-glyph">${s.value}</div>
            <div class="letter-name">${s.name_ar}</div>
          </div>
        </div>
      `).join('');

      numbersSection.innerHTML = `
        <div class="section-header">
          <h2 class="section-title">🔢 ${isSearch ? 'الأرقام المطابقة' : 'النظام العددي في لغة الإشارة المصرية'}</h2>
          ${!isSearch ? `<p class="section-subtitle">
            <strong>قاعدة التوجيه الأساسية:</strong> ${numbers.rule_orientation}
          </p>` : ''}
        </div>
        ${rulesHtml ? `<div class="grid grid-cols-2 mb-8">${rulesHtml}</div>` : ''}
        ${!isSearch ? `<h3 class="font-bold text-lg mb-4 text-main">نماذج تطبيقية للأرقام</h3>` : ''}
        <div class="grid grid-alphabet mb-8">
          ${samplesHtml}
        </div>
      `;

      numbersSection.querySelectorAll('.card-letter').forEach(card => {
        card.addEventListener('click', () => {
          const item = (numbers.samples || []).find(s => s.value === card.dataset.numberVal);
          if (item) openNumberModal(item);
        });
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const item = (numbers.samples || []).find(s => s.value === card.dataset.numberVal);
            if (item) openNumberModal(item);
          }
        });
      });
    }

    // Render Vocabulary Cards (Identical card layout & typography to Alphabet & Numbers)
    function renderVocab(words) {
      if (!vocabGrid) return;
      if (!words.length) {
        vocabGrid.parentElement.classList.add('hidden');
        return;
      }
      vocabGrid.parentElement.classList.remove('hidden');

      vocabGrid.innerHTML = words.map(item => {
        const path = item.media_local_path || `assets/signs/sign-${item.id}.png`;
        const mediaHtml = `<img src="${path}" 
                 onerror="this.onerror=null; this.src='assets/signs/sign-${item.id}.png';" 
                 alt="إشارة ${item.word_ar_eg}" class="card-letter-visual" loading="lazy">`;

        return `
        <div class="card card-letter" data-vocab-id="${item.id}" role="button" tabindex="0" title="${item.word_ar_eg}">
          <div class="card-letter-illustration">
            ${mediaHtml}
          </div>
          <div class="card-letter-info">
            <div class="letter-glyph" style="font-size: 1.35rem; line-height: 1.2;">${item.word_ar_eg}</div>
            <div class="letter-name">${item.sign_type === 'compound' ? 'مركبة' : item.sign_type === 'question' ? 'استفهام' : 'معجمية'}</div>
          </div>
        </div>
      `;
      }).join('');

      vocabGrid.querySelectorAll('.card-letter').forEach(card => {
        card.addEventListener('click', () => {
          const item = vocabulary.find(v => v.id === card.dataset.vocabId);
          if (item) openVocabModal(item);
        });
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const item = vocabulary.find(v => v.id === card.dataset.vocabId);
            if (item) openVocabModal(item);
          }
        });
      });
    }

    // Master Render Routine
    function renderAll() {
      const q = (searchInput?.value || '').trim().toLowerCase();

      let filteredLetters = alphabet;
      let filteredVocab = vocabulary;
      let filteredNumbers = numbers.samples || [];

      // Filter by category
      if (activeCategory === 'alphabet') {
        filteredVocab = [];
        filteredNumbers = [];
      } else if (activeCategory === 'numbers') {
        filteredLetters = [];
        filteredVocab = [];
      } else if (activeCategory !== 'all') {
        filteredLetters = [];
        filteredNumbers = [];
        filteredVocab = vocabulary.filter(v => v.category_id === activeCategory);
      }

      // Filter by search query
      if (q) {
        filteredLetters = filteredLetters.filter(item =>
          item.letter.includes(q) ||
          item.name_ar.includes(q) ||
          item.description.includes(q) ||
          item.rule.toLowerCase().includes(q)
        );

        filteredNumbers = filteredNumbers.filter(s =>
          s.value.includes(q) ||
          s.name_ar.includes(q) ||
          s.description.includes(q)
        );

        filteredVocab = filteredVocab.filter(item =>
          item.word_ar_eg.includes(q) ||
          item.phonological_description.includes(q) ||
          (item.tags && item.tags.some(t => t.includes(q)))
        );
      }

      renderAlphabet(filteredLetters);
      renderNumbers(filteredNumbers, Boolean(q));
      renderVocab(filteredVocab);

      const total = filteredLetters.length + filteredVocab.length + filteredNumbers.length;

      // Handle 0 results empty state
      if (total === 0 && q) {
        if (vocabGrid) {
          vocabGrid.parentElement.classList.remove('hidden');
          vocabGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
              <div class="empty-state-icon">🔍</div>
              <h3 class="empty-state-title">لم نجد نتائج مطابقة لـ "${q}"</h3>
              <p class="empty-state-desc">تأكد من كتابة الكلمة بصورة صحيحة، أو جرّب البحث بحرف أو تصنيف آخر من القائمة أعلاه.</p>
              <button type="button" class="btn btn-sm btn-primary mt-2" id="btn-reset-search">عرض كل الإشارات</button>
            </div>
          `;
          document.getElementById('btn-reset-search')?.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (clearSearchBtn) clearSearchBtn.classList.add('hidden');
            activeCategory = 'all';
            filterPillsContainer?.querySelectorAll('.filter-pill').forEach(p => p.classList.toggle('active', p.dataset.catId === 'all'));
            renderAll();
          });
        }
      }

      // Update counter
      if (resultsCounter) {
        resultsCounter.textContent = `تم العثور على ${total} نتيجة`;
      }
    }

    // ==========================================
    // Interactive Flashcard Practice Mode
    // ==========================================
    const browseContainer = document.getElementById('browse-container');
    const practiceContainer = document.getElementById('practice-container');
    const modeBrowseBtn = document.getElementById('mode-browse');
    const modePracticeBtn = document.getElementById('mode-practice');
    const activeFlashcard = document.getElementById('active-flashcard');
    const fcPrev = document.getElementById('fc-prev');
    const fcNext = document.getElementById('fc-next');
    const fcFlip = document.getElementById('fc-flip');
    const fcRandom = document.getElementById('fc-random');

    let isPracticeMode = false;
    let practiceItems = [];
    let currentFcIndex = 0;

    function getActiveItems() {
      const q = (searchInput?.value || '').trim().toLowerCase();
      let pool = [];

      if (activeCategory === 'alphabet') {
        pool = [...alphabet];
      } else if (activeCategory === 'numbers') {
        pool = [...(numbers.samples || [])];
      } else if (activeCategory !== 'all') {
        pool = vocabulary.filter(v => v.category_id === activeCategory);
      } else {
        pool = [...vocabulary, ...alphabet, ...(numbers.samples || [])];
      }

      if (q) {
        pool = pool.filter(item => {
          const title = item.word_ar_eg || item.name_ar || item.letter || item.value || '';
          const desc = item.phonological_description || item.description || '';
          return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
        });
      }

      return pool;
    }

    function renderCurrentFlashcard() {
      if (!activeFlashcard) return;
      if (!practiceItems.length) {
        activeFlashcard.innerHTML = `
          <div class="flashcard-face" style="justify-content: center;">
            <div class="text-4xl mb-2">🔍</div>
            <h3 class="text-xl font-bold text-main">لا توجد إشارات مطابقة</h3>
            <p class="text-secondary text-sm mt-1">اختر تصنيفاً آخر أو امسح شريط البحث للبدء.</p>
          </div>
        `;
        return;
      }

      const item = practiceItems[currentFcIndex];
      const title = item.word_ar_eg || `${item.name_ar} (${item.letter || item.value})`;
      const desc = item.phonological_description || item.description || item.rule || '';
      const media = item.media_local_path || `assets/signs/sign-${item.id}.png`;
      const catBadge = item.category_id ? (categories.find(c => c.id === item.category_id)?.name_ar || 'معجم') : item.letter ? 'حروف الهجاء' : 'الأرقام';

      activeFlashcard.classList.remove('flipped');

      activeFlashcard.innerHTML = `
        <div class="flashcard-face flashcard-front">
          <div class="flex items-center justify-between w-full">
            <span class="badge badge-teal">${catBadge}</span>
            <span class="text-xs font-bold text-tertiary">بطاقة ${currentFcIndex + 1} من ${practiceItems.length}</span>
          </div>
          <div class="my-auto">
            <div class="text-xs text-secondary mb-2">ما هي الإشارة المعتمدة لـ:</div>
            <div class="text-4xl font-extrabold text-primary-dark" style="font-family: 'Cairo', sans-serif;">${title}</div>
          </div>
          <div class="text-xs text-tertiary">
            💡 انقر على البطاقة أو اضغط (Space) لمعاينة الإشارة والحركة
          </div>
        </div>
        <div class="flashcard-face flashcard-back">
          <div class="flex items-center justify-between w-full">
            <span class="badge badge-amber">التوثيق الإشاري المعتمد</span>
            <span class="text-xs font-bold text-tertiary">${currentFcIndex + 1} / ${practiceItems.length}</span>
          </div>
          <img src="${media}" alt="إشارة ${title}" class="flashcard-visual" onerror="this.onerror=null; this.src='assets/images/logo-emblem.png';">
          <div class="my-2">
            <div class="text-lg font-bold text-main">${title}</div>
            <div class="text-xs text-secondary mt-1" style="max-height: 50px; overflow-y: auto;">${desc}</div>
          </div>
          <div class="text-xs text-tertiary">
            🔄 انقر لقلب البطاقة مجدداً
          </div>
        </div>
      `;
    }

    function toggleFlashcardMode(enable) {
      isPracticeMode = enable;
      if (modeBrowseBtn && modePracticeBtn) {
        modeBrowseBtn.classList.toggle('active', !enable);
        modeBrowseBtn.setAttribute('aria-checked', String(!enable));
        modePracticeBtn.classList.toggle('active', enable);
        modePracticeBtn.setAttribute('aria-checked', String(enable));
      }

      if (browseContainer) browseContainer.classList.toggle('hidden', enable);
      if (practiceContainer) practiceContainer.classList.toggle('hidden', !enable);

      if (enable) {
        practiceItems = getActiveItems();
        currentFcIndex = 0;
        renderCurrentFlashcard();
      } else {
        renderAll();
      }
    }

    modeBrowseBtn?.addEventListener('click', () => toggleFlashcardMode(false));
    modePracticeBtn?.addEventListener('click', () => toggleFlashcardMode(true));

    activeFlashcard?.addEventListener('click', () => {
      activeFlashcard.classList.toggle('flipped');
    });

    fcFlip?.addEventListener('click', (e) => {
      e.stopPropagation();
      activeFlashcard?.classList.toggle('flipped');
    });

    fcNext?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!practiceItems.length) return;
      currentFcIndex = (currentFcIndex + 1) % practiceItems.length;
      renderCurrentFlashcard();
    });

    fcPrev?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!practiceItems.length) return;
      currentFcIndex = (currentFcIndex - 1 + practiceItems.length) % practiceItems.length;
      renderCurrentFlashcard();
    });

    fcRandom?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (practiceItems.length <= 1) return;
      let rand = Math.floor(Math.random() * practiceItems.length);
      if (rand === currentFcIndex) rand = (rand + 1) % practiceItems.length;
      currentFcIndex = rand;
      renderCurrentFlashcard();
    });

    document.addEventListener('keydown', (e) => {
      if (!isPracticeMode) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        activeFlashcard?.classList.toggle('flipped');
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        fcNext?.click();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        fcPrev?.click();
      }
    });

    // Search events
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        if (clearSearchBtn) {
          clearSearchBtn.classList.toggle('hidden', !searchInput.value);
        }
        if (isPracticeMode) {
          practiceItems = getActiveItems();
          currentFcIndex = 0;
          renderCurrentFlashcard();
        } else {
          renderAll();
        }
      });
    }

    if (clearSearchBtn && searchInput) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.classList.add('hidden');
        searchInput.focus();
        if (isPracticeMode) {
          practiceItems = getActiveItems();
          currentFcIndex = 0;
          renderCurrentFlashcard();
        } else {
          renderAll();
        }
      });
    }

    // Initial render
    renderAll();

  } catch (err) {
    console.error('[Ishara Dictionary] Initialization error:', err);
  }
}
