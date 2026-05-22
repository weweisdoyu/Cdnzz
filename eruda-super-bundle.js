(function () {
  'use strict';

  const TAG = '[Eruda FIX]';
  const ERUDA_CDN = 'https://cdn.jsdelivr.net/npm/eruda';

  if (window.__ERUDA_FIX_LOADED__) {
    if (window.eruda) window.eruda.show();
    return;
  }

  window.__ERUDA_FIX_LOADED__ = true;

  function safeLog(...args) {
    try { console.log(TAG, ...args); } catch (_) {}
  }

  function loadScript(src, cb) {
    const old = document.querySelector('script[data-eruda-fix="1"]');
    if (old) old.remove();

    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.defer = true;
    s.dataset.erudaFix = '1';

    s.onload = cb;
    s.onerror = function () {
      console.error(TAG, 'Gagal load Eruda:', src);
    };

    (document.head || document.documentElement || document.body).appendChild(s);
  }

  function forceVisible() {
    const eruda = document.getElementById('eruda');
    const entry = document.querySelector('.eruda-entry-btn');

    if (eruda) {
      eruda.style.setProperty('z-index', '2147483647', 'important');
      eruda.style.setProperty('display', 'block', 'important');
      eruda.style.setProperty('visibility', 'visible', 'important');
      eruda.style.setProperty('opacity', '1', 'important');
      eruda.style.setProperty('position', 'fixed', 'important');
    }

    if (entry) {
      entry.style.setProperty('z-index', '2147483647', 'important');
      entry.style.setProperty('display', 'block', 'important');
      entry.style.setProperty('visibility', 'visible', 'important');
      entry.style.setProperty('opacity', '1', 'important');
      entry.style.setProperty('position', 'fixed', 'important');
    }
  }

  function initEruda() {
    if (!window.eruda) {
      console.error(TAG, 'Eruda belum kebaca.');
      return;
    }

    try {
      window.eruda.init({
        useShadowDom: true,
        autoScale: true,
        defaults: {
          displaySize: 50,
          transparency: 0.95,
          theme: 'Monokai Pro'
        },
        tool: [
          'console',
          'elements',
          'network',
          'resources',
          'sources',
          'info'
        ]
      });

      window.eruda.show();
      forceVisible();

      setInterval(forceVisible, 1500);

      window.addEventListener('keydown', function (e) {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && String(e.key).toLowerCase() === 'i')
        ) {
          e.preventDefault();
          if (window.eruda) window.eruda.show();
          forceVisible();
        }
      });

      safeLog('Eruda muncul aman.');
    } catch (err) {
      console.error(TAG, 'Init error:', err);

      try {
        window.eruda.init();
        window.eruda.show();
        forceVisible();
      } catch (e) {
        console.error(TAG, 'Fallback init juga gagal:', e);
      }
    }
  }

  if (window.eruda) {
    initEruda();
  } else {
    loadScript(ERUDA_CDN, initEruda);
  }
})();
