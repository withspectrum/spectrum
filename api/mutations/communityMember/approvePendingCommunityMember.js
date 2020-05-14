// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getCommunityById } from '../../models/community';
import { createMemberInDefaultChannels } from '../../models/usersChannels';
import {
  approvePendingMemberInCommunity,
  checkUserPermissionsInCommunity,
} from '../../models/usersCommunities';
import {
  isAuthedResolver as requireAuth,
  canModerateCommunity,
} from '../../utils/permissions';
import { sendPrivateCommunityRequestApprovedQueue } from 'shared/bull/queues';

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

  if (!userToEvaluatePermissions || userToEvaluatePermissions === 0) {
    return new UserError(
      'This person is not requesting to join your community.'
    );
  }

  const userToEvaluatePermission = userToEvaluatePermissions[0];

  if (!userToEvaluatePermission.isPending) {
    return new UserError(
      'This person is not requesting to join your community.'
    );
  }

  if (userToEvaluatePermission.isBlocked) {
    return new UserError('This person is already blocked in your community.');
  }

  return await Promise.all([
    approvePendingMemberInCommunity(communityId, userToEvaluateId),
    createMemberInDefaultChannels(communityId, userToEvaluateId),
  ])
    .then(([newPermissions]) => {
      sendPrivateCommunityRequestApprovedQueue.add({
        userId: userToEvaluateId,
        communityId,
        moderatorId: user.id,
      });

      return newPermissions;
    })
    .catch(err => {
      return new UserError(err);
    });
});
