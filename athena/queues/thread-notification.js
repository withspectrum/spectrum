// @flow
const debug = require('debug')('athena:queue:community-notification');
import processQueue from '../process-queue';
import { THREAD_NOTIFICATION } from './constants';
import { fetchPayload, createPayload } from '../utils/payloads';
import { getDistinctActors } from '../utils/actors';
import {
  storeNotification,
  updateNotification,
  checkForExistingNotification,
} from '../models/notification';
import {
  storeUsersNotifications,
  markUsersNotificationsAsNew,
} from '../models/usersNotifications';
import { getMembersInChannelWithNotifications } from '../models/usersChannels';

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
              debug('mark notification as new for all recipients');
              // for each owner, trigger a notification
              return Promise.all(
                recipients.map(recipient =>
                  markUsersNotificationsAsNew(notification.id, recipient)
                )
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
              return Promise.all(
                recipients.map(recipient =>
                  storeUsersNotifications(notification.id, recipient)
                )
              );
            });
        }
      })
      .then(() => job.remove())
      .catch(err => new Error(err));
  });
