// @flow
const debug = require('debug')(
  'hermes:queue:send-community-payment-failed-email'
);
import sendEmail from '../send-email';
import {
  COMMUNITY_PAYMENT_FAILED_TEMPLATE,
  SEND_COMMUNITY_PAYMENT_FAILED_EMAIL,
} from './constants';
import type { Job, PaymentFailedEmailJobData } from 'shared/bull/types';
import Raven from 'shared/raven';
import { formatNumbersToDollars } from '../utils/number-to-dollars';

export default (job: Job<PaymentFailedEmailJobData>) => {
  debug(`\nnew job: ${job.id}`);
  const { to, charge, community } = job.data;

  if (!to) {
    debug('community does not have an administrator email, aborting');
    // $FlowIssue
    return Promise.resolve();
  }

  const subject = `Your payment failed for the ${community.name} community`;
  const preheader = `${charge.failure_message}`;

  const amount = formatNumbersToDollars(charge.amount);

  try {
    return sendEmail({
      TemplateId: COMMUNITY_PAYMENT_FAILED_TEMPLATE,
      To: to,
      Tag: SEND_COMMUNITY_PAYMENT_FAILED_EMAIL,
      TemplateModel: {
        subject,
        preheader,
        data: {
          amount: amount,
          source: {
            brand: charge.source.brand,
            exp_month: charge.source.exp_month,
            exp_year: charge.source.exp_year,
            last4: charge.source.last4,
          },
          community,
        },
      },
    });
  } catch (err) {
    console.log(err);
    Raven.captureException(err);
  }
};
