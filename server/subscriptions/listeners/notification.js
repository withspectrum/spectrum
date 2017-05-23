// @flow
const { listenToNewNotifications } = require('../../models/notification');
const pubsub = require('./pubsub');
const channels = require('./channels');

const newNotification = notification => {
  pubsub.publish(channels.NOTIFICATION_ADDED, notification);
};

module.exports = () => {
  /*
  { id: 'a721ecf9-6315-424b-8c04-d0e38d157e97',
    message: { content: 'Test', type: 'text' },
    sender: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a190',
    thread: 'c13853ee-9c2f-4547-832c-cf4483647bd2',
    timestamp: 2017-04-29T16:44:50.749Z }
   */
  listenToNewNotifications(newNotification);
};
