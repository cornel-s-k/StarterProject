/* eslint-disable no-restricted-globals */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.0/workbox-sw.js');

const { precacheAndRoute } = workbox.precaching;
const { registerRoute } = workbox.routing;
const { StaleWhileRevalidate, CacheFirst, NetworkOnly } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

registerRoute(
  ({ request }) => request.destination === 'style' ||
                   request.destination === 'script' ||
                   request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'static-assets-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
      }),
    ],
  })
);

registerRoute(
  ({ url, request }) => url.pathname.startsWith('https://story-api.dicoding.dev/v1/stories') && request.method === 'GET',
  new CacheFirst({
    cacheName: 'api-stories-get-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 1 * 24 * 60 * 60, // 1 Day
        maxEntries: 50,
      }),
    ],
  })
);

registerRoute(
  ({ url, request }) => url.pathname.startsWith('https://story-api.dicoding.dev/v1/stories') && request.method === 'POST',
  new NetworkOnly({
    // POST requests are generally not cacheable. This ensures they always go to the network.
  })
);


self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
});

self.addEventListener('fetch', (event) => {
  // Workbox handles most of the fetching. Custom logic can be added here if needed.
});

self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received!');
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Push Notification';
  const options = {
    body: data.message || 'You have a new notification!',
    icon: '/StarterProject/images/icons/icon-192x192.png', // Jalur ikon yang diperbaiki
    badge: '/StarterProject/images/icons/icon-72x72.png',  // Jalur ikon yang diperbaiki
  };

  event.waitUntil(self.registration.showNotification(title, options));
});