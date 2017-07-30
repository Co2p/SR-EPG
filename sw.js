const version = '0.1.2';

self.addEventListener('install', (e) => {
  //console.log('WORKER: install event in progress.');
  e.waitUntil(
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
    console.log('static');
    e.respondWith(
      caches.match(e.request).then(function (response) {
        if (response) {
          console.log('found ' + response );
          return response;
        }
        return fetch(e.request).then(function(response) {
          caches.open('SREPG' + version).then(function(cache) {
            return cache.add(response);
          }).then(()=> {
            console.log('cached ' + response);
          }).catch(function(error) {
            console.error('Fetching failed:', error);

            throw error;
          });
          return response;
        }).catch(function(error) {
          console.error('Fetching failed:', error);

          throw error;
        });
      }).catch(function(error) {
        console.error('Fetching failed:', error);

        throw error;
      });
    )

  }
  /*if(requestURL.hostname == 'api.sr.se') {

  }*/
  else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});
