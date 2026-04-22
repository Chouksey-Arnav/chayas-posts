const CACHE = 'chayas-v1';

// Pages to pre-cache on install so they work immediately offline
const PRECACHE = [
  '/',
  '/about',
  '/accomplishments',
  '/offline.html',
  '/api/posts',
];

// ── Install: pre-cache core pages ─────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: delete any old cache versions ───────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: smart caching strategy per resource type ───────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only intercept GET from our own origin
  if (request.method !== 'GET' || url.origin !== location.origin) return;

  // ── Strategy 1: Cache-first for immutable hashed Next.js assets
  //    (_next/static files have content hashes — safe to serve from cache forever)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(res => {
          caches.open(CACHE).then(c => c.put(request, res.clone()));
          return res;
        });
      })
    );
    return;
  }

  // ── Strategy 2: Network-first for /api/posts
  //    Try to get fresh posts; if offline, serve the last cached version
  if (url.pathname === '/api/posts') {
    event.respondWith(
      fetch(request)
        .then(res => {
          caches.open(CACHE).then(c => c.put(request, res.clone()));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // ── Strategy 3: Network-first for page navigations
  //    Try network → cache → offline fallback page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(res => {
          caches.open(CACHE).then(c => c.put(request, res.clone()));
          return res;
        })
        .catch(() =>
          caches.match(request).then(cached => cached || caches.match('/offline.html'))
        )
    );
    return;
  }

  // ── Strategy 4: Network-first for everything else (fonts, images, etc.)
  event.respondWith(
    fetch(request)
      .then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(request, res.clone()));
        return res;
      })
      .catch(() => caches.match(request))
  );
});
