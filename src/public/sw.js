const CACHE_NAME = 'app-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles/styles.css',
  '/styles/login.css',
  '/images/logo.png',
  '/images/placeholder.jpg',
  '/favicon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request)
          .then((response) => {
            // Clone the response to cache it
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseToCache));
            return response;
          });
      })
      .catch(() => {
        // Fallback for pages
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/offline.html');
        }
      })
  );
});

self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body || 'Anda memiliki notifikasi baru',
    icon: '/images/logo.png',
    badge: '/images/logo.png'
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Notifikasi', options)
  );
});