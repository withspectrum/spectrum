import { withFilter } from 'graphql-subscriptions';
import { getThread } from '../models/thread';
import pubsub from './listeners/pubsub';
import { MESSAGE_ADDED } from './listeners/channels';
import { userCanViewChannel } from './utils';

/**
 * Define the message subscription resolvers
 */
module.exports = {
  Subscription: {
    messageAdded: {
      resolve: message => {
        // NOTE(@mxstbr): For some reason I have to wrap timestamp in new Date here. I have no idea why but otherwise message subscriptions don't work.
        return {
          ...message,
          timestamp: new Date(message.timestamp),
        };
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator(MESSAGE_ADDED),
        async (message, { thread }, { user }) => {
          // Message was sent in different thread, early return
          if (message.threadId !== thread) return false;

          const threadData = await getThread(message.threadId);
          if (!threadData) return false;

          return await userCanViewChannel(
            threadData.channelId,
            user && user.id
          );
        }
      ),
    },
  },
};
