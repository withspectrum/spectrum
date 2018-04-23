// @flow
const debug = require('debug')('hermes:queue:send-new-moderator-welcome-email');
import Raven from 'shared/raven';
import sendEmail from '../send-email';
import {
  SEND_NEW_MODERATOR_WELCOME_EMAIL,
  NEW_MODERATOR_WELCOME_TEMPLATE,
} from './constants';
import type { Job, SendAddedModeratorEmailJobData } from 'shared/bull/types';

export default (job: Job<SendAddedModeratorEmailJobData>) => {
  debug(`\nnew job: ${job.id}`);
  const { recipient, community } = job.data;
  debug(`\nsending notification to user: ${recipient.email}`);

  const subject = `You have been added as a moderator in the ${
    community.name
  } community on Spectrum`;
  const preheader = `Go to the ${
    community.name
  } community to get started with moderation`;

  try {
    return sendEmail({
      TemplateId: NEW_MODERATOR_WELCOME_TEMPLATE,
      To: recipient.email,
      Tag: SEND_NEW_MODERATOR_WELCOME_EMAIL,
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
