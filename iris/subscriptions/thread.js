// @flow
/**
 * Define the notification subscription resolvers
 */
import { withFilter } from 'graphql-subscriptions';
import pubsub from './listeners/pubsub';
import { THREAD_UPDATED } from './listeners/channels';
import { getUserPermissionsInCommunity } from '../models/usersCommunities';

module.exports = {
  Subscription: {
    threadUpdated: {
      resolve: thread => thread,
      subscribe: withFilter(
        () => pubsub.asyncIterator(THREAD_UPDATED),
        async (thread, _, { user }) => {
          const { isMember } = await getUserPermissionsInCommunity(
            thread.communityId,
            user.id
          );
          return isMember;
        }
      ),
    },
  },
};
