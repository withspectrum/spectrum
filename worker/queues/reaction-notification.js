// @flow
import processQueue from '../process-queue';
import { REACTION_NOTIFICATION, TIME_BUFFER } from './constants';
import { fetchPayload, createPayload } from '../utils/payloads';
import { getDistinctActors } from '../utils/actors';
import { getMessageById } from '../models/message';
import { getUserNotificationPermissionsInThread } from '../models/usersThreads';
import {
  getUserNotificationPermissionsInDirectMessageThread,
} from '../models/usersDirectMessageThreads';
import {
  storeNotification,
  updateNotification,
  checkForExistingNotification,
} from '../models/notification';
import {
  storeUsersNotifications,
  markUsersNotificationsAsNew,
} from '../models/usersNotifications';

export default () =>
  processQueue(REACTION_NOTIFICATION, job => {
    const incomingReaction = job.data.reaction;
    const currentUserId = job.data.userId;

    /*
      These promises are used to create or modify a notification. The order is:
      - actor
      - context
      - entity
    */
    const promises = [
      // get the user who left the reaction
      fetchPayload('USER', incomingReaction.userId),
      // get the message the reaction was left on
      fetchPayload('MESSAGE', incomingReaction.messageId),
      // create an entity payload with the incoming reaction
      createPayload('REACTION', incomingReaction),
    ];

    // Check to see if an existing notif exists by matching the 'event' type, with the context of the notification, within a certain time period.
    return checkForExistingNotification(
      'REACTION_CREATED',
      incomingReaction.messageId
    )
      .then(notification => {
        if (notification) {
          // if an existing notification exists, update it with the newest actor + entities
          return Promise.all([notification, ...promises]).then(([
            notification,
            actor,
            context,
            entity,
          ]) => {
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

            // update the notification in the db
            return updateNotification(newNotification)
              .then(notification => {
                // get the original message where the reaction was left
                const message = getMessageById(notification.context.id);

                return Promise.all([notification, message]);
              })
              .then(([notification, message]) => {
                // make sure that the person who left the original message still has notification permissions in this thread. We have to check the threadtype to determine if the reaction was left in a story thread or a direct message thread
                // TODO: In the future we'll want reactions in direct message threads to trigger push notifications, but for now it introduces too much complexity so we just say false
                const hasPermission = message.threadType === 'story'
                  ? getUserNotificationPermissionsInThread(
                      message.senderId,
                      message.threadId
                    )
                  : false;

                return Promise.all([notification, message, hasPermission]);
              })
              .then(([notification, message, hasPermission]) => {
                if (!hasPermission) return;
                // if the user is allowed to recieve notifications, update their notification
                return markUsersNotificationsAsNew(
                  notification.id,
                  message.senderId
                );
              });
          });
        } else {
          // if no notification was found that matches our bundling criteria, create a new notification
          return Promise.all([...promises]).then(([actor, context, entity]) => {
            // create the notification record
            const notification = {
              actors: [actor],
              event: 'REACTION_CREATED',
              context,
              entities: [entity],
            };

            return storeNotification(notification)
              .then(notification => {
                // get the original message where the reaction was left
                const message = getMessageById(notification.context.id);

                return Promise.all([notification, message]);
              })
              .then(([notification, message]) => {
                // make sure that the person who left the original message still has notification permissions in this thread. We have to check the threadtype to determine if the reaction was left in a story thread or a direct message thread
                // TODO: In the future we'll want reactions in direct message threads to trigger push notifications, but for now it introduces too much complexity so we just say false
                const hasPermission = message.threadType === 'story'
                  ? getUserNotificationPermissionsInThread(
                      message.senderId,
                      message.threadId
                    )
                  : false;

                return Promise.all([notification, message, hasPermission]);
              })
              .then(([notification, message, hasPermission]) => {
                if (!hasPermission) return;

                return storeUsersNotifications(
                  notification.id,
                  message.senderId
                );
              });
          });
        }
      })
      .catch(err => new Error(err));
  });
