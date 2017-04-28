const { listenToNewMessages } = require('../../models/message');
const pubsub = require('./pubsub');
const channels = require('./channels');

module.exports = () => {
  listenToNewMessages('messages', message => {
    pubsub.publish(channels.MESSAGE_ADDED, message);
  });

  listenToNewMessages('direct_messages', message => {
    pubsub.publish(channels.MESSAGE_ADDED, message);
  });
};
