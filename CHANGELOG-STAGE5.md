# Stage 5 change log — PWA and offline support (local preparation)

Base: Stage 4 (seafix), unchanged geometry. The six Stage 3 geometry modules
remain byte-identical (regression check passes). Version bumped to 0.5.0.

## Added
- `public/manifest.webmanifest` — standalone display, theme/background
  #0d1a22, icons 192/512 plus a maskable 512.
- `public/icons/` — icon-192, icon-512, icon-maskable-512 and
  apple-touch-icon (180), generated from the model's overall view.
- `public/offline.html` — fallback page shown only if a navigation misses
  the cache entirely (e.g. the app was never cached on this device).
- Service worker, generated at build time by a small Vite plugin in
  `vite.config.js`: precaches every file in `dist` under a content-hash
  cache name (`coralis-<hash>`); a new build replaces the old cache on the
  next launch. Navigations are network-first with cache fallback; all
  other requests are cache-first.
- Online/offline indicator (`#net` banner) and the iOS PWA meta tags
  (apple-touch-icon, apple-mobile-web-app-capable, theme-color) in
  `index.html`.
- `src/main.js`: service worker registration with an update reload guard,
  plus the offline banner wiring. App behaviour is otherwise unchanged.

## Verified locally (desktop headless Chrome — NOT a real iPad)
- All Stage 4 automated checks still pass (geometry, regression, inspection).
- Service worker activates and precaches 9 files.
- With the network fully off: the app reloads from cache, the model renders,
  the offline banner shows, and the in-browser self-test passes 32/32.
- Real-iPad offline verification is still outstanding (see deployment plan).
