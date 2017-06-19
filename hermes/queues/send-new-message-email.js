// @flow
const debug = require('debug')('hermes:queue:send-new-message-email');
import sendEmail from '../send-email';
import processQueue from '../process-queue';
import { SEND_NEW_MESSAGE_EMAIL } from './constants';

type MessageData = {
  sender: {
    profilePhoto: string,
    name: string,
  },
  content: {
    body: string,
  },
};

type SendNewMessageEmailJobData = {
  user: {
    displayName: string,
    username: string,
  },
  thread: {
    title: string,
    id: string,
  },
  to: string,
  messages: Array<MessageData>,
};

type SendNewMessageEmailJob = {
  data: SendNewMessageEmailJobData,
  id: string,
};

export default () =>
  processQueue(SEND_NEW_MESSAGE_EMAIL, (job: SendNewMessageEmailJob) => {
    debug(`new job: ${job.id}`);
    sendEmail({
      TemplateId: 'new-message-email-template',
      To: job.data.to,
      TemplateModel: {
        user: job.data.user,
        thread: job.data.thread,
        messages: job.data.messages,
      },
    });
  });
