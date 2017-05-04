/**
 * Database listeners for subscriptions are initialised here
 */

const messageListeners = require('./message');
const storyListeners = require('./story');

module.exports = {
  // Start listening to database changes
  start() {
    storyListeners();
    messageListeners();
  },
};
