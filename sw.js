// sw.js - Service Worker for Skandale.dk PWA
// Grundlæggende offline-support og caching

const CACHE_NAME = 'skandale-dk-v4';

function getScopeBase() {
  const scope = self.registration?.scope || self.location.href;
  return scope.endsWith('/') ? scope : `${scope}/`;
}

function scopedUrls() {
  const base = getScopeBase();
  return [
    base,
    `${base}index.html`,
    `${base}css/styles.css`,
    `${base}js/site-stats.js`,
    `${base}js/site-meta.js`,
    `${base}js/data.js`,
    `${base}js/stats-snapshot.js`,
    `${base}js/main.js`,
    `${base}js/ui.js`,
    `${base}js/search.js`,
    `${base}js/modal-core.js`,
    `${base}js/config/secrets.public.js`,
    `${base}manifest.json`
  ];
}

// Installér Service Worker og cache filer
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(scopedUrls());
      })
      .then(() => self.skipWaiting())
  );
});

// Aktivér og ryd gamle caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Rydder gammel cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for data/JSON, cache-first for app shell
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isDataRequest = url.pathname.includes('/data/') || url.pathname.endsWith('.json');

  if (isDataRequest) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) return response;
        return fetch(event.request);
      })
      .catch(() => {
        if (event.request.destination === 'document') {
          const base = getScopeBase();
          return caches.match(`${base}index.html`);
        }
      })
  );
});