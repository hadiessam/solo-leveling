/* =====================================================================
   SOLO LEVELING — SERVICE WORKER
   Makes the app installable and keeps it working offline.
   Bump CACHE when you change any file, otherwise the phone serves the old one.
   ===================================================================== */

const CACHE   = 'solo-leveling-v42';

/* code + markup — these MUST always be fresh */
const CORE = [
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
  './manifest.json'
];

/* images — safe to serve stale, they never change */
const MEDIA = [
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

const ALL = CORE.concat(MEDIA);

/* fetch with the HTTP cache bypassed — we never want yesterday's data.js */
function net(req){
  return fetch(req, { cache: 'reload' });
}

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      /* cache each file on its own. If one icon 404s the worker must still
         install — otherwise the old worker keeps running forever and the
         app never updates. */
      Promise.all(ALL.map(u =>
        net(new Request(u)).then(res => {
          if(res && res.status === 200 && res.type === 'basic') cache.put(u, res.clone());
        }).catch(() => {})
      ))
    ).then(() => self.skipWaiting())
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

/* let the page tell us to take over immediately */
self.addEventListener('message', e => {
  if(e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

/* ---------------------------------------------------------------------
   STRATEGY

   1. Navigations and code -> NETWORK FIRST, cache fallback.
      Online you always get the newest missions on the very first normal
      refresh. Offline you still load from cache.

      This replaces stale-while-revalidate, which answered with the cached
      file and only fetched the new one in the background — so the first
      refresh after an update still showed the old missions and the user
      had to hard-reload several times.

   2. Images -> stale-while-revalidate (they never change, and blocking on
      them would slow every page load).
   --------------------------------------------------------------------- */
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;   /* let fonts/CDN go to network */

  const isNavigate = req.mode === 'navigate';
  const isMedia    = url.pathname.match(/\.(png|jpe?g|gif|webp|svg|ico|woff2?)$/);

  /* code and navigations: network first, cache when offline */
  if (isNavigate || !isMedia) {
    e.respondWith(
      net(req).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() =>
        caches.open(CACHE).then(cache =>
          cache.match(req).then(hit =>
            hit || (isNavigate ? cache.match('./index.html') : null) ||
            new Response('', { status: 504, statusText: 'Offline' })
          )
        )
      )
    );
    return;
  }

  /* media: serve cached immediately, refresh in the background */
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(req).then(cached => {
        const bg = net(req).then(res => {
          if (res && res.status === 200 && res.type === 'basic') cache.put(req, res.clone());
          return res;
        }).catch(() => null);
        return cached || bg;
      })
    )
  );
});
