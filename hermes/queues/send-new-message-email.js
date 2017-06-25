// @flow
const debug = require('debug')('hermes:queue:send-new-message-email');
import sendEmail from '../send-email';
import processQueue from '../process-queue';
import { SEND_NEW_MESSAGE_EMAIL, NEW_MESSAGE_TEMPLATE } from './constants';

type ReplyData = {
  sender: {
    profilePhoto: string,
    name: string,
  },
  content: {
    body: string,
  },
};

type ThreadData = {
  title: string,
  id: string,
  replies: Array<ReplyData>,
};

type SendNewMessageEmailJobData = {
  user: {
    displayName: string,
    username: string,
  },
  to: string,
  threads: Array<ThreadData>,
};

type SendNewMessageEmailJob = {
  data: SendNewMessageEmailJobData,
  id: string,
};

export default () =>
  processQueue(SEND_NEW_MESSAGE_EMAIL, (job: SendNewMessageEmailJob) => {
    debug(`new job: ${job.id}`);
    return sendEmail({
      TemplateId: NEW_MESSAGE_TEMPLATE,
      To: job.data.to,
      TemplateModel: {
        subject: `You've got new replies in "${job.data.threads[0].title}"`,
        user: job.data.user,
        threads: job.data.threads,
      },
    });
  });
