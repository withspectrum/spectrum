// @flow
const debug = require('debug')('athena:queue:direct-message-notification');
import { fetchPayload, createPayload } from '../utils/payloads';
import { getDistinctActors } from '../utils/actors';
import { formatAndBufferNotificationEmail } from '../utils/formatAndBufferNotificationEmail';
import {
  storeNotification,
  updateNotification,
  checkForExistingNotification,
} from '../models/notification';
import {
  storeUsersNotifications,
  markUsersNotificationsAsNew,
} from '../models/usersNotifications';
import { getDirectMessageThreadMembers } from '../models/usersDirectMessageThreads';
import sentencify from '../utils/sentencify';
import addQueue from '../utils/addQueue';
import { SEND_NEW_DIRECT_MESSAGE_EMAIL } from './constants';
import { toPlainText, toState } from 'shared/draft-utils';

type JobData = {
  data: {
    message: {
      senderId: string,
      threadId: string,
    },
    userId: string,
  },
};
export default async (job: JobData) => {
  const { message: incomingMessage, userId: currentUserId } = job.data;

  debug(
    `new job: message sent by ${currentUserId} in thread #${incomingMessage.threadId}`
  );

  // Check to see if an existing notif exists by matching the 'event' type, with the context of the notification, within a certain time period.
  const existing = await checkForExistingNotification(
    'MESSAGE_CREATED',
    incomingMessage.threadId
  );

  //get the user who left the message
  const actor = await fetchPayload('USER', incomingMessage.senderId);

  // get the thread the message was left in
  const context = await fetchPayload(
    'DIRECT_MESSAGE_THREAD',
    incomingMessage.threadId
  );

  // create an entity payload with the message that was sent
  const entity = await createPayload('MESSAGE', incomingMessage);

  // Calculate actors
  // determine if there are previous actors we need to process separately
  const previousActors = existing ? existing.actors : [];
  const actors = await getDistinctActors([...previousActors, actor]);

  // Calculate entities
  const previousEntities = existing ? existing.entities : [];
  const entities = [...previousEntities, entity];

  // Create notification
  const newNotification = Object.assign({}, existing || {}, {
    actors: actors,
    event: 'MESSAGE_CREATED',
    context,
    entities: entities,
  });

  const notification = existing
    ? await updateNotification(newNotification)
    : await storeNotification(newNotification);

  // determine who should get notified
  const recipients = await getDirectMessageThreadMembers(
    notification.context.id
  );

  // filter out the user who sent the message
  const filteredRecipients = recipients.filter(
    recipient => recipient.userId !== currentUserId
  );

  // get raw data for the email
  const thread = JSON.parse(context.payload);
  const message = JSON.parse(entity.payload);
  const user = JSON.parse(actor.payload);
  const dbMethod = existing
    ? markUsersNotificationsAsNew
    : storeUsersNotifications;

  // send each recipient a notification
  const formatAndBufferPromises = filteredRecipients.map(recipient => {
    addQueue(
      SEND_NEW_DIRECT_MESSAGE_EMAIL,
      {
        recipient,
        thread: {
          content: {
            // Contruct title out of direct message thread users
            title: `your conversation with ${sentencify(
              recipients
                .filter(userThread => userThread.userId !== recipient.userId)
                .map(user => user.name)
            )}`,
          },
          path: `messages/${thread.id}`,
          id: thread.id,
        },
        user,
        message: {
          ...message,
          content: {
            body:
              message.messageType === 'draftjs'
                ? toPlainText(toState(JSON.parse(message.content.body)))
                : message.content.body,
          },
        },
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
      }
    );

    // store or update the notification in the db to trigger a ui update in app
    return dbMethod(notification.id, recipient.userId);
  });

  return Promise.all(formatAndBufferPromises).catch(err => {
    console.log(err);
  });
};
