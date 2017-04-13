/**
 * Database listeners for subscriptions are initialised here
 */

const message = require('./message');
const channels = require('./channels');

module.exports = {
  // Start listening to database changes
  start() {
    message.listenToNewMessages(channels.MESSAGE_ADDED);
  },
};
