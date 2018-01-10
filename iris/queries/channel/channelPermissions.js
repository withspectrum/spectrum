// @flow
import type { GraphQLContext } from '../../';

export default (args, _: any, { user, loaders }: GraphQLContext) => {
  const channelId = args.id || args.channelId;
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
