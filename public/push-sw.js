/*
 * Push notificiations ServiceWorker
 */

// A new notification is coming in, yay!
self.addEventListener('push', function(event) {
  var notificationData = {};

  console.log('PUSH NOTIFICATION!!!!');

  try {
    notificationData = event.data.json();
  } catch (e) {
    console.log('event.data.json() failed', e);
    // 🚨 We either got no data or it's malformatted, ABORT ABORT ABORT
    return;
  }

  // Check if the user is looking at Spectrum right now and don't show a notification
  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then(windowClients => {
        for (let i = 0; i < windowClients.length; i++) {
          const windowClient = windowClients[i];
          // The user is looking at Spectrum right now abort showing the notification!
          // (except for if we're on localhost, i.e. in development)
          if (
            windowClient.focused &&
            !(self.registration.scope.indexOf('http://localhost:3000') === 0)
          ) {
            return;
          }
        }
        return self.registration.showNotification(notificationData.title, {
          vibrate: [200],
          icon: '/img/homescreen-icon-192x192',
          body: notificationData.body,
          timestamp: notificationData.timestamp,
          image: notificationData.image,
          tag: notificationData.tag,
          data: notificationData.data,
          // If we don't set a tag and set renotify to true this'll throw an error
          renotify: notificationData.renotify || !!notificationData.tag,
        });
      })
  );
});

// On notification click
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const urlToOpen = event.notification.data.href
    ? new URL(event.notification.data.href, self.location.origin).href
    : '/';

  // see if the current is open and if it is focus it
  event.waitUntil(
    self.clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then(function(clientList) {
        // If there is an open Spectrum.chat window navigate to the notification href
        if (clientList.length > 0) {
          return clientList[0]
            .focus()
            .then(client => client.navigate(urlToOpen));
        }
        // If there's no open Spectrum.chat window open a new one
        return self.clients.openWindow(urlToOpen);
      })
  );
});
