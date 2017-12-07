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
  const preheader = `${invitedCount} invites sent for the ${community.name} community`;
  try {
    return sendEmail({
      TemplateId: ADMIN_SLACK_IMPORT_PROCESSED_TEMPLATE,
      To: 'brian@spectrum.chat, max@spectrum.chat, bryn@spectrum.chat',
      Tag: SEND_ADMIN_SLACK_IMPORT_PROCESSED_EMAIL,
      TemplateModel: {
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
    console.log(err);
  }
};
