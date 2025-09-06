const cacheName="dodreamfire-cache-v1";
const filesToCache=["./","./index.html","./manifest.json","./두드림소방로고.png"];

self.addEventListener("install",e=>{
  e.waitUntil(
    caches.open(cacheName).then(cache=>cache.addAll(filesToCache))
  );
});

self.addEventListener("fetch",e=>{
  e.respondWith(
    caches.match(e.request).then(resp=>resp || fetch(e.request))
  );
});
