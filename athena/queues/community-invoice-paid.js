// @flow
const debug = require('debug')(
  'athena:queue:community-invoice-paid-notification'
);
import Raven from '../../shared/raven';
import createQueue from '../../shared/bull/create-queue';
import { SEND_COMMUNITY_INVOICE_RECEIPT_EMAIL } from './constants';
import { convertTimestampToDate } from '../utils/timestamp-to-date';
import { getCommunityById } from '../models/community';
import { getUsers } from '../models/user';
import { getOwnersInCommunity } from '../models/usersCommunities';

const sendCommunityInvoiceReceiptQueue = createQueue(
  SEND_COMMUNITY_INVOICE_RECEIPT_EMAIL
);

type JobData = {
  data: {
    invoice: {
      id: string,
      amount: number,
      paidAt: number,
      sourceBrand: string,
      sourceLast4: string,
      planName: string,
      communityId: string,
      quantity: number,
    },
  },
};

export default async (job: JobData) => {
  const { invoice } = job.data;

  debug('processing community invoice');
  const community = await getCommunityById(invoice.communityId);
  const ownersIds = await getOwnersInCommunity(invoice.communityId);
  const owners = await getUsers(ownersIds);

  if (!owners || !community)
    return new Error(
      'No owners or community found for an invoice being generated'
    );
  debug('owners and community found');

  const sendOwnerEmails = owners.map(owner => {
    // convert 5000 => $50.00
    debug('sending an owner email');
    const amount = `$${(invoice.amount / 100)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`;
    const paidAt = convertTimestampToDate(invoice.paidAt * 1000);
    const brand = invoice.sourceBrand;
    const last4 = invoice.sourceLast4;
    const { id } = invoice;

    const memberCountString = quantity => {
      return `${quantity <= 1 ? '1' : (quantity - 1) * 1000} - ${quantity <= 1
        ? ''
        : `${quantity - 1},`}999 members`;
    };

    return sendCommunityInvoiceReceiptQueue.add(
      {
        to: owner.email,
        community: {
          name: community.name,
        },
        invoice: {
          amount,
          paidAt,
          brand,
          last4,
          planName: invoice.planName,
          memberCount: memberCountString(invoice.quantity),
          id,
        },
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
      }
    );
  });

  return Promise.all(sendOwnerEmails).catch(err => {
    Raven.captureException(err);
    console.log(err);
  });
};
