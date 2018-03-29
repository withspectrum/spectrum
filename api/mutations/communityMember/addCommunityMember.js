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
  input: {
    communityId: string,
  },
};

export default async (_: any, { input }: Input, { user }: GraphQLContext) => {
  const currentUser = user;
  const { communityId } = input;

  if (!currentUser) {
    return new UserError('You must be signed in to join this community.');
  }

  const [permissions, community] = await Promise.all([
    checkUserPermissionsInCommunity(communityId, currentUser.id),
    getCommunityById(communityId),
  ]);

  if (!community) {
    return new UserError("We couldn't find that community.");
  }

  // if no permissions exist, join them to the community!
  if (!permissions || permissions.length === 0) {
    return await Promise.all([
      createMemberInCommunity(communityId, currentUser.id),
      createMemberInDefaultChannels(communityId, currentUser.id),
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
