// @flow
import createQueue from '../create-queue';
import { MESSAGE_NOTIFICATION } from './constants';
import { fetchPayload, createPayload } from '../utils/payloads';
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

const getDistinctActors = array => {
  let unique = {};
  let distinct = [];
  for (let i in array) {
    if (typeof unique[array[i].id] == 'undefined') {
      distinct.push(array[i]);
    }
    unique[array[i].id] = 0;
  }
  console.log('\n8-4', distinct);
  return distinct;
};

export default () =>
  createQueue(MESSAGE_NOTIFICATION, job => {
    const incomingMessage = job.data.message;
    const currentUserId = job.data.userId;

    console.log('\n1', job);
    console.log('\n2', job.data.message);
    console.log('\n3', job.data.userId);

    // 10 minutes buffer to determine whether or not to create a new
    // notification or update an old one
    const TIME_BUFFER = 600000;

    /*
      1. Determine if a notification for this event type and context already
         exists. E.g. a bunch of people send messages in a thread in a short
         period of time - it will know the 'event_type' is 'message_created'
         and the context's id will be the same 'threadId'.
         a. If a record is found, make sure it is within a certain reasonable
            period of time since the notification's modifiedAt date. If it is,
            proceed to step 2. If it is not, proceed to step 3.
      2. If an existing notification is found that matches the event type and
         context id and is within a certain time range of the previous upddatedAt
         date, we can simply modify this original notification, recalcuate
         the recipients (in case their notif preferences have changed), and
         then update those recipients records in the usersNotifications table
         with a new isSeen and isRead state
      3. If an existing notification record is found but isn't recent enough, or
         if no record was found, we will create a new notification record in the
         db, calculate the recipients based on the notification context, and then
         create a usersNotifications record for each recipient
    */

    // 1. Determine if a notification exists with the same event type, context
    //    id, and falls within the declared time buffer
    return checkForExistingNotification(
      'message_created',
      incomingMessage.threadId,
      TIME_BUFFER
    )
      .then(notification => {
        console.log('\n7', notification);
        /*
          Regardless of if we find an existing notification, we will always
          need to either update or create a record with:
          - the actor of this event
          - the context of this event
          - the event entity itself (in this case a new message)

          At this point we also need to make sure we set the context as either a story
          thread or as a direct message thread
        */
        const contextType = incomingMessage.threadType === 'directMessageThread'
          ? 'directMessageThread'
          : 'thread';

        console.log('\ncontextType', contextType);
        console.log('\nactor', incomingMessage.senderId);
        console.log('\nentity', incomingMessage);
        const promises = [
          fetchPayload('user', incomingMessage.senderId),
          fetchPayload(contextType, incomingMessage.threadId),
          createPayload('message', incomingMessage),
        ];

        // 2. If a notification was found that met all of our criteria, we will
        //    construct a new notification object to update the record in the db
        if (notification && notification !== undefined) {
          console.log('\n8');
          return Promise.all([notification, ...promises]).then(([
            notification,
            actor,
            context,
            entity,
          ]) => {
            console.log('\n8-1', actor);
            console.log('\n8-2', context);
            console.log('\n8-3', entity);

            // don't duplicate actors if one user sends a bunch of messages
            // in a row
            const distinctActors = getDistinctActors([
              ...notification.actors,
              actor,
            ]);

            // create the new notification shape, pushing the current
            // events actor, context, and entity into each respective field
            const newNotification = Object.assign({}, notification, {
              actors: [...distinctActors],
              context,
              entities: [...notification.entities, entity],
            });

            console.log('\n8-5', newNotification);

            // update the notification in the db
            return updateNotification(newNotification)
              .then(notification => {
                console.log('\n8-6', notification);
                // with the updated notification, calculate the recipients of
                // this notification. In this case it is thread participants
                const recipients = getThreadNotificationUsers(
                  notification.context.id
                );
                return Promise.all([notification, recipients]);
              })
              .then(([notification, recipients]) => {
                // ensure we have valid recipients
                console.log('\n8-7', recipients);
                if (recipients && recipients.length > 0) {
                  // don't update the notification for the current user who
                  // triggered the event
                  let filteredRecipients = recipients.filter(
                    recipient => recipient.id !== currentUserId
                  );
                  // for each recipient, update the record in the
                  // usersNotifications table to have isRead and isSeen be false
                  return Promise.all(
                    filteredRecipients.map(recipient =>
                      markUsersNotificationsAsNew(
                        notification.id,
                        recipient.id
                      ).then(data => {
                        console.log('\n8-8', data);
                        return data;
                      })
                    )
                  );
                }
              });
          });
        } else {
          console.log('\n9');
          // 2. If no notification was found that met all of our criteria, we will
          //    create a new notification record in the db
          return Promise.all(promises).then(([actor, context, entity]) => {
            console.log('\n9-1', actor);
            console.log('\n9-2', context);
            console.log('\n9-3', entity);

            // create the notification record
            const notification = {
              actors: [actor],
              event: 'message_created',
              context,
              entities: [entity],
            };

            return storeNotification(notification)
              .then(notification => {
                console.log('\n9-4', notification);
                // with the new notification, calculate the recipients of
                // this notification. In this case it is thread participants
                const recipients = getThreadNotificationUsers(
                  notification.context.id
                );
                return Promise.all([notification, recipients]);
              })
              .then(([notification, recipients]) => {
                console.log('\n9-5', recipients);
                if (recipients && recipients.length > 0) {
                  // don't update the notification for the current user who
                  // triggered the event
                  let filteredRecipients = recipients.filter(
                    recipient => recipient.id !== currentUserId
                  );

                  return Promise.all(
                    filteredRecipients.map(recipient =>
                      storeUsersNotifications(
                        notification.id,
                        recipient.id
                      ).then(data => {
                        console.log('\n9-6', data);
                        return data;
                      })
                    )
                  );
                }
              });
          });
        }
      })
      .catch(err => console.log('\nerror: ', err));
  });
