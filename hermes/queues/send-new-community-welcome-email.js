const debug = require('debug')('hermes:queue:send-new-community-welcome-email');
import sendEmail from '../send-email';
import { NEW_COMMUNITY_WELCOME_TEMPLATE } from './constants';

export default job => {
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
};
