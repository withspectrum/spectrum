// @flow
const debug = require('debug')('athena:queue:message-notification');
import processQueue from '../process-queue';
import createQueue from '../create-queue';
import { MESSAGE_NOTIFICATION, SEND_NEW_MESSAGE_EMAIL } from './constants';
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
import { getThreadNotificationUsers } from '../models/usersThreads';
import {
  getDirectMessageThreadMembers,
} from '../models/usersDirectMessageThreads';

const sendNewMessageEmailQueue = createQueue(SEND_NEW_MESSAGE_EMAIL);

// We need this closure because we load the recipient at a different time than the other data
const createAddToNewMessageEmailQueue = data => recipient =>
  sendNewMessageEmailQueue.add({
    ...data,
    ...recipient,
  });

export default () =>
  processQueue(MESSAGE_NOTIFICATION, job => {
    const incomingMessage = job.data.message;
    const currentUserId = job.data.userId;

    // Determine what the context type should be based on the message that was sent
    const contextType = incomingMessage.threadType === 'directMessageThread'
      ? 'DIRECT_MESSAGE_THREAD'
      : 'THREAD';

    debug(
      `
new job for ${incomingMessage.id} by ${currentUserId} in ${contextType.toLowerCase()}`
    );

    /*
      These promises are used to create or modify a notification. The order is:
      - actor
      - context
      - entity
    */
    const promises = [
      //get the user who left the message
      fetchPayload('USER', incomingMessage.senderId),
      // get the thread the message was left in - could be a dm or story depending on the contextType
      fetchPayload(contextType, incomingMessage.threadId),
      // create an entity payload with the message that was sent
      createPayload('MESSAGE', incomingMessage),
    ];

    // Check to see if an existing notif exists by matching the 'event' type, with the context of the notification, within a certain time period.
    return checkForExistingNotification(
      'MESSAGE_CREATED',
      incomingMessage.threadId
    )
      .then(notification => {
        let addToSendNewMessageEmailQueue;
        if (notification) {
          debug('found existing notification');
          // if an existing notification exists, update it with the newest actor + entities
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

              const thread = JSON.parse(context.payload);
              const message = JSON.parse(entity.payload);
              const user = JSON.parse(actor.payload);

              addToSendNewMessageEmailQueue = createAddToNewMessageEmailQueue({
                threads: [
                  {
                    // TODO: Figure out what to do as the title in DMs
                    title: thread.content.title,
                    id: thread.id,
                    replies: [
                      {
                        sender: {
                          name: user.name,
                          profilePhoto: user.profilePhoto,
                        },
                        content: {
                          body: message.content.body,
                        },
                      },
                    ],
                  },
                ],
              });

              debug('update existing notification in database with new data');
              return updateNotification(newNotification);
            })
            .then(notification => {
              /*
            if the message was posted in a story, get all users who have notifications turned on for that story. Otherwise the message was posted in a direct message thread, in which case we will notify all participants in the thread
            */
              const recipients = incomingMessage.threadType ===
                'directMessageThread'
                ? getDirectMessageThreadMembers(notification.context.id)
                : getThreadNotificationUsers(notification.context.id);

              debug('find recipients of notification');

              return Promise.all([notification, recipients]);
            })
            .then(([notification, recipients]) => {
              // filter out the user who sent the message, as they should not recieve a notification for their own messages
              const filteredRecipients = recipients.filter(
                recipient => recipient.userId !== currentUserId
              );

              recipients.forEach(recipient => {
                if (!recipient.email) return;
                addToSendNewMessageEmailQueue({
                  to: recipient.email,
                  user: {
                    displayName: recipient.name,
                    username: recipient.username,
                  },
                });
              });

              debug('mark notification as new for all recipients');

              // for each person who should receie an updated notification, mark their notification as unseen and unread
              return Promise.all(
                filteredRecipients.map(recipient =>
                  markUsersNotificationsAsNew(notification.id, recipient.userId)
                )
              );
            });
        } else {
          debug('no existing notification found, creating new one');
          // if no notification was found that matches our bundling criteria, create a new notification
          return Promise.all([...promises])
            .then(([actor, context, entity]) => {
              // create the notification record
              const notification = {
                actors: [actor],
                event: 'MESSAGE_CREATED',
                context,
                entities: [entity],
              };

              const thread = JSON.parse(context.payload);
              const message = JSON.parse(entity.payload);
              const user = JSON.parse(actor.payload);

              addToSendNewMessageEmailQueue = createAddToNewMessageEmailQueue({
                threads: [
                  {
                    // TODO: Figure out what to do as the title in DMs
                    title: thread.content.title,
                    id: thread.id,
                    replies: [
                      {
                        sender: {
                          name: user.name,
                          profilePhoto: user.profilePhoto,
                        },
                        content: {
                          body: message.content.body,
                        },
                      },
                    ],
                  },
                ],
              });

              debug('create notification in db');

              return storeNotification(notification);
            })
            .then(notification => {
              /*
            if the message was posted in a story, get all users who have notifications turned on for that story. Otherwise the message was posted in a direct message thread, in which case we will notify all participants in the thread
            */
              const recipients = incomingMessage.threadType ===
                'directMessageThread'
                ? getDirectMessageThreadMembers(notification.context.id)
                : getThreadNotificationUsers(notification.context.id);

              debug('find recipients of notification');
              return Promise.all([notification, recipients]);
            })
            .then(([notification, recipients]) => {
              // filter out the user who sent the message, as they should not recieve a notification for their own messages
              const filteredRecipients = recipients.filter(
                recipient => recipient.userId !== currentUserId
              );

              filteredRecipients.forEach(recipient => {
                if (!recipient.email) return;
                addToSendNewMessageEmailQueue({
                  to: recipient.email,
                  user: {
                    displayName: recipient.name,
                    username: recipient.username,
                  },
                });
              });

              debug('create a notification for every recipient');
              return Promise.all(
                filteredRecipients.map(recipient =>
                  storeUsersNotifications(notification.id, recipient.userId)
                )
              );
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .then(() => job.remove())
      .catch(err => {
        console.log(err);
      });
  });
