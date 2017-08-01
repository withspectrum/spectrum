// @flow
const debug = require('debug')('athena:queue:community-notification');
import processQueue from '../../shared/bull/process-queue';
import createQueue from '../../shared/bull/create-queue';
import { THREAD_NOTIFICATION } from './constants';
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
const sendThreadCreatedNotificationEmailQueue = createQueue(
  SEND_THREAD_CREATED_NOTIFICATION_EMAIL
);

const createThreadNotificationEmail = thread => {
  const promises = [
    getUserById(thread.creatorId),
    getCommunityById(thread.communityId),
    getChannelById(thread.channelId),
    getMembersInChannelWithNotifications(thread.channelId),
  ];

  return Promise.all([
    ...promises,
  ]).then(([author, community, channel, recipientIds]) => {
    // pass through all the data, but fetch the user objects for each user
    // who should receive user notifications so that we can get their email address
    return Promise.all([
      author,
      community,
      channel,
      getUsers([...recipientIds]),
    ]).then(([author, community, channel, recipients]) => {
      // for each recipient, except for the user who created the thread,
      // trigger a new email
      return recipients
        .filter(recipient => recipient.id !== thread.creatorId)
        .map(recipient => {
          // if user doesn't have an email, escape
          if (!recipient.email) return;

          // make sure the user wants to get an email about new threads
          return getEmailStatus(
            recipient.id,
            'newThreadCreated'
          ).then(shouldSendEmail => {
            if (!shouldSendEmail) return;

            return sendThreadCreatedNotificationEmailQueue.add({
              to: recipient.email,
              recipient,
              channel,
              community,
              author,
              thread,
            });
          });
        });
    });
  });
};

export default () =>
  processQueue(THREAD_NOTIFICATION, job => {
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
              console.log(
                'the existing notification object is :\n',
                notification
              );
              debug('mark notification as new for all recipients');
              // for each user trigger a notification
              return Promise.all(
                recipients
                  // don't trigger a notification for the person who just posted the thread
                  .filter(recipient => recipient !== incomingThread.creatorId)
                  .map(recipient => {
                    return Promise.all([
                      markUsersNotificationsAsNew(notification.id, recipient),
                      createThreadNotificationEmail(incomingThread),
                    ]);
                  })
              );
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
              console.log('the new notification object is :\n', notification);
              return Promise.all(
                recipients
                  // don't trigger a notification for the person who just posted the thread
                  .filter(recipient => recipient !== incomingThread.creatorId)
                  .map(recipient => {
                    return Promise.all([
                      storeUsersNotifications(notification.id, recipient),
                      createThreadNotificationEmail(incomingThread),
                    ]);
                  })
              );
            });
        }
      })
      .then(() => job.remove())
      .catch(err => new Error(err));
  });
