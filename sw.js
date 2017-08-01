const version = '0.1.3';
const swcache = 'SREPG' + version;
self.addEventListener('install', (e) => {
  //console.log('WORKER: install event in progress.');
  e.waitUntil(
    caches.open(swcache).then(function(cache) {
      return cache.addAll([
        '/SR-EPG/css/color.css',
        '/SR-EPG/css/layout.css',
        '/SR-EPG/js/templates.js',
        '/SR-EPG/js/app.js',
        '/SR-EPG/js/lib/handlebars-v4.0.10.js',
        '/SR-EPG/index.html'
      ]);
    }).then(()=> {
      console.log('WORKER: install ' + version +' completed');
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          if (!/^SREPG/.test(cacheName)) {
            return;
          } else {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    console.log(event.request.url);
    if (event.request.url == 'static-cdn.sr.se') {
      console.log('static');
      return fetch(event.request).then(function (response) {
        let responseClone = response.clone();
        caches.open(swcache).then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      })
    } else {
      return response;
    }
  })
);
});
