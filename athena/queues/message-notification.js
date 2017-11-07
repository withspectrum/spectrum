// @flow
const debug = require('debug')('athena:queue:message-notification');
import { toState, toPlainText } from 'shared/draft-utils';
import { getMentions } from '../utils/getMentions';
import addQueue from '../utils/addQueue';
import Raven from '../../shared/raven';
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
import { getThreadNotificationUsers } from '../models/usersThreads';

type JobData = {
  data: {
    message: {
      id: string,
      messageType: string,
      senderId: string,
      threadId: string,
      content: {
        body: string,
      },
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
  const context = await fetchPayload('THREAD', incomingMessage.threadId);

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
  const recipients = await getThreadNotificationUsers(notification.context.id);

  // filter out the user who sent the message
  const filteredRecipients = recipients.filter(
    recipient => recipient.userId !== currentUserId
  );

  // convert the message body to be checked for mentions
  const body =
    incomingMessage.messageType === 'draftjs'
      ? toPlainText(toState(JSON.parse(incomingMessage.content.body)))
      : incomingMessage.content.body;

  // get mentions in the message
  const mentions = getMentions(body);
  if (mentions && mentions.length > 0) {
    mentions.forEach(username => {
      addQueue('mention notification', {
        messageId: incomingMessage.id,
        threadId: incomingMessage.threadId,
        senderId: incomingMessage.senderId,
        username: username, // "@mxstbr" -> "mxstbr"
      });
    });
  }

  // if a user was mentioned, they should only get the mention notification
  // and not get a new message notification, so remove them here
  const recipientsWithoutMentions = filteredRecipients.filter(r => {
    return mentions.indexOf(r.username) < 0;
  });

  if (!recipientsWithoutMentions || recipientsWithoutMentions.length === 0) {
    debug('No recipients for this message notification');
    return;
  }

  // get raw data for the email
  const thread = JSON.parse(context.payload);
  const message = JSON.parse(entity.payload);
  const user = JSON.parse(actor.payload);
  const dbMethod = existing
    ? markUsersNotificationsAsNew
    : storeUsersNotifications;

  // send each recipient a notification
  const formatAndBufferPromises = recipientsWithoutMentions.map(recipient => {
    formatAndBufferNotificationEmail(
      recipient,
      {
        ...thread,
        path: `thread/${thread.id}`,
      },
      user,
      message,
      notification
    );

    // store or update the notification in the db to trigger a ui update in app
    debug('Updating the notification record in the db');
    return dbMethod(notification.id, recipient.userId);
  });

  return Promise.all(formatAndBufferPromises).catch(err => {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
    console.log(err);
  });
};
