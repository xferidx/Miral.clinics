// Minimal service worker: caches the app shell so the site opens instantly
// (and still opens, showing a friendly offline message) even with no signal.
// Live data (waiting count, bookings) always comes from Firebase over the network when available —
// this cache only covers the static shell, never booking data itself.
const CACHE_NAME = 'almiral-shell-v2';
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
    const req = event.request;
    // Only handle our own pages and files (GET, same origin). Everything else — Firebase sign-in,
    // database and storage calls, fonts, scripts from other sites — goes straight to the network
    // untouched, so this worker can never interfere with logging in or saving data.
    if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
    // Network-first so pages are never stale; falls back to the cached shell only when offline.
    event.respondWith(
        fetch(req).catch(() => caches.match(req).then((res) => res || caches.match('./index.html')))
    );
});
