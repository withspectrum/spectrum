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
      TemplateId: NEW_USER_WELCOME_TEMPLATE,
      To: user.email,
      Tag: SEND_NEW_USER_WELCOME_EMAIL,
      TemplateModel: {
        user,
      },
    });
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
