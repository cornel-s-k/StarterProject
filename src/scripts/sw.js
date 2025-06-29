/* eslint-disable no-restricted-globals */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.0/workbox-sw.js');

const { precacheAndRoute } = workbox.precaching;
const { registerRoute } = workbox.routing;
const { StaleWhileRevalidate, CacheFirst, NetworkOnly } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;

const CACHE_NAME = "starter-project-with-webpack-v1";
const BASE_PATH = "/starter-project-with-webpack";

const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/app.bundle.js`,
  `${BASE_PATH}/app.css`,
  `${BASE_PATH}/images/hero.png`,
  `${BASE_PATH}/favicon.png`,
  `${BASE_PATH}/images/logo.png`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/sw.bundle.js`,
];

precacheAndRoute(self.__WB_MANIFEST || []);
precacheAndRoute(urlsToCache);


registerRoute(
  ({ request }) => request.mode === 'navigate',
  new CacheFirst({
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
        maxAgeSeconds: 7 * 24 * 60 * 60,
        maxEntries: 50,
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
        maxAgeSeconds: 1 * 24 * 60 * 60,
        maxEntries: 50,
      }),
    ],
  })
);

registerRoute(
  ({ url, request }) => url.pathname.startsWith('https://story-api.dicoding.dev/v1/stories') && request.method === 'POST',
  new NetworkOnly({
  })
);


self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
});

self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received!');
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Push Notification';
  const options = {
    body: data.message || 'You have a new notification!',
    icon: `${BASE_PATH}/images/icons/logo.png`,
    badge: `${BASE_PATH}/images/icons/logo.png`,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});