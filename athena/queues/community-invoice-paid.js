// @flow
const debug = require('debug')(
  'athena:queue:community-invoice-paid-notification'
);
import createQueue from '../../shared/bull/create-queue';
import { SEND_COMMUNITY_INVOICE_RECEIPT_EMAIL } from './constants';
import { convertTimestampToDate } from '../utils/timestamp-to-date';
import { getCommunityById } from '../models/community';
import { getUsers } from '../models/user';
import { getOwnersInCommunity } from '../models/usersCommunities';

const sendCommunityInvoiceReceiptQueue = createQueue(
  SEND_COMMUNITY_INVOICE_RECEIPT_EMAIL
);

export default job => {
  const { invoice } = job.data;

  debug(`new job for community invoice id ${invoice.id}`);

  const processCommunityInvoice = async () => {
    debug('processing community invoice');
    const community = await getCommunityById(invoice.communityId);
    const ownersIds = await getOwnersInCommunity(invoice.communityId);
    const owners = await getUsers(ownersIds);

    if (!owners || !community) return;
    debug('owners and community found');

    const sendOwnerEmails = owners.map(owner => {
      // converst 5000 => $50.00
      debug('sending an owner email');
      const amount = `$${(invoice.amount / 100)
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`;
      const paidAt = convertTimestampToDate(invoice.paidAt * 1000);
      const brand = invoice.sourceBrand;
      const last4 = invoice.sourceLast4;
      const { id } = invoice;

      return sendCommunityInvoiceReceiptQueue.add({
        to: owner.email,
        community: {
          name: community.name,
        },
        invoice: {
          amount,
          paidAt,
          brand,
          last4,
          id,
        },
      });
    });
    const send = await Promise.all(sendOwnerEmails);
    return { send };
  };

  return processCommunityInvoice()
    .then(() => job.remove())
    .catch(err => new Error(err));
};
