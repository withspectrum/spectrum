// @flow
const debug = require('debug')(
  'athena:queue:community-invoice-paid-notification'
);
import processQueue from '../../shared/bull/process-queue';
import { COMMUNITY_INVOICE_PAID_NOTIFICATION } from './constants';
import { getCommunityById } from '../models/community';
import { getOwnersInCommunity } from '../models/usersCommunities';

export default () =>
  processQueue(COMMUNITY_INVOICE_PAID_NOTIFICATION, job => {
    const { invoice } = job.data;

    debug(`new job for invoice id ${invoice.id}`);

    const promises = Promise.all([
      getCommunityById(invoice.communityId),
      getOwnersInCommunity(invoice.communityId),
    ]);

    return promises()
      .then(([community, owners]) => {})
      .then(() => job.remove())
      .catch(err => new Error(err));
  });
