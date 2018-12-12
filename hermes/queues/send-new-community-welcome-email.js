// @flow
const debug = require('debug')('hermes:queue:send-new-community-welcome-email');
import sendEmail from '../send-email';
import Raven from 'shared/raven';
import {
  NEW_COMMUNITY_WELCOME_TEMPLATE,
  SEND_NEW_COMMUNITY_WELCOME_EMAIL,
} from './constants';
import type { Job, NewCommunityWelcomeEmailJobData } from 'shared/bull/types';

export default (job: Job<NewCommunityWelcomeEmailJobData>): Promise<void> => {
  debug(`\nnew job: ${job.id}`);
  const { user, community } = job.data;

  if (!user.email) {
    debug(`user#${user.id} does not have an email, aborting`);
    return Promise.resolve();
  }

  try {
    return sendEmail({
      templateId: NEW_COMMUNITY_WELCOME_TEMPLATE,
      to: [{ email: user.email }],
      dynamic_template_data: {
        user,
        community,
        subject: 'Your new community is live on Spectrum!',
      },
    });
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    return Raven.captureException(err);
  }
};
