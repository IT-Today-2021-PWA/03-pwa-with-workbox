// / <reference lib="webworker" />
import { createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { skipWaiting, clientsClaim } from 'workbox-core';

declare const self: Window & ServiceWorkerGlobalScope;

skipWaiting();
clientsClaim();

const precacheManifest = [].concat(self.__WB_MANIFEST as Array<any> || []);
precacheAndRoute(precacheManifest);

const handler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(handler, {
  denylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
});
registerRoute(navigationRoute);

registerRoute(
  (event) => event.request.url.startsWith('https://api.jikan.moe/'),
  new StaleWhileRevalidate({
    cacheName: 'api.jikan.moe',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200]
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60
      })
    ]
  })
);

registerRoute(
  (event) => event.request.url.startsWith('https://cdn.myanimelist.net/images/anime/'),
  new CacheFirst({
    cacheName: 'myanimelist-images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 14 * 24 * 60 * 60,
      })
    ]
  })
);
