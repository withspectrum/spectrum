// @flow
import type { GraphQLContext } from '../../';
import type { DBChannel } from 'shared/types';

export default (root: DBChannel, _: any, { user, loaders }: GraphQLContext) => {
  const channelId = root.id;
  if (!channelId || !user) {
    return {
      isOwner: false,
      isMember: false,
      isModerator: false,
      isBlocked: false,
      isPending: false,
      receiveNotifications: false,
    };
  }
  return loaders.userPermissionsInChannel
    .load([user.id, channelId])
    .then(res => {
      if (!res) {
        return {
          isOwner: false,
          isMember: false,
          isModerator: false,
          isBlocked: false,
          isPending: false,
          receiveNotifications: false,
        };
      }
      return res;
    });
};
