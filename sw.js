/**
 * ============================================================================
 * TIENDAS YOLO® — SERVICE WORKER RESILIENTE (PWA & OFFLINE-READY)
 * ============================================================================
 */

const CACHE_NAME = 'tiendas-yolo-cache-v6';
const STATIC_ASSETS = [
  './',
  './index.html',
  './admin.html',
  './styles.css',
  './app.js',
  './admin.js',
  './manifest.webmanifest',
  './manifest.json',
  './logo-yolo.png',
  './favicon.png',
  './icon-192.png',
  './icon-512.png',
  './screenshot-desktop.png',
  './screenshot-mobile.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // Usar Promise.allSettled para que si algún recurso no existe, NO aborte la instalación de la PWA
      const cachePromises = STATIC_ASSETS.map(url => 
        cache.add(url).catch(err => {
          console.warn(`[SW] Opcional no precacheado: ${url}`, err);
        })
      );
      await Promise.allSettled(cachePromises);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Ignorar métodos no GET y llamadas a APIs externas (Google Sheets, WhatsApp, etc.)
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Devolver caché pero refrescar en segundo plano (stale-while-revalidate suave)
        fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    }).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
