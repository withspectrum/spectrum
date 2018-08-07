// @flow
const debug = require('debug')(
  'hermes:queue:send-request-join-private-channel'
);
import Raven from 'shared/raven';
import sendEmail from '../send-email';
import {
  SEND_PRIVATE_COMMUNITY_REQUEST_APPROVED_EMAIL,
  PRIVATE_COMMUNITY_REQUEST_APPROVED_TEMPLATE,
} from './constants';
import type {
  Job,
  SendPrivateCommunityRequestApprovedEmailJobData,
} from 'shared/bull/types';

export default (job: Job<SendPrivateCommunityRequestApprovedEmailJobData>) => {
  debug(`\nnew job: ${job.id}`);
  const { recipient, community } = job.data;
  debug(`\nsending notification to user: ${recipient.email}`);

  const subject = `Your request to join the ${
    community.name
  } community was approved!`;
  const preheader = `You can now join the conversations happening in the ${
    community.name
  } community!`;

  try {
    return sendEmail({
      TemplateId: PRIVATE_COMMUNITY_REQUEST_APPROVED_TEMPLATE,
      To: recipient.email,
      Tag: SEND_PRIVATE_COMMUNITY_REQUEST_APPROVED_EMAIL,
      TemplateModel: {
        subject,
        preheader,
        data: {
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
