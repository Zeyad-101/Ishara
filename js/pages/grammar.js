/**
 * Ishara — Grammar Page Module
 * Driven by <body data-page="grammar">
 */

import { getGrammar } from "../services/content.js";

export async function init() {
  const grammarContainer = document.getElementById('grammar-rules-list');
  const interactiveSelector = document.getElementById('marker-simulator-select');
  const simulatorDisplay = document.getElementById('marker-simulator-result');

  try {
    const grammarRules = await getGrammar();

    if (grammarContainer) {
      grammarContainer.innerHTML = grammarRules.map(rule => {
        let extraContent = '';

        if (rule.example_spoken && rule.example_esl) {
          extraContent = `
            <div class="grammar-comparison">
              <div class="comparison-box box-spoken">
                <span class="box-tag text-tertiary">اللغة العربية المتحدثة:</span>
                <span class="box-phrase">${rule.example_spoken}</span>
              </div>
              <div class="comparison-box box-esl">
                <span class="box-tag text-primary">تكوين لغة الإشارة المصرية (ESL):</span>
                <span class="box-phrase text-primary">${rule.example_esl}</span>
              </div>
            </div>
            <p class="text-sm text-secondary mt-3">${rule.explanation || ''}</p>
          `;
        } else if (rule.rules) {
          extraContent = `
            <div class="grid grid-cols-3 mt-4 gap-4">
              ${rule.rules.map(r => `
                <div class="card" style="background: var(--surface-alt);">
                  <div class="badge badge-teal mb-2">${r.context}</div>
                  <div class="text-sm font-bold text-main">${r.facial}</div>
                </div>
              `).join('')}
            </div>
          `;
        }

        return `
          <div class="card mb-6" style="border-right: 5px solid var(--primary);">
            <h3 class="text-xl font-bold text-primary-dark mb-2">${rule.title_ar}</h3>
            <p class="text-base text-secondary">${rule.summary}</p>
            ${extraContent}
          </div>
        `;
      }).join('');
    }

    // Facial Markers Interactive Simulator
    const markers = [
      {
        type: "yes_no",
        title: "سؤال بهل (نعم أو لا)",
        face: "🤔",
        expression: "رفع الحاجبين قليلاً مع إمالة الرأس للأمام قليلاً.",
        samplePhrase: "هل أنت مشغول؟",
        eslSign: "أنت - مشغول؟ (مع رفع الحاجبين والنظر المباشر)"
      },
      {
        type: "wh_question",
        title: "سؤال استفهامي (من، ماذا، أين)",
        face: "🤨",
        expression: "ضم الحاجبين (تقطيبة خفيفة) وتضييق العينين قليلاً.",
        samplePhrase: "ما اسمك؟",
        eslSign: "اسمك - إيه؟ (مع ضم الحاجبين عند الإشارة بكلمة إيه)"
      },
      {
        type: "intensity_large",
        title: "وصف حجم كبير أو شيء ضخم",
        face: "😮",
        expression: "نفخ الخدين مع فتح الفم بشكل دائري أثناء الإشارة.",
        samplePhrase: "بيت كبير جداً",
        eslSign: "بيت - كبير (مع نفخ الخدين لبيان الكبر)"
      },
      {
        type: "intensity_tiny",
        title: "وصف شيء دقيق أو صغير",
        face: "😬",
        expression: "تضييق العينين وزم الشفاه للداخل أثناء الإشارة.",
        samplePhrase: "عصفورة صغيرة جداً",
        eslSign: "عصفورة - صغيرة (مع تضييق العينين والفم)"
      }
    ];

    function updateSimulator(type) {
      if (!simulatorDisplay) return;
      const item = markers.find(m => m.type === type) || markers[0];

      simulatorDisplay.innerHTML = `
        <div class="flex items-center gap-4">
          <div style="font-size: 3.5rem; line-height: 1;">${item.face}</div>
          <div>
            <h4 class="text-lg font-bold text-primary-dark">${item.title}</h4>
            <p class="text-sm font-semibold text-main mt-1">${item.expression}</p>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-dashed">
          <div class="text-xs text-tertiary mb-1">مثال توضيحي:</div>
          <div class="text-base font-bold text-main">الجملة: "${item.samplePhrase}"</div>
          <div class="text-sm text-primary font-bold mt-1">تكوين الإشارة: ${item.eslSign}</div>
        </div>
      `;
    }

    if (interactiveSelector) {
      interactiveSelector.innerHTML = markers.map(m => `
        <button type="button" class="filter-pill ${m.type === 'yes_no' ? 'active' : ''}" data-type="${m.type}">
          ${m.title}
        </button>
      `).join('');

      interactiveSelector.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-pill');
        if (!btn) return;
        interactiveSelector.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        updateSimulator(btn.dataset.type);
      });

      updateSimulator('yes_no');
    }

  } catch (err) {
    console.error('[Ishara Grammar] Initialization error:', err);
  }
}
