/**
 * Define the notification subscription resolvers
 */
import { withFilter } from 'graphql-subscriptions';
import listenToNewNotifications from './listeners/notification';

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
        listenToNewNotifications,
        (notification, _, { user }) => user.id === notification.userId
      ),
    },
  },
};
