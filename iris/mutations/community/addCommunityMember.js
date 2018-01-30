// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getCommunityById } from '../../models/community';
import {
  createMemberInCommunity,
  checkUserPermissionsInCommunity,
} from '../../models/usersCommunities';
import { createMemberInDefaultChannels } from '../../models/usersChannels';

type Input = {
  communityId: string,
};

export default async (_: any, input: Input, { user }: GraphQLContext) => {
  const currentUser = user;
  const { communityId } = input;

  if (!currentUser) {
    return new UserError('You must be signed in to join this community.');
  }

  const [permissions, community] = await Promise.all([
    checkUserPermissionsInCommunity(communityId, currentUser.id),
    getCommunityById(communityId),
  ]);

  // if no permissions exist, join them to the community!
  if (!permissions) {
    return await Promise.all([
      createMemberInCommunity(communityId, currentUser.id),
      createMemberInDefaultChannels(communityId, currentUser.id),
    ])
      // return the community to fulfill the resolver
      .then(() => community);
  }

  if (permissions.isBlocked) {
    return new UserError("You aren't able to join this community.");
  }

  if (permissions.isOwner) {
    return new UserError("You're already the owner of this community.");
  }

  if (permissions.isModerator) {
    return new UserError("You're already a moderator in this community.");
  }

  if (!community || community.deletedAt) {
    return new UserError("We couldn't find that community.");
  }

  // if the user has previously joined the community, but is not a member,
  // they are trying to re-join the community.
  if (!permissions.isMember) {
    return await Promise.all([
      createMemberInCommunity(communityId, currentUser.id),
      createMemberInDefaultChannels(communityId, currentUser.id),
    ])
      // return the community to fulfill the resolver
      .then(() => community);
  }

  return new UserError(
    "We weren't able to process your request to join this community."
  );
};
