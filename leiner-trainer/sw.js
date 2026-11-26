/* rytdocs app: caches the app so it opens offline. Bump VERSION when you upload a new index.html. */
var VERSION = 'rytdocs-leiner-trainer-3';
var FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', function(e){ e.waitUntil(caches.open(VERSION).then(function(c){ return c.addAll(FILES); }).then(function(){ return self.skipWaiting(); })); });
self.addEventListener('activate', function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k !== VERSION; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(function(hit){
    var net = fetch(e.request).then(function(r){ if (r && r.ok){ var cp = r.clone(); caches.open(VERSION).then(function(c){ c.put(e.request, cp); }); } return r; }).catch(function(){ return hit || caches.match('./index.html').then(function(r){ return r || new Response('', {status: 503}); }); });
    return hit || net;
  }));
});
