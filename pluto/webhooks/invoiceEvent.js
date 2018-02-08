// @flow
import type { InvoiceEvent } from '../types/invoiceEvent';
import type { CleanInvoice, RawInvoice } from '../types/invoice';
import { recordExists, insertRecord, replaceRecord } from '../models/utils';

const cleanInvoice = (invoice: RawInvoice): CleanInvoice => {
  return Object.assign({}, invoice, {
    customerId: invoice.customer,
    invoiceId: invoice.id,
  });
};

const saveInvoice = async (invoice: CleanInvoice): Promise<CleanInvoice> => {
  const table = 'stripeInvoices';
  const key = invoice.invoiceId;
  const filter = { customerId: invoice.customerId };

  if (await recordExists(table, key, filter)) {
    return replaceRecord(table, key, invoice, filter);
  } else {
    return insertRecord(table, invoice);
  }
};

const InvoiceEventFactory = {
  clean: (raw: RawInvoice): CleanInvoice => cleanInvoice(raw),
  save: async (clean: CleanInvoice): Promise<CleanInvoice> =>
    await saveInvoice(clean),
};

export const InvoiceEventHandler = {};
const { clean, save } = InvoiceEventFactory;
InvoiceEventHandler.handle = async (
  event: InvoiceEvent
): Promise<CleanInvoice> => await save(clean(event.data.object));
