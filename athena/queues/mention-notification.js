// @flow
const debug = require('debug')('athena:queue:mention-notification');
import addQueue from '../utils/addQueue';
import { toPlainText, toState } from 'shared/draft-utils';
import truncate from 'shared/truncate';
import { fetchPayload } from '../utils/payloads';
import getEmailStatus from '../utils/get-email-status';
import { storeNotification } from '../models/notification';
import { getChannelById } from '../models/channel';
import { getMessageById } from '../models/message';
import { getCommunityById } from '../models/community';
import { getUsersThread } from '../models/usersThreads';
import { storeUsersNotifications } from '../models/usersNotifications';
import { getUserPermissionsInChannel } from '../models/usersChannels';
import { getThreadById } from '../models/thread';
import { getUserByUsername, getUserById } from '../models/user';
import {
  SEND_MENTION_THREAD_NOTIFICATION_EMAIL,
  SEND_MENTION_MESSAGE_NOTIFICATION_EMAIL,
} from './constants';

type JobData = {
  threadId: string,
  messageId?: string,
  senderId: string,
  username: string,
  type: 'thread' | 'message',
};
export default async ({ data }: { data: JobData }) => {
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
  const { isPrivate } = await getChannelById(thread.channelId);
  const { isMember } = await getUserPermissionsInChannel(
    recipient.id,
    thread.channelId
  );
  if (isPrivate && !isMember) return;

  // see if a usersThreads record exists. If it does, and notifications are muted, we
  // should send an email. If the record doesn't exist, it means the person being
  // mentioned either didn't create the thread or hasn't interacted with the thread yet,
  // in which case they should receive a notification
  const usersThread = await getUsersThread(recipient.id, threadId);
  // if a record exists and the user doesn't want notifications for this thread, escape
  if (usersThread && !usersThread.receiveNotifications) return;

  // prepare data for the in-app notification
  const actor = await fetchPayload('USER', senderId);
  // get the thread where the mention occured
  const context = await fetchPayload('THREAD', threadId);
  // create a payload for the message if the mention was in a message
  const entity = messageId ? await fetchPayload('MESSAGE', messageId) : null;
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

  const storedNotification = await storeNotification(newNotification);

  const shouldEmail = await getEmailStatus(recipient.id, 'newMention');
  // if the user shouldn't get an email, just add an in-app notif
  if (!shouldEmail)
    return storeUsersNotifications(storedNotification.id, recipient.id);

  // if the mention was in a notification, get the data about the message
  const message = messageId ? await getMessageById(messageId) : null;
  // get the user data for the message sender or thread creator
  const sender = messageId
    ? getUserById(senderId)
    : getUserById(thread.creatorId);
  // get info about the community where the mention happened
  const community = await getCommunityById(thread.communityId);
  // get info about the channel where the mention happened
  const channel = await getChannelById(thread.channelId);

  // compose preview text for the email
  const rawThreadBody =
    thread.type === 'DRAFTJS'
      ? toPlainText(toState(JSON.parse(thread.content.body)))
      : thread.content.body;
  const threadBody =
    rawThreadBody && rawThreadBody.length > 10
      ? truncate(rawThreadBody, 280)
      : null;
  const primaryActionLabel = 'View conversation';

  const rawMessageBody =
    message && toPlainText(toState(JSON.parse(thread.content.body)));
  const messageBody = rawMessageBody ? truncate(rawMessageBody, 280) : null;

  // otherwise send an email and add the in-app notification
  const QUEUE_NAME =
    mentionType === 'thread'
      ? SEND_MENTION_THREAD_NOTIFICATION_EMAIL
      : SEND_MENTION_MESSAGE_NOTIFICATION_EMAIL;
  return Promise.all([
    addQueue(
      QUEUE_NAME,
      {
        recipient,
        sender: actor,
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
          content: {
            messageBody,
          },
          sender,
        },
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
      }
    ),
    storeUsersNotifications(storedNotification.id, recipient.id),
  ]);
};
