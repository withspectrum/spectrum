// @flow
const debug = require('debug')(
  'hermes:queue:send-admin-user-spamming-threads-notification'
);
import Raven from 'shared/raven';
import sendEmail from '../send-email';
import {
  SEND_ADMIN_USER_SPAMMING_THREADS_NOTIFICATION_EMAIL,
  ADMIN_USER_SPAMMING_THREADS_NOTIFICATION_TEMPLATE,
} from './constants';
import { toPlainText, toState } from 'shared/draft-utils';
import type { Job, AdminUserSpammingThreadsJobData } from 'shared/bull/types';

const threadBodyToPlainText = (body: any): string =>
  toPlainText(toState(JSON.parse(body)));

export default (job: Job<AdminUserSpammingThreadsJobData>) => {
  debug(`\nnew job: ${job.id}`);
  const { user, threads, publishing, community, channel } = job.data;

  const subject = `🐟 User spamming threads alert: ${user.name} has published ${
    threads.length === 1 ? 'one thread' : `${threads.length} threads`
  } in previous 10 minutes`;
  const preheader = `${
    user.name
  } is attempting to publish a new thread in the ${community.name} community`;

  const cleanThread = (thread: any) =>
    Object.assign({}, thread, {
      content: {
        ...thread.content,
        body: threadBodyToPlainText(thread.content.body),
      },
    });

  try {
    return sendEmail({
      TemplateId: ADMIN_USER_SPAMMING_THREADS_NOTIFICATION_TEMPLATE,
      To: 'brian@spectrum.chat, max@spectrum.chat, bryn@spectrum.chat',
      Tag: SEND_ADMIN_USER_SPAMMING_THREADS_NOTIFICATION_EMAIL,
      TemplateModel: {
        subject,
        preheader,
        data: {
          user,
          threads: threads.map(t => cleanThread(t)),
          publishing: cleanThread(publishing),
          community,
          channel,
        },
      },
    });
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
