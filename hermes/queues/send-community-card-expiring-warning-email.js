// @flow
const debug = require('debug')(
  'hermes:queue:send-community-card-expiring-warning-email'
);
import sendEmail from '../send-email';
import type { Job, CardExpiringWarningEmailJobData } from 'shared/bull/types';
import {
  COMMUNITY_CARD_EXPIRING_WARNING_TEMPLATE,
  SEND_COMMUNITY_CARD_EXPIRING_WARNING_EMAIL,
} from './constants';
import Raven from 'shared/raven';

export default (job: Job<CardExpiringWarningEmailJobData>) => {
  debug(`\nnew job: ${job.id}`);
  const { to, community, source } = job.data;

  if (!to) {
    debug('user does not have an email, aborting');
    return;
  }

  const subject = `Action required: your credit card is about to expire`;
  const preheader = `Your payment method for the ${
    community.name
  } community will expire at the end of the month`;

  try {
    return sendEmail({
      TemplateId: COMMUNITY_CARD_EXPIRING_WARNING_TEMPLATE,
      To: to,
      Tag: SEND_COMMUNITY_CARD_EXPIRING_WARNING_EMAIL,
      TemplateModel: {
        subject,
        preheader,
        data: {
          community,
          source,
        },
      },
    });
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
