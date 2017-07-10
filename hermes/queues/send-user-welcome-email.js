// @flow
const debug = require('debug')('hermes:queue:send-user-welcome-email');
import sendEmail from '../send-email';
import processQueue from '../../shared/bull/process-queue';

export default () =>
  processQueue('send user welcome email', job => {
    debug(`\nnew job: ${job.id}`);
    const user = job.data;
    if (!user.email) {
      debug(`user#${user.id} does not have an email, aborting`);
      return Promise.resolve();
    }
    try {
      return sendEmail({
        TemplateId: 2462726,
        To: user.email,
        TemplateModel: {
          user,
        },
      });
    } catch (err) {
      console.log(err);
    }
  });
