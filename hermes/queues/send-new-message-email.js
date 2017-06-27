// @flow
const debug = require('debug')('hermes:queue:send-new-message-email');
import sendEmail from '../send-email';
import processQueue from '../../shared/bull/process-queue';
import { SEND_NEW_MESSAGE_EMAIL, NEW_MESSAGE_TEMPLATE } from './constants';
import capitalize from '../utils/capitalize';

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
    debug(`\nnew job: ${job.id}`);
    try {
      return sendEmail({
        TemplateId: NEW_MESSAGE_TEMPLATE,
        To: job.data.to,
        TemplateModel: {
          subject: `You've got new replies in ${job.data.threads[0].content.title}`,
          user: job.data.user,
          threads: job.data.threads.map(thread => ({
            ...thread,
            // Capitalize the first letter of all titles in the body of the email
            // Don't capitalize the one in the subject though because in a DM thread
            // that is "your conversation with X", so we don't want to capitalize it.
            title: capitalize(thread.content.title),
          })),
        },
      });
    } catch (err) {
      console.log(err);
    }
  });
