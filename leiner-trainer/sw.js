/* rytdocs app: caches the app so it opens offline. Bump VERSION when you upload a new index.html. */
var VERSION = 'rytdocs-leiner-trainer-5';
var FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png?v=5', './icon-512.png?v=5'];
self.addEventListener('install', function(e){ e.waitUntil(caches.open(VERSION).then(function(c){ return c.addAll(FILES); }).then(function(){ return self.skipWaiting(); })); });
self.addEventListener('activate', function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k !== VERSION; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  var req = e.request;
  var fresh = fetch(req).then(function(r){ if (r && r.ok){ var cp = r.clone(); caches.open(VERSION).then(function(c){ c.put(req, cp); }); } return r; });
  var cached = function(){ return caches.match(req).then(function(hit){ return hit || caches.match('./index.html').then(function(r){ return r || new Response('Offline', {status: 503}); }); }); };
  /* online: always the newest copy, so an update shows on the very next open; offline or slower than 3 seconds: the saved copy */
  e.respondWith(Promise.race([fresh.catch(cached), new Promise(function(res){ setTimeout(function(){ res(cached()); }, 3000); })]));
});
