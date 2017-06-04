/**
 * Database listeners for subscriptions are initialised here
 */

const messageListeners = require('./message');
const threadListeners = require('./thread');
const notificationListeners = require('./notification');

module.exports = {
  // Start listening to database changes
  start() {
    threadListeners();
    messageListeners();
    notificationListeners();
  },
};
