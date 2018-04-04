// @flow
const debug = require('debug')('hermes:queue:send-new-direct-message-email');
import sendEmail from '../send-email';
import { generateUnsubscribeToken } from '../utils/generate-jwt';
import {
  NEW_MENTION_MESSAGE_TEMPLATE,
  TYPE_NEW_MENTION,
  TYPE_MUTE_THREAD,
  SEND_NEW_MENTION_MESSAGE_EMAIL,
} from './constants';
import type { SendNewMessageMentionEmailJobData, Job } from 'shared/bull/types';

export default async (job: Job<SendNewMessageMentionEmailJobData>) => {
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

  if (!recipient.email || !unsubscribeToken) return;

  try {
    return sendEmail({
      TemplateId: NEW_MENTION_MESSAGE_TEMPLATE,
      To: recipient.email,
      Tag: SEND_NEW_MENTION_MESSAGE_EMAIL,
      TemplateModel: {
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
    });
  } catch (err) {
    console.log(err);
  }
};
