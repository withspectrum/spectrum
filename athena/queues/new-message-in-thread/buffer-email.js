// @flow
const debug = require('debug')('athena::send-message-notification-email');
import { getNotifications } from '../../models/notification';
import groupReplies from './group-replies';
import getEmailStatus from '../../utils/get-email-status';
import {
  sendNewMessageEmailQueue,
  bufferNewMessageEmailQueue,
} from 'shared/bull/queues';
import type {
  DBThread,
  DBNotification,
  DBChannel,
  DBCommunity,
} from 'shared/types';

const IS_PROD = process.env.NODE_ENV === 'production';
// Change buffer in dev to 10 seconds vs 3 minutes in prod
const BUFFER = IS_PROD ? 180000 : 10000;
// wait at most 10 minutes before sending an email notification
const MAX_WAIT = 600000;

bufferNewMessageEmailQueue.process(async job => {
  const threadsInScope = job.data.threads;
  const notificationsInScope = job.data.notifications;
  const recipient = job.data.recipient;
  if (!recipient) return;
  debug(
    `send notification email for ${threadsInScope.length} threads to @${
      recipient.username
    } (${recipient.email})`
  );

  const shouldGetEmail = await getEmailStatus(
    recipient.userId,
    'newMessageInThreads'
  );
  if (!shouldGetEmail) {
    debug(`@${recipient.username} should not get email, aborting`);
    return;
  }

  debug(`@${recipient.username} should get email, getting notifications`);
  const notifications = await getNotifications(
    notificationsInScope.map(notification => notification.id)
  );
  if (!notifications || notifications.length === 0) {
    debug('No notifications in scope');
    return;
  }

  debug('notifications loaded, finding unseen threads');
  const unseenThreadIds = notifications
    .filter(notification => !notification.isSeen && !notification.isRead)
    .map(notification => notification.context.id);

  if (unseenThreadIds.length === 0) {
    debug('aborting, no unseen threads');
    return;
  }
  debug('filter unseen threads, merge replies');

  // Convert threads to object, merge replies to same thread
  const threads = threadsInScope
    .filter(thread => unseenThreadIds.includes(thread.id))
    .reduce((map, thread) => {
      if (!map[thread.id]) {
        map[thread.id] = thread;
        return map;
      }
      map[thread.id] = {
        ...map[thread.id],
        replies: map[thread.id].replies.concat(thread.replies),
      };
      return map;
    }, {});

  debug('group replies');
  // Group replies by sender, turn it back into an array
  const threadKeys = Object.keys(threads);

  const threadsWithGroupedRepliesPromises = threadKeys.map(async threadId => ({
    ...threads[threadId],
    replies: await groupReplies(threads[threadId].replies),
    repliesCount: threads[threadId].replies.length,
  }));

  const threadsWithGroupedReplies = await Promise.all(
    threadsWithGroupedRepliesPromises
  ).catch(err => console.error('error grouping threads and replies', err));

  const filteredThreadsWithGroupedReplies =
    threadsWithGroupedReplies &&
    threadsWithGroupedReplies.length > 0 &&
    threadsWithGroupedReplies.filter(thread => thread.replies.length > 0);

  // this would happen if someone sends a message in a thread then deletes that message
  if (
    !filteredThreadsWithGroupedReplies ||
    filteredThreadsWithGroupedReplies.length === 0
  ) {
    debug('no threads with at least one reply');
    return;
  }

  debug(`adding email for @${recipient.username} to queue`);
  return sendNewMessageEmailQueue.add({
    recipient,
    threads: filteredThreadsWithGroupedReplies,
  });
});

type Timeouts = {
  [email: string]: {
    timeout: any,
    firstTimeout: number, // timestamp
    threads: Array<any>,
    notifications: Array<any>,
  },
};

const timeouts: Timeouts = {};

/**
 * We do some crazy timeout stuff here to avoid sending too many emails. The flow goes like this:
 *
 * - A message notification comes in, this function is called and sets a timeout for one minute to send the email
 * - No further message notification for the same recipient comes in so we send the email after one minute
 * - If another message notification comes in before one minute has passed we reset the timer to one minute and add the new notification to the list of threads to be batched into one email
 * - We repeat this process for each further message notification until we have a one minute break
 * - Because we do want people to get emails in a timely manner we force push them out after 10 minutes. Basically, if we get a message notification and no email has been sent but it's been more than 10 minutes since the very first notification we send the email with all current notifications batched into one email.
 */
export type Recipient = {
  email: string,
  username: string,
  userId: string,
  name: string,
};
type Reply = {
  id: string,
  sender: {
    id: string,
    profilePhoto: string,
    name: string,
    username: ?string,
  },
  content: {
    body: string,
  },
};
export type NewMessageNotificationEmailThread = {
  ...$Exact<DBThread>,
  community: DBCommunity,
  channel: DBChannel,
  replies: Array<Reply>,
};
const bufferMessageNotificationEmail = async (
  recipient: Recipient,
  thread: NewMessageNotificationEmailThread,
  notification: DBNotification
) => {
  debug(
    `send message notification email to ${recipient.email} for thread#${
      thread.id
    }`
  );
  let job = await bufferNewMessageEmailQueue.getJob(recipient.email);
  // Try to remove the job if it exists. This fails sometimes due to a
  // race condition where the getJob returns a failed or active job.
  // We circumvent that issue by simply pretending like no job exists
  // and adding a new one
  // Ref: withspectrum/spectrum#3189
  if (job) {
    debug(`timeout exists for ${recipient.email}, clearing`);
    try {
      await job.remove();
    } catch (err) {
      try {
        await job.finished();
        // Note(@mxstbr): This throws if the job fails to complete
        // but we don't care if that happens, so we ignore it
      } catch (err) {}

      job = null;
    }
  }
  if (!job) {
    debug(
      `creating new timeout for ${
        recipient.email
      }, sending email after ${BUFFER}ms`
    );
    return bufferNewMessageEmailQueue.add(
      {
        threads: [thread],
        notifications: [notification],
        firstTimeout: Date.now(),
        recipient,
      },
      {
        delay: BUFFER,
        jobId: recipient.email,
      }
    );
  } else {
    const timeout = job.data;
    debug(`adding new thread to ${recipient.email}'s threads`);
    timeout.threads.push(thread);
    timeout.notifications.push(notification);

    // If it's been a few minutes and we still haven't sent an email because messages
    // keep coming send an email now to avoid not sending a notification for hours
    if (timeout.firstTimeout < Date.now() - MAX_WAIT) {
      debug(
        `force send email to ${
          recipient.email
        } because it's been over ${MAX_WAIT}ms without an email`
      );
      return bufferNewMessageEmailQueue.add(timeout, {
        delay: 0,
        jobId: recipient.email,
      });
    } else {
      debug(
        `refresh  ${BUFFER}ms timeout for ${recipient.email} with new thread#${
          thread.id
        }`
      );
      return bufferNewMessageEmailQueue.add(timeout, {
        delay: BUFFER,
        jobId: recipient.email,
      });
    }
  }
};

export default bufferMessageNotificationEmail;
