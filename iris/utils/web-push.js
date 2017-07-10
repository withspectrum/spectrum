import webPush from 'web-push';
const debug = require('debug')('iris:utils:web-push');
import { getSubscription } from '../models/web-push-subscription';

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
  debug(`send notification to endpoint ${subscription.endpoint}`);
  const pl = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return webPush.sendNotification(subscription, pl, {
    TTL: 86400, // Default TTL: One day
    ...options,
  });
};

// Send a notification as a web push notification (maybe)
export const sendNotificationAsWebPush = notification => {
  debug('send notification as web push notification');
  return getSubscription(notification.userId)
    .then(subscriptions => {
      if (!subscriptions || subscriptions.length === 0) {
        debug(`no subscription for user#${notification.userId}, `);
        return Promise.resolve(false);
      }

      const payload = formatNotification(notification, notification.userId);

      console.log(payload);

      return Promise.all(
        subscriptions.map(subscription =>
          sendWebPushNotification(subscription, {
            tag: notification.id,
            ...payload,
          })
        )
      );
    })
    .catch(err => {
      if (process.env.NODE_ENV === 'development') {
        console.log(err);
      }
    });
};

import {
  parseActors,
  parseEvent,
  parseNotificationDate,
  parseContext,
  getLastMessageCreatedByAnotherUser,
} from './notification-formatting';

const formatNotification = (notification, currentUserId) => {
  switch (notification.event) {
    case 'MESSAGE_CREATED': {
      const actors = parseActors(notification.actors, { id: currentUserId });
      const event = parseEvent(notification.event);
      const context = parseContext(notification.context, { id: currentUserId });
      const message = getLastMessageCreatedByAnotherUser(
        notification.entities,
        { id: currentUserId }
      );

      return {
        data: {
          href: `/thread/${notification.context.id}`,
        },
        title: `${actors.asString} ${event} ${context.asString}`,
        body: message.content.body,
      };
    }
    case 'REACTION_CREATED': {
      return undefined;
      // <NewReactionNotification
      //   key={notification.id}
      //   notification={notification}
      //   currentUser={currentUser}
      // />
    }
    case 'CHANNEL_CREATED': {
      return undefined;
      // <NewChannelNotification
      //   key={notification.id}
      //   notification={notification}
      //   currentUser={currentUser}
      // />
    }
    case 'USER_JOINED_COMMUNITY': {
      return undefined;
      // <NewUserInCommunityNotification
      //   key={notification.id}
      //   notification={notification}
      //   currentUser={currentUser}
      // />
    }
    case 'THREAD_CREATED': {
      return undefined;
      // <NewThreadNotification
      //   key={notification.id}
      //   notification={notification}
      //   currentUser={currentUser}
      // />
    }
    case 'COMMUNITY_INVITE': {
      return undefined;
      // <CommunityInviteNotification
      //   key={notification.id}
      //   notification={notification}
      //   currentUser={currentUser}
      // />
    }
    default: {
      return {};
    }
  }
};
