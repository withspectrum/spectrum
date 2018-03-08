// @flow
/**
 * Define the notification subscription resolvers
 */
const debug = require('debug')('iris:subscriptions:direct-message-thread');
import { withFilter } from 'graphql-subscriptions';
import { userCanViewDirectMessageThread } from './utils';
const {
  listenToUpdatedDirectMessageThreads,
} = require('../models/directMessageThread');
import asyncify from '../utils/asyncify';
import UserError from '../utils/UserError';
import Raven from 'shared/raven';

import type { GraphQLContext } from '../';
import type { GraphQLResolveInfo } from 'graphql';
import type { DBDirectMessageThread } from '../models/directMessageThread';

module.exports = {
  Subscription: {
    directMessageThreadUpdated: {
      resolve: (thread: DBDirectMessageThread) => thread,
      subscribe: async (
        _: any,
        { thread }: { thread: string },
        { user }: GraphQLContext,
        info: GraphQLResolveInfo
      ) => {
        if (!user || !user.id)
          throw new UserError(
            'Can only listen to direct message thread updates when signed in.'
          );

        debug(`@${user.username || user.id} listening to updated DM threads`);
        return asyncify(listenToUpdatedDirectMessageThreads(user.id), {
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
