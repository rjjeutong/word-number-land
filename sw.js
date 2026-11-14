/* Word and Number Land service worker. Bump CACHE_NAME on every deploy. */
'use strict';

var CACHE_NAME = 'wordnumberland-v1';
var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
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
