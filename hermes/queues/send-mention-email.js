// @flow
const debug = require('debug')('hermes:queue:send-new-direct-message-email');
import sendEmail from '../send-email';
import { generateUnsubscribeToken } from '../utils/generate-jwt';
import { NEW_MENTION_TEMPLATE, TYPE_NEW_MENTION } from './constants';
import capitalize from '../utils/capitalize';

type SendNewMentionEmailJobData = {
  recipient: {
    email: string,
    name: string,
    username: string,
    userId: string,
  },
  sender: {
    name: string,
    username: string,
    id: string,
  },
  thread: {
    content: {
      title: string,
    },
    id: string,
  },
  message?: {
    content: {
      body: string,
    },
  },
  thread: {
    id: string,
    content: {
      title: string,
    },
  },
};

type SendNewMentionEmailJob = {
  data: SendNewMentionEmailJobData,
  id: string,
};

export default async (job: SendNewMentionEmailJob) => {
  debug(`\nnew job: ${job.id}`);

  const { recipient, sender, thread, message } = job.data;
  const subject = `${sender.name} mentioned you on Spectrum`;

  const unsubscribeToken = await generateUnsubscribeToken(
    recipient.userId,
    TYPE_NEW_MENTION
  );

  if (!recipient.email || !unsubscribeToken) return;

  try {
    return sendEmail({
      TemplateId: NEW_MENTION_TEMPLATE,
      To: recipient.email,
      TemplateModel: {
        subject,
        sender,
        thread,
        message,
        username: recipient.username,
        unsubscribeToken,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
