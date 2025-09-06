const CACHE_NAME = 'dodreamfire-cache-v1';
const urlsToCache = [
  './index.html',
  './manifest.json',
  './dodreamfirelogo.PNG'
];

self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache=>{
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(response=>{
      return response || fetch(e.request);
    })
  );
});
