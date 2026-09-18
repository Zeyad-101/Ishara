/**
 * Ishara — Main Entrypoint
 * Conforms to Freelance Client Template:
 * Initializes global components and dynamically imports the page module by data-page.
 */

import { initNav } from "./components/nav.js";
import { initModal } from "./components/modal.js";
import { initTheme } from "./components/theme.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Initialize shared components
  initTheme();
  initNav();
  initModal();

  // Dynamic module import driven by data-page attribute
  const page = document.body.dataset.page;
  if (page) {
    try {
      const module = await import(`./pages/${page}.js`);
      if (typeof module.init === 'function') {
        module.init();
      }
    } catch (error) {
      console.error(`[Ishara] Failed to load page module: pages/${page}.js`, error);
    }
  }
});
