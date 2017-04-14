//@flow

/**
 * Create the subscription manager to be used by the subscription server
 */
const { SubscriptionManager } = require('graphql-subscriptions');
const pubsub = require('./pubsub');
const schema = require('../schema');

module.exports = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: {
    messageAdded: (_, { location, thread }) => ({
      messageAdded: {
        filter: message => message.thread === thread,
      },
    }),
  },
});
