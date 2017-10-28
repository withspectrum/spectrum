/**
 * Define the notification subscription resolvers
 */
import { withFilter } from 'graphql-subscriptions';
import listenToNewNotifications from './listeners/notification';

module.exports = {
  Subscription: {
    notificationAdded: {
      resolve: (notification: any) => notification,
      subscribe: withFilter(
        listenToNewNotifications,
        (notification, _, { user }) => user.id === notification.userId
      ),
    },
  },
};
