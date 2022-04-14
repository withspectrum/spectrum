// @flow
const debug = require('debug')('hermes:queue:send-new-message-email');
import Raven from 'shared/raven';
import sendEmail from '../send-email';
import { generateUnsubscribeToken } from '../utils/generate-jwt';
import smarten from 'hermes/utils/smarten-string';
import {
  NEW_MESSAGE_TEMPLATE,
  TYPE_NEW_MESSAGE_IN_THREAD,
  TYPE_MUTE_THREAD,
  SEND_NEW_MESSAGE_EMAIL,
} from './constants';
import type { Job, SendNewMessageEmailJobData } from 'shared/bull/types';

export default async (job: Job<SendNewMessageEmailJobData>): Promise<void> => {
  debug(`\nnew job: ${job.id}`);
  const { recipient, threads } = job.data;

  // how many threads were grouped into this email
  const threadsAmount = threads.length;
  let totalNames = [];
  threads.map(thread => {
    const replyNames = thread.replies.map(reply => reply.sender.name);
    return replyNames.map(name => {
      totalNames.push(name);
      return name;
    });
  });
  // how many unique people sent replies in all of these threads
  totalNames = totalNames.filter((x, i, a) => a.indexOf(x) == i);
  const firstName = totalNames.splice(0, 1)[0];
  const restNames = totalNames.length > 0 ? totalNames : null;
  const numUsersText = restNames
    ? ` and ${
        restNames.length === 1
          ? `${restNames.length} other person`
          : `${restNames.length} others`
      }`
    : '';

  const threadsText =
    threadsAmount === 1
      ? `‘${smarten(threads[0].content.title)}’`
      : `${threadsAmount} conversations`;
  // Brian and 3 others replied in 4 conversations
  // Brian replied in 'Thread title'
  // Brian and 3 others replied in 'Thread title'
  const subject = `${firstName}${numUsersText} replied in ${threadsText}`;
  const newMessagesLength = threads.reduce(
    (a, thread) => a + thread.repliesCount,
    0
  );
  const preheaderSubtext = restNames
    ? ` and ${
        restNames.length === 1
          ? `${restNames.length} other person`
          : `${restNames.length} others`
      }...`
    : '';
  const preheader = `View ${
    newMessagesLength === 1
      ? `1 new message from `
      : `${newMessagesLength} new messages from `
  }${firstName}${preheaderSubtext}`;

  const unsubscribeToken = await generateUnsubscribeToken(
    recipient.userId,
    TYPE_NEW_MESSAGE_IN_THREAD
  );

  const singleThreadMuteToken =
    threads.length === 1
      ? generateUnsubscribeToken(
          recipient.userId,
          TYPE_MUTE_THREAD,
          threads[0].id
        )
      : null;

  if (!unsubscribeToken || !recipient.email || !recipient.username)
    return Promise.resolve();
  try {
    return sendEmail({
      templateId: NEW_MESSAGE_TEMPLATE,
      to: [{ email: recipient.email }],
      dynamic_template_data: {
        subject,
        preheader,
        recipient,
        unsubscribeToken,
        singleThreadMuteToken,
        data: {
          threads: threads.map(thread => ({
            ...thread,
            muteThreadToken: generateUnsubscribeToken(
              recipient.userId,
              TYPE_MUTE_THREAD,
              thread.id
            ),
          })),
        },
      },
      userId: recipient.userId,
    });
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    return Raven.captureException(err);
  }
};
