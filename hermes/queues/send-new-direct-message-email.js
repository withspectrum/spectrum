// @flow
const debug = require('debug')('hermes:queue:send-new-direct-message-email');
import sendEmail from '../send-email';
import { generateUnsubscribeToken } from '../utils/generate-jwt';
import {
  NEW_DIRECT_MESSAGE_TEMPLATE,
  TYPE_NEW_DIRECT_MESSAGE,
  TYPE_MUTE_DIRECT_MESSAGE_THREAD,
  SEND_NEW_DIRECT_MESSAGE_EMAIL,
} from './constants';
import type { Job, SendNewDirectMessageEmailJobData } from 'shared/bull/types';

export default async (job: Job<SendNewDirectMessageEmailJobData>) => {
  debug(`\nnew job: ${job.id}`);
  const { recipient, user, thread, message } = job.data;
  const subject = `New direct message from ${user.name} on Spectrum`;

  const unsubscribeToken = await generateUnsubscribeToken(
    recipient.userId,
    TYPE_NEW_DIRECT_MESSAGE
  );

  const muteThreadToken = await generateUnsubscribeToken(
    recipient.userId,
    TYPE_MUTE_DIRECT_MESSAGE_THREAD,
    thread.id
  );

  if (!recipient.email || !unsubscribeToken || !muteThreadToken) return;

  try {
    return sendEmail({
      TemplateId: NEW_DIRECT_MESSAGE_TEMPLATE,
      To: recipient.email,
      Tag: SEND_NEW_DIRECT_MESSAGE_EMAIL,
      TemplateModel: {
        subject,
        user,
        thread,
        username: user.username,
        message,
        muteThreadToken,
        unsubscribeToken,
      },
    });
  } catch (err) {
    console.error(err);
  }
};
