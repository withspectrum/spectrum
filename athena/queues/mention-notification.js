// @flow
const debug = require('debug')('athena:queue:mention-notification');
import addQueue from '../utils/addQueue';
import { fetchPayload, createPayload } from '../utils/payloads';
import { getDistinctActors } from '../utils/actors';
import getEmailStatus from '../utils/get-email-status';
import { storeNotification } from '../models/notification';
import { storeUsersNotifications } from '../models/usersNotifications';
import { getUserById, getUsers, getUserByUsername } from '../models/user';
import { SEND_MENTION_NOTIFICATION_EMAIL } from './constants';

type JobData = {
  threadId: string,
  messageId?: string,
  senderId: string,
  username: string,
};
export default async ({ data }: { data: JobData }) => {
  debug('mention job created');
  const { threadId, messageId, senderId, username } = data;
  // if we have incomplete data
  if (!threadId || !senderId || !username) return;
  debug('all data required to process mention');

  const recipient = await getUserByUsername(username);
  // escape this whole notification quickly if the username doesn't exist
  if (!recipient) return;
  debug('recipient found for mention');
  // don't notifify of self-mentions
  if (recipient.id === senderId) return;
  debug('recipient does not equal sender');

  /*
	These promises are used to create or modify a notification. The order is:
	- actor
	- context
	- entity
  */
  const actor = await fetchPayload('USER', senderId);
  // get the thread where the mention occured
  const context = await fetchPayload('THREAD', threadId);
  // create a payload for the message if the mention was in a message
  const entity = messageId ? await fetchPayload('MESSAGE', messageId) : null;

  // we don't care that much about buffering these kinds of notifications or aggregating them in any way, since these are super high signal
  const newNotification = Object.assign(
    {},
    {
      actors: [actor],
      event: 'MENTION',
      context,
      entities: [entity],
    }
  );

  const storedNotification = await storeNotification(newNotification);
  const shouldEmail = await getEmailStatus(recipient.id, 'newMention');

  if (shouldEmail) {
    return Promise.all([
      addQueue(
        SEND_MENTION_NOTIFICATION_EMAIL,
        {
          recipient,
          sender: actor,
          thread: context,
          message: entity,
        },
        {
          removeOnComplete: true,
          removeOnFail: true,
        }
      ),
      storeUsersNotifications(storedNotification.id, recipient.id),
    ]);
  } else {
    return storeUsersNotifications(storedNotification.id, recipient.id);
  }
};
