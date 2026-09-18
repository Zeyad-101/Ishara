/**
 * Ishara — Dark Mode & Theme Controller
 * Handles persistent dark/light theme toggle, OS preference fallback, and ARIA updates.
 */

const STORAGE_KEY = 'ishara-theme';

export function getPreferredTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') {
    return saved;
  }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function applyTheme(theme) {
  const isDark = theme === 'dark';
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  const toggleBtns = document.querySelectorAll('#theme-toggle, .theme-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.textContent = isDark ? '☀️' : '🌙';
    btn.setAttribute('aria-label', isDark ? 'تبديل إلى الوضع الفاتح' : 'تبديل إلى الوضع الداكن');
    btn.setAttribute('title', isDark ? 'الوضع الفاتح' : 'الوضع الداكن');
    btn.setAttribute('aria-pressed', String(isDark));
  });

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (e) {
    console.warn('[Ishara Theme] LocalStorage not available', e);
  }
}

export function initTheme() {
  const current = getPreferredTheme();
  applyTheme(current);

  const toggleBtns = document.querySelectorAll('#theme-toggle, .theme-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isCurrentlyDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const nextTheme = isCurrentlyDark ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  });

  // Listen for OS scheme changes if user hasn't set explicit override
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

// Immediately apply theme upon module load to prevent FOUC
try {
  applyTheme(getPreferredTheme());
} catch (e) {
  // Ignore in non-browser environments
}
