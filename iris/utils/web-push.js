import webPush from 'web-push';
const debug = require('debug')('iris:utils:web-push');
import { getSubscriptions } from '../models/web-push-subscription';

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
  // Don't sent push notifications for channel creation
  if (notification.event === 'CHANNEL_CREATED') return;
  return getSubscriptions(notification.userId)
    .then(subscriptions => {
      if (!subscriptions || subscriptions.length === 0) {
        debug(`no subscription for user#${notification.userId}, `);
        return Promise.resolve(false);
      }

      const payload = formatNotification(notification, notification.userId);
      debug('subscriptions found: %O', subscriptions);
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
  getMessages,
  sortThreads,
  sentencify,
} from './notification-formatting';

const formatNotification = (notification, currentUserId) => {
  switch (notification.event) {
    case 'MESSAGE_CREATED': {
      const actors = parseActors(notification.actors, { id: currentUserId });
      const event = parseEvent(notification.event);
      const context = parseContext(notification.context, { id: currentUserId });
      const date = parseNotificationDate(notification.modifiedAt);
      const messages = getMessages(notification.entities, {
        id: currentUserId,
      });

      return {
        data: {
          href: `/thread/${notification.context.id}`,
        },
        title: `${actors.asString} ${event} ${context.asString}`,
        body: sentencify(
          messages.map(({ payload }) => `"${payload.content.body}"`)
        ),
        raw: {
          actors,
          event,
          context,
          entities: messages,
          date,
        },
      };
    }
    case 'REACTION_CREATED': {
      const actors = parseActors(notification.actors, { id: currentUserId });
      const event = parseEvent(notification.event);
      const date = parseNotificationDate(notification.modifiedAt);
      const context = parseContext(notification.context);
      const message = JSON.parse(notification.context.payload);

      return {
        data: {
          href: `/thread/${context.asObject.payload.threadId}`,
        },
        title: `${actors.asString} ${event} ${context.asString}`,
        body: message.content.body,
        raw: {
          actors,
          event,
          context,
          entity: message,
          date,
        },
      };
    }
    case 'CHANNEL_CREATED': {
      const date = parseNotificationDate(notification.modifiedAt);
      const context = parseContext(notification.context);
      const entities = notification.entities.map(entity => ({
        ...entity,
        payload: JSON.parse(entity.payload),
      }));
      const newChannelCount =
        entities.length > 1
          ? `${entities.length} new channels were`
          : 'A new channel was';

      return {
        raw: {
          date,
          context,
          entities,
        },
      };
    }
    case 'USER_JOINED_COMMUNITY': {
      const actors = parseActors(notification.actors, { id: currentUserId });
      const event = parseEvent(notification.event);
      const date = parseNotificationDate(notification.modifiedAt);
      const context = parseContext(notification.context);

      return {
        data: {
          href: `/${context.asObject.payload.slug}`,
        },
        title: `${actors.asString} ${event} ${context.asString}`,
        raw: {
          actors,
          event,
          date,
          context,
        },
      };
    }
    case 'THREAD_CREATED': {
      const date = parseNotificationDate(notification.modifiedAt);
      const context = parseContext(notification.context);
      // sort and order the threads
      const threads = sortThreads(notification.entities, { id: currentUserId });

      const newThreadCount =
        threads.length > 1 ? `New threads were` : 'A new thread was';

      return {
        data: {
          href: `/thread/${threads[0].id}`,
        },
        title: `${newThreadCount} published in ${context.asString}`,
        body: sentencify(threads.map(thread => `"${thread.content.title}"`)),
        raw: {
          date,
          context,
          threads,
        },
      };
    }
    case 'COMMUNITY_INVITE': {
      const date = parseNotificationDate(notification.modifiedAt);
      const context = parseContext(notification.context);
      const actors = parseActors(notification.actors, { id: currentUserId });

      return {
        data: {
          href: `/${context.asObject.slug}`,
        },
        title: `${actors.asString} invited you to join their community, ${context.asString}`,
        raw: {
          date,
          context,
          actors,
        },
      };
    }
    default: {
      return {};
    }
  }
};
