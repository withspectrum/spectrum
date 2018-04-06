const debug = require('debug')(
  'hermes:queue:send-community-invoice-receipt-email'
);
import sendEmail from '../send-email';
import {
  COMMUNITY_INVOICE_RECEIPT_TEMPLATE,
  SEND_COMMUNITY_INVOICE_RECEIPT_EMAIL,
} from './constants';

export default job => {
  debug(`\nnew job: ${job.id}`);
  const { invoice, community, to } = job.data;

  if (!to) {
    debug('user does not have an email, aborting');
    return Promise.resolve();
  }

  try {
    return sendEmail({
      TemplateId: COMMUNITY_INVOICE_RECEIPT_TEMPLATE,
      To: to,
      Tag: SEND_COMMUNITY_INVOICE_RECEIPT_EMAIL,
      TemplateModel: {
        invoice,
        community,
      },
    });
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
