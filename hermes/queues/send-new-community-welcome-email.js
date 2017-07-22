// @flow
const debug = require('debug')('hermes:queue:send-new-community-welcome-email');
import sendEmail from '../send-email';
import processQueue from '../../shared/bull/process-queue';
import {
  SEND_NEW_COMMUNITY_WELCOME_EMAIL,
  NEW_COMMUNITY_WELCOME_TEMPLATE,
} from './constants';

export default () =>
  processQueue(SEND_NEW_COMMUNITY_WELCOME_EMAIL, job => {
    debug(`\nnew job: ${job.id}`);
    const { user, community } = job.data;

    if (!user.email) {
      debug(`user#${user.id} does not have an email, aborting`);
      return Promise.resolve();
    }

    try {
      return sendEmail({
        TemplateId: NEW_COMMUNITY_WELCOME_TEMPLATE,
        To: user.email,
        TemplateModel: {
          user,
          community,
        },
      });
    } catch (err) {
      console.log(err);
    }
  });
