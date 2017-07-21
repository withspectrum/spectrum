// @flow
const debug = require('debug')('hermes:queue:send-user-welcome-email');
import sendEmail from '../send-email';
import processQueue from '../../shared/bull/process-queue';
import {
  SEND_NEW_USER_WELCOME_EMAIL,
  NEW_USER_WELCOME_TEMPLATE,
} from './constants';

export default () =>
  processQueue(SEND_NEW_USER_WELCOME_EMAIL, job => {
    debug(`\nnew job: ${job.id}`);
    const user = job.data;

    if (!user.email) {
      debug(`user#${user.id} does not have an email, aborting`);
      return Promise.resolve();
    }

    try {
      return sendEmail({
        TemplateId: NEW_USER_WELCOME_TEMPLATE,
        To: user.email,
        TemplateModel: {
          user,
        },
      });
    } catch (err) {
      console.log(err);
    }
  });
