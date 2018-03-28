// @flow
import type { DBUsersCommunities } from 'shared/types';

export default ({ isModerator, isOwner, isBlocked }: DBUsersCommunities) => {
  const roles = [];
  if (isModerator) roles.push('moderator');
  if (isOwner) roles.push('admin');
  if (isBlocked) roles.push('blocked');
  return roles;
};
