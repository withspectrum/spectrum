// @flow
/**
 * Define the notification subscription resolvers
 */
import { withFilter } from 'graphql-subscriptions';
import pubsub from './listeners/pubsub';
import { DIRECT_MESSAGE_THREAD_UPDATED } from './listeners/channels';
import { userCanViewDirectMessageThread } from './utils';
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
        () => pubsub.asyncIterator(DIRECT_MESSAGE_THREAD_UPDATED),
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
