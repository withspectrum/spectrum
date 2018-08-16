// @flow
const debug = require('debug')('hermes:queue:send-admin-user-reported-email');
import sendEmail from '../send-email';
import { getUser } from '../models/user';
import Raven from 'shared/raven';
import {
  SEND_ADMIN_USER_REPORTED_EMAIL,
  ADMIN_USER_REPORTED_TEMPLATE,
} from './constants';
import type { Job, AdminProcessUserReportedJobData } from 'shared/bull/types';

export default async (job: Job<AdminProcessUserReportedJobData>) => {
  debug(`\nnew job: ${job.id}`);
  const { userId, reason, reportedBy, reportedAt } = job.data;

  const [reportedUser, reportingUser] = await Promise.all([
    getUser(userId),
    getUser(reportedBy),
  ]);

  const subject = `User ${reportedUser.username} reported by ${
    reportingUser.username
  }`;
  const preheader = `Reason: ${reason}`;

  try {
    return sendEmail({
      TemplateId: ADMIN_USER_REPORTED_TEMPLATE,
      To: 'brian@spectrum.chat, max@spectrum.chat, bryn@spectrum.chat',
      Tag: SEND_ADMIN_USER_REPORTED_EMAIL,
      TemplateModel: {
        subject,
        preheader,
        reportedUser,
        reportingUser,
        reason,
      },
    });
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
