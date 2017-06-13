// @flow
import processQueue from '../process-queue';
import { MESSAGE_NOTIFICATION } from './constants';
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

export default () =>
  processQueue(MESSAGE_NOTIFICATION, job => {
    const incomingMessage = job.data.message;
    const currentUserId = job.data.userId;

    // Determine what the context type should be based on the message that was sent
    const contextType = incomingMessage.threadType === 'directMessageThread'
      ? 'DIRECT_MESSAGE_THREAD'
      : 'THREAD';

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
        if (notification) {
          console.log('existing notification found!!!!');
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

              return Promise.all([notification, recipients]);
            })
            .then(([notification, recipients]) => {
              // filter out the user who sent the message, as they should not recieve a notification for their own messages
              const filteredRecipients = recipients.filter(
                recipient => recipient.userId !== currentUserId
              );

              // for each person who should receie an updated notification, mark their notification as unseen and unread
              return Promise.all(
                filteredRecipients.map(recipient =>
                  markUsersNotificationsAsNew(notification.id, recipient.userId)
                )
              );
            });
        } else {
          console.log('creating new notification');
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

              return Promise.all([notification, recipients]);
            })
            .then(([notification, recipients]) => {
              // filter out the user who sent the message, as they should not recieve a notification for their own messages
              const filteredRecipients = recipients.filter(
                recipient => recipient.userId !== currentUserId
              );

              return Promise.all(
                filteredRecipients.map(recipient =>
                  storeUsersNotifications(notification.id, recipient.userId)
                )
              );
            });
        }
      })
      .catch(err => new Error(err));
  });
