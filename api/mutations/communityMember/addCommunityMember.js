// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getCommunityById } from '../../models/community';
import {
  createMemberInCommunity,
  checkUserPermissionsInCommunity,
} from '../../models/usersCommunities';
import { createMemberInDefaultChannels } from '../../models/usersChannels';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

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

  // if no permissions exist, join them to the community!
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

  if (permission.isOwner) {
    return new UserError("You're already the owner of this community.");
  }

  if (permission.isModerator) {
    return new UserError("You're already a moderator in this community.");
  }

  if (permission.isMember) {
    return new UserError('You are already a member of this community.');
  }

  // if the user has previously joined the community, but is not a member,
  // they are trying to re-join the community.
  if (!permission.isMember) {
    return await Promise.all([
      createMemberInCommunity(communityId, user.id),
      createMemberInDefaultChannels(communityId, user.id),
    ])
      // return the community to fulfill the resolver
      .then(() => getCommunityById(communityId));
  }

  return new UserError(
    "We weren't able to process your request to join this community."
  );
});
