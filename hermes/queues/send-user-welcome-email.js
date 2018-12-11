const debug = require('debug')('hermes:queue:send-user-welcome-email');
import sendEmail from '../send-email';
import {
  NEW_USER_WELCOME_TEMPLATE,
  SEND_NEW_USER_WELCOME_EMAIL,
} from './constants';

export default job => {
  debug(`\nnew job: ${job.id}`);
  const { user } = job.data;

  if (!user.email) {
    debug(`user#${user.id} does not have an email, aborting`);
    return Promise.resolve();
  }

  try {
    return sendEmail({
      templateId: NEW_USER_WELCOME_TEMPLATE,
      to: user.email,
      Tag: SEND_NEW_USER_WELCOME_EMAIL,
      dynamic_template_data: {
        user,
        subject: 'Welcome to Spectrum!',
      },
    });
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
