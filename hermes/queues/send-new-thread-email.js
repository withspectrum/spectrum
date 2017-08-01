// @flow
const debug = require('debug')('hermes:queue:send-new-thread-email');
import sendEmail from '../send-email';
import processQueue from '../../shared/bull/process-queue';
import {
  SEND_THREAD_CREATED_NOTIFICATION_EMAIL,
  NEW_THREAD_CREATED_TEMPLATE,
} from './constants';

type SendNewThreadNotificationJobData = {
  to: string,
  author: Object,
  community: Object,
  channel: Object,
  thread: Object,
  recipient: Object,
};

type SendNewThreadEmailJob = {
  data: SendNewThreadNotificationJobData,
  id: string,
};

export default () =>
  processQueue(
    SEND_THREAD_CREATED_NOTIFICATION_EMAIL,
    (job: SendNewThreadEmailJob) => {
      debug(`\nnew job: ${job.id}`);
      debug(`\nsending new thread email to: ${job.data.to}`);

      try {
        return sendEmail({
          TemplateId: NEW_THREAD_CREATED_TEMPLATE,
          To: job.data.to,
          TemplateModel: {
            author: job.data.author,
            community: job.data.community,
            channel: job.data.channel,
            thread: job.data.thread,
            recipient: job.data.recipient,
          },
        });
      } catch (err) {
        console.log(err);
      }
    }
  );
