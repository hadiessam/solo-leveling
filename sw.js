/* =====================================================================
   SOLO LEVELING — SERVICE WORKER
   Makes the app installable and keeps it working offline.
   Bump CACHE when you change any file, otherwise the phone serves the old one.
   ===================================================================== */

const CACHE = 'solo-leveling-v37';

const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './data.js',
  './vocab.js',
  './icons.js',
  './app.js',
  './render.js',
  './habits.js',
  './speaking.js',
  './uptodate.js',
  './expenses.js',
  './_features1.js',
  './_features2.js',
  './_features3.js',
  './manifest.json',
  './assets/avatar.jpg',
  './assets/jinwoo.png',
  './assets/bg/bg-dashboard.jpg',
  './assets/bg/bg-daily.jpg',
  './assets/bg/bg-weekly.jpg',
  './assets/bg/bg-boss.jpg',
  './assets/bg/bg-hunter.jpg',
  './assets/bg/bg-roadmap.jpg',
  './assets/bg/bg-vault.jpg',
  './assets/bg/bg-guide.jpg',
  './assets/bg/bg-status.jpg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ---------------------------------------------------------------------
   STRATEGY — stale-while-revalidate.

   Why not cache-first: a cache-first service worker serves the OLD file
   indefinitely, which is what made the app appear frozen and out of date
   until the user hard-reloaded it several times. Now we return something
   instantly AND silently refresh it in the background for next time.

   Why not network-first: the app must still work offline, so we fall back
   to cache when the network is unavailable.
   --------------------------------------------------------------------- */
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;   /* let fonts/CDN go to network */

  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(req).then(cached => {
        const networkFetch = fetch(req).then(res => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            cache.put(req, copy);
          }
          return res;
        }).catch(() => null);

        /* instant answer if we have it; otherwise wait for the network */
        if (cached) return cached;
        return networkFetch.then(fresh => {
          if (fresh) return fresh;
          if (req.mode === 'navigate') return cache.match('./index.html');
          return new Response('', { status: 408, statusText: 'Offline' });
        });
      });
    })
  );
});
