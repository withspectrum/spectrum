const { listenToNewMessages } = require('../../models/message');
const pubsub = require('./pubsub');

module.exports = {
  listenToNewMessages: channel =>
    listenToNewMessages(message => {
      pubsub.publish(channel, message);
    }),
};
