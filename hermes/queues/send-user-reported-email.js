// @flow
const debug = require('debug')(
  'hermes:queue:send-admin-community-created-email'
);
import sendEmail from '../send-email';
import { getUser } from '../models/user';
import Raven from 'shared/raven';
import type { Job, SendUserReportedEmailJobData } from 'shared/bull/types';

export default async (job: Job<SendUserReportedEmailJobData>) => {
  debug(`\nnew job: ${job.id}`);
  const { userId, message, reportedBy, reportedAt } = job.data;

  const reportedUser = await getUser(userId);
  const reportingUser = await getUser(reportedBy);

  try {
    return sendEmail({
      TemplateId: SEND_USER_REPORTED_TEMPLATE,
      To: 'brian@spectrum.chat, max@spectrum.chat, bryn@spectrum.chat',
      Tag: SEND_USER_REPORTED_EMAIL,
      TemplateModel: {
        reportedUser,
        reportingUser,
        message,
      },
    });
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
