// @flow
const debug = require('debug')('hermes:queue:send-new-message-email');
import sendEmail from '../send-email';
import { NEW_THREAD_MESSAGE_TEMPLATE } from './constants';
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

type ThreadContent = {
  title: string,
};

type ThreadData = {
  title: string,
  id: string,
  replies: Array<ReplyData>,
  content: ThreadContent,
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

export default (job: SendNewMessageEmailJob) => {
  debug(`\nnew job: ${job.id}`);
  const repliesAmount = job.data.threads.reduce(
    (total, thread) => total + thread.replies.length,
    0
  );
  const repliesText = repliesAmount > 1 ? 'new replies' : 'a new reply';
  const postfix = job.data.threads.length > 1 ? ' and other threads' : '';
  const subject = `You've got ${repliesText} in ${job.data.threads[0].content
    .title}${postfix}`;
  try {
    return sendEmail({
      TemplateId: NEW_MESSAGE_TEMPLATE,
      To: job.data.to,
      TemplateModel: {
        subject,
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
};
