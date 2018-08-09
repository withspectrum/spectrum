// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getCommunityById } from '../../models/community';
import { getUserById } from '../../models/user';
import {
  sendAddedModeratorNotificationQueue,
  sendAddedModeratorEmailQueue,
} from 'shared/bull/queues';
import {
  makeMemberModeratorInCommunity,
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
      event: events.USER_ADDED_MODERATOR_IN_COMMUNITY_FAILED,
      context: { communityId },
      properties: {
        reason: 'no permission',
      },
    });

    return new UserError(
      'You must own or moderate this community to manage moderators.'
    );
  }

  const [userToEvaluatePermissions, community, recipient] = await Promise.all([
    checkUserPermissionsInCommunity(communityId, userToEvaluateId),
    getCommunityById(communityId),
    getUserById(userToEvaluateId),
  ]);

  if (!community) {
    trackQueue.add({
      userId: user.id,
      event: events.USER_ADDED_MODERATOR_IN_COMMUNITY_FAILED,
      context: { communityId },
      properties: {
        reason: 'no community',
      },
    });

    return new UserError("We couldn't find that community.");
  }

  const { stripeCustomerId } = community;
  if (!stripeCustomerId) {
    trackQueue.add({
      userId: user.id,
      event: events.USER_ADDED_MODERATOR_IN_COMMUNITY_FAILED,
      context: { communityId },
      properties: {
        reason: 'no payment method',
      },
    });

    return new UserError(
      'You must have a valid payment method for this community to add new moderators'
    );
  }

  if (!userToEvaluatePermissions || userToEvaluatePermissions.length === 0) {
    trackQueue.add({
      userId: user.id,
      event: events.USER_ADDED_MODERATOR_IN_COMMUNITY_FAILED,
      context: { communityId },
      properties: {
        reason: 'user not member',
      },
    });

    return new UserError(
      'This person must be a member of the community before becoming a moderator.'
    );
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
    trackQueue.add({
      userId: user.id,
      event: events.USER_ADDED_MODERATOR_IN_COMMUNITY_FAILED,
      context: { communityId },
      properties: {
        reason: 'user not member or is blocked',
      },
    });

    return new UserError(
      'This person must be a member of the community before becoming a moderator.'
    );
  }

  if (userToEvaluatePermission.isModerator) {
    trackQueue.add({
      userId: user.id,
      event: events.USER_ADDED_MODERATOR_IN_COMMUNITY_FAILED,
      context: { communityId },
      properties: {
        reason: 'already moderator',
      },
    });

    return new UserError(
      'This person is already a moderator in your community.'
    );
  }

  // all checks pass
  if (currentUserPermission.isOwner || currentUserPermission.isModerator) {
    return await makeMemberModeratorInCommunity(communityId, userToEvaluateId)
      .then(a => {
        sendAddedModeratorNotificationQueue.add({
          communityId: communityId,
          moderatorId: userToEvaluateId,
          userId: currentUser.id,
        });
        if (recipient.email) {
          sendAddedModeratorEmailQueue.add({
            recipient: { email: recipient.email },
            community,
          });
        }
        return a;
      })
      .then(result => {
        trackQueue.add({
          userId: user.id,
          event: events.USER_ADDED_MODERATOR_IN_COMMUNITY,
          context: { communityId },
        });

        return result;
      })
      .catch(err => {
        trackQueue.add({
          userId: user.id,
          event: events.USER_ADDED_MODERATOR_IN_COMMUNITY_FAILED,
          context: { communityId },
          properties: {
            reason: 'unknown error',
            error: err.message,
          },
        });

        return new UserError(err);
      });
  }
});
