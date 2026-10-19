// Sube el número de versión cada vez que cambies algún archivo.
const VERSION = 'v1.2';
const CACHE = 'notacion-polaca-' + VERSION;
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png'
];

// Envía la versión actual a todos los clientes controlados.
function broadcastVersion() {
  const msg = { type: 'VERSION', version: VERSION };
  self.clients.matchAll({ includeUncontrolled: true }).then(clients =>
    clients.forEach(c => c.postMessage(msg))
  );
}

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      // Filtrar por prefijo propio: caches.keys() es global al origen y
      // sin este filtro se borraban las cachés del portal y demás apps.
      .then(keys => Promise.all(keys.filter(k => k.startsWith('notacion-polaca-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(broadcastVersion)
  );
});

// Responde a peticiones explícitas de versión desde la página.
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'GET_VERSION') {
    e.source.postMessage({ type: 'VERSION', version: VERSION });
  }
});

// Caché primero; si no está, red; sin red, devuelve la página principal.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit =>
      hit || fetch(e.request).then(res => {
        if (res.ok && new URL(e.request.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => e.request.mode === 'navigate' ? caches.match('./index.html') : Response.error())
    )
  );
});
