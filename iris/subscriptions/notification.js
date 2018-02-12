// @flow
/**
 * Define the notification subscription resolvers
 */
import { withFilter } from 'graphql-subscriptions';
const {
  listenToNewNotifications,
  listenToNewDirectMessageNotifications,
} = require('../models/notification');
import asyncify from '../utils/asyncify';

module.exports = {
  Subscription: {
    notificationAdded: {
      resolve: (notification: any) => notification,
      subscribe: withFilter(
        asyncify(listenToNewNotifications, err => {
          throw new Error(err);
        }),
        (notification, _, { user }) =>
          notification && user.id === notification.userId
      ),
    },
    dmNotificationAdded: {
      resolve: (notification: any) => notification,
      subscribe: withFilter(
        asyncify(listenToNewDirectMessageNotifications, err => {
          throw new Error(err);
        }),
        (notification, _, { user }) =>
          notification && user.id === notification.userId
      ),
    },
  },
};
