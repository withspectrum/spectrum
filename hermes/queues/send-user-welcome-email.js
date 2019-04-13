// @flow
const debug = require('debug')('hermes:queue:send-user-welcome-email');
import sendEmail from '../send-email';
import Raven from 'shared/raven';
import type { Job, NewUserWelcomeEmailJobData } from 'shared/bull/types';
import {
  NEW_USER_WELCOME_TEMPLATE,
  SEND_NEW_USER_WELCOME_EMAIL,
} from './constants';

export default (job: Job<NewUserWelcomeEmailJobData>): Promise<void> => {
  debug(`\nnew job: ${job.id}`);
  const { user } = job.data;

  if (!user.email) {
    debug(`user#${user.id} does not have an email, aborting`);
    return Promise.resolve();
  }

  try {
    return sendEmail({
      templateId: NEW_USER_WELCOME_TEMPLATE,
      to: [{ email: user.email }],
      Tag: SEND_NEW_USER_WELCOME_EMAIL,
      dynamic_template_data: {
        user,
        subject: 'Welcome to Spectrum!',
      },
    });
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    return Raven.captureException(err);
  }
};
