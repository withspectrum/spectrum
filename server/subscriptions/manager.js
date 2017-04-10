const { SubscriptionManager } = require('graphql-subscriptions');
const pubsub = require('./pubsub');
const schema = require('../schema');

module.exports = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: {
    messageAdded: (_, { storyId }) => ({
      'mutation.addMessage': {
        filter: message => message.story === storyId,
      },
    }),
  },
});
