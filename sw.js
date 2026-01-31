const CACHE_NAME = "quiz-cache-v5"; // 🔴 changer à chaque MAJ

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./questions.json",
  "./manifest.json"
];

self.addEventListener("install", event => {
  self.skipWaiting(); // 🔥 prêt immédiatement
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim(); // 🔥 prend le contrôle
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(res => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
