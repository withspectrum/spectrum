/**
 * Define the notification subscription resolvers
 */
import { withFilter } from 'graphql-subscriptions';
import pubsub from './listeners/pubsub';
import { THREAD_UPDATED } from './listeners/channels';
import { getUserPermissionsInChannel } from '../models/usersChannels';

module.exports = {
  Subscription: {
    threadUpdated: {
      resolve: thread => thread,
      subscribe: withFilter(
        () => pubsub.asyncIterator(THREAD_UPDATED),
        async (thread, _, { user }) => {
          const { isMember } = await getUserPermissionsInChannel(
            thread.channelId,
            user.id
          );
          return isMember;
        }
      ),
    },
  },
};
