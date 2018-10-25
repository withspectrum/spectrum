// @flow
import {
  getCommunities,
  getCommunitiesBySlug,
  getCommunitiesChannelCounts,
  getCommunitiesOnlineMemberCounts,
  getCommunitiesMemberCounts,
} from '../models/community';
import { getCommunitiesSettings } from '../models/communitySettings';
import createLoader from './create-loader';

export const __createCommunityLoader = createLoader(communities =>
  getCommunities(communities)
);

export const __createCommunityBySlugLoader = createLoader(
  communities => getCommunitiesBySlug(communities),
  'slug'
);

export const __createCommunityMemberCountLoader = createLoader(
  communityIds => getCommunitiesMemberCounts(communityIds),
  'group'
);

export const __createCommunityChannelCountLoader = createLoader(
  communityIds => getCommunitiesChannelCounts(communityIds),
  'group'
);

export const __createCommunityOnlineMemberCountLoader = createLoader(
  communityIds => getCommunitiesOnlineMemberCounts(communityIds),
  'group'
);

export const __createCommunitySettingsLoader = createLoader(
  communityIds => getCommunitiesSettings(communityIds),
  key => key.communityId
);

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
