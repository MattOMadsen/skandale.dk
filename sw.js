// sw.js - Service Worker for Skandale.dk PWA
// Grundlæggende offline-support og caching

const CACHE_NAME = 'skandale-dk-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/data.js',
  '/js/main.js',
  '/js/ui.js',
  '/js/search.js',
  '/js/modal-core.js',
  '/js/modal-scandal.js',
  '/js/modal-donor.js',
  '/js/timeline.js',
  '/manifest.json'
];

// Installér Service Worker og cache filer
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(urlsToCache);
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

// Fetch: Cache first, derefter network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Returnér fra cache hvis fundet
        if (response) {
          return response;
        }
        // Ellers hent fra netværk
        return fetch(event.request).then((networkResponse) => {
          // Cache nye responses dynamisk (valgfrit for JSON/data)
          if (event.request.url.includes('/data/') || event.request.url.includes('.json')) {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        });
      })
      .catch(() => {
        // Offline fallback (kan udvides senere)
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});