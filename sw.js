const CACHE_NAME = 'hymns-we-love-v4';
const ASSETS = [
  '/', '/index.html', '/manifest.json', '/favicon.ico',
  '/apple-touch-icon.png', '/apple-touch-icon-precomposed.png',
  '/icons/icon-60.png', '/icons/icon-76.png', '/icons/icon-120.png',
  '/icons/icon-152.png', '/icons/icon-167.png', '/icons/icon-180.png',
  '/icons/icon-192.png', '/icons/icon-512.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(r => { const c=r.clone(); caches.open(CACHE_NAME).then(ca=>ca.put(e.request,c)); return r; }).catch(() => caches.match('/index.html')));
  } else {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
});
