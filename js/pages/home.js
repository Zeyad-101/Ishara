/**
 * Ishara — Home Page Module
 * Driven by <body data-page="home">
 */

import { getCategories, getAlphabet, getVocabulary } from "../services/content.js";
import { openVocabModal, openLetterModal } from "../components/modal.js";

export async function init() {
  const categoriesContainer = document.getElementById('featured-categories');
  const dailySignContainer = document.getElementById('daily-sign-card');
  const searchInput = document.getElementById('home-search-input');
  const searchForm = document.getElementById('home-search-form');

  try {
    const [categories, alphabet, vocabulary] = await Promise.all([
      getCategories(),
      getAlphabet(),
      getVocabulary()
    ]);

    // Render Categories
    if (categoriesContainer) {
      categoriesContainer.innerHTML = categories.slice(0, 6).map(cat => `
        <a href="dictionary.html?cat=${cat.id}" class="card card-interactive card-category">
          <div class="category-icon">${cat.icon}</div>
          <h3 class="category-title">${cat.name_ar}</h3>
          <p class="category-description">${cat.description}</p>
          <div class="mt-4">
            <span class="badge badge-teal">استكشف القاموس ←</span>
          </div>
        </a>
      `).join('');
    }

    // Render Daily Featured Sign
    if (dailySignContainer && vocabulary.length > 0) {
      // Pick sign of the day deterministically based on day of year
      const dayIndex = Math.floor((Date.now() / 86400000) % vocabulary.length);
      const featured = vocabulary[dayIndex] || vocabulary[0];

      dailySignContainer.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="badge badge-amber">إشارة اليوم الموثقة</span>
          <span class="badge badge-teal">ESL أصيلة</span>
        </div>
        <div class="my-3 text-center">
          <img src="${featured.media_local_path || 'assets/signs/sign-' + featured.id + '.svg'}" alt="إشارة ${featured.word_ar_eg}" style="height: 110px; width: 100%; object-fit: contain; border-radius: 8px; background: var(--surface-alt); padding: 4px;">
          <h3 class="text-2xl font-extrabold text-primary mt-2">${featured.word_ar_eg}</h3>
          <p class="text-sm text-secondary mt-1">${featured.phonological_description}</p>
        </div>
        <div class="flex items-center justify-between mt-auto pt-3 border-t border-dashed">
          <span class="text-xs text-tertiary">التصنيف: ${featured.tags?.join('، ') || 'يومي'}</span>
          <button type="button" class="btn btn-sm btn-primary" id="btn-open-daily">عرض تفاصيل الإشارة</button>
        </div>
      `;

      const openBtn = document.getElementById('btn-open-daily');
      if (openBtn) {
        openBtn.addEventListener('click', () => openVocabModal(featured));
      }
    }

    // Home Search Form Redirect
    if (searchForm && searchInput) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = searchInput.value.trim();
        if (q) {
          window.location.href = `dictionary.html?q=${encodeURIComponent(q)}`;
        }
      });
    }

  } catch (err) {
    console.error('[Ishara Home] Failed loading page data:', err);
  }
}
