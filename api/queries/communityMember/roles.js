// @flow
import type { DBUsersCommunities } from 'shared/types';
import type { GraphQLContext } from '../../index';

export default async (
  { isModerator, isOwner, isBlocked, userId }: DBUsersCommunities,
  _: any,
  { loaders }: GraphQLContext
) => {
  const user = await loaders.user.load(userId);
  const roles = [];
  if (isModerator) roles.push('moderator');
  if (isOwner) roles.push('admin');
  if (isBlocked) roles.push('blocked');
  if (user.isContributor) roles.push('oss');
  return roles;
};
