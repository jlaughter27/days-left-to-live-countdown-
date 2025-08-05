self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("live-transformed-cache").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/styles.css",
        "/app.js",
        "/quotes.js",
        "/manifest.json",
        "/background.png",
        "/icon.png"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
