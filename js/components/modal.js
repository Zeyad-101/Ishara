/**
 * Ishara — Modal Component
 * Accessible dialog for displaying detailed phonological ESL sign information.
 */

let modalBackdrop = null;

export function initModal() {
  if (document.querySelector('.modal-backdrop')) {
    return;
  }

  const modalHtml = `
    <div class="modal-backdrop" id="sign-modal" role="dialog" aria-modal="true" aria-hidden="true">
      <div class="modal-dialog">
        <button type="button" class="modal-close" aria-label="إغلاق النافذة">✕</button>
        <div class="modal-content" id="modal-content-slot">
          <!-- Dynamic Content Injected Here -->
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  modalBackdrop = document.getElementById('sign-modal');

  const closeBtn = modalBackdrop.querySelector('.modal-close');

  const closeModal = () => {
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });
}

export function openLetterModal(letterItem) {
  initModal();
  const slot = document.getElementById('modal-content-slot');
  if (!slot) return;

  const visualPath = letterItem.media_local_path || `assets/signs/${letterItem.id}.svg`;

  slot.innerHTML = `
    <div class="modal-visual-container">
      <img src="${visualPath}" 
           onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgMTYwIj48cmVjdCB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgZmlsbD0iI2Y4ZmFmYyIvPjx0ZXh0IHg9IjgwIiB5PSI4NSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5NGEzYjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPti12YjYsdipINi62YrYsSDZhdiq2YjZgdix2Kk8L3RleHQ+PC9zdmc+';" 
           alt="تمثيل يدوي لحرف ${letterItem.letter}" class="modal-visual-img">
    </div>

    <div class="modal-header">
      <div class="modal-badge-icon">${letterItem.letter}</div>
      <div>
        <div class="modal-title">${letterItem.name_ar} (${letterItem.letter})</div>
        <span class="badge badge-teal">${letterItem.rule}</span>
      </div>
    </div>

    <div class="modal-field">
      <div class="modal-field-title">قواعد التنفيذ الحركي والبصري</div>
      <div class="modal-field-value">${letterItem.description}</div>
    </div>

    <div class="modal-field">
      <div class="modal-field-title">توجيه راحة اليد (Orientation)</div>
      <div class="modal-field-value">${letterItem.orientation}</div>
    </div>

    <div class="modal-field">
      <div class="modal-field-title">دلالة النقاط (Diacritical Dots)</div>
      <div class="modal-field-value">
        ${letterItem.dots === 0 ? 'حرف بدون نقاط — لا تمديد لأصابع إضافية.' : `يتم تمديد (${letterItem.dots}) أصابع لتمثيل النقاط بدقة.`}
      </div>
    </div>
  `;

  modalBackdrop.classList.add('open');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

export function openVocabModal(vocabItem) {
  initModal();
  const slot = document.getElementById('modal-content-slot');
  if (!slot) return;

  const visualPath = vocabItem.media_local_path || `assets/signs/sign-${vocabItem.id}.png`;
  const visualElementHtml = `<img src="${visualPath}" 
           onerror="this.onerror=null; this.src='assets/signs/sign-${vocabItem.id}.png';" 
           alt="تمثيل يدوي لإشارة ${vocabItem.word_ar_eg}" class="modal-visual-img">`;

  slot.innerHTML = `
    <div class="modal-visual-container">
      ${visualElementHtml}
    </div>

    <div class="modal-header">
      <div class="modal-badge-icon">🤟</div>
      <div>
        <div class="modal-title">${vocabItem.word_ar_eg}</div>
        <span class="badge ${vocabItem.sign_type === 'compound' ? 'badge-amber' : 'badge-teal'}">
          ${vocabItem.sign_type === 'compound' ? 'إشارة مركبة' : vocabItem.sign_type === 'question' ? 'أداة استفهام' : 'إشارة معجمية مفردة'}
        </span>
      </div>
    </div>

    <div class="modal-field">
      <div class="modal-field-title">الوصف الفونولوجي (شكل اليد، الموضع، الحركة)</div>
      <div class="modal-field-value">${vocabItem.phonological_description}</div>
    </div>

    <div class="modal-field">
      <div class="modal-field-title">مستوى الصعوبة والتصنيف</div>
      <div class="modal-field-value">
        المستوى: ${vocabItem.difficulty_level === 1 ? 'أساسي (مبتدئ)' : 'متوسط (مركب)'} | 
        الوسوم: ${(vocabItem.tags || []).join('، ')}
      </div>
    </div>

    <div class="modal-field">
      <div class="modal-field-title">تنبيه لغوي هام</div>
      <div class="modal-field-value" style="border-right-color: var(--accent);">
        هذه الإشارة خاصة بلغة الإشارة المصرية (ESL) حصراً، ولا يجوز استبدالها بإشارات لغة الإشارة العربية الموحدة (ArSL) أو الأمريكية (ASL).
      </div>
    </div>
  `;

  modalBackdrop.classList.add('open');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

export function openNumberModal(numberItem) {
  initModal();
  const slot = document.getElementById('modal-content-slot');
  if (!slot) return;

  const visualPath = numberItem.media_local_path || `assets/signs/num-${numberItem.value}.png`;

  slot.innerHTML = `
    <div class="modal-visual-container">
      <img src="${visualPath}" 
           onerror="this.onerror=null; this.src='assets/signs/num-${numberItem.value}.png';" 
           alt="إشارة رقم ${numberItem.value}" class="modal-visual-img">
    </div>

    <div class="modal-header">
      <div class="modal-badge-icon">${numberItem.value}</div>
      <div>
        <div class="modal-title">الرقم ${numberItem.name_ar} (${numberItem.value})</div>
        <span class="badge badge-teal">نظام الأرقام الإشارية</span>
      </div>
    </div>

    <div class="modal-field">
      <div class="modal-field-title">طريقة التنفيذ الحركي</div>
      <div class="modal-field-value">${numberItem.description}</div>
    </div>

    <div class="modal-field">
      <div class="modal-field-title">قاعدة التوجيه الأساسية</div>
      <div class="modal-field-value">راحة اليد تتجه نحو المُشير (الصدر)، وظهر اليد يواجه المتلقي.</div>
    </div>
  `;

  modalBackdrop.classList.add('open');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
