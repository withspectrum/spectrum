// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getCommunityById } from '../../models/community';
import { blockUserInChannel } from '../../models/usersChannels';
import { getChannelsByCommunity } from '../../models/channel';
import {
  blockUserInCommunity,
  checkUserPermissionsInCommunity,
} from '../../models/usersCommunities';
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
  const { user, loaders } = ctx;
  const { communityId, userId: userToEvaluateId } = args.input;

  if (!(await canModerateCommunity(user.id, communityId, loaders))) {
    return new UserError(
      'You must own or moderate this community to manage members.'
    );
  }

  const [userToEvaluatePermissions, community] = await Promise.all([
    checkUserPermissionsInCommunity(communityId, userToEvaluateId),
    getCommunityById(communityId),
  ]);

  if (!community) {
    return new UserError("We couldn't find that community.");
  }

  if (!userToEvaluatePermissions || userToEvaluatePermissions.length === 0) {
    return new UserError('This person is not a member of your community.');
  }

  const userToEvaluatePermission = userToEvaluatePermissions[0];

  if (!userToEvaluatePermission.isMember) {
    return new UserError('This person is not a member of your community.');
  }

  if (userToEvaluatePermission.isBlocked) {
    return new UserError('This person is already blocked in your community.');
  }

  if (userToEvaluatePermission.isOwner) {
    return new UserError('The owner of the community cannot be blocked.');
  }

  const channels = await getChannelsByCommunity(community.id);
  const channelIds = channels.map(c => c.id);
  const blockInChannelPromises = channelIds.map(async channelId => {
    return await blockUserInChannel(channelId, userToEvaluateId);
  });

  return await Promise.all([
    blockUserInCommunity(communityId, userToEvaluateId),
    ...blockInChannelPromises,
  ])
    .then(([newPermissions]) => {
      return newPermissions;
    })
    .catch(err => {
      return new UserError(err);
    });
});
