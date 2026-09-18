import { getCulture } from "../services/content.js";

export async function init() {
  const cultureContainer = document.getElementById('culture-rules-list');
  const quizContainer = document.getElementById('culture-quiz-container');

  try {
    const cultureRules = await getCulture();

    if (cultureContainer) {
      cultureContainer.innerHTML = cultureRules.map(rule => `
        <div class="card card-culture mb-4">
          <h3 class="text-xl font-bold text-primary-dark">${rule.title_ar}</h3>
          
          <div class="culture-do mt-3">
            <span>✅</span>
            <div>
              <strong>السلوك السليم والمحبذ:</strong>
              <p>${rule.rule}</p>
            </div>
          </div>

          <div class="culture-dont mt-3">
            <span>❌</span>
            <div>
              <strong>احذر فعل ذلك (تصرف غير لائق):</strong>
              <p>${rule.caution}</p>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Interactive Quiz / Self-Check Scenarios
    const scenarios = [
      {
        question: "أنت في مقهى وتريد طلب القهوة من النادل الأصم. ماذا تفعل؟",
        options: [
          { text: "أقوم بالتأشير بأصبعي نحوه أو ألوح بيدي بقوة لانتباهه", correct: false, reason: "التلويح المفرط أو التأشير يعتبر غير لائق وقد يشتت الانتباه." },
          { text: "أمشي نحوه وأربت على كتفه بلطف مرتين", correct: true, reason: "إجابة صحيحة! الربت على الكتف مرتين بلطف هو الطريقة المثلى لجذب انتباه الشخص الأصم." },
          { text: "أنتظر حتى يلتفت إليّ بالصدفة", correct: false, reason: "الانتظار قد يأخذ وقتاً طويلاً. لا بأس من المبادرة بجذب الانتباه بلطف." }
        ]
      },
      {
        question: "تتحدث مع شخص أصم بوجود مترجم. أين يجب أن تنظر؟",
        options: [
          { text: "أنظر إلى المترجم لأنه من يتحدث ويوصل صوتي", correct: false, reason: "خاطئ! المترجم وسيط فقط. يجب أن تنظر إلى الشخص الأصم مباشرة لتبقي التواصل الشخصي." },
          { text: "أنظر مباشرة إلى عين الشخص الأصم أثناء الحديث", correct: true, reason: "ممتاز! التواصل البصري مهم جداً ويدل على احترامك للشخص وأن المحادثة موجهة له." }
        ]
      },
      {
        question: "هل يصح المرور من بين شخصين أصمين يتحدثان بلغة الإشارة؟",
        options: [
          { text: "نعم، لأنهم سيتوقفون فور رؤيتي أمرّ", correct: false, reason: "المرور يقطع مسار الرؤية وبالتالي يقطع الحديث تماماً. مثل وضع يدك على فم شخص يتحدث." },
          { text: "أنتظر حتى ينتهيا أو أبحث عن مسار آخر للعبور", correct: true, reason: "أحسنت! قطع مسار الرؤية يعتبر مقاطعة لحديثهما. يفضل البحث عن مسار بديل إن أمكن." }
        ]
      }
    ];

    let currentQuizIndex = 0;
    let score = 0;

    function renderQuiz() {
      if (!quizContainer) return;

      if (currentQuizIndex >= scenarios.length) {
        quizContainer.innerHTML = `
          <div class="text-center p-6">
            <div style="font-size: 3.5rem; margin-bottom: 1rem;">🏆</div>
            <h3 class="text-2xl font-extrabold text-primary mb-2">أحسنت! أكملت اختبار الثقافة</h3>
            <p class="text-base text-secondary mb-4">
              نتيجتك: <strong class="text-primary">${score} من ${scenarios.length}</strong> إجابات صحيحة ومعلومات قيمة للتعامل.
            </p>
            <div class="inline-flex gap-2 mb-6">
              <span class="badge badge-success">وعي ثقافي ممتاز</span>
              <span class="badge badge-teal">تواصل محترم</span>
            </div>
            <div>
              <button type="button" class="btn btn-primary" id="btn-restart-quiz">إعادة الاختبار من البداية 🔄</button>
            </div>
          </div>
        `;
        document.getElementById('btn-restart-quiz')?.addEventListener('click', () => {
          currentQuizIndex = 0;
          score = 0;
          renderQuiz();
        });
        return;
      }

      const s = scenarios[currentQuizIndex];

      quizContainer.innerHTML = `
        <div class="flex items-center justify-between mb-4">
          <span class="badge badge-amber">سيناريو عملي (${currentQuizIndex + 1} من ${scenarios.length})</span>
          <span class="text-xs text-tertiary">النقاط: ${score}</span>
        </div>
        <h4 class="text-lg font-bold text-main mb-4">${s.question}</h4>
        <div class="flex flex-col gap-3" id="quiz-options-slot">
          ${s.options.map((opt, idx) => `
            <button type="button" class="btn btn-secondary text-right justify-start p-4" data-opt-index="${idx}">
              ${opt.text}
            </button>
          `).join('')}
        </div>
        <div id="quiz-feedback" class="mt-4 hidden"></div>
      `;

      const optionBtns = quizContainer.querySelectorAll('#quiz-options-slot button');
      const feedbackSlot = document.getElementById('quiz-feedback');

      optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const opt = s.options[parseInt(btn.dataset.optIndex, 10)];
          if (opt.correct) score++;

          optionBtns.forEach((b, idx) => {
            b.disabled = true;
            if (s.options[idx].correct) {
              b.style.borderColor = 'var(--success)';
              b.style.backgroundColor = 'var(--success-soft)';
            } else if (idx === parseInt(btn.dataset.optIndex, 10)) {
              b.style.borderColor = 'var(--danger)';
              b.style.backgroundColor = 'var(--danger-soft)';
            }
          });

          if (feedbackSlot) {
            feedbackSlot.classList.remove('hidden');
            feedbackSlot.innerHTML = `
              <div class="card p-4 mt-2" style="border-right: 4px solid ${opt.correct ? 'var(--success)' : 'var(--danger)'}; background: ${opt.correct ? 'var(--success-soft)' : 'var(--danger-soft)'};">
                <div class="font-bold ${opt.correct ? 'text-success' : 'text-danger'} mb-1">
                  ${opt.correct ? 'إجابة صحيحة وتصرف لبق ✅' : 'إجابة غير صحيحة ❌'}
                </div>
                <p class="text-sm text-main">${opt.reason}</p>
                <div class="mt-3">
                  <button type="button" class="btn btn-sm btn-primary" id="btn-next-scenario">
                    ${currentQuizIndex < scenarios.length - 1 ? 'السيناريو التالي ➡️' : 'عرض النتيجة النهائية 🏆'}
                  </button>
                </div>
              </div>
            `;

            document.getElementById('btn-next-scenario')?.addEventListener('click', () => {
              currentQuizIndex++;
              renderQuiz();
            });
          }
        });
      });
    }

    renderQuiz();

  } catch (err) {
    console.error('[Ishara Culture] Initialization error:', err);
  }
}
