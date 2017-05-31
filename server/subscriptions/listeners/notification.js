// @flow
const { listenToNewNotifications } = require('../../models/notification');
const pubsub = require('./pubsub');
const channels = require('./channels');

const newNotification = notification => {
  pubsub.publish(channels.NOTIFICATION_ADDED, notification);
};

module.exports = () => {
  listenToNewNotifications(newNotification);
};
