// @flow
import { withFilter } from 'graphql-subscriptions';
import pubsub from './listeners/pubsub';
import { MESSAGE_ADDED } from './listeners/channels';

/**
 * Define the message subscription resolvers
 */
module.exports = {
  Subscription: {
    messageAdded: {
      resolve: message => message,
      subscribe: withFilter(
        () => pubsub.asyncIterator(MESSAGE_ADDED),
        (message, { thread }) => message.threadId === thread
      ),
    },
  },
};
