// @flow
const debug = require('debug')('pluto:webhooks:invoiceEvent');
import type { CleanInvoice, RawInvoice } from 'shared/stripe/types/invoice';
import type { Job, StripeWebhookEventJobData } from 'shared/bull/types';
import { recordExists, insertRecord, replaceRecord } from '../models/utils';

const cleanInvoice = (invoice: RawInvoice): CleanInvoice => {
  debug(`Cleaning invoice ${invoice.id}`);
  return Object.assign({}, invoice, {
    customerId: invoice.customer,
    invoiceId: invoice.id,
  });
};

const saveInvoice = async (invoice: CleanInvoice): Promise<CleanInvoice> => {
  debug(`Saving invoice ${invoice.id}`);
  const table = 'stripeInvoices';
  const key = invoice.invoiceId;
  const filter = { customerId: invoice.customerId };
  const exists = await recordExists(table, key, filter);

  if (exists) {
    debug(`Invoice record exists, replacing ${invoice.id}`);
    return await replaceRecord(table, key, invoice, filter);
  } else {
    debug(`Invoice does not exist, inserting ${invoice.id}`);
    return await insertRecord(table, invoice);
  }
};

const InvoiceEventFactory = {
  clean: (raw: RawInvoice): CleanInvoice => cleanInvoice(raw),
  save: async (clean: CleanInvoice): Promise<CleanInvoice> =>
    await saveInvoice(clean),
};

export const InvoiceEventHandler = {};

const { clean, save } = InvoiceEventFactory;

InvoiceEventHandler.handle = async (raw: RawInvoice): Promise<CleanInvoice> => {
  debug(`Handling invoice ${raw.id}`);
  const cleaned = clean(raw);
  const saved = await save(cleaned);
  return saved.catch(err => {
    console.log(`Error handling invoice event ${raw.id}`);
    throw new Error(err);
  });
};

export default async (job: Job<StripeWebhookEventJobData>) => {
  const { data: { record } } = job;
  debug(`New job for ${record.id}`);
  return await InvoiceEventHandler.handle(record);
};
