//@flow
/**
 * Database listeners for subscriptions are initialised here
 */
const { listenToNewMessages } = require('../models/message');
const pubsub = require('./pubsub');

module.exports = {
  // Start listening to database changes
  start() {
    listenToNewMessages('messages', message => {
      pubsub.publish('messageAdded', message);
    });
  },
};
