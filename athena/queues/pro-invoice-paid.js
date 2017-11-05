const debug = require('debug')('athena:queue:pro-invoice-paid-notification');
import Raven from '../../shared/raven';
import createQueue from '../../shared/bull/create-queue';
import { SEND_PRO_INVOICE_RECEIPT_EMAIL } from './constants';
import { convertTimestampToDate } from '../utils/timestamp-to-date';
import { getUsers } from '../models/user';
import { getRecurringPaymentFromInvoice } from '../models/recurringPayment';

const sendProInvoiceReceiptQueue = createQueue(SEND_PRO_INVOICE_RECEIPT_EMAIL);

export default async job => {
  const { invoice } = job.data;

  debug(`new job for pro invoice id ${invoice.id}`);

  debug('processing pro invoice');
  const recurringPayment = await getRecurringPaymentFromInvoice(invoice);
  const userToEvaluate = await getUsers([recurringPayment.userId]);

  if (!recurringPayment || !userToEvaluate) return;
  debug('found a recurring payment and user to send the receipt to');

  const email = userToEvaluate[0].email;
  // if the user doesn't have an email address on file, escape
  if (!email) return;
  debug('user has a valid email address to receive the receipt');

  // convert amount into readable currency amount
  const amount = `$${(invoice.amount / 100)
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`;
  const paidAt = convertTimestampToDate(invoice.paidAt * 1000);
  const brand = invoice.sourceBrand;
  const last4 = invoice.sourceLast4;

  debug('sending pro invoice receipt email');

  return sendProInvoiceReceiptQueue
    .add(
      {
        to: email,
        invoice: {
          plan: invoice.planName,
          amount,
          paidAt,
          brand,
          last4,
          planName: invoice.planName,
          id: invoice.id,
        },
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
      }
    )
    .catch(err => {
      Raven.captureException(err);
      console.log(err);
    });
};
