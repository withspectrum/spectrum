// @flow
import { COMMUNITY_UPSELL_THRESHOLD } from '../constants';
import { getUsersCommunityIds } from '../../models/usersCommunities';
import type { DBCommunity } from 'shared/types';
import { signCommunity } from 'shared/imgix';

export const getUpsellCommunities = async (
  userId: string,
  topCommunities: Array<DBCommunity>
): Promise<?Array<DBCommunity>> => {
  // see what communities the user is in. if they are a member of less than 3 communities, we will upsell communities to join in the digest
  const usersCommunityIds = await getUsersCommunityIds(userId);

  // if the user has joined less than the threshold number of communities, take the top communities on Spectrum, remove any that the user has already joined, and slice the first 3 to send into the email template
  if (usersCommunityIds.length <= COMMUNITY_UPSELL_THRESHOLD) {
    return topCommunities
      .filter(community => usersCommunityIds.indexOf(community.id) <= -1)
      .slice(0, 3)
      .map(community => signCommunity(community));
  }

  return null;
};
