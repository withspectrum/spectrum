// @flow
// In production, we register a service worker to serve assets from local cache.

import webPushManager from './helpers/web-push-manager';

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.

// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.

export type ServiceWorkerResult = {
  newContent?: boolean,
  firstCache?: boolean,
};

export default function register(): Promise<ServiceWorkerResult> {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    return new Promise(res => {
      window.addEventListener('load', () => {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
        navigator.serviceWorker
          .register(swUrl)
          .then(registration => {
            if ('PushManager' in window) {
              webPushManager.set(registration.pushManager);
            }
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // At this point, the old content will have been purged and
                    // the fresh content will have been added to the cache.
                    res({ newContent: true });
                  } else {
                    // At this point, everything has been precached.
                    res({ firstCache: true });
                  }
                }
              };
            };
          })
          .catch(error => {
            console.error('Error during service worker registration:', error);
          });
      });
    });
  } else {
    return Promise.resolve({});
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
