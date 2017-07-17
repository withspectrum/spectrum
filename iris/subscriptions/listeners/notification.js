// @flow
const { listenToNewNotifications } = require('../../models/notification');
const pubsub = require('./pubsub');
const channels = require('./channels');
import { sendNotificationAsWebPush } from '../../utils/web-push';

const newNotification = notification => {
  pubsub.publish(channels.NOTIFICATION_ADDED, notification);
  sendNotificationAsWebPush(notification);
};

module.exports = () => {
  listenToNewNotifications(newNotification);
};
