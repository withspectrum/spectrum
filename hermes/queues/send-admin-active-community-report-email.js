const debug = require('debug')(
  'hermes:queue:send-admin-active-community-report-email'
);
import sendEmail from '../send-email';
import {
  ADMIN_ACTIVE_COMMUNITY_REPORT_TEMPLATE,
  SEND_ACTIVE_COMMUNITY_ADMIN_REPORT_EMAIL,
} from './constants';
import type { AdminActiveCommunityReportJobData, Job } from 'shared/bull/types';

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

  try {
    return sendEmail({
      TemplateId: ADMIN_ACTIVE_COMMUNITY_REPORT_TEMPLATE,
      To: 'brian@spectrum.chat, max@spectrum.chat, bryn@spectrum.chat',
      Tag: SEND_ACTIVE_COMMUNITY_ADMIN_REPORT_EMAIL,
      TemplateModel: {
        subject: 'Active Community Report',
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
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
