// @flow
const debug = require('debug')('hermes:queue:send-new-direct-message-email');
import sendEmail from '../send-email';
import { generateUnsubscribeToken } from '../utils/generate-jwt';
import {
  NEW_MENTION_MESSAGE_TEMPLATE,
  TYPE_NEW_MENTION,
  TYPE_MUTE_THREAD,
} from './constants';
import type { DBThread, DBUser, DBMessage } from 'shared/types';

type SendNewMentionEmailJobData = {
  recipient: DBUser,
  sender: DBUser,
  thread: DBThread,
  message: DBMessage,
};

type SendNewMentionEmailJob = {
  data: SendNewMentionEmailJobData,
  id: string,
};

export default async (job: SendNewMentionEmailJob) => {
  debug(`\nnew job: ${job.id}`);

  const { recipient, sender, thread, message } = job.data;
  const subject = `${sender.name} mentioned you in "${thread.content.title}"`;
  const preheader = message.content.body;
  console.log('preheader', preheader);

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
