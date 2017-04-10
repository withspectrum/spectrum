const { storeMessage } = require('../models/message');
const pubsub = require('../subscriptions/pubsub');

module.exports = {
  Mutation: {
    addMessage: (_, { message }) => storeMessage(message).then(message => {
      pubsub.publish('mutation.addMessage', message);
      return message;
    }),
  },
};
