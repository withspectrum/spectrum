/**
 * Message mutation resolvers
 */
const { storeMessage } = require('../models/message');

module.exports = {
  Mutation: {
    addMessage: (_, { message }) => storeMessage(message),
  },
};
