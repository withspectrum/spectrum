// @flow
const debug = require('debug')('hermes:queue:send-admin-user-reported-email');
import sendEmail from '../send-email';
import { getUserById } from 'shared/db/queries/user';
import Raven from 'shared/raven';
import {
  SEND_ADMIN_USER_REPORTED_EMAIL,
  ADMIN_USER_REPORTED_TEMPLATE,
} from './constants';
import type { Job, AdminProcessUserReportedJobData } from 'shared/bull/types';

export default async (
  job: Job<AdminProcessUserReportedJobData>
): Promise<void> => {
  debug(`\nnew job: ${job.id}`);
  const { userId, reason, reportedBy, reportedAt } = job.data;

  const [reportedUser, reportingUser] = await Promise.all([
    getUserById(userId),
    getUserById(reportedBy),
  ]);

  const subject = `☠️ ${reportedUser.username} was reported`;
  const preheader = `Reason: ${reason}`;

  try {
    return sendEmail({
      templateId: ADMIN_USER_REPORTED_TEMPLATE,
      to: [{ email: 'brian@spectrum.chat ' }, { email: 'max@spectrum.chat ' }],
      dynamic_template_data: {
        subject,
        preheader,
        reportedUser,
        reportingUser,
        reason,
      },
    });
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    return Raven.captureException(err);
  }
};
