// @flow
import {
  getCommunities,
  getCommunitiesBySlug,
  getCommunitiesMemberCounts,
  getCommunitiesChannelCounts,
} from '../models/community';
import { getCommunitiesRecurringPayments } from '../models/recurringPayment';
import createLoader from './create-loader';

const FIVE_MINUTES = 300000;
const THIRTY_MINUTES = 1800000;

export const __createCommunityRecurringPaymentsLoader = createLoader(
  communities => getCommunitiesRecurringPayments(communities),
  { getKeyFromResult: 'group' }
);

export const __createCommunityLoader = createLoader(communities =>
  getCommunities(communities)
);

export const __createCommunityBySlugLoader = createLoader(
  communities => getCommunitiesBySlug(communities),
  { getKeyFromResult: 'slug' }
);

export const __createCommunityMemberCountLoader = createLoader(
  communityIds => getCommunitiesMemberCounts(communityIds),
  { getKeyFromResult: 'group', cacheExpiryTime: THIRTY_MINUTES }
);

export const __createCommunityChannelCountLoader = createLoader(
  communityIds => getCommunitiesChannelCounts(communityIds),
  { getKeyFromResult: 'group', cacheExpiryTime: THIRTY_MINUTES }
);

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
