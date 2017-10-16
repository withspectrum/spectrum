const { listenToNewMessages } = require('../../models/message');
const { storeNotification } = require('../../models/notification');
const pubsub = require('./pubsub');
const channels = require('./channels');

const newMessage = message => {
  pubsub.publish(channels.MESSAGE_ADDED, message);
};

module.exports = () => {
  listenToNewMessages(newMessage);
};
