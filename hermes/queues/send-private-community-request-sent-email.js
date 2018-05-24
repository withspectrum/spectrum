// @flow
const debug = require('debug')(
  'hermes:queue:send-request-join-private-channel'
);
import Raven from 'shared/raven';
import sendEmail from '../send-email';
import {
  PRIVATE_COMMUNITY_REQUEST_SENT_TEMPLATE,
  SEND_PRIVATE_COMMUNITY_REQUEST_SENT_EMAIL,
} from './constants';
import type {
  Job,
  SendPrivateCommunityRequestEmailJobData,
} from 'shared/bull/types';

export default (job: Job<SendPrivateCommunityRequestEmailJobData>) => {
  debug(`\nnew job: ${job.id}`);
  const { user, recipient, community } = job.data;
  debug(
    `\nsending notification to private community owner: ${recipient.email}`
  );

  const subject = `${user.name} has requested to join the ${
    community.name
  } community`;
  const preheader =
    'View your community settings to approve or block this request';

  try {
    return sendEmail({
      TemplateId: PRIVATE_COMMUNITY_REQUEST_SENT_TEMPLATE,
      To: recipient.email,
      Tag: SEND_PRIVATE_COMMUNITY_REQUEST_SENT_EMAIL,
      TemplateModel: {
        subject,
        preheader,
        data: {
          user,
          recipient,
          community,
        },
      },
    });
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
