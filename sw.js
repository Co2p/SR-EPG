let version = '0.1';

self.addEventListener('install', (event) => {
  //console.log('WORKER: install event in progress.');
  event.waitUntil(
    caches.open('SREPG' + version).then(function(cache) {
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
    caches.keys().then((cacheNames) => {
      return promiseAll(
        cacheNames.filter((cacheName) => {
          if (!/^SREPG/.test(cacheName)) {
            return;
          } else {
            return caches.delete(cacheName);
          }
        });
      );
    });
  );
});

self.addEventListener('fetch', (e) => {
  let requestURL = new URL(event.request.url);

  if (requestURL.hostname == 'static-cdn.sr.se') {
    console.log('saved a bit of bandwidth');
    return caches.match(e.request);
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
