// @flow
const debug = require('debug')('hermes:queue:send-new-direct-message-email');
import Raven from 'shared/raven';
import sendEmail from '../send-email';
import { generateUnsubscribeToken } from '../utils/generate-jwt';
import {
  NEW_MENTION_THREAD_TEMPLATE,
  TYPE_NEW_MENTION,
  TYPE_MUTE_THREAD,
  SEND_NEW_MENTION_THREAD_EMAIL,
} from './constants';
import type { SendNewMessageMentionEmailJobData, Job } from 'shared/bull/types';

export default async (job: Job<SendNewMessageMentionEmailJobData>) => {
  debug(`\nnew job: ${job.id}`);

  const { recipient, sender, thread } = job.data;
  const subject = `${sender.name} mentioned you in "${thread.content.title}"`;
  const preheader = thread.content.body;

  const [unsubscribeToken, muteThreadToken] = await Promise.all([
    generateUnsubscribeToken(recipient.id, TYPE_NEW_MENTION),
    generateUnsubscribeToken(recipient.id, TYPE_MUTE_THREAD, thread.id),
  ]);

  if (!recipient.email || !unsubscribeToken) return;

  try {
    return sendEmail({
      TemplateId: NEW_MENTION_THREAD_TEMPLATE,
      To: recipient.email,
      Tag: SEND_NEW_MENTION_THREAD_EMAIL,
      TemplateModel: {
        subject,
        preheader,
        sender,
        data: {
          thread,
        },
        recipient,
        unsubscribeToken,
        muteThreadToken,
      },
      userId: recipient.id,
    });
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
