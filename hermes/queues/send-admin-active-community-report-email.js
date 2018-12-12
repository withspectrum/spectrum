const debug = require('debug')(
  'hermes:queue:send-admin-active-community-report-email'
);
import sendEmail from '../send-email';
import {
  ADMIN_ACTIVE_COMMUNITY_REPORT_TEMPLATE,
  SEND_ACTIVE_COMMUNITY_ADMIN_REPORT_EMAIL,
} from './constants';
import type { AdminActiveCommunityReportJobData, Job } from 'shared/bull/types';
import formatDate from '../utils/format-date';

export default (job: Job<AdminActiveCommunityReportJobData>) => {
  debug(`\nnew job: ${job.id}`);
  const {
    dacCount,
    wacCount,
    macCount,
    newDac,
    newWac,
    newMac,
    lostDac,
    lostWac,
    lostMac,
  } = job.data;
  const { day, month, year } = formatDate();

  try {
    return sendEmail({
      templateId: ADMIN_ACTIVE_COMMUNITY_REPORT_TEMPLATE,
      to: [
        { email: 'brian@spectrum.chat ' },
        { email: 'max@spectrum.chat ' },
        { email: 'bryn@spectrum.chat ' },
      ],
      dynamic_template_data: {
        subject: `Active Community Report: ${month} ${day}, ${year}`,
        data: {
          dacCount,
          wacCount,
          macCount,
          newDac: newDac.join(', '),
          newWac: newWac.join(', '),
          newMac: newMac.join(', '),
          lostDac: lostDac.join(', '),
          lostWac: lostWac.join(', '),
          lostMac: lostMac.join(', '),
        },
      },
    });
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
  }
};
