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
        createdAt: notification.createdAt && new Date(notification.createdAt),
        modifiedAt:
          notification.modifiedAt && new Date(notification.modifiedAt),
      }),
      subscribe: withFilter(
        () => pubsub.asyncIterator(NOTIFICATION_ADDED),
        (notification, _, { user }) => user.id === notification.userId
      ),
    },
  },
};
