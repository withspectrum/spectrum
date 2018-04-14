const debug = require('debug')('hermes:queue:send-pro-invoice-receipt-email');
import sendEmail from '../send-email';
import {
  PRO_INVOICE_RECEIPT_TEMPLATE,
  SEND_PRO_INVOICE_RECEIPT_EMAIL,
} from './constants';

export default job => {
  debug(`\nnew job: ${job.id}`);
  const { invoice, to } = job.data;

  if (!to) {
    debug(`user#${to} does not have an email, aborting`);
    return Promise.resolve();
  }

  try {
    return sendEmail({
      TemplateId: PRO_INVOICE_RECEIPT_TEMPLATE,
      To: to,
      Tag: SEND_PRO_INVOICE_RECEIPT_EMAIL,
      TemplateModel: {
        invoice,
      },
    });
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
