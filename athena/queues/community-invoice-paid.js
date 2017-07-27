// @flow
const debug = require('debug')(
  'athena:queue:community-invoice-paid-notification'
);
import processQueue from '../../shared/bull/process-queue';
import createQueue from '../../shared/bull/create-queue';
import {
  COMMUNITY_INVOICE_PAID_NOTIFICATION,
  SEND_COMMUNITY_INVOICE_RECEIPT_EMAIL,
} from './constants';
import { convertTimestampToDate } from '../utils/timestamp-to-date';
import { getCommunityById } from '../models/community';
import { getUsers } from '../models/user';
import { getOwnersInCommunity } from '../models/usersCommunities';

const sendCommunityInvoiceReceiptQueue = createQueue(
  SEND_COMMUNITY_INVOICE_RECEIPT_EMAIL
);

export default () =>
  processQueue(COMMUNITY_INVOICE_PAID_NOTIFICATION, job => {
    const { invoice } = job.data;

    debug(`new job for invoice id ${invoice.id}`);

    return Promise.all([
      getCommunityById(invoice.communityId),
      getOwnersInCommunity(invoice.communityId),
    ])
      .then(([community, ownerIds]) =>
        Promise.all([community, getUsers(ownerIds)])
      )
      .then(([community, owners]) => {
        // send an email to each owner in the community
        return Promise.all(
          owners.map(user => {
            // converst 5000 => $50.00
            const amount = `$${(invoice.amount / 100)
              .toFixed(2)
              .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`;
            const paidAt = convertTimestampToDate(invoice.paidAt);
            const brand = invoice.stripeData.source.brand;
            const last4 = invoice.stripeData.source.last4;
            const note = invoice.note;
            const { id } = invoice;

            return sendCommunityInvoiceReceiptQueue.add({
              to: user.email,
              community: {
                name: community.name,
              },
              invoice: {
                amount,
                paidAt,
                brand,
                last4,
                note,
                id,
              },
            });
          })
        );
      })
      .then(() => job.remove())
      .catch(err => new Error(err));
  });
