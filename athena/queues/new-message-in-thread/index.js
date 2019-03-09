// @flow
const debug = require('debug')('athena:queue:message-notification');
import { toState, toPlainText } from 'shared/draft-utils';
import getMentions from 'shared/get-mentions';
import Raven from 'shared/raven';
import { fetchPayload, createPayload } from '../../utils/payloads';
import { getDistinctActors } from '../../utils/actors';
import formatData from './format-data';
import bufferNotificationEmail from './buffer-email';
import {
  storeNotification,
  updateNotification,
  checkForExistingNotification,
} from '../../models/notification';
import {
  storeUsersNotifications,
  markUsersNotificationsAsNew,
} from 'shared/db/queries/usersNotifications';
import { getThreadNotificationUsers } from '../../models/usersThreads';
import { getUserPermissionsInChannel } from '../../models/usersChannels';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { getUserById } from 'shared/db/queries/user';
import { getMessageById } from '../../models/message';
import { sendMentionNotificationQueue } from 'shared/bull/queues';
import type { MessageNotificationJobData, Job } from 'shared/bull/types';
import type { DBMessage } from 'shared/types';
import { messageTypeObj } from 'shared/draft-utils/process-message-content';

export default async (job: Job<MessageNotificationJobData>) => {
  const { message: incomingMessage } = job.data;
  const { senderId: messageSenderId } = incomingMessage;

  debug(
    `new job: message sent by ${messageSenderId} in thread #${
      incomingMessage.threadId
    }`
  );

  // Do not send notification emails for bot messages
  if (incomingMessage.bot) return;

  // Check to see if an existing notif exists by matching the 'event' type, with the context of the notification, within a certain time period.
  const existing = await checkForExistingNotification(
    'MESSAGE_CREATED',
    incomingMessage.threadId
  );

  //get the user who left the message
  const actor = await fetchPayload('USER', messageSenderId);

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
    actors,
    event: 'MESSAGE_CREATED',
    context,
    entities,
  });

  const notification = existing
    ? await updateNotification(newNotification)
    : await storeNotification(newNotification);

  // determine who should get notified
  const recipients = await getThreadNotificationUsers(notification.context.id);
  // filter out the user who sent the message
  const filteredRecipients = recipients.filter(
    recipient => recipient.userId !== messageSenderId
  );

  const thread = JSON.parse(context.payload);

  const permissionedRecipients = await Promise.all(
    filteredRecipients.map(async user => {
      const [channelPermissions, communityPermissions] = await Promise.all([
        getUserPermissionsInChannel(user.userId, thread.channelId),
        getUserPermissionsInCommunity(thread.communityId, user.userId),
      ]);
      const isNotBlocked =
        !channelPermissions.isBlocked && !communityPermissions.isBlocked;
      // only return the user if they aren't blocked in both the community & channel
      return isNotBlocked ? user : null;
    })
  );

  // convert the message body to be checked for mentions
  const body =
    incomingMessage.messageType === messageTypeObj.draftjs
      ? toPlainText(toState(JSON.parse(incomingMessage.content.body)))
      : incomingMessage.content.body;

  // get mentions in the message
  let mentions = getMentions(body);
  // If the message quoted another message, send a mention notification to the author
  // of the quoted message
  if (typeof incomingMessage.parentId === 'string') {
    // $FlowIssue
    const parent = await getMessageById(incomingMessage.parentId);
    // eslint-disable-next-line
    (parent: DBMessage);
    if (parent) {
      const parentAuthor = await getUserById(parent.senderId);
      if (
        parentAuthor &&
        parentAuthor.username &&
        mentions.indexOf(parentAuthor.username) < 0
      ) {
        mentions.push(parentAuthor.username);
      }
    }
  }
  if (mentions && mentions.length > 0) {
    mentions.forEach(username => {
      sendMentionNotificationQueue.add({
        messageId: incomingMessage.id,
        threadId: incomingMessage.threadId,
        senderId: incomingMessage.senderId,
        username: username,
        type: 'message',
      });
    });
  }

  // if a user was mentioned, they should only get the mention notification
  // and not get a new message notification, so remove them here
  const recipientsWithoutMentions = permissionedRecipients
    // strip any falsy values from our permission checks above
    .filter(Boolean)
    .filter(r => r && mentions.indexOf(r.username) < 0);

  // if no more receipients are valid, escape the function
  if (!recipientsWithoutMentions || recipientsWithoutMentions.length === 0) {
    debug('No recipients for this message notification');
    return;
  }

  // get raw data for the email
  const message = JSON.parse(entity.payload);
  const sender = JSON.parse(actor.payload);
  const dbMethod = existing
    ? markUsersNotificationsAsNew
    : storeUsersNotifications;

  // send each recipient a notification
  const formatAndBufferPromises = recipientsWithoutMentions.map(
    async recipient => {
      if (!recipient || !recipient.email || !thread || !message) {
        debug(
          '⚠ aborting adding to email queue due to invalid data\nrecipient\n%O\nthread\n%O\nuser\n%O\nmessage\n%O',
          recipient,
          thread,
          message
        );
        return Promise.resolve();
      }

      debug(
        'format data, buffer notification email and store/update notification in db'
      );
      const data = await formatData(thread, sender, message);
      return Promise.all([
        bufferNotificationEmail(recipient, data, notification),
        dbMethod(notification.id, recipient.userId),
      ]);
    }
  );

  return Promise.all(formatAndBufferPromises).catch(err => {
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
  });
};
