// @flow
const debug = require('debug')('hermes:queue:send-new-thread-email');
import sendEmail from '../send-email';
import { generateUnsubscribeToken } from '../utils/generate-jwt';
import {
  NEW_THREAD_CREATED_TEMPLATE,
  TYPE_NEW_THREAD_CREATED,
  DEBUG_TEMPLATE,
} from './constants';

type SendNewThreadNotificationJobData = {
  to: string,
  author: Object,
  community: Object,
  channel: Object,
  thread: Object,
  recipient: Object,
  userId: string,
  username: string,
};

type SendNewThreadEmailJob = {
  data: SendNewThreadNotificationJobData,
  id: string,
};

export default async (job: SendNewThreadEmailJob) => {
  debug(`\nnew job: ${job.id}`);
  debug(`\nsending new thread email to: ${job.data.to}`);

  const unsubscribeToken = await generateUnsubscribeToken(
    job.data.userId,
    TYPE_NEW_THREAD_CREATED
  );

  if (!unsubscribeToken) {
    try {
      return sendEmail({
        TemplateId: DEBUG_TEMPLATE,
        To: 'briandlovin@gmail.com',
        TemplateModel: {
          unsubscribeToken,
          userData: job.data.userId,
          type: TYPE_NEW_THREAD_CREATED,
        },
      });
    } catch (err) {
      console.log(err);
    }
  } else {
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
          username: job.data.username,
          unsubscribeToken,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
};
