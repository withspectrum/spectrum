// @flow
const debug = require('debug')('athena:queue:community-notification');
import addQueue from '../utils/addQueue';
import { toPlainText, toState } from 'shared/draft-utils';
import truncate from 'shared/truncate';
import { fetchPayload, createPayload } from '../utils/payloads';
import { getDistinctActors } from '../utils/actors';
import getEmailStatus from '../utils/get-email-status';
import {
  storeNotification,
  updateNotification,
  checkForExistingNotification,
} from '../models/notification';
import {
  storeUsersNotifications,
  markUsersNotificationsAsNew,
} from '../models/usersNotifications';
import { getUserById, getUsers } from '../models/user';
import { getCommunityById } from '../models/community';
import { getChannelById } from '../models/channel';
import { getMembersInChannelWithNotifications } from '../models/usersChannels';
import { SEND_THREAD_CREATED_NOTIFICATION_EMAIL } from './constants';

const createThreadNotificationEmail = async thread => {
  const creator = await getUserById(thread.creatorId);
  const community = await getCommunityById(thread.communityId);
  const channel = await getChannelById(thread.channelId);
  const potentialRecipients = await getMembersInChannelWithNotifications(
    thread.channelId
  );
  const potentialRecipientsWithUserData = await getUsers([
    ...potentialRecipients,
  ]);
  const recipients = potentialRecipientsWithUserData.filter(
    r => r.id !== thread.creatorId
  );

  const emailPromises = recipients.map(async recipient => {
    if (!recipient.email) return;

    const shouldSendEmail = getEmailStatus(recipient.id, 'newThreadCreated');
    if (!shouldSendEmail) return;
    const rawBody =
      thread.type === 'DRAFTJS'
        ? toPlainText(toState(JSON.parse(thread.content.body)))
        : thread.content.body;
    const body = rawBody.length > 10 ? truncate(rawBody, 280) : null;
    const primaryActionLabel =
      body && body.length >= 272 ? 'Continue reading' : 'Join the conversation';

    return addQueue(
      SEND_THREAD_CREATED_NOTIFICATION_EMAIL,
      {
        recipient,
        primaryActionLabel,
        thread: {
          ...thread,
          creator,
          community,
          channel,
          content: {
            title: thread.content.title,
            body,
          },
        },
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
      }
    );
  });

  return Promise.all([emailPromises]);
};

export default job => {
  const incomingThread = job.data.thread;
  const currentUserId = job.data.userId;

  debug(`new job for a thread by ${currentUserId}`);

  /*
    These promises are used to create or modify a notification. The order is:
    - actor
    - context
    - entity
  */
  const promises = [
    // actor and entity
    fetchPayload('USER', currentUserId),
    // get the channel where the thread was posted
    fetchPayload('CHANNEL', incomingThread.channelId),
    // create a payload for the thread that was posted
    createPayload('THREAD', incomingThread),
  ];

  return checkForExistingNotification(
    'THREAD_CREATED',
    incomingThread.channelId
  )
    .then(notification => {
      if (notification) {
        debug('found existing notification');
        return Promise.all([notification, ...promises])
          .then(([notification, actor, context, entity]) => {
            // actors should always be distinct to make client side rendering easier
            const distinctActors = getDistinctActors([
              ...notification.actors,
              actor,
            ]);

            // create a new notification
            const newNotification = Object.assign({}, notification, {
              actors: [...distinctActors],
              context,
              entities: [...notification.entities, entity],
            });

            debug('update existing notification in database with new data');
            return updateNotification(newNotification);
          })
          .then(notification => {
            // get the owners of the community
            const recipients = getMembersInChannelWithNotifications(
              incomingThread.channelId
            );

            debug('find recipients of notification');

            return Promise.all([notification, recipients]);
          })
          .then(([notification, recipients]) => {
            debug('mark notification as new for all recipients');
            // for each user trigger a notification
            return Promise.all([
              createThreadNotificationEmail(incomingThread),
              recipients
                // don't trigger a notification for the person who just posted the thread
                .filter(recipient => recipient !== incomingThread.creatorId)
                .map(recipient => {
                  return Promise.all([
                    markUsersNotificationsAsNew(notification.id, recipient),
                  ]);
                }),
            ]);
          });
      } else {
        // if no notification was found that matches our bundling criteria, create a new notification
        return Promise.all([...promises])
          .then(([actor, context, entity]) => {
            // create the notification record
            const notification = {
              actors: [actor],
              event: 'THREAD_CREATED',
              context,
              entities: [entity],
            };

            debug('create notification in db');

            return storeNotification(notification);
          })
          .then(notification => {
            // get the owners of the community
            const recipients = getMembersInChannelWithNotifications(
              incomingThread.channelId
            );

            debug('find recipients of notification');

            return Promise.all([notification, recipients]);
          })
          .then(([notification, recipients]) => {
            debug('create a notification for every recipient');
            return Promise.all([
              createThreadNotificationEmail(incomingThread),
              recipients
                // don't trigger a notification for the person who just posted the thread
                .filter(recipient => recipient !== incomingThread.creatorId)
                .map(recipient => {
                  return Promise.all([
                    storeUsersNotifications(notification.id, recipient),
                  ]);
                }),
            ]);
          });
      }
    })
    .catch(err => new Error(err));
};
