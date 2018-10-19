// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getCommunityById } from '../../models/community';
import {
  removePendingMemberInCommunity,
  checkUserPermissionsInCommunity,
} from '../../models/usersCommunities';
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

  // if no permissions exist, the user wasn't pending to begin with
  if (!permissions || permissions.length === 0) {
    trackQueue.add({
      userId: user.id,
      event: events.USER_CANCELED_REQUEST_TO_JOIN_COMMUNITY_FAILED,
      context: { communityId },
      properties: {
        reason: 'not pending',
      },
    });

    return community;
  }

  if (!community) {
    trackQueue.add({
      userId: user.id,
      event: events.USER_CANCELED_REQUEST_TO_JOIN_COMMUNITY_FAILED,
      context: { communityId },
      properties: {
        reason: 'no community',
      },
    });

    return new UserError("We couldn't find that community.");
  }

  return await removePendingMemberInCommunity(communityId, user.id).then(
    () => community
  );
});
