const CACHE_NAME = 'dodream-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/dodreamfirelogo.PNG',
  // 필요한 js, css 파일 경로 추가
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
