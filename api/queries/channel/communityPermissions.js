// @flow
import type { GraphQLContext } from '../../';
import type { DBChannel } from 'shared/types';

const DEFAULT = {
  isOwner: false,
  isMember: false,
  isModerator: false,
  isBlocked: false,
  isPending: false,
  receiveNotifications: false,
};

export default (root: DBChannel, _: any, { user, loaders }: GraphQLContext) => {
  const communityId = root.id || root.communityId;
  if (!communityId || !user) {
    return DEFAULT;
  }
  return loaders.userPermissionsInCommunity
    .load([user.id, communityId])
    .then(res => res || DEFAULT);
};
