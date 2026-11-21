/* Word and Number Land service worker. Bump CACHE_NAME on every deploy. */
'use strict';

var CACHE_NAME = 'wordnumberland-v8';
var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './art/bg-home.webp',
  './art/bg-read.webp',
  './art/bg-math.webp',
  './art/bg-spell.webp',
  './art/bg-money.webp',
  './art/bg-time.webp',
  './art/helper-read.webp',
  './art/helper-math.webp',
  './art/helper-spell.webp',
  './art/helper-money.webp',
  './art/helper-time.webp',
  './art/icon-read.webp',
  './art/icon-math.webp',
  './art/icon-spell.webp',
  './art/icon-money.webp',
  './art/icon-time.webp',
  './art/icon-write.webp',
  './art/helper-write.webp',
  './art/bg-write.webp',
  './art/balloon.webp',
  './art/basket.webp',
  './art/bg-pop.webp',
  './art/bg-sort.webp',
  './art/frog.webp',
  './art/helper-pop.webp',
  './art/helper-sort.webp',
  './art/icon-book.webp',
  './art/icon-pop.webp',
  './art/icon-sort.webp',
  './art/lilypad.webp',
  './art/st-balloon.webp',
  './art/st-car.webp',
  './art/st-cat.webp',
  './art/st-dino.webp',
  './art/st-dog.webp',
  './art/st-icecream.webp',
  './art/st-penguin.webp',
  './art/st-rainbow.webp',
  './art/st-robot.webp',
  './art/st-rocket.webp',
  './art/st-ship.webp',
  './art/st-sun.webp',
  './art/st-trophy.webp',
  './art/st-turtle.webp',
  './art/st-unicorn.webp'
];
var NETWORK_TIMEOUT_MS = 2500;

/* GitHub Pages tells browsers to keep files for ten minutes. Always ask the
 * server again (a cheap 304 when nothing changed) so a new build is never
 * hidden behind a stale HTTP cache. */
function freshFetch(url) {
  return fetch(url, { cache: 'no-cache', credentials: 'same-origin' });
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return Promise.all(ASSETS.map(function (url) {
          return freshFetch(url).then(function (res) {
            if (!res || !res.ok) throw new Error('precache failed: ' + url);
            return cache.put(url, res);
          });
        }));
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  var isPage = req.mode === 'navigate' || url.pathname.slice(-1) === '/' || url.pathname.slice(-11) === '/index.html';
  event.respondWith(isPage ? networkFirst(req) : cacheFirst(req));
});

/* Pages: try the network briefly so a deploy shows up, fall back to cache when offline. */
function networkFirst(req) {
  var net = freshFetch(req.url).then(function (res) {
    if (res && res.ok) {
      var copy = res.clone();
      caches.open(CACHE_NAME).then(function (cache) { cache.put(req, copy); });
    }
    return res;
  });
  var timeout = new Promise(function (resolve) { setTimeout(resolve, NETWORK_TIMEOUT_MS, null); });
  return Promise.race([net.catch(function () { return null; }), timeout]).then(function (res) {
    if (res) return res;
    return caches.match(req)
      .then(function (cached) { return cached || caches.match('./index.html'); })
      .then(function (cached) { return cached || net; });
  });
}

/* Everything else: cache first, fill the cache from the network on a miss. */
function cacheFirst(req) {
  return caches.match(req).then(function (cached) {
    if (cached) return cached;
    return fetch(req).then(function (res) {
      if (res && res.ok) {
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(req, copy); });
      }
      return res;
    });
  });
}
