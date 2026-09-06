import { cleanupOutdatedCaches, precacheAndRoute, matchPrecache } from 'workbox-precaching';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { CacheFirst, NetworkOnly, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Nettoyage des anciens caches générés par les versions précédentes
cleanupOutdatedCaches();

// Précache des assets de build (JS, CSS principal) + Page Offline
// Note: Pensez à incrémenter 'v1' si vous modifiez offline.html manuellement
precacheAndRoute([
  ...self.__WB_MANIFEST,
  { url: '/offline.html', revision: 'v2' },
  { url: '/offline-built.css', revision: 'v3' }
]);

// Ne JAMAIS mettre en cache les tokens ou les requêtes de login/refresh
registerRoute(
  ({ url }) => url.pathname.includes('/token') || url.pathname.includes('/login') || url.pathname.includes('/auth'),
  new NetworkOnly()
);

// Les types de chasses. On sert le cache tout de suite, on met à jour en background.
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/hunt_types'),
  new StaleWhileRevalidate({
    cacheName: 'api-static-data',
    plugins: [
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 7 * 24 * 60 * 60 }), // 7 jours
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// Images statiques (icônes, avatar par défaut). Cache First
registerRoute(
  ({ request, url }) =>
    request.destination === 'image' &&
    (url.pathname.startsWith('/icons/') || url.pathname.includes('user_profile_picture_default.png')),
  new CacheFirst({
    cacheName: 'static-images',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  })
);

// Polices d'écriture
registerRoute(
  ({ request, url }) =>
    request.destination === 'font' || url.pathname.endsWith('.ttf') || url.pathname.endsWith('.woff2'),
  new CacheFirst({
    cacheName: 'fonts-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 365 * 24 * 60 * 60 }), // 1 an
    ],
  })
);

// Stratégie par défaut pour la navigation HTML : Network Only
// On laisse le "catch handler" gérer le cas où ça échoue.
registerRoute(
  ({ request, url }) => request.mode === 'navigate' && !url.pathname.startsWith('/api/'),
  new NetworkOnly()
);

// Gestionnaire global d'erreurs (Offline Fallback)
setCatchHandler(async ({ event }) => {
  // Cas 1 : Navigation HTML (Page complète)
  if (event.request.mode === 'navigate') {
    // Retourne la page offline précachée
    return matchPrecache('/offline.html');
  }

  return Response.error();
});

// Lien avec l'application pour forcer l'activation du nouveau SW
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});