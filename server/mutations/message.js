/**
 * Message mutation resolvers
 */
const { storeMessage } = require('../models/message');
const pubsub = require('../subscriptions/pubsub');

module.exports = {
  Mutation: {
    addMessage: (_, { message }) => storeMessage(message),
  },
};
