// @flow
const debug = require('debug')(
  'hermes:queue:send-community-invoice-receipt-email'
);
import sendEmail from '../send-email';
import processQueue from '../../shared/bull/process-queue';
import {
  SEND_COMMUNITY_INVOICE_RECEIPT_EMAIL,
  COMMUNITY_INVOICE_RECEIPT_TEMPLATE,
} from './constants';

export default () =>
  processQueue(SEND_COMMUNITY_INVOICE_RECEIPT_EMAIL, job => {
    debug(`\nnew job: ${job.id}`);
    const { invoice, community, to } = job.data;

    if (!to) {
      debug(`user#${user.id} does not have an email, aborting`);
      return Promise.resolve();
    }

    try {
      return sendEmail({
        TemplateId: COMMUNITY_INVOICE_RECEIPT_TEMPLATE,
        To: to,
        TemplateModel: {
          invoice,
          community,
        },
      });
    } catch (err) {
      console.log(err);
    }
  });
