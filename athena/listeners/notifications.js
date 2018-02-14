// @flow
const {
  listenToNewNotifications,
  listenToNewDirectMessageNotifications,
} = require('../models/notification');
import sendPushNotifications from 'athena/utils/send-push-notifications';

export default () => {
  listenToNewNotifications(sendPushNotifications);
  listenToNewDirectMessageNotifications(sendPushNotifications);
};
