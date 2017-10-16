// @flow
/**
 * Define the thread subscription resolvers
 */
import { withFilter } from 'graphql-subscriptions';
import pubsub from './listeners/pubsub';
import { THREAD_UPDATED } from './listeners/channels';
import { userIsMemberOfChannel } from './utils';
import type { DBThread } from '../models/thread';

module.exports = {
  Subscription: {
    threadUpdated: {
      resolve: (thread: DBThread) => {
        // NOTE(@mxstbr): For some reason I have to wrap timestamp in new Date here. I have no idea why but otherwise message subscriptions don't work.
        return {
          ...thread,
          modifiedAt: thread.modifiedAt && new Date(thread.modifiedAt),
          createdAt: new Date(thread.createdAt),
          lastActive: new Date(thread.lastActive),
        };
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator(THREAD_UPDATED),
        async (thread, _, { user }) =>
          await userIsMemberOfChannel(thread.channelId, user && user.id)
      ),
    },
  },
};
