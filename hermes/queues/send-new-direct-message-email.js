// @flow
const debug = require('debug')('hermes:queue:send-new-direct-message-email');
import sendEmail from '../send-email';
import { generateUnsubscribeToken } from '../utils/generate-jwt';
import {
  NEW_DIRECT_MESSAGE_TEMPLATE,
  TYPE_NEW_DIRECT_MESSAGE,
  DEBUG_TEMPLATE,
  TYPE_MUTE_DIRECT_MESSAGE_THREAD,
} from './constants';
import capitalize from '../utils/capitalize';

type SendNewMessageEmailJobData = {
  recipient: {
    email: string,
    name: string,
    username: string,
    userId: string,
  },
  user: {
    displayName: string,
    username: string,
    userId: string,
    name: string,
  },
  thread: {
    content: {
      title: string,
    },
    path: string,
    id: string,
  },
  message: {
    content: {
      body: string,
    },
  },
};

type SendNewMessageEmailJob = {
  data: SendNewMessageEmailJobData,
  id: string,
};

export default async (job: SendNewMessageEmailJob) => {
  debug(`\nnew job: ${job.id}`);
  const { recipient, user, thread, message } = job.data;
  const subject = `New direct message from ${user.name} on Spectrum`;

  const unsubscribeToken = await generateUnsubscribeToken(
    user.userId,
    TYPE_NEW_DIRECT_MESSAGE
  );

  const muteThreadToken = await generateUnsubscribeToken(
    user.userId,
    TYPE_MUTE_DIRECT_MESSAGE_THREAD,
    thread.id
  );

  if (!recipient.email || !unsubscribeToken || !muteThreadToken) return;

  try {
    return sendEmail({
      TemplateId: NEW_DIRECT_MESSAGE_TEMPLATE,
      To: recipient.email,
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
    console.log(err);
  }
};
