// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import { DEFAULT_USER_COMMUNITY_PERMISSIONS } from '../../models/usersCommunities';

export default async (
  { id }: DBCommunity,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  const defaultPermissions = {
    ...DEFAULT_USER_COMMUNITY_PERMISSIONS,
    userId: null,
    communityId: null,
  };

  if (!id || !user) return defaultPermissions;

  const permissions = await loaders.userPermissionsInCommunity.load([
    user.id,
    id,
  ]);

  const fallbackPermissions = {
    ...defaultPermissions,
    userId: user.id,
    communityId: id,
    lastSeen: null,
  };

  return permissions || fallbackPermissions;
};
