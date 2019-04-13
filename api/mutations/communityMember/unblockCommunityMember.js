// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getCommunityById } from '../../models/community';
import { approveBlockedUserInChannel } from '../../models/usersChannels';
import { getChannelsByCommunity } from '../../models/channel';
import {
  unblockUserInCommunity,
  checkUserPermissionsInCommunity,
} from '../../models/usersCommunities';
import {
  isAuthedResolver as requireAuth,
  canModerateCommunity,
} from '../../utils/permissions';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

type Input = {
  input: {
    userId: string,
    communityId: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { user, loaders } = ctx;
  const { communityId, userId: userToEvaluateId } = args.input;

  if (!await canModerateCommunity(user.id, communityId, loaders)) {
    trackQueue.add({
      userId: user.id,
      event: events.USER_UNBLOCKED_MEMBER_IN_COMMUNITY_FAILED,
      context: { communityId },
      properties: {
        reason: 'no permission',
      },
    });

    return new UserError(
      'You must own or moderate this community to manage members.'
    );
  }

  const [userToEvaluatePermissions, community] = await Promise.all([
    checkUserPermissionsInCommunity(communityId, userToEvaluateId),
    getCommunityById(communityId),
  ]);

  if (!community) {
    trackQueue.add({
      userId: user.id,
      event: events.USER_UNBLOCKED_MEMBER_IN_COMMUNITY_FAILED,
      context: { communityId },
      properties: {
        reason: 'no community',
      },
    });

    return new UserError("We couldn't find that community.");
  }

  if (!userToEvaluatePermissions || userToEvaluatePermissions === 0) {
    trackQueue.add({
      userId: user.id,
      event: events.USER_UNBLOCKED_MEMBER_IN_COMMUNITY_FAILED,
      context: { communityId },
      properties: {
        reason: 'user not member of community',
      },
    });

    return new UserError('This person is not a member of your community.');
  }

  const userToEvaluatePermission = userToEvaluatePermissions[0];

  if (!userToEvaluatePermission.isBlocked) {
    trackQueue.add({
      userId: user.id,
      event: events.USER_UNBLOCKED_MEMBER_IN_COMMUNITY_FAILED,
      context: { communityId },
      properties: {
        reason: 'user not blocked',
      },
    });

    return new UserError('This person is not blocked in your community.');
  }

  const channels = await getChannelsByCommunity(community.id);
  const defaultChannelIds = channels.filter(c => c.isDefault).map(c => c.id);
  const unblockInDefaultChannelPromises = defaultChannelIds.map(
    async channelId => {
      trackQueue.add({
        userId: user.id,
        event: events.USER_UNBLOCKED_MEMBER_IN_CHANNEL,
        context: { channelId },
      });

      return await approveBlockedUserInChannel(channelId, userToEvaluateId);
    }
  );

  return await Promise.all([
    unblockUserInCommunity(communityId, userToEvaluateId),
    ...unblockInDefaultChannelPromises,
  ])
    .then(([newPermissions]) => {
      trackQueue.add({
        userId: user.id,
        event: events.USER_UNBLOCKED_MEMBER_IN_COMMUNITY,
        context: { communityId },
      });

      return newPermissions;
    })
    .catch(err => {
      trackQueue.add({
        userId: user.id,
        event: events.USER_UNBLOCKED_MEMBER_IN_COMMUNITY_FAILED,
        context: { communityId },
        properties: {
          reason: 'unknown error',
          error: err.message,
        },
      });

      return new UserError(err);
    });
});
