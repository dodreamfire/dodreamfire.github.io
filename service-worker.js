const CACHE_NAME = 'dodream-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/두드림소방로고.PNG',
  // 필요하면 js, css 파일 경로도 추가
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
