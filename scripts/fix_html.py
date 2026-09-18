import os
import re

header_clean = """<header class="site-header">
    <div class="container header-container">
      <a href="index.html" class="brand">
        <div class="brand-icon">✨</div>
        <div class="brand-text">
          <span class="brand-title">إشارة</span>
          <span class="brand-sub">تعلم لغة الإشارة المصرية</span>
        </div>
      </a>

      <nav class="nav-desktop" aria-label="التنقل الرئيسي">
        <a href="index.html" class="nav-link" data-page-target="home">الرئيسية</a>
        <a href="dictionary.html" class="nav-link" data-page-target="dictionary">القاموس الإشاري</a>
        <a href="grammar.html" class="nav-link" data-page-target="grammar">القواعد والتراكيب</a>
        <a href="culture.html" class="nav-link" data-page-target="culture">ثقافة الصم</a>
      </nav>

      <button type="button" class="nav-toggle" aria-label="فتح القائمة" aria-expanded="false">☰</button>
    </div>

    <!-- Mobile Drawer -->
    <div class="container mobile-drawer">
      <a href="index.html" class="nav-link" data-page-target="home">الرئيسية</a>
      <a href="dictionary.html" class="nav-link" data-page-target="dictionary">القاموس الإشاري</a>
      <a href="grammar.html" class="nav-link" data-page-target="grammar">القواعد والتراكيب</a>
      <a href="culture.html" class="nav-link" data-page-target="culture">ثقافة الصم</a>
    </div>
  </header>"""

footer_clean = """<footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="brand">
            <div class="brand-icon" style="width: 2rem; height: 2rem; font-size: 1.1rem;">✨</div>
            <span class="brand-title" style="font-size: var(--text-lg);">منصة إشارة</span>
          </div>
          <p class="footer-disclaimer">
            مشروع مفتوح المصدر لتعليم لغة الإشارة المصرية (ESL) بأسلوب حديث، يركز على القواعد الصحيحة، ثقافة الصم، والمفردات المرئية بدقة.
          </p>
        </div>

        <div class="footer-col">
          <h4 class="footer-col-title">أقسام المنصة</h4>
          <ul class="footer-links">
            <li><a href="index.html">الرئيسية</a></li>
            <li><a href="dictionary.html">القاموس الإشاري</a></li>
            <li><a href="grammar.html">القواعد والتراكيب</a></li>
            <li><a href="culture.html">ثقافة الصم</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-col-title">المعايير التقنية</h4>
          <ul class="footer-links">
            <li><span class="badge badge-teal">ESL Linguistic Standard</span></li>
            <li><span class="badge badge-neutral">Topic-Comment Syntax</span></li>
            <li><span class="badge badge-neutral">Zero Build Vanilla JS</span></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div>جميع الحقوق محفوظة © منصة إشارة 2026 - الدليل المرجعي للغة الإشارة المصرية.</div>
        <div>تصميم وتطوير بواجهة مستخدم متوافقة مع اللغة العربية (RTL Native).</div>
      </div>
    </div>
  </footer>"""

def fix_html_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace header
    content = re.sub(r'<header class="site-header">.*?</header>', header_clean, content, flags=re.DOTALL)
    # Replace footer
    content = re.sub(r'<footer class="site-footer">.*?</footer>', footer_clean, content, flags=re.DOTALL)

    # Specific fixes for index.html titles
    content = re.sub(r'OOU\?O- O U,OO\'O OO O.*?O-USO OUSOc O U,USU\^U\.USOc\.', 
                     'تصفح الإشارات مقسمة حسب الفئات لتسهيل الوصول والتمرن على الاستخدام اليومي.', content)
    content = re.sub(r'dY"s</span>\s*<span>.*?</span>', 
                     'dY"s</span>\n            <span>تصفح حسب الفئات</span>', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
for filename in ['index.html', 'dictionary.html', 'grammar.html', 'culture.html']:
    filepath = os.path.join(base_dir, filename)
    if os.path.exists(filepath):
        print(f"Fixing {filename}...")
        fix_html_file(filepath)
    else:
        print(f"File {filename} not found.")

print("Mojibake fixed in headers and footers.")
