// @flow
const debug = require('debug')('hermes:queue:send-mention-message-email');
import Raven from 'shared/raven';
import sendEmail from '../send-email';
import { generateUnsubscribeToken } from '../utils/generate-jwt';
import {
  NEW_MENTION_MESSAGE_TEMPLATE,
  TYPE_NEW_MENTION,
  TYPE_MUTE_THREAD,
  SEND_NEW_MENTION_MESSAGE_EMAIL,
} from './constants';
import type { SendNewMessageMentionEmailJobData, Job } from 'shared/bull/types';

export default async (
  job: Job<SendNewMessageMentionEmailJobData>
): Promise<void> => {
  debug(`\nnew job: ${job.id}`);

  const { recipient, sender, thread, message } = job.data;
  const subject = `${sender.name} mentioned you in "${thread.content.title}"`;
  const preheader = message.content.body;

  const unsubscribeToken = await generateUnsubscribeToken(
    recipient.id,
    TYPE_NEW_MENTION
  );

  const muteThreadToken = await generateUnsubscribeToken(
    recipient.id,
    TYPE_MUTE_THREAD,
    thread.id
  );

  if (!recipient.email || !unsubscribeToken) return Promise.resolve();

  try {
    return sendEmail({
      templateId: NEW_MENTION_MESSAGE_TEMPLATE,
      to: [{ email: recipient.email }],
      dynamic_template_data: {
        subject,
        preheader,
        sender,
        data: {
          thread,
          message,
        },
        recipient,
        unsubscribeToken,
        muteThreadToken,
      },
      userId: recipient.id,
    });
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    return Raven.captureException(err);
  }
};
