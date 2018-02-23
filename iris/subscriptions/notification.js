// @flow
const debug = require('debug')('iris:subscriptions:notification');
import { withFilter } from 'graphql-subscriptions';
const {
  listenToNewNotifications,
  listenToNewDirectMessageNotifications,
} = require('../models/notification');
import asyncify from '../utils/asyncify';
import UserError from '../utils/UserError';
import type { GraphQLContext } from '../';
import type { GraphQLResolveInfo } from 'graphql';

module.exports = {
  Subscription: {
    notificationAdded: {
      resolve: (notification: any) => notification,
      subscribe: async (
        _: any,
        { thread }: { thread: string },
        { user }: GraphQLContext,
        info: GraphQLResolveInfo
      ) => {
        if (!user || !user.id)
          throw new UserError(
            'Can only listen to notifications when signed in.'
          );

        debug(`@${user.username || user.id} listening to notifications`);
        return asyncify(listenToNewNotifications(user.id), err => {
          throw new Error(err);
        });
      },
    },
    dmNotificationAdded: {
      resolve: (notification: any) => notification,
      subscribe: async (
        _: any,
        { thread }: { thread: string },
        { user }: GraphQLContext,
        info: GraphQLResolveInfo
      ) => {
        if (!user || !user.id)
          throw new UserError(
            'Can only listen to notifications when signed in.'
          );

        debug(`@${user.username || user.id} listening to DM notifications`);
        return asyncify(listenToNewDirectMessageNotifications(user.id), err => {
          throw new Error(err);
        });
      },
    },
  },
};
