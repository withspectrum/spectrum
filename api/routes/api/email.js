// @flow
require('now-env');
const IS_PROD = process.env.NODE_ENV === 'production';
import { Router } from 'express';
const jwt = require('jsonwebtoken');
const emailRouter = Router();
import { updateUserEmail } from 'shared/db/queries/user';
import { unsubscribeUserFromEmailNotification } from '../../models/usersSettings';
import { updateThreadNotificationStatusForUser } from '../../models/usersThreads';
import { updateDirectMessageThreadNotificationStatusForUser } from '../../models/usersDirectMessageThreads';
import {
  toggleUserChannelNotifications,
  getUsersPermissionsInChannels,
} from '../../models/usersChannels';
import {
  updateCommunityAdministratorEmail,
  getCommunityById,
} from '../../models/community';
import { getChannelsByCommunity, getChannelById } from '../../models/channel';

const rootRedirect = IS_PROD
  ? `https://spectrum.chat`
  : `http://localhost:3000`;

// $FlowIssue
emailRouter.get('/unsubscribe', async (req, res) => {
  const { token } = req.query;

  // if no token was provided
  if (!token)
    return res.redirect(
      `${rootRedirect}/me/settings?toastType=error&toastMessage=No token provided to unsubscribe.`
    );

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
    return res.redirect(
      `${rootRedirect}/me/settings?toastType=error&toastMessage=${errMessage}`
    );
  }

  // once the token is verified, we can decode it to get the userId and type
  const { userId, type, dataId } = jwt.decode(token);

  // if the token doesn't have the necessary info
  if (!userId || !type) {
    return res.redirect(
      `${rootRedirect}/me/settings?toastType=error&toastMessage=We were not able to verify this request to unsubscribe. You can unsubscribe from this email type in your users settings.`
    );
  }

  // and send a database request to unsubscribe from a particular email type
  try {
    switch (type) {
      case 'dailyDigest':
      case 'weeklyDigest':
      case 'newThreadCreated':
      case 'newMessageInThreads':
      case 'newDirectMessage':
      case 'newMention':
        return unsubscribeUserFromEmailNotification(userId, type).then(() =>
          res.redirect(
            `${rootRedirect}/me/settings?toastType=success&toastMessage=You have been successfully unsubscribed from this email.`
          )
        );
      case 'muteChannel': {
        const channel = await getChannelById(dataId);
        const community = await getCommunityById(channel.communityId);

        return toggleUserChannelNotifications(userId, dataId, false).then(() =>
          res.redirect(
            `${rootRedirect}/${community.slug}/${
              channel.slug
            }?toastType=success&toastMessage=You will no longer receive new thread emails from this channel.`
          )
        );
      }
      case 'muteCommunity': {
        const community = await getCommunityById(dataId);
        const channels = await getChannelsByCommunity(dataId);
        const channelIds = channels.map(channel => channel.id);
        const usersChannels = await getUsersPermissionsInChannels(
          channelIds.map(id => [userId, id])
        );
        const usersChannelsWithNotifications = usersChannels.filter(
          usersChannel => usersChannel && usersChannel.receiveNotifications
        );
        const channelIdsWithNotifications = usersChannelsWithNotifications.map(
          usersChannel => usersChannel.channelId
        );

        await channelIdsWithNotifications.map(
          async channelId =>
            await toggleUserChannelNotifications(userId, channelId, false)
        );

        return res.redirect(
          `${rootRedirect}/${
            community.slug
          }?toastType=success&toastMessage=You will no longer receive new thread emails from this community.`
        );
      }
      case 'muteThread':
        return updateThreadNotificationStatusForUser(
          dataId,
          userId,
          false
        ).then(() =>
          res.redirect(
            `${rootRedirect}/thread/${dataId}?toastType=success&toastMessage=You will no longer receive emails about new messages in this thread.`
          )
        );
      case 'muteDirectMessageThread':
        return updateDirectMessageThreadNotificationStatusForUser(
          dataId,
          userId,
          false
        ).then(() =>
          res.redirect(
            `${rootRedirect}/messages/${dataId}?toastType=success&toastMessage=You will no longer receive emails about new messages in this direct message conversation.`
          )
        );
      default: {
        return res.redirect(
          `${rootRedirect}/me/settings?toastType=error&toastMessage=We couldn't identify this type of email to unsubscribe.`
        );
      }
    }
  } catch (err) {
    console.error(err);
    return res.redirect(
      `${rootRedirect}/me/settings?toastType=error&toastMessage=We ran into an issue unsubscribing you from this email. You can always unsubscribe from this email type in your user settings.`
    );
  }
});

// $FlowIssue
emailRouter.get('/validate', (req, res) => {
  const { token } = req.query;

  // if no token was provided
  if (!token)
    return res.redirect(
      `${rootRedirect}?toastType=error&toastMessage=No token provided to validate this email.`
    );

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
    return res.redirect(
      `${rootRedirect}/me/settings?toastType=error&toastMessage=${errMessage}`
    );
  }

  // once the token is verified, we can decode it to get the userId and email
  const { userId, email, communityId } = jwt.decode(token);

  // if the token doesn't have the necessary info
  if (!userId || !email) {
    return res.redirect(
      `${rootRedirect}/me/settings?toastType=error&toastMessage=We were not able to verify this email validation. You can re-enter your email address in your user settings to resend a confirmation email.`
    );
  }

  // if there is a community id present in the token, the user is trying to
  // validate a new administrator email address
  if (communityId) {
    try {
      return updateCommunityAdministratorEmail(communityId, email, userId).then(
        community =>
          IS_PROD
            ? res.redirect(
                `https://spectrum.chat/${
                  community.slug
                }/settings?toastType=success&toastMessage=Your email address has been validated!`
              )
            : res.redirect(
                `http://localhost:3000/${
                  community.slug
                }/settings?toastType=success&toastMessage=Your email address has been validated!`
              )
      );
    } catch (err) {
      console.error(err);
      return res.redirect(
        `${rootRedirect}/me/settings?toastType=error&toastMessage=We ran into an issue validating this email address. You can re-enter your email address in your community settings to resend a confirmation email.`
      );
    }
  }

  // and send a database request to update the user record with this email
  try {
    return updateUserEmail(userId, email).then(user => {
      req.login(user, err => {
        if (err) {
          return res.redirect(
            `${rootRedirect}/me/settings?toastType=error&toastMessage=We ran into an issue validating this email address. You can re-enter your email address in your community settings to resend a confirmation email.`
          );
        }

        if (!user.username) return res.redirect(rootRedirect);
        return res.redirect(
          `${rootRedirect}/me/settings?toastType=success&toastMessage=Email updated!`
        );
      });
    });
  } catch (err) {
    console.error(err);
    return res.redirect(
      `${rootRedirect}/me/settings?toastType=error&toastMessage=We ran into an issue validating this email address. You can re-enter your email address in your user settings to resend a confirmation email.`
    );
  }
});

export default emailRouter;
