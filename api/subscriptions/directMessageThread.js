// @flow
/**
 * Define the notification subscription resolvers
 */
const debug = require('debug')('api:subscriptions:direct-message-thread');
const {
  listenToUpdatedDirectMessageThreads,
} = require('../models/directMessageThread');
import asyncify from '../utils/asyncify';
import UserError from '../utils/UserError';
import Raven from 'shared/raven';

import type { GraphQLContext } from '../';
import type { GraphQLResolveInfo } from 'graphql';
import type { DBDirectMessageThread } from '../models/directMessageThread';

const addNewDirectMessageThreadListener = asyncify(
  listenToUpdatedDirectMessageThreads
);

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
          return new UserError(
            'Can only listen to direct message thread updates when signed in.'
          );

        debug(`@${user.username || user.id} listening to updated DM threads`);
        return addNewDirectMessageThreadListener({
          filter: thread => thread.userId === user.id,
          onError: err => {
            // Don't crash the whole API server on error in the listener
            console.error(err);
            Raven.captureException(err);
          },
        });
      },
    },
  },
};
