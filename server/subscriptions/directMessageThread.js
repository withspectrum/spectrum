// @flow
/**
 * Define the notification subscription resolvers
 */
import { withFilter } from 'graphql-subscriptions';
import pubsub from './listeners/pubsub';
import { DIRECT_MESSAGE_THREAD_UPDATED } from './listeners/channels';

module.exports = {
  Subscription: {
    directMessageThreadUpdated: {
      resolve: directMessageThread => directMessageThread,
      subscribe: withFilter(
        () => pubsub.asyncIterator(DIRECT_MESSAGE_THREAD_UPDATED),
        (directMessageThread, _, { user }) =>
          user.id === directMessageThread.userId
      ),
    },
  },
};
