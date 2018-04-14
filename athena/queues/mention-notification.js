// @flow
const debug = require('debug')('athena:queue:mention-notification');
import Raven from '../../shared/raven';
import { toPlainText, toState } from 'shared/draft-utils';
import truncate from 'shared/truncate';
import { fetchPayload } from '../utils/payloads';
import getEmailStatus from '../utils/get-email-status';
import { storeNotification } from '../models/notification';
import { getChannelById } from '../models/channel';
import { getMessageById } from '../models/message';
import { getUserPermissionsInCommunity } from '../models/usersCommunities';
import { getCommunityById } from '../models/community';
import { getUsersThread } from '../models/usersThreads';
import { storeUsersNotifications } from '../models/usersNotifications';
import { getUserPermissionsInChannel } from '../models/usersChannels';
import { getThreadById } from '../models/thread';
import { getUserByUsername, getUserById } from '../models/user';
import {
  sendNewMentionThreadEmailQueue,
  sendNewMentionMessageEmailQueue,
} from 'shared/bull/queues';
import type { Job, MentionNotificationJobData } from 'shared/bull/types';

export default async ({ data }: Job<MentionNotificationJobData>) => {
  debug('mention job created');
  const { threadId, messageId, senderId, username, type: mentionType } = data;
  // if we have incomplete data
  if (!threadId || !senderId || !username) return;
  debug('all data required to process mention');

  // get the user who was mentioned
  const recipient = await getUserByUsername(username);

  // escape this whole notification quickly if the username doesn't exist
  if (!recipient) return;
  debug('recipient found for mention');

  // don't notifify of self-mentions
  if (recipient.id === senderId) return;
  debug('recipient does not equal sender');

  // permission check to make sure the user who was mentioned is allowed in this
  // channel
  // NOTE: this will only block notifications from going to people mentioned
  // in a private channel where the user is not a member. Users can still be
  // mentioned in public channels where they are not a member
  const thread = await getThreadById(threadId);

  // if for some reason no thread was found, or the thread was deleted
  // dont send any notification about the mention
  if (!thread || thread.deletedAt) return;

  const { isPrivate } = await getChannelById(thread.channelId);
  const {
    isBlocked: isBlockedInCommunity,
  } = await getUserPermissionsInCommunity(thread.communityId, recipient.id);
  const {
    isMember: isMemberInChannel,
    isBlocked: isBlockedInChannel,
  } = await getUserPermissionsInChannel(recipient.id, thread.channelId);
  // don't notify people where they are blocked, or where the channel is private and they aren't a member
  if (
    isBlockedInCommunity ||
    isBlockedInChannel ||
    (isPrivate && !isMemberInChannel)
  )
    return;

  // see if a usersThreads record exists. If it does, and notifications are muted, we
  // should not send an email. If the record doesn't exist, it means the person being
  // mentioned either didn't create the thread or hasn't interacted with the thread yet,
  // in which case they should receive a notification
  const usersThread = await getUsersThread(recipient.id, threadId);
  // if a record exists and the user doesn't want notifications for this thread, escape
  if (usersThread && !usersThread.receiveNotifications) return;

  // prepare data for the in-app notification

  const [actor, context] = await Promise.all([
    // get the thread author info
    fetchPayload('USER', senderId),
    // get the thread where the mention occured
    fetchPayload('THREAD', threadId),
  ]);

  // create a payload for the message if the mention was in a message
  // if there is no message id, return the thread info as the entity
  const entity =
    mentionType === 'message' && messageId
      ? await fetchPayload('MESSAGE', messageId)
      : context;

  // we handle mentions in threads vs messages differently in the client, so assign different event types
  const event = mentionType === 'thread' ? 'MENTION_THREAD' : 'MENTION_MESSAGE';

  // we don't care that much about buffering these kinds of notifications or aggregating them in any way, since these are super high signal
  const newNotification = Object.assign(
    {},
    {
      actors: [actor],
      event,
      context,
      entities: [entity],
    }
  );

  const [storedNotification, shouldEmail] = await Promise.all([
    // create a new notification record to be displayed in-app
    storeNotification(newNotification),
    getEmailStatus(recipient.id, 'newMention'),
  ]);

  // if the user shouldn't get an email, just add an in-app notif
  if (!shouldEmail)
    return storeUsersNotifications(storedNotification.id, recipient.id);

  // if the mention was in a message, get the data about the message
  const messagePromise = messageId ? await getMessageById(messageId) : null;

  const [message, sender, community, channel] = await Promise.all([
    messagePromise,
    // get the user data for the message sender or thread creator
    getUserById(senderId),
    // get info about the community where the mention happened
    getCommunityById(thread.communityId),
    // get info about the channel where the mention happened
    getChannelById(thread.channelId),
  ]);

  // compose preview text for the email
  const rawThreadBody =
    thread.type === 'DRAFTJS'
      ? thread.content.body
        ? toPlainText(toState(JSON.parse(thread.content.body)))
        : ''
      : thread.content.body || '';

  const threadBody =
    rawThreadBody && rawThreadBody.length > 10
      ? truncate(rawThreadBody.trim(), 280)
      : rawThreadBody.trim();
  const primaryActionLabel = 'View conversation';

  const rawMessageBody = message
    ? toPlainText(toState(JSON.parse(message.content.body)))
    : '';

  // if the message was super long, truncate it
  const messageBody = rawMessageBody && truncate(rawMessageBody.trim(), 280);

  // otherwise send an email and add the in-app notification
  const queue =
    mentionType === 'thread'
      ? sendNewMentionThreadEmailQueue
      : sendNewMentionMessageEmailQueue;

  return Promise.all([
    queue.add({
      recipient,
      sender,
      primaryActionLabel,
      thread: {
        ...thread,
        creator: sender,
        community,
        channel,
        content: {
          title: thread.content.title,
          body: threadBody,
        },
      },
      message: {
        ...message,
        sender,
        content: {
          body: messageBody,
        },
      },
    }),
    storeUsersNotifications(storedNotification.id, recipient.id),
  ]).catch(err => {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  });
};
