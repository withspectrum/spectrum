// @flow
const { listenToNewNotifications } = require('../../models/notification');
import { sendNotificationAsWebPush } from '../../utils/web-push';
import asyncify from '../../utils/asyncify';

// TODO(@mxstbr): This should live somewhere else.
const newNotification = notification => {
  sendNotificationAsWebPush(notification);
};
listenToNewNotifications(newNotification);

module.exports = asyncify(listenToNewNotifications, err => {
  throw new Error(err);
});
