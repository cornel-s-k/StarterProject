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

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
          console.log(`Cached successfully: ${url}`);
        } catch (err) {
          console.error(`Failed to cache: ${url}`, err);
        }
      }
    })()
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() => caches.match(`${BASE_PATH}/index.html`))
      );
    })
  );
});

self.addEventListener("push", (event) => {
  console.log("Service worker pushing...");

  async function chainPromise() {
    await self.registration.showNotification("Perhatian", {
      body: "Cerita baru telah ditambahkan",
    });
  }

  event.waitUntil(chainPromise());
});
