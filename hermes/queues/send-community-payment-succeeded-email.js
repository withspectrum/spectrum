// @flow
const debug = require('debug')(
  'hermes:queue:send-community-payment-succeeded-email'
);
import sendEmail from '../send-email';
import {
  COMMUNITY_PAYMENT_SUCCEEDED_TEMPLATE,
  SEND_COMMUNITY_PAYMENT_SUCCEEDED_EMAIL,
} from './constants';
import type { Job, PaymentSucceededEmailJobData } from 'shared/bull/types';
import Raven from 'shared/raven';
import { formatNumbersToDollars } from '../utils/number-to-dollars';
import formatDate from '../utils/format-date';
import { COMMUNITY_ANALYTICS } from 'pluto/queues/constants';

export default (job: Job<PaymentSucceededEmailJobData>) => {
  debug(`\nnew job: ${job.id}`);
  const { to, invoice, community, source } = job.data;

  if (!to) {
    debug('community does not have an administrator email, aborting');
    // $FlowIssue
    return Promise.resolve();
  }

  const { month, year } = formatDate();

  const subject = `Receipt for the ${
    community.name
  } community · ${month}, ${year}`;
  const preheader = 'Thank you for building your community with Spectrum';

  const amount = formatNumbersToDollars(invoice.total);

  const lineItems = invoice.lines.data
    .map(item => {
      if (!item) return null;
      if (item.plan.amount === 0) return null;

      let quantity;
      if (item.plan.id === COMMUNITY_ANALYTICS) {
        quantity = null;
      } else if (item.plan.id === 'priority-support') {
        quantity = null;
      } else {
        quantity = item.quantity;
      }

      return {
        amount:
          item.amount < 0
            ? `-$${formatNumbersToDollars(Math.abs(item.amount))}`
            : `$${formatNumbersToDollars(item.amount)}`,
        description: item.description,
        quantity: quantity,
      };
    })
    .filter(Boolean);

  if (lineItems.length === 0) {
    debug('No line items on this invoice');
    return;
  }

  let viaSource = null;
  if (source && invoice.total > 0) {
    debug('Creating string for default source');
    viaSource = `Paid with ${source.card.brand} ending in ${source.card.last4}`;
  }

  const introCopy =
    invoice.total < 0
      ? `Thanks to our Fair Price Promise, we've added a $${formatNumbersToDollars(
          Math.abs(invoice.total)
        )} credit to future invoices for the ${community.name} community.`
      : invoice.total === 0
        ? `Thanks to our Fair Price Promise, this month's invoice for the ${
            community.name
          } community was covered by existing credit.`
        : `Your recent payment for $${formatNumbersToDollars(
            invoice.total
          )} for the ${
            community.name
          } community on Spectrum was received. Thank you for building your community on Spectrum!`;

  try {
    debug('Sending email...');
    return sendEmail({
      TemplateId: COMMUNITY_PAYMENT_SUCCEEDED_TEMPLATE,
      To: to,
      Tag: SEND_COMMUNITY_PAYMENT_SUCCEEDED_EMAIL,
      TemplateModel: {
        subject,
        preheader,
        data: {
          introCopy: introCopy,
          showButton: invoice.total > 0,
          amount:
            invoice.total < 0
              ? `-$${formatNumbersToDollars(Math.abs(invoice.total))} credit`
              : `$${formatNumbersToDollars(invoice.total)}`,
          lineItems,
          community,
          invoice: {
            id: invoice.id,
          },
          viaSource,
        },
      },
    });
  } catch (err) {
    console.error(err);
    Raven.captureException(err);
  }
};
