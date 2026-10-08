/* =====================================================================
   SOLO LEVELING — SERVICE WORKER
   Makes the app installable and keeps it working offline.
   Bump CACHE when you change any file, otherwise the phone serves the old one.
   ===================================================================== */

const CACHE = 'solo-leveling-v30';

const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './data.js',
  './vocab.js',
  './icons.js',
  './app.js',
  './render.js',
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

/* cache-first for our own files, network fallback */
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;   /* let fonts/CDN go to network */

  e.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
