const debug = require('debug')(
  'hermes:queue:send-admin-active-community-report-email'
);
import sendEmail from '../send-email';
import {
  ADMIN_ACTIVE_COMMUNITY_REPORT_TEMPLATE,
  SEND_ACTIVE_COMMUNITY_ADMIN_REPORT_EMAIL,
} from './constants';

export default job => {
  debug(`\nnew job: ${job.id}`);
  const {
    allDac,
    allWac,
    allMac,
    overlappingDac,
    overlappingWac,
    overlappingMac,
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
        data: {
          allDac,
          allDacCount: allDac.length,
          overlappingDac: overlappingDac.join(', '),
          newDac: newDac.join(', '),
          lostDac: lostDac.join(', '),
          allWac: allWac.join(', '),
          allWacCount: allWac.length,
          overlappingWac: overlappingWac.join(', '),
          newWac: newWac.join(', '),
          lostWac: lostWac.join(', '),
          allMac: allMac.join(', '),
          allMacCount: allMac.length,
          overlappingMac: overlappingMac.join(', '),
          newMac: newMac.join(', '),
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
