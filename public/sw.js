import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';

const FILTER_PRECACHED = ["src/tailwind-config.css"];

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST.filter((el) => !FILTER_PRECACHED.includes(el.url)));

const matchTailwind = ({url}) => {
  return url.pathname === '/src/tailwind-config.css';
};
const handlerTailwind = ({request}) => {
  return fetch(request);
};

registerRoute(matchTailwind, handlerTailwind);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});