// Minimal service worker: caches the app shell so the site opens instantly
// (and still opens, showing a friendly offline message) even with no signal.
// Live data (waiting count, bookings) always comes from Firebase over the network when available —
// this cache only covers the static shell, never booking data itself.
const CACHE_NAME = 'almiral-shell-v1';
const SHELL_FILES = ['./index.html', './icon-192.png', './icon-512.png', './manifest.json'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Network-first for navigations/data so live booking info is never stale;
    // falls back to the cached shell only when there's no connection at all.
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request).then((res) => res || caches.match('./index.html')))
    );
});
