let version = '0.1.1';

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

self.addEventListener('fetch', (e) => {
  let requestURL = new URL(e.request.url);

  if (requestURL.hostname == 'static-cdn.sr.se') {
    e.respondWith(
      caches.match(e.request).then(function (response) {
        if (response) {
          console.log('found ' + e );
          return response;
        }
        return fetch(event.request).then(function(response) {
          console.log('Response from network is:', response);
          cache.add(response);
          return response;
        }).catch(function(error) {
          console.error('Fetching failed:', error);

          throw error;
        });
      })
    )

  }

  if(requestURL.hostname == 'api.sr.se') {

  }

  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
