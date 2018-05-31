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
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

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
    trackQueue.add({
      userId: user.id,
      event: events.USER_JOINED_COMMUNITY_FAILED,
      context: { communityId },
      properties: {
        reason: 'no community',
      },
    });

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
    trackQueue.add({
      userId: user.id,
      event: events.USER_JOINED_COMMUNITY_FAILED,
      context: { communityId },
      properties: {
        reason: 'user blocked',
      },
    });

    return new UserError("You aren't able to join this community.");
  }

  if (permission.isOwner) {
    trackQueue.add({
      userId: user.id,
      event: events.USER_JOINED_COMMUNITY_FAILED,
      context: { communityId },
      properties: {
        reason: 'already owner',
      },
    });

    return new UserError("You're already the owner of this community.");
  }

  if (permission.isModerator) {
    trackQueue.add({
      userId: user.id,
      event: events.USER_JOINED_COMMUNITY_FAILED,
      context: { communityId },
      properties: {
        reason: 'already moderator',
      },
    });

    return new UserError("You're already a moderator in this community.");
  }

  if (permission.isMember) {
    trackQueue.add({
      userId: user.id,
      event: events.USER_JOINED_COMMUNITY_FAILED,
      context: { communityId },
      properties: {
        reason: 'already member',
      },
    });

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
      .then(() => community);
  }

  trackQueue.add({
    userId: user.id,
    event: events.USER_JOINED_COMMUNITY_FAILED,
    context: { communityId },
    properties: {
      reason: 'unknown error',
    },
  });

  return new UserError(
    "We weren't able to process your request to join this community."
  );
});
