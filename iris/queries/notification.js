// @flow
const {
  getNotificationsByUser,
  getUnreadDirectMessageNotifications,
} = require('../models/notification');
import type { GraphQLContext } from '../';
import { encode, decode } from '../utils/base64';
import type { PaginationOptions } from '../utils/paginate-arrays';

module.exports = {
  Query: {
    notification: (
      _: any,
      { id }: { id: string },
      { loaders }: GraphQLContext
    ) => loaders.notification.load(id),
    notifications: (
      _: any,
      { first = 10, after }: PaginationOptions,
      { user }: GraphQLContext
    ) => {
      const currentUser = user;
      if (!currentUser) return;

      // $FlowFixMe
      return getNotificationsByUser(currentUser.id, {
        first,
        after: after && parseInt(decode(after), 10),
      }).then(result => ({
        pageInfo: {
          hasNextPage: result.length >= first,
        },
        edges: result.map(notification => ({
          cursor: encode(String(notification.entityAddedAt.getTime())),
          node: notification,
        })),
      }));
    },
    directMessageNotifications: (
      _: any,
      { first = 10, after }: PaginationOptions,
      { user }: GraphQLContext
    ) => {
      if (!user) return [];
      // return an array of unread direct message notifications
      // $FlowFixMe
      return getUnreadDirectMessageNotifications(user.id, {
        first,
        after: after && parseInt(decode(after), 10),
      }).then(result => ({
        pageInfo: {
          hasNextPage: result.length >= first,
        },
        edges: result.map(notification => ({
          cursor: encode(String(notification.entityAddedAt.getTime())),
          node: notification,
        })),
      }));
    },
  },
};
