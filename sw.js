const version = '0.2.7';
const swcache = 'SREPG' + version;
self.addEventListener('install', (e) => {
  //console.log('WORKER: install event in progress.');
  e.waitUntil(
    caches.open(swcache).then(function(cache) {
      return cache.addAll([
        '/radio/css/color.css',
        '/radio/css/layout.css',
        '/radio/img/ic_fav.png',
        '/radio/img/info.svg',
        '/radio/img/playhead.svg',
        '/radio/img/play.svg',
        '/radio/img/pause.svg',
        '/radio/img/loading.svg',
        '/radio/img/p1.svg',
        '/radio/img/p2.svg',
        '/radio/img/p3.svg',
        '/radio/img/p4.svg',
        '/radio/js/templates.min.js',
        '/radio/js/helpers.min.js',
        '/radio/js/app.min.js',
        '/radio/js/audio.min.js',
        '/radio/js/lib/jquery-3.2.1.min.js',
        '/radio/js/lib/jquery-ui.min.js',
        '/radio/index.html'
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
  var requestURL = new URL(event.request.url);

  event.respondWith(caches.match(event.request).then(function(response) {
    if (response != undefined) {
      return response;
    } else if (requestURL.hostname == 'static-cdn.sr.se') {
      caches.open(swcache).then(function (cache) {
        return fetch(event.request).then(function (cresponse) {
          cache.put(event.request, cresponse.clone());
          response = cresponse;
          return cresponse;
        })
      });
    }
    return fetch(event.request);
  })
);
});
