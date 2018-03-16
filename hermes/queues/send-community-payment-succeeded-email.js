// @flow
const debug = require('debug')(
  'hermes:queue:send-community-payment-succeeded-email'
);
import sendEmail from '../send-email';
import {
  COMMUNITY_PAYMENT_SUCCEEDED_TEMPLATE,
  SEND_COMMUNITY_PAYMENT_SUCCEEDED_EMAIL,
} from './constants';

export default job => {
  debug(`\nnew job: ${job.id}`);
  const { to } = job.data;

  if (!to) {
    debug('user does not have an email, aborting');
    return Promise.resolve();
  }

  try {
    return sendEmail({
      TemplateId: COMMUNITY_PAYMENT_SUCCEEDED_TEMPLATE,
      To: to,
      Tag: SEND_COMMUNITY_PAYMENT_SUCCEEDED_EMAIL,
      TemplateModel: {},
    });
  } catch (err) {
    console.log(err);
  }
};
