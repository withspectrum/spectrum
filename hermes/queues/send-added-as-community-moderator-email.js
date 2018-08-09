// @flow
const debug = require('debug')('hermes:queue:send-new-moderator-welcome-email');
import Raven from 'shared/raven';
import sendEmail from '../send-email';
import {
  SEND_ADDED_AS_COMMUNITY_MODERATOR_EMAIL,
  ADDED_AS_COMMUNITY_MODERATOR_EMAIL_TEMPLATE,
} from './constants';
import type {
  Job,
  SendAddedAsCommunityModeratorEmailJobData,
} from 'shared/bull/types';

export default (job: Job<SendAddedAsCommunityModeratorEmailJobData>) => {
  debug(`\nnew job: ${job.id}`);
  const { recipient, community } = job.data;
  debug(`\nsending notification to user: ${recipient.email}`);

  const subject = `You have been added as a moderator in the ${
    community.name
  } community on Spectrum`;
  const preheader = `Go to the ${community.name} community to get started`;

  try {
    return sendEmail({
      TemplateId: ADDED_AS_COMMUNITY_MODERATOR_EMAIL_TEMPLATE,
      To: recipient.email,
      Tag: SEND_ADDED_AS_COMMUNITY_MODERATOR_EMAIL,
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
