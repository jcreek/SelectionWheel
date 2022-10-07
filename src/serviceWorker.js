import { precacheAndRoute } from 'workbox-precaching';
import * as navigationPreload from 'workbox-navigation-preload';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { registerRoute, NavigationRoute, Route } from 'workbox-routing';

// Precache the manifest
// eslint-disable-next-line no-underscore-dangle, no-restricted-globals
precacheAndRoute(self.__WB_MANIFEST);

// Enable navigation preload - this should reduce navigation latency
navigationPreload.enable();

const navigationRoute = new NavigationRoute(new NetworkFirst({
  cacheName: 'navigations',
}));

const imageAssetRoute = new Route(({ request }) => request.destination === 'image', new CacheFirst({
  cacheName: 'image-assets',
}));

registerRoute(navigationRoute);
registerRoute(imageAssetRoute);
