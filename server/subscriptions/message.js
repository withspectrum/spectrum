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
      subscribe: () =>
        console.log('messageAdded.subscribe') ||
        pubsub.asyncIterator(MESSAGE_ADDED),
    },
  },
};

// withFilter(pubsub.asyncIterator(MESSAGE_ADDED), (message, { thread }) => console.log('wat', message) || message.threadId === thread)
