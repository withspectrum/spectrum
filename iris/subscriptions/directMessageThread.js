// @flow
/**
 * Define the notification subscription resolvers
 */
import { withFilter } from 'graphql-subscriptions';
import { userCanViewDirectMessageThread } from './utils';
import listenToUpdatedDirectMessageThreads from './listeners/directMessageThread';
import type { DBDirectMessageThread } from '../models/directMessageThread';

module.exports = {
  Subscription: {
    directMessageThreadUpdated: {
      resolve: (directMessageThread: DBDirectMessageThread) => ({
        ...directMessageThread,
        threadLastActive:
          directMessageThread.threadLastActive &&
          new Date(directMessageThread.threadLastActive),
      }),
      subscribe: withFilter(
        listenToUpdatedDirectMessageThreads,
        (directMessageThread, _, { user }) => {
          if (!user || !directMessageThread) return false;
          return userCanViewDirectMessageThread(
            directMessageThread.id,
            user.id
          );
        }
      ),
    },
  },
};
