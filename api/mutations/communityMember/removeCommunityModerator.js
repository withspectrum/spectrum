// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getCommunityById } from '../../models/community';
import {
  removeModeratorInCommunity,
  checkUserPermissionsInCommunity,
} from '../../models/usersCommunities';
import { removeModeratorInChannel } from '../../models/usersChannels';
import { getChannelsByUserAndCommunity } from '../../models/channel';
import {
  isAuthedResolver as requireAuth,
  canModerateCommunity,
} from '../../utils/permissions';

type Input = {
  input: {
    userId: string,
    communityId: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { communityId, userId: userToEvaluateId } = args.input;
  const { user, loaders } = ctx;

  if (!(await canModerateCommunity(user.id, communityId, loaders))) {
    return new UserError('You must own this community to manage moderators.');
  }

  const [userToEvaluatePermissions, community] = await Promise.all([
    checkUserPermissionsInCommunity(communityId, userToEvaluateId),
    getCommunityById(communityId),
  ]);

  if (!community) {
    return new UserError("We couldn't find that community.");
  }

  if (!userToEvaluatePermissions || userToEvaluatePermissions === 0) {
    return new UserError('This person is not a member of the community.');
  }

  const userToEvaluatePermission = userToEvaluatePermissions[0];

  // it's possible for a member to be moving from blocked -> moderator
  // in this situation, they are isMember: false, but they are technically a
  // member of the community - just blocked. By checking to ensure if isMember
  // and isBlocked are both false, we ensure that the user is not in any way
  // in a relationship with the community
  if (
    !userToEvaluatePermission.isMember &&
    !userToEvaluatePermission.isBlocked
  ) {
    return new UserError('This person is not a member of your community.');
  }

  if (!userToEvaluatePermission.isModerator) {
    return new UserError('This person is not a moderator in your community.');
  }

  // remove as moderator in community and all channels, this should be expected UX
  const allChannelsInCommunity = await getChannelsByUserAndCommunity(
    communityId,
    userToEvaluateId
  );

  const removeChannelModeratorPromises = allChannelsInCommunity.map(
    channelId => {
      return removeModeratorInChannel(channelId, userToEvaluateId);
    }
  );

  return await Promise.all([
    removeModeratorInCommunity(communityId, userToEvaluateId),
    ...removeChannelModeratorPromises,
  ])
    .then(([newPermissions]) => {
      return newPermissions;
    })
    .catch(err => {
      return new UserError(err);
    });
});
