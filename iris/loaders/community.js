// @flow
import {
  getCommunities,
  getCommunitiesBySlug,
  getCommunitiesMemberCounts,
  getCommunitiesChannelCounts,
} from '../models/community';
import { getCommunitiesRecurringPayments } from '../models/recurringPayment';
import createLoader from './create-loader';

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
  { getKeyFromResult: 'group' }
);

export const __createCommunityChannelCountLoader = createLoader(
  communityIds => getCommunitiesChannelCounts(communityIds),
  { getKeyFromResult: 'group' }
);

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
