// @flow
const {
  listenToNewNotifications,
  listenToNewDirectMessageNotifications,
} = require('../models/notification');
import { sendNotificationAsWebPush } from 'athena/utils/web-push';

export default () => {
  listenToNewNotifications(sendNotificationAsWebPush);
  listenToNewDirectMessageNotifications(sendNotificationAsWebPush);
};
