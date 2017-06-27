// @flow
const debug = require('debug')('athena:send-message-notification-email');
import createQueue from '../../shared/bull/create-queue';
import { SEND_NEW_MESSAGE_EMAIL } from './constants';

// TODO: Make one minute
const BUFFER = 6000;
const sendNewMessageEmailQueue = createQueue(SEND_NEW_MESSAGE_EMAIL);

const addToSendNewMessageEmailQueue = (recipient, threads) =>
  sendNewMessageEmailQueue.add({
    to: recipient.email,
    user: {
      displayName: recipient.name,
      username: recipient.username,
    },
    threads,
  });

const sendEmail = recipient => {
  debug(
    `send email to ${recipient.email}\nthreads: %O`,
    timeouts[recipient.email].threads
  );
  debug('replies\n%O', timeouts[recipient.email].threads[0].replies);
  // Clear buffer timeout for this recipient
  delete timeouts[recipient.email];
};

type Timeouts = {
  [email: string]: {
    timeout: any,
    firstTimeout: number, // timestamp
    data: Array<any>,
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
const sendMessageNotificationEmail = (recipient, thread) => {
  debug(
    `send message notification email to ${recipient.email} for thread#${thread.id}`
  );
  if (!timeouts[recipient.email]) {
    debug(
      `creating new timeout for ${recipient.email}, sending email in one minute`
    );
    timeouts[recipient.email] = {
      timeout: setTimeout(() => sendEmail(recipient), BUFFER),
      firstTimout: Date.now(),
      threads: [thread],
    };

    // FIXME this condition likely doesn't work

    // If it's been x minutes and we still haven't sent an email because messages

    // keep coming send an email now and start buffering the next emails

    // } else if (timeouts[recipient.email].firstTimeout < Date.now() - FIVE_MINUTES) {

    //  clearTimeout(timeouts[recipient.email].timeout);

    //  sendEmailWithCurrentThreads

    //  timeouts[recipient.email] = {

    //    timeout: setTimeout(() => sendEmail(recipient), BUFFER),

    //    firstTimout: Date.now(),

    //    threads: [thread],

    //  };

    // If we already have a timeout going but it's not been five minutes reset

    // the timer and add the new message
  } else {
    debug(
      `refresh timeout for ${recipient.email} with new thread#${thread.id}`
    );
    clearTimeout(timeouts[recipient.email].timeout);
    timeouts[recipient.email].timeout = setTimeout(
      () => sendEmail(recipient),
      BUFFER
    );
    // TODO Merge replies if we already got a thread like this
    timeouts[recipient.email].threads.push(thread);
  }
};

export default sendMessageNotificationEmail;
