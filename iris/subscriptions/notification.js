/**
 * Define the notification subscription resolvers
 */
import { withFilter } from 'graphql-subscriptions';
import {
  listenToNewNotifications,
  listenToNewDirectMessageNotifications,
} from './listeners/notification';

module.exports = {
  Subscription: {
    notificationAdded: {
      resolve: (notification: any) => notification,
      subscribe: withFilter(
        listenToNewNotifications,
        (notification, _, { user }) =>
          notification && user.id === notification.userId
      ),
    },
    dmNotificationAdded: {
      resolve: (notification: any) => notification,
      subscribe: withFilter(
        listenToNewDirectMessageNotifications,
        (notification, _, { user }) =>
          notification && user.id === notification.userId
      ),
    },
  },
};
