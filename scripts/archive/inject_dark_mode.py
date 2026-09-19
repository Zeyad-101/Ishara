import os
import re

css_append = """
/* Dark Mode Theme */
[data-theme="dark"] {
  --bg: #0f172a;
  --surface: #1e293b;
  --surface-alt: #334155;
  --surface-hover: #1e293b;

  --text-main: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  
  --border: #334155;
  --border-focus: #14b8a6;
  
  --primary-soft: #134e4a;
  --primary-border: #115e59;
  
  --accent-soft: #78350f;
  --accent-border: #92400e;
  
  --shadow-md: 0 8px 16px -4px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 14px 28px -6px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 24px 38px -8px rgba(0, 0, 0, 0.6);
}
"""

def append_css(filepath):
    with open(filepath, 'a', encoding='utf-8') as f:
        f.write(css_append)

def inject_toggle_html(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    toggle_btn = '<button id="theme-toggle" class="btn btn-sm" aria-label="تبديل الوضع الداكن" style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: var(--radius-full); width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; font-size: 1.1rem; margin-right: 1rem;">🌙</button>'
    
    # Inject before the nav-toggle button
    content = re.sub(r'(<button type="button" class="nav-toggle")', f'{toggle_btn}\\n      \\1', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def inject_toggle_js(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    js_logic = """
  // Theme Toggle Logic
  const themeToggle = document.getElementById('theme-toggle');
  
  function setTheme(isDark) {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeToggle) themeToggle.textContent = '☀️';
      localStorage.setItem('ishara-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeToggle) themeToggle.textContent = '🌙';
      localStorage.setItem('ishara-theme', 'light');
    }
  }

  // Init theme
  const savedTheme = localStorage.getItem('ishara-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    setTheme(true);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.hasAttribute('data-theme');
      setTheme(!isDark);
    });
  }
"""
    if "Theme Toggle Logic" not in content:
        content = content.replace('// Initialize UI', f'// Initialize UI\n{js_logic}')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# CSS
css_file = os.path.join(base_dir, 'css', 'base.css')
if "data-theme" not in open(css_file, 'r', encoding='utf-8').read():
    append_css(css_file)

# HTML
for filename in ['index.html', 'dictionary.html', 'grammar.html', 'culture.html']:
    filepath = os.path.join(base_dir, filename)
    if os.path.exists(filepath) and "theme-toggle" not in open(filepath, 'r', encoding='utf-8').read():
        inject_toggle_html(filepath)

# JS
js_file = os.path.join(base_dir, 'js', 'main.js')
if os.path.exists(js_file):
    inject_toggle_js(js_file)

print("Dark mode feature injected successfully.")
