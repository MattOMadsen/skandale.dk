// js/pwa.js – registrerer service worker på alle sider der inkluderer dette script

(function() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js', { scope: './' })
      .catch((err) => console.warn('[PWA] Service worker kunne ikke registreres:', err));
  });
})();