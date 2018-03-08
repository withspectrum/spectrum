// @flow
const debug = require('debug')('iris:subscriptions:notification');
import { withFilter } from 'graphql-subscriptions';
const {
  listenToNewNotifications,
  listenToNewDirectMessageNotifications,
} = require('../models/notification');
import asyncify from '../utils/asyncify';
import UserError from '../utils/UserError';
import Raven from 'shared/raven';
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
        return asyncify(listenToNewNotifications(user.id), {
          onError: err => {
            // Don't crash the whole API server on error in the listener
            console.error(err);
            Raven.captureException(err);
          },
          onClose: cursor => {
            if (cursor) {
              /* ignore errors that happen when closing the cursor */
              try {
                cursor.close(() => {});
              } catch (err) {}
            }
          },
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
        return asyncify(listenToNewDirectMessageNotifications(user.id), {
          onError: err => {
            // Don't crash the whole API server on error in the listener
            console.error(err);
            Raven.captureException(err);
          },
          onClose: cursor => {
            if (cursor) {
              /* ignore errors that happen when closing the cursor */
              try {
                cursor.close(() => {});
              } catch (err) {}
            }
          },
        });
      },
    },
  },
};
