//@flow

/**
 * Create the subscription manager to be used by the subscription server
 */
const { SubscriptionManager } = require('graphql-subscriptions');
const schema = require('../schema');
const pubsub = require('./listeners/pubsub');
const channels = require('./listeners/channels');

module.exports = new SubscriptionManager({
  schema,
  pubsub,
  // setupFunctions map a Subscription type as defined in the
  // schema (e.g. messageAdded) to certain channels (e.g. MESSAGE_ADDED)
  // Subscriptions can also listen to multiple channels
  setupFunctions: {
    messageAdded: (_, { thread }) => ({
      [channels.MESSAGE_ADDED]: {
        filter: message => message.threadId === thread,
      },
    }),
    notificationAdded: (_, __, { user }) => ({
      [channels.NOTIFICATION_ADDED]: {
        filter: notification => notification,
      },
    }),
  },
});
