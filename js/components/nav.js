/**
 * Ishara — Navigation Component
 * Handles mobile toggle, keyboard traps, and active states.
 */

export function initNav() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  if (toggleBtn && mobileDrawer) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
      toggleBtn.textContent = isOpen ? '✕' : '☰';
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.textContent = '☰';
      }
    });
  }

  // Active page highlight
  const currentPage = document.body.dataset.page;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    const pageAttr = link.dataset.pageTarget;
    if (pageAttr && pageAttr === currentPage) {
      link.classList.add('active');
    }
  });
}
