// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getCommunityById } from '../../models/community';
import {
  createMemberInCommunity,
  createPendingMemberInCommunity,
  checkUserPermissionsInCommunity,
} from '../../models/usersCommunities';
import { createMemberInDefaultChannels } from '../../models/usersChannels';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';
import { sendPrivateCommunityRequestQueue } from 'shared/bull/queues';

type Input = {
  input: {
    communityId: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { user } = ctx;
  const { communityId } = args.input;

  const [permissions, community] = await Promise.all([
    checkUserPermissionsInCommunity(communityId, user.id),
    getCommunityById(communityId),
  ]);

  if (!community) {
    return new UserError("We couldn't find that community.");
  }

  // shouldn't happen, but handle this case anyways
  if (!community.isPrivate) {
    if (!permissions || permissions.length === 0) {
      return await Promise.all([
        createMemberInCommunity(communityId, user.id),
        createMemberInDefaultChannels(communityId, user.id),
      ])
        // return the community to fulfill the resolver
        .then(() => community);
    }

    const permission = permissions[0];

    if (permission.isBlocked) {
      return new UserError("You aren't able to join this community.");
    }

    if (permission.isOwner || permission.isModerator || permission.isMember) {
      return new UserError("You're already a member of this community.");
    }

    return await Promise.all([
      createMemberInCommunity(communityId, user.id),
      createMemberInDefaultChannels(communityId, user.id),
    ])
      // return the community to fulfill the resolver
      .then(() => community);
  }

  const permission = permissions[0];

  if (permission && permission.isBlocked) {
    return new UserError("You aren't able to join this community.");
  }

  if (
    permission &&
    (permission.isOwner || permission.isModerator || permissions.isMember)
  ) {
    return new UserError("You're already a member of this community.");
  }

  if (permission && permission.isPending) {
    return new UserError('You have already requested to join this community.');
  }

  sendPrivateCommunityRequestQueue.add({
    userId: user.id,
    communityId,
  });

  return await createPendingMemberInCommunity(communityId, user.id).then(
    () => community
  );
});
