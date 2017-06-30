// @flow
const debug = require('debug')('athena:send-message-notification-email');
import createQueue from '../../shared/bull/create-queue';
import { SEND_NEW_MESSAGE_EMAIL } from './constants';
import { getUsersSettings } from '../models/usersSettings';
import groupReplies from '../utils/group-replies';
import getEmailStatus from '../utils/get-email-status';

const BUFFER = 60000;
const MAX_WAIT = 300000;
const sendNewMessageEmailQueue = createQueue(SEND_NEW_MESSAGE_EMAIL);

// Called when the buffer time is over to actually send an email
const timedOut = recipient => {
  const threads = timeouts[recipient.email].threads;
  // Clear timeout buffer for this recipient
  delete timeouts[recipient.email];
  debug(
    `send notification email for ${threads.length} threads to @${recipient.username} (${recipient.email})`
  );
  // Group replies by sender
  const threadsWithGroupedReplies = threads.map(thread => ({
    ...thread,
    replies: groupReplies(thread.replies),
  }));

  // Make sure we should be sending an email to this user
  return getEmailStatus(
    recipient.userId,
    'newMessageInThreads'
  ).then(shouldGetEmail => {
    if (!shouldGetEmail) {
      debug(`@${recipient.username} should not get email, aborting`);
      return Promise.resolve();
    }
    debug(`adding email for @${recipient.username} to queue`);
    return sendNewMessageEmailQueue.add({
      to: recipient.email,
      user: {
        displayName: recipient.name,
        username: recipient.username,
      },
      threads: threadsWithGroupedReplies,
    });
  });
};

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
 * - Because we do want people to get emails in a timely manner we force push them out after 5 minutes. Basically, if we get a message notification and no email has been sent but it's been more than five minutes since the very first notification we send the email with all current notifications batched into one email.
 */
const bufferMessageNotificationEmail = (recipient, thread, notification) => {
  debug(
    `send message notification email to ${recipient.email} for thread#${thread.id}`
  );
  if (!timeouts[recipient.email]) {
    debug(
      `creating new timeout for ${recipient.email}, sending email after ${BUFFER}ms`
    );
    timeouts[recipient.email] = {
      timeout: setTimeout(() => timedOut(recipient), BUFFER),
      firstTimeout: Date.now(),
      threads: [thread],
      notifications: [notification],
    };

    // If we already have a timeout going
  } else {
    debug(`timeout exists for ${recipient.email}, clearing`);
    clearTimeout(timeouts[recipient.email].timeout);
    const existingThread = timeouts[recipient.email].threads.find(
      previous => previous.id === thread.id
    );
    // If there's already a notification for this thread buffered add the new reply to the threads replies
    if (existingThread) {
      debug(`thread already has a record in memory, adding new reply`);
      timeouts[recipient.email].threads = timeouts[
        recipient.email
      ].threads.map(previous => {
        if (previous.id !== thread.id) return previous;
        return {
          ...previous,
          replies: previous.replies.concat(thread.replies),
        };
      });

      // If there's no notification for this specific thread yet just push it to the threads
    } else {
      debug(`adding new thread to ${recipient.email}'s threads`);
      timeouts[recipient.email].threads.push(thread);
      timeouts[recipient.email].notifications.push(notification);
    }

    // If it's been a few minutes and we still haven't sent an email because messages
    // keep coming send an email now to avoid not sending a notification for hours
    if (timeouts[recipient.email].firstTimeout < Date.now() - MAX_WAIT) {
      debug(
        `force send email to ${recipient.email} because it's been over ${MAX_WAIT}ms without an email`
      );
      timedOut(recipient);
    } else {
      debug(
        `refresh timeout for ${recipient.email} with new thread#${thread.id}`
      );
      timeouts[recipient.email].timeout = setTimeout(
        () => timedOut(recipient),
        BUFFER
      );
    }
  }
};

export default bufferMessageNotificationEmail;
