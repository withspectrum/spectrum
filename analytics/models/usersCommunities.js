// @flow
import type { DBUsersCommunities } from 'shared/types';
import { db } from './db';

const defaultResult = {
  isMember: false,
  isOwner: false,
  isModerator: false,
  isBlocked: false,
  reputation: 0,
};

export const getUserPermissionsInCommunity = (
  userId: string,
  communityId: string
): Promise<DBUsersCommunities> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId' })
    .run()
    .then(results => {
      if (!results || results.length === 0) return defaultResult;
      return results[0];
    });
};
