import webPush from 'web-push';

try {
  webPush.setVapidDetails(
    'https://spectrum.chat',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  console.log('Web push notifications to enabled!');
} catch (err) {}

export const sendWebPushNotification = (subscription, payload, options) => {
  if (!subscription || !payload) {
    if (process.env.NODE_ENV === 'development')
      console.log(
        'No subscription or payload provided to sendWebPushNotification, not pushing anything.'
      );
    return Promise.resolve({});
  }
  const pl = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return webPush.sendNotification(subscription, pl, {
    TTL: 86400, // Default TTL: One day
    ...options,
  });
};
