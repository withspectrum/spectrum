/* eslint-disable */
// A simple, no-op service worker that takes immediate control.
// from: https://stackoverflow.com/a/38980776

self.addEventListener('install', () => {
  // Skip over the "waiting" lifecycle state, to ensure that our
  // new service worker is activated immediately, even if there's
  // another tab open controlled by our older service worker code.
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  // Get a list of all the current open windows/tabs under
  // our service worker's control, and force them to reload.
  // This can "unbreak" any open windows/tabs as soon as the new
  // service worker activates, rather than users having to manually reload.
  self.clients.matchAll({ type: 'window' }).then(windowClients => {
    windowClients.forEach(windowClient => {
      windowClient.navigate(windowClient.url);
    });
  });
});
