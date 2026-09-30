Notación polaca (PWA)

Archivos: index.html, manifest.webmanifest, sw.js, icons/

Probar en local (el service worker requiere http://localhost o HTTPS):
  python3 -m http.server 8080   ->  http://localhost:8080

Publicar: sube la carpeta completa a cualquier hosting HTTPS
(GitHub Pages, Netlify, Cloudflare Pages...). Funciona también en subcarpetas.

Al modificar archivos, cambia CACHE en sw.js (v1 -> v2) para forzar la actualización.
