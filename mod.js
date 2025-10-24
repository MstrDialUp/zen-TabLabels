/**
 * Zen Tab Labels Mod
 * Adds the ability to label tabs with customizable colors
 *
 * @author Zen Browser Community
 * @version 1.0.0
 */

(async function() {
  'use strict';

  // Wait for the browser to be fully loaded
  if (window.gBrowser && window.gBrowser.tabContainer) {
    await initTabLabels();
  } else {
    window.addEventListener('load', initTabLabels);
  }

  async function initTabLabels() {
    try {
      console.log('[Zen Tab Labels] Initializing...');

      // Load CSS
      loadCSS();

      // Load modules
      await loadScript('src/content/storage.js');
      await loadScript('src/content/tabLabels.js');
      await loadScript('src/content/contextMenu.js');

      // Initialize modules
      await window.TabLabelsManager.init();
      window.TabContextMenuManager.init();

      console.log('[Zen Tab Labels] Initialized successfully');
    } catch (error) {
      console.error('[Zen Tab Labels] Failed to initialize:', error);
    }
  }

  /**
   * Load a CSS file
   */
  function loadCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'chrome://browser/content/zen-mods/zen-TabLabels/src/content/tabLabels.css';
    document.head.appendChild(link);
  }

  /**
   * Load a JavaScript file
   */
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `chrome://browser/content/zen-mods/zen-TabLabels/${src}`;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
})();
