// @flow
const debug = require('debug')(
  'hermes:queue:send-community-card-expiring-warning-email'
);
import sendEmail from '../send-email';
import {
  COMMUNITY_CARD_EXPIRING_WARNING_TEMPLATE,
  SEND_COMMUNITY_CARD_EXPIRING_WARNING_EMAIL,
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
      TemplateId: COMMUNITY_CARD_EXPIRING_WARNING_TEMPLATE,
      To: to,
      Tag: SEND_COMMUNITY_CARD_EXPIRING_WARNING_EMAIL,
      TemplateModel: {},
    });
  } catch (err) {
    console.log(err);
  }
};
