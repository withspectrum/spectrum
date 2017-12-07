// @flow
const {
  listenToNewNotifications,
  listenToNewDirectMessageNotifications,
} = require('../../models/notification');
import { sendNotificationAsWebPush } from '../../utils/web-push';
import asyncify from '../../utils/asyncify';

// TODO(@mxstbr): This should live somewhere else.
const newNotification = notification => {
  sendNotificationAsWebPush(notification);
};
listenToNewNotifications(newNotification);

module.exports = {
  listenToNewNotifications: asyncify(listenToNewNotifications, err => {
    throw new Error(err);
  }),
  listenToNewDirectMessageNotifications: asyncify(
    listenToNewDirectMessageNotifications,
    err => {
      throw new Error(err);
    }
  ),
};
