const { listenToNewMessages } = require('../../models/message');
const pubsub = require('./pubsub');
const channels = require('./channels');

module.exports = () => {
  listenToNewMessages(message => {
    pubsub.publish(channels.MESSAGE_ADDED, message);
  });
};
