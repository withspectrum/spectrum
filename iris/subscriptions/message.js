import { withFilter } from 'graphql-subscriptions';
import pubsub from './listeners/pubsub';
import { MESSAGE_ADDED } from './listeners/channels';

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
        (message, { thread }) => message.threadId === thread
      ),
    },
  },
};
