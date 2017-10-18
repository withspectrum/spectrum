// @flow
const env = require('node-env-file');
const IS_PROD = process.env.NODE_ENV === 'production';
const path = require('path');
if (!IS_PROD) {
  env(path.resolve(__dirname, '../.env'), { raise: false });
}
import { Router } from 'express';
// $FlowIssue
const jwt = require('jsonwebtoken');
const emailRouter = Router();
import { updateUserEmail } from '../../models/user';
import { unsubscribeUserFromEmailNotification } from '../../models/usersSettings';
import { updateThreadNotificationStatusForUser } from '../../models/usersThreads';
import { updateDirectMessageThreadNotificationStatusForUser } from '../../models/usersDirectMessageThreads';
import { toggleUserChannelNotifications } from '../../models/usersChannels';
import { getChannelsByCommunity } from '../../models/channel';
import { processInvoicePaid } from '../webhooks';

// $FlowIssue
emailRouter.get('/unsubscribe', async (req, res) => {
  const { token } = req.query;

  // if no token was provided
  if (!token) return res.status(400).send('No token provided to unsubscribe.');

  // verify that the token signature matches our env signature
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.EMAIL_JWT_SIGNATURE);
  } catch (err) {
    // if the signature can't be verified
    let errMessage;
    if (err.name === 'TokenExpiredError') {
      errMessage =
        'This unsubscribe token has expired. You can unsubscribe from this email type in your user settings.';
    } else {
      errMessage =
        'This unsubscribe token is invalid. You can unsubscribe from this email type in your user settings.';
    }
    return res.status(400).send(errMessage);
  }

  // once the token is verified, we can decode it to get the userId and type
  const { userId, type, dataId } = jwt.decode(token);

  // if the token doesn't have the necessary info
  if (!userId || !type) {
    return res
      .status(400)
      .send(
        'We were not able to verify this request to unsubscribe. You can unsubscribe from this email type in your users settings.'
      );
  }

  console.log('userId', userId);
  console.log('type', type);
  console.log('dataId', dataId);

  // and send a database request to unsubscribe from a particular email type
  try {
    switch (type) {
      case 'dailyDigest':
      case 'weeklyDigest':
      case 'newThreadCreated':
      case 'newMessageInThreads':
      case 'newDirectMessage':
        return unsubscribeUserFromEmailNotification(userId, type).then(() =>
          res
            .status(200)
            .send('You have been successfully unsubscribed from this email.')
        );
      case 'muteChannel':
        return toggleUserChannelNotifications(userId, dataId, false).then(() =>
          res
            .status(200)
            .send(
              'You will no longer recieve new thread emails from this channel.'
            )
        );
      case 'muteCommunity':
        return getChannelsByCommunity(dataId)
          .then(
            channels =>
              console.log('got channels', channels) || channels.map(c => c.id)
          )
          .then(channels =>
            channels.map(
              c =>
                console.log('muting channel', c) ||
                toggleUserChannelNotifications(userId, c, false)
            )
          )
          .then(() =>
            res
              .status(200)
              .send(
                'You will no longer recieve new thread emails from this community.'
              )
          );
      case 'muteThread':
        return updateThreadNotificationStatusForUser(
          dataId,
          userId,
          false
        ).then(() =>
          res
            .status(200)
            .send(
              'You will no longer recieve emails about new messages in this thread.'
            )
        );
      case 'muteDirectMessageThread':
        return updateDirectMessageThreadNotificationStatusForUser(
          dataId,
          userId,
          false
        ).then(() =>
          res
            .status(200)
            .send(
              'You will no longer recieve emails about new messages in this direct message conversation.'
            )
        );
      default: {
        return res
          .status(400)
          .send("We couldn't identify this type of email to unsubscribe.");
      }
    }
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .send(
        'We ran into an issue unsubscribing you from this email. You can always unsubscribe from this email type in your user settings, or get in touch with us at hi@spectrum.chat.'
      );
  }
});

// $FlowIssue
emailRouter.get('/validate', async (req, res) => {
  const { token } = req.query;

  // if no token was provided
  if (!token)
    return res.status(400).send('No token provided to validate this email.');

  // verify that the token signature matches our env signature
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.EMAIL_JWT_SIGNATURE);
  } catch (err) {
    // if the signature can't be verified
    let errMessage;
    if (err.name === 'TokenExpiredError') {
      errMessage =
        'This unsubscribe token has expired. You can re-enter your email address in your user settings to resend a confirmation email.';
    } else {
      errMessage =
        'This unsubscribe token is invalid. You can re-enter your email address in your user settings to resend a confirmation email.';
    }
    return res.status(400).send(errMessage);
  }

  // once the token is verified, we can decode it to get the userId and email
  const { userId, email } = jwt.decode(token);

  // if the token doesn't have the necessary info
  if (!userId || !email) {
    return res
      .status(400)
      .send(
        'We were not able to verify this email validation. You can re-enter your email address in your user settings to resend a confirmation email.'
      );
  }

  // and send a database request to update the user record with this email
  try {
    return updateUserEmail(userId, email).then(
      user =>
        IS_PROD
          ? res.redirect(
              `https://spectrum.chat/users/${user.username}/settings`
            )
          : res.redirect(
              `http://localhost:3000/users/${user.username}/settings`
            )
    );
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .send(
        'We ran into an issue validating this email address. You can re-enter your email address in your user settings to resend a confirmation email, or get in touch with us at hi@spectrum.chat.'
      );
  }
});

export default emailRouter;
