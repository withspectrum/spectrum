/**
 * Define the notification subscription resolvers
 */
import { withFilter } from 'graphql-subscriptions';
import pubsub from './listeners/pubsub';
import { NOTIFICATION_ADDED } from './listeners/channels';

module.exports = {
  Subscription: {
    notificationAdded: {
      resolve: notification => ({
        ...notification,
        notificationAdded:
          notification.notificationAdded &&
          new Date(notification.notificationAdded),
        createdAt: notification.createdAt && new Date(notification.createdAt),
      }),
      subscribe: withFilter(
        () => pubsub.asyncIterator(NOTIFICATION_ADDED),
        (notification, _, { user }) => user.id === notification.userId
      ),
    },
  },
};
