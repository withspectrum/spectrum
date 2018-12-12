const debug = require('debug')(
  'hermes:queue:send-admin-slack-import-processed-email'
);
import sendEmail from '../send-email';
import {
  ADMIN_SLACK_IMPORT_PROCESSED_TEMPLATE,
  SEND_ADMIN_SLACK_IMPORT_PROCESSED_EMAIL,
} from './constants';

export default job => {
  debug(`\nnew job: ${job.id}`);
  const { user, community, invitedCount, teamName } = job.data;
  const subject = `New Slack import: ${invitedCount} invites from the ${teamName} Slack team`;
  const preheader = `${invitedCount} invites sent for the ${
    community.name
  } community`;
  try {
    return sendEmail({
      templateId: ADMIN_SLACK_IMPORT_PROCESSED_TEMPLATE,
      to: [
        { email: 'brian@spectrum.chat ' },
        { email: 'max@spectrum.chat ' },
        { email: 'bryn@spectrum.chat ' },
      ],
      dynamic_template_data: {
        subject,
        preheader,
        data: {
          user,
          community,
          invitedCount,
          teamName,
        },
      },
    });
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
  }
};
