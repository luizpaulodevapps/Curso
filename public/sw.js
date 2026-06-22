const CACHE = "devestudos-v1"
const URLS = ["/", "/cursos", "/manifest.json"]

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(URLS)).then(() => self.skipWaiting())
  )
})

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  )
})

self.addEventListener("fetch", event => {
  // Only handle HTTP and HTTPS requests to prevent handling scheme-less or other protocols
  if (!event.request.url.startsWith("http")) return;

  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        // Rejecting the promise instead of returning undefined avoids TypeError: Failed to convert value to 'Response'
        throw new Error("Offline: Resource not in cache");
      })
    )
  )
})
